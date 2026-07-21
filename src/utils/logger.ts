/**
 * Logger utility — provides structured, levelled logging with colour
 * output in the terminal and log entries that can be attached to
 * Playwright test info for report embedding.
 */

import { TestInfo } from '@playwright/test';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'step';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const COLOURS: Record<LogLevel, string> = {
  debug: '\x1b[90m',  // grey
  info:  '\x1b[36m',  // cyan
  warn:  '\x1b[33m',  // yellow
  error: '\x1b[31m',  // red
  step:  '\x1b[32m',  // green
};
const RESET = '\x1b[0m';

/** Per-test in-memory log store, flushed to report on completion */
const logStore = new Map<string, LogEntry[]>();

function formatEntry(entry: LogEntry): string {
  const colour = COLOURS[entry.level];
  const level  = `[${entry.level.toUpperCase().padEnd(5)}]`;
  const ctx    = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
  return `${colour}${entry.timestamp} ${level} ${entry.message}${ctx}${RESET}`;
}

export class Logger {
  private readonly testTitle: string;

  constructor(testTitle: string) {
    this.testTitle = testTitle;
    if (!logStore.has(testTitle)) {
      logStore.set(testTitle, []);
    }
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    const entries = logStore.get(this.testTitle) ?? [];
    entries.push(entry);
    logStore.set(this.testTitle, entries);

    // Print to stdout — Playwright captures this in the terminal reporter
    console.log(formatEntry(entry));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  /** Highlighted step entry — visible as a green marker in CI output */
  step(message: string, context?: Record<string, unknown>): void {
    this.log('step', `▶ ${message}`, context);
  }

  /**
   * Attach all log entries for this test to the Playwright TestInfo object
   * so they appear in the HTML report.
   */
  async attachToReport(testInfo: TestInfo): Promise<void> {
    const entries = logStore.get(this.testTitle) ?? [];
    const content = entries
      .map(e => `${e.timestamp} [${e.level.toUpperCase()}] ${e.message}${e.context ? ' | ' + JSON.stringify(e.context) : ''}`)
      .join('\n');

    await testInfo.attach('execution-log.txt', {
      body: Buffer.from(content, 'utf8'),
      contentType: 'text/plain',
    });
  }

  /** Clear log store for the given test (called on test start) */
  clear(): void {
    logStore.set(this.testTitle, []);
  }
}
