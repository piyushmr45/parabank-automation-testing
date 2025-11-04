// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  reporter: [  // 3. This is only for this project
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  globalSetup: './global-setup.js',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    //baseURL: 'http://localhost:3000',
    //baseURL: 'https://parabank.parasoft.com/parabank/index.htm',
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  /*projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },*/

    // ... (rest of your config above) ...

  projects: [ //this id only for project
    // --- 1. DEFINE THE SETUP PROJECT ---
    // This project will run *first* and *only* run your setup file.
    // {
    //   name: 'setup',
    //   testMatch: /global.setup.js/, // Only run the setup file
    // },

    // --- 2. DEFINE YOUR MAIN E2E TESTS ---
    // These tests will *depend on* 'setup' (won't run until it passes)
    // and will *use* the authentication file it creates.
    {
      name: 'e2e-tests-with-auth',
      testDir: './tests/',
      testIgnore: ['login.spec.js', 'register.spec.js'], // Ignore the login test
      fullyParallel: true,
      //dependencies: ['setup'], // <-- This is the magic
      use: {
        ...devices['Desktop Chrome'],
        // NOTE: removed storageState so tests that perform registration/login
        // start from an unauthenticated session. If you want a separate
        // project that reuses an authenticated state, add a dedicated project.
      },
    },

    // --- 3. DEFINE YOUR LOGIN TEST (NO AUTH) ---
    // This project runs the login test *without* auth
    // and does *not* depend on the setup.
    {
      name: 'e2e-tests-no-auth',
      testMatch: /\/(login|register)\.spec\.js/, // Match login OR register
      fullyParallel: true,
      use: {
        ...devices['Desktop Chrome'],
        // No storageState needed
      },
    },


    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

