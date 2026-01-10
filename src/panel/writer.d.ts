/**
 * Type definitions for Kirby Writer (ProseMirror-based rich text editor).
 *
 * This module provides types for the Writer component, including:
 * - Editor instance and options
 * - Mark and node extensions for plugins
 * - Utility functions and contexts
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-marks-nodes
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer
 * @since 4.0.0
 */

import type { InputRule } from "prosemirror-inputrules";
import type {
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
  Command,
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

// =============================================================================
// Writer Editor
// =============================================================================

/**
 * The Kirby Writer editor instance.
 *
 * This is the editor object that extensions can access via `this.editor`
 * when using class-based extensions, or that is passed to event handlers.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Editor.js
 */
export interface WriterEditor {
  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

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
  /** The DOM element the editor is mounted to */
  element: HTMLElement | null;
  /** Registered event handlers */
  events: Record<string, (...args: any[]) => any>;
  /** The extensions manager instance */
  extensions: WriterExtensions;
  /** Whether the editor is focused */
  focused: boolean;
  /** Active input rules */
  inputRules: InputRule[];
  /** Check if a mark or node is active */
  isActive: Record<string, (attrs?: Record<string, any>) => boolean>;
  /** Keymap plugins */
  keymaps: Plugin[];
  /**
   * Raw mark schema definitions.
   *
   * For ProseMirror MarkType instances, use `schema.marks` instead.
   */
  marks: Record<string, MarkSpec>;
  /**
   * Raw node schema definitions.
   *
   * For ProseMirror NodeType instances, use `schema.nodes` instead.
   */
  nodes: Record<string, NodeSpec>;
  /** Editor options */
  options: WriterEditorOptions;
  /** Paste rule plugins */
  pasteRules: Plugin[];
  /** Custom ProseMirror plugins */
  plugins: Plugin[];
  /** ProseMirror schema */
  schema: Schema;
  /** Current editor selection */
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

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------

  /** Removes focus from the editor */
  blur: () => void;
  /** Returns available toolbar buttons for the given type */
  buttons: (type: "mark" | "node") => Record<string, WriterToolbarButton>;
  /** Clears the editor content */
  clearContent: (emitUpdate?: boolean) => void;
  /** Executes a command by name */
  command: (command: string, ...args: any[]) => void;
  /**
   * Creates a ProseMirror document from content.
   *
   * @param content - HTML string, JSON object, or null for empty document
   * @param parseOptions - Optional ProseMirror parse options
   * @returns The created document node, or false if content type is unsupported
   */
  createDocument: (
    content: string | Record<string, any> | null,
    parseOptions?: Record<string, any>,
  ) => ProseMirrorNode | false;
  /** Destroys the editor instance */
  destroy: () => void;
  /** Emits an event to all registered listeners */
  emit: (event: string, ...args: any[]) => this;
  /** Focuses the editor at the given position */
  focus: (position?: "start" | "end" | number | boolean | null) => void;
  /**
   * Returns content as HTML.
   *
   * @param fragment - Optional fragment to serialize (defaults to full document)
   */
  getHTML: (fragment?: Fragment) => string;
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
  isEmpty: () => boolean | undefined;
  /**
   * Unsubscribes from events.
   *
   * @param event - Event name (omit to remove all listeners)
   * @param fn - Specific handler to remove (omit to remove all for event)
   */
  off: (event?: string, fn?: (...args: any[]) => any) => this;
  /**
   * Subscribes to an event.
   *
   * @param event - Event name (e.g., "update", "focus", "blur", "transaction")
   * @param fn - Event handler function
   */
  on: (event: string, fn: (...args: any[]) => any) => this;
  /** Removes a mark from the current selection */
  removeMark: (mark: string) => boolean | undefined;
  /**
   * Returns selection at the given position.
   *
   * @param position - Position indicator or numeric position
   */
  selectionAtPosition: (
    position?: "start" | "end" | number | boolean | null,
  ) => ProseMirrorSelection | { from: number; to: number };
  /** Sets the editor content */
  setContent: (content?: any, emitUpdate?: boolean, parseOptions?: any) => void;
  /** Sets the selection range */
  setSelection: (from?: number, to?: number) => void;
  /** Toggles a mark on the current selection */
  toggleMark: (mark: string) => boolean | undefined;
  /** Updates a mark's attributes */
  updateMark: (mark: string, attrs: Record<string, any>) => boolean | undefined;
}

/**
 * Editor initialization options.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Editor.js
 */
export interface WriterEditorOptions {
  autofocus?: boolean | "start" | "end" | number;
  content?: string | Record<string, any> | null;
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

/**
 * The extensions manager for the Writer editor.
 *
 * Manages all registered mark, node, and generic extensions.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterExtensions {
  /** All registered extension instances */
  extensions: (WriterExtension | WriterMarkExtension | WriterNodeExtension)[];
  /** ProseMirror EditorView (set after editor initialization) */
  view: EditorView;

  /** Returns toolbar buttons for the given type */
  buttons: (type: "mark" | "node") => Record<string, WriterToolbarButton>;
  /** Raw mark schema definitions from all mark extensions */
  marks: Record<string, MarkSpec>;
  /** Mark view constructors */
  markViews: Record<string, WriterMarkExtension["view"]>;
  /** Raw node schema definitions from all node extensions */
  nodes: Record<string, NodeSpec>;
  /** Node view constructors */
  nodeViews: Record<string, WriterNodeExtension["view"]>;
  /** Extension options with reactive proxy */
  options: Record<string, Record<string, any>>;
}

// =============================================================================
// Writer Toolbar
// =============================================================================

/**
 * A toolbar button configuration for the Writer.
 *
 * Buttons appear in the Writer toolbar and trigger commands when clicked.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Toolbar.vue
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
  /** Whether this is an inline node button (shown inline, not in dropdown) */
  inline?: boolean;
  /** Node types when this button should be visible */
  when?: string[];
}

