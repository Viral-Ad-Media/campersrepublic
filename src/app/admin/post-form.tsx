"use client";

import { useActionState } from "react";
import type { Category, Post } from "@/db/schema";
import { savePost, type FormState } from "./actions";

export function PostForm({ post, categories }: { post?: Post; categories: Category[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    savePost.bind(null, post?.id ?? null),
    undefined,
  );
  const input = "mt-1 w-full rounded-lg border border-sand-200 bg-white px-3 py-2";

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">
          Title
          <input name="title" required defaultValue={post?.title} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Slug (URL)
          <input name="slug" required defaultValue={post?.slug} className={`${input} font-mono`} />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select name="categoryId" defaultValue={post?.categoryId ?? ""} className={input}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Cover image (path or URL)
          <input name="coverImage" defaultValue={post?.coverImage ?? ""} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Status
          <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Excerpt
        <textarea name="excerpt" rows={2} defaultValue={post?.excerpt} className={input} />
      </label>
      <label className="block text-sm font-medium">
        Content (Markdown)
        <textarea name="content" rows={24} defaultValue={post?.content} className={`${input} font-mono text-sm`} />
      </label>
      <details className="rounded-lg bg-sand-100 p-4">
        <summary className="cursor-pointer text-sm font-medium">SEO overrides</summary>
        <label className="mt-3 block text-sm font-medium">
          SEO title
          <input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={input} />
        </label>
        <label className="mt-3 block text-sm font-medium">
          Meta description
          <textarea name="seoDescription" rows={2} defaultValue={post?.seoDescription ?? ""} className={input} />
        </label>
      </details>
      {state?.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className="rounded-full bg-forest-700 px-6 py-2.5 font-semibold text-white disabled:opacity-60">
        {pending ? "Saving…" : "Save post"}
      </button>
    </form>
  );
}
