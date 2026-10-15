/**
 * Opt-in globals for Panel plugins: types `window.panel` and the Panel's
 * global properties (`this.$panel`, `this.$t`, …) on every Vue component.
 *
 * @example
 * ```ts
 * import "kirby-types/panel-globals";
 * ```
 * @source panel/src/types/vue.d.ts
 * @source panel/src/types/global.d.ts
 */

import type { Panel, PanelGlobalProperties } from "./src/panel/index";

declare module "vue" {
  interface ComponentCustomProperties extends PanelGlobalProperties {}
}

declare global {
  interface Window {
    panel: Panel;
  }
}
