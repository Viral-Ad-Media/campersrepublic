import Image from "next/image";
import Link from "next/link";
import { PostGrid } from "@/components/post-card";
import { getCategories, loadPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [posts, categories] = await Promise.all([loadPosts(9), getCategories()]);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image src="/images/hero-hiker.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/85 via-forest-900/60 to-forest-900/20" />
        <div className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-widest text-ember-500">Campers Republic</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
            Pack smarter, sleep better, and get more out of every trip.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-forest-50/90">
            Straightforward guides to camping gear, RV life and glamping, written for real trips rather than catalog photos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/blog" className="rounded-full bg-ember-500 px-6 py-3 font-semibold text-white hover:bg-ember-600">
              Browse all guides
            </Link>
            <Link href="/weekend-camping-checklist" className="rounded-full bg-white/10 px-6 py-3 font-semibold text-white ring-1 ring-white/40 hover:bg-white/20">
              Weekend checklist
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <h2 className="font-serif text-2xl font-bold text-forest-900">Explore by topic</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/${c.slug}`}
              className="rounded-2xl bg-forest-800 p-5 text-white transition hover:bg-forest-700"
            >
              <p className="font-serif text-lg font-bold">{c.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-forest-100/80">{c.description}</p>
              <p className="mt-3 text-xs font-semibold text-ember-500">{c.count} guides →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold text-forest-900">Latest guides</h2>
          <Link href="/blog" className="text-sm font-semibold text-forest-700 hover:underline">See all</Link>
        </div>
        <div className="mt-6">
          <PostGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
