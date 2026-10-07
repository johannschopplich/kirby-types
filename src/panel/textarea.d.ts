/**
 * Types for custom textarea toolbar buttons.
 */

import type { PanelApp, PanelDropdownOption } from "./index";

// #region Textarea Toolbar Context

/**
 * The toolbar component context available as `this` in button click handlers.
 * The Panel's global properties, such as `$panel` and `$helper`, are available too.
 *
 * @source panel/src/components/Forms/Toolbar/TextareaToolbar.vue
 * @source panel/src/components/Forms/Input/TextareaInput.vue
 */
export interface TextareaToolbarContext extends PanelApp {
  /**
   * Emits a command to the textarea input component:
   * - `"dialog"`: Opens the toolbar dialog of the given name, such as `"link"` or `"email"`.
   * - `"insert"`: Replaces the current selection with the given text, or with the return value of an `(input, selection)` callback.
   * - `"prepend"`: Prepends the given text and a space to the current selection.
   * - `"toggle"`: Toggles wrapping of the current selection in the given `before` text and the optional `after` text, which defaults to `before`.
   * - `"upload"`: Opens the native file picker and the upload dialog, then inserts the uploaded file's tag.
   * - `"wrap"`: Wraps the current selection in the given `before` text and the optional `after` text, which defaults to `before`.
   * - `"file"`: Opens a dialog to select an existing file and inserts its tag.
   *
   * @example
   * ```js
   * this.command("toggle", "**"); // Toggle bold
   * this.command("prepend", "#"); // Add heading
   * this.command("dialog", "link"); // Open link dialog
   * this.command("insert", (input, selection) => selection.toUpperCase());
   * ```
   */
  command: (
    name:
      "dialog" | "insert" | "prepend" | "toggle" | "upload" | "wrap" | "file",
    ...args: any[]
  ) => void;

  /** Closes all dropdowns. */
  close: () => void;

  /**
   * Button names from the field's `buttons` option, or `true` for the
   * default toolbar. A `"|"` entry renders a separator.
   */
  buttons: string[] | true;

  /**
   * Upload options from the field's `uploads` option, or `false` when
   * uploads are disabled. The built-in file button offers its select and
   * upload dropdown only when `uploads` is not `false`.
   */
  uploads: false | Record<string, any>;
}
// #endregion

// #region Textarea Button

/**
 * Custom textarea toolbar button, registered under `textareaButtons` in
 * `window.panel.plugin()`. A button appears only in textarea fields whose
 * `buttons` option lists its name – the default toolbar shows the built-in
 * buttons alone. A registered name that matches a built-in button replaces
 * it.
 *
 * @example
 * ```js
 * window.panel.plugin("my-plugin", {
 *   textareaButtons: {
 *     timestamp: {
 *       label: "Insert Timestamp",
 *       icon: "clock",
 *       click() {
 *         // `this` is the toolbar component with `command()` method
 *         this.command("insert", () => new Date().toISOString());
 *       },
 *       shortcut: "t"
 *     }
 *   }
 * });
 * ```
 *
 * @source panel/src/components/Forms/Toolbar/TextareaToolbar.vue
 * @source panel/src/components/Forms/Toolbar/Toolbar.vue
 * @source panel/src/components/Navigation/Button.vue
 */
export interface TextareaButton {
  /** Button label, shown as its tooltip. Falls back to `title` when unset. */
  label?: string;

  /**
   * Icon name from Kirby's icon set.
   *
   * The toolbar shows no button text, so a button without an icon renders
   * empty, with its `label` only as the tooltip.
   */
  icon?: string;

  /**
   * Runs when the button is clicked or its `shortcut` is pressed. `this` is bound to the toolbar component (see {@link TextareaToolbarContext}), so `this.command(...)` is available.
   *
   * @example
   * ```js
   * click() {
   *   this.command("toggle", "**"); // Toggle bold
   * }
   * ```
   *
   * @example
   * ```js
   * click() {
   *   this.command("insert", (input, selection) => {
   *     return selection.toUpperCase();
   *   });
   * }
   * ```
   */
  click?: (this: TextareaToolbarContext) => void;

  /**
   * Keyboard shortcut key (without modifier).
   *
   * Fires with Cmd/Ctrl + the key while the textarea has focus and no other
   * modifier is held. Matched against `KeyboardEvent.key`. Still runs `click`
   * when `when` hides the button or `disabled` is set.
   *
   * @example
   * ```js
   * shortcut: "b" // Cmd+B or Ctrl+B
   * ```
   */
  shortcut?: string;

  /**
   * Handles `keydown` events while the button itself has focus, unlike
   * `shortcut`, which fires while the textarea has focus.
   */
  key?: (event: KeyboardEvent) => void;

  /**
   * Dropdown menu items. A `"-"` entry renders a separator.
   *
   * If non-empty, clicking the button opens the dropdown instead of running
   * `click`. The `shortcut` still runs `click`.
   *
   * An item's `click` callback gets the dropdown component as `this`, not
   * the toolbar, and a `textareaButtons` entry is a static object with no
   * toolbar to close over, so `command()` is out of reach. To react to an
   * item elsewhere, use the `{ global, payload }` click form, which emits an
   * event on the global event bus.
   *
   * @example
   * ```js
   * dropdown: [
   *   {
   *     label: "Notify",
   *     icon: "bell",
   *     click: { global: "my-plugin:notify", payload: { level: 1 } }
   *   },
   *   "-",
   *   {
   *     label: "Log",
   *     icon: "code",
   *     click: () => console.log("clicked")
   *   }
   * ]
   * ```
   */
  dropdown?: (PanelDropdownOption | "-")[];

  /** Visibility condition – the button is hidden when `false`. */
  when?: boolean;

  disabled?: boolean;

  /** Value of the `aria-current` attribute; `true` marks the button as active. */
  current?: boolean | string;

  /** Tooltip text used as a fallback when `label` is not set. */
  title?: string;

  class?: string;
}
// #endregion
