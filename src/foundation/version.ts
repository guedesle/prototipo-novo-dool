export interface RuntimeManifestReader {
  getManifest: () => { version?: string };
}

export function getExtensionVersion(runtime: RuntimeManifestReader): string {
  try {
    const version = runtime.getManifest().version;
    return typeof version === 'string' && version.trim() ? version : 'unknown';
  } catch {
    return 'unknown';
  }
}
