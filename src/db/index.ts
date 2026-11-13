import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

// Neon in production; plain Postgres works for local development.
const isNeon = /\.neon\.(tech|build)/.test(url);

export const db = isNeon
  ? drizzleNeon(neon(url), { schema })
  : drizzlePg(new Pool({ connectionString: url }), { schema });

export { schema };
