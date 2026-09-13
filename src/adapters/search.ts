import { AdapterError } from './errors';
import type { SearchRepository } from './contracts';
import type { JsonHttpClient } from './http';
import type { EditionKind, SearchFacets, SearchHit, SearchQuery, SearchResultPage } from './types';
import { requireArray, requireBoolean, requireRecord, requireString } from './validation';

function requireNonNegativeInteger(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
    throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an invalid numeric search field.');
  }
  return value;
}

function normalizeTotal(value: unknown): number {
  if (typeof value === 'number') return requireNonNegativeInteger(value);
  const record = requireRecord(value);
  return requireNonNegativeInteger(record.value);
}

function optionalText(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an incompatible textual search field.');
}

function optionalPage(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an invalid search page number.');
  }
  return number;
}

function normalizeKind(value: unknown): EditionKind | undefined {
  const text = optionalText(value);
  if (!text) return undefined;
  const normalized = text.toLocaleLowerCase('pt-BR');
  if (normalized.includes('suplement')) return 'suplemento';
  if (normalized.includes('principal')) return 'principal';
  if (normalized.includes('extra')) return 'extra';
  return 'unknown';
}

function normalizeHighlights(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  const highlight = requireRecord(value);
  if (highlight.conteudo === undefined || highlight.conteudo === null) return [];
  return requireArray(highlight.conteudo).map(requireString);
}

function normalizeHit(value: unknown): SearchHit {
  const hit = requireRecord(value);
  const id = requireString(hit._id);
  const source = requireRecord(hit._source);

  if (source.conteudo !== undefined) requireString(source.conteudo);
  const date = source.data === undefined ? undefined : requireString(source.data);

  return {
    id,
    editionId: optionalText(source.diario_id),
    publicationId: optionalText(source.pdf_id),
    date,
    editionKind: normalizeKind(source.tipo_edicao),
    page: optionalPage(source.pagina),
    highlights: normalizeHighlights(hit.highlight),
  };
}

function normalizeAggregation(value: unknown): Record<string, number> {
  if (value === undefined) return {};
  const aggregation = requireRecord(value);
  const buckets = requireArray(aggregation.buckets);
  const result: Record<string, number> = {};
  for (const rawBucket of buckets) {
    const bucket = requireRecord(rawBucket);
    const key = optionalText(bucket.key);
    if (key === undefined) {
      throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an aggregation bucket without a key.');
    }
    if (Object.hasOwn(result, key)) {
      throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned duplicate aggregation keys.');
    }
    result[key] = requireNonNegativeInteger(bucket.doc_count);
  }
  return result;
}

function normalizeFacets(value: unknown): SearchFacets {
  const aggregations = requireRecord(value);
  return {
    editionTypes: normalizeAggregation(aggregations.TipoEdicao),
    editions: normalizeAggregation(aggregations.Edicoes),
    years: normalizeAggregation(aggregations.FileYear),
  };
}

export class DoolSearchRepository implements SearchRepository {
  constructor(private readonly http: JsonHttpClient) {}

  async search(query: SearchQuery): Promise<SearchResultPage> {
    if (query.startDate || query.endDate) {
      throw new AdapterError(
        'UNSUPPORTED_OPERATION',
        'Date-filter path encoding is disabled until the observed DOOL contract is fully specified.',
      );
    }

    const page = query.page ?? 0;
    if (!Number.isInteger(page) || page < 0) {
      throw new AdapterError('UNSUPPORTED_OPERATION', 'Search page must be a non-negative integer.');
    }

    const term = query.exact ? `"${query.term}"` : query.term;
    const path = `/busca/busca/buscar/query/${page}/?1=1&q=${encodeURIComponent(term)}`;
    const response = await this.http.getJson(path);
    const root = requireRecord(response.data);

    if ('erro' in root) {
      throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an error-shaped search payload.');
    }

    requireNonNegativeInteger(root.took);
    requireBoolean(root.timed_out);
    if (!Object.hasOwn(root, 'loggedCredit')) {
      throw new AdapterError('CONTRACT_UNEXPECTED', 'DOOL search payload omitted loggedCredit.');
    }

    const hitsEnvelope = requireRecord(root.hits);
    const total = normalizeTotal(hitsEnvelope.total);
    const hits = requireArray(hitsEnvelope.hits).map(normalizeHit);
    const facets = normalizeFacets(root.aggregations);

    return {
      query: { ...query, page },
      total,
      page,
      hits,
      facets,
    };
  }
}
