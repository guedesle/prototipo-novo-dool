import { browser } from 'wxt/browser';

export type InterfaceMode = 'new' | 'original';

export interface FoundationSettings {
  globalEnabled: boolean;
  interfaceMode: InterfaceMode;
  flags: {
    foundationShell: boolean;
  };
}

export const SETTINGS_KEY = 'novo-dool:foundation-settings';

export const DEFAULT_SETTINGS: FoundationSettings = Object.freeze({
  globalEnabled: true,
  interfaceMode: 'new',
  flags: Object.freeze({ foundationShell: true }),
});

function sanitizeSettings(value: unknown): FoundationSettings {
  if (!value || typeof value !== 'object') return structuredClone(DEFAULT_SETTINGS);

  const candidate = value as Record<string, unknown>;
  const flags = candidate.flags && typeof candidate.flags === 'object'
    ? candidate.flags as Record<string, unknown>
    : {};

  return {
    globalEnabled: typeof candidate.globalEnabled === 'boolean'
      ? candidate.globalEnabled
      : DEFAULT_SETTINGS.globalEnabled,
    interfaceMode: candidate.interfaceMode === 'new' || candidate.interfaceMode === 'original'
      ? candidate.interfaceMode
      : DEFAULT_SETTINGS.interfaceMode,
    flags: {
      foundationShell: typeof flags.foundationShell === 'boolean'
        ? flags.foundationShell
        : DEFAULT_SETTINGS.flags.foundationShell,
    },
  };
}

export async function loadSettings(): Promise<FoundationSettings> {
  const stored = await browser.storage.local.get(SETTINGS_KEY);
  return sanitizeSettings(stored[SETTINGS_KEY]);
}

export async function saveSettings(
  patch: Partial<FoundationSettings>,
): Promise<FoundationSettings> {
  const current = await loadSettings();
  const next = sanitizeSettings({
    ...current,
    ...patch,
    flags: patch.flags ?? current.flags,
  });

  await browser.storage.local.set({ [SETTINGS_KEY]: next });
  return next;
}

export async function resetSettings(): Promise<FoundationSettings> {
  await browser.storage.local.remove(SETTINGS_KEY);
  return structuredClone(DEFAULT_SETTINGS);
}
