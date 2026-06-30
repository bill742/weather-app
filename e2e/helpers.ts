import { type Page } from '@playwright/test';

import type { GeoLocation, WeatherData } from '../src/types/weather';

// Coordinates the browser geolocation is emulated at (London).
export const LONDON_COORDS = { latitude: 51.5074, longitude: -0.1278 };

interface WeatherOpts {
    name: string;
    main?: string;
    id?: number;
    country?: string;
    metricTemp?: number;
    imperialTemp?: number;
}

// Build an OpenWeatherMap-shaped payload. OWM returns temps already converted
// for the requested unit, so we pick the value based on the `units` query.
function buildWeather(units: string, o: WeatherOpts): WeatherData {
    const temp =
        units === 'imperial' ? (o.imperialTemp ?? 68) : (o.metricTemp ?? 20);
    return {
        main: {
            feels_like: temp - 1,
            temp,
            temp_max: temp + 2,
            temp_min: temp - 2,
        },
        name: o.name,
        sys: { country: o.country ?? 'GB', sunrise: 1700000000, sunset: 1700040000 },
        timezone: 0,
        weather: [{ id: o.id ?? 800, main: o.main ?? 'Clear' }],
    };
}

// Mock the current-weather endpoint (hit by both geolocation and city search).
export async function mockWeather(page: Page, o: WeatherOpts): Promise<void> {
    await page.route('**/data/2.5/weather**', async (route) => {
        const units =
            new URL(route.request().url()).searchParams.get('units') ?? 'metric';
        await route.fulfill({ json: buildWeather(units, o) });
    });
}

// Mock reverse geocoding (run on mount once geolocation resolves).
export async function mockReverseGeo(page: Page, geo: GeoLocation): Promise<void> {
    await page.route('**/geo/1.0/reverse**', (route) =>
        route.fulfill({ json: [geo] }),
    );
}

// Mock forward geocoding (run when the search box is submitted).
export async function mockDirectGeo(
    page: Page,
    candidates: GeoLocation[],
): Promise<void> {
    await page.route('**/geo/1.0/direct**', (route) =>
        route.fulfill({ json: candidates }),
    );
}
