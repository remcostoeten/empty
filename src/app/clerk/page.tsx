import type { Metadata } from "next"
import { PageShell } from "@/components/layout/page-shell"
import { SectionHeading } from "@/components/layout/section-heading"
import { ClerkShowcase, KeysNotice } from "@/modules/clerk/components"
import { clerkGroups, clerkSamples, clerkStats, clerkVerdict } from "@/modules/clerk/data/catalog"
import { FeatureList } from "@/modules/comparison/components/feature-list"
import { PageIntro } from "@/modules/comparison/components/page-intro"
import { SampleSection } from "@/modules/comparison/components/sample-section"
import { StatRow } from "@/modules/comparison/components/stat-row"
import { VerdictCard } from "@/modules/comparison/components/verdict-card"

export const metadata: Metadata = {
  title: "Clerk",
  description: "Hosted auth with prebuilt components: flows, platform features, billing and the code that wires it.",
}

export default function ClerkPage() {
  return (
    <PageShell className="flex flex-col gap-14">
      <PageIntro
        eyebrow="Option B · hosted"
        title="Clerk"
        description="A hosted identity platform with drop-in React components. Clerk keeps the user store, sends the email and SMS, and manages OAuth in development. Your database gets a mirror through webhooks."
        badges={["@clerk/nextjs 7", "proxy.ts", "prebuilt ui", "svix webhooks", "stripe billing"]}
      >
        <StatRow stats={clerkStats} />
      </PageIntro>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Components"
          title="Prebuilt UI"
          description="Sign in, sign up, the user button and the account profile. Themed to this palette through the appearance prop."
        />
        <KeysNotice />
        <ClerkShowcase />
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <VerdictCard {...clerkVerdict} />
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          <p className="font-mono text-[11px] uppercase tracking-wider text-gray-600">Managed for you</p>
          <p>Magic links and OTP emails are sent by Clerk. In development they come from accounts.dev, in production from your domain after DNS setup.</p>
          <p>Social providers work immediately with shared development credentials. Production still requires your own OAuth apps per provider.</p>
          <p>Bot protection, breached password checks, device trust and session lifetimes are dashboard toggles.</p>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Catalog"
          title="What it offers"
          description="Tags mark whether a feature is a dashboard toggle, a component, a server helper, or a paid tier."
        />
        <FeatureList groups={clerkGroups} />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Code"
          title="Integration surface"
          description="Everything you write for Clerk in a Next.js 16 app, from the proxy to a webhook that mirrors users into Neon."
        />
        <SampleSection samples={clerkSamples} />
      </section>
    </PageShell>
  )
}
