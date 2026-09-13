import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import process from 'node:process';

const SHELL_TS = 'src/foundation/shell.ts';
const SHELL_CSS = 'src/foundation/dool.css';
const TOKEN_CSS = 'src/ui/tokens.css';
const RUNTIME_ROOTS = ['src', 'entrypoints'];
const RUNTIME_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.html']);

const violations = [];

function add(severity, location, message) {
  violations.push({ severity, location, message });
}

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

const [shellSource, shellCss, tokenCss] = await Promise.all([
  readFile(SHELL_TS, 'utf8'),
  readFile(SHELL_CSS, 'utf8'),
  readFile(TOKEN_CSS, 'utf8'),
]);

const shellRequirements = [
  ['serious', "href = '#novo-dool-main'", 'skip link must target the main content'],
  ['serious', "main.id = 'novo-dool-main'", 'main landmark must keep a stable target id'],
  ['serious', "document.createElement('nav')", 'shell must expose a native navigation landmark'],
  ['serious', "setAttribute('aria-label', 'Navegação da interface')", 'navigation landmark must have an accessible name'],
  ['serious', "textElement('h1'", 'shell must expose exactly one page-level heading by construction'],
];

for (const [severity, fragment, message] of shellRequirements) {
  if (!shellSource.includes(fragment)) add(severity, SHELL_TS, message);
}

if (/\.tabIndex\s*=\s*[1-9]\d*/.test(shellSource) || /tabindex\s*=\s*["'][1-9]\d*["']/i.test(shellSource)) {
  add('critical', SHELL_TS, 'positive tabindex is forbidden');
}

for (const root of RUNTIME_ROOTS) {
  for (const file of await walk(root)) {
    const source = await readFile(file, 'utf8');
    const path = relative(process.cwd(), file).replaceAll('\\', '/');
    if (/\.tabIndex\s*=\s*[1-9]\d*/.test(source) || /tabindex\s*=\s*["'][1-9]\d*["']/i.test(source)) {
      add('critical', path, 'positive tabindex is forbidden');
    }
  }
}

if (/outline\s*:\s*(?:none|0(?:\s*;|\s*$))/im.test(shellCss)) {
  add('critical', SHELL_CSS, 'focus outline must not be globally removed');
}

const focusSelectors = [
  '.novo-dool-skip-link:focus-visible',
  '.dool-button:focus-visible',
  '.dool-link:focus-visible',
  '.dool-field__control:focus-visible',
];
for (const selector of focusSelectors) {
  if (!shellCss.includes(selector)) add('serious', SHELL_CSS, `missing visible focus contract for ${selector}`);
}

if (!shellCss.includes('outline: 3px solid var(--dool-color-focus)')) {
  add('serious', SHELL_CSS, 'focus indicator must use the high-contrast focus token');
}

if (!shellCss.includes('@media (prefers-reduced-motion: reduce)')
  || !shellCss.includes('transition: none !important')
  || !shellCss.includes('animation: none !important')) {
  add('serious', SHELL_CSS, 'non-essential motion must be neutralized for reduced-motion users');
}

if (!shellCss.includes('overflow-wrap: anywhere')) {
  add('serious', SHELL_CSS, 'long unbroken content must be allowed to wrap');
}

if (!/\.dool-button[\s\S]*?min-height:\s*2\.75rem/.test(shellCss)
  || !/\.dool-field__control[\s\S]*?min-height:\s*2\.75rem/.test(shellCss)) {
  add('serious', SHELL_CSS, 'base controls must retain robust minimum target height');
}

if (/#[0-9a-fA-F]{3,8}\b/.test(shellCss)) {
  add('serious', SHELL_CSS, 'raw hexadecimal colors must remain confined to semantic tokens');
}

const requiredTokens = [
  '--dool-color-text',
  '--dool-color-surface',
  '--dool-color-focus',
  '--dool-color-action',
  '--dool-color-control-border',
];
for (const token of requiredTokens) {
  if (!tokenCss.includes(token)) add('serious', TOKEN_CSS, `missing required semantic token ${token}`);
}

if (violations.length > 0) {
  console.error('Base UI accessibility audit failed:');
  for (const violation of violations) {
    console.error(`- [${violation.severity}] ${violation.location}: ${violation.message}`);
  }
  process.exit(1);
}

console.log('Base UI accessibility audit passed: no critical or serious contract violations found.');
console.log('Scope: structural/static base-UI contracts only; browser and assistive-technology validation remains separate.');
