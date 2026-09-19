"use client"

import { File } from "@pierre/diffs/react"
import type { FileContents } from "@pierre/diffs"
import { codeOptions } from "@/components/code/code-options"

type props = {
  file: FileContents
  prerenderedHTML: string
}

export function CodeFile({ file, prerenderedHTML }: props) {
  return <File file={file} options={codeOptions} prerenderedHTML={prerenderedHTML} disableWorkerPool />
}
