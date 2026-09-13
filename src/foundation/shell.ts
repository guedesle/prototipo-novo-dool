import type { FoundationState } from './states';
import { createButton } from '../ui/elements';

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
  const root = document.createElement('div');
  root.className = 'novo-dool-shell';
  root.setAttribute('data-foundation-state', view.state);

  const skipLink = document.createElement('a');
  skipLink.className = 'novo-dool-skip-link';
  skipLink.href = '#novo-dool-main';
  skipLink.textContent = 'Ir para o conteúdo principal';

  const header = document.createElement('header');
  header.className = 'novo-dool-shell__header';

  const identity = document.createElement('div');
  identity.className = 'novo-dool-shell__identity';
  identity.append(
    textElement('strong', 'novo-dool-shell__title', view.title),
    textElement('span', 'novo-dool-shell__badge', 'Protótipo'),
  );

  const navigation = document.createElement('nav');
  navigation.className = 'novo-dool-shell__controls novo-dool-shell__navigation';
  navigation.setAttribute('aria-label', 'Navegação da interface');

  const activeButton = createButton({ label: 'Nova interface', disabled: true });
  activeButton.classList.add('novo-dool-shell__button');
  activeButton.setAttribute('aria-current', 'true');

  const originalButton = createButton({
    label: 'Interface original',
    variant: 'primary',
    onActivate: actions.onOriginal,
  });
  originalButton.classList.add('novo-dool-shell__button', 'novo-dool-shell__button--primary');

  navigation.append(activeButton, originalButton);
  header.append(identity, navigation);

  const main = document.createElement('main');
  main.id = 'novo-dool-main';
  main.className = 'novo-dool-shell__content';
  main.tabIndex = -1;
  main.setAttribute('aria-labelledby', 'novo-dool-page-title');

  main.append(
    textElement('p', 'novo-dool-shell__eyebrow', 'Fundação técnica ativa'),
  );

  const heading = textElement('h1', 'novo-dool-shell__heading', 'Nova camada de interface isolada');
  heading.id = 'novo-dool-page-title';
  main.append(
    heading,
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
  main.append(meta);

  root.append(skipLink, header, main);
  container.replaceChildren(root);

  return {
    root,
    destroy: () => {
      originalButton.removeEventListener('click', actions.onOriginal);
      root.remove();
    },
  };
}
