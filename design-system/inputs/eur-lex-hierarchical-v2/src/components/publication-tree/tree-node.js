import { countFacts } from './tree-utils.js';

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

export function renderTreeNode(node, depth, controller) {
  const item = el('li', `do-tree-node do-tree-node--${node.type}`);
  item.dataset.nodeId = node.id;
  item.dataset.depth = String(depth);

  if (node.type === 'fact') {
    item.append(renderFact(node));
    return item;
  }

  const wrapper = el('div', 'do-dimension');
  const button = el('button', 'do-dimension__button');
  const panelId = controller.panelId(node.id);
  const expanded = controller.isInitiallyExpanded(node, depth);

  button.type = 'button';
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-controls', panelId);
  button.dataset.treeToggle = node.id;

  const chevron = el('span', 'do-dimension__chevron');
  chevron.setAttribute('aria-hidden', 'true');

  const text = el('span', 'do-dimension__text');
  if (node.dimension) {
    text.append(el('span', 'do-dimension__role', node.dimension));
  }
  text.append(el('span', 'do-dimension__name', node.label));

  const facts = countFacts(node);
  const count = el('span', 'do-dimension__count', `${facts} ${facts === 1 ? 'publicação' : 'publicações'}`);

  button.append(chevron, text, count);
  wrapper.append(button);
  item.append(wrapper);

  const children = el('ul', 'do-dimension__children');
  children.id = panelId;
  children.hidden = !expanded;
  for (const child of node.children ?? []) {
    children.append(renderTreeNode(child, depth + 1, controller));
  }
  item.append(children);

  return item;
}

function renderFact(node) {
  const article = el('article', 'do-publication');
  article.dataset.factId = node.id;

  const reference = el('div', 'do-publication__ref', node.ref ?? node.code ?? node.id);

  const body = el('div', 'do-publication__body');
  const title = el('h3', 'do-publication__title');
  const link = el('a');
  link.href = node.href ?? '#';
  link.textContent = node.title;
  title.append(link);
  body.append(title);

  if (Array.isArray(node.meta) && node.meta.length) {
    const meta = el('div', 'do-publication__meta');
    for (const value of node.meta) meta.append(el('span', '', value));
    body.append(meta);
  }

  const actions = el('div', 'do-publication__actions');
  const formats = Array.isArray(node.formats) && node.formats.length
    ? node.formats
    : node.href
      ? [{ label: 'HTML', href: node.href }]
      : [];

  for (const action of formats) {
    const anchor = el('a', 'do-publication__action', action.label);
    anchor.href = action.href;
    anchor.setAttribute('aria-label', `${action.label}: ${node.title}`);
    actions.append(anchor);
  }

  article.append(reference, body, actions);
  return article;
}
