import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Verdict } from "@/modules/comparison/types"

type props = Verdict

function VerdictColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[11px] uppercase tracking-wider text-gray-600">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map(function renderItem(item) {
          return (
            <li key={item} className="flex gap-2 text-sm leading-relaxed">
              <span aria-hidden="true" className="mt-[9px] size-1 shrink-0 rounded-full bg-gray-600" />
              <span>{item}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function VerdictCard({ pros, cons }: props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where it lands</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <VerdictColumn title="Strong" items={pros} />
        <VerdictColumn title="Weak" items={cons} />
      </CardContent>
    </Card>
  )
}
