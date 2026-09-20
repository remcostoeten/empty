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

const registration = credentials.extend({
  name: z.string().min(2, "Enter a name."),
})

const emailOnly = z.object({
  email: z.email("Enter a valid email."),
})

const empty = z.object({})

export const signUpAction = createAction(registration, async function run(input) {
  await auth.api.signUpEmail({
    body: { name: input.name, email: input.email, password: input.password },
    headers: await headers(),
  })
  redirect("/better-auth")
})

export const signInAction = createAction(credentials, async function run(input) {
  await auth.api.signInEmail({
    body: { email: input.email, password: input.password },
    headers: await headers(),
  })
  redirect("/better-auth")
})

export const anonymousAction = createAction(empty, async function run() {
  await auth.api.signInAnonymous({ headers: await headers() })
  redirect("/better-auth")
})

export const magicLinkAction = createAction(emailOnly, async function run(input) {
  await auth.api.signInMagicLink({
    body: { email: input.email, callbackURL: "/better-auth" },
    headers: await headers(),
  })
  return { email: input.email }
})

export const signOutAction = createAction(empty, async function run() {
  await auth.api.signOut({ headers: await headers() })
  redirect("/better-auth")
})
