/**
 * Type definitions for Kirby Panel plugin extensions.
 *
 * This module provides types for custom Writer marks/nodes and Textarea
 * toolbar buttons that can be registered via `window.panel.plugins`.
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-marks
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-nodes
 */

import type { InputRule } from "prosemirror-inputrules";
import type {
  DOMOutputSpec,
  Fragment,
  Mark,
  MarkSpec,
  MarkType,
  NodeSpec,
  NodeType,
  Node as ProseMirrorNode,
  Schema,
} from "prosemirror-model";
import type {
  EditorState,
  Plugin,
  PluginSpec,
  Selection as ProseMirrorSelection,
} from "prosemirror-state";
import type {
  Decoration,
  DecorationSource,
  EditorView,
  NodeView,
} from "prosemirror-view";
import type { WriterMarkContext, WriterNodeContext } from "./writer";

// =============================================================================
// Writer Editor
// =============================================================================

/**
 * The Kirby Writer editor instance.
 *
 * This is the editor object that extensions can access via `this.editor`
 * when using class-based extensions, or that is passed to event handlers.
 */
export interface WriterEditor {
  /** Currently active mark names */
  activeMarks: string[];
  /** Currently active mark attributes by mark name */
  activeMarkAttrs: Record<string, Record<string, any>>;
  /** Currently active node names */
  activeNodes: string[];
  /** Currently active node attributes by node name */
  activeNodeAttrs: Record<string, Record<string, any>>;
  /** Available commands */
  commands: Record<string, (attrs?: any) => any>;
  /** Whether the editor is focused */
  focused: boolean;
  /** Check if a mark or node is active, returns functions that accept optional attrs */
  isActive: Record<string, (attrs?: Record<string, any>) => boolean>;
  /** ProseMirror marks registered in the schema */
  marks: Record<string, MarkType>;
  /** ProseMirror nodes registered in the schema */
  nodes: Record<string, NodeType>;
  /** Editor options */
  options: WriterEditorOptions;
  /** ProseMirror schema */
  schema: Schema;
  /** Current editor selection (ProseMirror Selection object) */
  selection: ProseMirrorSelection;
  /** Selection at the end of the document */
  selectionAtEnd: ProseMirrorSelection;
  /** Selection at the start of the document */
  selectionAtStart: ProseMirrorSelection;
  /** Whether the cursor is at the end of the document */
  selectionIsAtEnd: boolean;
  /** Whether the cursor is at the start of the document */
  selectionIsAtStart: boolean;
  /** ProseMirror editor state */
  state: EditorState;
  /** ProseMirror editor view */
  view: EditorView;

  /** Removes focus from the editor */
  blur: () => void;
  /** Get available toolbar buttons */
  buttons: (type: "mark" | "node") => Record<string, WriterToolbarButton>;
  /** Clears the editor content */
  clearContent: (emitUpdate?: boolean) => void;
  /** Executes a command by name */
  command: (command: string, ...args: any[]) => void;
  /** Destroys the editor instance */
  destroy: () => void;
  /** Emits an event */
  emit: (event: string, ...args: any[]) => void;
  /** Focuses the editor */
  focus: (position?: "start" | "end" | number | boolean | null) => void;
  /** Returns the current content as HTML */
  getHTML: () => string;
  /** Returns HTML content from start to current selection */
  getHTMLStartToSelection: () => string;
  /** Returns HTML content from current selection to end */
  getHTMLSelectionToEnd: () => string;
  /** Returns tuple of [HTML before selection, HTML after selection] */
  getHTMLStartToSelectionToEnd: () => [string, string];
  /** Returns the current content as JSON */
  getJSON: () => Record<string, any>;
  /** Returns attributes for a mark type */
  getMarkAttrs: (type: string) => Record<string, any>;
  /** Returns the schema as JSON */
  getSchemaJSON: () => {
    nodes: Record<string, any>;
    marks: Record<string, any>;
  };
  /** Inserts text at the current selection */
  insertText: (text: string, selected?: boolean) => void;
  /** Checks if the editor is editable */
  isEditable: () => boolean;
  /** Checks if the editor is empty */
  isEmpty: () => boolean;
  /** Removes a mark from the current selection */
  removeMark: (mark: string) => boolean;
  /** Sets the editor content */
  setContent: (content?: any, emitUpdate?: boolean, parseOptions?: any) => void;
  /** Sets the selection range */
  setSelection: (from?: number, to?: number) => void;
  /** Toggles a mark on the current selection */
  toggleMark: (mark: string) => boolean;
  /** Updates a mark's attributes */
  updateMark: (mark: string, attrs: Record<string, any>) => boolean;
}

/**
 * Editor initialization options.
 */
