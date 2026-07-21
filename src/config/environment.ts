/**
 * Configuration manager — resolves all runtime configuration from environment
 * variables (loaded by dotenv in playwright.config.ts).
 *
 * Provides a single, typed EnvironmentConfig object consumed by fixtures and
 * tests. Never read process.env directly in tests — always go through this module.
 */

import type { EnvironmentConfig, UserCredentials, CheckoutInfo } from '../types';

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Config] Required environment variable "${key}" is not set. ` +
      `Check your .env.staging or .env file.`
    );
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

// ─── Credentials ─────────────────────────────────────────────────────────────

const credentials: UserCredentials = {
  username: optional('TEST_USERNAME', 'standard_user'),
  password: optional('TEST_PASSWORD', 'secret_sauce'),
};

// ─── Checkout info ────────────────────────────────────────────────────────────

const checkoutInfo: CheckoutInfo = {
  firstName: optional('CHECKOUT_FIRST_NAME', 'John'),
  lastName:  optional('CHECKOUT_LAST_NAME',  'Doe'),
  zipCode:   optional('CHECKOUT_ZIP_CODE',   '12345'),
};

// ─── Execution settings ───────────────────────────────────────────────────────

const headless = optional('HEADLESS', 'true') !== 'false';
const timeout  = parseInt(optional('TIMEOUT',  '30000'), 10);
const retries  = parseInt(optional('RETRIES',  '1'),     10);
const workers  = parseInt(optional('WORKERS',  '2'),     10);
const env      = optional('TEST_ENV', 'staging');
const baseUrl  = optional('BASE_URL', 'https://www.saucedemo.com');

// ─── Exported Config ─────────────────────────────────────────────────────────

export const environmentConfig: EnvironmentConfig = {
  baseUrl,
  credentials,
  checkoutInfo,
  headless,
  timeout,
  retries,
  workers,
  env,
};
