import { afterEach, describe, expect, it } from 'vitest';
import { suspendLegacyDom } from '../../src/foundation/legacy-isolation';

afterEach(() => {
  document.body.replaceChildren();
});

describe('legacy DOM isolation', () => {
  it('visually and interactively suspends every body child except the prototype host', () => {
    const legacyHeader = document.createElement('header');
    const legacyMain = document.createElement('main');
    const prototypeHost = document.createElement('novo-dool-prototype');
    document.body.append(legacyHeader, legacyMain, prototypeHost);

    const restore = suspendLegacyDom(prototypeHost);

    for (const element of [legacyHeader, legacyMain]) {
      expect(element.inert).toBe(true);
      expect(element.getAttribute('aria-hidden')).toBe('true');
      expect(element.style.getPropertyValue('opacity')).toBe('0');
      expect(element.style.getPropertyPriority('opacity')).toBe('important');
      expect(element.style.getPropertyValue('visibility')).toBe('hidden');
      expect(element.style.getPropertyPriority('visibility')).toBe('important');
      expect(element.style.getPropertyValue('pointer-events')).toBe('none');
      expect(element.style.getPropertyPriority('pointer-events')).toBe('important');
    }

    expect(prototypeHost.inert).toBe(false);
    expect(prototypeHost.hasAttribute('aria-hidden')).toBe(false);
    expect(prototypeHost.style.opacity).toBe('');

    restore();
  });

  it('restores the exact prior accessibility and inline-style state', () => {
    const legacy = document.createElement('div');
    legacy.inert = true;
    legacy.setAttribute('aria-hidden', 'false');
    legacy.style.setProperty('opacity', '0.7', 'important');
    legacy.style.setProperty('visibility', 'visible');
    legacy.style.setProperty('pointer-events', 'auto', 'important');
    const prototypeHost = document.createElement('novo-dool-prototype');
    document.body.append(legacy, prototypeHost);

    const restore = suspendLegacyDom(prototypeHost);
    restore();

    expect(legacy.inert).toBe(true);
    expect(legacy.getAttribute('aria-hidden')).toBe('false');
    expect(legacy.style.getPropertyValue('opacity')).toBe('0.7');
    expect(legacy.style.getPropertyPriority('opacity')).toBe('important');
    expect(legacy.style.getPropertyValue('visibility')).toBe('visible');
    expect(legacy.style.getPropertyPriority('visibility')).toBe('');
    expect(legacy.style.getPropertyValue('pointer-events')).toBe('auto');
    expect(legacy.style.getPropertyPriority('pointer-events')).toBe('important');
  });

  it('is safe to restore more than once', () => {
    const legacy = document.createElement('div');
    const prototypeHost = document.createElement('novo-dool-prototype');
    document.body.append(legacy, prototypeHost);

    const restore = suspendLegacyDom(prototypeHost);
    expect(() => {
      restore();
      restore();
    }).not.toThrow();
    expect(legacy.inert).toBe(false);
    expect(legacy.hasAttribute('aria-hidden')).toBe(false);
  });
});
