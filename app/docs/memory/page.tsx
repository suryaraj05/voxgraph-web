import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory",
  description:
    "VoxGraph memory system: SQLite semantic facts, episodic conversation turns, Ollama chat history injection.",
};

export default function MemoryPage() {
  return (
    <>
      <h1>Memory</h1>
      <p>
        VoxGraph persists two kinds of memory in SQLite (<code>voxgraph.db</code>, gitignored).
        Both are loaded before every LLM call and injected into the prompt or chat history.
      </p>

      <h2>Semantic facts</h2>
      <p>Stable keyed facts extracted from user speech (name, preferences, location):</p>
      <ul>
        <li>Table: <code>semantic_facts</code> — <code>(user_id, fact_key, fact)</code></li>
        <li>Extracted via regex in <code>extract_facts_from_transcript()</code></li>
        <li>Example: &quot;My name is Raj&quot; → <code>User&apos;s name is Raj.</code></li>
        <li>Injected in the LLM system prompt as authoritative user facts</li>
      </ul>

      <h2>Episodic turns</h2>
      <p>Every completed exchange is appended as a user/assistant pair:</p>
      <ul>
        <li>Table: <code>episodic_turns</code> — user text, AI text, timestamp</li>
        <li>Rolling window: <code>EPISODIC_MAX_TURNS</code> (default 30)</li>
        <li>Character cap: <code>EPISODIC_MAX_CHARS</code> (default 12000) — oldest turns dropped first</li>
        <li>
          For Ollama: passed as alternating <code>user</code> / <code>assistant</code> messages in
          <code>/api/chat</code>
        </li>
        <li>For Gemini: formatted as a text block in the prompt</li>
      </ul>

      <h2>What the model sees</h2>
      <pre>{`System: You are VoxGraph…
        KNOWN FACTS: User's name is Raj.
        Conversation rules: stay on topic…

[user message history — turn 1, 2, … N-1]

User: <current utterance>`}</pre>

      <h2>Direct intents (no LLM)</h2>
      <p>
        High-confidence phrases in <code>voxgraph/voice/intents.py</code> (greetings, &quot;what is my name&quot;,
        &quot;who are you&quot;) bypass the LLM for speed and accuracy on small models.
      </p>

      <h2>Reset memory</h2>
      <p>Delete or rename <code>voxgraph.db</code> while the server is stopped. A fresh file is created on next run.</p>

      <h2>Extending</h2>
      <ul>
        <li>Add extraction patterns in <code>voxgraph/memory/store.py</code></li>
        <li>Call <code>MemoryStore.upsert_fact()</code> from your own tools</li>
        <li>Replace SQLite with Postgres/Redis for multi-user production (same interface idea)</li>
      </ul>
    </>
  );
}
