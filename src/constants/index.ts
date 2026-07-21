/**
 * Application-wide constants for the SauceDemo framework.
 * All magic strings and values are centralised here.
 */

// ─── URL Paths ────────────────────────────────────────────────────────────────

export const URLS = {
  LOGIN:              '/',
  INVENTORY:          '/inventory.html',
  CART:               '/cart.html',
  CHECKOUT_STEP_ONE:  '/checkout-step-one.html',
  CHECKOUT_STEP_TWO:  '/checkout-step-two.html',
  CHECKOUT_COMPLETE:  '/checkout-complete.html',
} as const;

// ─── Page Titles ─────────────────────────────────────────────────────────────

export const PAGE_TITLES = {
  PRODUCTS:          'Products',
  YOUR_CART:         'Your Cart',
  CHECKOUT_INFO:     'Checkout: Your Information',
  CHECKOUT_OVERVIEW: 'Checkout: Overview',
  CHECKOUT_COMPLETE: 'Checkout: Complete!',
} as const;

// ─── data-test Selectors ─────────────────────────────────────────────────────

export const SELECTORS = {
  // Login page
  USERNAME_INPUT:   '[data-test="username"]',
  PASSWORD_INPUT:   '[data-test="password"]',
  LOGIN_BUTTON:     '[data-test="login-button"]',
  ERROR_MESSAGE:    '[data-test="error"]',

  // Header
  OPEN_MENU:          'button#react-burger-menu-btn',
  SHOPPING_CART_LINK: '[data-test="shopping-cart-link"]',
  CART_BADGE:         '[data-test="shopping-cart-badge"]',
  PAGE_TITLE:         '[data-test="title"]',

  // Sidebar
  LOGOUT_LINK:    '[data-test="logout-sidebar-link"]',
  ALL_ITEMS_LINK: '[data-test="inventory-sidebar-link"]',
  RESET_LINK:     '[data-test="reset-sidebar-link"]',

  // Inventory page
  INVENTORY_LIST:    '[data-test="inventory-list"]',
  INVENTORY_ITEM:    '[data-test="inventory-item"]',
  ITEM_NAME:         '[data-test="inventory-item-name"]',
  ITEM_PRICE:        '[data-test="inventory-item-price"]',
  SORT_CONTAINER:    '[data-test="product-sort-container"]',

  // Cart page
  CART_LIST:         '[data-test="cart-list"]',
  CART_ITEM:         '[data-test="inventory-item"]',
  CART_ITEM_NAME:    '[data-test="inventory-item-name"]',
  CART_ITEM_PRICE:   '[data-test="inventory-item-price"]',
  CART_ITEM_QTY:     '[data-test="item-quantity"]',
  CONTINUE_SHOPPING: '[data-test="continue-shopping"]',
  CHECKOUT_BUTTON:   '[data-test="checkout"]',

  // Checkout Step One
  FIRST_NAME:    '[data-test="firstName"]',
  LAST_NAME:     '[data-test="lastName"]',
  POSTAL_CODE:   '[data-test="postalCode"]',
  CONTINUE:      '[data-test="continue"]',
  CANCEL:        '[data-test="cancel"]',

  // Checkout Step Two (Overview)
  OVERVIEW_CONTAINER:   '[data-test="checkout-summary-container"]',
  SUBTOTAL_LABEL:       '[data-test="subtotal-label"]',
  TAX_LABEL:            '[data-test="tax-label"]',
  TOTAL_LABEL:          '[data-test="total-label"]',
  FINISH_BUTTON:        '[data-test="finish"]',
  PAYMENT_INFO_VALUE:   '[data-test="payment-info-value"]',
  SHIPPING_INFO_VALUE:  '[data-test="shipping-info-value"]',

  // Checkout Complete
  COMPLETE_CONTAINER:  '[data-test="checkout-complete-container"]',
  COMPLETE_HEADER:     '[data-test="complete-header"]',
  COMPLETE_TEXT:       '[data-test="complete-text"]',
  BACK_TO_PRODUCTS:    '[data-test="back-to-products"]',
} as const;

// ─── Product Slugs ────────────────────────────────────────────────────────────

export const PRODUCT_SLUGS = {
  BACKPACK:    'sauce-labs-backpack',
  BIKE_LIGHT:  'sauce-labs-bike-light',
  BOLT_TSHIRT: 'sauce-labs-bolt-t-shirt',
  FLEECE:      'sauce-labs-fleece-jacket',
  ONESIE:      'sauce-labs-onesie',
  RED_TSHIRT:  'test.allthethings()-t-shirt-(red)',
} as const;

// ─── Expected Text ────────────────────────────────────────────────────────────

export const EXPECTED_TEXT = {
  ORDER_CONFIRMED:   'Thank you for your order!',
  ORDER_DISPATCHED:  'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
} as const;

// ─── Timeouts ────────────────────────────────────────────────────────────────

export const TIMEOUTS = {
  SHORT:   5_000,
  MEDIUM:  15_000,
  LONG:    30_000,
  XLARGE:  60_000,
} as const;
