# FRONTEND RULES (Load when working in /frontend)

## State & Data
- TanStack Query for ALL data fetching — no data-fetching in useEffect
- Use `refetchInterval` for polling AI-processing states
- Axios interceptors for 401/500 — trigger Toast on error

## Component Rules
- Props and API responses must have explicit TS interfaces
- Zod validation before passing any user input to service layer
- No `any` — ever

## Folder Structure
- `src/services/` — pure Axios functions, no hooks or UI logic
- `src/hooks/` — TanStack Query wrappers only
- `src/components/` — dumb UI, consumes hooks only
- `src/lib/` — Axios client config