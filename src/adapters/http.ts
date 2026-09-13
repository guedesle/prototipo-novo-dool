import { AdapterError } from './errors';

export interface DoolHttpClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface JsonResponse<T> {
  data: T;
  status: number;
  finalUrl: string;
  redirected: boolean;
}

const DEFAULT_TIMEOUT_MS = 15_000;

function errorForStatus(status: number): AdapterError {
  switch (status) {
    case 401:
      return new AdapterError('AUTH_REQUIRED', 'Authentication is required for this DOOL operation.', { status });
    case 403:
      return new AdapterError('FORBIDDEN', 'This DOOL operation is not available for the current session.', { status });
    case 404:
      return new AdapterError('NOT_FOUND', 'The requested DOOL resource was not found.', { status });
    default:
      return new AdapterError('CONTRACT_UNEXPECTED', 'DOOL returned an unexpected HTTP status.', { status });
  }
}

export class DoolHttpClient {
  private readonly baseUrl: URL;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: DoolHttpClientOptions) {
    this.baseUrl = new URL(options.baseUrl);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async getJson<T>(path: string): Promise<JsonResponse<T>> {
    const target = new URL(path, this.baseUrl);
    if (target.origin !== this.baseUrl.origin) {
      throw new AdapterError(
        'UNSUPPORTED_OPERATION',
        'Cross-origin requests are not allowed by the DOOL adapter transport.',
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await this.fetchImpl(target, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
    } catch {
      throw new AdapterError('NETWORK_FAILURE', 'The DOOL request could not be completed.', {
        operation: 'GET_JSON',
        retryable: true,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw errorForStatus(response.status);
    }

    let data: T;
    try {
      data = await response.json() as T;
    } catch {
      throw new AdapterError(
        'CONTRACT_UNEXPECTED',
        'DOOL returned a response that is not valid JSON.',
        { status: response.status },
      );
    }

    return {
      data,
      status: response.status,
      finalUrl: response.url || target.href,
      redirected: response.redirected,
    };
  }
}
