import "server-only"
import { headers } from "next/headers"
import { count } from "drizzle-orm"
import { createQuery } from "@/core/create-query"
import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getSession = createQuery("Could not read the session.", async function run() {
  return auth.api.getSession({ headers: await headers() })
})

export const getUserCount = createQuery("Database unavailable.", async function run() {
  const [row] = await db.select({ total: count() }).from(user)
  return row?.total ?? 0
})
