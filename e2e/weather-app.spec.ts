import { expect, test } from '@playwright/test';

import {
    LONDON_COORDS,
    mockDirectGeo,
    mockReverseGeo,
    mockWeather,
} from './helpers';

const searchBox = (name = 'Search for a city') => ({ name });

const LONDON = {
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278,
    name: 'London',
    state: 'England',
};

test.describe('page shell', () => {
    // No geolocation here — we only care that the static chrome renders.
    test.use({ permissions: [] });

    test('renders the header and search form', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('City Weather');
        await expect(
            page.getByRole('heading', { level: 1, name: 'City Weather' }),
        ).toBeVisible();
        await expect(page.getByRole('textbox', searchBox())).toBeVisible();
        await expect(
            page.getByRole('button', { exact: true, name: 'Search' }),
        ).toBeVisible();
    });

    test('prompts for a search when location is unavailable', async ({
        page,
    }) => {
        await page.goto('/');

        await expect(
            page.getByText('Search for a city to see its weather.', {
                exact: false,
            }),
        ).toBeVisible();
    });
});

test.describe('geolocation on mount', () => {
    test.use({ geolocation: LONDON_COORDS, permissions: ['geolocation'] });

    test('loads local weather from the device location', async ({ page }) => {
        await mockReverseGeo(page, LONDON);
        await mockWeather(page, {
            country: 'GB',
            id: 803,
            main: 'Clouds',
            metricTemp: 14,
            name: 'London',
        });

        await page.goto('/');

        await expect(
            page.getByRole('heading', { level: 2, name: 'London' }),
        ).toBeVisible();
        await expect(page.getByTestId('current-temp')).toHaveText('14°');
        await expect(page.getByText('Clouds', { exact: true })).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Celsius' }),
        ).toHaveAttribute('aria-pressed', 'true');
    });

    test('shows the hourly and 7-day forecasts', async ({ page }) => {
        await mockReverseGeo(page, LONDON);
        await mockWeather(page, { metricTemp: 14, name: 'London' });

        await page.goto('/');

        const hourly = page.getByRole('region', { name: 'Next 24 hours' });
        await expect(hourly.getByRole('listitem')).toHaveCount(9);
        await expect(hourly.getByRole('listitem').first()).toContainText('Now');

        const daily = page.getByRole('list').filter({ hasText: 'Today' });
        await expect(
            page.getByRole('heading', { name: '7-day forecast' }),
        ).toBeVisible();
        await expect(daily.getByRole('listitem')).toHaveCount(7);
        // Day 1 of the mock has an 80% chance of precipitation.
        await expect(daily.getByRole('listitem').nth(1)).toContainText('80%');
    });

    test('shows UV index, wind and other details', async ({ page }) => {
        await mockReverseGeo(page, LONDON);
        await mockWeather(page, { metricTemp: 14, name: 'London', uvi: 6.4 });

        await page.goto('/');

        const details = page.getByRole('region', { name: 'Details' });
        await expect(details).toContainText('UV index');
        await expect(details).toContainText('6 High');
        // 4 m/s from 225° → 14 km/h from the SW.
        await expect(details).toContainText('14 km/h');
        await expect(details).toContainText('From the SW');
        await expect(details).toContainText('60%');
    });

    test('still renders when the daily and UV endpoints are unavailable', async ({
        page,
    }) => {
        await mockReverseGeo(page, LONDON);
        await mockWeather(page, {
            failOptional: true,
            metricTemp: 14,
            name: 'London',
        });

        await page.goto('/');

        await expect(page.getByTestId('current-temp')).toHaveText('14°');
        // Falls back to days built from the 3-hour forecast.
        await expect(
            page.getByRole('heading', { name: /-day forecast/ }),
        ).toBeVisible();
        await expect(
            page.getByRole('region', { name: 'Details' }),
        ).not.toContainText('UV index');
    });
});

