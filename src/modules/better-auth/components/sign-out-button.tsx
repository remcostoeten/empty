"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/modules/better-auth/api/actions"

export function SignOutButton() {
  const [, action, pending] = useActionState(signOutAction, null)
  return (
    <form action={action}>
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Signing out" : "Sign out"}
      </Button>
    </form>
  )
}
