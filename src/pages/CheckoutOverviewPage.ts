/**
 * CheckoutOverviewPage — Checkout step two: order summary.
 *
 * URL: https://www.saucedemo.com/checkout-step-two.html
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES } from '../constants';
import type { Product, OrderSummary } from '../types';

export class CheckoutOverviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get overviewContainer() { return this.page.locator(SELECTORS.OVERVIEW_CONTAINER); }
  private get subtotalLabel()     { return this.page.locator(SELECTORS.SUBTOTAL_LABEL); }
  private get taxLabel()          { return this.page.locator(SELECTORS.TAX_LABEL); }
  private get totalLabel()        { return this.page.locator(SELECTORS.TOTAL_LABEL); }
  private get finishButton()      { return this.page.locator(SELECTORS.FINISH_BUTTON); }
  private get cancelButton()      { return this.page.locator(SELECTORS.CANCEL); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Wait for the checkout overview page to load */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(`**${URLS.CHECKOUT_STEP_TWO}`);
    await this.waitForVisible(this.overviewContainer);
  }

  /** Click the Finish button to complete the order */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
    await this.page.waitForURL(`**${URLS.CHECKOUT_COMPLETE}`);
  }

  /** Retrieve the order summary values from the page */
  async getOrderSummary(): Promise<OrderSummary> {
    const itemTotal = (await this.subtotalLabel.textContent())?.trim() ?? '';
    const tax       = (await this.taxLabel.textContent())?.trim() ?? '';
    const total     = (await this.totalLabel.textContent())?.trim() ?? '';
    return { itemTotal, tax, total };
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the checkout overview page is displayed */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(URLS.CHECKOUT_STEP_TWO));
    await this.assertPageTitle(PAGE_TITLES.CHECKOUT_OVERVIEW);
    await expect(this.overviewContainer).toBeVisible();
  }

  /** Assert the listed products in the overview (order-independent) */
  async assertOrderItems(products: Product[]): Promise<void> {
    const names = await this.page
      .locator(SELECTORS.OVERVIEW_CONTAINER)
      .locator(SELECTORS.ITEM_NAME)
      .allTextContents();
    const trimmed = names.map(n => n.trim()).sort();
    const expected = products.map(p => p.name).sort();
    expect(trimmed).toEqual(expected);
  }

  /** Assert each product's price is shown correctly */
  async assertOrderItemPrices(products: Product[]): Promise<void> {
    for (const product of products) {
      const priceLocator = this.page
        .locator(SELECTORS.OVERVIEW_CONTAINER)
        .locator(SELECTORS.INVENTORY_ITEM)
        .filter({ hasText: product.name })
        .locator(SELECTORS.ITEM_PRICE);
      await expect(priceLocator).toHaveText(product.price);
    }
  }

  /** Assert the subtotal, tax and total label values */
  async assertOrderTotals(summary: OrderSummary): Promise<void> {
    await expect(this.subtotalLabel).toHaveText(summary.itemTotal);
    await expect(this.taxLabel).toHaveText(summary.tax);
    await expect(this.totalLabel).toHaveText(summary.total);
  }
}
