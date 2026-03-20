import { test, expect } from '@playwright/test';

test.describe('ページ遷移', () => {
  test('ヘッダーナビで各ページに遷移できる', async ({ page }) => {
    await page.goto('/index.html');
    const headerNav = page.locator('header nav').first();

    // 劇団について へ遷移
    await headerNav.getByRole('link', { name: /劇団について/ }).click();
    await expect(page).toHaveURL(/about/);

    // 活動内容 へ遷移
    await headerNav.getByRole('link', { name: /活動内容/ }).click();
    await expect(page).toHaveURL(/activity/);

    // あそびば へ遷移
    await headerNav.getByRole('link', { name: /あそびば/ }).click();
    await expect(page).toHaveURL(/asobiba/);
  });

  test('あそびばから図鑑に遷移できる', async ({ page }) => {
    await page.goto('/asobiba.html');
    await page.getByRole('link', { name: /図鑑へ/ }).click();
    await expect(page).toHaveURL(/monster-zukan/);
  });

  test('ロゴクリックで index.html に戻る', async ({ page }) => {
    await page.goto('/about.html');
    await page.click('header a:first-child');
    await expect(page).toHaveURL(/index|localhost/);
  });
});
