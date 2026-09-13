export const ADAPTER_ERROR_CODES = [
  'NETWORK_FAILURE',
  'AUTH_REQUIRED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONTRACT_UNEXPECTED',
  'PARSER_FAILURE',
  'UNSUPPORTED_OPERATION',
] as const;

export type AdapterErrorCode = (typeof ADAPTER_ERROR_CODES)[number];

export interface AdapterErrorOptions {
  status?: number;
  operation?: string;
  retryable?: boolean;
}

export class AdapterError extends Error {
  readonly code: AdapterErrorCode;
  readonly status?: number;
  readonly operation?: string;
  readonly retryable: boolean;

  constructor(code: AdapterErrorCode, message: string, options: AdapterErrorOptions = {}) {
    super(message);
    this.name = 'AdapterError';
    this.code = code;
    this.status = options.status;
    this.operation = options.operation;
    this.retryable = options.retryable ?? code === 'NETWORK_FAILURE';
  }
}

export function isAdapterError(value: unknown): value is AdapterError {
  return value instanceof AdapterError;
}
