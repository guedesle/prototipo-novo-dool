import { describe, expect, it, vi } from 'vitest';
import { AdapterError } from '../../src/adapters/errors';
import { DoolSessionProvider } from '../../src/adapters/session';
import type { TextHttpClient } from '../../src/adapters/http';

function clientWithProbe(result: { redirected: boolean; finalUrl: string } | Error): TextHttpClient & { getText: ReturnType<typeof vi.fn> } {
  const getText = vi.fn(async () => {
    if (result instanceof Error) throw result;
    return {
      data: '<html>profile</html>',
      status: 200,
      finalUrl: result.finalUrl,
      redirected: result.redirected,
    };
  });
  return { getText };
}

describe('DoolSessionProvider', () => {
  it('recognizes an authenticated profile response without inferring subscription', async () => {
    const http = clientWithProbe({ redirected: false, finalUrl: 'https://dool.egba.ba.gov.br/meus-dados' });
    const session = new DoolSessionProvider(http);

    await expect(session.getAccessState()).resolves.toEqual({
      identityState: 'authenticated',
      subscriptionState: 'unknown',
      capabilities: {
        readHtml: 'available',
        downloadPdf: 'unknown',
        openJournal: 'unknown',
        accessCertifiedArchive: 'unknown',
      },
    });
    await session.getAccessState();
    expect(http.getText).toHaveBeenCalledTimes(1);
  });

  it('recognizes redirects to login/root or AUTH_REQUIRED as anonymous', async () => {
    for (const result of [
      { redirected: true, finalUrl: 'https://dool.egba.ba.gov.br/login' },
      { redirected: true, finalUrl: 'https://dool.egba.ba.gov.br/' },
      new AdapterError('AUTH_REQUIRED', 'auth', { status: 401 }),
    ]) {
      const session = new DoolSessionProvider(clientWithProbe(result));
      const state = await session.getAccessState();
      expect(state.identityState).toBe('anonymous');
      expect(state.subscriptionState).toBe('unknown');
      expect(state.capabilities.readHtml).toBe('available');
    }
  });

  it('invalidates the requested protected capability on FORBIDDEN without inventing logout', async () => {
    const session = new DoolSessionProvider(clientWithProbe({ redirected: false, finalUrl: 'https://dool.egba.ba.gov.br/meus-dados' }));
    await session.getAccessState();
    session.observeAuthorizationFailure('downloadPdf', new AdapterError('FORBIDDEN', 'forbidden', { status: 403 }));

    const state = await session.getAccessState();
    expect(state.identityState).toBe('authenticated');
    expect(state.capabilities.downloadPdf).toBe('unavailable');
    expect(state.capabilities.accessCertifiedArchive).toBe('unknown');
  });

  it('invalidates identity on AUTH_REQUIRED and never preserves stale protected access', async () => {
    const session = new DoolSessionProvider(clientWithProbe({ redirected: false, finalUrl: 'https://dool.egba.ba.gov.br/meus-dados' }));
    await session.getAccessState();
    session.observeAuthorizationFailure('downloadPdf', new AdapterError('AUTH_REQUIRED', 'expired', { status: 401 }));

    const state = await session.getAccessState();
    expect(state.identityState).toBe('anonymous');
    expect(state.capabilities.downloadPdf).toBe('unavailable');
    expect(state.capabilities.accessCertifiedArchive).toBe('unknown');
  });

  it('re-probes only after explicit invalidation', async () => {
    const http = clientWithProbe({ redirected: false, finalUrl: 'https://dool.egba.ba.gov.br/meus-dados' });
    const session = new DoolSessionProvider(http);
    await session.getAccessState();
    session.invalidate();
    await session.getAccessState();
    expect(http.getText).toHaveBeenCalledTimes(2);
  });

  it('does not convert network failures into a false authentication state', async () => {
    const session = new DoolSessionProvider(clientWithProbe(new AdapterError('NETWORK_FAILURE', 'network')));
    await expect(session.getAccessState()).rejects.toMatchObject({ code: 'NETWORK_FAILURE' });
  });
});
