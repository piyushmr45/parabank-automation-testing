// global-setup.js
import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function globalSetup(config) {
  // If no credentials are provided, skip global setup. This keeps tests
  // runnable locally without requiring env vars.
  const user = process.env.PARABANK_USER || process.env.USERNAME;
  const pass = process.env.PARABANK_PASS || process.env.PASSWORD;
  if (!user || !pass) {
    console.log('global-setup: no credentials found in env, skipping authentication setup');
    return;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Normalize base URL (strip trailing filename if present)
  let base = process.env.BASE_URL || 'http://127.0.0.1:3000';
  try {
    // Strip trailing filename like index.htm
    base = base.replace(/\/[^\/]*$/, '');
  } catch (e) {
    // ignore
  }

  // Go to ParaBank login page
  try {
    await page.goto(`${base}/login.htm`);
    // Ensure the login page loaded by checking for the username input
    await page.waitForSelector('input[name="username"]', { timeout: 5000 });
  } catch (e) {
    console.log('global-setup: login page not reachable or selector missing, skipping auth setup:', e.message);
    await browser.close();
    return;
  }

  // Login using credentials from .env
  await page.fill('input[name="username"]', user);
  await page.fill('input[name="password"]', pass);
  await page.click('input[value="Log In"]');

  // Wait for successful login (change selector if needed)
  await page.waitForSelector('a[href*="logout.htm"]', { timeout: 10000 });

  // Create .auth folder if it doesn’t exist
  const authDir = 'playwright/.auth';
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Save authentication state
  await page.context().storageState({ path: `${authDir}/user.json` });

  await browser.close();
}

export default globalSetup;
