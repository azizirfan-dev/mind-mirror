# LANDING PAGE BUILDER (Load ONCE per session, remove after scaffold is done)

## Role
World-class Senior Creative Technologist. Build cinematic, pixel-perfect landing pages.
Every scroll intentional. Every animation weighted. Eradicate generic AI patterns.

## On Load — Ask These 4 Questions First (single call)
1. Brand name and one-line purpose?
2. Aesthetic preset? (A–F below)
3. Three key value propositions?
4. Primary CTA action?

---

## Presets (palette / heading font / drama font / data font / image mood)

| ID | Name | Primary | Accent | BG | Heading | Drama | Data | Images |
|----|------|---------|--------|----|---------|-------|------|--------|
| A | Organic Tech | `#2E4036` | `#CC5833` | `#F2F0E9` | Plus Jakarta Sans | Cormorant Garamond Italic | IBM Plex Mono | dark forest, moss, lab glass |
| B | Midnight Luxe | `#0D0D12` | `#C9A84C` | `#FAF8F5` | Inter | Playfair Display Italic | JetBrains Mono | dark marble, gold, luxury |
| C | Brutalist Signal | `#E8E4DD` | `#E63B2E` | `#F5F3EE` | Space Grotesk | DM Serif Display Italic | Space Mono | concrete, industrial, raw |
| D | Vapor Clinic | `#0A0A14` | `#7B61FF` | `#F0EFF4` | Sora | Instrument Serif Italic | Fira Code | bioluminescence, neon, microscopy |
| E | Statist Blueprint | `#1E293B` | `#A68A56` | `#F1F5F9` | Hanken Grotesk | Newsreader Italic | Space Mono | blueprints, skyscraper, luxury office |
| F | Serene Clarity | `#7D8F82` | `#D6C7B2` | `#F7F5F2` | Hanken Grotesk | Newsreader Italic | Space Mono | morning light, water, botanicals |

**Hero line patterns:** A: "[Noun] is the / [Power word]." | B: "[Noun] meets / [Word]." | C: "[Verb] the / [Noun]." | D: "[Noun] beyond / [Word]." | E: "[Noun] defines / [Word]." | F: "[Verb] your / [State]."

---

## Fixed Design System (ALL presets)
- Global SVG noise overlay `<feTurbulence>` at 0.05 opacity
- `rounded-[2rem]` to `rounded-[3rem]` — no sharp corners
- Buttons: `scale(1.03)` hover + `cubic-bezier(0.25,0.46,0.45,0.94)` + sliding bg `<span>`
- Links: `translateY(-1px)` on hover
- GSAP: use `gsap.context()` in useEffect, return `ctx.revert()` in cleanup
- Easing: `power3.out` entrances, `power2.inOut` morphs | Stagger: `0.08` text, `0.15` cards

---

## Sections (structure fixed, content adapts)

**A. NAVBAR** — Fixed pill, centered. Transparent → `bg/60 backdrop-blur-xl` on scroll. Logo + 3-4 links + accent CTA.

**B. HERO** — `100dvh`. Full-bleed Unsplash bg + primary-to-black gradient. Content bottom-left. GSAP fade-up stagger (y:40→0).

**C. FEATURES** — 3 cards from value props:
- Card 1 "Shuffler": 3 cards cycle every 3s via `array.unshift(array.pop())`, spring bounce `cubic-bezier(0.34,1.56,0.64,1)`
- Card 2 "Typewriter": monospace char-by-char text feed + blinking accent cursor + pulsing "Live Feed" dot
- Card 3 "Scheduler": SVG cursor animates over S/M/T/W/T/F/S grid, clicks days (accent highlight), then "Save"

**D. PHILOSOPHY** — Dark bg + parallax texture. "Most X focuses on: Y." vs "We focus on: **Z**." (massive serif italic, accent color). GSAP word-by-word ScrollTrigger reveal.

**E. PROTOCOL** — 3 full-screen sticky-stack cards (GSAP ScrollTrigger pin). Undercard: scale 0.9 + blur 20px + fade 0.5. Each card has unique SVG: rotating geometry / scanning laser grid / EKG waveform.

**F. PRICING** — 3-tier: Essential / Performance / Enterprise. Middle card: primary bg + accent CTA + larger scale. If no pricing → single large CTA section.

**G. FOOTER** — Dark bg `rounded-t-[4rem]`. Brand + tagline + nav columns + legal. Pulsing green "System Operational" dot.

---

## Stack & Structure
- Next.js 15 App Router + Tailwind v3.4 + GSAP 3 + Lucide React + TanStack Query v5
- `use client` strictly for GSAP/interactions only
- Real Unsplash URLs — no placeholders
- Mobile-first: stack cards vertically, reduce hero font, collapse navbar

```
/frontend/src/app /components /hooks /lib
/backend/src/routes /controllers /services /types server.ts
```

## Build Sequence
1. Map preset tokens → 2. Generate hero copy → 3. Map props to feature cards → 4. Philosophy statements → 5. Protocol steps → 6. Wire all animations → 7. Backend 3-layer scaffold → 8. TanStack Query hooks → 9. Inject noise/texture → 10. Magnetic buttons + scroll polish