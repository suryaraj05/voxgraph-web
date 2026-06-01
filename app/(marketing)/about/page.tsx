import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site, absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `${site.author} — creator of ${site.name} (open-source voice AI)`,
  description: `${site.authorFullName} (${site.author}) built ${site.name} — an open-source real-time voice AI starter kit in Python. Try the demo, read docs, and explore projects by Surya Raj.`,
  path: "/about",
  keywords: [
    "Surya Raj Salve",
    "Salve Surya Raj",
    "SuryaRaj",
    "projects by Surya Raj",
    "VoxGraph creator",
    "open source developer India",
  ],
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="mb-3 font-mono text-xs tracking-wide text-accent-bright">About</p>
      <h1 className="section-title text-3xl sm:text-4xl">
        {site.author} — {site.name}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">
        Hi, I&apos;m <strong>{site.authorFullName}</strong> (also indexed as{" "}
        <strong>Salve Surya Raj</strong>, <strong>SuryaRaj</strong>, and related name spellings).
        I built <strong>{site.name}</strong> — an open-source{" "}
        <strong>voice AI starter kit</strong> for developers who want a real pipeline to fork, not a
        black-box API.
      </p>

      <h2 className="mt-10 text-xl font-semibold">What is VoxGraph?</h2>
      <p className="mt-3 leading-relaxed text-muted">
        <Link href="/">{site.name}</Link> is a production-shaped voice loop: microphone → Deepgram
        STT → LLM (Gemini or Ollama) → TTS → audio back over WebSocket. It includes episodic memory,
        barge-in, a browser demo at <Link href="/try">/try</Link>, a terminal mic client, Docker, and
        Render deploy support.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Projects by {site.author}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
        <li>
          <strong>{site.name}</strong> — voice AI starter kit (this site +{" "}
          <a href={site.github} target="_blank" rel="noopener noreferrer">
            Python backend on GitHub
          </a>
          )
        </li>
        <li>
          <a href={site.githubWeb} target="_blank" rel="noopener noreferrer">
            voxgraph-web
          </a>{" "}
          — documentation and marketing site (Next.js, open source)
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Find me</h2>
      <ul className="mt-3 space-y-2 text-muted">
        <li>
          GitHub:{" "}
          <a href={site.authorUrl} target="_blank" rel="noopener noreferrer me">
            {site.authorUrl.replace("https://", "")}
          </a>
        </li>
        <li>
          LinkedIn:{" "}
          <a href={site.authorLinkedIn} target="_blank" rel="noopener noreferrer me">
            salve-surya-raj
          </a>
        </li>
        <li>
          Live demo: <Link href="/try">{absoluteUrl("/try")}</Link>
        </li>
        <li>
          Docs: <Link href="/docs">{absoluteUrl("/docs")}</Link>
        </li>
        <li>
          Build log (51 backend bugs): <Link href="/docs/build-log">/docs/build-log</Link>
        </li>
      </ul>

      <p className="mt-10 text-sm text-muted">
        Search terms: VoxGraph, voxgraph, voice AI starter kit, open source voice assistant,{" "}
        {site.author}, {site.authorFullName}, Salve Surya Raj, SuryaRaj Salve.
      </p>
    </div>
  );
}
