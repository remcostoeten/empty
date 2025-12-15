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
      <body className="app-body">
        <ClientAnalytics action={persistPageViews} fingerprint={fingerprint} />
        <div className="page-shell">
          <header className="app-header">
            <div className="brand">
              <span className="pill live">Live</span>
              <div>
                <div className="brand-title">Pulse analytics</div>
                <div className="brand-subtitle">Self-hosted Vercel-style analytics</div>
              </div>
            </div>
            <nav className="app-nav">
              <Link href="/">Home</Link>
              <Link href="/analytics">Analytics</Link>
              <Link href="/members">Members</Link>
              <Link href="/product">Modes</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/about">About</Link>
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            Page views are persisted locally via Server Actions + SQLite using the self-hosted analytics packages.
          </footer>
        </div>
      </body>
    </html>
  );
}