test.describe('city search', () => {
    // Skip the mount geolocation flow so the only weather call is the search.
    test.use({ permissions: [] });

    test('shows weather for a single matching city', async ({ page }) => {
        await mockDirectGeo(page, [
            {
                country: 'FR',
                lat: 48.8566,
                lon: 2.3522,
                name: 'Paris',
                state: 'Île-de-France',
            },
        ]);
        await mockWeather(page, {
            country: 'FR',
            id: 500,
            main: 'Rain',
            metricTemp: 18,
            name: 'Paris',
        });

        await page.goto('/');
        await page.getByRole('textbox', searchBox()).fill('Paris');
        await page.getByRole('button', { exact: true, name: 'Search' }).click();

        await expect(
            page.getByRole('heading', { level: 2, name: 'Paris' }),
        ).toBeVisible();
        await expect(page.getByTestId('current-temp')).toHaveText('18°');
        // Rain codes switch the background to the rain scene.
        await expect(page.locator('[data-scene]')).toHaveAttribute(
            'data-scene',
            'rain',
        );
    });

    test('shows a city picker when several cities match', async ({ page }) => {
        await mockDirectGeo(page, [
            {
                country: 'US',
                lat: 39.8,
                lon: -89.6,
                name: 'Springfield',
                state: 'Illinois',
            },
            {
                country: 'US',
                lat: 37.2,
                lon: -93.3,
                name: 'Springfield',
                state: 'Missouri',
            },
        ]);
        await mockWeather(page, {
            country: 'US',
            main: 'Clear',
            metricTemp: 25,
            name: 'Springfield',
        });

        await page.goto('/');
        await page.getByRole('textbox', searchBox()).fill('Springfield');
        await page.getByRole('button', { exact: true, name: 'Search' }).click();

        await expect(
            page.getByText('More than one place matches'),
        ).toBeVisible();
        const options = page.getByRole('button', { name: /Springfield/ });
        await expect(options).toHaveCount(2);

        await options.first().click();

        await expect(
            page.getByRole('heading', { level: 2, name: 'Springfield' }),
        ).toBeVisible();
        await expect(page.getByText('Illinois, United States')).toBeVisible();
        await expect(page.getByTestId('current-temp')).toHaveText('25°');
    });

    test('shows an error when the city is unknown', async ({ page }) => {
        await mockDirectGeo(page, []);

        await page.goto('/');
        await page.getByRole('textbox', searchBox()).fill('Zzzxqqnowhere');
        await page.getByRole('button', { exact: true, name: 'Search' }).click();

        await expect(
            page.getByText('No city called “Zzzxqqnowhere” was found'),
        ).toBeVisible();
    });
});

test.describe('recent searches', () => {
    test.use({ permissions: [] });

    const PARIS = {
        country: 'FR',
        lat: 48.8566,
        lon: 2.3522,
        name: 'Paris',
        state: 'Île-de-France',
    };

    test('remembers searched cities across visits', async ({ page }) => {
        await mockDirectGeo(page, [PARIS]);
        await mockWeather(page, {
            country: 'FR',
            metricTemp: 18,
            name: 'Paris',
        });

        await page.goto('/');
        await page.getByRole('textbox', searchBox()).fill('Paris');
        await page.getByRole('button', { exact: true, name: 'Search' }).click();
        await expect(
            page.getByRole('heading', { level: 2, name: 'Paris' }),
        ).toBeVisible();
        // The city on screen isn't repeated in the list.
        await expect(
            page.getByRole('heading', { name: 'Recent searches' }),
        ).toBeHidden();

        let geocodeCalls = 0;
        page.on('request', (req) => {
            if (req.url().includes('/geo/1.0/direct')) geocodeCalls++;
        });
        await page.reload();

        const recent = page.getByRole('region', { name: 'Recent searches' });
        const paris = recent.getByRole('button', {
            name: 'Paris, Île-de-France, France',
        });
        await expect(paris).toBeVisible();
        await paris.click();

        await expect(
            page.getByRole('heading', { level: 2, name: 'Paris' }),
        ).toBeVisible();
        await expect(page.getByTestId('current-temp')).toHaveText('18°');
        // Loaded from saved coordinates, without geocoding again.
        expect(geocodeCalls).toBe(0);
    });

    test('clears the list', async ({ page }) => {
        await page.addInitScript((place) => {
            if (!sessionStorage.getItem('seeded')) {
                localStorage.setItem(
                    'city-weather:recent',
                    JSON.stringify([place]),
                );
                sessionStorage.setItem('seeded', '1');
            }
        }, PARIS);

        await page.goto('/');
        const recent = page.getByRole('region', { name: 'Recent searches' });
        await expect(recent).toBeVisible();

        await recent
            .getByRole('button', { exact: true, name: 'Clear' })
            .click();
        await expect(recent).toBeHidden();

        await page.reload();
        await expect(
            page.getByRole('region', { name: 'Recent searches' }),
        ).toBeHidden();
    });
});

test.describe('unit toggle', () => {
    test.use({ geolocation: LONDON_COORDS, permissions: ['geolocation'] });

    test('switches between Celsius and Fahrenheit', async ({ page }) => {
        await mockReverseGeo(page, LONDON);
        await mockWeather(page, {
            country: 'GB',
            id: 803,
            imperialTemp: 57,
            main: 'Clouds',
            metricTemp: 14,
            name: 'London',
        });

        await page.goto('/');
        await expect(page.getByTestId('current-temp')).toHaveText('14°');

        await page.getByRole('button', { name: 'Fahrenheit' }).click();

        await expect(page.getByTestId('current-temp')).toHaveText('57°');
        await expect(
            page.getByRole('button', { name: 'Fahrenheit' }),
        ).toHaveAttribute('aria-pressed', 'true');
        await expect(
            page.getByRole('region', { name: 'Details' }),
        ).toContainText('mph');
    });
});
