import { expect } from '@playwright/test';

export class BillPayPage {
  constructor(page) {
    this.page = page;
    this.payeeName = page.locator('input[name="payee.name"]');
    this.address = page.locator('input[name="payee.address.street"]');
    this.city = page.locator('input[name="payee.address.city"]');
    this.state = page.locator('input[name="payee.address.state"]');
    this.zip = page.locator('input[name="payee.address.zipCode"]');
    this.phone = page.locator('input[name="payee.phoneNumber"]');
    this.account = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccount = page.locator('input[name="verifyAccount"]');
    this.amount = page.locator('input[name="amount"]');
    this.sendPayment = page.getByRole('button', { name: 'Send Payment' });
  }

  async goto() {
    await this.page.getByRole('link', { name: 'Bill Pay' }).click();
  }

  async makePayment(payment) {
    await this.payeeName.fill(payment.name);
    await this.address.fill(payment.address);
    await this.city.fill(payment.city);
    await this.state.fill(payment.state);
    await this.zip.fill(payment.zip);
    await this.phone.fill(payment.phone);
    await this.account.fill(payment.account);
    await this.verifyAccount.fill(payment.account);
    await this.amount.fill(payment.amount);
    await this.sendPayment.click();
  }

  async verifyPaymentSuccess() {
    await expect(this.page.getByText('Bill Payment to')).toBeVisible();
  }
}
