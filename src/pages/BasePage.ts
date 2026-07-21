/**
 * BasePage — abstract base class for all Page Objects.
 *
 * Provides:
 *  - Shared Page instance management
 *  - Common navigation helpers
 *  - Waiting and assertion helpers
 *  - Logging integration
 */

import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TIMEOUTS } from '../constants';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  /** Navigate to an absolute or relative URL */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /** Return the current page URL */
  get currentUrl(): string {
    return this.page.url();
  }

  // ─── Header Actions ──────────────────────────────────────────────────────────

  /** Open the hamburger side menu */
  async openMenu(): Promise<void> {
    await this.page.locator(SELECTORS.OPEN_MENU).click();
    // Wait for the menu overlay to become visible
    await this.page.locator(SELECTORS.LOGOUT_LINK).waitFor({ state: 'visible', timeout: TIMEOUTS.SHORT });
  }

  /** Logout via the side menu */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.locator(SELECTORS.LOGOUT_LINK).click();
    await this.page.waitForURL('/', { timeout: TIMEOUTS.MEDIUM });
  }

  /** Click the shopping cart icon in the header */
  async goToCart(): Promise<void> {
    await this.page.locator(SELECTORS.SHOPPING_CART_LINK).click();
    await this.page.waitForURL('**/cart.html', { timeout: TIMEOUTS.MEDIUM });
  }

  // ─── Header Assertions ───────────────────────────────────────────────────────

  /** Assert the cart badge shows the expected item count */
  async assertCartBadge(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.page.locator(SELECTORS.CART_BADGE)).not.toBeVisible();
    } else {
      await expect(this.page.locator(SELECTORS.CART_BADGE)).toHaveText(String(count));
    }
  }

  /** Assert the secondary-header page title */
  async assertPageTitle(title: string): Promise<void> {
    await expect(this.page.locator(SELECTORS.PAGE_TITLE)).toHaveText(title);
  }

  // ─── Generic Helpers ─────────────────────────────────────────────────────────

  /** Retrieve the text content of a locator */
  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  /** Wait for a locator to be visible */
  protected async waitForVisible(locator: Locator, timeout = TIMEOUTS.MEDIUM): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }
}
