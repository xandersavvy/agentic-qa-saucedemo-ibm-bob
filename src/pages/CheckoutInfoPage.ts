/**
 * CheckoutInfoPage — Checkout step one: personal information form.
 *
 * URL: https://www.saucedemo.com/checkout-step-one.html
 */

import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { SELECTORS, URLS, PAGE_TITLES } from '../constants';
import type { CheckoutInfo } from '../types';

export class CheckoutInfoPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Locators ────────────────────────────────────────────────────────────────

  private get firstNameInput() { return this.page.locator(SELECTORS.FIRST_NAME); }
  private get lastNameInput()  { return this.page.locator(SELECTORS.LAST_NAME); }
  private get postalCodeInput(){ return this.page.locator(SELECTORS.POSTAL_CODE); }
  private get continueButton() { return this.page.locator(SELECTORS.CONTINUE); }
  private get cancelButton()   { return this.page.locator(SELECTORS.CANCEL); }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  /** Wait for checkout info page to be fully loaded */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForURL(`**${URLS.CHECKOUT_STEP_ONE}`);
    await this.waitForVisible(this.firstNameInput);
  }

  /** Fill the checkout information form */
  async fillCheckoutInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.zipCode);
  }

  /** Click the Continue button to advance to the overview */
  async continue(): Promise<void> {
    await this.continueButton.click();
    await this.page.waitForURL(`**${URLS.CHECKOUT_STEP_TWO}`);
  }

  /** Fill the form and advance to the overview in one step */
  async fillAndContinue(info: CheckoutInfo): Promise<void> {
    await this.fillCheckoutInfo(info);
    await this.continue();
  }

  // ─── Assertions ──────────────────────────────────────────────────────────────

  /** Assert the checkout information page is displayed */
  async assertPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(URLS.CHECKOUT_STEP_ONE));
    await this.assertPageTitle(PAGE_TITLES.CHECKOUT_INFO);
    await expect(this.firstNameInput).toBeVisible();
  }
}
