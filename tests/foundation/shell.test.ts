import { describe, expect, it, vi } from 'vitest';
import { SHELL_HOST_NAME, createShellViewModel, switchToOriginal } from '../../src/foundation/shell';

describe('foundation shell contract', () => {
  it('uses a stable kebab-case Shadow Root host name', () => {
    expect(SHELL_HOST_NAME).toBe('novo-dool-prototype');
  });

  it('exposes only normalized route, state and version in the shell view model', () => {
    expect(createShellViewModel('/ver-html/22535', 'ACTIVE', '0.1.0')).toEqual({
      title: 'Novo DOOL',
      route: '/ver-html/22535',
      state: 'ACTIVE',
      version: '0.1.0',
    });
  });

  it('persists original mode before removing the overlay', async () => {
    const calls: string[] = [];
    const persistOriginal = vi.fn(async () => { calls.push('persist'); });
    const removeOverlay = vi.fn(() => { calls.push('remove'); });

    await switchToOriginal({ persistOriginal, removeOverlay });

    expect(calls).toEqual(['persist', 'remove']);
  });
});
