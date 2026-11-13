import type { MetadataRoute } from "next";
import { SITE } from "@/lib/format";
import { getCategories, loadPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([loadPosts(), getCategories()]);
  return [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/blog`, changeFrequency: "weekly" },
    ...categories.map((c) => ({ url: `${SITE.url}/${c.slug}` })),
    ...posts.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: p.updatedAt,
      images: p.coverImage ? [`${SITE.url}${p.coverImage}`] : undefined,
    })),
  ];
}
