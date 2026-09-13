import { AdapterError } from './errors';

export interface DoolHttpClientOptions {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export interface JsonResponse {
  data: unknown;
  status: number;
  finalUrl: string;
  redirected: boolean;
}

export interface TextResponse {
  data: string;
  status: number;
  finalUrl: string;
  redirected: boolean;
}

export interface JsonHttpClient {
  getJson(path: string): Promise<JsonResponse>;
}

export interface TextHttpClient {
  getText(path: string): Promise<TextResponse>;
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

export class DoolHttpClient implements JsonHttpClient, TextHttpClient {
  private readonly baseUrl: URL;
  private readonly fetchImpl: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: DoolHttpClientOptions) {
    this.baseUrl = new URL(options.baseUrl);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  async getJson(path: string): Promise<JsonResponse> {
    const response = await this.request(path, { Accept: 'application/json' });

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new AdapterError(
        'CONTRACT_UNEXPECTED',
        'DOOL returned a response that is not valid JSON.',
        { status: response.status },
      );
    }

    return this.metadata(response, data);
  }

  async getText(path: string): Promise<TextResponse> {
    const response = await this.request(path, { Accept: 'text/html,*/*;q=0.8' });
    const data = await response.text();
    return this.metadata(response, data);
  }

  private async request(path: string, headers: Record<string, string>): Promise<Response> {
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
        headers,
      });
    } catch {
      throw new AdapterError('NETWORK_FAILURE', 'The DOOL request could not be completed.', {
        operation: 'GET',
        retryable: true,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw errorForStatus(response.status);
    }

    return response;
  }

  private metadata<T extends string | unknown>(response: Response, data: T): {
    data: T;
    status: number;
    finalUrl: string;
    redirected: boolean;
  } {
    return {
      data,
      status: response.status,
      finalUrl: response.url || this.baseUrl.href,
      redirected: response.redirected,
    };
  }
}
