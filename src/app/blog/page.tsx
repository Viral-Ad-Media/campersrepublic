import type { Metadata } from "next";
import { PostGrid } from "@/components/post-card";
import { loadPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "All Camping Guides",
  description: "Every Campers Republic guide, from gear buying advice to checklists and RV tips.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await loadPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-forest-900">All guides</h1>
      <p className="mt-2 text-neutral-600">{posts.length} articles on gear, trips and life outdoors.</p>
      <div className="mt-8">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
