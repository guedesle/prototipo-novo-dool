import { AdapterError } from './errors';
import type { DocumentRepository } from './contracts';
import type { JsonHttpClient } from './http';
import type { DocumentDescriptor, DocumentPage } from './types';
import { requireRecord, requireString, requireSuccessfulEnvelope } from './validation';

function normalizePage(value: unknown, editionId: string): DocumentPage {
  const item = requireRecord(value);
  requireString(item.id);
  const pageText = requireString(item.pagina);
  const imageUrl = requireString(item.link);
  const index = Number(pageText);
  if (!Number.isInteger(index) || index <= 0) {
    throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an invalid page number.');
  }

  return {
    index,
    imageUrl,
    pdfUrl: `/apifront/portal/edicoes/pdf_diario/${encodeURIComponent(editionId)}/${index}`,
  };
}

export class DoolDocumentRepository implements DocumentRepository {
  constructor(private readonly http: JsonHttpClient) {}

  async getByEdition(editionId: string): Promise<DocumentDescriptor> {
    const safeId = encodeURIComponent(editionId);
    const response = await this.http.getJson(`/apifront/portal/edicoes/edicao_imagens/${safeId}`);
    const { items } = requireSuccessfulEnvelope(response.data);
    const pages = items.map((item) => normalizePage(item, editionId));
    const indexes = new Set<number>();
    for (const page of pages) {
      if (indexes.has(page.index)) {
        throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned duplicate page numbers.');
      }
      indexes.add(page.index);
    }

    return {
      editionId,
      pdfUrl: `/portal/edicoes/download/${safeId}`,
      journalUrl: `/ver-flip/${safeId}/`,
      pages,
    };
  }
}
