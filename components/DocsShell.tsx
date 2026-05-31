"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { DocsSidebar } from "@/components/DocsSidebar";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="docs-layout">
      <Header showMenu onMenuClick={() => setMenuOpen((v) => !v)} />
      <DocsSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="docs-content-area">
        <div className="docs-content-glow" aria-hidden />
        <article className="prose-docs docs-content-inner">{children}</article>
      </div>
    </div>
  );
}
