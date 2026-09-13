// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { DoolHtmlPublicationRepository, parseHtmlEditionOutline } from '../../src/adapters/html-publications';
import type { TextHttpClient } from '../../src/adapters/http';

function textClient(responses: Record<string, string>): TextHttpClient {
  return {
    getText: vi.fn(async (path: string) => ({
      data: responses[path] ?? '',
      status: 200,
      finalUrl: `https://dool.egba.ba.gov.br${path}`,
      redirected: false,
    })),
  };
}

const outlineHtml = `
<ul>
  <li>
    <span class="folder">Secretaria A</span>
    <ul>
      <li><a class="linkMateria" data-id="101" pagina="3">Portaria Nº 10</a></li>
      <li>
        <span class="folder">Subseção</span>
        <ul><li><a class="linkMateria" id="102" pagina="4">Aviso especial</a></li></ul>
      </li>
    </ul>
  </li>
</ul>`;

describe('HTML publication adapter', () => {
  it('parses the observed folder/matter hierarchy into stable internal nodes', () => {
    expect(parseHtmlEditionOutline(outlineHtml, '22502')).toEqual({
      editionId: '22502',
      nodes: [{
        id: 'folder:0',
        title: 'Secretaria A',
        children: [
          { id: '101', title: 'Portaria Nº 10', children: [] },
          {
            id: 'folder:0.1',
            title: 'Subseção',
            children: [{ id: '102', title: 'Aviso especial', children: [] }],
          },
        ],
      }],
    });
  });

  it('loads the outline and matter content from the observed contracts', async () => {
    const rawMatter = '<html><style>.WordSection1{}</style><body>Çã — conteúdo&nbsp;integral</body></html>';
    const http = textClient({
      '/html/22502.html': outlineHtml,
      '/apifront/portal/edicoes/publicacoes_ver_conteudo/101': rawMatter,
    });
    const repository = new DoolHtmlPublicationRepository(http);

    const outline = await repository.getOutline('22502');
    const content = await repository.getContent('101');
    expect(outline.nodes[0]?.children[0]?.id).toBe('101');
    expect(content).toEqual({ publicationId: '101', html: rawMatter });
    expect(content.html).toBe(rawMatter);
  });

  it('fails closed when matter identifiers are missing or the outline is empty', () => {
    expect(() => parseHtmlEditionOutline('<ul><li><a class="linkMateria">Sem id</a></li></ul>', '22502'))
      .toThrow(expect.objectContaining({ code: 'PARSER_FAILURE' }));
    expect(() => parseHtmlEditionOutline('<ul></ul>', '22502'))
      .toThrow(expect.objectContaining({ code: 'PARSER_FAILURE' }));
  });

  it('rejects empty matter content instead of returning a valid-looking publication', async () => {
    const repository = new DoolHtmlPublicationRepository(textClient({
      '/apifront/portal/edicoes/publicacoes_ver_conteudo/101': '   ',
    }));
    await expect(repository.getContent('101')).rejects.toMatchObject({ code: 'PARSER_FAILURE' });
  });
});
