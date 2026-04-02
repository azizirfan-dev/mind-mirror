# CLAUDE.md — MindMirror

## Project Overview
Personalized AI journaling app for mental well-being.
Tagline: "Your Personalized AI Mind-Mirror."

Users write journal entries → AI extracts emotion scores (Anxiety, Stress, Happiness, Anger, Sadness, Depression, 0–100) → Socratic AI chat helps reflection → Insight dashboard + PDF report for psychologists.

## Current Status
- [x] Monorepo scaffolded (`/frontend`, `/backend`)
- [x] Auth — NextAuth v4 (CredentialsProvider) + bcryptjs on backend
- [x] Prisma schema: `User` + `JournalEntry` (pgvector embedding column)
- [x] Backend 3-layer fully implemented (routes, controllers, services)
- [x] Frontend 3-layer fully implemented (services, hooks, components)
- [x] Emotion scoring — Hugging Face `j-hartmann/emotion-english-distilroberta-base`, async via `setImmediate`, retry-once on failure
- [x] Main page — 3-panel layout (history | chat | editor) with resizable panels
- [x] Journal CRUD — full UI + API (create, read, update, delete, paginated list)
- [x] Emotion score display — colored badges in journal history items
- [x] Reflection chat — SSE streaming with Socratic HF responses, session management
- [x] Insight dashboard — emotion trends, pie chart, activity heatmap, streaks, AI summary, PDF export
- [x] Landing page — hero, features, philosophy, protocol sections
- [x] AI Engine — LangGraph bootstrapped (Pattern Detective + Prompt Architect agents)
- [x] Prompt Architect — "Help me start" button in editor, generates personalized Socratic question (read-only card, no injection)
- [ ] Semantic search via pgvector (NOT STARTED)
- [ ] 30s idle trigger for Prompt Architect (deferred to post-beta)
- [ ] Pattern Detective v2 — pgvector theme clustering (deferred until embedding pipeline built)

> Emotion scoring uses `emotion.service.ts` — do NOT modify the HF model or score mapping without explicit instruction.
> LangGraph graph lives in `backend/src/services/ai/langGraph/`. Add new agents as nodes in `promptArchitect.graph.ts`.

---

## Stack
- **Frontend:** Next.js (App Router) + Tailwind CSS + TanStack Query + Axios
- **Backend (SSoT):** Node.js + Express + TypeScript + Prisma
- **DB:** Supabase (PostgreSQL) + pgvector
- **Auth:** NextAuth v4 (CredentialsProvider) on frontend — backend verifies JWT signed with `NEXTAUTH_SECRET`
- **AI (active):** Hugging Face Inference API — emotion scoring (`j-hartmann/emotion-english-distilroberta-base`) + Socratic chat + insights summary + Prompt Architect
- **AI (orchestration):** LangGraph (`@langchain/langgraph`) — Pattern Detective + Prompt Architect graph in `backend/src/services/ai/langGraph/`
- **AI (future):** Local 7B LLMs, pgvector semantic clustering

## Running Locally
```bash
cd backend && npm run dev    # http://localhost:5000
cd frontend && npm run dev   # http://localhost:3000
```

## Environment Variables
```bash
# backend/.env
DATABASE_URL=        # Supabase pooling
DIRECT_URL=          # Supabase direct (migrations only)
NEXTAUTH_SECRET=     # Shared with frontend — used to verify JWTs in auth.middleware.ts
HF_API_TOKEN=        # Hugging Face API token
HF_EMOTION_MODEL=j-hartmann/emotion-english-distilroberta-base  # Emotion classifier
HF_MODEL=            # General LLM (future use)

# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_SECRET=     # Shared with backend — NextAuth session signing
NEXTAUTH_URL=        # e.g. http://localhost:3000
```

## Database (run from /backend)
```bash
npx prisma migrate dev    # requires DIRECT_URL
npx prisma generate
npx prisma studio
```
> ⚠️ Do NOT modify `schema.prisma` without explicit authorization.

---

## Architecture

```
Mindmirror/
├── backend/    Express API — port 5000
└── frontend/   Next.js app — port 3000
```

### Backend: Route → Controller → Service
- **Routes** `src/routes/`: endpoints + middleware
- **Controllers** `src/controllers/`: parse req/res, Zod validation, `ApiResponse` envelope
- **Services** `src/services/`: business logic + Prisma
- **Auth Middleware** `src/middlewares/auth.middleware.ts`: verifies JWT via `jsonwebtoken.verify(token, NEXTAUTH_SECRET)`, upserts user, injects `req.user`
- `userId` always from `req.user` — never from `req.body`

