import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { createStatusView } from '../../src/ui/states';

beforeEach(() => {
  const window = new Window();
  vi.stubGlobal('document', window.document);
});

describe('universal UI states', () => {
  it('announces loading politely without requiring animation', () => {
    const view = createStatusView({
      state: 'loading',
      title: 'Carregando edições',
      message: 'Consultando o Diário Oficial.',
    });

    expect(view.dataset.uiState).toBe('loading');
    expect(view.getAttribute('role')).toBe('status');
    expect(view.getAttribute('aria-live')).toBe('polite');
    expect(view.textContent).toContain('Carregando edições');
  });

  it('keeps an empty state static when no announcement is needed', () => {
    const view = createStatusView({
      state: 'empty',
      title: 'Nenhuma publicação encontrada',
      message: 'Ajuste os filtros e tente novamente.',
    });

    expect(view.dataset.uiState).toBe('empty');
    expect(view.hasAttribute('aria-live')).toBe(false);
  });

  it('offers a native recovery action for recoverable errors', () => {
    const onRecover = vi.fn();
    const view = createStatusView({
      state: 'error',
      title: 'Não foi possível carregar',
      message: 'Verifique sua conexão e tente novamente.',
      recovery: { label: 'Tentar novamente', onActivate: onRecover },
    });

    const button = view.querySelector('button');
    expect(button?.textContent).toBe('Tentar novamente');
    button?.click();
    expect(onRecover).toHaveBeenCalledOnce();
  });

  it('renders success as content, not color alone', () => {
    const view = createStatusView({
      state: 'success',
      title: 'Edição carregada',
      message: 'O conteúdo está disponível para leitura.',
    });

    expect(view.dataset.uiState).toBe('success');
    expect(view.textContent).toContain('Edição carregada');
    expect(view.textContent).toContain('O conteúdo está disponível para leitura.');
  });
});
