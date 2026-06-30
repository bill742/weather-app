/* eslint-disable no-console */
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Homepage does not have accessibility issues', () => {
    test('Should not have any automatically detectable accessibility issues', async ({
        page,
    }) => {
        await page.goto('./');

        console.log('Running accessibility scan on homepage');

        const accessibilityScanResults = await new AxeBuilder({
            page,
        }).analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

test.describe('Page Metadata and Document Structure', () => {
    test('Verify Home Page Metadata', async ({ page }) => {
        await page.goto('/');

        console.log('Checking metadata on homepage');

        const lang = await page.locator('html').getAttribute('lang');
        expect(lang).toBe('en');

        const title = await page.title();
        expect(title).toBe('City Weather');

        const descriptionMeta = await page
            .locator('meta[name="description"]')
            .getAttribute('content');
        expect(descriptionMeta).toBe(
            'See your local weather conditions or search for the forecast in cities around the world',
        );

        const canonicalLink = await page
            .locator('link[rel="canonical"]')
            .getAttribute('href');
        expect(canonicalLink).toBe(process.env.VITE_SITE_URL);
    });
});
