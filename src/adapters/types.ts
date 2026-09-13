export type CapabilityState = 'available' | 'unavailable' | 'unknown';
export type IdentityState = 'anonymous' | 'authenticated' | 'unknown';
export type SubscriptionState = 'subscriber' | 'nonSubscriber' | 'unknown';

export interface AccessCapabilities {
  readHtml: CapabilityState;
  downloadPdf: CapabilityState;
  openJournal: CapabilityState;
  accessCertifiedArchive: CapabilityState;
}

export interface AccessState {
  identityState: IdentityState;
  subscriptionState: SubscriptionState;
  capabilities: AccessCapabilities;
}

export type EditionKind = 'principal' | 'suplemento' | 'extra' | 'unknown';

export interface Edition {
  id: string;
  date: string;
  number?: string;
  kind: EditionKind;
  title?: string;
  hasHtml: boolean;
  hasPdf: boolean;
  hasJournal: boolean;
}

export interface DocumentPage {
  index: number;
  imageUrl?: string;
  pdfUrl?: string;
}

export interface DocumentDescriptor {
  editionId: string;
  pdfUrl?: string;
  journalUrl?: string;
  pages: DocumentPage[];
}

export interface SearchQuery {
  term: string;
  exact?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
}

export interface SearchHit {
  id: string;
  editionId?: string;
  publicationId?: string;
  title?: string;
  date?: string;
  editionNumber?: string;
  editionKind?: EditionKind;
  page?: number;
  highlights: string[];
}

export interface SearchFacets {
  editionTypes: Record<string, number>;
  editions: Record<string, number>;
  years: Record<string, number>;
}

export interface SearchResultPage {
  query: SearchQuery;
  total: number;
  page: number;
  hits: SearchHit[];
  facets: SearchFacets;
}

export interface HtmlPublicationNode {
  id: string;
  title: string;
  children: HtmlPublicationNode[];
}

export interface HtmlEditionOutline {
  editionId: string;
  nodes: HtmlPublicationNode[];
}

export interface HtmlPublicationContent {
  publicationId: string;
  html: string;
}

export interface AuthenticityResult {
  code: string;
  status: 'valid' | 'invalid' | 'unknown';
  certified?: boolean;
}
