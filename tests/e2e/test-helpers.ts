import { Page, expect } from '@playwright/test';

/**
 * Common test helper for VYSHUUU E2E test suite.
 */
export async function dismissIntroLoader(page: Page) {
  // Navigate to root
  await page.goto('/');

  // Wait for loader to either detach naturally (<=2.6s) or fast-forward
  const loader = page.locator('.vyshuuu-loader');
  try {
    await loader.waitFor({ state: 'detached', timeout: 5000 });
  } catch {
    // If still present after 5s, fast forward through experience store
    await page.evaluate(() => {
      // @ts-expect-error accessing internal store
      if (window.__EXPERIENCE_STORE__) {
        // @ts-expect-error accessing internal store
        window.__EXPERIENCE_STORE__.getState().setCompletedIntro(true);
        // @ts-expect-error accessing internal store
        window.__EXPERIENCE_STORE__.getState().setIntroSettled(true);
      }
    });
  }

  // Ensure content container is mounted and ready
  await expect(page.locator('#content')).toBeAttached();
}

/**
 * Attach console listener to verify zero unhandled exceptions.
 */
export function listenForErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => {
    // Ignore harmless WebGL context warnings in headless environments
    if (!err.message.includes('WebGL') && !err.message.includes('AudioContext')) {
      errors.push(`Page Error: ${err.message}`);
    }
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter known external network 404s for sample textures/fonts in test environment if any
      if (
        !text.includes('Failed to load resource') &&
        !text.includes('favicon.ico') &&
        !text.includes('AudioContext')
      ) {
        errors.push(`Console Error: ${text}`);
      }
    }
  });
  return errors;
}
