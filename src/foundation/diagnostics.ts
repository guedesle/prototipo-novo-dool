import type { FoundationState } from './states';

export interface DiagnosticEvent {
  timestamp: string;
  module: string;
  route: string;
  state: FoundationState;
  errorClass?: string;
  version: string;
}

function sanitizeRoute(route: unknown): string {
  if (typeof route !== 'string') return '/';

  try {
    const parsed = route.startsWith('http://') || route.startsWith('https://')
      ? new URL(route)
      : new URL(route, 'https://dool.egba.ba.gov.br');
    const pathname = parsed.pathname || '/';
    return pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;
  } catch {
    return '/';
  }
}

export function sanitizeDiagnostic(input: Record<string, unknown>): DiagnosticEvent {
  return {
    timestamp: typeof input.timestamp === 'string'
      ? input.timestamp
      : new Date().toISOString(),
    module: typeof input.module === 'string' ? input.module : 'unknown',
    route: sanitizeRoute(input.route),
    state: input.state as FoundationState,
    ...(typeof input.errorClass === 'string' ? { errorClass: input.errorClass } : {}),
    version: typeof input.version === 'string' ? input.version : 'unknown',
  };
}

export class DiagnosticRing {
  readonly #limit: number;
  readonly #events: DiagnosticEvent[] = [];

  constructor(limit = 50) {
    this.#limit = Math.max(1, limit);
  }

  push(event: DiagnosticEvent): void {
    this.#events.push(sanitizeDiagnostic(event as unknown as Record<string, unknown>));
    if (this.#events.length > this.#limit) {
      this.#events.splice(0, this.#events.length - this.#limit);
    }
  }

  values(): readonly DiagnosticEvent[] {
    return this.#events.map((event) => ({ ...event }));
  }
}
