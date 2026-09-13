import { describe, expect, it, vi } from 'vitest';
import { DoolDocumentRepository } from '../../src/adapters/documents';
import type { JsonHttpClient } from '../../src/adapters/http';

function clientReturning(data: unknown): JsonHttpClient {
  return {
    getJson: vi.fn(async () => ({ data, status: 200, finalUrl: 'https://dool.egba.ba.gov.br/x', redirected: false })),
  };
}

describe('DoolDocumentRepository', () => {
  it('normalizes the page catalogue and preserves efficient per-page routes', async () => {
    const http = clientReturning({
      erro: false,
      msg: '',
      itens: [
        { id: 'a', pagina: '1', link: '/page/1.jpg' },
        { id: 'b', pagina: '2', link: '/page/2.jpg' },
      ],
    });
    const repository = new DoolDocumentRepository(http);

    await expect(repository.getByEdition('22502')).resolves.toEqual({
      editionId: '22502',
      pdfUrl: '/portal/edicoes/download/22502',
      journalUrl: '/ver-flip/22502/',
      pages: [
        { index: 1, imageUrl: '/page/1.jpg', pdfUrl: '/apifront/portal/edicoes/pdf_diario/22502/1' },
        { index: 2, imageUrl: '/page/2.jpg', pdfUrl: '/apifront/portal/edicoes/pdf_diario/22502/2' },
      ],
    });
    expect(http.getJson).toHaveBeenCalledWith('/apifront/portal/edicoes/edicao_imagens/22502');
  });

  it('rejects duplicate or invalid page numbers as CONTRACT_UNEXPECTED', async () => {
    for (const itens of [
      [{ id: 'a', pagina: '1', link: '/1' }, { id: 'b', pagina: '1', link: '/1b' }],
      [{ id: 'a', pagina: 'zero', link: '/1' }],
      [{ id: 'a', pagina: '0', link: '/1' }],
    ]) {
      const repository = new DoolDocumentRepository(clientReturning({ erro: false, msg: '', itens }));
      await expect(repository.getByEdition('22502')).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
    }
  });

  it('rejects backend error envelopes and malformed item fields', async () => {
    const errorRepository = new DoolDocumentRepository(clientReturning({ erro: true, msg: 'fail', itens: [] }));
    await expect(errorRepository.getByEdition('22502')).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });

    const malformedRepository = new DoolDocumentRepository(clientReturning({
      erro: false,
      msg: '',
      itens: [{ id: 'a', pagina: '1', link: 123 }],
    }));
    await expect(malformedRepository.getByEdition('22502')).rejects.toMatchObject({ code: 'CONTRACT_UNEXPECTED' });
  });
});
