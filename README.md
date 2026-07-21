# SauceDemo — Enterprise Playwright TypeScript Framework

> Production-ready automation framework built on Playwright Test + TypeScript.  
> Targets [https://www.saucedemo.com](https://www.saucedemo.com).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running Tests](#running-tests)
7. [Reports](#reports)
8. [Adding Tests](#adding-tests)
9. [Personas & Multi-User Support](#personas--multi-user-support)

---

## Project Structure

```
saucedemo/
├── playwright.config.ts          # Central Playwright configuration
├── package.json
├── tsconfig.json
├── .env.staging                  # Staging environment values (gitignored in prod)
├── .env.example                  # Template — copy to .env.staging
│
├── src/
│   ├── config/
│   │   └── environment.ts        # Runtime config manager (reads process.env)
│   │
│   ├── constants/
│   │   └── index.ts              # URL paths, selectors, expected text, timeouts
│   │
│   ├── data/
│   │   └── products.ts           # Product catalogue + expected order totals
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces (Product, OrderSummary…)
│   │
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts           # Abstract base: navigation, header actions
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInfoPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── components/
│   │   └── HeaderComponent.ts    # Reusable top-header: menu, cart, logout
│   │
│   ├── fixtures/
│   │   └── index.ts              # Custom fixtures (test + expect re-exports)
│   │
│   └── utils/
│       ├── logger.ts             # Structured, levelled logger with report attach
│       └── screenshotUtil.ts     # Full-page / viewport screenshot helpers
│
├── tests/
│   └── e2e/
│       └── purchase-flow.spec.ts # Main E2E test
│
└── reports/
    ├── html/                     # Playwright HTML report (auto-generated)
    ├── json/results.json         # Machine-readable JSON
    ├── junit/results.xml         # JUnit XML for CI integration
    └── screenshots/              # Captured screenshots
```

---

## Architecture Overview

| Layer | Purpose |
|---|---|
| **Fixtures** | Dependency injection for page objects, config, logger, screenshots |
| **Page Objects** | Encapsulate page interactions; each page owns its own locators and assertions |
| **Components** | Reusable UI components shared across pages (e.g. HeaderComponent) |
| **Constants** | Single source of truth for all selectors, URLs, expected strings |
| **Data** | Test data (product catalogue, expected totals) — completely external to tests |
| **Config** | Typed environment resolution — tests never read `process.env` directly |
| **Utils** | Logger and screenshot helpers injected via fixtures |

---

## Prerequisites

- **Node.js** ≥ 18.0.0 — [download](https://nodejs.org/)
- **npm** ≥ 9.0.0 (ships with Node 18+)

---

## Installation

```bash
# 1. Install npm dependencies
npm install

# 2. Install Playwright browsers
npx playwright install --with-deps
```

---

## Configuration

All configurable values live in `.env.staging` (or a `.env` file for local overrides).

```
TEST_ENV=staging
BASE_URL=https://www.saucedemo.com

# Credentials (note: USERNAME is reserved on Windows — use TEST_USERNAME)
TEST_USERNAME=standard_user
TEST_PASSWORD=secret_sauce

# Checkout data
CHECKOUT_FIRST_NAME=John
CHECKOUT_LAST_NAME=Doe
CHECKOUT_ZIP_CODE=12345

# Execution
HEADLESS=true
TIMEOUT=30000
RETRIES=1
WORKERS=2
```

To run against a different environment, create `.env.production` and pass:
```bash
TEST_ENV=production npm test
```

---

## Running Tests

```bash
# Run all tests (headless, all configured browsers)
npm test

# Run headed (visible browser)
npm run test:headed

# Run in Chromium only
npm run test:chrome

# Run in Firefox only
npm run test:firefox

# Run in WebKit/Safari only
npm run test:webkit

# Run in Playwright UI mode (interactive)
npm run test:ui

# Debug mode (step through)
npm run test:debug

# Run specific test file
npx playwright test tests/e2e/purchase-flow.spec.ts

# Run with specific tag / grep
npx playwright test --grep "purchase flow"
```

---

## Reports

```bash
# Open the HTML report after a test run
npm run report

# The following report formats are always generated:
#   reports/html/        — Playwright interactive HTML report
#   reports/json/        — results.json for programmatic consumption
#   reports/junit/       — results.xml for CI (Jenkins / GitHub Actions)
#   reports/screenshots/ — Full-page screenshots captured during the run
```

### Report Contents

- ✅ Pass / Fail status per test and per step
- ⏱ Execution duration per step
- 📸 Screenshots (full-page) at key moments:
  - All products on inventory page
  - Cart with 4 products
  - Cart after Backpack removal
  - Checkout overview
  - Order confirmation
  - Post-logout login page
  - Failure screenshots (automatic on test failure)
- 📋 `execution-log.txt` — structured log of every step, attached to the report
- 🎥 Video on failure (`test-results/`)
- 🔍 Trace on failure — open with `npx playwright show-trace test-results/**/*.zip`

---

## Adding Tests

1. Import `test` and `expect` from `../../src/fixtures` (not from `@playwright/test`).
2. Declare the fixtures you need as destructured parameters.
3. Use `test.step()` to label logical steps — they appear in the report.
4. Access test data from `src/data/` and configuration from the `config` fixture.

```typescript
import { test, expect } from '../../src/fixtures';

test('My new test', async ({ inventoryPage, header, logger }) => {
  await test.step('Verify products are loaded', async () => {
    await inventoryPage.assertProductCount(6);
  });
});
```

---

## Personas & Multi-User Support

Switch user personas without touching any test code — just change the credentials in `.env.staging`:

| Persona | TEST_USERNAME value |
|---|---|
| Standard | `standard_user` |
| Locked out | `locked_out_user` |
| Problem user | `problem_user` |
| Performance glitch | `performance_glitch_user` |
| Error user | `error_user` |
| Visual user | `visual_user` |

For parallel persona testing, create separate env files and run with `TEST_ENV=`:

```bash
# Run as performance_glitch_user (inline override)
TEST_USERNAME=performance_glitch_user npx playwright test

# Or with a separate env file
TEST_ENV=perf-glitch npx playwright test   # requires .env.perf-glitch
```
