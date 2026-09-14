type StyleProperty = 'opacity' | 'visibility' | 'pointer-events';

interface StyleSnapshot {
  value: string;
  priority: string;
}

interface LegacyElementSnapshot {
  element: HTMLElement;
  inert: boolean;
  ariaHidden: string | null;
  styles: Record<StyleProperty, StyleSnapshot>;
}

const STYLE_PROPERTIES: readonly StyleProperty[] = [
  'opacity',
  'visibility',
  'pointer-events',
];

function captureStyle(element: HTMLElement, property: StyleProperty): StyleSnapshot {
  return {
    value: element.style.getPropertyValue(property),
    priority: element.style.getPropertyPriority(property),
  };
}

function restoreStyle(
  element: HTMLElement,
  property: StyleProperty,
  snapshot: StyleSnapshot,
): void {
  if (snapshot.value === '') {
    element.style.removeProperty(property);
    return;
  }
  element.style.setProperty(property, snapshot.value, snapshot.priority);
}

function restoreSnapshot(snapshot: LegacyElementSnapshot): void {
  const { element } = snapshot;
  element.inert = snapshot.inert;

  if (snapshot.ariaHidden === null) {
    element.removeAttribute('aria-hidden');
  } else {
    element.setAttribute('aria-hidden', snapshot.ariaHidden);
  }

  for (const property of STYLE_PROPERTIES) {
    restoreStyle(element, property, snapshot.styles[property]);
  }
}

/**
 * Temporarily suspends the legacy DOOL DOM while the isolated prototype UI is active.
 *
 * The WXT shadow host is mounted first and excluded from suspension. Every sibling
 * is then made visually transparent/hidden and interaction-inert without changing
 * layout. The returned restore function is idempotent and restores the exact prior
 * inline/accessibility state.
 */
export function suspendLegacyDom(prototypeHost: HTMLElement): () => void {
  const parent = prototypeHost.parentElement;
  if (!parent) {
    throw new Error('Prototype host must be mounted before legacy DOM suspension');
  }

  const snapshots: LegacyElementSnapshot[] = Array.from(parent.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement && child !== prototypeHost)
    .map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden'),
      styles: {
        opacity: captureStyle(element, 'opacity'),
        visibility: captureStyle(element, 'visibility'),
        'pointer-events': captureStyle(element, 'pointer-events'),
      },
    }));

  let restored = false;
  const restore = () => {
    if (restored) return;
    restored = true;
    for (const snapshot of snapshots) {
      restoreSnapshot(snapshot);
    }
  };

  try {
    for (const { element } of snapshots) {
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
    }
  } catch (error) {
    restore();
    throw error;
  }

  return restore;
}
