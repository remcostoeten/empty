"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Result } from "@/core/result"
import {
  anonymousAction,
  magicLinkAction,
  signInAction,
  signUpAction,
} from "@/modules/better-auth/api/actions"
import { FieldError } from "@/modules/better-auth/components/field-error"

type props = {
  userCount: number | null
}

function StatusLine({ state, success }: { state: Result<unknown> | null; success: string }) {
  if (!state) return null
  return (
    <p className={state.ok ? "text-xs text-muted-foreground" : "text-xs text-destructive"}>
      {state.ok ? success : state.error}
    </p>
  )
}

function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, null)
  const errors = state && !state.ok ? state.fieldErrors : undefined
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input name="name" placeholder="Name" autoComplete="name" aria-invalid={Boolean(errors?.name)} />
        <FieldError errors={errors?.name} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Input name="email" type="email" placeholder="Email" autoComplete="email" aria-invalid={Boolean(errors?.email)} />
        <FieldError errors={errors?.email} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Input name="password" type="password" placeholder="Password" autoComplete="new-password" aria-invalid={Boolean(errors?.password)} />
        <FieldError errors={errors?.password} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Creating account" : "Create account"}
      </Button>
      <StatusLine state={state} success="Account created." />
    </form>
  )
}

function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, null)
  const errors = state && !state.ok ? state.fieldErrors : undefined
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input name="email" type="email" placeholder="Email" autoComplete="email" aria-invalid={Boolean(errors?.email)} />
        <FieldError errors={errors?.email} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Input name="password" type="password" placeholder="Password" autoComplete="current-password" aria-invalid={Boolean(errors?.password)} />
        <FieldError errors={errors?.password} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in" : "Sign in"}
      </Button>
      <StatusLine state={state} success="Signed in." />
    </form>
  )
}

function MagicLinkForm() {
  const [state, action, pending] = useActionState(magicLinkAction, null)
  const errors = state && !state.ok ? state.fieldErrors : undefined
  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Input name="email" type="email" placeholder="Email" autoComplete="email" aria-invalid={Boolean(errors?.email)} />
        <FieldError errors={errors?.email} />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Sending" : "Send magic link"}
      </Button>
      <StatusLine state={state} success="Link logged to the server console. Wire sendMagicLink to a real provider." />
    </form>
  )
}

function AnonymousForm() {
  const [state, action, pending] = useActionState(anonymousAction, null)
  return (
    <form action={action}>
      <Button type="submit" variant="ghost" size="sm" disabled={pending}>
        {pending ? "Creating guest" : "Continue as guest"}
      </Button>
      <StatusLine state={state} success="Guest session created." />
    </form>
  )
}

export function AuthForms({ userCount }: props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live demo</CardTitle>
        <CardDescription>
          Real server actions against the auth_ tables. Nothing here goes through a client fetch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sign-up">
          <TabsList>
            <TabsTrigger value="sign-up">Sign up</TabsTrigger>
            <TabsTrigger value="sign-in">Sign in</TabsTrigger>
            <TabsTrigger value="magic-link">Magic link</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-up">
            <SignUpForm />
          </TabsContent>
          <TabsContent value="sign-in">
            <SignInForm />
          </TabsContent>
          <TabsContent value="magic-link">
            <MagicLinkForm />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <span className="text-xs text-muted-foreground">
          {userCount === null ? "Row count unavailable" : `${userCount} rows in auth_user`}
        </span>
        <AnonymousForm />
      </CardFooter>
    </Card>
  )
}
