import type { Metadata } from "next";

export const metadata: Metadata = { title: "Affiliate Disclosure", alternates: { canonical: "/disclosure" } };

export default function Disclosure() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-forest-900">Affiliate disclosure</h1>
      <div className="prose prose-lg mt-6">
        <p>
          Some links on Campers Republic are affiliate links. If you click one and make a purchase, we may earn a small
          commission at no additional cost to you. This helps keep the site running.
        </p>
        <p>
          Commissions never decide what we recommend. If a product category has no option we would be comfortable
          suggesting to a friend, we say so.
        </p>
      </div>
    </div>
  );
}
