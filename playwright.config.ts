import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';

// VITE_* vars are a Vite *client* concept (import.meta.env) and aren't visible
// to the Node process Playwright runs in. Load the same env files Vite uses in
// `test` mode (.env, .env.test, …) into process.env so specs can assert against
// values like VITE_SITE_URL via process.env.
Object.assign(process.env, loadEnv('test', process.cwd(), 'VITE_'));

// E2E config. The app reads its API URLs from env vars, so we boot Vite in
// `test` mode (loads .env.test with placeholder hosts) and mock every network
// call in the specs — no real OpenWeatherMap key or connectivity required.
// (Object keys are alphabetised to satisfy the repo's sort-keys lint rule.)
export default defineConfig({
    forbidOnly: !!process.env.CI,
    fullyParallel: true,
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    reporter: [['html', { open: 'never' }], ['list']],
    retries: process.env.CI ? 2 : 0,
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:5173',
        // Emulated location (London). Individual specs override permissions
        // when they want to exercise the geolocation-denied path.
        geolocation: { latitude: 51.5074, longitude: -0.1278 },
        permissions: ['geolocation'],
        trace: 'on-first-retry',
    },
    webServer: {
        command: 'pnpm vite --mode test --port 5173 --strictPort',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
        url: 'http://localhost:5173',
    },
    workers: process.env.CI ? 1 : undefined,
});
