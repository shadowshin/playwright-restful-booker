import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright du projet.
 * Doc : https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Interdit d'oublier un test.only en CI
  forbidOnly: !!process.env.CI,
  // Le site de démo est partagé et parfois lent : 2 relances en CI uniquement
  retries: process.env.CI ? 2 : 0,
  // Site de démo partagé, lent à servir ses fichiers : délais adaptés à cet environnement
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  // Site de démo lent : on limite la charge pour ne pas le saturer
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://automationintesting.online',
    // Trace, capture et vidéo seulement en cas d'échec, pour analyser sans alourdir
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Tests d'interface, sur deux navigateurs
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'ui-firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    // Tests d'API : pas de navigateur, uniquement des requêtes HTTP
    {
      name: 'api',
      testDir: './tests/api',
    },
  ],
});
