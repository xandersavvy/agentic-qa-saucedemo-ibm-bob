/**
 * InventoryPage — encapsulates all interactions with the products listing page.
 *
 * URL: https://www.saucedemo.com/inventory.html
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES } from '../constants';
import type { Product } from '../types';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get inventoryList()  { return this.page.locator(SELECTORS.INVENTORY_LIST); }
  private get inventoryItems() { return this.page.locator(SELECTORS.INVENTORY_ITEM); }
  private get sortDropdown()   { return this.page.locator(SELECTORS.SORT_CONTAINER); }

  /** Add-to-cart button locator for a specific product slug */
  private addToCartButton(slug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
  }

  /** Remove-from-cart button locator for a specific product slug */
  private removeButton(slug: string): Locator {
    return this.page.locator(`[data-test="remove-${slug}"]`);
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Wait for the inventory page to be fully loaded */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(`**${URLS.INVENTORY}`);
    await this.waitForVisible(this.inventoryList);
  }

  /** Add a single product to the cart by its slug */
  async addProductToCart(product: Product): Promise<void> {
    await this.addToCartButton(product.slug).click();
  }

  /** Add multiple products to the cart */
  async addProductsToCart(products: Product[]): Promise<void> {
    for (const product of products) {
      await this.addProductToCart(product);
    }
  }

  /** Remove a product from the cart using the Remove button on the inventory page */
  async removeProductFromCart(product: Product): Promise<void> {
    await this.removeButton(product.slug).click();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the inventory page is displayed */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(URLS.INVENTORY));
    await this.assertPageTitle(PAGE_TITLES.PRODUCTS);
    await expect(this.inventoryList).toBeVisible();
  }

  /** Assert the total number of products visible on the page */
  async assertProductCount(count: number): Promise<void> {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  /** Assert a specific product's "Add to cart" button is now a "Remove" button */
  async assertProductInCart(product: Product): Promise<void> {
    await expect(this.removeButton(product.slug)).toBeVisible();
    await expect(this.addToCartButton(product.slug)).not.toBeVisible();
  }

  /** Assert a product's "Remove" button is NOT visible (not in cart) */
  async assertProductNotInCart(product: Product): Promise<void> {
    await expect(this.removeButton(product.slug)).not.toBeVisible();
    await expect(this.addToCartButton(product.slug)).toBeVisible();
  }

  /** Get all product names currently displayed on the page */
  async getProductNames(): Promise<string[]> {
    return this.page.locator(SELECTORS.ITEM_NAME).allTextContents();
  }
}
