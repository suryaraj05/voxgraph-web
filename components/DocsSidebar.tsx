"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";

type DocsSidebarProps = {
  open?: boolean;
  onNavigate?: () => void;
};

export function DocsSidebar({ open = false, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={onNavigate}
        />
      )}
      <aside className={`docs-sidebar-panel ${open ? "open" : ""}`}>
        <nav>
          {docsNav.map((section) => (
            <div key={section.title}>
              <p className="sidebar-section-label">{section.title}</p>
              <ul className="space-y-0.5">
                {section.links.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onNavigate}
                        className={`sidebar-link ${active ? "active" : ""}`}
                      >
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
