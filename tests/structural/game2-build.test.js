import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../..');
const GAME2_INDEX = resolve(ROOT, 'game2/index.html');
const FUNCTION_FILE = resolve(ROOT, 'functions/game2/Build/[[path]].js');

describe('game2 build asset references', () => {
  it('keeps Brotli build assets and serves them through a Pages Function with explicit headers', () => {
    const html = readFileSync(GAME2_INDEX, 'utf-8');
    const functionSource = readFileSync(FUNCTION_FILE, 'utf-8');

    expect(html).toContain('buildUrl + "/3.data.br"');
    expect(html).toContain('buildUrl + "/3.framework.js.br"');
    expect(html).toContain('buildUrl + "/3.wasm.br"');

    expect(existsSync(FUNCTION_FILE)).toBe(true);
    expect(functionSource).toContain('Content-Encoding');
    expect(functionSource).toContain("'br'");
    expect(functionSource).toContain('application/javascript');
    expect(functionSource).toContain('application/wasm');
  });
});
