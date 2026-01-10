/**
 * Type definitions for Kirby Textarea toolbar buttons.
 *
 * This module provides types for custom textarea toolbar buttons
 * that can be registered via `window.panel.plugin("name", { textareaButtons: { ... } })`.
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/textarea-buttons
 * @since 4.0.0
 */

// =============================================================================
// Textarea Toolbar Context
// =============================================================================

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

// =============================================================================
// Textarea Button
// =============================================================================

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
   * Dropdown menu items.
   *
   * If provided, the button shows a dropdown instead of executing click directly.
   */
  dropdown?: TextareaDropdownItem[];
}

// =============================================================================
// Textarea Dropdown Item
// =============================================================================

/**
 * A dropdown menu item for textarea toolbar buttons.
 *
 * @example
 * ```js
 * dropdown: [
 *   {
 *     label: "Option 1",
 *     icon: "check",
 *     click() {
 *       this.command("insert", "text");
 *     }
 *   }
 * ]
 * ```
 */
export interface TextareaDropdownItem {
  /** Display label */
  label: string;

  /** Icon name */
  icon: string;

  /**
   * Click handler. Called with `this` bound to the toolbar context.
   * Use a regular function (not arrow function) to access `this.command()`.
   */
  click: (this: TextareaToolbarContext) => void;
}
