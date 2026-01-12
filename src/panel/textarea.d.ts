/**
 * Type definitions for Kirby Textarea toolbar buttons.
 *
 * This module provides types for custom textarea toolbar buttons
 * that can be registered via `window.panel.plugin("name", { textareaButtons: { ... } })`.
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/textarea-buttons
 * @since 4.0.0
 */

// -----------------------------------------------------------------------------
// Textarea Toolbar Context
// -----------------------------------------------------------------------------

/**
 * The toolbar component context available as `this` in button click handlers.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Toolbar.vue
 */
export interface TextareaToolbarContext {
  /**
   * Emits a command to the textarea input component.
   *
   * Available commands:
   * - `"dialog"` - Opens a dialog component
   * - `"insert"` - Inserts the given text at the current selection
   * - `"prepend"` - Prepends the given text to the current selection/line
   * - `"toggle"` - Toggles wrapping of current selection (accepts before, after texts)
   * - `"upload"` - Opens the file upload dialog
   * - `"wrap"` - Wraps the current selection with the given text
   * - `"file"` - Opens the file picker
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
      | "dialog"
      | "insert"
      | "prepend"
      | "toggle"
      | "upload"
      | "wrap"
      | "file",
    ...args: any[]
  ) => void;

  /**
   * Closes all dropdowns.
   */
  close: () => void;

  /**
   * Vue translation function.
   */
  $t: (key: string, ...args: any[]) => string;
}

// -----------------------------------------------------------------------------
// Textarea Button
// -----------------------------------------------------------------------------

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
 * @see https://getkirby.com/docs/reference/plugins/extensions/textarea-buttons
 */
export interface TextareaButton {
  /**
   * Display label for the button (appears in tooltip).
   */
  label: string;

  /**
   * Icon name from Kirby's icon set.
   */
  icon: string;

  /**
   * Click handler.
   *
   * Called with `this` bound to the toolbar component, which provides:
   * - `this.command(name, ...args)` - Execute a textarea command
   *
   * Available commands:
   * - `dialog` - Opens a dialog component
   * - `insert` - Inserts text at the cursor (can be a function receiving input and selection)
   * - `prepend` - Prepends text to the current line
   * - `toggle` - Toggles wrapping of selection with before/after text
   * - `upload` - Opens the file upload dialog
   * - `wrap` - Wraps the selection with given text
   * - `file` - Opens the file picker
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
  click: (this: TextareaToolbarContext) => void;

  /**
   * Keyboard shortcut key (without modifier).
   *
   * Will be triggered with Cmd/Ctrl + the specified key.
   *
   * @example
   * ```js
   * shortcut: "b" // Cmd+B or Ctrl+B
   * ```
   */
  shortcut?: string;

  /**
   * Keyboard event handler for the button.
   *
   * Called when a key is pressed while the button is focused.
   * This is different from `shortcut`, which is triggered globally
   * with Cmd/Ctrl modifier.
   *
   * @param event - The native keyboard event
   */
  key?: (event: KeyboardEvent) => void;

  /**
   * Dropdown menu items.
   *
   * If provided, the button shows a dropdown instead of executing click directly.
   */
  dropdown?: TextareaDropdownItem[];

  /**
   * Conditional rendering. If false, the button won't be shown.
   */
  when?: boolean;

  /**
   * Disables the button.
   */
  disabled?: boolean;

  /**
   * Sets the aria-current attribute for active state styling.
   */
  current?: boolean | string;

  /**
   * Alternative tooltip text (defaults to label).
   */
  title?: string;

  /**
   * Custom CSS class for the button.
   */
  class?: string;
}

// -----------------------------------------------------------------------------
// Textarea Dropdown Item
// -----------------------------------------------------------------------------

/**
 * A dropdown menu item for textarea toolbar buttons.
 *
 * **Important:** Unlike the main button's `click` handler, dropdown item clicks
 * are NOT called with the toolbar context as `this`. The `this` context is
 * bound to the DropdownContent component which doesn't have `command()`.
 *
 * For this reason, dropdown items should use arrow functions and access
 * the toolbar's functionality through closures or other means.
 *
 * @example
 * ```js
 * // Built-in buttons use arrow functions to capture toolbar's `this`
 * dropdown: [
 *   {
 *     label: "Option 1",
 *     icon: "check",
 *     click: () => {
 *       // Access toolbar methods through closure
 *       toolbar.command("insert", "text");
 *     }
 *   }
 * ]
 * ```
 */
export interface TextareaDropdownItem {
  /** Display label */
  label: string;

  /** Icon name */
  icon?: string;

  /**
   * Click handler.
   *
   * Note: Unlike main button clicks, `this` is NOT bound to the toolbar context.
   * Use arrow functions and capture any needed references through closures.
   */
  click: () => void;

  /**
   * Conditional rendering. If false, the item won't be shown.
   */
  when?: boolean;

  /**
   * Disables the dropdown item.
   */
  disabled?: boolean;

  /**
   * Sets the aria-current attribute for active state styling.
   */
  current?: boolean | string;
}
