import Link from "next/link"
import { matrixRows } from "@/modules/comparison/data/matrix"

export function ComparisonMatrix() {
  return (
    <div className="reveal overflow-hidden rounded-lg border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-background-elevated text-left">
            <th className="w-1/4 px-4 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-gray-600">
              Concern
            </th>
            <th className="px-4 py-3 font-medium">
              <Link href="/better-auth" className="underline-offset-4 hover:underline">
                Better Auth
              </Link>
            </th>
            <th className="px-4 py-3 font-medium">
              <Link href="/clerk" className="underline-offset-4 hover:underline">
                Clerk
              </Link>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {matrixRows.map(function renderRow(row) {
            return (
              <tr key={row.label} className="transition-colors duration-150 ease-out hover:bg-gray-100/60">
                <th scope="row" className="px-4 py-3 text-left font-normal text-muted-foreground">
                  {row.label}
                </th>
                <td className="px-4 py-3">{row.betterAuth}</td>
                <td className="px-4 py-3">{row.clerk}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
