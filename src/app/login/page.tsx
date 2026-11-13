"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const res =
      mode === "in"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name: String(f.get("name") || email) });
    setPending(false);
    if (res.error) return setError(res.error.message ?? "Something went wrong");
    router.push("/admin");
    router.refresh();
  }

  const input = "mt-1 w-full rounded-lg border border-sand-200 bg-white px-3 py-2 focus:outline-2 focus:outline-forest-600";

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="font-serif text-3xl font-bold text-forest-900">{mode === "in" ? "Sign in" : "Create admin account"}</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "up" && (
          <label className="block text-sm font-medium">
            Name
            <input name="name" className={input} />
          </label>
        )}
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className={input}
          />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          disabled={pending}
          className="w-full rounded-full bg-forest-700 py-2.5 font-semibold text-white hover:bg-forest-800 disabled:opacity-60"
        >
          {pending ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "in" ? "up" : "in")}
        className="mt-4 text-sm text-forest-700 underline"
      >
        {mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}
      </button>
    </div>
  );
}
