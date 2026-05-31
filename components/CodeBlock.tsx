"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-shell group">
      <div className="code-block-bar">
        <span>{language}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="inline-flex h-7 w-7 items-center justify-center rounded opacity-60 transition hover:opacity-100"
          style={{ color: "var(--text-muted)" }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="code-block-body">
        <code>{code}</code>
      </pre>
    </div>
  );
}
