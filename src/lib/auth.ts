import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: { enabled: true, minPasswordLength: 10 },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "admin", input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Only emails listed in ADMIN_EMAILS may register.
        before: async (u) => {
          if (!adminEmails.includes(u.email.toLowerCase())) {
            throw new APIError("FORBIDDEN", {
              message: "Sign-ups are closed for this site.",
            });
          }
          return { data: u };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
