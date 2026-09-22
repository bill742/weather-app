import { type Page } from '@playwright/test';

import type { GeoLocation, WeatherData } from '../src/types/weather';

// Coordinates the browser geolocation is emulated at (London).
export const LONDON_COORDS = { latitude: 51.5074, longitude: -0.1278 };

// Fixed "now" for mocked responses: 2023-11-14 12:00 UTC (daytime, so the
// scene is day/night-stable regardless of when the suite runs).
const NOW = 1699963200;
const HOUR = 3600;
const DAY = 24 * HOUR;

interface WeatherOpts {
    name: string;
    main?: string;
    id?: number;
    country?: string;
    metricTemp?: number;
    imperialTemp?: number;
    uvi?: number;
    // Simulate plans without the daily/UV endpoints.
    failOptional?: boolean;
}

const tempFor = (units: string, o: WeatherOpts) =>
    units === 'imperial' ? (o.imperialTemp ?? 68) : (o.metricTemp ?? 20);

const condition = (o: WeatherOpts) => ({
    description: (o.main ?? 'Clear').toLowerCase(),
    icon: '01d',
    id: o.id ?? 800,
    main: o.main ?? 'Clear',
});

// Build an OpenWeatherMap-shaped payload. OWM returns temps already converted
// for the requested unit, so we pick the value based on the `units` query.
function buildWeather(url: URL, o: WeatherOpts): WeatherData {
    const temp = tempFor(url.searchParams.get('units') ?? 'metric', o);
    return {
        coord: {
            lat: Number(url.searchParams.get('lat')),
            lon: Number(url.searchParams.get('lon')),
        },
        dt: NOW,
        main: {
            feels_like: temp - 1,
            humidity: 60,
            temp,
            temp_max: temp + 2,
            temp_min: temp - 2,
        },
        name: o.name,
        sys: {
            country: o.country ?? 'GB',
            sunrise: NOW - 5 * HOUR,
            sunset: NOW + 5 * HOUR,
        },
        timezone: 0,
        visibility: 10000,
        weather: [condition(o)],
        wind: { deg: 225, gust: 8, speed: 4 },
    };
}

const buildThreeHour = (url: URL, o: WeatherOpts) => {
    const temp = tempFor(url.searchParams.get('units') ?? 'metric', o);
    return {
        city: { timezone: 0 },
        list: Array.from({ length: 40 }, (_, i) => ({
            dt: NOW + (i + 1) * 3 * HOUR,
            main: { temp, temp_max: temp + 1, temp_min: temp - 1 },
            pop: i === 0 ? 0.4 : 0,
            weather: [condition(o)],
        })),
    };
};

const buildDaily = (url: URL, o: WeatherOpts) => {
    const temp = tempFor(url.searchParams.get('units') ?? 'metric', o);
    return {
        list: Array.from({ length: 7 }, (_, i) => ({
            dt: NOW + i * DAY,
            pop: i === 1 ? 0.8 : 0,
            temp: { max: temp + 3 + i, min: temp - 5 + i },
            weather: [condition(o)],
        })),
    };
};

// Mock every OpenWeatherMap data endpoint: current weather (hit by both
// geolocation and city search), the 3-hour and daily forecasts, and UV.
export async function mockWeather(page: Page, o: WeatherOpts): Promise<void> {
    await page.route('**/data/2.5/**', async (route) => {
        const url = new URL(route.request().url());
        const path = url.pathname;

        if (path.endsWith('/weather'))
            return route.fulfill({ json: buildWeather(url, o) });
        if (path.endsWith('/forecast'))
            return route.fulfill({ json: buildThreeHour(url, o) });
        if (o.failOptional) return route.fulfill({ status: 401 });
        if (path.endsWith('/forecast/daily'))
            return route.fulfill({ json: buildDaily(url, o) });
        if (path.endsWith('/uvi'))
            return route.fulfill({ json: { value: o.uvi ?? 4 } });
        return route.fulfill({ status: 404 });
    });
}

// Mock reverse geocoding (run on mount once geolocation resolves).
export async function mockReverseGeo(
    page: Page,
    geo: GeoLocation,
): Promise<void> {
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
