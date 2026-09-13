import type { FoundationState } from './states';

export const SHELL_HOST_NAME = 'novo-dool-prototype';

export interface ShellViewModel {
  title: 'Novo DOOL';
  route: string;
  state: FoundationState;
  version: string;
}

export interface ShellActions {
  onOriginal: () => Promise<void> | void;
}

export interface MountedShell {
  root: HTMLElement;
  destroy: () => void;
}

export function createShellViewModel(
  route: string,
  state: FoundationState,
  version: string,
): ShellViewModel {
  return { title: 'Novo DOOL', route, state, version };
}

export async function switchToOriginal(deps: {
  persistOriginal: () => Promise<void>;
  removeOverlay: () => void;
}): Promise<void> {
  await deps.persistOriginal();
  deps.removeOverlay();
}

function textElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

export function mountPrototypeShell(
  container: HTMLElement,
  view: ShellViewModel,
  actions: ShellActions,
): MountedShell {
  const root = document.createElement('main');
  root.className = 'novo-dool-shell';
  root.setAttribute('data-foundation-state', view.state);

  const header = document.createElement('header');
  header.className = 'novo-dool-shell__header';

  const identity = document.createElement('div');
  identity.className = 'novo-dool-shell__identity';
  identity.append(
    textElement('strong', 'novo-dool-shell__title', view.title),
    textElement('span', 'novo-dool-shell__badge', 'Protótipo'),
  );

  const controls = document.createElement('div');
  controls.className = 'novo-dool-shell__controls';

  const activeButton = document.createElement('button');
  activeButton.type = 'button';
  activeButton.className = 'novo-dool-shell__button';
  activeButton.textContent = 'Nova interface';
  activeButton.disabled = true;
  activeButton.setAttribute('aria-current', 'true');

  const originalButton = document.createElement('button');
  originalButton.type = 'button';
  originalButton.className = 'novo-dool-shell__button novo-dool-shell__button--primary';
  originalButton.textContent = 'Interface original';
  originalButton.addEventListener('click', actions.onOriginal);

  controls.append(activeButton, originalButton);
  header.append(identity, controls);

  const content = document.createElement('section');
  content.className = 'novo-dool-shell__content';
  content.setAttribute('aria-label', 'Fundação do protótipo Novo DOOL');
  content.append(
    textElement('p', 'novo-dool-shell__eyebrow', 'Fundação técnica ativa'),
    textElement('h1', 'novo-dool-shell__heading', 'Nova camada de interface isolada'),
    textElement(
      'p',
      'novo-dool-shell__lead',
      'Este shell valida isolamento, reversibilidade e controle do protótipo. As telas de negócio serão adicionadas nos próximos épicos.',
    ),
  );

  const meta = document.createElement('dl');
  meta.className = 'novo-dool-shell__meta';
  const pairs: Array<[string, string]> = [
    ['Rota', view.route],
    ['Estado', view.state],
    ['Versão', view.version],
  ];
  for (const [label, value] of pairs) {
    meta.append(
      textElement('dt', 'novo-dool-shell__meta-label', label),
      textElement('dd', 'novo-dool-shell__meta-value', value),
    );
  }
  content.append(meta);

  root.append(header, content);
  container.replaceChildren(root);

  return {
    root,
    destroy: () => {
      originalButton.removeEventListener('click', actions.onOriginal);
      root.remove();
    },
  };
}
