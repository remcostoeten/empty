# Auth Options

A small comparison app for choosing authentication in a Next.js SaaS: **Better Auth** (self-hosted, users in your Neon Postgres) versus **Clerk** (hosted, prebuilt components). Both pages run real code so the trade-offs are concrete.

## Stack

- Next.js 16 App Router, React 19, server actions, `proxy.ts`
- Tailwind v4, shadcn-style components on `@base-ui/react`, Geist, Vercel dark palette
- Drizzle ORM on Neon Postgres via `pg` (`attachDatabasePool` for Vercel Fluid compute)
- Better Auth 1.7 with the Drizzle adapter, every table prefixed `auth_`
- `@clerk/nextjs` 7 with `ClerkProvider` and `clerkMiddleware` activated only when keys exist
- `@pierre/diffs` for server-rendered code blocks
- Animations follow the Emil Kowalski skills in `.claude/skills`

## Run

```bash
pnpm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon connection string. Use the pooled host for the app, the direct host for migrations. |
| `BETTER_AUTH_SECRET` | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | `http://localhost:3000` locally |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Optional. `npx clerk@latest init --framework next` writes them. The Clerk page renders the live components once set. |

```bash
pnpm db:migrate
pnpm dev
```

Without `DATABASE_URL` the app still builds and runs. The Better Auth page shows setup instructions instead of the live sign-up form.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm db:generate` | Create a Drizzle migration from `src/db/schema.ts` |
| `pnpm db:migrate` | Apply migrations |
| `pnpm auth:generate` | Regenerate the Better Auth schema after adding plugins. Merge it into `src/db/schema.ts` and keep the `auth_` prefix. |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |

## Structure

```
src/
  app/                  routes, layout, better-auth route handler
  components/           ui (Base UI), layout, code (diffs)
  core/                 createAction, createQuery, result shape, env checks
  db/                   Drizzle client and prefixed schema
  lib/                  auth.ts, auth-client.ts
  modules/
    better-auth/        api (queries, actions), components, data catalog
    clerk/              components, data catalog, appearance
    comparison/         shared types, components, matrix data
  proxy.ts              Clerk middleware when configured, passthrough otherwise
```

## Notes

- Better Auth plugins enabled in the demo: `username`, `anonymous`, `magicLink` (logs the link to the server console), `haveIBeenPwned`, `lastLoginMethod`, `nextCookies`.
- The `haveIBeenPwned` plugin calls an external API during sign-up. Remove it if your network blocks outbound requests.
- Feature catalogs follow the vendor docs as of September 2026. Pricing lines are approximate; confirm on the vendors' pricing pages.
