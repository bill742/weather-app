import { expect, test } from '@playwright/test';

import {
    LONDON_COORDS,
    mockDirectGeo,
    mockReverseGeo,
    mockWeather,
} from './helpers';

const searchBox = (name = 'Search for a city') => ({ name });

test.describe('page shell', () => {
    // No geolocation here — we only care that the static chrome renders.
    test.use({ permissions: [] });

    test('renders the header and search form', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('City Weather');
        await expect(
            page.getByRole('heading', { level: 1, name: 'City Weather' }),
        ).toBeVisible();
        await expect(
            page.getByRole('textbox', searchBox()),
        ).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'Search' }),
        ).toBeVisible();
    });
});

test.describe('geolocation on mount', () => {
    test.use({ geolocation: LONDON_COORDS, permissions: ['geolocation'] });

    test('loads local weather from the device location', async ({ page }) => {
        await mockReverseGeo(page, {
            country: 'GB',
            lat: 51.5074,
            lon: -0.1278,
            name: 'London',
            state: 'England',
        });
        await mockWeather(page, {
            country: 'GB',
            id: 803,
            main: 'Clouds',
            metricTemp: 14,
            name: 'London',
        });

        await page.goto('/');

        await expect(page.getByRole('heading', { level: 2 })).toContainText(
            'London',
        );
        await expect(page.getByText('14°C')).toBeVisible();
        await expect(page.getByText('Clouds')).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'View in Fahrenheit' }),
        ).toBeVisible();
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
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(page.getByRole('heading', { level: 2 })).toContainText(
            'Paris',
        );
        await expect(page.getByText('18°C')).toBeVisible();
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
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(page.getByText('Multiple cities found')).toBeVisible();
        const options = page.getByRole('button', { name: /Springfield/ });
        await expect(options).toHaveCount(2);

        await options.first().click();

        await expect(page.getByRole('heading', { level: 2 })).toContainText(
            'Springfield',
        );
        await expect(page.getByText('25°C')).toBeVisible();
    });

    test('shows an error when the city is unknown', async ({ page }) => {
        await mockDirectGeo(page, []);

        await page.goto('/');
        await page.getByRole('textbox', searchBox()).fill('Zzzxqqnowhere');
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(page.getByText('City not found')).toBeVisible();
    });
});

test.describe('unit toggle', () => {
    test.use({ geolocation: LONDON_COORDS, permissions: ['geolocation'] });

    test('switches between Celsius and Fahrenheit', async ({ page }) => {
        await mockReverseGeo(page, {
            country: 'GB',
            lat: 51.5074,
            lon: -0.1278,
            name: 'London',
            state: 'England',
        });
        await mockWeather(page, {
            country: 'GB',
            id: 803,
            imperialTemp: 57,
            main: 'Clouds',
            metricTemp: 14,
            name: 'London',
        });

        await page.goto('/');
        await expect(page.getByText('14°C')).toBeVisible();

        await page.getByRole('button', { name: 'View in Fahrenheit' }).click();

        await expect(page.getByText('57°F')).toBeVisible();
        await expect(
            page.getByRole('button', { name: 'View in Celsius' }),
        ).toBeVisible();
    });
});
