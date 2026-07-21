/**
 * Core TypeScript interfaces and types for the SauceDemo automation framework.
 * Centralises all type definitions to ensure consistency across the framework.
 */

/** Supported user personas available on SauceDemo */
export type UserPersona =
  | 'standard_user'
  | 'locked_out_user'
  | 'problem_user'
  | 'performance_glitch_user'
  | 'error_user'
  | 'visual_user';

/** User credential set */
export interface UserCredentials {
  username: UserPersona | string;
  password: string;
}

/** Checkout information form data */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  zipCode: string;
}

/** A product represented on the inventory / cart page */
export interface Product {
  name: string;
  price: string;
  /** data-test slug, e.g. "sauce-labs-backpack" */
  slug: string;
}

/** Order summary values from the checkout overview page */
export interface OrderSummary {
  itemTotal: string;
  tax: string;
  total: string;
}

/** The complete environment configuration resolved at runtime */
export interface EnvironmentConfig {
  baseUrl: string;
  credentials: UserCredentials;
  checkoutInfo: CheckoutInfo;
  headless: boolean;
  timeout: number;
  retries: number;
  workers: number;
  env: string;
}

/** Test fixture context provided to every test */
export interface TestContext {
  loginPage: import('../pages/LoginPage').LoginPage;
  inventoryPage: import('../pages/InventoryPage').InventoryPage;
  cartPage: import('../pages/CartPage').CartPage;
  checkoutInfoPage: import('../pages/CheckoutInfoPage').CheckoutInfoPage;
  checkoutOverviewPage: import('../pages/CheckoutOverviewPage').CheckoutOverviewPage;
  checkoutCompletePage: import('../pages/CheckoutCompletePage').CheckoutCompletePage;
  config: EnvironmentConfig;
}
