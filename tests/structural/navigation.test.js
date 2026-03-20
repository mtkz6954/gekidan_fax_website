import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as cheerio from 'cheerio';

const ROOT = resolve(__dirname, '../..');
const PAGES = ['index.html', 'about.html', 'activity.html', 'monster-zukan.html'];

const EXPECTED_HEADER_LINKS = [
  'index.html',
  'about.html',
  'activity.html',
  'monster-zukan.html',
];

const EXPECTED_MOBILE_NAV_LINKS = [
  'index.html',
  'about.html',
  'activity.html',
  'monster-zukan.html',
  'https://example.com/ticket',
];

const loaded = {};
beforeAll(() => {
  for (const page of PAGES) {
    const html = readFileSync(resolve(ROOT, page), 'utf-8');
    loaded[page] = cheerio.load(html);
  }
});

// monster-zukan.html は独自レイアウト（ヘッダーは「← 劇団FAX」リンクのみ、モバイルボトムナビなし）
const STANDARD_PAGES = ['index.html', 'about.html', 'activity.html'];

describe('ナビゲーション整合性', () => {
  for (const page of STANDARD_PAGES) {
    describe(page, () => {
      it('ヘッダーに4つの内部ナビリンクがある', () => {
        const $ = loaded[page];
        const headerLinks = $('header a')
          .map((_, el) => $(el).attr('href'))
          .get()
          .filter((href) => href && !href.startsWith('https://'));

        for (const expected of EXPECTED_HEADER_LINKS) {
          expect(headerLinks).toContain(expected);
        }
      });

      it('モバイルボトムナビに5つのリンクがある', () => {
        const $ = loaded[page];
        // モバイルナビは md:hidden の固定 nav
        const mobileNav = $('nav.fixed');
        const links = mobileNav
          .find('a')
          .map((_, el) => $(el).attr('href'))
          .get();

        expect(links.length).toBe(5);
        for (const expected of EXPECTED_MOBILE_NAV_LINKS) {
          expect(links).toContain(expected);
        }
      });
    });
  }

  describe('monster-zukan.html', () => {
    it('ヘッダーに index.html への戻りリンクがある', () => {
      const $ = loaded['monster-zukan.html'];
      const headerLinks = $('header a')
        .map((_, el) => $(el).attr('href'))
        .get();
      expect(headerLinks).toContain('index.html');
    });
  });

  // フッターテスト（monster-zukan はフッター構造が異なるため除外）
  for (const page of ['index.html', 'about.html', 'activity.html']) {
    describe(`${page} フッター`, () => {
      it('フッターにナビリンクがある', () => {
        const $ = loaded[page];
        const footerLinks = $('footer a')
          .map((_, el) => $(el).attr('href'))
          .get();

        expect(footerLinks).toContain('index.html');
        expect(footerLinks).toContain('about.html');
        expect(footerLinks).toContain('activity.html');
      });
    });
  }
});
