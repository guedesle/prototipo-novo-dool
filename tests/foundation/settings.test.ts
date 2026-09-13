import { beforeEach, describe, expect, it, vi } from 'vitest';

const storage = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('wxt/browser', () => ({
  browser: { storage: { local: storage } },
}));

import { DEFAULT_SETTINGS, loadSettings, resetSettings, saveSettings } from '../../src/foundation/settings';

describe('foundation settings', () => {
  beforeEach(() => {
    storage.get.mockReset();
    storage.set.mockReset();
    storage.remove.mockReset();
  });

  it('uses safe defaults when no settings are stored', async () => {
    storage.get.mockResolvedValue({});
    await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('sanitizes corrupted and unknown stored values', async () => {
    storage.get.mockResolvedValue({
      'novo-dool:foundation-settings': {
        globalEnabled: 'yes',
        interfaceMode: 'invalid',
        flags: { foundationShell: 1, unknownFlag: true },
        secret: 'must-not-survive',
      },
    });

    await expect(loadSettings()).resolves.toEqual(DEFAULT_SETTINGS);
  });

  it('persists only the closed settings schema', async () => {
    storage.get.mockResolvedValue({});

    const result = await saveSettings({ interfaceMode: 'original', globalEnabled: false });

    expect(result).toEqual({
      globalEnabled: false,
      interfaceMode: 'original',
      flags: { foundationShell: true },
    });
    expect(storage.set).toHaveBeenCalledWith({
      'novo-dool:foundation-settings': result,
    });
  });

  it('resets storage and returns defaults', async () => {
    await expect(resetSettings()).resolves.toEqual(DEFAULT_SETTINGS);
    expect(storage.remove).toHaveBeenCalledWith('novo-dool:foundation-settings');
  });
});
