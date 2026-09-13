import { AdapterError, isAdapterError } from './errors';
import type { SessionProvider } from './contracts';
import type { TextHttpClient } from './http';
import type { AccessState } from './types';

function publicBaseline(identityState: AccessState['identityState']): AccessState {
  return {
    identityState,
    subscriptionState: 'unknown',
    capabilities: {
      readHtml: 'available',
      downloadPdf: 'unknown',
      openJournal: 'unknown',
      accessCertifiedArchive: 'unknown',
    },
  };
}

function isAnonymousRedirect(finalUrl: string): boolean {
  try {
    const url = new URL(finalUrl);
    return url.pathname === '/' || url.pathname === '/login' || url.pathname === '/login/';
  } catch {
    return false;
  }
}

export class DoolSessionProvider implements SessionProvider {
  private cachedState: AccessState | undefined;

  constructor(private readonly http: TextHttpClient) {}

  async getAccessState(): Promise<AccessState> {
    if (this.cachedState) return structuredClone(this.cachedState);

    try {
      const response = await this.http.getText('/meus-dados');
      if (response.redirected && isAnonymousRedirect(response.finalUrl)) {
        this.cachedState = publicBaseline('anonymous');
      } else {
        const path = new URL(response.finalUrl).pathname.replace(/\/$/, '');
        if (path !== '/meus-dados') {
          this.cachedState = publicBaseline('unknown');
        } else {
          this.cachedState = publicBaseline('authenticated');
        }
      }
    } catch (error) {
      if (isAdapterError(error) && error.code === 'AUTH_REQUIRED') {
        this.cachedState = publicBaseline('anonymous');
      } else {
        throw error;
      }
    }

    return structuredClone(this.cachedState);
  }

  invalidate(): void {
    this.cachedState = undefined;
  }

  observeAuthorizationFailure(
    capability: keyof AccessState['capabilities'],
    error: AdapterError,
  ): void {
    if (error.code !== 'AUTH_REQUIRED' && error.code !== 'FORBIDDEN') return;

    const state = this.cachedState ?? publicBaseline('unknown');
    state.capabilities[capability] = 'unavailable';
    if (error.code === 'AUTH_REQUIRED') {
      state.identityState = 'anonymous';
      state.subscriptionState = 'unknown';
    }
    this.cachedState = state;
  }
}
