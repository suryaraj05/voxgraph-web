import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p style={{ color: "var(--text-muted)" }}>
          {site.name} — open-source voice AI starter kit. MIT License.
        </p>
        <div className="flex gap-6">
          <Link href="/docs" className="nav-link">
            Documentation
          </Link>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="nav-link">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
