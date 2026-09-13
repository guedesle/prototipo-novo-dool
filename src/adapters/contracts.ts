import type {
  AccessState,
  AuthenticityResult,
  DocumentDescriptor,
  Edition,
  HtmlEditionOutline,
  HtmlPublicationContent,
  SearchQuery,
  SearchResultPage,
} from './types';

export type {
  AccessState,
  AccessCapabilities,
  CapabilityState,
  IdentityState,
  SubscriptionState,
} from './types';

export function createUnknownAccessState(): AccessState {
  return {
    identityState: 'unknown',
    subscriptionState: 'unknown',
    capabilities: {
      readHtml: 'unknown',
      downloadPdf: 'unknown',
      openJournal: 'unknown',
      accessCertifiedArchive: 'unknown',
    },
  };
}

export interface EditionRepository {
  getLatest(): Promise<Edition[]>;
  getByDate(date: string): Promise<Edition[]>;
}

export interface SearchRepository {
  search(query: SearchQuery): Promise<SearchResultPage>;
}

export interface HtmlPublicationRepository {
  getOutline(editionId: string): Promise<HtmlEditionOutline>;
  getContent(publicationId: string): Promise<HtmlPublicationContent>;
}

export interface SessionProvider {
  getAccessState(): Promise<AccessState>;
  invalidate(): void;
}

export interface DocumentRepository {
  getByEdition(editionId: string): Promise<DocumentDescriptor>;
}

export interface AuthenticityRepository {
  verify(code: string): Promise<AuthenticityResult>;
}
