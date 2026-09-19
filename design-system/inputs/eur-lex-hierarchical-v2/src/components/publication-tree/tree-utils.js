export function countFacts(node) {
  if (!node || typeof node !== "object") return 0;
  if (node.type === "fact") return 1;
  return (node.children ?? []).reduce((total, child) => total + countFacts(child), 0);
}

export function countAllFacts(nodes = []) {
  return nodes.reduce((total, node) => total + countFacts(node), 0);
}

export function validateTree(nodes = []) {
  const ids = new Set();
  const errors = [];

  function visit(node, path = []) {
    const here = [...path, node?.id ?? "<sem-id>"];
    if (!node || typeof node !== "object") {
      errors.push(`${here.join(" > ")}: nó inválido`);
      return;
    }
    if (!node.id) errors.push(`${here.join(" > ")}: id obrigatório`);
    if (node.id && ids.has(node.id)) errors.push(`${here.join(" > ")}: id duplicado`);
    if (node.id) ids.add(node.id);

    if (!['dimension', 'fact'].includes(node.type)) {
      errors.push(`${here.join(" > ")}: type deve ser dimension ou fact`);
      return;
    }

    if (node.type === 'fact') {
      if (!node.title) errors.push(`${here.join(" > ")}: fact exige title`);
      if (node.children?.length) errors.push(`${here.join(" > ")}: fact não pode possuir children`);
      return;
    }

    if (!node.label) errors.push(`${here.join(" > ")}: dimension exige label`);
    for (const child of node.children ?? []) visit(child, here);
  }

  for (const node of nodes) visit(node);
  return errors;
}

export function sortFactsInPlace(nodes, direction = 'asc') {
  const multiplier = direction === 'desc' ? -1 : 1;
  const compare = (a, b) => String(a.ref ?? a.code ?? a.title ?? '').localeCompare(
    String(b.ref ?? b.code ?? b.title ?? ''),
    'pt-BR',
    { numeric: true, sensitivity: 'base' }
  ) * multiplier;

  for (const node of nodes) {
    if (node.type !== 'dimension' || !Array.isArray(node.children)) continue;
    const dimensions = node.children.filter(child => child.type === 'dimension');
    const facts = node.children.filter(child => child.type === 'fact').sort(compare);
    node.children = [...dimensions, ...facts];
    sortFactsInPlace(dimensions, direction);
  }
  return nodes;
}
