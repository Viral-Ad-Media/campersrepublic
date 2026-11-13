import Link from "next/link";

const nav = [
  { href: "/camping-essentials", label: "Camping Essentials" },
  { href: "/rv-camping", label: "RV Camping" },
  { href: "/glamping", label: "Glamping" },
  { href: "/activities", label: "Activities" },
  { href: "/blog", label: "All Guides" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-forest-800">
          <svg aria-hidden viewBox="0 0 32 32" className="h-7 w-7">
            <path d="M16 4 3 27h26L16 4Z" fill="#2f5638" />
            <path d="M16 13 10 27h12l-6-14Z" fill="#d9772b" />
          </svg>
          Campers Republic
        </Link>
        <nav aria-label="Main" className="-mx-1 flex max-w-full gap-1 overflow-x-auto text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-forest-900 hover:bg-forest-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
