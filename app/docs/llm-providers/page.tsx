import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LLM providers",
  description: "Configure VoxGraph with Ollama local LLM or Google Gemini cloud API.",
};

export default function LlmProvidersPage() {
  return (
    <>
      <h1>LLM providers</h1>

      <h2>Ollama (recommended for development)</h2>
      <ul>
        <li>No API quota — runs on your GPU/CPU</li>
        <li>Full multi-turn chat history via <code>/api/chat</code></li>
        <li>Tune context with <code>OLLAMA_NUM_CTX</code> and reply length with <code>OLLAMA_NUM_PREDICT</code></li>
      </ul>
      <pre>{`LLM_PROVIDER=ollama
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_NUM_CTX=8192
OLLAMA_NUM_PREDICT=256`}</pre>
      <p>
        Smaller models (<code>llama3.2:1b</code>) are faster but weaker on context; 7B models balance
        quality and speed for voice demos.
      </p>

      <h2>Google Gemini</h2>
      <pre>{`LLM_PROVIDER=gemini
GOOGLE_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash`}</pre>
      <p>
        Uses a single prompt with episodic text block. Automatic model fallbacks if the primary model
        fails. Watch free-tier rate limits in production.
      </p>

      <h2>Customizing prompts</h2>
      <p>
        Edit <code>build_system_prompt()</code> and <code>build_gemini_prompt()</code> in{" "}
        <code>voxgraph/providers/llm.py</code>. The system prompt enforces:
      </p>
      <ul>
        <li>Assistant vs user identity (&quot;your name&quot; vs &quot;my name&quot;)</li>
        <li>Stay on the current conversation thread</li>
        <li>Voice-friendly reply length</li>
      </ul>
    </>
  );
}
