# MASTER RULES: FRONTEND & API INTEGRATION - V2.0

## 1. THE 3-LAYER PROTOCOL [NON-NEGOTIABLE]
- **Layer 1 (Service):** Pure Axios functions in `src/services/`. No React hooks or UI logic allowed.
- **Layer 2 (Hooks):** TanStack Query (useQuery/useMutation) wrappers in `src/hooks/`.
- **Layer 3 (UI):** Components are "dumb" and only consume data/actions from Hooks.

## 2. UI/UX & STYLING (MOBILE FIRST)
- **Max Lines:** 200 lines per component file. Break down into sub-components immediately if exceeded.
- **Styling:** Tailwind CSS ONLY. No CSS modules.
- **Responsiveness:** Write for **Mobile** by default, override for desktop with `md:` prefix.
- **Touch Targets:** Interactive elements must have a minimum height of `44px`.

## 3. STATE & SYNC MANAGEMENT
- **No Data useEffect:** Use **TanStack Query** for all data fetching to manage cache and loading states.
- **Polling Strategy:** Use `refetchInterval` for AI-processing states to update the UI automatically when analysis is complete.
- **Global Error Handling:** Use Axios interceptors for 401/500 errors and trigger Toast notifications for user feedback.

## 4. TYPE SAFETY
- **No 'any':** Strict TypeScript interfaces for all Props and API Responses.
- **Zod Forms:** All user inputs must be validated with Zod before being passed to the Service layer.