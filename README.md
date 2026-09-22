# City Weather

A weather app built with React, TypeScript, and Vite. It shows current conditions for your location automatically, or for any city you search.

## Features

- Detects your location on load and fetches local weather via the browser Geolocation API
- Search weather by city name, with a picker when several places match
- Recent searches, remembered across visits in the browser
- Toggle between Celsius and Fahrenheit
- Current conditions with a plain-language summary of the day
- Hourly forecast for the next 24 hours (3-hour steps)
- 7-day forecast with temperature-range bars on a shared weekly scale
- Details: feels like, humidity and dew point, wind with a compass, UV index, visibility, precipitation, sunrise and sunset
- Full-screen background photo and accent colour that change with the conditions (clear, partly cloudy, overcast, rain, thunderstorm, snow, fog, clear night)
- Weather icons via the [OWF icon font](https://github.com/websygen/owfont)

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS v4
- OpenWeatherMap API: current weather, 3-hour forecast, daily forecast, UV index, and geocoding. The daily forecast and UV endpoints are optional: if your plan doesn't include them, the app builds days from the 3-hour forecast and hides the UV reading.
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

    To run the e2e suite, also install the browsers it drives:

    ```sh
    pnpm exec playwright install
    ```

3. Start the dev server:

    ```sh
    pnpm dev
    ```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Start the local development server   |
| `pnpm build`   | Type-check and build for production  |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint`    | Run ESLint                           |
| `pnpm test:e2e` | Run the Playwright e2e suite in Chromium, Firefox and WebKit |
| `pnpm test:e2e:ui` | Run the e2e suite in Playwright's UI mode |
| `pnpm format`  | Format source files with Prettier    |

## Photo credits

All background photos are CC0 or public domain, from Wikimedia Commons:

| Scene         | Photo                                                                                                                                                                                                  | Author                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| Clear         | [Sky Forest Clouds](https://commons.wikimedia.org/wiki/File:Sky_Forest_Clouds.jpg)                                                                                                                     | Unknown (CC0)                       |
| Partly cloudy | [Clouds above Hebgen Lake](https://commons.wikimedia.org/wiki/File:Clouds_in_the_sky_above_Hebgen_Lake_on_the_Hebgen_Lake_Ranger_District_3W6A3781_(53055767866).jpg)                                  | US Forest Service, Northern Region  |
| Overcast      | [Cloudy Sky Background](https://commons.wikimedia.org/wiki/File:Cloudy_Sky_Background.jpg)                                                                                                             | Free Nature Stock                   |
| Rain          | [Raindrops on a window in Brastad](https://commons.wikimedia.org/wiki/File:Raindrops_on_a_window_in_Brastad_3.jpg)                                                                                     | W.carter                            |
| Thunderstorm  | [Lightning from Spandauer-See-Brücke](https://commons.wikimedia.org/wiki/File:Lightning_at_thunderstorm_from_Spandauer-See-Br%C3%BCcke_03.tif)                                                          | Leonhard Lenz                       |
| Snow          | [Snowy road, Sosonka](https://commons.wikimedia.org/wiki/File:Snowy_road_Sosonka_2013_G1.jpg)                                                                                                          | George Chernilevsky                 |
| Fog           | [Sailboat on the Huon River in the fog](https://commons.wikimedia.org/wiki/File:Ethereal_sailboat_on_the_Huon_River_in_the_fog_(landscape).jpg)                                                        | JustinH                             |
| Clear night   | [Night Sky Stars, Silverthorne](https://commons.wikimedia.org/wiki/File:Night_Sky_Stars_Silverthorne_(Unsplash).jpg)                                                                                   | Nathan Anderson                     |
