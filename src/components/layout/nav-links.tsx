"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Overview" },
  { href: "/better-auth", label: "Better Auth" },
  { href: "/clerk", label: "Clerk" },
] as const

export function NavLinks() {
  const pathname = usePathname()
  return (
    <nav className="flex items-center gap-1">
      {links.map(function renderLink(link) {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ease-out",
              active
                ? "bg-gray-100 text-foreground"
                : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
