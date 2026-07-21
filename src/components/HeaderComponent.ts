/**
 * HeaderComponent — reusable component representing the SauceDemo top header.
 *
 * Shared across all authenticated pages. Provides access to navigation,
 * cart badge, and the hamburger side menu.
 */

import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from '../constants';

export class HeaderComponent {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  get openMenuButton(): Locator  { return this.page.locator(SELECTORS.OPEN_MENU); }
  get cartLink(): Locator        { return this.page.locator(SELECTORS.SHOPPING_CART_LINK); }
  get cartBadge(): Locator       { return this.page.locator(SELECTORS.CART_BADGE); }
  get logoutLink(): Locator      { return this.page.locator(SELECTORS.LOGOUT_LINK); }
  get allItemsLink(): Locator    { return this.page.locator(SELECTORS.ALL_ITEMS_LINK); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Open the hamburger side menu */
  async openMenu(): Promise<void> {
    await this.openMenuButton.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  /** Close the side menu via the close button */
  async closeMenu(): Promise<void> {
    await this.page.locator('[data-test="close-menu"]').click();
  }

  /** Navigate to the cart page */
  async goToCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart.html', { timeout: TIMEOUTS.MEDIUM });
  }

  /** Logout via the side menu */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
    await this.page.waitForURL('/', { timeout: TIMEOUTS.MEDIUM });
  }

  /** Navigate to all items (inventory) via the side menu */
  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.allItemsLink.click();
    await this.page.waitForURL('**/inventory.html', { timeout: TIMEOUTS.MEDIUM });
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the cart badge shows the expected count */
  async assertCartBadge(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toHaveText(String(count));
    }
  }

  /** Assert the menu is visible after opening */
  async assertMenuOpen(): Promise<void> {
    await expect(this.logoutLink).toBeVisible();
  }
}
