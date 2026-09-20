import type { Metadata } from "next"
import { Suspense } from "react"
import { PageShell } from "@/components/layout/page-shell"
import { SectionHeading } from "@/components/layout/section-heading"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { SessionPanel } from "@/modules/better-auth/components"
import {
  betterAuthGroups,
  betterAuthSamples,
  betterAuthStats,
  betterAuthVerdict,
} from "@/modules/better-auth/data/catalog"
import { FeatureList } from "@/modules/comparison/components/feature-list"
import { PageIntro } from "@/modules/comparison/components/page-intro"
import { SampleSection } from "@/modules/comparison/components/sample-section"
import { StatRow } from "@/modules/comparison/components/stat-row"
import { VerdictCard } from "@/modules/comparison/components/verdict-card"

export const metadata: Metadata = {
  title: "Better Auth",
  description: "Self-hosted auth on Neon Postgres with Drizzle: flows, plugins, payments and the code that wires it.",
}

function PanelSkeleton() {
  return (
    <Card aria-busy="true">
      <CardHeader>
        <CardTitle className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-56 animate-pulse rounded bg-gray-100" />
      </CardHeader>
      <div className="flex flex-col gap-3 p-5 pt-0">
        <div className="h-9 animate-pulse rounded-md bg-gray-100" />
        <div className="h-9 animate-pulse rounded-md bg-gray-100" />
        <div className="h-9 animate-pulse rounded-md bg-gray-200" />
      </div>
    </Card>
  )
}

export default function BetterAuthPage() {
  return (
    <PageShell className="flex flex-col gap-14">
      <PageIntro
        eyebrow="Option A · self-hosted"
        title="Better Auth"
        description="A TypeScript auth framework that runs inside your Next.js app and writes to your own database. This page runs it for real against Neon Postgres through Drizzle, with every table prefixed auth_."
        badges={["better-auth 1.7", "drizzle-orm", "neon", "next-cookies", "zod"]}
      >
        <StatRow stats={betterAuthStats} />
      </PageIntro>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <VerdictCard {...betterAuthVerdict} />
        <Suspense fallback={<PanelSkeleton />}>
          <SessionPanel />
        </Suspense>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Catalog"
          title="What it offers"
          description="Hover a row for the plugin name or the table it adds. Tags show where the code comes from."
        />
        <FeatureList groups={betterAuthGroups} />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Code"
          title="Plumbing, end to end"
          description="The first five samples are the files this app actually runs. The last two show how the setup grows."
        />
        <SampleSection samples={betterAuthSamples} />
      </section>
    </PageShell>
  )
}
