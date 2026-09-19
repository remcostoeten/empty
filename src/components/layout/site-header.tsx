import Link from "next/link"
import { NavLinks } from "@/components/layout/nav-links"

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-sm font-medium">
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-4 fill-foreground"
      >
        <path d="M8 1 15 14H1L8 1Z" />
      </svg>
      <span>Auth Options</span>
    </Link>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <NavLinks />
      </div>
    </header>
  )
}
