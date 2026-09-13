import { describe, expect, it, vi } from 'vitest';
import { DoolAuthenticityRepository } from '../../src/adapters/authenticity';
import type { JsonHttpClient } from '../../src/adapters/http';

describe('DoolAuthenticityRepository', () => {
  it('fails explicitly while the authenticity endpoint is not proven', async () => {
    const http: JsonHttpClient = {
      getJson: vi.fn(async () => {
        throw new Error('network must not be called');
      }),
    };
    const repository = new DoolAuthenticityRepository(http);

    await expect(repository.verify('PUBLIC-CODE')).rejects.toMatchObject({
      code: 'UNSUPPORTED_OPERATION',
    });
    expect(http.getJson).not.toHaveBeenCalled();
  });

  it('does not manufacture an invalid/valid result from an empty code either', async () => {
    const http: JsonHttpClient = { getJson: vi.fn() };
    const repository = new DoolAuthenticityRepository(http);

    await expect(repository.verify('')).rejects.toMatchObject({
      code: 'UNSUPPORTED_OPERATION',
    });
    expect(http.getJson).not.toHaveBeenCalled();
  });
});
