import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { formatDate } from "@/lib/format";

export default async function AdminHome() {
  await requireAdmin();
  const rows = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug, status: posts.status, updatedAt: posts.updatedAt, category: categories.name })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .orderBy(desc(posts.updatedAt));

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Posts ({rows.length})</h1>
        <Link href="/admin/posts/new" className="rounded-full bg-forest-700 px-4 py-2 text-sm font-semibold text-white">
          New post
        </Link>
      </div>
      <ul className="mt-6 divide-y divide-sand-200 rounded-xl bg-white ring-1 ring-sand-200">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
            <div className="min-w-0">
              <Link href={`/admin/posts/${r.id}`} className="font-medium text-forest-900 hover:underline">{r.title}</Link>
              <p className="text-xs text-neutral-500">/{r.slug} · {r.category ?? "No category"} · {formatDate(r.updatedAt)}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs ${r.status === "published" ? "bg-forest-100 text-forest-800" : "bg-sand-200 text-neutral-700"}`}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
