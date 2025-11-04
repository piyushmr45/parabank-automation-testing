import { expect } from '@playwright/test';
import fs from 'fs';

export class TransferFundsPage {
  constructor(page) {
    this.page = page;
    this.amount = page.locator('#amount');
    this.toAccount = page.locator('#toAccountId');
    this.transferBtn = page.getByRole('button', { name: 'Transfer' });
  }

  async goto() {
    // Navigate directly to the transfer funds page so tests don't depend on
    // presence of navigation links.
    await this.page.goto('transfer.htm');
  }

  async transferFunds(amount, toAccount) {
    await this.amount.fill(amount);
    // Choose a target account: prefer the requested value, otherwise pick
    // the first available non-placeholder option.
    try {
      const optionCount = await this.toAccount.locator('option').count();
      if (optionCount === 0) throw new Error('No options available in toAccount select');
      // Try to select the provided value first
      if (toAccount) {
        const selected = await this.toAccount.selectOption(String(toAccount)).catch(() => null);
        if (!selected) {
          // fallback to first non-empty option (index 1 if index 0 is placeholder)
          const fallbackIndex = optionCount > 1 ? 1 : 0;
          await this.toAccount.selectOption({ index: fallbackIndex });
        }
      } else {
        const fallbackIndex = optionCount > 1 ? 1 : 0;
        await this.toAccount.selectOption({ index: fallbackIndex });
      }
      await this.transferBtn.click();
    } catch (err) {
      const dir = 'test-results/diagnostics';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const t = Date.now();
      try { await this.page.screenshot({ path: `${dir}/transfer-failure-${t}.png`, fullPage: true }); } catch (e) {}
      try { fs.writeFileSync(`${dir}/transfer-failure-${t}.html`, await this.page.content(), 'utf8'); } catch (e) {}
      throw err;
    }
  }

  async verifyTransferSuccess() {
    await expect(this.page.getByText('has been transferred')).toBeVisible();
  }
}
