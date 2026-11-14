import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Hardening & Stress Testing: Velocity, Resizing, and Multi-Interaction Resilience', () => {
  test('stress test: high-velocity continuous scroll cycles without exceptions', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // Perform 8 rapid scroll plunges across the document
    for (let i = 0; i < 8; i++) {
      const targetY = i % 2 === 0 ? 3000 : 200;
      await page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'instant' });
      }, targetY);
      await page.waitForTimeout(60);
    }

    // Scroll to the very bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    // Scroll back to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(200);

    expect(errors).toEqual([]);
  });

  test('stress test: rapid audio toggle spamming without context lock', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const audioSwitch = page.locator('header button[role="switch"]').first();
    await expect(audioSwitch).toBeVisible();

    // Spam click the audio switch 20 times rapidly
    for (let i = 0; i < 20; i++) {
      await audioSwitch.click();
      await page.waitForTimeout(30);
    }

    // Ensure audio switch remains functional and intact
    await expect(audioSwitch).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('stress test: dynamic viewport resize cycles between mobile, tablet, and 4K desktop', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const viewports = [
      { width: 375, height: 667 },   // Small mobile
      { width: 768, height: 1024 },  // iPad portrait
      { width: 1440, height: 900 },  // Standard desktop
      { width: 2560, height: 1440 }, // Ultra-wide / 4K
      { width: 390, height: 844 },   // Modern mobile
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);

      // Verify essential landmarks still intact
      await expect(page.locator('#content')).toBeAttached();
      await expect(page.locator('#threshold')).toBeVisible();
    }

    expect(errors).toEqual([]);
  });
});
