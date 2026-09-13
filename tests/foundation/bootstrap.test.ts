import { describe, expect, it, vi } from 'vitest';
import { bootstrapFoundation } from '../../src/foundation/bootstrap';
import type { FoundationState } from '../../src/foundation/states';

function createDeps(overrides: Partial<Parameters<typeof bootstrapFoundation>[0]> = {}) {
  const events: FoundationState[] = [];
  return {
    routeSupported: true,
    enabled: true,
    alreadyMounted: false,
    mountShell: vi.fn(async () => 'active' as const),
    unmountShell: vi.fn(async () => undefined),
    recordDiagnostic: vi.fn(async ({ state }: { state: FoundationState }) => {
      events.push(state);
    }),
    route: '/',
    version: '0.1.0',
    ...overrides,
    events,
  };
}

describe('foundation bootstrap', () => {
  it('does nothing on unsupported routes', async () => {
    const deps = createDeps({ routeSupported: false });
    await expect(bootstrapFoundation(deps)).resolves.toBe('UNSUPPORTED_ROUTE');
    expect(deps.mountShell).not.toHaveBeenCalled();
  });

  it('does nothing when globally disabled', async () => {
    const deps = createDeps({ enabled: false });
    await expect(bootstrapFoundation(deps)).resolves.toBe('DISABLED');
    expect(deps.mountShell).not.toHaveBeenCalled();
  });

  it('records BOOTING before ACTIVE', async () => {
    const deps = createDeps();
    await expect(bootstrapFoundation(deps)).resolves.toBe('ACTIVE');
    expect(deps.events).toEqual(['BOOTING', 'ACTIVE']);
  });

  it('returns DEGRADED when mount explicitly degrades', async () => {
    const deps = createDeps({ mountShell: vi.fn(async () => 'degraded' as const) });
    await expect(bootstrapFoundation(deps)).resolves.toBe('DEGRADED');
    expect(deps.events).toEqual(['BOOTING', 'DEGRADED']);
  });

  it('fails open and attempts unmount when mounting throws', async () => {
    const deps = createDeps({ mountShell: vi.fn(async () => { throw new TypeError('boom'); }) });
    await expect(bootstrapFoundation(deps)).resolves.toBe('FAILED');
    expect(deps.unmountShell).toHaveBeenCalledTimes(1);
    expect(deps.events).toEqual(['BOOTING', 'FAILED']);
  });

  it('is idempotent when the shell is already mounted', async () => {
    const deps = createDeps({ alreadyMounted: true });
    await expect(bootstrapFoundation(deps)).resolves.toBe('ACTIVE');
    expect(deps.mountShell).not.toHaveBeenCalled();
  });
});
