export type BuildLogEntry = {
  id: number;
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  files: string[];
};

export type BuildLogCategory = {
  slug: string;
  title: string;
  entries: BuildLogEntry[];
};

/** Real bugs and fixes from building the VoxGraph Python backend (voxgraph repo). */
export const buildLogCategories: BuildLogCategory[] = [
  {
    slug: "tts",
    title: "TTS — ElevenLabs & Deepgram",
    entries: [
      {
        id: 1,
        title: "ElevenLabs free-tier policy violation (WebSocket 1008)",
        symptom:
          "STT and Gemini succeed; TTS fails with `1008 (policy violation) Unusual activity detected. Free Tier usage disabled`.",
        cause:
          "ElevenLabs blocked the account server-side (anti-abuse). Not an app bug — often VPN, shared IP, or usage patterns. Rotating API keys does not help.",
        fix:
          "Switch to Deepgram Aura TTS (`TTS_PROVIDER=deepgram`). Optionally appeal via ElevenLabs support. Added multi-provider TTS with `auto` fallback.",
        files: ["voxgraph/providers/tts.py", "voxgraph/core/settings.py", ".env"],
      },
      {
        id: 2,
        title: "New ElevenLabs key seemed ignored (“cached .env”)",
        symptom: "Changed API key in `.env` but same ElevenLabs error after save.",
        cause:
          "`.env` is read once at process start. Old uvicorn process still running. `load_dotenv()` without explicit path could miss repo-root `.env`. Shell env vars can override file values.",
        fix:
          "Pin env file to repo root (`voxgraph/core/paths.py` + `settings.py`), use `load_dotenv(..., override=True)`, print masked key at startup, restart uvicorn, clear `Env:ELEVENLABS_API_KEY` in PowerShell if set.",
        files: ["voxgraph/core/settings.py", "voxgraph/core/paths.py"],
      },
      {
        id: 3,
        title: "No TTS fallback when ElevenLabs unavailable",
        symptom: "Pipeline dead-ended whenever ElevenLabs failed.",
        cause: "Only ElevenLabs WebSocket TTS was wired.",
        fix:
          "Added `resolve_tts_provider()` and Deepgram Aura HTTP streaming. Env: `TTS_PROVIDER=auto|elevenlabs|deepgram|none`.",
        files: ["voxgraph/providers/tts.py"],
      },
      {
        id: 4,
        title: "Deepgram TTS disconnect — silent failure in mic client",
        symptom:
          "LLM returns text; user hears nothing. Server may show `Server disconnected without sending a response`.",
        cause: "Intermittent Deepgram TTS API errors; no retries or client notification.",
        fix:
          "Added `TtsPlaybackError`, 3-attempt retry with fresh HTTP connection, JSON events (`tts_failed`, `speaking`, `ready`) via `transport/events.py`.",
        files: ["voxgraph/providers/tts.py", "voxgraph/transport/events.py", "scripts/live_mic_client.py"],
      },
      {
        id: 5,
        title: "TTS bytes logged but client hears nothing",
        symptom: "Server logs `[tts] sent N bytes`; mic client shows no audio received.",
        cause:
          "Concurrent WebSocket sends from LLM/TTS background task while main loop blocked in `receive_bytes()` — outbound frames dropped or stalled.",
        fix:
          "Introduced `WsOutbound` — single sender task serializing all `send_bytes()` / `send_text()` through an asyncio queue.",
        files: ["voxgraph/transport/outbound.py", "voxgraph/api/audio.py", "voxgraph/providers/tts.py"],
      },
      {
        id: 6,
        title: "Word-by-word TTS (robotic speech)",
        symptom: "Logs show many tiny TTS calls: `'It's going'`, `'well,'`, `'thanks!'` — choppy voice.",
        cause:
          "Over-aggressive latency tuning: `TTS_MIN_PHRASE_CHARS` too low (~6–8), debounce 50ms, endpointing 120ms.",
        fix:
          "Reverted to sentence/clause batching (~12+ chars), debounce `0.12s`, endpointing `180ms` in demo mode.",
        files: ["voxgraph/providers/tts.py", "voxgraph/core/settings.py", ".env"],
      },
      {
        id: 7,
        title: "Long delay before first spoken word",
        symptom: "Noticeable lag between LLM start and first audio.",
        cause: "TTS buffered until full sentences; new HTTP client per phrase.",
        fix:
          "Phrase/clause streaming, shared `httpx.AsyncClient`, pipelined synthesis, `TTS_MIN_PHRASE_CHARS`, connection keepalive.",
        files: ["voxgraph/providers/tts.py"],
      },
      {
        id: 8,
        title: "ElevenLabs return type — no “audio sent” signal",
        symptom: "Hard to detect TTS failure vs success in pipeline.",
        cause: "Stream function returned only text string.",
        fix: "Return tuple `(text, saw_audio: bool)` for error handling paths.",
        files: ["voxgraph/pipeline/elevenlabs.py", "voxgraph/providers/tts.py"],
      },
    ],
  },
  {
    slug: "env-config",
    title: "Environment & configuration",
    entries: [
      {
        id: 9,
        title: "Shell env overrides `.env` (STT_ONLY mismatch)",
        symptom: "Server behaves like `STT_ONLY=1` while `.env` says `0`.",
        cause: "PowerShell/session env vars override unless `load_dotenv(override=True)` with explicit file path.",
        fix: "Pinned `.env` path + `override=True` + startup log showing effective config.",
        files: ["voxgraph/core/settings.py"],
      },
      {
        id: 10,
        title: "Editing `.env` while server running has no effect",
        symptom: "Changed keys in `.env`; behavior unchanged.",
        cause: "Environment loaded once at import/startup.",
        fix: "Stop uvicorn (`Ctrl+C`) and restart. For hosted: use `/config/apply` or redeploy.",
        files: [],
      },
      {
        id: 11,
        title: "Gemini `gemini-flash-latest` → 429 quota errors",
        symptom: "Long pauses; HTTP 429 from Gemini; ~7s retry backoff.",
        cause: "Unstable model alias hitting free-tier limits.",
        fix: "Default to `gemini-2.5-flash`; document Ollama as unlimited local alternative.",
        files: ["voxgraph/providers/llm.py", ".env.example"],
      },
      {
        id: 12,
        title: "Gemini free-tier exhausted during testing",
        symptom: "Quota errors after heavy dev/testing.",
        cause: "Google AI free-tier rate limits.",
        fix: "Added `LLM_PROVIDER=ollama` for local unlimited dev.",
        files: ["voxgraph/providers/llm.py", ".env.example"],
      },
      {
        id: 13,
        title: "Setup wizard ignored server `.env` keys",
        symptom: "Online/local setup forced re-entering keys already on server.",
        cause: "`/config/test` only validated submitted form keys.",
        fix: "`/config/test` falls back to server env when form fields empty; local mode skips wizard.",
        files: ["voxgraph/api/config.py", "voxgraph/core/runtime_config.py"],
      },
      {
        id: 14,
        title: "`/config/apply` did not refresh running pipeline",
        symptom: "Applied keys via HTTP but STT/LLM still used old values.",
        cause: "Module-level globals not reloaded after `os.environ` update.",
        fix: "`settings.reload()` + `reload_voxgraph_globals()` after apply.",
        files: ["voxgraph/core/settings.py", "voxgraph/core/runtime_config.py"],
      },
    ],
  },
  {
    slug: "websocket-stt",
    title: "WebSocket, STT & utterance handling",
    entries: [
      {
        id: 15,
        title: "Turn-based mic — Enter required every turn",
        symptom: "Not conversational; had to press Enter after each reply.",
        cause: "`live_mic_client.py` was half-duplex / turn-based.",
        fix: "Continuous streaming mic + background TTS playback + barge-in + mic ducking during AI speech.",
        files: ["scripts/live_mic_client.py"],
      },
      {
        id: 16,
        title: "Continuous mode: STT fires but LLM never runs",
        symptom: "Transcripts appear; no AI reply until WebSocket disconnects.",
        cause:
          "Debounce waited for silence since last **audio byte**. Continuous mic never stops → timer never completes.",
        fix: "Debounce on **`last_utterance_at`** (time since last `speech_final` from Deepgram), not last PCM chunk.",
        files: ["voxgraph/voice/utterance.py", "voxgraph/api/audio.py"],
      },
      {
        id: 17,
        title: "Giant merged prompt only on disconnect",
        symptom: "All utterances merged into one prompt when client closes.",
        cause: "Same debounce bug as #16 — pipeline only flushed on disconnect.",
        fix: "Fixed utterance debounce timing (#16).",
        files: ["voxgraph/voice/utterance.py"],
      },
      {
        id: 18,
        title: "Echo stacking in utterance merge",
        symptom:
          "`Debounced utterance (merged): Hello. Hello? Hello, VoxGraph.` + cancelling previous response.",
        cause: "Speaker echo → multiple STT segments concatenated in one debounce window.",
        fix: "Stage **best single utterance** per window instead of concatenating all fragments. Use headphones.",
        files: ["voxgraph/voice/utterance.py"],
      },
      {
        id: 19,
        title: "STT active during AI playback (spurious turns)",
        symptom: "Empty or `Hello?` transcripts while assistant is speaking.",
        cause: "Deepgram processed mic audio including speaker echo during TTS.",
        fix: "Gate STT when `_ai_is_responding()` unless `_is_likely_barge_in()` (≥3 words or ≥12 chars).",
        files: ["voxgraph/voice/utterance.py", "voxgraph/api/audio.py"],
      },
      {
        id: 20,
        title: "Endpointing too aggressive — split questions",
        symptom: "One question triggers multiple LLM calls (“can you tell what” + “sport I wanted”).",
        cause: "`DEEPGRAM_ENDPOINTING_MS=100` in aggressive demo tuning.",
        fix: "Raised to `180ms`; interim transcript stitching in merge logic.",
        files: ["voxgraph/voice/utterance.py", "voxgraph/core/settings.py", ".env"],
      },
      {
        id: 21,
        title: "Mic client ignored server JSON events",
        symptom: "No `Thinking…` / `Speaking…` / error lines in terminal.",
        cause: "Client loop did not parse text JSON frames from server.",
        fix: "Added `parse_client_event()` / `print_client_event()` in transport layer; wired in mic scripts.",
        files: ["voxgraph/transport/events.py", "scripts/live_mic_client.py", "scripts/send_test_pcm.py"],
      },
      {
        id: 22,
        title: "TTS on closed WebSocket (log noise / errors)",
        symptom: "Tracebacks sending audio after client disconnected.",
        cause: "Pipeline continued after WebSocket close.",
        fix: "`notify_client()` catches disconnect; guarded sends via `WsOutbound`.",
        files: ["voxgraph/transport/events.py", "voxgraph/transport/outbound.py"],
      },
      {
        id: 23,
        title: "`live_mic_client.py` NameError: REPO_ROOT",
        symptom: "`NameError: REPO_ROOT` before import from `send_test_pcm`.",
        cause: "Used `REPO_ROOT` before module import defined it.",
        fix: "Define `_REPO_ROOT = Path(__file__).resolve().parent.parent` first, then `sys.path.insert`.",
        files: ["scripts/live_mic_client.py"],
      },
      {
        id: 24,
        title: "Scripts can't import voxgraph modules",
        symptom: "ImportError running mic scripts from wrong directory.",
        cause: "Repo root not on `sys.path`.",
        fix: "Bootstrap `sys.path` with repo root in client scripts.",
        files: ["scripts/live_mic_client.py", "scripts/send_test_pcm.py"],
      },
    ],
  },
  {
    slug: "llm",
    title: "LLM — Gemini & Ollama",
    entries: [
      {
        id: 25,
        title: "“What is YOUR name?” → answered with user’s name",
        symptom: "Repeated “What is your name?” → keeps saying “Raj” (user’s name). Loop with small Ollama models.",
        cause: "No pronoun disambiguation; 1B models confuse “your” vs “my”; every phrase hit full LLM.",
        fix: "Added `try_direct_voice_reply()` in `voice/intents.py` for name, presence, greeting intents.",
        files: ["voxgraph/voice/intents.py", "voxgraph/providers/llm.py"],
      },
      {
        id: 26,
        title: "Ollama got flat prompt blob — no chat history",
        symptom: "Could not remember 2 turns ago; incoherent multi-turn sessions.",
        cause: "Ollama received one concatenated string instead of `messages[]` with prior turns.",
        fix: "Proper multi-turn `messages[]`: system → history → current user in `providers/llm.py`.",
        files: ["voxgraph/providers/llm.py", "voxgraph/memory/store.py"],
      },
      {
        id: 27,
        title: "DEMO_MODE capped replies at 8 words",
        symptom: "Ultra-brief non-sequitur answers even when memory loaded.",
        cause: "Prompt: “ONE very short sentence (max 8 words)”.",
        fix: "Replaced with `VOICE_MAX_WORDS` (default ~45); demo mode no longer hard-caps at 8.",
        files: ["voxgraph/providers/llm.py", ".env"],
      },
      {
        id: 28,
        title: "Ollama silent context truncation",
        symptom: "Long sessions lost early context.",
        cause: "Default `num_ctx` ~2048 not overridden.",
        fix: "Set `OLLAMA_NUM_CTX` (4096 demo / 8192 normal), increased `OLLAMA_NUM_PREDICT`.",
        files: ["voxgraph/providers/llm.py", ".env"],
      },
      {
        id: 29,
        title: "Slow Ollama first reply / cold start",
        symptom: "High latency on first turn; new HTTP connection every request.",
        cause: "Model load on first call; no connection reuse.",
        fix: "Shared HTTP client, `keep_alive: 30m`, `warm_ollama()` on startup and WebSocket connect.",
        files: ["voxgraph/providers/llm.py", "voxgraph/api/app.py"],
      },
      {
        id: 30,
        title: "Bad fact extraction: “I am done” → name is done",
        symptom: "Nonsense semantic facts in memory.",
        cause: "Over-broad regex matching “I am …” as name patterns.",
        fix: "Tighter rules in `extract_facts_from_transcript()`.",
        files: ["voxgraph/memory/store.py"],
      },
      {
        id: 31,
        title: "Simple greetings always hit full LLM",
        symptom: "Unnecessary latency on “hey there”.",
        cause: "No intent shortcuts beyond name queries.",
        fix: "Extended `voice/intents.py` for common greetings and presence checks.",
        files: ["voxgraph/voice/intents.py"],
      },
    ],
  },
  {
    slug: "memory",
    title: "Memory (SQLite)",
    entries: [
      {
        id: 32,
        title: "Semantic memory not updating for default user",
        symptom: "Memory “not updating”; test data under wrong user id.",
        cause: "DB had rows for `u1`; app uses `DEFAULT_USER_ID = \"default\"`.",
        fix: "Rewrote store with proper keyed semantic facts for `default` user.",
        files: ["voxgraph/memory/store.py"],
      },
      {
        id: 33,
        title: "Episodic memory was one truncated 500-char blob",
        symptom: "Could not recall earlier turns; useless LLM context.",
        cause: "`new_summary[-500:]` string append instead of structured turns.",
        fix: "`episodic_turns` table, bounded turn/char limits via env vars.",
        files: ["voxgraph/memory/store.py", "voxgraph/memory/service.py"],
      },
      {
        id: 34,
        title: "“My name is Raj” not stored as semantic fact",
        symptom: "“What is my name?” failed after user stated name.",
        cause: "Only episodic summary updated; no structured extraction.",
        fix: "Regex extraction + `upsert_fact()` for names, preferences, etc.",
        files: ["voxgraph/memory/store.py", "voxgraph/memory/service.py"],
      },
      {
        id: 35,
        title: "Fire-and-forget memory tasks lost on shutdown",
        symptom: "Facts/turns sometimes not persisted.",
        cause: "`asyncio.create_task(update_memory(...))` without lifecycle management.",
        fix: "Background save after reply completes; cache during debounce window.",
        files: ["voxgraph/memory/service.py", "voxgraph/pipeline/response.py"],
      },
      {
        id: 36,
        title: "LLM ignored semantic facts in prompt",
        symptom: "Model contradicted stored facts.",
        cause: "Facts appended weakly in prompt.",
        fix: "Stronger system prompt treating facts as ground truth; inject episodic chat history.",
        files: ["voxgraph/providers/llm.py"],
      },
      {
        id: 37,
        title: "Synchronous DB writes delayed “ready” state",
        symptom: "Lag after each reply before next turn.",
        cause: "SQLite writes in hot path blocked pipeline.",
        fix: "Background memory writes; snapshot cached at utterance time.",
        files: ["voxgraph/memory/service.py", "voxgraph/pipeline/response.py"],
      },
    ],
  },
  {
    slug: "latency",
    title: "Latency tuning (fixes & regressions)",
    entries: [
      {
        id: 38,
        title: "200ms utterance debounce felt sluggish",
        symptom: "Fixed wait after user stops speaking.",
        cause: "Conservative debounce for non-demo mode.",
        fix: "`DEMO_MODE=1` → `0.12s` debounce; tunable via `UTTERANCE_DEBOUNCE_SEC`.",
        files: ["voxgraph/core/settings.py", ".env"],
      },
      {
        id: 39,
        title: "Stacked latency optimizations backfired",
        symptom: "After aggressive tuning, experience felt worse (see #6 word-by-word TTS).",
        cause: "50ms debounce + micro-TTS + 8192 ctx + 30 turns + blocking DB combined.",
        fix: "Partial revert: natural phrase TTS, balanced memory window, demo-specific limits.",
        files: ["voxgraph/providers/tts.py", "voxgraph/providers/llm.py", "voxgraph/memory/store.py"],
      },
    ],
  },
  {
    slug: "http-cors",
    title: "HTTP, CORS & config API",
    entries: [
      {
        id: 40,
        title: "No streaming tokens to browser client",
        symptom: "Full reply appeared only after TTS finished in `/try` demo.",
        cause: "Backend only sent final text + PCM; no incremental events.",
        fix: "Stream `reply_start`, `reply_delta`, `reply_done` JSON events via `WsOutbound`.",
        files: ["voxgraph/pipeline/llm_stream.py", "voxgraph/transport/outbound.py"],
      },
      {
        id: 41,
        title: "Duplicate assistant messages in web UI",
        symptom: "Assistant bubble printed twice.",
        cause: "Both streaming deltas and final `reply_text` event treated as new messages.",
        fix: "Frontend dedupes; backend keeps `reply_text` for non-streaming clients.",
        files: ["voxgraph/pipeline/llm_stream.py", "voxgraph/transport/events.py"],
      },
      {
        id: 42,
        title: "CORS blocked browser `/try` from Vercel origin",
        symptom: "Browser demo or marketing site cannot call `/config/*` or connect from different origin.",
        cause: "No CORS middleware for HTTP routes; cross-origin WebSocket from Next.js.",
        fix: "`CORSMiddleware` + `ALLOWED_ORIGINS` env (comma-separated Vercel domains).",
        files: ["voxgraph/api/app.py", "voxgraph/core/settings.py"],
      },
      {
        id: 43,
        title: "No HTTP API for hosted setup wizard",
        symptom: "Demo UI could not test or apply API keys on Render.",
        cause: "Missing REST endpoints.",
        fix: "Added `/config/health`, `/config/test`, `/config/apply`.",
        files: ["voxgraph/api/config.py"],
      },
    ],
  },
  {
    slug: "deploy",
    title: "Deployment, Docker & repo",
    entries: [
      {
        id: 44,
        title: "Git merge conflicts on repo split push",
        symptom: "`git pull --allow-unrelated-histories` → add/add conflicts on README, requirements, scripts.",
        cause: "Local restructured backend-only layout vs old GitHub monolith (Python + web/).",
        fix: "Resolved keeping local restructured versions; merge commit + push.",
        files: [".gitignore", "README.md", "requirements.txt", "scripts/"],
      },
      {
        id: 45,
        title: "Render deploy missing `/try` and CORS",
        symptom: "Hosted backend had no demo UI; cross-origin blocked.",
        cause: "No static file serving or CORS for split frontend architecture.",
        fix: "Dockerfile multi-stage build (demo → static/), CORS origins, redirect `/` → `/try/`.",
        files: ["Dockerfile", "render.yaml", "voxgraph/api/app.py"],
      },
      {
        id: 46,
        title: "`static/` gitignored — clone has no demo UI",
        symptom: "Fresh clone → `/try` 404 until demo built.",
        cause: "`static/` intentionally gitignored; built artifacts not in repo.",
        fix: "Document `cd demo && npm run build`; Docker builds automatically on Render.",
        files: ["demo/", "Dockerfile", "DEPLOY.md"],
      },
      {
        id: 47,
        title: "Dockerfile copied demo static from wrong path",
        symptom: "Docker build succeeds but `/try` empty or 404 in container.",
        cause: "`COPY --from=demo /app/static` — Vite `outDir` is `/static` (parent of `/demo` workdir).",
        fix: "Changed to `COPY --from=demo /static ./static`.",
        files: ["Dockerfile"],
      },
      {
        id: 48,
        title: "Ollama on Render — LLM never responds",
        symptom: "Deployed backend accepts WebSocket but LLM times out or errors.",
        cause: "Ollama runs locally; Render container has no Ollama daemon.",
        fix: "On Render set `LLM_PROVIDER=gemini` + `GOOGLE_API_KEY`. Keep Ollama for local dev only.",
        files: ["DEPLOY.md", "render.yaml", ".env.example"],
      },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture refactor",
    entries: [
      {
        id: 49,
        title: "~1000-line monolithic `voxgraph.py`",
        symptom: "Hard to navigate; WebSocket + STT + LLM + TTS + memory tangled in one file.",
        cause: "Organic growth during rapid prototyping.",
        fix:
          "Split into package: `api/`, `core/`, `providers/`, `pipeline/`, `voice/`, `memory/`, `transport/`. Entry point unchanged: `uvicorn voxgraph:app`.",
        files: ["voxgraph/__init__.py", "voxgraph/api/", "voxgraph/pipeline/", "..."],
      },
      {
        id: 50,
        title: "Circular import after package split",
        symptom: "`ImportError: cannot import name 'PROJECT_ROOT' from partially initialized module 'voxgraph.core.settings'`.",
        cause: "`settings.py` imported `providers/tts.py` which imported `PROJECT_ROOT` from `settings`.",
        fix: "Moved `PROJECT_ROOT` to `voxgraph/core/paths.py` (no internal voxgraph imports).",
        files: ["voxgraph/core/paths.py", "voxgraph/core/settings.py"],
      },
      {
        id: 51,
        title: "Docs referenced old flat filenames",
        symptom: "Architecture docs listed `voxgraph.py`, `llm_providers.py` after refactor.",
        cause: "Docs site not updated when modules moved.",
        fix: "Updated docs to `voxgraph/api/audio.py`, `providers/llm.py`, etc.",
        files: ["voxgraph-web/app/docs/architecture/page.tsx"],
      },
    ],
  },
];

export const buildLogEntryCount = buildLogCategories.reduce(
  (n, c) => n + c.entries.length,
  0,
);

export const operationalNotes = [
  "Restart uvicorn after any `.env` or Python code change.",
  "Use headphones with the mic client to reduce echo (#18, #19).",
  "Run `ollama serve` when `LLM_PROVIDER=ollama`.",
  "ElevenLabs account blocks persist across API key rotation — switch provider instead.",
  "Free Render tier cold-starts can take 30–60s before WebSocket connects.",
  "Set `ALLOWED_ORIGINS` on Render to your exact Vercel URL (https, no trailing slash).",
];
