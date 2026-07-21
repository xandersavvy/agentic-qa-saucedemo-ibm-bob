/**
 * Catalogue of all products available on SauceDemo.
 * Prices and names sourced from live inspection; update if the application changes.
 */

import type { Product } from '../types';
import { PRODUCT_SLUGS } from '../constants';

export const PRODUCTS: Record<string, Product> = {
  BACKPACK: {
    name:  'Sauce Labs Backpack',
    price: '$29.99',
    slug:  PRODUCT_SLUGS.BACKPACK,
  },
  BIKE_LIGHT: {
    name:  'Sauce Labs Bike Light',
    price: '$9.99',
    slug:  PRODUCT_SLUGS.BIKE_LIGHT,
  },
  BOLT_TSHIRT: {
    name:  'Sauce Labs Bolt T-Shirt',
    price: '$15.99',
    slug:  PRODUCT_SLUGS.BOLT_TSHIRT,
  },
  FLEECE: {
    name:  'Sauce Labs Fleece Jacket',
    price: '$49.99',
    slug:  PRODUCT_SLUGS.FLEECE,
  },
  ONESIE: {
    name:  'Sauce Labs Onesie',
    price: '$7.99',
    slug:  PRODUCT_SLUGS.ONESIE,
  },
  RED_TSHIRT: {
    name:  'Test.allTheThings() T-Shirt (Red)',
    price: '$15.99',
    slug:  PRODUCT_SLUGS.RED_TSHIRT,
  },
};

/**
 * Products added to cart in the main E2E scenario.
 * BACKPACK will be removed before checkout — only REMAINING_PRODUCTS
 * are expected at the overview step.
 */
export const CART_PRODUCTS: Product[] = [
  PRODUCTS.BACKPACK,
  PRODUCTS.BOLT_TSHIRT,
  PRODUCTS.BIKE_LIGHT,
  PRODUCTS.ONESIE,
];

/** Products that remain after removing the Backpack */
export const REMAINING_PRODUCTS: Product[] = [
  PRODUCTS.BOLT_TSHIRT,
  PRODUCTS.BIKE_LIGHT,
  PRODUCTS.ONESIE,
];

/**
 * Expected order totals for REMAINING_PRODUCTS (Bolt T-Shirt + Bike Light + Onesie)
 * = $15.99 + $9.99 + $7.99 = $33.97
 * Tax (8% CA) = $2.72
 * Total = $36.69
 */
export const EXPECTED_TOTALS = {
  itemTotal: 'Item total: $33.97',
  tax:       'Tax: $2.72',
  total:     'Total: $36.69',
};
