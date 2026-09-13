import { describe, expect, it } from 'vitest';
import { DiagnosticRing, sanitizeDiagnostic } from '../../src/foundation/diagnostics';

describe('foundation diagnostics', () => {
  it('keeps only the closed, non-sensitive diagnostic schema', () => {
    const diagnostic = sanitizeDiagnostic({
      timestamp: '2026-09-13T20:00:00.000Z',
      module: 'bootstrap',
      route: 'https://dool.egba.ba.gov.br/ver-html/22535/?secret=x#token',
      state: 'FAILED',
      errorClass: 'TypeError',
      version: '0.1.0',
      message: 'Cookie: secret',
      responseBody: 'sensitive',
    });

    expect(diagnostic).toEqual({
      timestamp: '2026-09-13T20:00:00.000Z',
      module: 'bootstrap',
      route: '/ver-html/22535',
      state: 'FAILED',
      errorClass: 'TypeError',
      version: '0.1.0',
    });
    expect(diagnostic).not.toHaveProperty('message');
    expect(diagnostic).not.toHaveProperty('responseBody');
  });

  it('keeps at most 50 events', () => {
    const ring = new DiagnosticRing(50);
    for (let index = 0; index < 55; index += 1) {
      ring.push({
        timestamp: `2026-09-13T20:00:${String(index).padStart(2, '0')}.000Z`,
        module: 'test',
        route: '/',
        state: 'ACTIVE',
        version: '0.1.0',
      });
    }

    expect(ring.values()).toHaveLength(50);
    expect(ring.values()[0]?.timestamp).toBe('2026-09-13T20:00:05.000Z');
  });
});
