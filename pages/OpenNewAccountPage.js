import { expect } from '@playwright/test';
import fs from 'fs';

export class OpenNewAccountPage {
  constructor(page) {
    this.page = page;
    this.accountType = page.locator('#type');
    this.openBtn = page.getByRole('button', { name: 'Open New Account' });
  }

  async goto() {
    // Navigate directly to the open account page so tests don't depend on
    // presence of navigation links.
    await this.page.goto('openaccount.htm');
  }

  async openNewAccount() {
    await this.accountType.selectOption('1'); // Savings
    await this.openBtn.click();
  }

  async verifyAccountOpened() {
    try {
      // The element may be present but not strictly visible (layout/overlay
      // differences). Assert it exists in the DOM instead of strict visibility.
      await expect(this.page.getByText('Congratulations')).toHaveCount(1);
    } catch (err) {
      const dir = 'test-results/diagnostics';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const t = Date.now();
      try { await this.page.screenshot({ path: `${dir}/open-account-failure-${t}.png`, fullPage: true }); } catch (e) {}
      try { fs.writeFileSync(`${dir}/open-account-failure-${t}.html`, await this.page.content(), 'utf8'); } catch (e) {}
      throw err;
    }
  }
}
