import { describe, expect, it } from 'vitest';
import { normalizePath } from '@/utils/analytics/paths';

describe('normalizePath', () => {
  it('keeps the root path as a single slash', () => {
    expect(normalizePath('/')).toBe('/');
  });

  it('strips a trailing slash so GitHub Pages and the router agree', () => {
    expect(normalizePath('/strawberries/')).toBe('/strawberries');
  });

  it('leaves an already-normalized path untouched', () => {
    expect(normalizePath('/strawberries')).toBe('/strawberries');
  });

  it('maps /index.html to the root path', () => {
    expect(normalizePath('/index.html')).toBe('/');
  });

  it('preserves multi-byte product handles', () => {
    expect(normalizePath('/product/いちご/')).toBe('/product/いちご');
  });

  it('collapses duplicate slashes', () => {
    expect(normalizePath('//rice//')).toBe('/rice');
  });

  it('falls back to the root path for empty input', () => {
    expect(normalizePath('')).toBe('/');
  });
});
