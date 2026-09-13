import { AdapterError } from './errors';

export type UnknownRecord = Record<string, unknown>;

export function contractFailure(message = 'DOOL returned an incompatible contract.'): never {
  throw new AdapterError('CONTRACT_UNEXPECTED', message);
}

export function requireRecord(value: unknown): UnknownRecord {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return contractFailure();
  }
  return value as UnknownRecord;
}

export function requireArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    return contractFailure();
  }
  return value;
}

export function requireString(value: unknown): string {
  if (typeof value !== 'string') {
    return contractFailure();
  }
  return value;
}

export function requireBoolean(value: unknown): boolean {
  if (typeof value !== 'boolean') {
    return contractFailure();
  }
  return value;
}

export function requireStringOrInteger(value: unknown): string | number {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  return contractFailure();
}

export function requireSuccessfulEnvelope(value: unknown): { record: UnknownRecord; items: unknown[] } {
  const record = requireRecord(value);
  const erro = requireBoolean(record.erro);
  requireString(record.msg);
  const items = requireArray(record.itens);
  if (erro) {
    return contractFailure('DOOL reported an error inside a successful HTTP response.');
  }
  return { record, items };
}
