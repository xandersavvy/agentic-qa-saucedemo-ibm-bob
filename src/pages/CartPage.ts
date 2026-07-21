/**
 * CartPage — encapsulates all interactions with the shopping cart page.
 *
 * URL: https://www.saucedemo.com/cart.html
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES } from '../constants';
import type { Product } from '../types';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get cartList()       { return this.page.locator(SELECTORS.CART_LIST); }
  private get checkoutButton() { return this.page.locator(SELECTORS.CHECKOUT_BUTTON); }

  /** Remove button for a specific product by slug */
  private removeButton(slug: string) {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Wait for cart page to be fully loaded */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(`**${URLS.CART}`);
    await this.waitForVisible(this.cartList);
  }

  /** Remove a product from the cart by its slug */
  async removeProduct(product: Product): Promise<void> {
    await this.removeButton(product.slug).click();
  }

  /** Click Checkout button */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL(`**${URLS.CHECKOUT_STEP_ONE}`);
  }

  /** Get all item names currently in the cart */
  async getCartItemNames(): Promise<string[]> {
    return this.page.locator(SELECTORS.CART_ITEM_NAME).allTextContents();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert that the cart page is displayed */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(URLS.CART));
    await this.assertPageTitle(PAGE_TITLES.YOUR_CART);
    await expect(this.cartList).toBeVisible();
  }

  /** Assert a specific product is present in the cart */
  async assertProductPresent(product: Product): Promise<void> {
    const productNameLocator = this.page
      .locator(SELECTORS.CART_ITEM)
      .filter({ hasText: product.name })
      .locator(SELECTORS.CART_ITEM_NAME);
    await expect(productNameLocator).toBeVisible();
    await expect(productNameLocator).toHaveText(product.name);
  }

  /** Assert a specific product is NOT present in the cart */
  async assertProductAbsent(product: Product): Promise<void> {
    const items = await this.getCartItemNames();
    const trimmed = items.map(t => t.trim());
    expect(trimmed).not.toContain(product.name);
  }

  /** Assert the exact list of products in the cart (order-independent) */
  async assertCartContents(products: Product[]): Promise<void> {
    const names = (await this.getCartItemNames()).map(n => n.trim());
    const expected = products.map(p => p.name).sort();
    expect(names.sort()).toEqual(expected);
  }
}
