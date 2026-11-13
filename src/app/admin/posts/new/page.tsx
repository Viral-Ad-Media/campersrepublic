import { db } from "@/db";
import { categories } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../post-form";

export default async function NewPost() {
  await requireAdmin();
  const cats = await db.select().from(categories).orderBy(categories.name);
  return (
    <>
      <h1 className="mb-6 text-xl font-semibold">New post</h1>
      <PostForm categories={cats} />
    </>
  );
}