// =============================================================================
// Writer Utilities
// =============================================================================

/**
 * Kirby Writer utility functions.
 *
 * A collection of ProseMirror commands and custom helpers for working
 * with marks, nodes, and editor state. These utilities are passed to
 * extension methods via the context object.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer/Utils
 */
export interface WriterUtils {
  // ---------------------------------------------------------------------------
  // ProseMirror Commands
  // ---------------------------------------------------------------------------

  /** Chains multiple commands, executing until one returns true */
  chainCommands: typeof import("prosemirror-commands").chainCommands;
  /** Exits a code block at the cursor position */
  exitCode: typeof import("prosemirror-commands").exitCode;
  /** Lifts content out of its wrapping node */
  lift: typeof import("prosemirror-commands").lift;
  /** Sets the block type at the cursor position */
  setBlockType: typeof import("prosemirror-commands").setBlockType;
  /** Toggles a mark on the current selection */
  toggleMark: typeof import("prosemirror-commands").toggleMark;
  /** Wraps the selection in a node type */
  wrapIn: typeof import("prosemirror-commands").wrapIn;

  // ---------------------------------------------------------------------------
  // ProseMirror Input Rules
  // ---------------------------------------------------------------------------

  /** Creates an input rule that wraps matching text in a node */
  wrappingInputRule: typeof import("prosemirror-inputrules").wrappingInputRule;
  /** Creates an input rule that changes the textblock type */
  textblockTypeInputRule: typeof import("prosemirror-inputrules").textblockTypeInputRule;

  // ---------------------------------------------------------------------------
  // ProseMirror Schema List
  // ---------------------------------------------------------------------------

