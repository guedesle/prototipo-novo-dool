import { createButton } from './elements';

export type UiState = 'loading' | 'empty' | 'error' | 'success';

export interface RecoveryAction {
  label: string;
  onActivate: () => void;
}

export interface StatusViewOptions {
  state: UiState;
  title: string;
  message: string;
  recovery?: RecoveryAction;
}

export function createStatusView(options: StatusViewOptions): HTMLDivElement {
  const root = document.createElement('div');
  root.className = `dool-state dool-state--${options.state}`;
  root.dataset.uiState = options.state;

  if (options.state === 'loading' || options.state === 'error') {
    root.setAttribute('role', 'status');
    root.setAttribute('aria-live', 'polite');
  }

  const title = document.createElement('strong');
  title.className = 'dool-state__title';
  title.textContent = options.title;

  const message = document.createElement('p');
  message.className = 'dool-state__message';
  message.textContent = options.message;

  root.append(title, message);

  if (options.recovery) {
    root.append(createButton({
      label: options.recovery.label,
      variant: 'primary',
      onActivate: options.recovery.onActivate,
    }));
  }

  return root;
}
