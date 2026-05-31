"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { site } from "@/lib/site";

const nav = [
  { label: "Try it", href: "/try" },
  { label: "Docs", href: "/docs" },
  { label: "Quick start", href: "/docs/quick-start" },
  { label: "GitHub", href: site.github, external: true },
];

type HeaderProps = {
  onMenuClick?: () => void;
  showMenu?: boolean;
};

export function Header({ onMenuClick, showMenu }: HeaderProps) {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith("/docs");

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-[20px]"
      style={{
        background: "rgba(4, 10, 20, 0.88)",
        borderColor: "var(--border-sidebar)",
        boxShadow: "0 1px 0 rgba(59, 130, 246, 0.06)",
        height: "var(--navbar-height)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {showMenu && isDocs && (
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border md:hidden"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              aria-label="Open docs menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-bright) 100%)",
              }}
            >
              V
            </span>
            <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {site.name}
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 sm:flex">
          {nav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <Link href="/docs/quick-start" className="btn-primary hidden sm:inline-flex">
          Get started
        </Link>
      </div>
    </header>
  );
}
