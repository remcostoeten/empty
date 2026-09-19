type props = {
  eyebrow?: string
  title: string
  description?: string
  id?: string
}

export function SectionHeading({ eyebrow, title, description, id }: props) {
  return (
    <div id={id} className="flex scroll-mt-20 flex-col gap-2">
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-wider text-gray-600">{eyebrow}</p>
      ) : null}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
