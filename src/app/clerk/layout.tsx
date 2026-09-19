import { ClerkProvider } from "@clerk/nextjs"
import { hasClerkKeys } from "@/core/env"

export default function ClerkLayout({ children }: LayoutProps<"/clerk">) {
  if (!hasClerkKeys()) return children
  return <ClerkProvider>{children}</ClerkProvider>
}
