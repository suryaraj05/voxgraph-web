import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p style={{ color: "var(--text-muted)" }}>
              {site.name} — open-source voice AI starter kit. MIT License.
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Built by{" "}
              <a
                href={site.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {site.author}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            <Link href="/docs" className="nav-link">
              Documentation
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="nav-link">
              Backend repo
            </a>
            <a href={site.githubWeb} target="_blank" rel="noopener noreferrer" className="nav-link">
              Site repo
            </a>
            <a
              href={site.authorLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
