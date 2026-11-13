# Campers Republic

A clean rebuild of campersrepublic.com on **Next.js 16**, **Tailwind CSS 4**, **Neon Postgres** (via Drizzle ORM) and **Better Auth**.

No code or files from the compromised WordPress install are used. Only the post list, categories and cover photos were recovered from the backup, and every article was rewritten from scratch.

## What's included

- Public site: home, `/blog`, category pages, and posts at their original WordPress URLs (`/best-camping-stove-2023`, `/glamping`, …)
- 301 redirects from old WordPress date permalinks (`/2022/09/17/slug/` → `/slug`) and `/category/x`
- `sitemap.xml`, `robots.txt`, Open Graph tags and Article JSON-LD
- `/admin`: a Markdown post editor with drafts, categories and SEO overrides, behind Better Auth email and password login
- Sign-up is locked to the emails listed in `ADMIN_EMAILS`
- Articles live in `content/posts/*.md` and are loaded into the database with `npm run db:seed`

## Setup

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL (Neon), BETTER_AUTH_SECRET, ADMIN_EMAILS
npm run db:migrate          # create tables
npm run db:seed             # load categories and the 16 articles
npm run dev
```

Then open `/login`, choose **Create the admin account** using an email from `ADMIN_EMAILS`, and you'll land in `/admin`.

`DATABASE_URL` may point at Neon (the serverless HTTP driver is used automatically) or at any local Postgres for development.

## Deploying (e.g. Vercel)

1. Create a Neon project and copy the pooled connection string.
2. Set the env vars from `.env.example` in your host. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the production domain.
3. Run `npm run db:migrate && npm run db:seed` once against the production database.
4. Point the domain at the new deployment, then resubmit `/sitemap.xml` in Google Search Console.

Public pages cache database reads for up to an hour. Saving in `/admin` refreshes them immediately, but changes made directly in the database (or by re-seeding) show up within the hour, or after a redeploy.
