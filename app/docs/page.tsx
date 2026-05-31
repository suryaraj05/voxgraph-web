import type { Metadata } from "next";
import Link from "next/link";
import { docsNav } from "@/lib/docs-nav";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "VoxGraph developer documentation — voice AI starter kit with WebSocket audio, Deepgram STT/TTS, LLM, and episodic memory.",
};

export default function DocsIndexPage() {
  return (
    <>
      <h1>Documentation</h1>
      <p>
        VoxGraph is an open-source <strong>starter kit</strong> for building real-time voice assistants.
        You run the Python server, connect a client (included mic script or your own app), and extend
        the pipeline with your prompts, tools, and UI.
      </p>
      <p>
        This guide covers setup, the WebSocket protocol, configuration, memory, and how to customize
        the codebase for production experiments.
      </p>

      {docsNav.map((section) => (
        <div key={section.title}>
          <h2>{section.title}</h2>
          <ul>
            {section.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
                {link.description ? ` — ${link.description}` : ""}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
