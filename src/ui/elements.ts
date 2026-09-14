export type ButtonVariant = 'default' | 'primary';

export interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onActivate?: () => void;
}

export function createButton(options: ButtonOptions): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = options.variant === 'primary'
    ? 'dool-button dool-button--primary'
    : 'dool-button';
  button.textContent = options.label;
  button.disabled = options.disabled ?? false;
  if (options.onActivate) button.addEventListener('click', options.onActivate);
  return button;
}

export interface LinkOptions {
  label: string;
  href: string;
  current?: boolean;
}

export function createLink(options: LinkOptions): HTMLAnchorElement {
  const link = document.createElement('a');
  link.className = 'dool-link';
  link.href = options.href;
  link.textContent = options.label;
  if (options.current) link.setAttribute('aria-current', 'page');
  return link;
}

export type SupportedInputType = 'text' | 'search' | 'date' | 'email';

export interface FieldOptions {
  id: string;
  label: string;
  type?: SupportedInputType;
  value?: string;
  error?: string;
  required?: boolean;
}

export interface FieldView<T extends HTMLInputElement | HTMLSelectElement> {
  root: HTMLDivElement;
  control: T;
}

function createFieldRoot(id: string, labelText: string): { root: HTMLDivElement; label: HTMLLabelElement } {
  const root = document.createElement('div');
  root.className = 'dool-field';

  const label = document.createElement('label');
  label.className = 'dool-field__label';
  label.htmlFor = id;
  label.textContent = labelText;
  root.append(label);

  return { root, label };
}

function appendError(
  root: HTMLDivElement,
  control: HTMLInputElement | HTMLSelectElement,
  id: string,
  error?: string,
): void {
  if (!error) return;
  const errorId = `${id}-error`;
  const message = document.createElement('p');
  message.id = errorId;
  message.className = 'dool-field__error';
  message.dataset.fieldError = 'true';
  message.textContent = error;
  control.setAttribute('aria-invalid', 'true');
  control.setAttribute('aria-describedby', errorId);
  root.append(message);
}

export function createField(options: FieldOptions): FieldView<HTMLInputElement> {
  const { root } = createFieldRoot(options.id, options.label);
  const control = document.createElement('input');
  control.className = 'dool-field__control';
  control.id = options.id;
  control.type = options.type ?? 'text';
  control.value = options.value ?? '';
  control.required = options.required ?? false;
  root.append(control);
  appendError(root, control, options.id, options.error);
  return { root, control };
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptions {
  id: string;
  label: string;
  options: SelectOption[];
  value?: string;
  error?: string;
  required?: boolean;
}

export function createSelect(options: SelectOptions): FieldView<HTMLSelectElement> {
  const { root } = createFieldRoot(options.id, options.label);
  const control = document.createElement('select');
  control.className = 'dool-field__control';
  control.id = options.id;
  control.required = options.required ?? false;

  for (const item of options.options) {
    const option = document.createElement('option');
    option.value = item.value;
    option.textContent = item.label;
    option.selected = options.value === item.value;
    control.append(option);
  }

  root.append(control);
  appendError(root, control, options.id, options.error);
  return { root, control };
}
