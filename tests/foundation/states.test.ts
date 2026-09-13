import { describe, expect, it } from 'vitest';
import { FOUNDATION_STATES, isOverlayActiveState } from '../../src/foundation/states';

describe('foundation states', () => {
  it('exposes the closed state model from the spec', () => {
    expect(FOUNDATION_STATES).toEqual([
      'UNSUPPORTED_ROUTE',
      'DISABLED',
      'BOOTING',
      'ACTIVE',
      'DEGRADED',
      'FAILED',
    ]);
  });

  it('activates the overlay only for ACTIVE state', () => {
    for (const state of FOUNDATION_STATES) {
      expect(isOverlayActiveState(state)).toBe(state === 'ACTIVE');
    }
  });
});
