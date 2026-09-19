import { PublicationTree } from '../src/index.js';
import { edition } from '../data/edition.sample.js';

const root = document.querySelector('#publication-tree');
const status = document.querySelector('#demo-status');
const baseTree = structuredClone(edition.tree);

const tree = new PublicationTree(root, baseTree, {
  defaultExpandedDepth: 2,
  ariaLabel: `Sumário de ${edition.date}`
});

const setText = (selector, value) => {
  const node = document.querySelector(selector);
  if (node) node.textContent = value;
};

setText('#publication-name', edition.publication);
setText('#edition-title', edition.title);
setText('#edition-date', edition.date);
setText('#edition-number', edition.edition);
setText('#publication-count', `${tree.totalFacts()} publicações`);

document.querySelector('#expand-all').addEventListener('click', () => {
  tree.expandAll();
  status.textContent = 'Todos os níveis foram expandidos.';
});

document.querySelector('#collapse-all').addEventListener('click', () => {
  tree.collapseAll();
  status.textContent = 'Todos os níveis foram recolhidos.';
});

document.querySelector('#sort-direction').addEventListener('change', (event) => {
  if (event.target.value === 'editorial') {
    tree.nodes = structuredClone(baseTree);
    tree.render();
    status.textContent = 'Ordem editorial restaurada.';
    return;
  }
  tree.sortFacts(event.target.value);
  status.textContent = event.target.value === 'asc'
    ? 'Publicações ordenadas por referência crescente.'
    : 'Publicações ordenadas por referência decrescente.';
});

window.__demoTree = tree;
document.documentElement.dataset.demoReady = 'true';
