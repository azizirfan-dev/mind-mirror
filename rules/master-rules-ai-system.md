# AI SYSTEM RULES (Load only when working on AI/agent features)

## LangGraph
- Always return NEW state object — never mutate previous state
- Use Postgres Checkpointer for session persistence across restarts
- One task per node: Triage, Retrieval, Analysis each isolated and testable
- HITL breakpoint required for high-risk transitions (e.g. final report generation)
- SSE streams must emit `type: 'ping'` every 1500ms to prevent socket hangups

## Privacy & Security
- ALL user text must pass through `SanitizationUtility` before any cloud LLM call
- Mask PII (names, phone, location) by default — skip only if user toggled consent
- Use local embeddings (on-device) for retrieval to keep sensitive context off-cloud
- Treat LLM inputs like SQL — apply system prompt guardrails against injection

## Performance
- Redis semantic cache — store responses to similar queries
- Routing: local M4 for triage/classification/PII, cloud (HuggingFace) for deep reasoning
- If local LLM latency >3000ms → auto-failover to cloud API
- Hard `max_tokens` limit per user session

## Observability
- Trace every request via LangSmith or Arize Phoenix
- Capture thumbs up/down feedback and store alongside trace for fine-tuning

## Prompts
- Never hardcode prompts — store versioned in `/prompts` folder (e.g. `v1.2_socratic_chat`)
- Always include 2-3 perfect input/output examples in system prompts
- Every prompt change must run against the eval set (20+ gold-standard pairs)