  /** Adds list nodes to a schema */
  addListNodes: typeof import("prosemirror-schema-list").addListNodes;
  /** Wraps selection in a list */
  wrapInList: typeof import("prosemirror-schema-list").wrapInList;
  /** Splits a list item at the cursor */
  splitListItem: typeof import("prosemirror-schema-list").splitListItem;
  /** Lifts a list item out of its parent list */
  liftListItem: typeof import("prosemirror-schema-list").liftListItem;
  /** Sinks a list item into a nested list */
  sinkListItem: typeof import("prosemirror-schema-list").sinkListItem;

  // ---------------------------------------------------------------------------
  // Custom Utilities
  // ---------------------------------------------------------------------------

  /**
   * Gets the attributes of the active mark of the given type.
   *
   * @param state - The current editor state
   * @param type - The mark type to get attributes for
   * @returns The mark attributes or an empty object
   */
  getMarkAttrs: (state: EditorState, type: MarkType) => Record<string, any>;

  /**
   * Gets the attributes of the active node of the given type.
   *
   * @param state - The current editor state
   * @param type - The node type to get attributes for
   * @returns The node attributes or an empty object
   */
  getNodeAttrs: (state: EditorState, type: NodeType) => Record<string, any>;

  /**
   * Creates a command that inserts a node of the given type.
   *
   * @param type - The node type to insert
   * @param attrs - Optional attributes for the node
   * @returns A ProseMirror command
   */
  insertNode: (type: NodeType, attrs?: Record<string, any>) => Command;

  /**
   * Creates an input rule that applies a mark when the pattern matches.
   *
   * @param regexp - The pattern to match
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the match
   * @returns An input rule
   */
  markInputRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (match: RegExpMatchArray) => Record<string, any>,
  ) => InputRule;

  /**
   * Checks if a mark of the given type is active in the current selection.
   *
   * @param state - The current editor state
   * @param type - The mark type to check
   * @returns True if the mark is active
   */
  markIsActive: (state: EditorState, type: MarkType) => boolean;

  /**
   * Creates a paste rule that applies a mark to pasted text matching the pattern.
   *
   * @param regexp - The pattern to match
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the match
   * @returns A ProseMirror plugin
   */
  markPasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (match: string) => Record<string, any>,
  ) => Plugin;

  /**
   * Clamps a value between a minimum and maximum.
   *
   * @param value - The value to clamp
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns The clamped value
   */
  minMax: (value: number, min: number, max: number) => number;

  /**
   * Creates an input rule that inserts a node when the pattern matches.
   *
   * @param regexp - The pattern to match
   * @param type - The node type to insert
   * @param getAttrs - Optional function to compute node attributes from the match
   * @returns An input rule
   */
  nodeInputRule: (
    regexp: RegExp,
    type: NodeType,
    getAttrs?: (match: RegExpMatchArray) => Record<string, any>,
  ) => InputRule;

  /**
   * Checks if a node of the given type is active in the current selection.
   *
   * @param state - The current editor state
   * @param type - The node type to check
   * @param attrs - Optional attributes to match
   * @returns True if the node is active
   */
  nodeIsActive: (
    state: EditorState,
    type: NodeType,
    attrs?: Record<string, any>,
  ) => boolean;

  /**
   * Creates a paste rule that applies a mark to pasted URLs matching the pattern.
   *
   * @param regexp - The pattern to match URLs
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the URL
   * @returns A ProseMirror plugin
   */
  pasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (url: string) => Record<string, any>,
  ) => Plugin;

  /**
   * Creates a command that removes a mark from the current selection.
   *
   * @param type - The mark type to remove
   * @returns A ProseMirror command
   */
  removeMark: (type: MarkType) => Command;

  /**
   * Creates a command that toggles between two block types.
   *
   * @param type - The block type to toggle to
   * @param toggleType - The block type to toggle back to (usually paragraph)
   * @param attrs - Optional attributes for the node
   * @returns A ProseMirror command
   */
  toggleBlockType: (
    type: NodeType,
    toggleType: NodeType,
    attrs?: Record<string, any>,
  ) => Command;

  /**
   * Creates a command that toggles a list.
   *
   * @param type - The list type to toggle
   * @param itemType - The list item type
   * @returns A ProseMirror command
   */
  toggleList: (type: NodeType, itemType: NodeType) => Command;

  /**
   * Creates a command that toggles wrapping the selection in a node.
   *
   * @param type - The node type to wrap in
   * @returns A ProseMirror command
   */
  toggleWrap: (type: NodeType) => Command;

  /**
   * Creates a command that updates the attributes of the active mark.
   *
   * @param type - The mark type to update
   * @param attrs - The new attributes
   * @returns A ProseMirror command
   */
  updateMark: (type: MarkType, attrs: Record<string, any>) => Command;
}

