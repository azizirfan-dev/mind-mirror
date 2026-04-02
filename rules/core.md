# CORE RULES (Always Loaded)

## Code Standards
- Max 15 lines/function — use atomic private helpers
- Max 200 lines/file — split into sub-files immediately
- TypeScript strict — no `any`, explicit interfaces everywhere
- Zod validation on ALL inputs (body, query, params)

## Architecture
- Backend 3-layer: `Route` (endpoints) → `Controller` (req/res) → `Service` (logic+DB)
- Frontend 3-layer: `Service` (Axios) → `Hook` (TanStack Query) → `UI` (dumb component)
- All business logic and AI processing in Node.js backend only
- Frontend only consumes APIs — no direct DB calls

## Security
- `userId` always from `req.user` (auth middleware) — NEVER from `req.body`
- Timestamps: store UTC in DB, convert to local in frontend only

## Styling
- Tailwind CSS only — no CSS modules
- Mobile-first, override with `md:` prefix
- Min touch target height: 44px