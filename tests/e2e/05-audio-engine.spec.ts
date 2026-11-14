import { test, expect } from '@playwright/test';
import { dismissIntroLoader, listenForErrors } from './test-helpers';

test.describe('Pillar 5: Organimo Procedural 4-Layer Soundscape & Audio Engine', () => {
  test('should toggle soundscape state via masthead switch button', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const audioSwitch = page.locator('header button[role="switch"]').first();
    await expect(audioSwitch).toBeVisible();

    const initialChecked = await audioSwitch.getAttribute('aria-checked');

    // Click to toggle
    await audioSwitch.click();
    await page.waitForTimeout(150);

    const toggledChecked = await audioSwitch.getAttribute('aria-checked');
    expect(toggledChecked).not.toEqual(initialChecked);

    // Click again to toggle back
    await audioSwitch.click();
    await page.waitForTimeout(150);

    const finalChecked = await audioSwitch.getAttribute('aria-checked');
    expect(finalChecked).toEqual(initialChecked);

    expect(errors).toEqual([]);
  });

  test('should trigger harmonic resonance on Living Heirloom Seal', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const sealSection = page.locator('#seal');
    await sealSection.scrollIntoViewIfNeeded();
    await expect(sealSection).toBeVisible();

    const sealBtn = page.locator('[data-seal-interactive="true"]').first();
    await expect(sealBtn).toBeVisible();

    // Hover to trigger specular reflection and 108Hz partials
    await sealBtn.hover();
    await page.waitForTimeout(150);

    // Click to trigger full acoustic awakening
    await sealBtn.click();
    await page.waitForTimeout(300);

    expect(errors).toEqual([]);
  });

  test('should toggle Web Audio soundscape via .GLA11y accessibility button', async ({ page }) => {
    const errors = listenForErrors(page);
    await dismissIntroLoader(page);

    const gla11yAudioBtn = page.locator('.GLA11y button[aria-label*="Web Audio"]').first();
    await expect(gla11yAudioBtn).toBeAttached();

    await gla11yAudioBtn.click({ force: true });
    await page.waitForTimeout(150);

    expect(errors).toEqual([]);
  });
});
