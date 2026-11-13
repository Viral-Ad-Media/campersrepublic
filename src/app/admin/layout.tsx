import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <Link href="/admin" className="font-serif text-2xl font-bold text-forest-900">Admin</Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-neutral-600">{session.user.email}</span>
          <form action={signOut}>
            <button className="text-forest-700 underline">Sign out</button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