export interface WriterEditorOptions {
  autofocus?: boolean | "start" | "end";
  content?: string | Record<string, any>;
  disableInputRules?: boolean | string[];
  disablePasteRules?: boolean | string[];
  editable?: boolean;
  element?: HTMLElement | null;
  extensions?: any[];
  emptyDocument?: Record<string, any>;
  events?: Record<string, (...args: any[]) => any>;
  inline?: boolean;
  parseOptions?: Record<string, any>;
  topNode?: string;
  useBuiltInExtensions?: boolean;
}

// =============================================================================
// Writer Toolbar Button
// =============================================================================

/**
 * A toolbar button configuration for the Writer.
 *
 * Buttons appear in the Writer toolbar and trigger commands when clicked.
 */
export interface WriterToolbarButton {
  /** Unique identifier (defaults to extension name) */
  id?: string;
  /** Command name to execute */
  command?: string;
  /** Icon name from Kirby's icon set */
  icon: string;
  /** Display label (usually translated via `window.panel.$t()`) */
  label: string;
  /** Extension name this button belongs to */
  name?: string;
  /** Attributes to pass to the command */
  attrs?: Record<string, any>;
  /** Show separator line after this button */
  separator?: boolean;
  /** Node types when this button should be visible */
  when?: string[];
}

// =============================================================================
// ProseMirror Schema Types
// =============================================================================

/**
 * Mark schema specification for ProseMirror.
 *
 * @see https://prosemirror.net/docs/ref/#model.MarkSpec
 */
export interface WriterMarkSchema extends Omit<MarkSpec, "parseDOM" | "toDOM"> {
  /** Attribute definitions with defaults */
  attrs?: Record<
    string,
    {
      default?: any;
    }
  >;
  /** DOM parsing rules */
  parseDOM?: {
    tag?: string;
    style?: string;
    priority?: number;
    consuming?: boolean;
    context?: string;
    getAttrs?: (
      node: HTMLElement | string,
    ) => Record<string, any> | false | null;
  }[];
  /** DOM serialization */
  toDOM?: (mark: Mark) => DOMOutputSpec;
}

/**
 * Node schema specification for ProseMirror.
 *
 * @see https://prosemirror.net/docs/ref/#model.NodeSpec
 */
export interface WriterNodeSchema extends Omit<NodeSpec, "parseDOM" | "toDOM"> {
  /** Attribute definitions with defaults */
  attrs?: Record<
    string,
    {
      default?: any;
    }
  >;
  /** DOM parsing rules */
  parseDOM?: {
    tag?: string;
    priority?: number;
    consuming?: boolean;
    context?: string;
    attrs?: Record<string, any>;
    getAttrs?: (node: HTMLElement) => Record<string, any> | false | null;
    getContent?: (node: HTMLElement, schema: Schema) => Fragment;
    preserveWhitespace?: boolean | "full";
  }[];
  /** DOM serialization */
  toDOM?: (node: ProseMirrorNode) => DOMOutputSpec;
}

// =============================================================================
// Writer Mark Extension
// =============================================================================

/**
 * A custom Writer mark extension.
 *
 * Marks are inline formatting like bold, italic, links, etc.
 * They are registered via `window.panel.plugin("name", { writerMarks: { ... } })`.
 *
 * @example
 * ```js
 * window.panel.plugin("my-plugin", {
 *   writerMarks: {
 *     highlight: {
 *       get button() {
 *         return {
 *           icon: "highlight",
 *           label: "Highlight"
 *         };
 *       },
 *       commands({ type, utils }) {
 *         return () => utils.toggleMark(type);
 *       },
 *       get schema() {
 *         return {
 *           parseDOM: [{ tag: "mark" }],
 *           toDOM: () => ["mark", 0]
 *         };
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-marks
 */
export interface WriterMarkExtension {
  /**
   * Toolbar button configuration.
   *
   * Can be a single button or an array of buttons (e.g., for heading levels).
   */
  button?: WriterToolbarButton | WriterToolbarButton[];

  /**
   * Default options for the extension.
   *
   * These can be overridden when the extension is instantiated.
   */
  defaults?: Record<string, any>;

  /**
   * ProseMirror mark schema definition.
   *
   * Defines how the mark is parsed from and serialized to DOM.
   */
  schema?: WriterMarkSchema;

  /**
   * Commands provided by this extension.
   *
   * @param context - Context with schema, type, and utils
   * @returns A command function, or an object mapping command names to functions.
   *          Commands can return any value - ProseMirror commands return boolean,
   *          but custom commands may return void or emit events.
   *
   * @example
   * ```js
   * commands({ type, utils }) {
   *   return () => utils.toggleMark(type);
   * }
   * ```
   *
   * @example
   * ```js
   * commands({ type, utils }) {
   *   return {
   *     toggleHighlight: () => utils.toggleMark(type),
   *     removeHighlight: () => utils.removeMark(type)
   *   };
   * }
   * ```
   */
  commands?: (
    context: WriterMarkContext,
  ) => (() => any) | Record<string, (attrs?: any) => any>;

