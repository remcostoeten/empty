import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { FeatureGroup } from "@/modules/comparison/types"

type props = {
  groups: FeatureGroup[]
}

export function FeatureList({ groups }: props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(function renderGroup(group, index) {
        return (
          <section
            key={group.id}
            id={group.id}
            className="reveal flex scroll-mt-24 flex-col rounded-lg border border-border bg-card"
            style={{ "--reveal-delay": `${index * 40}ms` } as React.CSSProperties}
          >
            <header className="flex flex-col gap-1 border-b border-border-subtle px-5 py-4">
              <h3 className="text-sm font-medium">{group.title}</h3>
              {group.description ? (
                <p className="text-xs leading-relaxed text-muted-foreground">{group.description}</p>
              ) : null}
            </header>
            <ul className="flex flex-col divide-y divide-border-subtle">
              {group.items.map(function renderItem(item) {
                return (
                  <li key={item.name} className="flex items-center justify-between gap-3 px-5 py-2.5">
                    {item.note ? (
                      <Tooltip>
                        <TooltipTrigger className="cursor-default text-left text-sm decoration-gray-500 decoration-dotted underline-offset-4 hover:underline">
                          {item.name}
                        </TooltipTrigger>
                        <TooltipContent>{item.note}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="text-sm">{item.name}</span>
                    )}
                    {item.tag ? (
                      <Badge variant="outline" className="font-mono">
                        {item.tag}
                      </Badge>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
