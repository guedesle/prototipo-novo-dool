import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('WXT foundation entrypoint', () => {
  it('restricts the content script to DOOL and mounts an isolated full-viewport Shadow Root UI', async () => {
    const source = await readFile('entrypoints/dool.content.ts', 'utf8');
    expect(source).toContain("matches: ['https://dool.egba.ba.gov.br/*']");
    expect(source).toContain("cssInjectionMode: 'ui'");
    expect(source).toContain('createShadowRootUi');
    expect(source).toContain("name: SHELL_HOST_NAME");
    expect(source).toContain("position: 'modal'");
    expect(source).not.toContain("position: 'overlay'");
    expect(source).toContain('isolateEvents: true');
  });

  it('suspends the legacy DOM only after the prototype host mounts and restores it on removal', async () => {
    const source = await readFile('entrypoints/dool.content.ts', 'utf8');
    expect(source).toContain("from '../src/foundation/legacy-isolation'");
    expect(source).toContain('ui.mount();');
    expect(source).toContain('restoreLegacyDom = suspendLegacyDom(ui.shadowHost);');
    expect(source).toContain('restoreLegacyDom();');
    expect(source).toContain('onRemove(mounted)');
  });

  it('keeps manifest permissions minimal', async () => {
    const source = await readFile('wxt.config.ts', 'utf8');
    expect(source).toContain("permissions: ['storage']");
    for (const forbidden of ['cookies', 'webRequest', '<all_urls>', 'tabs', 'downloads']) {
      expect(source).not.toContain(`'${forbidden}'`);
    }
  });
});
