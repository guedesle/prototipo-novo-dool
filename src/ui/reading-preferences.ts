export type ReadingTextScale = 'default' | 'large' | 'extra-large';
export type ReadingMeasure = 'narrow' | 'standard' | 'wide';
export type ReadingSpacing = 'comfortable' | 'relaxed';

export interface ReadingPreferences {
  textScale: ReadingTextScale;
  measure: ReadingMeasure;
  spacing: ReadingSpacing;
}

export const DEFAULT_READING_PREFERENCES: Readonly<ReadingPreferences> = Object.freeze({
  textScale: 'default',
  measure: 'standard',
  spacing: 'comfortable',
});

const TEXT_SCALES = new Set<ReadingTextScale>(['default', 'large', 'extra-large']);
const MEASURES = new Set<ReadingMeasure>(['narrow', 'standard', 'wide']);
const SPACINGS = new Set<ReadingSpacing>(['comfortable', 'relaxed']);

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : {};
}

function choose<T extends string>(value: unknown, allowed: Set<T>, fallback: T): T {
  return typeof value === 'string' && allowed.has(value as T)
    ? value as T
    : fallback;
}

export function normalizeReadingPreferences(input: unknown): ReadingPreferences {
  const value = record(input);
  return {
    textScale: choose(value.textScale, TEXT_SCALES, DEFAULT_READING_PREFERENCES.textScale),
    measure: choose(value.measure, MEASURES, DEFAULT_READING_PREFERENCES.measure),
    spacing: choose(value.spacing, SPACINGS, DEFAULT_READING_PREFERENCES.spacing),
  };
}

export function readingPreferenceClassNames(preferences: ReadingPreferences): string[] {
  const normalized = normalizeReadingPreferences(preferences);
  return [
    `dool-reading--text-${normalized.textScale}`,
    `dool-reading--measure-${normalized.measure}`,
    `dool-reading--spacing-${normalized.spacing}`,
  ];
}
