import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

async function shellCss(): Promise<string> {
  return readFile('src/foundation/dool.css', 'utf8');
}

describe('responsive and keyboard CSS contracts', () => {
  it('allows unbroken content to wrap instead of forcing horizontal overflow', async () => {
    const css = await shellCss();
    expect(css).toContain('overflow-wrap: anywhere');
  });

  it('gives reusable interactive controls a robust minimum target size', async () => {
    const css = await shellCss();
    expect(css).toMatch(/\.dool-button[\s\S]*?min-height:\s*2\.75rem/);
    expect(css).toMatch(/\.dool-field__control[\s\S]*?min-height:\s*2\.75rem/);
  });

  it('defines visible focus for buttons, links and form controls', async () => {
    const css = await shellCss();
    expect(css).toContain('.dool-button:focus-visible');
    expect(css).toContain('.dool-link:focus-visible');
    expect(css).toContain('.dool-field__control:focus-visible');
    expect(css).toContain('outline: 3px solid var(--dool-color-focus)');
  });

  it('keeps essential mobile controls present at the narrow breakpoint', async () => {
    const css = await shellCss();
    const mobile = css.match(/@media \(max-width: 42rem\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(mobile).not.toContain('display: none');
    expect(mobile).not.toContain('visibility: hidden');
  });

  it('neutralizes non-essential motion when reduced motion is requested', async () => {
    const css = await shellCss();
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('transition: none !important');
    expect(css).toContain('animation: none !important');
  });
});
