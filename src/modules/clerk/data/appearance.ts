import type { Appearance } from "@clerk/types"

export const clerkAppearance: Appearance = {
  variables: {
    colorBackground: "#0a0a0a",
    colorForeground: "#ededed",
    colorPrimary: "#ededed",
    colorPrimaryForeground: "#0a0a0a",
    colorInput: "#0a0a0a",
    colorInputForeground: "#ededed",
    colorBorder: "#2e2e2e",
    colorMuted: "#1a1a1a",
    colorMutedForeground: "#a1a1a1",
    colorNeutral: "#ededed",
    colorDanger: "#e5484d",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-geist-sans)",
  },
  elements: {
    cardBox: { boxShadow: "none", border: "1px solid #2e2e2e" },
    footer: { background: "#0a0a0a" },
  },
}
