/**
 * Type definitions for Kirby Textarea toolbar buttons.
 *
 * This module provides types for custom textarea toolbar buttons
 * that can be registered via `window.panel.plugin("name", { textareaButtons: { ... } })`.
 *
 * @since 4.0.0
 */

// #region Textarea Toolbar Context

/**
 * The toolbar component context available as `this` in button click handlers.
 *
 * @source panel/src/components/Forms/Toolbar/TextareaToolbar.vue
 * @source panel/src/components/Forms/Input/TextareaInput.vue
 */
export interface TextareaToolbarContext {
  /**
   * Emits a command to the textarea input component.
   *
   * Available commands:
   * - `"dialog"` - Opens the toolbar dialog of the given name, such as `"link"` or `"email"`.
   * - `"insert"` - Inserts the given text at the current selection.
   * - `"prepend"` - Prepends the given text to the current selection.
   * - `"toggle"` - Toggles wrapping of current selection (accepts `before`, `after` texts).
   * - `"upload"` - Opens the file upload dialog.
   * - `"wrap"` - Wraps the current selection with the given text.
   * - `"file"` - Opens the file picker.
   *
   * @param name - Command name
   * @param args - Command arguments
   *
   * @example
   * ```js
   * this.command("toggle", "**"); // Toggle bold
   * this.command("prepend", "# "); // Add heading
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

  /** Translates a Kirby translation key, with optional placeholder values. */
  $t: (key: string, ...args: any[]) => string;
}
// #endregion

// #region Textarea Button

/**
 * A custom textarea toolbar button.
 *
 * These buttons are registered via `window.panel.plugin("name", { textareaButtons: { ... } })`
 * and appear in the Kirby textarea field toolbar.
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
 */
export interface TextareaButton {
  /** Button label, shown as its tooltip. Falls back to `title` when unset. */
  label?: string;

  /**
   * Icon name from Kirby's icon set.
   *
   * Optional: the toolbar renders without a default icon, so label-only
   * buttons (no icon) are valid at runtime.
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
   * modifier is held. Matched against `KeyboardEvent.key`.
   *
   * @example
   * ```js
   * shortcut: "b" // Cmd+B or Ctrl+B
   * ```
   */
  shortcut?: string;

  /**
   * Handles `keydown` events while the button itself has focus.
   *
   * This differs from `shortcut`, which fires while the textarea has focus.
   *
   * @param event - The native keyboard event
   */
  key?: (event: KeyboardEvent) => void;

  /**
   * Dropdown menu items. A `"-"` entry renders a separator.
   *
   * If provided, clicking the button opens the dropdown instead of running
   * `click`. The `shortcut` still runs `click`.
   */
  dropdown?: (TextareaDropdownItem | "-")[];

  /** Visibility condition – the button is hidden when `false`. */
  when?: boolean;

  disabled?: boolean;

  /** Value of the `aria-current` attribute, for active-state styling. */
  current?: boolean | string;

  /**
   * Tooltip text used as a fallback when `label` is not set.
   *
   * @since 4.7.0
   */
  title?: string;

  /** Custom CSS class for the button. */
  class?: string;
}
// #endregion

// #region Textarea Dropdown Item

/**
 * A dropdown menu item for textarea toolbar buttons.
 *
 * **Important:** Unlike the main button's `click` handler, dropdown item clicks
 * are NOT called with the toolbar context as `this`. The `this` context is
 * the surrounding dropdown component, which does not expose `command()`.
 *
 * The built-in buttons reach the toolbar because their items are arrow
 * functions defined inside the toolbar component. A plugin's
 * `textareaButtons` entry is a static object with no toolbar reference to
 * close over. To react to an item elsewhere, use the `{ global, payload }`
 * click form (since 4.3.0), which emits an event on the global event bus.
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
 *
 * @source panel/src/components/Dropdowns/DropdownContent.vue
 */
export interface TextareaDropdownItem {
  /** Item label. Falls back to `text` when unset. */
  label?: string;

  text?: string;

  icon?: string;

  /**
   * Click action. The dropdown closes first, then:
   * - a callback runs with `this` bound to the dropdown component, not the
   *   toolbar
   * - a string is emitted as an `action` event on the dropdown, which the
   *   toolbar does not listen to
   * - since 4.3.0, an object emits `name` on the dropdown and `global` on
   *   the global event bus, each with `payload`.
   */
  click?:
    (() => void) | string | { name?: string; payload?: any; global?: string };

  /** Visibility condition – the item is hidden when `false`. */
  when?: boolean;

  disabled?: boolean;

  /** Value of the `aria-current` attribute, for active-state styling. */
  current?: boolean | string;
}
// #endregion
