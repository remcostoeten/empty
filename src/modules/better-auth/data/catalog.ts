import type { CodeSample, FeatureGroup, Verdict } from "@/modules/comparison/types"

export const betterAuthGroups: FeatureGroup[] = [
  {
    id: "flows",
    title: "Authentication flows",
    description: "Core options ship in the main package. Everything else is a plugin you opt into.",
    items: [
      { name: "Email and password", tag: "core", note: "emailAndPassword: { enabled: true }. Verification, reset and change password are built in." },
      { name: "Social sign-in", tag: "core", note: "36 built-in providers including GitHub, Google, Apple, Microsoft, Discord, Vercel, Linear and Slack." },
      { name: "Username", tag: "plugin", note: "username() adds username and displayUsername columns to the user table." },
      { name: "Anonymous", tag: "plugin", note: "anonymous() creates guest sessions that can later be linked to a real account." },
      { name: "Phone number", tag: "plugin", note: "phoneNumber() sends OTP through the sendOTP callback you provide." },
      { name: "Magic link", tag: "plugin", note: "magicLink() calls your sendMagicLink handler. You bring the email provider." },
      { name: "Email OTP", tag: "plugin", note: "emailOTP() for sign-in, verification and password reset by code." },
      { name: "Passkey", tag: "@better-auth/passkey", note: "WebAuthn registration and authentication, adds a passkey table." },
      { name: "Two-factor", tag: "plugin", note: "twoFactor() with TOTP, OTP and backup codes." },
      { name: "Generic OAuth and OIDC", tag: "plugin", note: "genericOAuth() for any provider with a discovery URL." },
      { name: "Google One Tap", tag: "plugin", note: "oneTap() server plugin plus authClient.oneTap() on the client." },
      { name: "Sign in with Ethereum", tag: "plugin", note: "siwe() stores wallet addresses in a walletAddress table." },
      { name: "SSO (SAML and OIDC)", tag: "@better-auth/sso", note: "Enterprise SSO with domain verification." },
    ],
  },
  {
    id: "apis",
    title: "APIs and plugins",
    description: "Server plugin plus a matching client plugin. Rerun the CLI after adding one that touches the schema.",
    items: [
      { name: "Admin", tag: "plugin", note: "User management, banning, impersonation and roles. Adds role, banned and banExpires to user." },
      { name: "API keys", tag: "@better-auth/api-key", note: "Issue and verify keys with rate limits and permissions." },
      { name: "Organizations and teams", tag: "plugin", note: "organization(), member, invitation and optional team tables with role based access." },
      { name: "Bearer", tag: "plugin", note: "Accept Authorization: Bearer instead of a cookie for mobile and API clients." },
      { name: "Device authorization", tag: "plugin", note: "RFC 8628 device flow for CLIs and TVs." },
      { name: "Captcha", tag: "plugin", note: "Cloudflare Turnstile, reCAPTCHA, hCaptcha or CaptchaFox on auth endpoints." },
      { name: "Have I Been Pwned", tag: "plugin", note: "Rejects passwords found in known breaches." },
      { name: "Multi-session", tag: "plugin", note: "Several signed-in accounts per browser with account switching." },
      { name: "Last login method", tag: "plugin", note: "Remembers how the user last signed in, in a cookie or the database." },
      { name: "One-time token", tag: "plugin", note: "Short lived single use tokens for cross domain handoffs." },
      { name: "JWT and JWKS", tag: "plugin", note: "Signs JWTs and serves /jwks for downstream services." },
      { name: "OAuth 2.1 provider", tag: "@better-auth/oauth-provider", note: "Become an authorization server for third party apps." },
      { name: "MCP", tag: "@better-auth/mcp", note: "OAuth for Model Context Protocol clients." },
      { name: "SCIM", tag: "@better-auth/scim", note: "Directory provisioning for enterprise identity providers." },
      { name: "Open API", tag: "plugin", note: "Generated reference at /api/auth/reference." },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Billing lives in plugins maintained with the payment vendors.",
    items: [
      { name: "Stripe", tag: "@better-auth/stripe", note: "Customers, subscriptions and webhooks. Adds a subscription table." },
      { name: "Polar", tag: "@polar-sh/better-auth", note: "Checkout, customer portal, usage and webhooks." },
      { name: "Autumn", tag: "autumn-js", note: "Feature gating and usage based billing." },
      { name: "Dodo Payments", tag: "@dodopayments/better-auth", note: "Merchant of record checkout and portal." },
      { name: "Creem", tag: "@creem_io/better-auth", note: "Subscriptions with a creem_subscription table." },
      { name: "Chargebee", tag: "@chargebee/better-auth", note: "Subscription items on user and organization." },
      { name: "Commet", tag: "@commet/better-auth", note: "Seats, features and usage billing." },
    ],
  },
  {
    id: "ops",
    title: "Operations you own",
    description: "Better Auth is a library. These pieces are your responsibility, or a paid Infrastructure plan.",
    items: [
      { name: "Database and migrations", note: "Any Postgres, MySQL, SQLite or MongoDB via Drizzle, Prisma, Kysely or native drivers." },
      { name: "Email delivery", note: "Magic links, OTPs and verification mail go through a callback you implement, for example Resend." },
      { name: "SMS delivery", note: "Phone OTP uses your provider. Infrastructure Pro adds transactional SMS." },
      { name: "OAuth app credentials", note: "Register apps at each provider, including for local development." },
      { name: "Admin dashboard", note: "None by default. Better Auth Infrastructure adds a hosted dashboard, audit logs and abuse protection." },
      { name: "Rate limiting", note: "Built-in memory or database store. Redis via @better-auth/redis-storage." },
    ],
  },
]

export const betterAuthVerdict: Verdict = {
  pros: [
    "Users, sessions and accounts live in your Postgres. No export step if you leave.",
    "MIT licensed and free at any scale. Costs are your database and email provider.",
    "Plugin surface is wider than most hosted vendors, including OAuth provider, MCP, SCIM and device flow.",
    "Typed end to end. Server actions call auth.api directly, no HTTP round trip.",
  ],
  cons: [
    "Every provider needs OAuth credentials, even in development.",
    "You implement email and SMS delivery and own deliverability.",
    "No admin UI unless you build one or pay for Infrastructure.",
    "Schema changes when you add plugins, so migrations become part of the auth workflow.",
  ],
}

export const betterAuthSamples: CodeSample[] = [
  {
    id: "schema",
    title: "Prefixed Drizzle schema on Neon",
    description:
      "pgTableCreator prefixes every auth table with auth_ so the auth domain stays isolated inside the shared database. This file is what runs in this app.",
    file: "src/db/schema.ts",
    code: `
import { relations } from "drizzle-orm"
import { boolean, index, pgTableCreator, text, timestamp } from "drizzle-orm/pg-core"

export const authTable = pgTableCreator(function prefix(name) {
  return \`auth_\${name}\`
})

export const user = authTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  isAnonymous: boolean("is_anonymous").default(false),
})

export const session = authTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("auth_session_user_id_idx").on(table.userId)]
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
}))
`,
  },
  {
    id: "server",
    title: "Server configuration",
    description:
      "One betterAuth() call. The Drizzle adapter receives the prefixed schema, plugins are composed in an array, and nextCookies stays last so server actions can set cookies.",
    file: "src/lib/auth.ts",
    code: `
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { anonymous, haveIBeenPwned, lastLoginMethod, magicLink, username } from "better-auth/plugins"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  session: { cookieCache: { enabled: true, maxAge: 5 * 60 } },
  plugins: [
    username(),
    anonymous(),
    magicLink({
      sendMagicLink: async function sendMagicLink({ email, url }) {
        await resend.emails.send({ to: email, subject: "Sign in", html: url })
      },
    }),
    haveIBeenPwned(),
    lastLoginMethod(),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
`,
  },
  {
    id: "handler",
    title: "Route handler and client",
    description: "One catch-all route exposes every endpoint. The React client mirrors the server plugins so the types line up.",
    file: "src/app/api/auth/[...all]/route.ts",
    code: `
import { toNextJsHandler } from "better-auth/next-js"
import { auth } from "@/lib/auth"

export const { GET, POST } = toNextJsHandler(auth)

// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react"
import { anonymousClient, magicLinkClient, usernameClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [usernameClient(), anonymousClient(), magicLinkClient()],
})
`,
  },
  {
    id: "action",
    title: "Server action with a shared wrapper",
    description:
      "Validation happens at the boundary with Zod, the auth call runs on the server, and the result shape is the same for every action in the codebase.",
    file: "src/modules/better-auth/api/actions.ts",
    code: `
"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createAction } from "@/core/create-action"
import { auth } from "@/lib/auth"

const credentials = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
})

export const signInAction = createAction(credentials, async function run(input) {
  await auth.api.signInEmail({
    body: { email: input.email, password: input.password },
    headers: await headers(),
  })
  redirect("/dashboard")
})
`,
  },
  {
    id: "session",
    title: "Reading the session in a Server Component",
    description: "No client boundary needed. The query wrapper catches database errors and returns a result instead of throwing into the render tree.",
    file: "src/modules/better-auth/api/queries.ts",
    code: `
import "server-only"
import { headers } from "next/headers"
import { createQuery } from "@/core/create-query"
import { auth } from "@/lib/auth"

export const getSession = createQuery("Could not read the session.", async function run() {
  return auth.api.getSession({ headers: await headers() })
})

// app/dashboard/page.tsx
export default async function Page() {
  const session = await getSession()
  if (!session.ok || !session.data) redirect("/sign-in")
  return <h1>Hello {session.data.user.name}</h1>
}
`,
  },
  {
    id: "plugins",
    title: "Adding two-factor, passkeys, organizations and Stripe",
    description:
      "Each feature is a plugin pair. After editing this file run npx auth@latest generate, then drizzle-kit generate and migrate.",
    file: "src/lib/auth.ts",
    code: `
import { passkey } from "@better-auth/passkey"
import { stripe } from "@better-auth/stripe"
import { admin, apiKey, organization, twoFactor } from "better-auth/plugins"
import Stripe from "stripe"

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const auth = betterAuth({
  plugins: [
    twoFactor(),
    passkey({ rpID: "app.example.com", rpName: "Example" }),
    organization({ teams: { enabled: true } }),
    admin(),
    apiKey(),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      subscription: {
        enabled: true,
        plans: [{ name: "pro", priceId: "price_123" }],
      },
    }),
    nextCookies(),
  ],
})
`,
  },
  {
    id: "proxy",
    title: "Optimistic redirect in proxy.ts",
    description:
      "The cookie check is fast but not a security boundary. Real protection happens where the data is read, in the page or action.",
    file: "src/proxy.ts",
    code: `
import { getSessionCookie } from "better-auth/cookies"
import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const cookie = getSessionCookie(request)
  if (!cookie) return NextResponse.redirect(new URL("/sign-in", request.url))
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
`,
  },
]

export const betterAuthStats = [
  { label: "Version", value: "1.7.5" },
  { label: "License", value: "MIT" },
  { label: "Users live in", value: "Your Postgres" },
  { label: "Setup", value: "30 to 60 min" },
]
