import { test, expect } from '@playwright/test';

test.describe('トップページ', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('公演タイトル「キルギスのやつ」が表示されている', async ({ page }) => {
    await expect(page.locator('text=キルギスのやつ').first()).toBeVisible();
  });

  test('公演日程が表示されている', async ({ page }) => {
    await expect(page.locator('text=7/17').first()).toBeVisible();
    await expect(page.locator('text=7/18').first()).toBeVisible();
    await expect(page.locator('text=7/19').first()).toBeVisible();
  });

  test('会場情報が表示されている', async ({ page }) => {
    await expect(page.locator('text=スタジオHIKARI').first()).toBeVisible();
  });

  test('チケット料金が表示されている', async ({ page }) => {
    await expect(page.locator('text=2,000').first()).toBeVisible();
    await expect(page.locator('text=3,000').first()).toBeVisible();
  });

  test('キービジュアル画像が表示されている', async ({ page }) => {
    const img = page.locator('img[src*="kilgis"]');
    await expect(img).toBeVisible();
  });

  test('チケット購入ボタンが存在する', async ({ page }) => {
    const btn = page.locator('text=チケット購入').first();
    await expect(btn).toBeVisible();
  });
});
