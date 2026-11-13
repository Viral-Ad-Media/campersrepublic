import Image from "next/image";
import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatDate } from "@/lib/format";

export function PostCard({ post, priority = false }: { post: PostSummary; priority?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand-200 transition hover:shadow-md">
      <Link href={`/${post.slug}`} className="relative block aspect-[3/2] overflow-hidden bg-sand-100">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.categoryName && (
          <Link
            href={`/${post.categorySlug}`}
            className="text-xs font-semibold uppercase tracking-wide text-ember-600 hover:underline"
          >
            {post.categoryName}
          </Link>
        )}
        <h3 className="mt-1 font-serif text-xl font-bold leading-snug text-forest-900">
          <Link href={`/${post.slug}`} className="hover:text-forest-600">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-neutral-600">{post.excerpt}</p>
        <p className="mt-4 text-xs text-neutral-500">{formatDate(post.publishedAt)}</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: PostSummary[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <PostCard key={p.id} post={p} priority={i < 3} />
      ))}
    </div>
  );
}
