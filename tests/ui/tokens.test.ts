import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '../../src/ui/contrast';

const REQUIRED_TOKENS = [
  '--dool-color-surface',
  '--dool-color-surface-raised',
  '--dool-color-text',
  '--dool-color-text-muted',
  '--dool-color-border',
  '--dool-color-action',
  '--dool-color-action-strong',
  '--dool-color-focus',
  '--dool-font-interface',
  '--dool-font-editorial',
  '--dool-space-1',
  '--dool-space-2',
  '--dool-space-3',
  '--dool-space-4',
  '--dool-radius-sm',
  '--dool-radius-md',
  '--dool-shadow-sticky',
  '--dool-motion-fast',
];

describe('semantic design tokens', () => {
  it('defines the semantic token contract needed by the shell', async () => {
    const css = await readFile('src/ui/tokens.css', 'utf8');

    for (const token of REQUIRED_TOKENS) {
      expect(css, `missing ${token}`).toContain(token);
    }
  });

  it('keeps raw hex colors out of shell CSS so color decisions stay in tokens', async () => {
    const css = await readFile('src/foundation/dool.css', 'utf8');
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it('meets WCAG AA contrast for primary text on the base surface', () => {
    expect(contrastRatio('#18202b', '#f6f8fb')).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the focus indicator at least 3:1 against a white raised surface', () => {
    expect(contrastRatio('#2359d1', '#ffffff')).toBeGreaterThanOrEqual(3);
  });

  it('computes identical colors as a 1:1 ratio', () => {
    expect(contrastRatio('#ffffff', '#fff')).toBeCloseTo(1, 5);
  });
});
