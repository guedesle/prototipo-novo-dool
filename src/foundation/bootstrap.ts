import type { FoundationState } from './states';

export type ShellMountResult = 'active' | 'degraded';

export interface BootstrapDependencies {
  routeSupported: boolean;
  enabled: boolean;
  alreadyMounted: boolean;
  route: string;
  version: string;
  mountShell: () => Promise<ShellMountResult>;
  unmountShell: () => Promise<void>;
  recordDiagnostic: (event: {
    timestamp: string;
    module: string;
    route: string;
    state: FoundationState;
    errorClass?: string;
    version: string;
  }) => Promise<void> | void;
}

async function record(
  deps: BootstrapDependencies,
  state: FoundationState,
  errorClass?: string,
): Promise<void> {
  await deps.recordDiagnostic({
    timestamp: new Date().toISOString(),
    module: 'bootstrap',
    route: deps.route,
    state,
    ...(errorClass ? { errorClass } : {}),
    version: deps.version,
  });
}

export async function bootstrapFoundation(
  deps: BootstrapDependencies,
): Promise<FoundationState> {
  if (!deps.routeSupported) {
    await record(deps, 'UNSUPPORTED_ROUTE');
    return 'UNSUPPORTED_ROUTE';
  }

  if (!deps.enabled) {
    await record(deps, 'DISABLED');
    return 'DISABLED';
  }

  if (deps.alreadyMounted) {
    await record(deps, 'ACTIVE');
    return 'ACTIVE';
  }

  await record(deps, 'BOOTING');

  try {
    const result = await deps.mountShell();
    const state: FoundationState = result === 'degraded' ? 'DEGRADED' : 'ACTIVE';
    await record(deps, state);
    return state;
  } catch (error) {
    try {
      await deps.unmountShell();
    } catch {
      // Fail-open: cleanup failures must not hide or replace the original portal.
    }

    const errorClass = error instanceof Error ? error.constructor.name : 'UnknownError';
    await record(deps, 'FAILED', errorClass);
    return 'FAILED';
  }
}
