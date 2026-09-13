import { AdapterError } from './errors';
import type { JsonHttpClient } from './http';
import type { EditionRepository } from './contracts';
import type { Edition, EditionKind } from './types';
import {
  requireRecord,
  requireString,
  requireStringOrInteger,
  requireSuccessfulEnvelope,
} from './validation';

export interface DoolEditionRepositoryOptions {
  subtheme: string;
}

function normalizeKind(typeName: string, suplemento: string | number): EditionKind {
  const normalized = typeName.toLocaleLowerCase('pt-BR');
  if (normalized.includes('suplement') || String(suplemento) !== '0') return 'suplemento';
  if (normalized.includes('principal')) return 'principal';
  if (normalized.includes('extra')) return 'extra';
  return 'unknown';
}

function normalizeEdition(value: unknown): Edition {
  const item = requireRecord(value);
  const id = requireString(item.id);
  const date = requireString(item.data);
  const suplemento = requireStringOrInteger(item.suplemento);
  const number = requireString(item.numero);
  requireString(item.tipo_edicao_id);
  const typeName = requireString(item.tipo_edicao_nome);
  requireString(item.capa);
  if ('suplemento_nome' in item) requireString(item.suplemento_nome);

  return {
    id,
    date,
    number,
    kind: normalizeKind(typeName, suplemento),
    title: typeName,
    hasHtml: true,
    hasPdf: true,
    hasJournal: true,
  };
}

export class DoolEditionRepository implements EditionRepository {
  constructor(
    private readonly http: JsonHttpClient,
    private readonly options: DoolEditionRepositoryOptions,
  ) {}

  async getLatest(): Promise<Edition[]> {
    const subtheme = encodeURIComponent(this.options.subtheme);
    const response = await this.http.getJson(`/apifront/portal/edicoes/ultimas_edicoes.json?subtheme=${subtheme}`);
    const { items } = requireSuccessfulEnvelope(response.data);
    const editions = items.map(normalizeEdition);
    const ids = new Set<string>();
    for (const edition of editions) {
      if (ids.has(edition.id)) {
        throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned duplicate edition identifiers.');
      }
      ids.add(edition.id);
    }
    return editions;
  }

  async getByDate(_date: string): Promise<Edition[]> {
    throw new AdapterError(
      'UNSUPPORTED_OPERATION',
      'Edition lookup by arbitrary date is not enabled until its backend contract is confirmed.',
    );
  }
}
