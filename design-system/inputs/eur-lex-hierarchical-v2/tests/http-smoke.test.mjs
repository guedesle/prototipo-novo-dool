import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css' };

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const pathname = req.url === '/' ? '/demo/' : req.url.split('?')[0];
      const relative = normalize(pathname).replace(/^([/\\])+/, '');
      let target = join(root, relative);
      const info = await stat(target).catch(() => null);
      if (info?.isDirectory()) target = join(target, 'index.html');
      const body = await readFile(target);
      res.writeHead(200, { 'content-type': mime[extname(target)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
}

test('demo e dependências modulares são servidas por HTTP', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    for (const path of [
      '/demo/',
      '/demo/demo.js',
      '/demo/demo.css',
      '/data/edition.sample.js',
      '/src/index.js',
      '/src/styles/index.css',
      '/src/components/publication-tree/publication-tree.js',
      '/src/components/publication-tree/tree-node.js',
      '/src/components/publication-tree/tree-utils.js',
      '/src/components/publication-tree/publication-tree.css'
    ]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200, `${path} deveria responder 200`);
      assert.ok((await response.text()).length > 0, `${path} deveria ter conteúdo`);
    }
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
