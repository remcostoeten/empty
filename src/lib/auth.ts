import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import {
  anonymous,
  haveIBeenPwned,
  lastLoginMethod,
  magicLink,
  username,
} from "better-auth/plugins"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  appName: "Auth Options",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    username(),
    anonymous(),
    magicLink({
      sendMagicLink: async function sendMagicLink({ email, url }) {
        console.info(`[magic-link] ${email} -> ${url}`)
      },
    }),
    haveIBeenPwned(),
    lastLoginMethod(),
    nextCookies(),
  ],
})

export type Session = typeof auth.$Infer.Session