  /**
   * Input rules for automatic formatting.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror input rules
   *
   * @example
   * ```js
   * inputRules({ type, utils }) {
   *   return [
   *     utils.markInputRule(/\*\*([^*]+)\*\*$/, type)
   *   ];
   * }
   * ```
   */
  inputRules?: (context: WriterMarkContext) => InputRule[];

  /**
   * Keyboard shortcuts.
   *
   * @param context - Context with schema, type, and utils
   * @returns Object mapping key combinations to command functions
   *
   * @example
   * ```js
   * keys({ type, utils }) {
   *   return {
   *     "Mod-b": () => utils.toggleMark(type)
   *   };
   * }
   * ```
   */
  keys?: (context: WriterMarkContext) => Record<string, () => any>;

  /**
   * Paste rules for processing pasted content.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror plugins that handle paste
   *
   * @example
   * ```js
   * pasteRules({ type, utils }) {
   *   return [
   *     utils.markPasteRule(/\*\*([^*]+)\*\*​/g, type)
   *   ];
   * }
   * ```
   */
  pasteRules?: (context: WriterMarkContext) => Plugin[];

  /**
   * Additional ProseMirror plugins.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror plugins or plugin specs
   *
   * @example
   * ```js
   * plugins() {
   *   return [{
   *     props: {
   *       handleClick: (view, pos, event) => {
   *         // Handle click on this mark
   *       }
   *     }
   *   }];
   * }
   * ```
   */
  plugins?: (context: WriterMarkContext) => (Plugin | PluginSpec<any>)[];

  /**
   * Custom mark view for rendering.
   *
   * @see https://prosemirror.net/docs/ref/#view.MarkView
   */
  view?: (
    mark: Mark,
    view: EditorView,
    inline: boolean,
  ) => { dom: HTMLElement; contentDOM?: HTMLElement };
}

// =============================================================================
// Writer Node Extension
// =============================================================================

/**
 * A custom Writer node extension.
 *
 * Nodes are block-level or inline elements like headings, lists, images, etc.
 * They are registered via `window.panel.plugin("name", { writerNodes: { ... } })`.
 *
 * @example
 * ```js
 * window.panel.plugin("my-plugin", {
 *   writerNodes: {
 *     callout: {
 *       get button() {
 *         return {
 *           icon: "alert",
 *           label: "Callout"
 *         };
 *       },
 *       commands({ type, schema, utils }) {
 *         return () => utils.toggleWrap(type);
 *       },
 *       get schema() {
 *         return {
 *           content: "block+",
 *           group: "block",
 *           parseDOM: [{ tag: "div.callout" }],
 *           toDOM: () => ["div", { class: "callout" }, 0]
 *         };
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-nodes
 */
export interface WriterNodeExtension {
  /**
   * Toolbar button configuration.
   *
   * Can be a single button or an array of buttons.
   */
  button?: WriterToolbarButton | WriterToolbarButton[];

  /**
   * Default options for the extension.
   */
  defaults?: Record<string, any>;

  /**
   * ProseMirror node schema definition.
   */
  schema?: WriterNodeSchema;

  /**
   * Commands provided by this extension.
   *
   * @param context - Context with schema, type, and utils
   * @returns A command function, or an object mapping command names to functions.
   *          Commands can return any value - ProseMirror commands return boolean,
   *          but custom commands may return void or emit events.
   */
  commands?: (
    context: WriterNodeContext,
  ) => (() => any) | Record<string, (attrs?: any) => any>;

  /**
   * Input rules for automatic formatting.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror input rules
   */
  inputRules?: (context: WriterNodeContext) => InputRule[];

  /**
   * Keyboard shortcuts.
   *
   * @param context - Context with schema, type, and utils
   * @returns Object mapping key combinations to command functions
   */
  keys?: (context: WriterNodeContext) => Record<string, () => any>;

  /**
   * Paste rules for processing pasted content.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror plugins
   */
  pasteRules?: (context: WriterNodeContext) => Plugin[];

  /**
   * Additional ProseMirror plugins.
   *
   * @param context - Context with schema, type, and utils
   * @returns Array of ProseMirror plugins or plugin specs
   */
  plugins?: (context: WriterNodeContext) => (Plugin | PluginSpec<any>)[];

  /**
   * Custom node view for rendering.
   *
   * @see https://prosemirror.net/docs/ref/#view.NodeView
   */
  view?: (
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined,
    decorations: Decoration[],
    innerDecorations: DecorationSource,
  ) => NodeView;
}

// =============================================================================
// Textarea Toolbar Button
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

/**
 * The toolbar component context available as `this` in button click handlers.
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
