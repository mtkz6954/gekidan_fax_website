import { test, expect } from '@playwright/test';

test.describe('ファニーモンスター図鑑', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/monster-zukan.html');
    // 初期選択のアニメーション完了を待つ
    await page.waitForTimeout(600);
  });

  test('ページロード時に最初のモンスターが表示される', async ({ page }) => {
    // 詳細パネルにモンスター名が表示されている
    const name = page.locator('#detailName');
    await expect(name).not.toBeEmpty();
  });

  test('モンスター一覧にアイテムが表示されている', async ({ page }) => {
    const items = page.locator('.monster-item');
    const count = await items.count();
    expect(count).toBe(160);
  });

  test('一覧のアイテムをクリックすると詳細が切り替わる', async ({ page }) => {
    // 最初のモンスター名を取得
    const firstNameText = await page.locator('#detailName').textContent();

    // 5番目のモンスターをクリック
    await page.locator('.monster-item').nth(4).click();
    await page.waitForTimeout(500);

    // 名前が変わっていること
    const newNameText = await page.locator('#detailName').textContent();
    expect(newNameText).not.toBe(firstNameText);
  });

  test('NEXTボタンで次のモンスターに移動できる', async ({ page }) => {
    const firstName = await page.locator('#detailName').textContent();

    // NEXTボタンをクリック
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);

    const nextName = await page.locator('#detailName').textContent();
    expect(nextName).not.toBe(firstName);
  });

  test('PREVボタンで前のモンスターに移動できる', async ({ page }) => {
    // まず2番目に移動
    await page.locator('#nextBtn').click();
    await page.waitForTimeout(500);
    const secondName = await page.locator('#detailName').textContent();

    // PREVで戻る
    await page.locator('#prevBtn').click();
    await page.waitForTimeout(500);

    const backName = await page.locator('#detailName').textContent();
    expect(backName).not.toBe(secondName);
  });

  test('キーボード↓で次のモンスターに移動', async ({ page }) => {
    const firstName = await page.locator('#detailName').textContent();

    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(500);

    const nextName = await page.locator('#detailName').textContent();
    expect(nextName).not.toBe(firstName);
  });

  test('タイプバッジが表示される', async ({ page }) => {
    const badge = page.locator('#detailType');
    await expect(badge).toBeVisible();
    await expect(badge).not.toBeEmpty();
  });

  test('説明文が表示される', async ({ page }) => {
    const desc = page.locator('#detailDesc');
    await expect(desc).not.toBeEmpty();
  });
});
