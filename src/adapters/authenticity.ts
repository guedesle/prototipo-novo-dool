import { AdapterError } from './errors';
import type { AuthenticityRepository } from './contracts';
import type { JsonHttpClient } from './http';
import type { AuthenticityResult } from './types';

export class DoolAuthenticityRepository implements AuthenticityRepository {
  constructor(_http: JsonHttpClient) {}

  async verify(_code: string): Promise<AuthenticityResult> {
    throw new AdapterError(
      'UNSUPPORTED_OPERATION',
      'Authenticity verification is disabled until its DOOL backend contract is observed and validated.',
    );
  }
}
