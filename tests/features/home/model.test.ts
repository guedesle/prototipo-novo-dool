import { describe, expect, it } from 'vitest';
import { buildHomeViewModel } from '../../../src/features/home/model';
import type { AccessState, Edition } from '../../../src/adapters/types';

const editions: Edition[] = [
  {
    id: '22502',
    date: '05/09/2026',
    number: '24473',
    kind: 'principal',
    title: 'Edição Principal',
    hasHtml: true,
    hasPdf: true,
    hasJournal: true,
  },
  {
    id: '22503',
    date: '05/09/2026',
    number: '24473',
    kind: 'suplemento',
    title: 'Suplemento',
    hasHtml: true,
    hasPdf: true,
    hasJournal: true,
  },
  {
    id: '22498',
    date: '04/09/2026',
    number: '24472',
    kind: 'principal',
    title: 'Edição Principal',
    hasHtml: true,
    hasPdf: true,
    hasJournal: false,
  },
];

function access(overrides: Partial<AccessState['capabilities']> = {}): AccessState {
  return {
    identityState: 'anonymous',
    subscriptionState: 'unknown',
    capabilities: {
      readHtml: 'available',
      downloadPdf: 'unknown',
      openJournal: 'unavailable',
      accessCertifiedArchive: 'unknown',
      ...overrides,
    },
  };
}

describe('buildHomeViewModel', () => {
  it('uses the first backend date as the default selection and preserves edition order', () => {
    const view = buildHomeViewModel(editions, access());

    expect(view.status).toBe('ready');
    expect(view.currentDate).toBe('05/09/2026');
    expect(view.selectedDate).toBe('05/09/2026');
    expect(view.dateOptions).toEqual([
      { value: '05/09/2026', label: '05/09/2026' },
      { value: '04/09/2026', label: '04/09/2026' },
    ]);
    expect(view.editions.map((edition) => edition.id)).toEqual(['22502', '22503']);
    expect(view.editions.map((edition) => edition.kind)).toEqual(['principal', 'suplemento']);
  });

  it('never promotes unknown or unavailable protected capabilities to available', () => {
    const view = buildHomeViewModel(editions, access());
    const principal = view.editions[0];

    expect(principal?.actions.html.state).toBe('available');
    expect(principal?.actions.pdf.state).toBe('unknown');
    expect(principal?.actions.journal.state).toBe('unavailable');
  });

  it('marks a format unavailable when the edition itself does not expose it', () => {
    const view = buildHomeViewModel(
      editions,
      access({ downloadPdf: 'available', openJournal: 'available' }),
      '04/09/2026',
    );

    expect(view.status).toBe('ready');
    expect(view.editions[0]?.actions.pdf.state).toBe('available');
    expect(view.editions[0]?.actions.journal.state).toBe('unavailable');
  });

  it('returns an informative empty selection when a deep-linked date is not in the recent catalog', () => {
    const view = buildHomeViewModel(editions, access(), '01/01/2000');

    expect(view.status).toBe('empty');
    expect(view.selectedDate).toBe('01/01/2000');
    expect(view.currentDate).toBe('05/09/2026');
    expect(view.editions).toEqual([]);
    expect(view.dateOptions).toHaveLength(2);
  });

  it('returns an empty catalog state without inventing dates', () => {
    const view = buildHomeViewModel([], access());

    expect(view).toMatchObject({
      status: 'empty',
      currentDate: undefined,
      selectedDate: undefined,
      dateOptions: [],
      editions: [],
    });
  });

  it('uses a backend title when available and a stable fallback when absent', () => {
    const withoutTitles = editions.map((edition) => ({ ...edition, title: undefined }));
    const view = buildHomeViewModel(withoutTitles, access());

    expect(view.editions[0]?.displayTitle).toBe('Edição principal');
    expect(view.editions[1]?.displayTitle).toBe('Suplemento');
  });
});
