/**
 * LoginPage — encapsulates all interactions with the SauceDemo login page.
 *
 * URL: https://www.saucedemo.com/
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES } from '../constants';
import type { UserCredentials } from '../types';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get usernameInput() { return this.page.locator(SELECTORS.USERNAME_INPUT); }
  private get passwordInput() { return this.page.locator(SELECTORS.PASSWORD_INPUT); }
  private get loginButton()   { return this.page.locator(SELECTORS.LOGIN_BUTTON); }
  private get errorMessage()  { return this.page.locator(SELECTORS.ERROR_MESSAGE); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Navigate to the login page */
  async open(): Promise<void> {
    await this.navigate(URLS.LOGIN);
    await this.waitForVisible(this.loginButton);
  }

  /** Fill in credentials and submit the login form */
  async login(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  /** High-level action: open the page and login in one call */
  async openAndLogin(credentials: UserCredentials): Promise<void> {
    await this.open();
    await this.login(credentials);
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert that login succeeded — URL should be on inventory page */
  async assertLoginSucceeded(): Promise<void> {
    await this.page.waitForURL(`**${URLS.INVENTORY}`, { timeout: 15_000 });
    await expect(this.page).toHaveURL(new RegExp(URLS.INVENTORY));
  }

  /** Assert that an error message is visible with the expected text */
  async assertLoginError(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  /** Assert login page is visible (user is logged out) */
  async assertLoginPageVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
    await expect(this.page).toHaveURL(new RegExp(`${URLS.LOGIN}$`));
  }
}
