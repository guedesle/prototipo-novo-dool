export const FOUNDATION_STATES = [
  'UNSUPPORTED_ROUTE',
  'DISABLED',
  'BOOTING',
  'ACTIVE',
  'DEGRADED',
  'FAILED',
] as const;

export type FoundationState = (typeof FOUNDATION_STATES)[number];

export function isOverlayActiveState(state: FoundationState): boolean {
  return state === 'ACTIVE';
}
