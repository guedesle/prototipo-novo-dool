import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { createShellViewModel, mountPrototypeShell } from '../../src/foundation/shell';

beforeEach(() => {
  const window = new Window({ url: 'https://dool.egba.ba.gov.br/' });
  vi.stubGlobal('document', window.document);
});

function mountShell() {
  const container = document.createElement('div');
  document.body.append(container);
  return {
    container,
    mounted: mountPrototypeShell(
      container,
      createShellViewModel('/', 'ACTIVE', '0.1.0'),
      { onOriginal: vi.fn() },
    ),
  };
}

describe('prototype shell accessibility', () => {
  it('provides a skip link that targets the single main landmark', () => {
    const { container } = mountShell();
    const main = container.querySelector('main');
    const skip = container.querySelector('a[href="#novo-dool-main"]');

    expect(container.querySelectorAll('main')).toHaveLength(1);
    expect(main?.id).toBe('novo-dool-main');
    expect(skip?.textContent).toBe('Ir para o conteúdo principal');
  });

  it('moves focus explicitly to main when the skip link is activated inside the isolated shell', () => {
    const { container } = mountShell();
    const main = container.querySelector<HTMLElement>('#novo-dool-main');
    const skip = container.querySelector<HTMLAnchorElement>('a[href="#novo-dool-main"]');
    expect(main).not.toBeNull();
    expect(skip).not.toBeNull();

    skip?.click();

    expect(document.activeElement).toBe(main);
  });

  it('exposes a labelled navigation landmark and coherent page heading', () => {
    const { container } = mountShell();

    expect(container.querySelector('nav[aria-label="Navegação da interface"]')).not.toBeNull();
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe('Nova camada de interface isolada');
  });

  it('keeps the interface-original action as an enabled native button', () => {
    const { container } = mountShell();
    const button = [...container.querySelectorAll('button')]
      .find((candidate) => candidate.textContent === 'Interface original');

    expect(button).toBeDefined();
    expect(button?.disabled).toBe(false);
  });

  it('does not introduce positive tabindex values', () => {
    const { container } = mountShell();
    const positive = [...container.querySelectorAll('[tabindex]')]
      .filter((element) => Number(element.getAttribute('tabindex')) > 0);

    expect(positive).toHaveLength(0);
  });
});
