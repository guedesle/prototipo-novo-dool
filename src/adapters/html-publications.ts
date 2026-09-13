import { AdapterError } from './errors';
import type { HtmlPublicationRepository } from './contracts';
import type { TextHttpClient } from './http';
import type { HtmlEditionOutline, HtmlPublicationContent, HtmlPublicationNode } from './types';

function parserFailure(message: string): never {
  throw new AdapterError('PARSER_FAILURE', message);
}

function directChild<T extends Element>(element: Element, selector: string): T | undefined {
  return Array.from(element.children).find((child) => child.matches(selector)) as T | undefined;
}

function publicationId(link: HTMLAnchorElement): string {
  const candidates = [
    link.dataset.publicationId,
    link.dataset.id,
    link.getAttribute('id'),
  ];
  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (value) return value;
  }

  const href = link.getAttribute('href') ?? '';
  const match = href.match(/publicacoes_ver_conteudo\/([^/?#]+)/);
  if (match?.[1]) return decodeURIComponent(match[1]);

  return parserFailure('A DOOL HTML matter link is missing its publication identifier.');
}

function parseListItem(li: HTMLLIElement, path: number[], counter: { matters: number }): HtmlPublicationNode {
  const folder = directChild<HTMLSpanElement>(li, 'span.folder');
  const link = directChild<HTMLAnchorElement>(li, 'a.linkMateria');

  if (folder && link) {
    return parserFailure('A DOOL HTML outline item is ambiguously both a folder and a matter.');
  }

  if (link) {
    const title = link.textContent?.trim() ?? '';
    if (!title) return parserFailure('A DOOL HTML matter is missing its title.');
    counter.matters += 1;
    return { id: publicationId(link), title, children: [] };
  }

  if (folder) {
    const title = folder.textContent?.trim() ?? '';
    if (!title) return parserFailure('A DOOL HTML folder is missing its title.');
    const nested = directChild<HTMLUListElement>(li, 'ul');
    const children = nested
      ? Array.from(nested.children)
          .filter((child): child is HTMLLIElement => child instanceof HTMLLIElement)
          .map((child, index) => parseListItem(child, [...path, index], counter))
      : [];
    return { id: `folder:${path.join('.')}`, title, children };
  }

  return parserFailure('A DOOL HTML outline item has an unsupported structure.');
}

export function parseHtmlEditionOutline(html: string, editionId: string): HtmlEditionOutline {
  if (!html.trim()) return parserFailure('The DOOL HTML outline is empty.');
  const document = new DOMParser().parseFromString(html, 'text/html');
  const root = Array.from(document.body.children).find((element) => element instanceof HTMLUListElement)
    ?? document.querySelector('ul');
  if (!(root instanceof HTMLUListElement)) {
    return parserFailure('The DOOL HTML outline has no list root.');
  }

  const counter = { matters: 0 };
  const nodes = Array.from(root.children)
    .filter((child): child is HTMLLIElement => child instanceof HTMLLIElement)
    .map((child, index) => parseListItem(child, [index], counter));

  if (nodes.length === 0 || counter.matters === 0) {
    return parserFailure('The DOOL HTML outline contains no identifiable matters.');
  }

  return { editionId, nodes };
}

export class DoolHtmlPublicationRepository implements HtmlPublicationRepository {
  constructor(private readonly http: TextHttpClient) {}

  async getOutline(editionId: string): Promise<HtmlEditionOutline> {
    const safeEditionId = encodeURIComponent(editionId);
    const response = await this.http.getText(`/html/${safeEditionId}.html`);
    return parseHtmlEditionOutline(response.data, editionId);
  }

  async getContent(publicationIdValue: string): Promise<HtmlPublicationContent> {
    const safePublicationId = encodeURIComponent(publicationIdValue);
    const response = await this.http.getText(
      `/apifront/portal/edicoes/publicacoes_ver_conteudo/${safePublicationId}`,
    );
    if (!response.data.trim()) {
      throw new AdapterError('PARSER_FAILURE', 'The DOOL HTML publication content is empty.');
    }
    return { publicationId: publicationIdValue, html: response.data };
  }
}
