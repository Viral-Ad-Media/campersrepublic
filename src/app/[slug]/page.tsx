import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { PostGrid } from "@/components/post-card";
import { SITE, formatDate, readingTime } from "@/lib/format";
import { getCategories, loadCategoryPosts, loadPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

// WordPress served posts and categories from the root, so this route resolves both.
async function resolve(slug: string) {
  // Skip the database for anything that can't be a slug (e.g. /favicon.png, /wp-login.php).
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const post = await loadPost(slug);
  if (post) return { kind: "post" as const, post };
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (category) return { kind: "category" as const, category, posts: await loadCategoryPosts(slug) };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) return {};
  if (r.kind === "category") {
    return {
      title: `${r.category.name} Guides`,
      description: r.category.description,
      alternates: { canonical: `/${slug}` },
    };
  }
  const p = r.post;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: "article",
      title: p.title,
      description: p.excerpt,
      images: p.coverImage ? [p.coverImage] : undefined,
      publishedTime: p.publishedAt?.toISOString(),
      modifiedTime: p.updatedAt.toISOString(),
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) notFound();

  if (r.kind === "category") {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-ember-600">Topic</p>
        <h1 className="mt-1 font-serif text-4xl font-bold text-forest-900">{r.category.name}</h1>
        <p className="mt-2 max-w-2xl text-neutral-600">{r.category.description}</p>
        <div className="mt-8">
          {r.posts.length ? <PostGrid posts={r.posts} /> : <p>No guides here yet.</p>}
        </div>
      </div>
    );
  }

  const p = r.post;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.excerpt,
    image: p.coverImage ? [new URL(p.coverImage, SITE.url).toString()] : undefined,
    datePublished: p.publishedAt?.toISOString(),
    dateModified: p.updatedAt.toISOString(),
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: new URL(`/${p.slug}`, SITE.url).toString(),
  };

  return (
    <article className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header className="mx-auto max-w-3xl px-4 pt-12">
        {p.categoryName && (
          <Link href={`/${p.categorySlug}`} className="text-sm font-semibold uppercase tracking-wide text-ember-600 hover:underline">
            {p.categoryName}
          </Link>
        )}
        <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-forest-900 sm:text-5xl">{p.title}</h1>
        <p className="mt-4 text-lg text-neutral-600">{p.excerpt}</p>
        <p className="mt-4 text-sm text-neutral-500">
          Updated {formatDate(p.updatedAt)} · {readingTime(p.content)} min read
        </p>
      </header>
      {p.coverImage && (
        <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden sm:rounded-2xl">
          <Image src={p.coverImage} alt="" fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
        </div>
      )}
      <div className="mx-auto mt-10 max-w-3xl px-4">
        <Markdown>{p.content}</Markdown>
        <p className="mt-12 rounded-xl bg-sand-100 p-4 text-sm text-neutral-600">
          Campers Republic may earn a commission when you buy through links on this site, at no extra cost to you.{" "}
          <Link href="/disclosure" className="underline">Learn more</Link>.
        </p>
      </div>
    </article>
  );
}
