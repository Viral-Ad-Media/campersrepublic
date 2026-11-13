import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-forest-900 text-forest-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold text-white">Campers Republic</p>
          <p className="mt-2 text-sm text-forest-100/80">
            Honest, practical advice for getting outside and sleeping well once you get there.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">Explore</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/camping-essentials" className="hover:underline">Camping Essentials</Link></li>
            <li><Link href="/rv-camping" className="hover:underline">RV Camping</Link></li>
            <li><Link href="/glamping" className="hover:underline">Glamping</Link></li>
            <li><Link href="/activities" className="hover:underline">Activities</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-white">About</p>
          <ul className="mt-2 space-y-1">
            <li><Link href="/about" className="hover:underline">About us</Link></li>
            <li><Link href="/disclosure" className="hover:underline">Affiliate disclosure</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-forest-100/60">
        © {new Date().getFullYear()} Campers Republic
      </p>
    </footer>
  );
}
