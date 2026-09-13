import { readFileSync } from 'node:fs';

const manifestPath = process.argv[2] ?? '.output/chrome-mv3/manifest.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(manifest.manifest_version === 3, 'Manifest must be MV3');

const permissions = [...(manifest.permissions ?? [])].sort();
assert(JSON.stringify(permissions) === JSON.stringify(['storage']), `Unexpected permissions: ${permissions.join(', ')}`);

const forbiddenPermissions = ['cookies', 'webRequest', 'webRequestBlocking', 'tabs', 'downloads', 'history', 'management', '<all_urls>'];
for (const permission of forbiddenPermissions) {
  assert(!permissions.includes(permission), `Forbidden permission present: ${permission}`);
}

const matches = (manifest.content_scripts ?? []).flatMap((entry) => entry.matches ?? []);
assert(matches.length === 1, `Expected one content-script match, found ${matches.length}`);
assert(matches[0] === 'https://dool.egba.ba.gov.br/*', `Unexpected content-script match: ${matches[0] ?? 'none'}`);

const hostPermissions = manifest.host_permissions ?? [];
assert(!hostPermissions.includes('<all_urls>'), 'Forbidden <all_urls> host permission present');

assert(manifest.action?.default_popup, 'Popup entrypoint must be present');

console.log(JSON.stringify({
  manifestVersion: manifest.manifest_version,
  permissions,
  matches,
  popup: manifest.action.default_popup,
}, null, 2));
