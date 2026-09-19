import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasClerkKeys } from "@/core/env"

export function KeysNotice() {
  if (hasClerkKeys()) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Components render live once keys are set</CardTitle>
        <CardDescription>
          Run npx clerk@latest init --framework next, or paste NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY into .env. The frames below then mount the real Clerk components inside ClerkProvider.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
