import type { Metadata } from "next";
import Link from "next/link";
import {
  buildLogCategories,
  buildLogEntryCount,
  operationalNotes,
} from "@/lib/voxgraph-build-log";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Build log — bugs & fixes",
  description:
    "Real mistakes, errors, and fixes from building the VoxGraph Python backend — a reference for future debugging.",
};

export default function BuildLogPage() {
  return (
    <>
      <h1>Build log — bugs &amp; fixes</h1>
      <p>
        A chronological knowledge base of <strong>{buildLogEntryCount} real issues</strong> hit while
        building the{" "}
        <a href={site.github} target="_blank" rel="noopener noreferrer">
          VoxGraph Python backend
        </a>
        . Not the marketing site — the voice server, WebSocket pipeline, STT/LLM/TTS, and memory
        layer.
      </p>
      <p>
        Use this when something feels familiar: search this page (<kbd>Ctrl+F</kbd>) or jump to a
        category below. Each entry has <strong>symptom → cause → fix → files</strong>.
      </p>

      <div className="build-log-toc neon-card my-8 rounded-xl p-5 sm:p-6">
        <h2 className="!mt-0 text-base font-semibold">On this page</h2>
        <ul className="build-log-toc-list">
          {buildLogCategories.map((cat) => (
            <li key={cat.slug}>
              <a href={`#${cat.slug}`}>
                {cat.title}
                <span className="build-log-count">{cat.entries.length}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#operational">Operational notes</a>
          </li>
        </ul>
      </div>

      {buildLogCategories.map((cat) => (
        <section key={cat.slug} id={cat.slug} className="build-log-section">
          <h2>{cat.title}</h2>
          {cat.entries.map((entry) => (
            <article key={entry.id} id={`issue-${entry.id}`} className="build-log-entry neon-card">
              <header className="build-log-entry-header">
                <span className="build-log-id">#{entry.id}</span>
                <h3>{entry.title}</h3>
              </header>
              <dl className="build-log-dl">
                <div>
                  <dt>Symptom</dt>
                  <dd>{entry.symptom}</dd>
                </div>
                <div>
                  <dt>Root cause</dt>
                  <dd>{entry.cause}</dd>
                </div>
                <div>
                  <dt>Fix</dt>
                  <dd>{entry.fix}</dd>
                </div>
                {entry.files.length > 0 && (
                  <div>
                    <dt>Files</dt>
                    <dd>
                      <ul className="build-log-files">
                        {entry.files.map((f) => (
                          <li key={f}>
                            <code>{f}</code>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </section>
      ))}

      <section id="operational" className="build-log-section">
        <h2>Operational notes</h2>
        <p>Not code bugs — recurring gotchas worth remembering:</p>
        <ul>
          {operationalNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="build-log-section">
        <h2>Related docs</h2>
        <ul>
          <li>
            <Link href="/docs/architecture">Architecture</Link> — how the pipeline fits together today
          </li>
          <li>
            <Link href="/docs/configuration">Configuration</Link> — env vars referenced in many fixes
          </li>
          <li>
            <Link href="/docs/websocket-api">WebSocket API</Link> — protocol and JSON events
          </li>
          <li>
            <Link href="/docs/customize">Customize</Link> — where to extend after bugs are fixed
          </li>
        </ul>
      </section>
    </>
  );
}
