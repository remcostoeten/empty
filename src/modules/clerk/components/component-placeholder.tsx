type props = {
  lines: string[]
}

export function ComponentPlaceholder({ lines }: props) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-3 rounded-lg border border-dashed border-border p-5">
      {lines.map(function renderLine(line, index) {
        return (
          <div
            key={line}
            className="flex flex-col gap-1.5"
            style={{ opacity: 1 - index * 0.15 }}
          >
            <span className="font-mono text-[11px] text-gray-600">{line}</span>
            <span className="h-8 rounded-md bg-gray-100" />
          </div>
        )
      })}
    </div>
  )
}
