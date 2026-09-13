import { describe, expect, it, vi } from 'vitest';
import { DoolSearchRepository } from '../../src/adapters/search';
import type { JsonHttpClient } from '../../src/adapters/http';

function clientReturning(data: unknown): JsonHttpClient {
  return {
    getJson: vi.fn(async () => ({ data, status: 200, finalUrl: 'https://dool.egba.ba.gov.br/search', redirected: false })),
  };
}

const positivePayload = {
  took: 4,
  timed_out: false,
  loggedCredit: false,
  hits: {
    total: { value: 1, relation: 'eq' },
    max_score: 1,
    hits: [
      {
        _id: 'hit-1',
        _score: 1,
        _source: {
          conteudo: 'Conteúdo publicado',
          data: '05/09/2026',
          pagina: 7,
          pdf_id: 'pub-77',
          diario_id: '22502',
          tipo_edicao: 'Edição Principal',
        },
        highlight: { conteudo: ['Trecho <em>destacado</em>'] },
      },
    ],
  },
  aggregations: {
    TipoEdicao: { buckets: [{ key: 'Principal', doc_count: 1 }] },
    Edicoes: { buckets: [{ key: '24473', doc_count: 1 }] },
    FileYear: { buckets: [{ key: 2026, doc_count: 1 }] },
  },
};

describe('DoolSearchRepository', () => {
  it('normalizes hits, highlights and aggregation facets', async () => {
    const http = clientReturning(positivePayload);
    const repository = new DoolSearchRepository(http);

    await expect(repository.search({ term: 'software', page: 0 })).resolves.toEqual({
      query: { term: 'software', page: 0 },
      total: 1,
      page: 0,
      hits: [{
        id: 'hit-1',
        editionId: '22502',
        publicationId: 'pub-77',
        date: '05/09/2026',
        editionKind: 'principal',
        page: 7,
        highlights: ['Trecho <em>destacado</em>'],
      }],
      facets: {
        editionTypes: { Principal: 1 },
        editions: { '24473': 1 },
        years: { '2026': 1 },
      },
    });
    expect(http.getJson).toHaveBeenCalledWith('/busca/busca/buscar/query/0/?1=1&q=software');
  });

  it('treats zero results as a valid domain state', async () => {
    const repository = new DoolSearchRepository(clientReturning({
      ...positivePayload,
      hits: { total: 0, max_score: null, hits: [] },
      aggregations: {
        TipoEdicao: { buckets: [] },
        Edicoes: { buckets: [] },
        FileYear: { buckets: [] },
      },
    }));

    const result = await repository.search({ term: 'inexistente', page: 2 });
    expect(result.total).toBe(0);
    expect(result.hits).toEqual([]);
    expect(result.page).toBe(2);
  });

  it('uses quotes for the observed exact-search client behavior', async () => {
    const http = clientReturning({ ...positivePayload, hits: { total: 0, hits: [] }, aggregations: {} });
    const repository = new DoolSearchRepository(http);
    await repository.search({ term: 'expressão exata', exact: true, page: 0 });
    expect(http.getJson).toHaveBeenCalledWith('/busca/busca/buscar/query/0/?1=1&q=%22express%C3%A3o%20exata%22');
  });

  it('rejects date filters until their path encoding is proven', async () => {
    const repository = new DoolSearchRepository(clientReturning(positivePayload));
    await expect(repository.search({ term: 'software', startDate: '2026-01-01' })).rejects.toMatchObject({
      code: 'UNSUPPORTED_OPERATION',
    });
  });

  it.each([
    { ...positivePayload, hits: { total: 'one', hits: [] } },
    { ...positivePayload, hits: { total: 1, hits: [{ _id: 99, _source: {} }] } },
    { ...positivePayload, hits: { total: 1, hits: [{ _id: 'x', _source: {}, highlight: { conteudo: [1] } }] } },
    { ...positivePayload, aggregations: { TipoEdicao: { buckets: [{ key: 'P', doc_count: '1' }] } } },
  ])('rejects incompatible search contracts', async (payload) => {
    const repository = new DoolSearchRepository(clientReturning(payload));
    await expect(repository.search({ term: 'software' })).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });

  it('rejects HTTP-200 error-shaped payloads rather than displaying them as zero results', async () => {
    const repository = new DoolSearchRepository(clientReturning({ erro: true, msg: 'search unavailable' }));
    await expect(repository.search({ term: 'software' })).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });
});
