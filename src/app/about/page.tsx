import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", alternates: { canonical: "/about" } };

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-forest-900">About Campers Republic</h1>
      <div className="prose prose-lg mt-6">
        <p>
          Campers Republic is a home for people who would rather be outside. We write practical guides on camping gear,
          RV life, glamping and outdoor activities, with a focus on what actually matters once you are at the campsite.
        </p>
        <p>
          Our buying guides explain what to look for and how to match gear to the way you camp. Prices and models change
          often, so always check current details with the retailer before you buy.
        </p>
      </div>
    </div>
  );
}
