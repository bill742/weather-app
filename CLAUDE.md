# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

Single-page React app with no routing. `App` holds `searchQuery` and reads all weather state from the `useWeather` hook, then lays out a full-screen hero (left) and a glass sidebar (right; stacked below on mobile).

- **`hooks/useWeather.ts`**: owns all weather state (`data`, `geo`, `candidates`, `unit`, `loading`, `error`) in a reducer. On mount it runs geolocation; when `searchQuery` changes it geocodes the city (showing `CityPicker` if several match). `coordsRef` remembers the place on screen so `setUnit` can re-fetch it. Uses `AbortController` via `abortControllerRef` to cancel in-flight requests; `hasSearchedRef` stops a slow geolocation from overwriting a search.
- **`hooks/useRecentCities.ts`**: the last 5 searched places, persisted to `localStorage` (`city-weather:recent`; every access guarded). `useWeather` calls its `addRecent` through the `onPlaceLoaded` callback once a searched/picked place's weather loads. Clicking a recent city calls `selectPlace`, which loads from saved coordinates without geocoding again.
- **`App.tsx`**: picks the scene (background photo + `--accent` CSS variable) via `getScene`, and renders `Background`, `Header` + `UnitToggle`, `CurrentConditions`, `Search`, `CityPicker`, `RecentCities` (both render `PlaceList`), `HourlyForecast`, `DailyForecast`, `WeatherDetails`.
- **`Search.tsx`**: controlled form; calls `onSubmit(query)` which sets `searchQuery` in App.
- **`Background.tsx`**: fixed full-viewport photo; keeps the previous photo under the new one while it fades in.

### Utilities (`src/utils/`)

- `fetchWeather.ts`: `fetchWeatherBundle` (current weather + 3-hour forecast + daily forecast + UV in parallel), `fetchGeoByCoords`, `fetchGeoByCity`. All accept an `AbortSignal`, and all env vars are read here. The forecast/UV URLs are derived from `VITE_OPENWEATHER_API_URL` by stripping `/weather`. Only current weather is required: the other endpoints fall back to empty/null, and daily falls back to days aggregated from the 3-hour forecast.
- `getScene.ts`: maps an OWM condition code (plus day/night from sunrise/sunset) to a background photo in `src/assets/backgrounds/`, an accent colour, and a photo credit.
- `units.ts`: wind (m/s → km/h), visibility, precipitation, dew point, compass point, UV category.
- `getGeolocation.ts`: promisifies `navigator.geolocation.getCurrentPosition`.
- `formatTime.ts`: converts OpenWeatherMap Unix timestamps (with timezone offset) to local time strings; also `formatHour`, `formatWeekday`, `formatLongDate`, `localDayKey`.

### Types (`src/types/weather.ts`)

Defines `WeatherData` (raw current weather), `HourlyForecast`, `DailyForecast`, `WeatherBundle` (what the UI renders), `GeoLocation`, `Coords`, and `Unit` (`'metric' | 'imperial'`).

### Styling

Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin, no config file; theme tokens in `src/index.css` `@theme`). Font is Sora (Google Fonts, loaded in `index.html`). The per-scene accent is the `--accent` CSS variable set on App's root, used as `bg-(--accent)` / `text-(--accent)`. OWF icon font is in `src/css/owfont-regular.min.css` and `src/fonts/`; icons are rendered by `WeatherIcon` as `<i className="owf owf-{weatherId}-{d|n}">`, where the id is OpenWeatherMap's `weather[0].id` and the day/night suffix comes from its `icon` code.

## Linting conventions

ESLint v10 (flat config in `eslint.config.js`) enforces sorted imports/exports (`eslint-plugin-simple-import-sort`) and sorted object and destructure keys (`perfectionist/sort-objects`, case-sensitive alphabetical). Run `pnpm lint` before committing.

## Testing

Playwright e2e (`pnpm test:e2e`) runs Vite in `test` mode and mocks every API call. Specs run in Chromium, Firefox and WebKit; `pnpm test:e2e --project=chromium` runs just one. Browsers install with `pnpm exec playwright install`. `e2e/helpers.ts` `mockWeather` serves all four `/data/2.5/*` endpoints; pass `failOptional: true` to simulate a plan without the daily/UV endpoints.
