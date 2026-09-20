import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

type props = {
  name: string
  importPath: string
  children: ReactNode
}

export function ComponentFrame({ name, importPath, children }: props) {
  return (
    <section className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex items-center justify-between gap-3 border-b border-border-subtle px-4 py-2.5">
        <code className="font-mono text-xs">{`<${name} />`}</code>
        <Badge variant="outline" className="font-mono">
          {importPath}
        </Badge>
      </header>
      <div className="flex min-h-64 items-center justify-center bg-background p-6">{children}</div>
    </section>
  )
}
