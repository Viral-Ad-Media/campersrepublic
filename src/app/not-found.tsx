import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-4xl font-bold text-forest-900">Trail not found</h1>
      <p className="mt-3 text-neutral-600">That page doesn&apos;t exist, or it has moved.</p>
      <Link href="/blog" className="mt-6 inline-block rounded-full bg-forest-700 px-6 py-3 font-semibold text-white">
        Browse all guides
      </Link>
    </div>
  );
}
