import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import "./globals.css";
import { deriveFingerprint } from "@selfhosted/analytics-adapters";
import { ClientAnalytics } from "@/components/ClientAnalytics";
import { persistPageViews } from "@/app/actions/persist-analytics";

export const metadata: Metadata = {
  title: "Analytics Demo",
  description: "Next.js app wired to the self-hosted analytics MVP",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = headers();
  const fingerprint = deriveFingerprint({
    headers: headerList,
    projectId: "demo-next-app",
    secret: process.env.ANALYTICS_SECRET ?? "demo-secret",
  });

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <ClientAnalytics action={persistPageViews} fingerprint={fingerprint} />
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-10">
          <header className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 shadow-lg shadow-slate-900/40">
            <div className="text-lg font-semibold tracking-tight">Analytics demo</div>
            <nav className="flex gap-4 text-sm text-slate-200">
              <Link className="hover:text-white" href="/">
                Home
              </Link>
              <Link className="hover:text-white" href="/product">
                Product
              </Link>
              <Link className="hover:text-white" href="/docs">
                Docs
              </Link>
              <Link className="hover:text-white" href="/about">
                About
              </Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm text-slate-300">
            Page views are persisted locally via Server Actions + SQLite using the self-hosted analytics packages.
          </footer>
        </div>
      </body>
    </html>
  );
}
