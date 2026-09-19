import { preloadFile } from "@pierre/diffs/ssr"
import type { SupportedLanguages } from "@pierre/diffs"
import { CodeFile } from "@/components/code/code-file"
import { codeOptions } from "@/components/code/code-options"

type props = {
  name: string
  code: string
  lang?: SupportedLanguages
}

export async function CodeBlock({ name, code, lang }: props) {
  const preloaded = await preloadFile({
    file: { name, contents: code.trim(), lang },
    options: codeOptions,
  })
  return (
    <div className="diffs-shell overflow-hidden rounded-lg border border-border bg-background-elevated">
      <CodeFile file={preloaded.file} prerenderedHTML={preloaded.prerenderedHTML} />
    </div>
  )
}
