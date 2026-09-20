export function SiteFooter() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Feature lists follow the vendor docs as of September 2026. Verify pricing before committing.</p>
        <p className="font-mono">Next.js 16 · Better Auth 1.7 · Clerk 7 · Drizzle · Neon</p>
      </div>
    </footer>
  )
}
