import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../post-form";
import { deletePost } from "../../actions";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [post] = await db.select().from(posts).where(eq(posts.id, id));
  if (!post) notFound();
  const cats = await db.select().from(categories).orderBy(categories.name);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit post</h1>
        <Link href={`/${post.slug}`} className="text-sm text-forest-700 underline" target="_blank">View</Link>
      </div>
      <PostForm post={post} categories={cats} />
      <form action={deletePost.bind(null, post.id)} className="mt-10 border-t border-sand-200 pt-6">
        <button className="text-sm text-red-700 underline">Delete this post</button>
      </form>
    </>
  );
}
