/**
 * Screenshot utility — wraps Playwright's screenshot API with automatic
 * naming, storage path management, and test-info attachment.
 */

import { Page, TestInfo } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const SCREENSHOT_DIR = path.resolve('reports', 'screenshots');

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/** Sanitise a string to be used safely as a filename segment */
function sanitise(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/__+/g, '_')
    .substring(0, 80);
}

export class ScreenshotUtil {
  private readonly page: Page;
  private readonly testInfo: TestInfo;

  constructor(page: Page, testInfo: TestInfo) {
    this.page     = page;
    this.testInfo = testInfo;
    ensureDir(SCREENSHOT_DIR);
  }

  /**
   * Capture a full-page screenshot, save it to disk, and attach it to
   * the Playwright HTML report.
   *
   * @param name  Human-readable label used in the filename
   * @returns     Absolute path to the saved screenshot
   */
  async captureFullPage(name: string): Promise<string> {
    const filename  = `${sanitise(name)}-${Date.now()}.png`;
    const filepath  = path.join(SCREENSHOT_DIR, filename);

    await this.page.screenshot({ path: filepath, fullPage: true });

    await this.testInfo.attach(name, {
      path: filepath,
      contentType: 'image/png',
    });

    return filepath;
  }

  /**
   * Capture a viewport-only screenshot and attach it.
   *
   * @param name  Human-readable label
   * @returns     Absolute path to the saved screenshot
   */
  async captureViewport(name: string): Promise<string> {
    const filename = `${sanitise(name)}-${Date.now()}.png`;
    const filepath = path.join(SCREENSHOT_DIR, filename);

    await this.page.screenshot({ path: filepath, fullPage: false });

    await this.testInfo.attach(name, {
      path: filepath,
      contentType: 'image/png',
    });

    return filepath;
  }

  /**
   * Capture a failure screenshot and attach it with a prominent label.
   * Intended to be called from a test `afterEach` hook on failure.
   */
  async captureOnFailure(): Promise<string> {
    const name    = `FAILURE-${sanitise(this.testInfo.title)}`;
    return this.captureFullPage(name);
  }
}
