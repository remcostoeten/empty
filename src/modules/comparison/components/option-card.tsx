import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type props = {
  href: string
  eyebrow: string
  title: string
  description: string
  points: string[]
  delay: number
}

export function OptionCard({ href, eyebrow, title, description, points, delay }: props) {
  return (
    <Link
      href={href}
      className="reveal press group flex flex-col gap-5 rounded-lg border border-border bg-card p-6 transition-colors duration-150 ease-out hover:border-gray-500"
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        <Badge variant="muted" className="font-mono">
          {eyebrow}
        </Badge>
        <span
          aria-hidden="true"
          className="text-gray-600 transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ul className="mt-auto flex flex-col gap-1.5 border-t border-border-subtle pt-4">
        {points.map(function renderPoint(point) {
          return (
            <li key={point} className="flex gap-2 text-sm">
              <span aria-hidden="true" className="mt-[9px] size-1 shrink-0 rounded-full bg-gray-600" />
              <span>{point}</span>
            </li>
          )
        })}
      </ul>
    </Link>
  )
}
