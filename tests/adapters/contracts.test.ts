import { describe, expect, it } from 'vitest';
import { AdapterError, ADAPTER_ERROR_CODES } from '../../src/adapters/errors';
import {
  createUnknownAccessState,
  type AccessState,
  type CapabilityState,
  type EditionRepository,
  type SearchRepository,
  type HtmlPublicationRepository,
  type SessionProvider,
  type DocumentRepository,
  type AuthenticityRepository,
} from '../../src/adapters/contracts';

describe('adapter public contracts', () => {
  it('exposes the complete typed adapter error vocabulary', () => {
    expect(ADAPTER_ERROR_CODES).toEqual([
      'NETWORK_FAILURE',
      'AUTH_REQUIRED',
      'FORBIDDEN',
      'NOT_FOUND',
      'CONTRACT_UNEXPECTED',
      'PARSER_FAILURE',
      'UNSUPPORTED_OPERATION',
    ]);

    const error = new AdapterError('FORBIDDEN', 'Operation is not available', { status: 403 });
    expect(error.name).toBe('AdapterError');
    expect(error.code).toBe('FORBIDDEN');
    expect(error.status).toBe(403);
  });

  it('starts every unobserved capability as unknown rather than granted', () => {
    const state = createUnknownAccessState();

    expect(state).toEqual<AccessState>({
      identityState: 'unknown',
      subscriptionState: 'unknown',
      capabilities: {
        readHtml: 'unknown',
        downloadPdf: 'unknown',
        openJournal: 'unknown',
        accessCertifiedArchive: 'unknown',
      },
    });
  });

  it('keeps capability states tri-state', () => {
    const values: CapabilityState[] = ['available', 'unavailable', 'unknown'];
    expect(values).toHaveLength(3);
  });

  it('exports repository boundaries without requiring concrete implementations', () => {
    const contracts: Array<keyof {
      editions: EditionRepository;
      search: SearchRepository;
      html: HtmlPublicationRepository;
      session: SessionProvider;
      documents: DocumentRepository;
      authenticity: AuthenticityRepository;
    }> = ['editions', 'search', 'html', 'session', 'documents', 'authenticity'];

    expect(contracts).toEqual(['editions', 'search', 'html', 'session', 'documents', 'authenticity']);
  });
});
