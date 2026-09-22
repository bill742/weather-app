# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Single-page React app with no routing. State flows from `App` → `WeatherCard`:

- **`App.tsx`** — holds `searchQuery` state; renders `Header`, `Search`, and `WeatherCard`
- **`Search.tsx`** — controlled form; calls `onSubmit(query)` which sets `searchQuery` in App
- **`WeatherCard.tsx`** — owns all weather state (`data`, `geo`, `unit`, `loading`, `error`, `dataSource`). On mount it runs geolocation; when `searchQuery` changes it fetches by city. Unit toggle re-fetches using the current data source. Uses `AbortController` via `abortControllerRef` to cancel in-flight requests.
- **`Header.tsx`** — static header

### Utilities (`src/utils/`)

- `fetchWeather.ts` — four fetch functions: `fetchWeatherByCoords`, `fetchWeatherByCity`, `fetchGeoByCoords`, `fetchGeoByCity`. All accept an `AbortSignal`. All env vars are read here.
- `getGeolocation.ts` — promisifies `navigator.geolocation.getCurrentPosition`
- `formatTime.ts` — converts OpenWeatherMap Unix timestamps (with timezone offset) to local time strings

### Types (`src/types/weather.ts`)

Defines `WeatherData`, `GeoLocation`, `Unit` (`'metric' | 'imperial'`), and `DataSource` (`'geolocation' | 'search'`).

### Styling

Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no config file). OWF icon font is in `src/css/owfont-regular.min.css` and `src/fonts/`; icons are rendered as `<i className="owf owf-{weatherId}">`. Weather icon IDs come directly from the OpenWeatherMap `weather[0].id` field.

## Linting conventions

ESLint v10 (flat config in `eslint.config.js`) enforces sorted imports/exports (`eslint-plugin-simple-import-sort`) and sorted object and destructure keys (`perfectionist/sort-objects`, case-sensitive alphabetical). Run `pnpm lint` before committing.
