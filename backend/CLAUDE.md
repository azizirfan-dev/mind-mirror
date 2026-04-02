# MASTER RULES: BACKEND & DATABASE ARCHITECTURE - V2.0

## 1. ARCHITECTURE & FOLDER INTEGRITY [CRITICAL]
- **Work Directory:** ONLY work in `src/`. NEVER touch build artifacts in `dist/`.
- **Layered Architecture:** 
  - `Route`: Defines endpoints and applies Middlewares.
  - `Controller`: Parses Requests, Validates via Zod, and sends standard JSON envelopes.
  - `Service`: Contains Business Logic, DB transactions, and AI orchestrations.

## 2. STRICT CODING STANDARDS
- **Max Lines Per File:** 200 lines.
- **Max Lines Per Function:** 15 lines.
  - *Strategy:* Break logic into "Atomic Private Helpers" (e.g., `validateToken()`, `mapSentimentScore()`).
- **AGENT EXCEPTION:** LangGraph Node definitions and complex AI orchestration services may extend up to **40 lines** to ensure logical cohesion and readability.
- **Variable Naming:** Must be descriptive and explicit (e.g., `isUserAuthenticated` instead of `flag`).
- **Timezone Standard:** All DB timestamps must be stored in UTC. Local conversion (e.g., UTC+7) is strictly a Frontend responsibility.

## 3. SECURITY & TRAFFIC PROTOCOLS
- **Authentication Source:** `userId` or `profileId` must ALWAYS be retrieved from `req.user` injected by Auth Middleware.
- **Input Validation:** Every incoming `req.body`, `req.query`, or `req.params` must be parsed with a **Zod** schema.
- **Rate Limiting:** Implement per-user rate limits on AI-heavy endpoints to prevent token cost spikes and API abuse.

## 4. DATABASE & RELATIONAL INTEGRITY
- **Constraint:** Do NOT modify `schema.prisma` without explicit authorization.
- **Race Condition Handling:** Use Atomic Updates with `WHERE` clauses instead of optimistic versioning.
- **Vector Search:** Always enable the `pgvector` extension in Supabase for any AI/Embedding related tables.