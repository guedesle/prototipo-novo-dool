import test from 'node:test';
import assert from 'node:assert/strict';
import { countAllFacts, countFacts, sortFactsInPlace, validateTree } from '../src/components/publication-tree/tree-utils.js';
import { edition } from '../data/edition.sample.js';

test('conta fatos em profundidade arbitrária', () => {
  assert.equal(countAllFacts(edition.tree), 5);
  assert.equal(countFacts(edition.tree[0]), 4);
});

test('valida a amostra', () => {
  assert.deepEqual(validateTree(edition.tree), []);
});

test('rejeita fact com children', () => {
  const invalid = [{ id: 'x', type: 'fact', title: 'x', children: [{ id: 'y', type: 'fact', title: 'y' }] }];
  assert.match(validateTree(invalid).join('\n'), /não pode possuir children/);
});

test('ordena apenas folhas dentro de cada grupo', () => {
  const data = [{ id: 'd', type: 'dimension', label: 'D', children: [
    { id: 'b', type: 'fact', ref: '20', title: 'B' },
    { id: 'a', type: 'fact', ref: '3', title: 'A' }
  ] }];
  sortFactsInPlace(data, 'asc');
  assert.deepEqual(data[0].children.map(n => n.ref), ['3', '20']);
});
