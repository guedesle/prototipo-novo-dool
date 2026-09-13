import { describe, expect, it } from 'vitest';
import { isSupportedRoute, normalizeRoute } from '../../src/foundation/routes';

describe('DOOL route support', () => {
  it.each([
    ['https://dool.egba.ba.gov.br/', 'home'],
    ['https://dool.egba.ba.gov.br/buscanova/', 'search'],
    ['https://dool.egba.ba.gov.br/ver-html/22535/', 'html-reader'],
    ['https://dool.egba.ba.gov.br/ver-pdf/22535/', 'pdf-reader'],
    ['https://dool.egba.ba.gov.br/ver-flip/22535/', 'flip-reader'],
    ['https://dool.egba.ba.gov.br/meus-dados', 'profile'],
  ])('normalizes supported route %s', (raw, kind) => {
    const route = normalizeRoute(new URL(raw));
    expect(route.kind).toBe(kind);
    expect(isSupportedRoute(route)).toBe(true);
  });

  it.each([
    'https://dool.egba.ba.gov.br/login',
    'https://dool.egba.ba.gov.br/cadastro',
    'https://dool.egba.ba.gov.br/esqueci-senha',
    'https://dool.egba.ba.gov.br/admin/home',
    'https://dool.egba.ba.gov.br/ver-html/not-a-number/',
    'https://example.org/',
  ])('does not support %s', (raw) => {
    const route = normalizeRoute(new URL(raw));
    expect(isSupportedRoute(route)).toBe(false);
  });

  it('ignores query and hash when normalizing a supported route', () => {
    const route = normalizeRoute(
      new URL('https://dool.egba.ba.gov.br/ver-html/22535/?x=1#materia'),
    );
    expect(route).toMatchObject({ kind: 'html-reader', editionId: '22535' });
  });
});
