import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('WCAG 2.1 AAA Accessibility & GLA11y Mirror Landmarks', () => {
  test('should provide functional skip-to-content link', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const skipLink = page.locator('a[href="#content"]').first();
    await expect(skipLink).toBeAttached();

    // Tab to focus skip link
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    expect(errors).toEqual([]);
  });

  test('should enforce clean semantic landmark hierarchy', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    // Verify main content landmark
    const main = page.locator('main#content');
    await expect(main).toBeAttached();

    // Verify masthead header landmark
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify sections with aria-labels
    const thresholdSection = page.locator('section[aria-label="The Threshold"]');
    await expect(thresholdSection).toBeVisible();

    const atelierSection = page.locator('#atelier, section[aria-label*="The Atelier"]');
    await expect(atelierSection.first()).toBeAttached();

    const sealSection = page.locator('section[aria-label="The Living Heirloom Seal"]');
    await expect(sealSection).toBeAttached();

    expect(errors).toEqual([]);
  });

  test('should honor prefers-reduced-motion media query', async ({ page }) => {
    const errors = listenForErrors(page);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Navigate to root with reduced motion
    await page.goto('/');

    // Loader should dismiss immediately or within 1 second
    const loader = page.locator('.vyshuuu-loader');
    await expect(loader).toBeHidden({ timeout: 2000 });

    // Page content should be immediately accessible
    await expect(page.locator('#content')).toBeAttached();
    await expect(page.locator('#threshold')).toBeVisible();

    expect(errors).toEqual([]);
  });
});
