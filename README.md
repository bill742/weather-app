# Weather App

A weather app built with React, TypeScript, and Vite. It shows current conditions for your location automatically, or for any city you search.

## Features

- Detects your location on load and fetches local weather via the browser Geolocation API
- Search weather by city name
- Toggle between Celsius and Fahrenheit
- Displays temperature, feels-like, weather condition, sunrise, and sunset times
- Weather icons via the [OWF icon font](https://github.com/websygen/owfont)

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS v4
- OpenWeatherMap API (current weather + geocoding endpoints)
- pnpm

## Setup

1. Copy the example env file and fill in your OpenWeatherMap credentials:

   ```sh
   cp .env.example .env
   ```

   ```
   VITE_OPENWEATHER_API_URL="https://api.openweathermap.org/data/2.5/weather"
   VITE_OPENWEATHER_GEO_URL="https://api.openweathermap.org/geo/1.0"
   VITE_OPENWEATHER_API_KEY="your_api_key_here"
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the dev server:

   ```sh
   pnpm dev
   ```

## Scripts

| Command        | Description                        |
| -------------- | ---------------------------------- |
| `pnpm dev`     | Start the local development server |
| `pnpm build`   | Type-check and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint`    | Run ESLint                         |
| `pnpm format`  | Format source files with Prettier  |
