# MINDMIRROR — PROJECT REFERENCE (Load at session start, then remove)

## Mission
Personalized AI journaling app. Socratic Chat Agent + Manual Journal Editor.
Extracts Anxiety, Stress, Happiness, Resilience scores for psychologist reports.
Tagline: "Your Personalized AI Mind-Mirror."

## Stack
- Frontend: Next.js (App Router) + Tailwind CSS
- Backend (SSoT): Node.js + Express + TypeScript
- ORM: Prisma | DB: Supabase + pgvector
- AI: LangGraph + Hugging Face Inference API / Local 8B LLMs

## Three Tabs
1. **Insight Dashboard** — Line chart (emotional trends) + Radar chart (Negative vs Positive metrics) + PDF report generator for psychologists
2. **Reflection Space** — LangGraph Socratic chat agent. AI initiates based on last journal entry context
3. **Sacred Journal** — Manual text editor only. No AI drafting. Post-save triggers async AI analysis to update dashboard

## AI Logic
- Short-term memory: LangGraph session state
- Long-term memory: Supabase pgvector similarity search across past journals
- Safety: if negative scores avg >70% → trigger "Human-Centric Redirect" to seek real psychologist
- All chat responses via SSE streaming