type Stat = {
  label: string
  value: string
}

type props = {
  stats: Stat[]
}

export function StatRow({ stats }: props) {
  return (
    <dl className="grid grid-cols-2 divide-y divide-border-subtle overflow-hidden rounded-lg border border-border sm:grid-cols-4 sm:divide-x sm:divide-y-0">
      {stats.map(function renderStat(stat) {
        return (
          <div key={stat.label} className="flex flex-col gap-1 bg-card px-4 py-3">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-gray-600">{stat.label}</dt>
            <dd className="text-sm font-medium">{stat.value}</dd>
          </div>
        )
      })}
    </dl>
  )
}
