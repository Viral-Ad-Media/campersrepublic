"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { auth } from "@/lib/auth";
import { POSTS_TAG } from "@/lib/posts";
import { requireAdmin } from "@/lib/session";

const PostInput = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may only contain a-z, 0-9 and dashes"),
  excerpt: z.string().trim().max(400),
  content: z.string(),
  coverImage: z
    .string()
    .trim()
    .refine((v) => v === "" || v.startsWith("/") || v.startsWith("https://"), "Use a /path or https:// URL"),
  categoryId: z.coerce.number().int().optional(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().trim().max(200),
  seoDescription: z.string().trim().max(400),
});

export type FormState = { error?: string } | undefined;

function parse(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return PostInput.safeParse({ ...raw, categoryId: raw.categoryId || undefined });
}

export async function savePost(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  const v = parsed.data;

  const values = {
    title: v.title,
    slug: v.slug,
    excerpt: v.excerpt,
    content: v.content,
    coverImage: v.coverImage || null,
    categoryId: v.categoryId ?? null,
    status: v.status,
    seoTitle: v.seoTitle || null,
    seoDescription: v.seoDescription || null,
    updatedAt: new Date(),
  };

  try {
    if (id) {
      const [existing] = await db.select({ publishedAt: posts.publishedAt }).from(posts).where(eq(posts.id, id));
      await db
        .update(posts)
        .set({ ...values, publishedAt: existing?.publishedAt ?? (v.status === "published" ? new Date() : null) })
        .where(eq(posts.id, id));
    } else {
      await db.insert(posts).values({ ...values, publishedAt: v.status === "published" ? new Date() : null });
    }
  } catch (e) {
    if (String(e).includes("unique")) return { error: "That slug is already used by another post." };
    throw e;
  }

  updateTag(POSTS_TAG);
  redirect("/admin");
}

export async function deletePost(id: number) {
  await requireAdmin();
  await db.delete(posts).where(eq(posts.id, id));
  updateTag(POSTS_TAG);
  redirect("/admin");
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