// =============================================================================
// Writer Contexts
// =============================================================================

/**
 * Context passed to mark extension methods.
 *
 * The context provides access to the ProseMirror schema, the current mark's
 * type, and utility functions for working with the editor. This is passed
 * to methods like `commands`, `keys`, `inputRules`, `pasteRules`, and `plugins`.
 *
 * @example
 * ```js
 * export default class Bold extends Mark {
 *   commands({ type, utils }) {
 *     return () => utils.toggleMark(type);
 *   }
 *
 *   inputRules({ type, utils }) {
 *     return [
 *       utils.markInputRule(/\*\*([^*]+)\*\*$/, type)
 *     ];
 *   }
 * }
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterMarkContext {
  /** The ProseMirror schema with all registered nodes and marks */
  schema: Schema;
  /** The MarkType instance for this mark extension */
  type: MarkType;
  /** Writer utility functions */
  utils: WriterUtils;
}

/**
 * Context passed to node extension methods.
 *
 * Similar to WriterMarkContext but provides a NodeType instead of MarkType.
 *
 * @example
 * ```js
 * export default class Heading extends Node {
 *   commands({ type, schema, utils }) {
 *     return (attrs) => utils.toggleBlockType(type, schema.nodes.paragraph, attrs);
 *   }
 * }
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterNodeContext {
  /** The ProseMirror schema with all registered nodes and marks */
  schema: Schema;
  /** The NodeType instance for this node extension */
  type: NodeType;
  /** Writer utility functions */
  utils: WriterUtils;
}

/**
 * Context passed to generic extension methods (non-mark, non-node).
 *
 * Generic extensions don't have a specific type, so only schema and utils
 * are provided.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterExtensionContext {
  /** The ProseMirror schema with all registered nodes and marks */
  schema: Schema;
  /** Writer utility functions */
  utils: WriterUtils;
}

// =============================================================================
// Writer Generic Extension
// =============================================================================

/**
 * A generic Writer extension (non-mark, non-node).
 *
 * Generic extensions provide functionality like history (undo/redo),
 * custom keyboard shortcuts, or other editor-wide features.
 * They are registered via `window.panel.plugin("name", { writerExtensions: { ... } })`.
 *
 * @example
 * ```js
 * window.panel.plugin("my-plugin", {
 *   writerExtensions: {
 *     customKeys: {
 *       keys() {
 *         return {
 *           "Ctrl-s": () => {
 *             // Custom save handler
 *             return true;
 *           }
 *         };
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/components/Forms/Writer/Extension.js
 */
export interface WriterExtension {
  /**
   * Unique name of the extension.
   */
  name?: string;

  /** Extension type identifier */
  type?: string;

  /**
   * The editor instance, available after `bindEditor()` is called.
   */
  editor?: WriterEditor;

  /**
   * Merged extension options from `defaults` and constructor options.
   */
  options?: Record<string, any>;

  /**
   * Default options for the extension.
   */
  defaults?: Record<string, any>;

  /**
   * Called after the editor is bound to the extension.
   */
  init?: () => null | void;

