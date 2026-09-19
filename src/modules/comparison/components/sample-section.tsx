import { CodeBlock } from "@/components/code/code-block"
import type { CodeSample } from "@/modules/comparison/types"

type props = {
  samples: CodeSample[]
}

export function SampleSection({ samples }: props) {
  return (
    <div className="flex flex-col gap-10">
      {samples.map(function renderSample(sample) {
        return (
          <article key={sample.id} id={sample.id} className="flex scroll-mt-24 flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">{sample.title}</h3>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{sample.description}</p>
            </div>
            <CodeBlock name={sample.file} code={sample.code} lang={sample.lang} />
          </article>
        )
      })}
    </div>
  )
}
