import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

type props = {
  eyebrow: string
  title: string
  description: string
  badges?: string[]
  children?: ReactNode
}

export function PageIntro({ eyebrow, title, description, badges = [], children }: props) {
  return (
    <div className="reveal flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-gray-600">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {badges.length ? (
        <div className="flex flex-wrap gap-1.5">
          {badges.map(function renderBadge(badge) {
            return (
              <Badge key={badge} variant="secondary" className="font-mono">
                {badge}
              </Badge>
            )
          })}
        </div>
      ) : null}
      {children}
    </div>
  )
}
