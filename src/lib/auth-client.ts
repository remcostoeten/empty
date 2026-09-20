import { createAuthClient } from "better-auth/react"
import {
  anonymousClient,
  lastLoginMethodClient,
  magicLinkClient,
  usernameClient,
} from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [usernameClient(), anonymousClient(), magicLinkClient(), lastLoginMethodClient()],
})
