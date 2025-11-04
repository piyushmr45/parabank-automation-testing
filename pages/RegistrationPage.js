import { expect } from '@playwright/test';
import fs from 'fs';

export class RegistrationPage {
  constructor(page) {
    this.page = page;
  this.firstName = page.locator('input[name="customer.firstName"]');
  this.lastName = page.locator('input[name="customer.lastName"]');
  this.address = page.locator('input[name="customer.address.street"]');
  this.city = page.locator('input[name="customer.address.city"]');
  this.state = page.locator('input[name="customer.address.state"]');
  this.zip = page.locator('input[name="customer.address.zipCode"]');
  this.phone = page.locator('input[name="customer.phoneNumber"]');
  this.ssn = page.locator('input[name="customer.ssn"]');
  this.username = page.locator('input[name="customer.username"]');
  this.password = page.locator('input[name="customer.password"]');
  this.repeatedPassword = page.locator('input[name="repeatedPassword"]');
    this.registerBtn = page.getByRole('button', { name: 'Register' });
  }

  async goto() {
    // Use relative path to resolve under baseURL (e.g. /parabank/register.htm)
    await this.page.goto('register.htm');
  }

  async register(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.address.fill(user.address);
    await this.city.fill(user.city);
    await this.state.fill(user.state);
    await this.zip.fill(user.zip);
    await this.phone.fill(user.phone);
    await this.ssn.fill(user.ssn);
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.repeatedPassword.fill(user.password);
    await this.registerBtn.click();
  }

  async verifySuccess() {
    try {
      // Wait a little longer for the success message; if it fails we'll
      // capture diagnostics to help debugging (HTML + screenshot).
      await expect(this.page.getByText('Your account was created')).toBeVisible({ timeout: 10000 });
    } catch (err) {
      // Create diagnostics folder if needed
      const dir = 'test-results/diagnostics';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const timestamp = Date.now();
      const htmlPath = `${dir}/register-failure-${timestamp}.html`;
      const pngPath = `${dir}/register-failure-${timestamp}.png`;
      // Save screenshot and HTML for post-mortem
      try {
        await this.page.screenshot({ path: pngPath, fullPage: true });
      } catch (sErr) {
        // ignore screenshot errors
      }
      try {
        const content = await this.page.content();
        fs.writeFileSync(htmlPath, content, 'utf8');
      } catch (wErr) {
        // ignore write errors
      }
      // Re-throw original error so the test still fails with context
      throw err;
    }
  }
}
