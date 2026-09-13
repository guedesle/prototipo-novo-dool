import '../src/foundation/dool.css';
import { browser } from 'wxt/browser';
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root';
import { bootstrapFoundation } from '../src/foundation/bootstrap';
import { DiagnosticRing } from '../src/foundation/diagnostics';
import { normalizeRoute, isSupportedRoute } from '../src/foundation/routes';
import { loadSettings, saveSettings } from '../src/foundation/settings';
import {
  SHELL_HOST_NAME,
  createShellViewModel,
  mountPrototypeShell,
  switchToOriginal,
} from '../src/foundation/shell';
import { getExtensionVersion } from '../src/foundation/version';

const diagnostics = new DiagnosticRing(50);

export default defineContentScript({
  matches: ['https://dool.egba.ba.gov.br/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const route = normalizeRoute(new URL(window.location.href));
    const routeSupported = isSupportedRoute(route);
    const settings = await loadSettings();
    const enabled = settings.globalEnabled
      && settings.interfaceMode === 'new'
      && settings.flags.foundationShell;
    const version = getExtensionVersion(browser.runtime);

    let removeOverlay: () => void = () => undefined;

    await bootstrapFoundation({
      routeSupported,
      enabled,
      alreadyMounted: document.querySelector(SHELL_HOST_NAME) !== null,
      route: route.pathname,
      version,
      mountShell: async () => {
        const ui = await createShadowRootUi(ctx, {
          name: SHELL_HOST_NAME,
          position: 'overlay',
          anchor: 'body',
          zIndex: 2147483647,
          isolateEvents: true,
          onMount(container) {
            return mountPrototypeShell(
              container,
              createShellViewModel(route.pathname, 'ACTIVE', version),
              {
                onOriginal: () => switchToOriginal({
                  persistOriginal: async () => {
                    await saveSettings({ interfaceMode: 'original' });
                  },
                  removeOverlay,
                }),
              },
            );
          },
          onRemove(mounted) {
            mounted?.destroy();
          },
        });

        removeOverlay = () => ui.remove();
        ui.mount();
        return 'active';
      },
      unmountShell: async () => {
        removeOverlay();
      },
      recordDiagnostic: (event) => {
        diagnostics.push(event);
      },
    });
  },
});
