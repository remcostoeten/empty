import type { MatrixRow } from "@/modules/comparison/types"

export const matrixRows: MatrixRow[] = [
  { label: "Where users live", betterAuth: "Your Postgres, auth_ tables", clerk: "Clerk, mirrored by webhook" },
  { label: "Setup to first sign-in", betterAuth: "30 to 60 minutes", clerk: "5 to 10 minutes" },
  { label: "Prebuilt UI", betterAuth: "None, bring shadcn", clerk: "SignIn, SignUp, UserButton, UserProfile, PricingTable" },
  { label: "Magic link and OTP email", betterAuth: "Your provider via callback", clerk: "Sent by Clerk" },
  { label: "OAuth in development", betterAuth: "Register apps yourself", clerk: "Shared dev credentials" },
  { label: "SMS", betterAuth: "Your provider via callback", clerk: "Clerk gateway, paid in production" },
  { label: "Bot protection", betterAuth: "captcha() plugin, your Turnstile keys", clerk: "Managed CAPTCHA toggle" },
  { label: "Breached passwords", betterAuth: "haveIBeenPwned() plugin", clerk: "Dashboard toggle" },
  { label: "Organizations", betterAuth: "organization() plugin, free", clerk: "Built in, custom roles need the B2B add-on" },
  { label: "Billing", betterAuth: "Stripe, Polar, Autumn, Dodo plugins", clerk: "Clerk Billing on Stripe, 0.7% fee" },
  { label: "Enterprise SSO and SCIM", betterAuth: "@better-auth/sso and scim", clerk: "Pro plan connections" },
  { label: "Admin UI", betterAuth: "Build it or pay for Infrastructure", clerk: "Dashboard included" },
  { label: "Data residency", betterAuth: "Wherever Neon runs, EU available", clerk: "US only" },
  { label: "Cost at 100k users", betterAuth: "Database and email only", clerk: "Pro plus roughly $0.02 per retained user above 50k" },
  { label: "Leaving", betterAuth: "Nothing to export", clerk: "CSV export with password hashes" },
]
