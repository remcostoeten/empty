import { PageShell } from "@/components/layout/page-shell"
import { SectionHeading } from "@/components/layout/section-heading"
import { ComparisonMatrix } from "@/modules/comparison/components/comparison-matrix"
import { OptionCard } from "@/modules/comparison/components/option-card"
import { PageIntro } from "@/modules/comparison/components/page-intro"
import { recommendation } from "@/modules/comparison/data/recommendation"

export default function OverviewPage() {
  return (
    <PageShell className="flex flex-col gap-14">
      <PageIntro
        eyebrow="Authentication for a Next.js SaaS"
        title="Two ways to own sign-in"
        description="Better Auth runs inside the app and writes users to your Neon Postgres through Drizzle. Clerk hosts the users and hands you components. Both pages below run real code so the trade-offs are concrete."
        badges={["next 16", "react 19", "server actions", "drizzle", "neon", "shadcn on base ui"]}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <OptionCard
          href="/better-auth"
          eyebrow="self-hosted"
          title="Better Auth"
          description="TypeScript framework with 50+ plugins. Your database, your email provider, MIT license."
          points={[
            "Users in auth_ prefixed tables on Neon",
            "Every flow is a plugin pair, server and client",
            "Payments via Stripe, Polar, Autumn or Dodo plugins",
          ]}
          delay={40}
        />
        <OptionCard
          href="/clerk"
          eyebrow="hosted"
          title="Clerk"
          description="Identity platform with prebuilt React components and a dashboard for every toggle."
          points={[
            "SignIn, SignUp, UserButton and UserProfile out of the box",
            "Email, SMS, OAuth in dev and bot protection are managed",
            "Users live on Clerk, your database holds a mirror",
          ]}
          delay={80}
        />
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeading
          eyebrow="Side by side"
          title="Concern by concern"
          description="Where each option puts the work, the data and the bill."
        />
        <ComparisonMatrix />
      </section>

      <section className="reveal flex flex-col gap-4 rounded-lg border border-border bg-card p-6" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
        <h2 className="text-base font-semibold tracking-tight">{recommendation.title}</h2>
        {recommendation.paragraphs.map(function renderParagraph(paragraph) {
          return (
            <p key={paragraph} className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          )
        })}
      </section>
    </PageShell>
  )
}
