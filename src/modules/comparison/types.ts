import type { SupportedLanguages } from "@pierre/diffs"

export type Feature = {
  name: string
  note?: string
  tag?: string
}

export type FeatureGroup = {
  id: string
  title: string
  description?: string
  items: Feature[]
}

export type CodeSample = {
  id: string
  title: string
  description: string
  file: string
  code: string
  lang?: SupportedLanguages
}

export type Verdict = {
  pros: string[]
  cons: string[]
}

export type MatrixRow = {
  label: string
  betterAuth: string
  clerk: string
}
