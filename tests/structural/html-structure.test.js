import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as cheerio from 'cheerio';

const ROOT = resolve(__dirname, '../..');
const PAGES = ['index.html', 'about.html', 'activity.html', 'asobiba.html', 'monster-zukan.html'];
// monster-zukan.html は独自レイアウトで description メタタグなし
const PAGES_WITH_DESCRIPTION = ['index.html', 'about.html', 'activity.html', 'asobiba.html'];

const loaded = {};
beforeAll(() => {
  for (const page of PAGES) {
    const html = readFileSync(resolve(ROOT, page), 'utf-8');
    loaded[page] = cheerio.load(html);
  }
});

describe('HTML構造チェック', () => {
  for (const page of PAGES) {
    describe(page, () => {
      it('charset UTF-8 が設定されている', () => {
        const $ = loaded[page];
        const charset = $('meta[charset]').attr('charset');
        expect(charset?.toUpperCase()).toBe('UTF-8');
      });

      it('viewport メタタグがある', () => {
        const $ = loaded[page];
        const viewport = $('meta[name="viewport"]');
        expect(viewport.length).toBeGreaterThan(0);
        expect(viewport.attr('content')).toContain('width=device-width');
      });

      if (PAGES_WITH_DESCRIPTION.includes(page)) {
        it('description メタタグがあり空でない', () => {
          const $ = loaded[page];
          const desc = $('meta[name="description"]');
          expect(desc.length).toBeGreaterThan(0);
          expect(desc.attr('content')?.trim().length).toBeGreaterThan(0);
        });
      }

      it('title に「劇団FAX」を含む', () => {
        const $ = loaded[page];
        const title = $('title').text();
        expect(title).toContain('劇団FAX');
      });

      it('Tailwind CSS CDN が読み込まれている', () => {
        const $ = loaded[page];
        const scripts = $('script[src*="tailwindcss"]');
        expect(scripts.length).toBeGreaterThan(0);
      });

      it('Google Fonts が読み込まれている', () => {
        const $ = loaded[page];
        const links = $('link[href*="fonts.googleapis.com"]');
        expect(links.length).toBeGreaterThan(0);
      });

      it('lang="ja" が設定されている', () => {
        const $ = loaded[page];
        expect($('html').attr('lang')).toBe('ja');
      });
    });
  }
});