### Auth Flow
1. **Register:** `POST /api/auth/register` → backend hashes password with bcryptjs, stores in DB
2. **Login:** NextAuth `CredentialsProvider.authorize()` → POSTs to `POST /api/auth/login` → backend verifies bcrypt hash, returns `{ access_token, user }` → NextAuth signs JWT with `NEXTAUTH_SECRET`
3. **Authenticated requests:** frontend Axios interceptor reads `session.accessToken` via `getSession()` → sets `Authorization: Bearer <token>` → backend middleware verifies with `NEXTAUTH_SECRET`
4. **Sign out:** 401 response interceptor calls `signOut({ redirect: false })`

### Frontend: Service → Hook → Component
- **Features** `src/features/`: co-located by domain (`auth/`, `journal/`, `chat/`, `insights/`, `landing/`)
  - Each domain has `components/`, `hooks/`, `services/`
- **Shared** `src/shared/`: `layout/`, `providers/`, `ui/`, `constants/`, `types/`, `services/api.config.ts`
- **Services**: pure Axios functions. Config + interceptor in `src/shared/services/api.config.ts` — do NOT create another interceptor
- **Hooks**: TanStack Query wrappers only
- **Components**: dumb — props only, no direct API calls
- **Session access:** use `useSession()` from `next-auth/react` in client components; `getSession()` for non-React contexts
- **Auth token:** managed by NextAuth — do NOT use sessionStorage or manual token stores

### Backend is SSoT
Frontend never transforms or reshapes data. Render only what the backend sends.

---

## App Layout (Post-Login)
3 resizable panels (like NotebookLM) — **fully implemented**:
- **Left:** Journal history list with search, pagination, emotion badges
- **Middle:** Reflection chat — SSE streaming via Hugging Face (Socratic, 30-min session, in-memory Map)
- **Right:** Sacred Journal editor — title + content, word counter, save button (manual text only)
  - `✦ Help me start` button appears when editor is blank → triggers LangGraph Prompt Architect
  - Suggestion card shows a personalized Socratic question (read-only, dismiss only — no text injection)
  - Date header rendered client-side only via `useEffect` to avoid SSR hydration mismatch

Safety: avg of (Anxiety + Stress + Anger + Sadness + Depression) > 70 → `SafetyBanner` shown in Insights page.

---

## Implemented API Endpoints
```
POST  /api/auth/register            # user registration (bcrypt hash)
POST  /api/auth/login               # credential check, returns JWT
GET   /api/auth/me                  # returns authenticated user profile

POST  /api/journal                  # create entry, triggers async HF emotion scoring
GET   /api/journal                  # paginated list (?page&limit)
GET   /api/journal/:id              # single entry
PUT   /api/journal/:id              # update entry, re-queues emotion scoring
DELETE /api/journal/:id             # delete entry

POST  /api/chat/init                # init session (uses latest journal entry), returns sessionId
GET   /api/chat/stream              # SSE stream (?sessionId&message&token) — HF Socratic response

GET   /api/insights                 # full insights object (?window=7d|30d|90d|all)
POST  /api/insights/summary         # AI summary via HF (rate-limited: 5 req/10min per user)
GET   /api/insights/pdf             # PDF report download (pdfkit)

POST  /api/agent/prompt             # LangGraph: Pattern Detective → Prompt Architect → personalized writing prompt
```

> `GET /api/journal/:id/scores` (poll endpoint) was replaced — scores are embedded in the entry object directly.

---

## Code Standards

### Universal
- TypeScript strict — no `any`, explicit interfaces everywhere
- Zod on ALL inputs (`req.body`, `req.query`, `req.params`, form data)
- Max 200 lines/file — split immediately when exceeded
- Descriptive names: `isUserAuthenticated` not `flag`
- UTC in DB — frontend handles timezone display

### Backend
- Max 15 lines/function — break into atomic private helpers
- Exception: LangGraph nodes up to 40 lines
- Rate limit AI-heavy endpoints
- Atomic DB updates with `WHERE` — no optimistic versioning

### Frontend
- Tailwind CSS only — no CSS modules, no inline styles
- Mobile-first — `md:` prefix for desktop
- Min touch target: 44px
- TanStack Query for all data — no data `useEffect`
- `refetchInterval` for polling AI processing states
- SSE only via `ChatStreamHandler` — nowhere else
