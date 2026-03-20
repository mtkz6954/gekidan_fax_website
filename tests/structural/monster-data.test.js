import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../..');

const VALID_TYPES = ['炎', '水', '草', '闇', '光', '風', '霊', '毒', '格闘', '岩'];
const REQUIRED_PROPS = ['id', 'file', 'name', 'type', 'typeColor', 'typeBg', 'desc', 'quote'];

let monsters = [];

beforeAll(() => {
  const html = readFileSync(resolve(ROOT, 'monster-zukan.html'), 'utf-8');
  // MONSTERS配列をJSから抽出してパース
  const match = html.match(/const MONSTERS\s*=\s*\[([\s\S]*?)\];/);
  expect(match).not.toBeNull();

  // 各オブジェクトを抽出（簡易パーサー）
  const arrayContent = match[1];
  const entries = [...arrayContent.matchAll(/\{[^}]+\}/g)];

  for (const entry of entries) {
    const obj = {};
    const text = entry[0];

    const id = text.match(/id:\s*(\d+)/);
    if (id) obj.id = Number(id[1]);

    const file = text.match(/file:\s*'([^']+)'/);
    if (file) obj.file = file[1];

    const name = text.match(/name:\s*'([^']+)'/);
    if (name) obj.name = name[1];

    const type = text.match(/type:\s*'([^']+)'/);
    if (type) obj.type = type[1];

    const typeColor = text.match(/typeColor:\s*'([^']+)'/);
    if (typeColor) obj.typeColor = typeColor[1];

    const typeBg = text.match(/typeBg:\s*'([^']+)'/);
    if (typeBg) obj.typeBg = typeBg[1];

    const desc = text.match(/desc:\s*'([^']+)'/);
    if (desc) obj.desc = desc[1];

    const quote = text.match(/quote:\s*'([^']+)'/);
    if (quote) obj.quote = quote[1];

    monsters.push(obj);
  }
});

describe('MONSTERSデータ整合性', () => {
  it('160体のモンスターが定義されている', () => {
    expect(monsters.length).toBe(160);
  });

  it('各モンスターに必須プロパティがある', () => {
    for (const m of monsters) {
      for (const prop of REQUIRED_PROPS) {
        expect(m, `id=${m.id} に ${prop} がない`).toHaveProperty(prop);
        expect(m[prop], `id=${m.id} の ${prop} が空`).toBeTruthy();
      }
    }
  });

  it('id が1〜160で重複なし', () => {
    const ids = monsters.map((m) => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(160);
    expect(Math.min(...ids)).toBe(1);
    expect(Math.max(...ids)).toBe(160);
  });

  it('type が有効なタイプのみ', () => {
    for (const m of monsters) {
      expect(
        VALID_TYPES,
        `id=${m.id} のtype "${m.type}" が無効`
      ).toContain(m.type);
    }
  });

  it('typeColor が有効なHEXカラー', () => {
    for (const m of monsters) {
      expect(m.typeColor, `id=${m.id}`).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('file が画像拡張子を持つ', () => {
    for (const m of monsters) {
      expect(m.file, `id=${m.id}`).toMatch(/\.(jpg|jpeg|png|gif|webp)$/i);
    }
  });
});
