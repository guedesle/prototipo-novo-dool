import { describe, expect, it, vi } from 'vitest';
import { AdapterError } from '../../src/adapters/errors';
import { DoolHttpClient } from '../../src/adapters/http';

const BASE_URL = 'https://dool.egba.ba.gov.br';

function jsonResponse(body: unknown, init: ResponseInit & { url?: string } = {}): Response {
  const response = new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
  });
  if (init.url) {
    Object.defineProperty(response, 'url', { value: init.url });
  }
  return response;
}

describe('DoolHttpClient', () => {
  it('uses browser-managed credentials and returns unknown data with safe response metadata', async () => {
    const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe(`${BASE_URL}/apifront/example`);
      expect(init?.credentials).toBe('include');
      expect(init?.method).toBe('GET');
      expect(init?.signal).toBeInstanceOf(AbortSignal);
      return jsonResponse({ ok: true }, { url: `${BASE_URL}/apifront/example` });
    });
    const client = new DoolHttpClient({ baseUrl: BASE_URL, fetchImpl, timeoutMs: 1_000 });

    await expect(client.getJson('/apifront/example')).resolves.toEqual({
      data: { ok: true },
      status: 200,
      finalUrl: `${BASE_URL}/apifront/example`,
      redirected: false,
    });
  });

  it.each([
    [401, 'AUTH_REQUIRED'],
    [403, 'FORBIDDEN'],
    [404, 'NOT_FOUND'],
  ] as const)('maps HTTP %s to %s without leaking the response body', async (status, code) => {
    const fetchImpl = vi.fn(async () => new Response('SECRET RESPONSE BODY', { status }));
    const client = new DoolHttpClient({ baseUrl: BASE_URL, fetchImpl });

    const error = await client.getJson('/protected').catch((value: unknown) => value);
    expect(error).toBeInstanceOf(AdapterError);
    expect(error).toMatchObject({ code, status });
    expect(String((error as Error).message)).not.toContain('SECRET RESPONSE BODY');
  });

  it('maps other non-success statuses to CONTRACT_UNEXPECTED', async () => {
    const client = new DoolHttpClient({
      baseUrl: BASE_URL,
      fetchImpl: vi.fn(async () => new Response('unexpected', { status: 500 })),
    });

    await expect(client.getJson('/broken')).rejects.toMatchObject({
      code: 'CONTRACT_UNEXPECTED',
      status: 500,
    });
  });

  it('maps fetch failures to NETWORK_FAILURE without exposing the original message', async () => {
    const client = new DoolHttpClient({
      baseUrl: BASE_URL,
      fetchImpl: vi.fn(async () => {
        throw new Error('socket failed with sensitive diagnostic');
      }),
    });

    const error = await client.getJson('/offline').catch((value: unknown) => value);
    expect(error).toMatchObject({ code: 'NETWORK_FAILURE', retryable: true });
    expect(String((error as Error).message)).not.toContain('sensitive diagnostic');
  });

  it('rejects invalid JSON as CONTRACT_UNEXPECTED', async () => {
    const client = new DoolHttpClient({
      baseUrl: BASE_URL,
      fetchImpl: vi.fn(async () => new Response('<html>not json</html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      })),
    });

    await expect(client.getJson('/not-json')).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });

  it('reports redirects using only final URL metadata', async () => {
    const fetchImpl = vi.fn(async () => {
      const response = jsonResponse({ ok: true }, { url: `${BASE_URL}/login` });
      Object.defineProperty(response, 'redirected', { value: true });
      return response;
    });
    const client = new DoolHttpClient({ baseUrl: BASE_URL, fetchImpl });

    const result = await client.getJson('/meus-dados');
    expect(result.redirected).toBe(true);
    expect(result.finalUrl).toBe(`${BASE_URL}/login`);
  });

  it('rejects cross-origin request paths before fetch', async () => {
    const fetchImpl = vi.fn();
    const client = new DoolHttpClient({ baseUrl: BASE_URL, fetchImpl });

    await expect(client.getJson('https://example.com/steal')).rejects.toMatchObject({
      code: 'UNSUPPORTED_OPERATION',
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
