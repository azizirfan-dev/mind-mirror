# BACKEND RULES (Load when working in /backend)

## Folder Structure
- `src/routes/` — endpoints + middleware only, zero logic
- `src/controllers/` — parse req, validate with Zod, call service, send response
- `src/services/` — all business logic, DB queries, AI orchestration
- `src/types/` — shared TS interfaces
- Work ONLY in `src/` — never touch `dist/`

## Database
- Do NOT modify `schema.prisma` without explicit authorization
- Use atomic `WHERE` clause updates — no optimistic versioning
- Always enable `pgvector` extension for AI/embedding tables
- Rate limit AI-heavy endpoints per user to prevent token cost spikes

## AI Agent Exception
- LangGraph node definitions may extend to 40 lines max for logical cohesion