  /**
   * Commands provided by this extension.
   *
   * @param context - Context with schema and utils (no type for generic extensions)
   * @returns A command function, or an object mapping command names to functions.
   */
  commands?: (
    context: WriterExtensionContext,
  ) => (() => any) | Record<string, (attrs?: any) => any>;

  /**
   * Additional ProseMirror plugins.
   *
   * @param context - Context with schema and utils
   * @returns Array of ProseMirror plugins or plugin specs
   */
  plugins?: (context: WriterExtensionContext) => (Plugin | PluginSpec<any>)[];

  /**
   * Input rules for automatic formatting.
   *
   * @param context - Context with schema and utils
   * @returns Array of ProseMirror input rules
   */
  inputRules?: (context: WriterExtensionContext) => InputRule[];

  /**
   * Paste rules for processing pasted content.
   *
   * @param context - Context with schema and utils
   * @returns Array of ProseMirror plugins
   */
  pasteRules?: (context: WriterExtensionContext) => Plugin[];

  /**
   * Keyboard shortcuts.
   *
   * @param context - Context with schema and utils
   * @returns Object mapping key combinations to command functions
   */
  keys?: (context: WriterExtensionContext) => Record<string, () => any>;
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
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-marks-nodes
 */
export interface WriterMarkExtension {
  // ---------------------------------------------------------------------------
  // Instance Properties (available via `this` in extension methods)
  // ---------------------------------------------------------------------------

  /**
   * Unique name of the mark extension.
   *
   * When using object literals with `window.panel.plugin()`, this is
   * typically derived from the object key in `writerMarks`.
   */
  name?: string;

  /** Extension type identifier */
  type?: "mark";

  /**
   * The editor instance, available after `bindEditor()` is called.
   *
   * Use this to access editor methods like `emit()`, `toggleMark()`, etc.
   */
  editor?: WriterEditor;

  /**
   * Merged extension options from `defaults` and constructor options.
   *
   * Available at runtime after the extension is instantiated.
   */
  options?: Record<string, any>;

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

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
  schema?: MarkSpec;

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
   *     utils.markPasteRule(/\*\*([^*]+)\*\*\/g, type)
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

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called after the editor is bound to the extension.
   *
   * Use this for initialization logic that requires access to `this.editor`.
   */
  init?: () => null | void;

  // ---------------------------------------------------------------------------
  // Mark Helper Methods (inherited from Mark base class)
  // ---------------------------------------------------------------------------

  /**
   * Toggles this mark on the current selection.
   *
   * Shorthand for `this.editor.toggleMark(this.name)`.
   */
  toggle?: () => boolean | undefined;

  /**
   * Removes this mark from the current selection.
   *
   * Shorthand for `this.editor.removeMark(this.name)`.
   */
  remove?: () => void;

  /**
   * Updates the attributes of this mark.
   *
   * Shorthand for `this.editor.updateMark(this.name, attrs)`.
   */
  update?: (attrs: Record<string, any>) => void;
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
 * @see https://getkirby.com/docs/reference/plugins/extensions/writer-marks-nodes
 */
export interface WriterNodeExtension {
  // ---------------------------------------------------------------------------
  // Instance Properties (available via `this` in extension methods)
  // ---------------------------------------------------------------------------

  /**
   * Unique name of the node extension.
   *
   * When using object literals with `window.panel.plugin()`, this is
   * typically derived from the object key in `writerNodes`.
   */
  name?: string;

  /** Extension type identifier */
  type?: "node";

  /**
   * The editor instance, available after `bindEditor()` is called.
   *
   * Use this to access editor methods like `emit()`, `command()`, etc.
   */
  editor?: WriterEditor;

  /**
   * Merged extension options from `defaults` and constructor options.
   *
   * Available at runtime after the extension is instantiated.
   */
  options?: Record<string, any>;

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

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
  schema?: NodeSpec;

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

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called after the editor is bound to the extension.
   *
   * Use this for initialization logic that requires access to `this.editor`.
   */
  init?: () => null | void;
}
