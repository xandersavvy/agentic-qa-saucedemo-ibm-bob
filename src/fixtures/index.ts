/**
 * Custom Playwright test fixtures for the SauceDemo framework.
 *
 * Extends the base `test` object with:
 *  - Pre-instantiated Page Objects for every authenticated page
 *  - The resolved EnvironmentConfig
 *  - Logger and ScreenshotUtil instances
 *  - Automatic failure screenshots and log attachment
 *
 * All tests import `test` and `expect` from this module instead of
 * '@playwright/test'.
 */

import { test as base, expect, TestInfo } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { Logger } from '../utils/logger';
import { ScreenshotUtil } from '../utils/screenshotUtil';
import { environmentConfig } from '../config/environment';
import type { EnvironmentConfig } from '../types';

// ─── Fixture Types ────────────────────────────────────────────────────────────

type SauceDemoFixtures = {
  /** Environment configuration resolved from .env / process.env */
  config: EnvironmentConfig;
  /** Login page object */
  loginPage: LoginPage;
  /** Inventory / products page object */
  inventoryPage: InventoryPage;
  /** Shopping cart page object */
  cartPage: CartPage;
  /** Checkout step one — personal information */
  checkoutInfoPage: CheckoutInfoPage;
  /** Checkout step two — order overview */
  checkoutOverviewPage: CheckoutOverviewPage;
  /** Checkout confirmation page */
  checkoutCompletePage: CheckoutCompletePage;
  /** Shared header component */
  header: HeaderComponent;
  /** Structured logger scoped to the current test */
  logger: Logger;
  /** Screenshot utility scoped to the current test */
  screenshots: ScreenshotUtil;
  /** Pre-authenticated state: navigates to the inventory page before each test */
  authenticatedPage: void;
};

// ─── Fixture Definitions ──────────────────────────────────────────────────────

export const test = base.extend<SauceDemoFixtures>({

  config: async ({}, use) => {
    await use(environmentConfig);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },

  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },

  logger: async ({}, use, testInfo: TestInfo) => {
    const logger = new Logger(testInfo.title);
    logger.clear();
    await use(logger);
    // After the test completes, attach all logs to the report
    await logger.attachToReport(testInfo);
  },

  screenshots: async ({ page }, use, testInfo: TestInfo) => {
    const screenshotUtil = new ScreenshotUtil(page, testInfo);
    await use(screenshotUtil);
  },

  /**
   * Fixture that logs in and lands on the inventory page.
   * Any test that declares this fixture gets a pre-authenticated browser session.
   */
  authenticatedPage: async ({ page, config, logger }, use, testInfo: TestInfo) => {
    const loginPage = new LoginPage(page);
    logger.step('Logging in', { username: config.credentials.username });
    await loginPage.openAndLogin(config.credentials);
    await loginPage.assertLoginSucceeded();
    logger.info('Login succeeded, proceeding to inventory page');

    await use();

    // Teardown: capture a screenshot on test failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotUtil = new ScreenshotUtil(page, testInfo);
      logger.error('Test failed — capturing failure screenshot');
      await screenshotUtil.captureOnFailure();
    }
  },
});

export { expect };
