import { renderTreeNode } from './tree-node.js';
import { countAllFacts, sortFactsInPlace, validateTree } from './tree-utils.js';

export class PublicationTree {
  constructor(root, nodes, options = {}) {
    if (!(root instanceof HTMLElement)) throw new TypeError('PublicationTree exige um elemento raiz válido.');

    this.root = root;
    this.nodes = structuredClone(Array.isArray(nodes) ? nodes : []);
    this.options = {
      defaultExpandedDepth: 2,
      ariaLabel: 'Sumário hierárquico da edição',
      ...options
    };

    const errors = validateTree(this.nodes);
    if (errors.length) throw new Error(`Árvore inválida:\n- ${errors.join('\n- ')}`);

    this.handleClick = this.handleClick.bind(this);
    this.render();
  }

  panelId(id) {
    return `do-tree-panel-${String(id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
  }

  isInitiallyExpanded(node, depth) {
    if (typeof node.expanded === 'boolean') return node.expanded;
    return depth < this.options.defaultExpandedDepth;
  }

  totalFacts() {
    return countAllFacts(this.nodes);
  }

  render() {
    this.root.removeEventListener('click', this.handleClick);
    this.root.replaceChildren();

    if (!this.nodes.length) {
      const empty = document.createElement('p');
      empty.className = 'do-tree-empty';
      empty.textContent = 'Nenhuma publicação disponível nesta edição.';
      this.root.append(empty);
      return;
    }

    const list = document.createElement('ul');
    list.className = 'do-publication-tree';
    list.setAttribute('aria-label', this.options.ariaLabel);
    for (const node of this.nodes) list.append(renderTreeNode(node, 0, this));
    this.root.append(list);
    this.root.addEventListener('click', this.handleClick);
    this.root.dataset.ready = 'true';
    this.root.dispatchEvent(new CustomEvent('publication-tree:ready', { bubbles: true }));
  }

  handleClick(event) {
    const button = event.target.closest('[data-tree-toggle]');
    if (!button || !this.root.contains(button)) return;
    this.setExpanded(button.dataset.treeToggle, button.getAttribute('aria-expanded') !== 'true');
  }

  setExpanded(nodeId, expanded) {
    const button = this.root.querySelector(`[data-tree-toggle="${CSS.escape(nodeId)}"]`);
    if (!button) return false;
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return false;

    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    this.root.dispatchEvent(new CustomEvent('publication-tree:toggle', {
      bubbles: true,
      detail: { nodeId, expanded }
    }));
    return true;
  }

  expandAll() {
    for (const button of this.root.querySelectorAll('[data-tree-toggle]')) {
      this.setExpanded(button.dataset.treeToggle, true);
    }
  }

  collapseAll() {
    for (const button of this.root.querySelectorAll('[data-tree-toggle]')) {
      this.setExpanded(button.dataset.treeToggle, false);
    }
  }

  sortFacts(direction = 'asc') {
    sortFactsInPlace(this.nodes, direction);
    this.render();
  }

  destroy() {
    this.root.removeEventListener('click', this.handleClick);
    this.root.replaceChildren();
    delete this.root.dataset.ready;
  }
}
