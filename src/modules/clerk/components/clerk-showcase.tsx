import { SignIn, SignUp, UserButton, UserProfile } from "@clerk/nextjs"
import { hasClerkKeys } from "@/core/env"
import { ComponentFrame } from "@/modules/clerk/components/component-frame"
import { ComponentPlaceholder } from "@/modules/clerk/components/component-placeholder"
import { clerkAppearance } from "@/modules/clerk/data/appearance"

function LiveShowcase() {
  return (
    <>
      <ComponentFrame name="SignIn" importPath="@clerk/nextjs">
        <SignIn routing="hash" appearance={clerkAppearance} />
      </ComponentFrame>
      <ComponentFrame name="SignUp" importPath="@clerk/nextjs">
        <SignUp routing="hash" appearance={clerkAppearance} />
      </ComponentFrame>
      <ComponentFrame name="UserButton" importPath="@clerk/nextjs">
        <UserButton appearance={clerkAppearance} />
      </ComponentFrame>
      <ComponentFrame name="UserProfile" importPath="@clerk/nextjs">
        <UserProfile routing="hash" appearance={clerkAppearance} />
      </ComponentFrame>
    </>
  )
}

function StaticShowcase() {
  return (
    <>
      <ComponentFrame name="SignIn" importPath="@clerk/nextjs">
        <ComponentPlaceholder lines={["Continue with Google", "Email address", "Password", "Continue"]} />
      </ComponentFrame>
      <ComponentFrame name="SignUp" importPath="@clerk/nextjs">
        <ComponentPlaceholder lines={["First and last name", "Email address", "Password", "Create account"]} />
      </ComponentFrame>
      <ComponentFrame name="UserButton" importPath="@clerk/nextjs">
        <ComponentPlaceholder lines={["Avatar trigger", "Manage account", "Sign out"]} />
      </ComponentFrame>
      <ComponentFrame name="UserProfile" importPath="@clerk/nextjs">
        <ComponentPlaceholder lines={["Profile", "Email addresses", "Connected accounts", "Security"]} />
      </ComponentFrame>
    </>
  )
}

export function ClerkShowcase() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hasClerkKeys() ? <LiveShowcase /> : <StaticShowcase />}
    </div>
  )
}
