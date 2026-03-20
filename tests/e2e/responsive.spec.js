import { test, expect } from '@playwright/test';

test.describe('モバイル表示', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('ボトムナビが表示される', async ({ page }) => {
    await page.goto('/index.html');
    const nav = page.locator('nav.fixed');
    await expect(nav).toBeVisible();
  });

  test('ボトムナビに5つのリンクがある', async ({ page }) => {
    await page.goto('/index.html');
    const links = page.locator('nav.fixed a');
    await expect(links).toHaveCount(5);
  });

  test('ヘッダーのデスクトップナビが非表示', async ({ page }) => {
    await page.goto('/index.html');
    // md:flex で表示される nav は非表示のはず
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();
  });

  test('モンスター図鑑: 一覧からモンスターをタップすると詳細がスライドイン', async ({ page }) => {
    await page.goto('/monster-zukan.html');
    await page.waitForSelector('.monster-item', { timeout: 5000 });
    await page.waitForTimeout(800);

    // モバイルでは初期表示で詳細パネルが開いているので戻るボタンで閉じる
    await page.locator('#backBtn').click();
    await page.waitForTimeout(300);

    // モンスターをタップ
    await page.locator('.monster-item').nth(2).click();
    await page.waitForTimeout(500);

    // 詳細パネルが表示される
    const detail = page.locator('#detailPanel');
    await expect(detail).toBeVisible();
  });
});

test.describe('デスクトップ表示', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('ボトムナビが非表示', async ({ page }) => {
    await page.goto('/index.html');
    const nav = page.locator('nav.fixed');
    await expect(nav).toBeHidden();
  });

  test('ヘッダーのデスクトップナビが表示される', async ({ page }) => {
    await page.goto('/index.html');
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeVisible();
  });
});
