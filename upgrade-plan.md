# Weather App Modernization Plan

Stack: **Vite + React + TypeScript + Tailwind CSS + pnpm**
Design: **Glassmorphism** (sky-blue → indigo gradient, frosted-glass cards)

---

## [x] Phase 1 — Project Setup ✓

1. [x] Write this plan to project root
2. [x] Delete old files: `yarn.lock`, `.babelrc`, `.sasslintrc`, `node_modules/`, `dist/`, `development/`
3. [x] Init Vite React TypeScript project: `pnpm create vite@latest . -- --template react-ts`
4. [x] `pnpm install`
5. [x] `pnpm add -D tailwindcss @tailwindcss/vite`
6. [x] Configure Tailwind in `vite.config.ts`
7. [x] Update `src/index.css` to `@import "tailwindcss"`
8. [x] Update `.env.example` → `VITE_OPENWEATHER_API_URL` and `VITE_OPENWEATHER_API_KEY`
     ⚠️  Also update your `.env` file manually with the `VITE_` prefix

---

## [x] Phase 2 — Port Logic to React Components ✓

- [x] Define types in `src/types/weather.ts` (`WeatherData`, `Unit`)
- [x] `src/utils/weather.ts` — typed fetch utilities (from `fetchAndDisplayWeather.js`)
- [x] `src/components/Header.tsx`
- [x] `src/components/Search.tsx` — controlled input with `onSubmit: (query: string) => void`
- [x] `src/components/WeatherCard.tsx` — `useState`/`useEffect`/`useRef` (from `Data.js`)
- [x] `src/App.tsx` — root component

Preserved: geolocation, city search, °C/°F toggle, AbortController, error handling, loading spinner.

---

## [x] Phase 3 — Glassmorphism Styling with Tailwind ✓

- [x] Background: `bg-gradient-to-br from-sky-400 to-indigo-600` (full viewport)
- [x] Glass card: `bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl`
- [x] Frosted input and buttons: `bg-white/20 backdrop-blur text-white border-white/30`
- [x] Keep OWF icon font via `@import` in `index.css`
- [x] Spinner animation in `@layer components`
- [x] Inter font via Google Fonts

---

## [x] Phase 4 — Cleanup & Config ✓

- [x] ESLint: enabled rules for `simple-import-sort`, `sort-keys-fix`, `sort-destructure-keys`
- [x] ESLint: moved `eslint-plugin-sort-destructure-keys` to devDependencies
- [x] ESLint: auto-fixed import order in `main.tsx` and `vite.config.ts`
- [x] Prettier: added `format` script (`prettier --write src`)
- [x] `package.json` scripts: `dev`, `build`, `preview`, `lint`, `format`

---

## Verification Checklist

- [ ] `pnpm dev` — geolocation loads on startup
- [ ] City search works
- [ ] °C / °F toggle works without double-fetch
- [ ] Geolocation denial shows friendly error
- [ ] `pnpm build` succeeds
- [ ] Glass card renders in Chrome + Safari
