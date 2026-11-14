/**
 * Types for custom textarea toolbar buttons.
 */

import type { KirbyFieldUploads } from "../blueprint.js";
import type { PanelDropdownOption, PanelGlobalProperties } from "./index.js";

// #region Textarea Toolbar Context

/**
 * The toolbar component context available as `this` in button click handlers.
 * The Panel's global properties, such as `$panel` and `$helper`, are available too.
 *
 * @unstable
 *
 * @source panel/src/components/Forms/Toolbar/TextareaToolbar.vue
 * @source panel/src/components/Forms/Toolbar/Toolbar.vue
 * @source panel/src/components/Forms/Toolbar/index.ts
 * @source panel/src/components/Forms/Input/TextareaInput.vue
 * @source src/Form/Field/TextareaField.php
 * @source src/Form/Mixin/Upload.php
 */
export interface TextareaToolbarContext extends PanelGlobalProperties {
  /**
   * Runs a command on the textarea:
   * - `"dialog"`: Opens the toolbar dialog of the given name, such as `"link"`, `"email"`, or a plugin's `k-toolbar-<name>-dialog`. The dialog gets the selection as its `value` prop, `{ href, title }` – `href` is `null` unless the selection is a link – and the text it emits with `submit` replaces the selection.
   * - `"insert"`: Replaces the current selection with the given text, or with the return value of an `(input, selection)` callback.
   * - `"prepend"`: Prepends the given text and a space to the current selection.
   * - `"toggle"`: Toggles wrapping of the current selection in the given `before` text and the optional `after` text, `before` when omitted.
   * - `"upload"`: Opens the native file picker and the upload dialog, then inserts the uploaded file's tag. The upload fails when `uploads` is `false`.
   * - `"wrap"`: Wraps the current selection in the given `before` text and the optional `after` text, `before` when omitted.
   * - `"file"`: Opens a dialog to select existing files and inserts their tags.
   *
   * @example
   * ```js
   * this.command("toggle", "**"); // Toggle bold
   * this.command("prepend", "#"); // Add heading
   * this.command("dialog", "link"); // Open link dialog
   * this.command("insert", (input, selection) => selection.toUpperCase());
   * ```
   */
  command: {
    (name: "dialog", dialog: string): void;
    (
      name: "insert",
      text:
        string | ((input: HTMLTextAreaElement, selection: string) => string),
    ): void;
    (name: "prepend", text: string): void;
    (name: "toggle" | "wrap", before: string, after?: string): void;
    (name: "upload" | "file"): void;
    (name: string, ...args: any[]): void;
  };

  /** Closes all dropdowns. */
  close: () => void;

  /**
   * Runs the `click` of the first button whose `shortcut` is the given key
   * and calls `preventDefault()` on the event; does nothing without a match.
   */
  shortcut: (shortcut: string, event: KeyboardEvent) => void;

  /**
   * Button names from the field's `buttons` option, or `true` for the
   * default toolbar. A `"|"` entry renders a separator.
   */
  buttons: string[] | true;

  /** Button names of the default toolbar, used when `buttons` is `true`. */
  default: string[];

  /**
   * Built-in buttons by name, such as `bold` or `link`. A plugin button
   * that replaces a built-in one can still run the original through
   * `this.commands.<name>.click()`.
   */
  commands: Record<string, any>;

  /**
   * Upload options from the field's `uploads` option, or `false` when
   * uploads are disabled. The built-in file button offers its select and
   * upload dropdown only when `uploads` is not `false`.
   */
  uploads: false | KirbyFieldUploads;
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
 * @source panel/src/components/Dropdowns/Dropdown.vue
 * @source panel/src/components/Navigation/Button.vue
 * @source panel/src/components/Navigation/Link.vue
 * @source panel/src/components/Forms/Input/TextareaInput.vue
 */
export interface TextareaButton {
  /** Button label, shown as its tooltip. */
  label?: string;

  /**
   * The toolbar shows no button text, so a button without an icon renders
   * empty, with its `label` only as the tooltip.
   */
  icon?: string;

  /**
   * Runs when the button is clicked or its `shortcut` is pressed.
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
   * modifier is held. Matched against `KeyboardEvent.key`. When several
   * listed buttons share a key, only the first in toolbar order runs.
   *
   * @example
   * ```js
   * shortcut: "b" // Cmd+B or Ctrl+B
   * ```
   */
  shortcut?: string;

  /**
   * Runs on `keydown` while the toolbar button itself has focus. `this` is
   * the button object, not the toolbar, so `command()` is out of reach.
   */
  key?: (event: KeyboardEvent) => void;

  /**
   * Dropdown menu items. A `"-"` entry renders a separator.
   *
   * If non-empty, clicking the button opens the dropdown instead of running
   * `click`. The `shortcut` still runs `click`.
   *
   * An item's `click` cannot reach `command()`: neither its `this` nor a
   * `textareaButtons` entry has the toolbar. To react to an item elsewhere,
   * use the `{ global, payload }` click form.
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

  class?: string | any[] | Record<string, any>;
}
// #endregion
