import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import * as cheerio from 'cheerio';

const ROOT = resolve(__dirname, '../..');
const PAGES = ['index.html', 'about.html', 'activity.html'];

const loaded = {};
beforeAll(() => {
  for (const page of PAGES) {
    const html = readFileSync(resolve(ROOT, page), 'utf-8');
    loaded[page] = cheerio.load(html);
  }
});

describe('画像参照チェック', () => {
  for (const page of PAGES) {
    describe(page, () => {
      it('全ての img src がローカルファイルとして存在する', () => {
        const $ = loaded[page];
        const images = $('img[src^="images/"]')
          .map((_, el) => $(el).attr('src'))
          .get();

        expect(images.length).toBeGreaterThan(0);

        const missing = [];
        for (const src of images) {
          const filePath = resolve(ROOT, src);
          if (!existsSync(filePath)) {
            missing.push(src);
          }
        }
        expect(missing, `存在しない画像: ${missing.join(', ')}`).toEqual([]);
      });
    });
  }

  describe('monster-zukan.html モンスター画像', () => {
    it('各画像ファイル名に対応するモンスター名が含まれる', () => {
      const html = readFileSync(resolve(ROOT, 'monster-zukan.html'), 'utf-8');
      const entries = [...html.matchAll(/file:\s*'([^']+)',\s*name:'([^']+)'/g)];

      expect(entries.length).toBe(152);

      for (const [, file, name] of entries) {
        expect(file).toMatch(new RegExp(`^IMG_\\d+_${name}\\.(JPG|PNG)$`));
        expect(Number(file.match(/^IMG_(\d+)/)[1])).toBeLessThan(8014);
      }
    });

    it('MONSTERS配列の全画像ファイルが存在する', () => {
      const html = readFileSync(resolve(ROOT, 'monster-zukan.html'), 'utf-8');
      // MONSTERS配列からfileプロパティを抽出
      const fileMatches = [...html.matchAll(/file:\s*'([^']+)'/g)];
      const files = fileMatches.map((m) => m[1]);

      expect(files.length).toBeGreaterThan(0);

      const missing = [];
      for (const file of files) {
        const filePath = resolve(ROOT, 'images/ファニーモンスター', file);
        if (!existsSync(filePath)) {
          missing.push(file);
        }
      }
      expect(missing, `存在しないモンスター画像: ${missing.join(', ')}`).toEqual([]);
    });
  });
});
