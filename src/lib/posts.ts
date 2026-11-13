import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";

export const POSTS_TAG = "posts";

const listColumns = {
  id: posts.id,
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  coverImage: posts.coverImage,
  publishedAt: posts.publishedAt,
  updatedAt: posts.updatedAt,
  categorySlug: categories.slug,
  categoryName: categories.name,
};

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  categorySlug: string | null;
  categoryName: string | null;
};

// unstable_cache serialises to JSON, so revive Date fields.
const revive = <T extends { publishedAt: Date | null; updatedAt: Date }>(
  p: T,
): T => ({
  ...p,
  publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
  updatedAt: new Date(p.updatedAt),
});

const cached = <A extends unknown[], R>(
  fn: (...a: A) => Promise<R>,
  key: string,
) => unstable_cache(fn, [key], { tags: [POSTS_TAG], revalidate: 3600 });

export const getPublishedPosts = cached(
  async (limit?: number): Promise<PostSummary[]> => {
    const q = db
      .select(listColumns)
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    return limit ? q.limit(limit) : q;
  },
  "published-posts",
);

export const getPostsByCategory = cached(
  async (categorySlug: string): Promise<PostSummary[]> =>
    db
      .select(listColumns)
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(eq(posts.status, "published"), eq(categories.slug, categorySlug)),
      )
      .orderBy(desc(posts.publishedAt)),
  "posts-by-category",
);

export const getPublishedPost = cached(async (slug: string) => {
  const [row] = await db
    .select({ ...listColumns, content: posts.content, seoTitle: posts.seoTitle, seoDescription: posts.seoDescription })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  return row ?? null;
}, "published-post");

export const getCategories = cached(
  async () =>
    db
      .select({
        id: categories.id,
        slug: categories.slug,
        name: categories.name,
        description: categories.description,
        count: sql<number>`count(${posts.id}) filter (where ${posts.status} = 'published')`.mapWith(Number),
      })
      .from(categories)
      .leftJoin(posts, eq(posts.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(categories.name),
  "categories",
);

export async function loadPosts(limit?: number) {
  return (await getPublishedPosts(limit)).map(revive);
}
export async function loadCategoryPosts(slug: string) {
  return (await getPostsByCategory(slug)).map(revive);
}
export async function loadPost(slug: string) {
  const p = await getPublishedPost(slug);
  return p ? revive(p) : null;
}
