import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve(__dirname, '../..');
const HEADERS_FILE = resolve(ROOT, '_headers');

describe('Cloudflare headers', () => {
  it('defines Brotli headers for Unity WebGL build assets', () => {
    expect(existsSync(HEADERS_FILE)).toBe(true);

    const headers = readFileSync(HEADERS_FILE, 'utf-8');

    expect(headers).toContain('/game2/Build/*.js.br');
    expect(headers).toContain('/game2/Build/*.wasm.br');
    expect(headers).toContain('/game2/Build/*.data.br');
    expect(headers).toContain('Content-Encoding: br');
  });
});
