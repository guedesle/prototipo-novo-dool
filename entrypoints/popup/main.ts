import { browser } from 'wxt/browser';
import { loadSettings, saveSettings, type InterfaceMode } from '../../src/foundation/settings';
import { getExtensionVersion } from '../../src/foundation/version';

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Popup foundation control is missing: ${selector}`);
  }
  return element;
}

const enabledInput = requireElement<HTMLInputElement>('#global-enabled');
const modeSelect = requireElement<HTMLSelectElement>('#interface-mode');
const versionElement = requireElement<HTMLElement>('#version');

async function render(): Promise<void> {
  const settings = await loadSettings();
  enabledInput.checked = settings.globalEnabled;
  modeSelect.value = settings.interfaceMode;
  versionElement.textContent = `Versão ${getExtensionVersion(browser.runtime)}`;
}

enabledInput.addEventListener('change', async () => {
  await saveSettings({ globalEnabled: enabledInput.checked });
});

modeSelect.addEventListener('change', async () => {
  const interfaceMode: InterfaceMode = modeSelect.value === 'original' ? 'original' : 'new';
  await saveSettings({ interfaceMode });
});

void render();
