import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { createButton, createField, createLink, createSelect } from '../../src/ui/elements';

beforeEach(() => {
  const window = new Window();
  vi.stubGlobal('document', window.document);
});

describe('semantic UI elements', () => {
  it('creates a native button with a safe default type and accessible text', () => {
    const button = createButton({ label: 'Tentar novamente' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.type).toBe('button');
    expect(button.textContent).toBe('Tentar novamente');
  });

  it('creates a native link instead of a clickable generic element', () => {
    const link = createLink({ label: 'Abrir edição', href: '/ver-html/22535/' });

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/ver-html/22535/');
    expect(link.textContent).toBe('Abrir edição');
  });

  it('associates an input label and error message programmatically', () => {
    const field = createField({
      id: 'consulta',
      label: 'Buscar no Diário Oficial',
      type: 'search',
      error: 'Informe uma palavra para pesquisar.',
    });

    const label = field.root.querySelector('label');
    const error = field.root.querySelector('[data-field-error]');

    expect(label?.getAttribute('for')).toBe('consulta');
    expect(field.control.id).toBe('consulta');
    expect(field.control.type).toBe('search');
    expect(field.control.getAttribute('aria-invalid')).toBe('true');
    expect(field.control.getAttribute('aria-describedby')).toBe('consulta-error');
    expect(error?.id).toBe('consulta-error');
    expect(error?.textContent).toBe('Informe uma palavra para pesquisar.');
  });

  it('supports native date input without replacing browser semantics', () => {
    const field = createField({ id: 'data-edicao', label: 'Data da edição', type: 'date' });
    expect(field.control.type).toBe('date');
  });

  it('creates a labelled native select with explicit options', () => {
    const field = createSelect({
      id: 'tipo-edicao',
      label: 'Tipo de edição',
      options: [
        { value: 'principal', label: 'Principal' },
        { value: 'suplemento', label: 'Suplemento' },
      ],
    });

    expect(field.control.tagName).toBe('SELECT');
    expect(field.root.querySelector('label')?.getAttribute('for')).toBe('tipo-edicao');
    expect([...field.control.options].map((option) => option.textContent)).toEqual(['Principal', 'Suplemento']);
  });
});
