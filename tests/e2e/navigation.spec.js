import { test, expect } from '@playwright/test';

test.describe('ページ遷移', () => {
  test('ヘッダーナビで各ページに遷移できる', async ({ page }) => {
    await page.goto('/index.html');

    // 劇団について へ遷移
    await page.click('header >> text=劇団について');
    await expect(page).toHaveURL(/about/);

    // 活動内容 へ遷移
    await page.click('header >> text=活動内容');
    await expect(page).toHaveURL(/activity/);

    // 図鑑 へ遷移
    await page.click('header >> text=図鑑');
    await expect(page).toHaveURL(/monster-zukan/);
  });

  test('ロゴクリックで index.html に戻る', async ({ page }) => {
    await page.goto('/about.html');
    await page.click('header a:first-child');
    await expect(page).toHaveURL(/index|localhost/);
  });
});
