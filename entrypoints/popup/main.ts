import { browser } from 'wxt/browser';
import { loadSettings, saveSettings, type InterfaceMode } from '../../src/foundation/settings';
import { getExtensionVersion } from '../../src/foundation/version';

const enabledInput = document.querySelector<HTMLInputElement>('#global-enabled');
const modeSelect = document.querySelector<HTMLSelectElement>('#interface-mode');
const versionElement = document.querySelector<HTMLElement>('#version');

if (!enabledInput || !modeSelect || !versionElement) {
  throw new Error('Popup foundation controls are missing');
}

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
