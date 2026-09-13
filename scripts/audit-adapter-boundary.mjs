import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import process from 'node:process';

const ROOTS = ['src', 'entrypoints'];
const RUNTIME_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.html']);
const ADAPTER_PREFIX = `src${sep}adapters${sep}`;
const ALLOWED_HOST_FILES = new Set([
  `entrypoints${sep}dool.content.ts`,
  `src${sep}foundation${sep}routes.ts`,
  `src${sep}foundation${sep}diagnostics.ts`,
]);

const BACKEND_LITERALS = [
  '/apifront/portal/',
  '/busca/busca/',
  '/portal/edicoes/',
  '/html/',
];

const COOKIE_PATTERNS = [
  /document\s*\.\s*cookie/,
  /chrome\s*\.\s*cookies/,
  /browser\s*\.\s*cookies/,
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && RUNTIME_EXTENSIONS.has(extname(entry.name))) files.push(path);
  }
  return files;
}

function normalized(path) {
  return relative(process.cwd(), path).split('/').join(sep);
}

const violations = [];

for (const root of ROOTS) {
  for (const file of await walk(root)) {
    const path = normalized(file);
    const source = await readFile(file, 'utf8');

    for (const pattern of COOKIE_PATTERNS) {
      if (pattern.test(source)) {
        violations.push(`${path}: direct cookie API access is forbidden`);
      }
    }

    if (!path.startsWith(ADAPTER_PREFIX)) {
      for (const literal of BACKEND_LITERALS) {
        if (source.includes(literal)) {
          violations.push(`${path}: legacy backend literal escaped src/adapters (${literal})`);
        }
      }
    }

    if (source.includes('dool.egba.ba.gov.br') && !path.startsWith(ADAPTER_PREFIX) && !ALLOWED_HOST_FILES.has(path)) {
      violations.push(`${path}: DOOL host literal is outside the approved routing/diagnostic boundary`);
    }
  }
}

if (violations.length > 0) {
  console.error('Adapter boundary audit failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Adapter boundary audit passed.');
