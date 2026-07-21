/**
 * CheckoutCompletePage — Order confirmation page.
 *
 * URL: https://www.saucedemo.com/checkout-complete.html
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES, EXPECTED_TEXT } from '../constants';

export class CheckoutCompletePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get completeContainer() { return this.page.locator(SELECTORS.COMPLETE_CONTAINER); }
  private get completeHeader()    { return this.page.locator(SELECTORS.COMPLETE_HEADER); }
  private get completeText()      { return this.page.locator(SELECTORS.COMPLETE_TEXT); }
  private get backToProductsBtn() { return this.page.locator(SELECTORS.BACK_TO_PRODUCTS); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Wait for the confirmation page to load */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(`**${URLS.CHECKOUT_COMPLETE}`);
    await this.waitForVisible(this.completeContainer);
  }

  /** Click "Back Home" to return to the inventory page */
  async goBackHome(): Promise<void> {
    await this.backToProductsBtn.click();
    await this.page.waitForURL(`**${URLS.INVENTORY}`);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the confirmation page is displayed with success content */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(URLS.CHECKOUT_COMPLETE));
    await this.assertPageTitle(PAGE_TITLES.CHECKOUT_COMPLETE);
    await expect(this.completeContainer).toBeVisible();
  }

  /** Assert the thank you message is visible */
  async assertOrderConfirmation(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText(EXPECTED_TEXT.ORDER_CONFIRMED);
    await expect(this.completeText).toContainText('Your order has been dispatched');
  }
}
