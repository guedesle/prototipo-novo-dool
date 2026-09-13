export type RouteKind =
  | 'home'
  | 'search'
  | 'html-reader'
  | 'pdf-reader'
  | 'flip-reader'
  | 'profile'
  | 'unsupported';

export interface NormalizedRoute {
  host: string;
  pathname: string;
  kind: RouteKind;
  editionId?: string;
}

const DOOL_HOST = 'dool.egba.ba.gov.br';

function normalizePathname(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function unsupported(url: URL): NormalizedRoute {
  return {
    host: url.hostname.toLowerCase(),
    pathname: normalizePathname(url.pathname),
    kind: 'unsupported',
  };
}

export function normalizeRoute(url: URL): NormalizedRoute {
  const host = url.hostname.toLowerCase();
  const pathname = normalizePathname(url.pathname);

  if (url.protocol !== 'https:' || host !== DOOL_HOST) {
    return unsupported(url);
  }

  if (pathname === '/') return { host, pathname, kind: 'home' };
  if (pathname === '/buscanova') return { host, pathname, kind: 'search' };
  if (pathname === '/meus-dados') return { host, pathname, kind: 'profile' };

  const readers: Array<[RegExp, Exclude<RouteKind, 'home' | 'search' | 'profile' | 'unsupported'>]> = [
    [/^\/ver-html\/(\d+)$/, 'html-reader'],
    [/^\/ver-pdf\/(\d+)$/, 'pdf-reader'],
    [/^\/ver-flip\/(\d+)$/, 'flip-reader'],
  ];

  for (const [pattern, kind] of readers) {
    const match = pathname.match(pattern);
    if (match?.[1]) {
      return { host, pathname, kind, editionId: match[1] };
    }
  }

  return { host, pathname, kind: 'unsupported' };
}

export function isSupportedRoute(route: NormalizedRoute): boolean {
  return route.kind !== 'unsupported';
}
