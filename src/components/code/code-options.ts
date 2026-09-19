import type { FileOptions } from "@pierre/diffs/react"

export const codeOptions: FileOptions<undefined, undefined> = {
  theme: "vesper",
  themeType: "dark",
  overflow: "scroll",
  disableFileHeader: false,
  unsafeCSS: `
    [data-file] { --diffs-font-size: 12.5px; --diffs-line-height: 20px; --diffs-dark-bg: #0a0a0a; --diffs-font-family: var(--font-geist-mono), ui-monospace, monospace; }
    [data-diffs-header] { font-size: 12px; padding: 8px 12px; background: #0a0a0a; border-bottom: 1px solid #1f1f1f; }
  `,
}
