import { describe, expect, it } from 'vitest';
import {
  DEFAULT_READING_PREFERENCES,
  normalizeReadingPreferences,
  readingPreferenceClassNames,
} from '../../src/ui/reading-preferences';

describe('shared reading preferences', () => {
  it('uses conservative defaults that do not alter editorial semantics', () => {
    expect(DEFAULT_READING_PREFERENCES).toEqual({
      textScale: 'default',
      measure: 'standard',
      spacing: 'comfortable',
    });
  });

  it('accepts only bounded presentation preferences', () => {
    expect(normalizeReadingPreferences({
      textScale: 'large',
      measure: 'wide',
      spacing: 'relaxed',
    })).toEqual({
      textScale: 'large',
      measure: 'wide',
      spacing: 'relaxed',
    });
  });

  it('falls back per field when persisted or external values are invalid', () => {
    expect(normalizeReadingPreferences({
      textScale: '500%',
      measure: 'infinite',
      spacing: 'compressed',
    })).toEqual(DEFAULT_READING_PREFERENCES);
  });

  it('ignores content-shaped keys instead of transforming publication text', () => {
    expect(normalizeReadingPreferences({
      textScale: 'large',
      content: '<strong>alterado</strong>',
      replaceText: true,
    })).toEqual({
      textScale: 'large',
      measure: 'standard',
      spacing: 'comfortable',
    });
  });

  it('maps preferences to stable presentation class names only', () => {
    expect(readingPreferenceClassNames({
      textScale: 'extra-large',
      measure: 'narrow',
      spacing: 'relaxed',
    })).toEqual([
      'dool-reading--text-extra-large',
      'dool-reading--measure-narrow',
      'dool-reading--spacing-relaxed',
    ]);
  });
});
