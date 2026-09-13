import { describe, expect, it, vi } from 'vitest';
import { DoolEditionRepository } from '../../src/adapters/editions';
import type { JsonHttpClient } from '../../src/adapters/http';

function clientReturning(data: unknown): JsonHttpClient {
  return {
    getJson: vi.fn(async () => ({ data, status: 200, finalUrl: 'https://dool.egba.ba.gov.br/x', redirected: false })),
  };
}

const latestPayload = {
  erro: false,
  msg: '',
  itens: [
    {
      id: '22502',
      data: '05/09/2026',
      suplemento: 0,
      suplemento_nome: '',
      numero: '24473',
      tipo_edicao_id: '1',
      tipo_edicao_nome: 'Edição Principal',
      capa: '/capa/22502.jpg',
    },
    {
      id: '22503',
      data: '05/09/2026',
      suplemento: '1',
      suplemento_nome: 'Suplemento',
      numero: '24473',
      tipo_edicao_id: '2',
      tipo_edicao_nome: 'Suplemento',
      capa: '/capa/22503.jpg',
    },
  ],
};

describe('DoolEditionRepository', () => {
  it('normalizes principal and supplement editions despite suplemento type variation', async () => {
    const http = clientReturning(latestPayload);
    const repository = new DoolEditionRepository(http, { subtheme: 'doe' });

    await expect(repository.getLatest()).resolves.toEqual([
      expect.objectContaining({ id: '22502', number: '24473', kind: 'principal', hasHtml: true, hasPdf: true, hasJournal: true }),
      expect.objectContaining({ id: '22503', number: '24473', kind: 'suplemento', hasHtml: true, hasPdf: true, hasJournal: true }),
    ]);
    expect(http.getJson).toHaveBeenCalledWith('/apifront/portal/edicoes/ultimas_edicoes.json?subtheme=doe');
  });

  it('treats backend erro=true as CONTRACT_UNEXPECTED even with HTTP 200', async () => {
    const repository = new DoolEditionRepository(clientReturning({ erro: true, msg: 'failure', itens: [] }), { subtheme: 'doe' });
    await expect(repository.getLatest()).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });

  it.each([
    [{ erro: false, msg: '', itens: [{ ...latestPayload.itens[0], id: 123 }] }],
    [{ erro: false, msg: '', itens: [{ ...latestPayload.itens[0], data: undefined }] }],
    [{ erro: false, msg: '', itens: 'not-an-array' }],
  ])('rejects incompatible schemas instead of producing partial editions', async (payload) => {
    const repository = new DoolEditionRepository(clientReturning(payload), { subtheme: 'doe' });
    await expect(repository.getLatest()).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });

  it('does not invent a date-query contract that was not observed', async () => {
    const repository = new DoolEditionRepository(clientReturning(latestPayload), { subtheme: 'doe' });
    await expect(repository.getByDate('2026-09-05')).rejects.toMatchObject({ code: 'UNSUPPORTED_OPERATION' });
  });
});
