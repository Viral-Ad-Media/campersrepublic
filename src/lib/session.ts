import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Use in every admin page and server action. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session || (session.user as { role?: string }).role !== "admin") {
    redirect("/login");
  }
  return session;
}
