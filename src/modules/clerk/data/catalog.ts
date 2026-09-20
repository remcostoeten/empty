import type { CodeSample, FeatureGroup, Verdict } from "@/modules/comparison/types"

export const clerkGroups: FeatureGroup[] = [
  {
    id: "flows",
    title: "Authentication flows",
    description: "Almost everything is a toggle in the Clerk Dashboard. The prebuilt components render whatever is enabled.",
    items: [
      { name: "Email and password", tag: "dashboard", note: "User & authentication. Strength rules use zxcvbn, minimum 8 characters." },
      { name: "Username", tag: "dashboard", note: "4 to 64 characters, no special characters." },
      { name: "Email verification code", tag: "dashboard", note: "Six digit OTP delivered by Clerk's own email service." },
      { name: "Email magic link", tag: "dashboard", note: "Managed end to end by Clerk. Expires after 10 minutes and must be opened on the same device." },
      { name: "Phone number and SMS OTP", tag: "paid in prod", note: "Free in development. US and Canada enabled by default, other countries via the SMS allowlist." },
      { name: "Passkeys", tag: "paid in prod", note: "Up to 10 passkeys per user. Counts as MFA on new instances." },
      { name: "Social sign-in", tag: "dashboard", note: "30+ providers. Development instances use shared credentials, production needs your own OAuth apps." },
      { name: "Enterprise SSO (SAML, OIDC, EASIE)", tag: "pro", note: "Presets for Entra, Google Workspace and Okta. 25 free connections in development." },
      { name: "Directory sync (SCIM)", tag: "pro", note: "Okta, Entra ID, Google Workspace and custom SCIM providers." },
      { name: "Web3 wallets", tag: "dashboard", note: "MetaMask, Coinbase Wallet, OKX and Base." },
      { name: "Multi-factor", tag: "dashboard", note: "TOTP, SMS codes and backup codes. Can be required for every user." },
      { name: "Google One Tap", tag: "component", note: "<GoogleOneTap /> renders the prompt." },
      { name: "Anonymous", note: "Not offered. Closest fit is the waitlist or invite-only access mode." },
    ],
  },
  {
    id: "apis",
    title: "APIs and platform features",
    description: "Server helpers from @clerk/nextjs/server, plus a Backend API for everything the dashboard can do.",
    items: [
      { name: "Admin", tag: "dashboard", note: "User and organization management, impersonation, CSV export with password hashes." },
      { name: "API keys", tag: "component", note: "<APIKeys /> and auth({ acceptsToken: 'api_key' })." },
      { name: "Organizations", tag: "b2b add-on", note: "Roles, permissions, invitations, verified domains. Custom roles in production need the add-on." },
      { name: "Bearer and machine tokens", tag: "server", note: "M2M tokens and OAuth access tokens verified through auth()." },
      { name: "Device authorization", tag: "component", note: "<OAuthDeviceVerification /> when Clerk acts as the OAuth provider." },
      { name: "Bot protection", tag: "dashboard", note: "Smart CAPTCHA managed by Clerk. Custom flows only need a DOM node." },
      { name: "Have I Been Pwned", tag: "dashboard", note: "Reject compromised passwords toggle, forces a reset on sign-in." },
      { name: "Multi-session", tag: "dashboard", note: "Several accounts per browser with <MultisessionAppSupport />." },
      { name: "Last login method", note: "Not exposed. Reconstruct from session webhooks." },
      { name: "One-time token", tag: "backend api", note: "Sign-in tokens created through the Backend API." },
      { name: "JWT templates", tag: "dashboard", note: "Custom claims for downstream services, JWKS endpoint per instance." },
      { name: "OAuth provider", tag: "dashboard", note: "Clerk as identity provider with <OAuthConsent />." },
      { name: "Webhooks", tag: "svix", note: "verifyWebhook() from @clerk/nextjs/webhooks. Needed to mirror users into your database." },
      { name: "Device trust", tag: "dashboard", note: "Second factor on new devices for password sign-ins." },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    description: "Clerk Billing uses Stripe only for processing. Plans and features live in the Clerk Dashboard.",
    items: [
      { name: "Stripe", tag: "0.7% + stripe", note: "Clerk development gateway for testing, your own Stripe account in production." },
      { name: "Pricing table", tag: "component", note: "<PricingTable /> renders plans for users or organizations." },
      { name: "Plan and feature gates", tag: "server", note: "has({ plan: 'pro' }) and has({ feature: 'seats' }) on the auth object." },
      { name: "Per-seat B2B plans", tag: "component", note: "Organization subscriptions with seat counts." },
      { name: "Subscription webhooks", tag: "svix", note: "subscription.*, subscriptionItem.* and paymentAttempt.* events." },
      { name: "Polar, Autumn, Dodo", note: "Not integrated. You would wire these yourself next to Clerk." },
    ],
  },
  {
    id: "ops",
    title: "Operations Clerk owns",
    description: "The trade for speed: these live on Clerk's infrastructure and follow Clerk's pricing.",
    items: [
      { name: "User store", note: "Hosted on Clerk in the US. Mirror to your database through webhooks. 1.2KB of metadata per user." },
      { name: "Email delivery", note: "Delivered by Clerk from accounts.dev in development and your domain after SPF and DKIM in production." },
      { name: "SMS delivery", note: "Clerk's SMS gateway, paid in production." },
      { name: "OAuth credentials in dev", note: "Shared development credentials mean Google or GitHub sign-in works on day one." },
      { name: "Session infrastructure", note: "Short lived JWTs refreshed by the Frontend API, satellite domains, session tasks." },
      { name: "Pricing", note: "Free to 50k monthly retained users, Pro from $25 a month, then per user and per add-on." },
    ],
  },
]

export const clerkVerdict: Verdict = {
  pros: [
    "Five to ten minutes from install to a working sign-in page with social providers.",
    "Prebuilt components for sign-in, profile, organizations and pricing that match your theme.",
    "Email, SMS, bot protection and breached-password checks are managed. No delivery to run.",
    "Enterprise SSO, SCIM and billing are dashboard features rather than code.",
  ],
  cons: [
    "Users live on Clerk. Your database holds a mirror kept fresh by webhooks.",
    "Production costs scale with retained users, organizations and add-ons.",
    "No EU data residency and no self-hosting option.",
    "Migrating away means exporting a CSV and re-verifying passkeys and OAuth links.",
  ],
}

export const clerkSamples: CodeSample[] = [
  {
    id: "proxy",
    title: "Proxy and provider",
    description:
      "clerkMiddleware() makes auth() available in every route. Nothing is protected by default. Next.js 16 calls this file proxy.ts, on 15 the same code lives in middleware.ts.",
    file: "src/proxy.ts",
    code: `
import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
}

// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
`,
  },
  {
    id: "components",
    title: "Prebuilt components",
    description: "The entire UI layer is four imports. Appearance is themed through the appearance prop or a theme package.",
    file: "src/app/(auth)/sign-in/[[...sign-in]]/page.tsx",
    code: `
import { SignIn, SignUp, UserButton, UserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

export default function SignInPage() {
  return <SignIn appearance={{ baseTheme: dark }} />
}

// header.tsx
import { Show, SignInButton, UserButton } from "@clerk/nextjs"

export function Header() {
  return (
    <header>
      <Show when="signed-out">
        <SignInButton mode="modal" />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </header>
  )
}
`,
  },
  {
    id: "server",
    title: "Server Component and server action",
    description:
      "auth() reads the session from the request. auth.protect() redirects in pages and returns 401 inside server actions.",
    file: "src/app/dashboard/page.tsx",
    code: `
import { auth, currentUser } from "@clerk/nextjs/server"

export default async function Page() {
  const { userId, has } = await auth.protect()
  const user = await currentUser()
  const canManage = has({ permission: "org:team_settings:manage" })
  return <h1>Hello {user?.firstName ?? userId}</h1>
}

// actions.ts
"use server"
import { auth } from "@clerk/nextjs/server"

export async function createPost(formData: FormData) {
  const { userId } = await auth.protect()
  await db.insert(posts).values({ ownerId: userId, title: String(formData.get("title")) })
}
`,
  },
  {
    id: "webhook",
    title: "Mirroring users into Neon",
    description:
      "Clerk stays the source of truth. A Svix-signed webhook keeps a users table in your database in sync for joins and reporting.",
    file: "src/app/api/webhooks/clerk/route.ts",
    code: `
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import type { NextRequest } from "next/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"

export async function POST(request: NextRequest) {
  const event = await verifyWebhook(request)

  if (event.type === "user.created" || event.type === "user.updated") {
    const email = event.data.email_addresses[0]?.email_address ?? ""
    await db
      .insert(profiles)
      .values({ clerkId: event.data.id, email })
      .onConflictDoUpdate({ target: profiles.clerkId, set: { email } })
  }

  if (event.type === "user.deleted" && event.data.id) {
    await db.delete(profiles).where(eq(profiles.clerkId, event.data.id))
  }

  return new Response("ok")
}
`,
  },
  {
    id: "billing",
    title: "Billing and organizations",
    description: "Plans are configured in the dashboard. Gating is a single has() call on the server or a <Show /> on the client.",
    file: "src/app/pricing/page.tsx",
    code: `
import { OrganizationSwitcher, PricingTable, Show } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

export default async function PricingPage() {
  const { has } = await auth()
  const isPro = has({ plan: "pro" })
  return (
    <section>
      <OrganizationSwitcher />
      {isPro ? null : <PricingTable for="organization" />}
      <Show when={{ feature: "advanced_reports" }} fallback={<p>Upgrade to unlock reports.</p>}>
        <Reports />
      </Show>
    </section>
  )
}
`,
  },
]

export const clerkStats = [
  { label: "Version", value: "@clerk/nextjs 7.9" },
  { label: "License", value: "Hosted SaaS" },
  { label: "Users live in", value: "Clerk (US)" },
  { label: "Setup", value: "5 to 10 min" },
]
