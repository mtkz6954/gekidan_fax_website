import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as cheerio from 'cheerio';

const ROOT = resolve(__dirname, '../..');

let $;
beforeAll(() => {
  const html = readFileSync(resolve(ROOT, 'asobiba.html'), 'utf-8');
  $ = cheerio.load(html);
});

describe('asobiba cards', () => {
  it('uses the dedicated tower battle icon on the third card', () => {
    const icon = $('img[src="game2/game2-icon.png"]');
    expect(icon.length).toBeGreaterThan(0);
  });

  it('does not use the old TemplateData icon on the tower battle card', () => {
    const oldIcon = $('img[src="game2/TemplateData/webmemd-icon.png"]');
    expect(oldIcon.length).toBe(0);
  });
});
