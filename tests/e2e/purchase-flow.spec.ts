/**
 * Full End-to-End Purchase Flow
 *
 * Covers the complete SauceDemo purchase scenario:
 *   1. Launch and login
 *   2. Capture all-products screenshot
 *   3. Add 4 products to cart
 *   4. Remove one product
 *   5. Proceed through checkout with configurable test data
 *   6. Verify order summary (items, prices, tax, total)
 *   7. Confirm order and logout
 *
 * Test data is fully driven by the environment configuration — no hardcoded
 * values inside the test. Switch user personas by updating .env.staging.
 */

import { test, expect } from '../../src/fixtures';
import { CART_PRODUCTS, REMAINING_PRODUCTS, EXPECTED_TOTALS } from '../../src/data/products';
import { PRODUCTS } from '../../src/data/products';

test.describe('SauceDemo — Full E2E Purchase Flow', () => {

  /**
   * Uses the `authenticatedPage` fixture so every test in this describe block
   * starts with a logged-in session on the inventory page.
   */
  test.use({ storageState: undefined });

  test(
    'Complete purchase flow: add to cart, remove item, checkout, confirm, logout',
    async ({
      page,
      authenticatedPage,
      inventoryPage,
      cartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
      header,
      config,
      logger,
      screenshots,
    }) => {
      // ─── Step 1: Verify successful login ──────────────────────────────────────
      await test.step('Verify: inventory page is loaded after login', async () => {
        logger.step('Verifying inventory page loaded');
        await inventoryPage.assertPageLoaded();
        logger.info('Inventory page loaded successfully');
      });

      // ─── Step 2: Full-page screenshot of all products ─────────────────────────
      await test.step('Capture full-page screenshot of all products', async () => {
        logger.step('Capturing full-page screenshot of products listing');
        await screenshots.captureFullPage('inventory-all-products');
        logger.info('Screenshot captured');
      });

      // ─── Step 3: Add 4 products to cart ──────────────────────────────────────
      await test.step('Add 4 products to the cart', async () => {
        logger.step('Adding products to cart', {
          products: CART_PRODUCTS.map(p => p.name),
        });
        await inventoryPage.addProductsToCart(CART_PRODUCTS);
      });

      // ─── Step 4: Verify all 4 products were added ─────────────────────────────
      await test.step('Verify each product was successfully added to cart', async () => {
        logger.step('Verifying add-to-cart actions');
        for (const product of CART_PRODUCTS) {
          await inventoryPage.assertProductInCart(product);
          logger.info(`  ✓ ${product.name} added to cart`);
        }
        await header.assertCartBadge(CART_PRODUCTS.length);
        logger.info(`Cart badge shows ${CART_PRODUCTS.length}`);
      });

      // ─── Step 5: Navigate to cart ─────────────────────────────────────────────
      await test.step('Navigate to cart page', async () => {
        logger.step('Navigating to cart');
        await header.goToCart();
        await cartPage.assertPageLoaded();
      });

      // ─── Step 6: Verify all 4 products are in the cart ───────────────────────
      await test.step('Verify all 4 products are present in cart', async () => {
        logger.step('Verifying cart contents (4 products)');
        await cartPage.assertCartContents(CART_PRODUCTS);
        for (const product of CART_PRODUCTS) {
          logger.info(`  ✓ ${product.name} present in cart`);
        }
        await screenshots.captureFullPage('cart-all-4-products');
      });

      // ─── Step 7: Remove Sauce Labs Backpack ───────────────────────────────────
      await test.step('Remove Sauce Labs Backpack from cart', async () => {
        logger.step('Removing Sauce Labs Backpack from cart');
        await cartPage.removeProduct(PRODUCTS.BACKPACK);
        logger.info('Backpack removed');
      });

      // ─── Step 8: Verify backpack removed, remaining products present ──────────
      await test.step('Verify backpack removed and remaining products still present', async () => {
        logger.step('Verifying cart after removal');
        await cartPage.assertProductAbsent(PRODUCTS.BACKPACK);
        logger.info('  ✓ Backpack NOT present');

        for (const product of REMAINING_PRODUCTS) {
          await cartPage.assertProductPresent(product);
          logger.info(`  ✓ ${product.name} still present`);
        }
        await header.assertCartBadge(REMAINING_PRODUCTS.length);
        await screenshots.captureFullPage('cart-after-backpack-removal');
      });

      // ─── Step 9: Proceed to Checkout ─────────────────────────────────────────
      await test.step('Proceed to checkout', async () => {
        logger.step('Clicking Checkout button');
        await cartPage.proceedToCheckout();
        await checkoutInfoPage.assertPageLoaded();
        logger.info('Checkout information page loaded');
      });

      // ─── Step 10: Fill checkout information ──────────────────────────────────
      await test.step('Fill checkout information form', async () => {
        logger.step('Filling checkout info', {
          firstName: config.checkoutInfo.firstName,
          lastName:  config.checkoutInfo.lastName,
          zipCode:   config.checkoutInfo.zipCode,
        });
        await checkoutInfoPage.fillAndContinue(config.checkoutInfo);
        logger.info('Checkout info submitted');
      });

      // ─── Step 11: Continue to overview ───────────────────────────────────────
      await test.step('Verify checkout overview page loaded', async () => {
        logger.step('Verifying checkout overview');
        await checkoutOverviewPage.assertPageLoaded();
        logger.info('Checkout overview page loaded');
      });

      // ─── Step 12: Verify products, prices, tax, total ────────────────────────
      await test.step('Verify order items and prices on overview page', async () => {
        logger.step('Verifying order line items');
        await checkoutOverviewPage.assertOrderItems(REMAINING_PRODUCTS);
        logger.info('  ✓ Correct products listed');

        await checkoutOverviewPage.assertOrderItemPrices(REMAINING_PRODUCTS);
        logger.info('  ✓ Correct prices listed');
      });

      await test.step('Verify subtotal, tax and total', async () => {
        logger.step('Verifying order totals');
        const summary = await checkoutOverviewPage.getOrderSummary();
        logger.info('Order summary retrieved', summary as unknown as Record<string, unknown>);

        await checkoutOverviewPage.assertOrderTotals(EXPECTED_TOTALS);
        logger.info('  ✓ Item total correct');
        logger.info('  ✓ Tax correct');
        logger.info('  ✓ Grand total correct');

        await screenshots.captureFullPage('checkout-overview');
      });

      // ─── Step 13: Finish the purchase ────────────────────────────────────────
      await test.step('Finish the purchase', async () => {
        logger.step('Clicking Finish button');
        await checkoutOverviewPage.finishOrder();
        logger.info('Order submitted');
      });

      // ─── Step 14: Verify order confirmation page ──────────────────────────────
      await test.step('Verify order confirmation page', async () => {
        logger.step('Verifying confirmation page');
        await checkoutCompletePage.assertPageLoaded();
        await checkoutCompletePage.assertOrderConfirmation();
        logger.info('  ✓ Order confirmed');

        await screenshots.captureFullPage('order-confirmation');
      });

      // ─── Step 15: Logout ──────────────────────────────────────────────────────
      await test.step('Logout', async () => {
        logger.step('Logging out');
        await header.logout();
        logger.info('Logout triggered');
      });

      // ─── Step 16: Verify logout ───────────────────────────────────────────────
      await test.step('Verify successful logout', async () => {
        const loginPage = { assertLoginPageVisible: async () => {
          await expect(page.locator('[data-test="login-button"]')).toBeVisible();
          await expect(page).toHaveURL(/\/$|index\.html/);
        }};
        await loginPage.assertLoginPageVisible();
        logger.info('  ✓ Login page visible — logout successful');
        await screenshots.captureFullPage('post-logout-login-page');
      });
    }
  );
});
