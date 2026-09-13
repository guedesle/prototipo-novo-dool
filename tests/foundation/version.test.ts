import { describe, expect, it } from 'vitest';
import { getExtensionVersion } from '../../src/foundation/version';

describe('extension version', () => {
  it('reads the manifest version from an injected runtime', () => {
    const runtime = { getManifest: () => ({ version: '0.1.0' }) };
    expect(getExtensionVersion(runtime)).toBe('0.1.0');
  });

  it('falls back to unknown when runtime data is unusable', () => {
    const runtime = { getManifest: () => ({ version: '' }) };
    expect(getExtensionVersion(runtime)).toBe('unknown');
  });
});
