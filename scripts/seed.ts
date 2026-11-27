/**
 * Upserts categories and posts from /content into the database.
 * Usage: npm run db:seed   (reads DATABASE_URL from .env)
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const isNeon = /\.neon\.(tech|build)/.test(url);
const pool = isNeon ? null : new Pool({ connectionString: url });
const db = isNeon ? drizzleNeon(neon(url), { schema }) : drizzlePg(pool!, { schema });

const root = path.join(process.cwd(), "content");
// --missing-only: insert posts that are not in the DB yet, never overwrite existing ones
// (used on every Vercel build so edits made in /admin are kept).
const missingOnly = process.argv.includes("--missing-only");

async function main() {
  const cats: { slug: string; name: string; description: string }[] = JSON.parse(
    readFileSync(path.join(root, "categories.json"), "utf8"),
  );
  for (const c of cats) {
    await db
      .insert(schema.categories)
      .values(c)
      .onConflictDoUpdate({ target: schema.categories.slug, set: { name: c.name, description: c.description } });
  }
  const catRows = await db.select().from(schema.categories);
  const catId = new Map(catRows.map((c) => [c.slug, c.id]));

  const files = readdirSync(path.join(root, "posts")).filter((f) => f.endsWith(".md"));
  for (const f of files) {
    const { data, content } = matter(readFileSync(path.join(root, "posts", f), "utf8"));
    const slug = data.slug ?? f.replace(/\.md$/, "");
    const values = {
      slug,
      title: data.title,
      excerpt: data.excerpt ?? "",
      content: content.trim(),
      coverImage: data.cover ?? null,
      categoryId: catId.get(data.category) ?? null,
      status: "published" as const,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      publishedAt: data.date ? new Date(data.date) : new Date(),
      updatedAt: new Date(),
    };
    if (missingOnly) {
      const inserted = await db
        .insert(schema.posts)
        .values(values)
        .onConflictDoNothing()
        .returning();
      console.log(inserted.length ? "inserted" : "exists, skipped", slug);
      continue;
    }
    await db
      .insert(schema.posts)
      .values(values)
      .onConflictDoUpdate({
        target: schema.posts.slug,
        set: { ...values, slug: sql`excluded.slug` },
      });
    console.log("upserted", slug);
  }
  await pool?.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
