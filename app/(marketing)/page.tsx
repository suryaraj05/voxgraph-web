import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { TerminalBlock } from "@/components/TerminalBlock";
import { PipelineDiagram } from "@/components/PipelineDiagram";
import { PinnedCards } from "@/components/PinnedCards";
import { HeroVisual } from "@/components/HeroVisual";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — open-source voice AI starter kit by ${site.author}`,
  description: site.description,
  path: "/",
  keywords: ["VoxGraph official site", "try VoxGraph demo", "voice AI starter kit GitHub"],
});

const stack = [
  "FastAPI",
  "Deepgram STT",
  "Deepgram Aura TTS",
  "Ollama / Gemini",
  "SQLite",
  "WebSockets",
];

export default function HomePage() {
  return (
    <>
      <section className="neon-section hero-grid flex min-h-[calc(100vh-var(--navbar-height))] flex-col justify-center px-4 pb-20 pt-12 sm:px-6">
        <div className="neon-section-glow" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <p className="mb-5 font-mono text-xs tracking-wide text-accent-bright sm:text-sm">
              Open source · MIT · Python 3.10+ · by{" "}
              <a
                href={site.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-accent/40 underline-offset-2 hover:decoration-accent-bright"
              >
                {site.author}
              </a>
            </p>
            <h1 className="section-title max-w-3xl text-[36px] leading-[1.15] sm:text-[44px] lg:text-[52px]">
              Voice AI pipeline you can fork, not rebuild
            </h1>
            <p className="mt-6 max-w-[540px] text-base leading-relaxed text-muted sm:text-lg">
              {site.description} Clone the repo, add your API keys, then customize STT, LLM,
              TTS, memory, and your client.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/try" className="btn-primary">
                Try it live
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs/quick-start" className="btn-ghost">
                Quick start
              </Link>
              <Link href="/docs" className="btn-ghost">
                Read the docs
              </Link>
            </div>
            <TerminalBlock />
          </div>

          <div className="hidden justify-center lg:flex">
            <HeroVisual />
          </div>
        </div>
      </section>

      <PipelineDiagram />
      <PinnedCards />

      <section className="neon-section px-4 py-24 sm:px-6">
        <div className="neon-section-glow" aria-hidden />
        <div className="relative mx-auto max-w-[1400px]">
          <h2 className="section-title mb-3 text-3xl">Stack</h2>
          <p className="mb-8 max-w-xl text-muted">
            Everything you need to run a voice agent locally or in production.
          </p>
          <div className="flex flex-wrap gap-3">
            {stack.map((item) => (
              <span key={item} className="stack-pill">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-10 max-w-xl leading-relaxed text-muted">
            VoxGraph is a <strong className="font-medium text-primary">starter kit</strong>, not a
            hosted product. Clone the repo, add your API keys, then customize prompts, voice
            intents, memory, and your front-end.
          </p>
          <Link
            href="/docs/customize"
            className="mt-5 inline-flex items-center gap-1 text-sm text-accent-bright hover:underline"
          >
            How to extend <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </>
  );
}
