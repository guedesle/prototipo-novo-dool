import { describe, expect, it, vi } from 'vitest';
import { DoolHttpClient } from '../../src/adapters/http';

const BASE_URL = 'https://dool.egba.ba.gov.br';

describe('DoolHttpClient text transport', () => {
  it('returns raw text with browser-managed credentials and safe metadata', async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      expect(init?.credentials).toBe('include');
      expect(init?.headers).toEqual({ Accept: 'text/html,*/*;q=0.8' });
      const response = new Response('<main>conteúdo</main>', { status: 200 });
      Object.defineProperty(response, 'url', { value: `${BASE_URL}/html/22502.html` });
      return response;
    });
    const client = new DoolHttpClient({ baseUrl: BASE_URL, fetchImpl });

    await expect(client.getText('/html/22502.html')).resolves.toEqual({
      data: '<main>conteúdo</main>',
      status: 200,
      finalUrl: `${BASE_URL}/html/22502.html`,
      redirected: false,
    });
  });
});
