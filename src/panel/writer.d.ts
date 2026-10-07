/**
 * Type definitions for Kirby Writer (ProseMirror-based rich text editor).
 *
 * This module provides types for the Writer component, including:
 * - Editor instance and options
 * - Mark and node extensions for plugins
 * - Utility functions and contexts.
 */

import type { InputRule } from "prosemirror-inputrules";
import type {
  Attrs,
  Fragment,
  Mark,
  MarkSpec,
  MarkType,
  NodeSpec,
  NodeType,
  ParseOptions,
  Node as ProseMirrorNode,
  Schema,
} from "prosemirror-model";
import type {
  Command,
  EditorState,
  Plugin,
  PluginSpec,
  Selection as ProseMirrorSelection,
  Transaction,
} from "prosemirror-state";
import type {
  EditorView,
  MarkViewConstructor,
  NodeViewConstructor,
} from "prosemirror-view";

// #region Writer Editor

/**
 * Payload of the editor's `transaction` and `update` events.
 *
 * @source panel/src/components/Forms/Writer/Editor.js
 */
export interface WriterEditorTransactionPayload {
  editor: WriterEditor;
  getHTML: (fragment?: Fragment) => string;
  getJSON: () => Record<string, any>;
  state: EditorState;
  transaction: Transaction;
}

/**
 * Payload of the editor's `select` and `deselect` events.
 *
 * @source panel/src/components/Forms/Writer/Editor.js
 */
export interface WriterEditorSelectPayload extends WriterEditorTransactionPayload {
  from: number;
  /** Whether the selection differs from the one before the transaction. */
  hasChanged: boolean;
  to: number;
}

/**
 * Payloads of the editor events and of the events the built-in `link` and
 * `email` marks send, keyed by event name. Each listener receives its payload
 * as the only argument. `drop` is left out: it passes the view,
 * the event, the slice, and the `moved` flag as separate arguments.
 *
 * @source panel/src/components/Forms/Writer/Editor.js
 * @source panel/src/components/Forms/Writer/Marks/Link.js
 * @source panel/src/components/Forms/Writer/Marks/Email.js
 */
export interface WriterEditorEvents {
  blur: { event: FocusEvent; state: EditorState; view: EditorView };
  deselect: WriterEditorSelectPayload;
  /** The editor, sent when the email toolbar button is clicked without Alt or Meta held. */
  email: WriterEditor;
  focus: { event: FocusEvent; state: EditorState; view: EditorView };
  init: { state: EditorState; view: EditorView };
  /** The editor, sent when the link toolbar button is clicked without Alt or Meta held. */
  link: WriterEditor;
  select: WriterEditorSelectPayload;
  transaction: WriterEditorTransactionPayload;
  /**
   * Payload of a document change. `setContent()` and `clearContent()` skip it
   * unless `emitUpdate` is `true`.
   */
  update: WriterEditorTransactionPayload;
}

/**
 * The Writer editor instance, reached as `this.editor` inside extension
 * methods and as `this` inside event listeners.
 *
 * @source panel/src/components/Forms/Writer/Editor.js
 * @source panel/src/components/Forms/Writer/Emitter.js
 */
export interface WriterEditor {
  // #region Properties

  activeMarks: string[];
  /** Currently active mark attributes by mark name. */
  activeMarkAttrs: Record<string, Record<string, any>>;
  activeNodes: string[];
  /** Currently active node attributes by node name. */
  activeNodeAttrs: Record<string, Record<string, any>>;
  /**
   * Commands from all extensions, keyed by command name. Each focuses the
   * view before it runs and returns `false` while the editor is not editable.
   */
  commands: Record<string, (attrs?: any) => any>;
  /** Default options that `options` is merged over. */
  defaults: Required<WriterEditorOptions>;
  /** The DOM element the editor is mounted to. */
  element: HTMLElement | null;
  /** Event handlers passed via `options.events`. */
  events: Record<string, (...args: any[]) => any>;
  extensions: WriterExtensions;
  focused: boolean;
  inputRules: InputRule[];
  /**
   * Keyed by array index rather than by mark or node name, and every entry
   * throws when called – read `activeMarks` and `activeNodes` instead.
   */
  isActive: Record<string, (attrs?: Record<string, any>) => boolean>;
  keymaps: Plugin[];
  /** Raw mark specs; `schema.marks` holds the `MarkType` instances. */
  marks: Record<string, MarkSpec>;
  /** Raw node specs; `schema.nodes` holds the `NodeType` instances. */
  nodes: Record<string, NodeSpec>;
  /** Options merged over the defaults, so every key is set. */
  options: Required<WriterEditorOptions>;
  pasteRules: Plugin[];
  /** ProseMirror plugins contributed by the extensions. */
  plugins: Plugin[];
  schema: Schema;
  selection: ProseMirrorSelection;
  selectionAtEnd: ProseMirrorSelection;
  selectionAtStart: ProseMirrorSelection;
  selectionIsAtEnd: boolean;
  selectionIsAtStart: boolean;
  /** Current editor state, `undefined` until the view exists. */
  state: EditorState | undefined;
  /**
   * ProseMirror view, `undefined` until the editor creates it, so also inside
   * every extension's `init()`.
   */
  view: EditorView | undefined;
  // #endregion

  // #region Methods

  blur: () => void;
  /** Returns toolbar buttons for the given type, `mark` by default. */
  buttons: (type?: "mark" | "node") => Record<string, WriterToolbarButton>;
  clearContent: (emitUpdate?: boolean) => void;
  command: (command: string, ...args: any[]) => void;
  /**
   * Creates a ProseMirror document from content.
   *
   * @param content - HTML string, JSON object, or `null` for an empty document
   * @returns The created document node, or `false` for any other content type
   */
  createDocument: ((
    content: string | Record<string, any> | null,
    parseOptions?: ParseOptions,
  ) => ProseMirrorNode) &
    ((
      content: unknown,
      parseOptions?: ParseOptions,
    ) => ProseMirrorNode | false);
  destroy: () => void;
  emit: (<K extends keyof WriterEditorEvents>(
    event: K,
    payload: WriterEditorEvents[K],
  ) => this) &
    ((event: string, ...args: any[]) => this);
  focus: (position?: "start" | "end" | number | boolean | null) => void;
  /**
   * Returns content as HTML. An inline editor returns only the first
   * paragraph's inner HTML.
   *
   * @param fragment - Fragment to serialize, the whole document when omitted
   */
  getHTML: (fragment?: Fragment) => string;
  getHTMLStartToSelection: () => string;
  getHTMLSelectionToEnd: () => string;
  /** Returns the HTML before and after the selection, in that order. */
  getHTMLStartToSelectionToEnd: () => [string, string];
  getJSON: () => Record<string, any>;
  /**
   * Returns attributes for a mark type: `{}` when no text in the selection
   * carries the mark, `undefined` for a name the schema lacks.
   */
  getMarkAttrs: <T extends object = Record<string, any>>(
    type?: string | null,
  ) => T | undefined;
  getSchemaJSON: () => {
    nodes: Record<string, any>;
    marks: Record<string, any>;
  };
  /** Inserts text at the current selection. */
  insertText: (text: string, selected?: boolean) => void;
  isEditable: () => boolean;
  isEmpty: () => boolean | undefined;
  /**
   * Unsubscribes from events.
   *
   * @param event - Event name, every event when omitted
   * @param fn - Handler to remove, every handler of `event` when omitted
   */
  off: (<K extends keyof WriterEditorEvents>(
    event: K,
    fn?: (payload: WriterEditorEvents[K]) => void,
  ) => this) &
    ((event?: string, fn?: (...args: any[]) => any) => this);
  /**
   * Subscribes to an event.
   *
   * @param event - Event name; a key of `WriterEditorEvents` types the payload.
   */
  on: (<K extends keyof WriterEditorEvents>(
    event: K,
    fn: (payload: WriterEditorEvents[K]) => void,
  ) => this) &
    ((event: string, fn: (...args: any[]) => any) => this);
  /** Removes a mark from the current selection. */
  removeMark: (mark: string) => void;
  selectionAtPosition: (
    position?: "start" | "end" | number | true | null,
  ) => ProseMirrorSelection | { from: number; to: number };
  setContent: (
    content?: string | Record<string, any> | null,
    emitUpdate?: boolean,
    parseOptions?: ParseOptions,
  ) => void;
  setSelection: (from?: number, to?: number) => void;
  /** Toggles a mark on the current selection. */
  toggleMark: (mark: string) => boolean | undefined;
  updateMark: (mark: string, attrs: Record<string, any>) => void;
  // #endregion
}

/**
 * @source panel/src/components/Forms/Writer/Editor.js
 */
export interface WriterEditorOptions {
  autofocus?: boolean | "start" | "end" | number;
  content?: string | Record<string, any> | null;
  /** `true` skips every input rule; an array names the extensions whose input rules are skipped. */
  disableInputRules?: boolean | string[];
  /** `true` skips every paste rule; an array names the extensions whose paste rules are skipped. */
  disablePasteRules?: boolean | string[];
  editable?: boolean;
  element?: HTMLElement | null;
  extensions?: (WriterExtension | WriterMarkExtension | WriterNodeExtension)[];
  emptyDocument?: Record<string, any>;
  /**
   * Listeners registered with `on()` at init, keyed by event name. `paste` is
   * never emitted: the view calls it with the clipboard event and its HTML and
   * plain text, and a return of `true` marks the paste as handled.
   */
  events?: {
    paste?: (
      event: ClipboardEvent,
      html: string,
      text: string,
    ) => boolean | void;
    [event: string]: ((...args: any[]) => any) | undefined;
  };
  inline?: boolean;
  parseOptions?: ParseOptions;
  topNode?: string;
  useBuiltInExtensions?: boolean;
}

/**
 * Extensions manager holding the editor's mark, node, and generic extensions.
 *
 * @source panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterExtensions {
  extensions: (WriterExtension | WriterMarkExtension | WriterNodeExtension)[];
  /**
   * ProseMirror view, `undefined` until the editor has created it and fired
   * its `init` event.
   */
  view: EditorView | undefined;

  /** Returns toolbar buttons for the given type, `mark` by default. */
  buttons: (type?: "mark" | "node") => Record<string, WriterToolbarButton>;
  /** Raw mark schema definitions from all mark extensions. */
  marks: Record<string, MarkSpec>;
  /** Views of the mark extensions that define one, keyed by mark name. */
  markViews: Record<string, MarkViewConstructor>;
  /** Raw node schema definitions from all node extensions. */
  nodes: Record<string, NodeSpec>;
  /** Views of the node extensions that define one, keyed by node name. */
  nodeViews: Record<string, NodeViewConstructor>;
  /**
   * Options of each extension, keyed by extension name; extensions whose
   * `name` is `null` share the `"null"` key. Assigning a changed value updates
   * the editor view. Reading it throws unless every extension defines
   * `options`.
   */
  options: Record<string, Record<string, any>>;
}
// #endregion

// #region Writer Toolbar

/**
 * @source panel/src/components/Forms/Writer/Extensions.js
 * @source panel/src/components/Forms/Writer/Toolbar.vue
 * @source panel/src/components/Forms/Writer/Nodes/Heading.js
 */
export interface WriterToolbarButton {
  /**
   * Key of a button in an extension's button array, `name` when omitted. The
   * block dropdown also marks an entry as current when its `id` matches the
   * active node's entry, so node buttons there need a unique `id`.
   */
  id?: string;
  /** Command name to execute, the button's key when omitted. */
  command?: string;
  /** Icon name from Kirby's icon set. */
  icon: string;
  /** Display label (usually translated via `window.panel.t()`). */
  label: string;
  /** Extension name this button belongs to. */
  name?: string;
  /**
   * Node attributes that mark this button as current when they match the
   * active node's, for nodes with several buttons such as headings.
   */
  attrs?: Record<string, any>;
  /**
   * Whether a separator line follows this button in the block dropdown.
   * Ignored for inline buttons and after the last entry.
   */
  separator?: boolean;
  /**
   * Whether a node button shows inline in the toolbar instead of in the block dropdown.
   *
   * @since 5.0.0
   */
  inline?: boolean;
  /** Node names whose dropdown buttons stay enabled while this button's node is active. */
  when?: string[];
}
// #endregion

// #region Writer Utilities

/**
 * ProseMirror commands and custom helpers for marks, nodes, and editor state,
 * passed to extension methods as the context's `utils`.
 *
 * @source panel/src/components/Forms/Writer/Utils/index.js
 */
export interface WriterUtils {
  // #region ProseMirror Commands

  /** Chains multiple commands, executing until one returns `true`. */
  chainCommands: typeof import("prosemirror-commands").chainCommands;
  /** Exits a code block at the cursor position. */
  exitCode: typeof import("prosemirror-commands").exitCode;
  /** Lifts content out of its wrapping node. */
  lift: typeof import("prosemirror-commands").lift;
  /** Creates a command that sets the textblock type of the selection. */
  setBlockType: typeof import("prosemirror-commands").setBlockType;
  /** Creates a command that toggles a mark on the selection. */
  toggleMark: typeof import("prosemirror-commands").toggleMark;
  /** Creates a command that wraps the selection in a node type. */
  wrapIn: typeof import("prosemirror-commands").wrapIn;
  // #endregion

  // #region ProseMirror Input Rules

  /** Creates an input rule that wraps matching text in a node. */
  wrappingInputRule: typeof import("prosemirror-inputrules").wrappingInputRule;
  /** Creates an input rule that changes the textblock type. */
  textblockTypeInputRule: typeof import("prosemirror-inputrules").textblockTypeInputRule;
  // #endregion

  // #region ProseMirror Schema List

  /** Returns the node map with list nodes appended. */
  addListNodes: typeof import("prosemirror-schema-list").addListNodes;
  /** Creates a command that wraps the selection in a list. */
  wrapInList: typeof import("prosemirror-schema-list").wrapInList;
  /** Creates a command that splits the list item at the cursor. */
  splitListItem: typeof import("prosemirror-schema-list").splitListItem;
  /** Creates a command that lifts the selected list item out of its parent list. */
  liftListItem: typeof import("prosemirror-schema-list").liftListItem;
  /** Creates a command that sinks the selected list item into a nested list. */
  sinkListItem: typeof import("prosemirror-schema-list").sinkListItem;
  // #endregion

  // #region Custom Utilities

  /** Returns the attributes of the active mark of the given type, or `{}`. */
  getMarkAttrs: (state: EditorState, type: MarkType) => Attrs;

  /** Returns the attributes of the active node of the given type, or `{}`. */
  getNodeAttrs: (state: EditorState, type: NodeType) => Attrs;

  /**
   * Creates a command that inserts a node of the given type.
   *
   * @returns A ProseMirror command. It needs `dispatch` and returns nothing
   *          even when it applies, so `chainCommands` and key bindings move on
   *          to the next command.
   */
  insertNode: (
    type: NodeType,
    attrs?: Attrs | null,
    content?: Fragment | ProseMirrorNode | ProseMirrorNode[] | null,
    marks?: Mark[] | null,
  ) => Command;

  /**
   * Creates an input rule that marks the last capture group of a match and
   * deletes the rest of the group before it, or of the whole match when the
   * pattern has a single group.
   *
   * @param regexp - Pattern with at least one capture group; the rule throws
   *                 without one.
   */
  markInputRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: Attrs | ((match: RegExpMatchArray) => Attrs),
  ) => InputRule;

  /** Checks if a mark of the given type is active in the current selection. */
  markIsActive: (state: EditorState, type: MarkType) => boolean;

  /**
   * Creates a paste rule that marks the first capture group of each match in
   * pasted text and drops the rest of the match. Text that already carries a
   * `link` mark, and text whose parent node disallows the mark, stays
   * unmarked.
   *
   * @param regexp - Pattern with a capture group and the `g` flag; without the
   *                 flag a match hangs the paste.
   */
  markPasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: Attrs | ((match: RegExpMatchArray) => Attrs),
  ) => Plugin;

  /**
   * Parses a value as an integer and clamps it between a minimum and maximum.
   *
   * @param value - The number or numeric string to clamp, `0` when omitted
   * @param min - The minimum allowed value, `0` when omitted
   * @param max - The maximum allowed value, `0` when omitted
   * @returns The clamped integer, `NaN` when `value` does not parse as one
   */
  minMax: (value?: number | string, min?: number, max?: number) => number;

  /** Creates an input rule that inserts a node when the pattern matches. */
  nodeInputRule: (
    regexp: RegExp,
    type: NodeType,
    getAttrs?: Attrs | ((match: RegExpMatchArray) => Attrs),
  ) => InputRule;

  /**
   * Checks if a node of the given type, carrying `attrs` when given, is active
   * in the current selection.
   */
  nodeIsActive: (state: EditorState, type: NodeType, attrs?: Attrs) => boolean;

  /**
   * Creates a paste rule that marks each whole match in pasted text.
   *
   * @param regexp - Pattern with the `g` flag; without it a match hangs the
   *                 paste.
   */
  pasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: Attrs | ((match: string) => Attrs),
  ) => Plugin;

  /**
   * Creates a command that removes a mark from the current selection.
   *
   * @returns A ProseMirror command. It needs `dispatch` and returns nothing
   *          even when it applies, so `chainCommands` and key bindings move on
   *          to the next command.
   */
  removeMark: (type: MarkType) => Command;

  /**
   * Creates a command that toggles between two block types.
   *
   * @param type - The block type to toggle to
   * @param toggleType - The block type to toggle back to, usually `paragraph`
   */
  toggleBlockType: (
    type: NodeType,
    toggleType: NodeType,
    attrs?: Attrs,
  ) => Command;

  /** Creates a command that toggles a list. */
  toggleList: (type: NodeType, itemType: NodeType) => Command;

  /** Creates a command that toggles wrapping the selection in a node. */
  toggleWrap: (type: NodeType, attrs?: Attrs) => Command;

  /**
   * Creates a command that sets the mark with the given attributes on every
   * selected range, or on the mark's range around a collapsed cursor.
   *
   * @returns A ProseMirror command. It needs `dispatch` and returns nothing
   *          even when it applies, so `chainCommands` and key bindings move on
   *          to the next command.
   */
  updateMark: (type: MarkType, attrs: Attrs) => Command;
  // #endregion
}
// #endregion

// #region Writer Contexts

/**
 * Context passed to the `commands`, `keys`, `inputRules`, `pasteRules`, and
 * `plugins` methods of a mark extension.
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
 * @source panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterMarkContext {
  /** The ProseMirror schema with all registered nodes and marks. */
  schema: Schema;
  /** Type of the mark this extension defines. */
  type: MarkType;
  utils: WriterUtils;
}

/**
 * Context passed to node extension methods (`commands`, `keys`, `inputRules`, `pasteRules`, `plugins`).
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
 * @source panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterNodeContext {
  /** The ProseMirror schema with all registered nodes and marks. */
  schema: Schema;
  /** Type of the node this extension defines. */
  type: NodeType;
  utils: WriterUtils;
}

/**
 * Context passed to the methods of a generic extension, one that is neither a
 * mark nor a node.
 *
 * @source panel/src/components/Forms/Writer/Extensions.js
 */
export interface WriterExtensionContext {
  /** The ProseMirror schema with all registered nodes and marks. */
  schema: Schema;
  utils: WriterUtils;
}
// #endregion

// #region Writer Generic Extension

/**
 * A generic Writer extension (non-mark, non-node).
 *
 * Generic extensions provide editor-wide features such as history (undo/redo),
 * HTML insertion, or keyboard shortcuts. `window.panel.plugin()` registers
 * only marks and nodes (`writerMarks`, `writerNodes`), so custom generic
 * extensions reach the editor as instances passed to the `extensions` prop of
 * `k-writer-input`, and custom shortcuts through its `keys` prop.
 *
 * @source panel/src/components/Forms/Writer/Extension.js
 * @source panel/src/components/Forms/Writer/Extensions.js
 * @source panel/src/components/Forms/Input/WriterInput.vue
 */
export interface WriterExtension {
  /** Unique name of the extension, `null` on built-ins that define none. */
  name?: string | null;

  /**
   * Discriminator value. Among plain extensions, the editor collects
   * `inputRules`, `keys`, `pasteRules`, and `plugins` only from those typed
   * `"extension"`; built-ins such as the toolbar extension use their own
   * value, `"toolbar"`.
   */
  type?: string;

  /** The editor instance, available after the extension is bound to an editor. */
  editor?: WriterEditor;

  /**
   * Extension options. Built-in extensions merge `defaults` and their
   * constructor options into it; a custom extension sets it itself.
   */
  options?: Record<string, any>;

  /** Default options, merged into `options` only by built-in extensions. */
  defaults?: Record<string, any>;

  /**
   * Stores the editor on `editor`. The editor calls it on every extension
   * before `init()`.
   */
  bindEditor: (editor: WriterEditor) => void;

  /** Runs after the editor is bound to the extension. */
  init: () => null | void;

  /** Returns the commands this extension provides. */
  commands?: (
    context: WriterExtensionContext,
  ) => ((attrs?: any) => any) | Record<string, (attrs?: any) => any>;

  /** Returns additional ProseMirror plugins. */
  plugins?: (context: WriterExtensionContext) => (Plugin | PluginSpec<any>)[];

  /** Returns input rules for automatic formatting. */
  inputRules?: (context: WriterExtensionContext) => InputRule[];

  /** Returns paste rules that process pasted content. */
  pasteRules?: (context: WriterExtensionContext) => Plugin[];

  /**
   * Returns keyboard shortcuts. A handler that returns nothing or `false`
   * lets the key fall through to the next binding.
   *
   * @returns Object mapping key combinations to command functions
   */
  keys?: (
    context: WriterExtensionContext,
  ) => Record<string, Command | (() => void)>;
}
// #endregion

// #region Writer Mark Extension

/**
 * A custom Writer mark extension.
 *
 * Marks are inline formatting such as bold, italic, or links, registered
 * through `window.panel.plugin("name", { writerMarks: { ... } })`.
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
 * @source panel/src/components/Forms/Writer/Mark.js
 * @source panel/src/components/Forms/Writer/Extension.js
 * @source panel/src/components/Forms/Writer/Extensions.js
 * @source panel/src/helpers/writer.js
 */
export interface WriterMarkExtension {
  // #region Instance Properties (available via `this` in extension methods)

  /**
   * Unique name of the mark extension.
   *
   * Defaults to the mark's key in `writerMarks`; a `name` in the definition
   * overrides it.
   */
  name?: string;

  type?: "mark";

  /** The editor, set by `bindEditor()` before `init()` runs. */
  editor?: WriterEditor;

  /**
   * Options merged from `defaults` and the mark's object entry in the field's
   * `marks` setting.
   *
   * Only built-in marks are constructed. A mark registered through
   * `writerMarks` is created without its constructor, so this stays unset
   * unless the definition provides it.
   */
  options?: Record<string, any>;
  // #endregion

  // #region Configuration

  /**
   * Toolbar button, keyed by the mark's `name`; each button in an array is
   * keyed by its own `id` or `name`.
   */
  button?: WriterToolbarButton | WriterToolbarButton[];

  /** Default options, merged into `options` only for built-in marks. */
  defaults?: Record<string, any>;

  /**
   * Mark spec registered in the editor schema under the mark's `name` –
   * attributes, DOM parsing and serialization, inclusivity, and exclusions.
   */
  schema?: MarkSpec;

  /**
   * Returns the commands this extension provides.
   *
   * @returns A command function, registered under the mark's `name`, or an
   *          object mapping command names to functions. A command that returns
   *          a ProseMirror command has it run against the editor view; any
   *          other return value is passed through.
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
  ) => ((attrs?: any) => any) | Record<string, (attrs?: any) => any>;

  /**
   * Returns input rules for automatic formatting.
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
   * Returns keyboard shortcuts. A handler that returns nothing or `false`
   * lets the key fall through to the next binding.
   *
   * @returns Object mapping key combinations to command functions
   *
   * @example
   * ```js
   * keys({ type, utils }) {
   *   return {
   *     "Mod-b": utils.toggleMark(type)
   *   };
   * }
   * ```
   */
  keys?: (context: WriterMarkContext) => Record<string, Command | (() => void)>;

  /**
   * Returns paste rules that process pasted content.
   *
   * @example
   * ```js
   * pasteRules({ type, utils }) {
   *   return [
   *     utils.markPasteRule(/~([^~]+)~/g, type)
   *   ];
   * }
   * ```
   */
  pasteRules?: (context: WriterMarkContext) => Plugin[];

  /**
   * Returns additional ProseMirror plugins.
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
   * Creates the mark view that renders this mark in the editor instead of
   * the schema's `toDOM` output.
   */
  view?: MarkViewConstructor;
  // #endregion

  // #region Lifecycle

  /**
   * Stores the editor on `editor`. Inherited from the base extension; the
   * editor calls it before `init()`, so an override must keep that assignment.
   */
  bindEditor?: (editor: WriterEditor) => void;

  /**
   * Runs after the editor is bound to the extension and before the editor
   * builds its schema, view, and commands.
   */
  init?: () => null | void;
  // #endregion

  // #region Mark Helper Methods (inherited by every mark)

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
  // #endregion
}
// #endregion

// #region Writer Node Extension

/**
 * A custom Writer node extension.
 *
 * Nodes are block-level or inline elements such as headings, lists, or images,
 * registered through `window.panel.plugin("name", { writerNodes: { ... } })`.
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
 * @source panel/src/components/Forms/Writer/Node.js
 * @source panel/src/components/Forms/Writer/Extension.js
 * @source panel/src/components/Forms/Writer/Extensions.js
 * @source panel/src/helpers/writer.js
 * @source panel/src/components/Forms/Input/WriterInput.vue
 */
export interface WriterNodeExtension {
  // #region Instance Properties (available via `this` in extension methods)

  /**
   * Unique name of the node extension.
   *
   * Defaults to the node's key in `writerNodes`; a `name` in the definition
   * overrides it.
   */
  name?: string;

  type?: "node";

  /** The editor, set by `bindEditor()` before `init()` runs. */
  editor?: WriterEditor;

  /**
   * Merged extension options from `defaults` and constructor options.
   *
   * Only built-in nodes are constructed. A node registered through
   * `writerNodes` is created without its constructor, so this stays unset
   * unless the definition provides it.
   */
  options?: Record<string, any>;
  // #endregion

  // #region Configuration

  /**
   * Toolbar button, keyed by the node's `name`; each button in an array is
   * keyed by its own `id` or `name`.
   */
  button?: WriterToolbarButton | WriterToolbarButton[];

  /** Default options, merged into `options` only for built-in nodes. */
  defaults?: Record<string, any>;

  /**
   * ProseMirror node schema definition, registered under the node's `name`.
   *
   * An inline writer installs only nodes whose spec sets `inline: true`.
   */
  schema?: NodeSpec;

  /**
   * Returns the commands this extension provides.
   *
   * A single function registers under the node's `name`, an object under its
   * keys. A command that returns a function has it run as a ProseMirror
   * command against the view; any other return value passes through.
   */
  commands?: (
    context: WriterNodeContext,
  ) => ((attrs?: any) => any) | Record<string, (attrs?: any) => any>;

  /** Returns input rules for automatic formatting. */
  inputRules?: (context: WriterNodeContext) => InputRule[];

  /**
   * Returns keyboard shortcuts. A handler that returns nothing or `false`
   * lets the key fall through to the next binding.
   *
   * @returns Object mapping key combinations to command functions
   */
  keys?: (context: WriterNodeContext) => Record<string, Command | (() => void)>;

  /** Returns paste rules that process pasted content. */
  pasteRules?: (context: WriterNodeContext) => Plugin[];

  /** Returns additional ProseMirror plugins. */
  plugins?: (context: WriterNodeContext) => (Plugin | PluginSpec<any>)[];

  /**
   * Creates the node view that renders this node in the editor instead of
   * the schema's `toDOM` output.
   */
  view?: NodeViewConstructor;
  // #endregion

  // #region Lifecycle

  /**
   * Stores the editor on `editor`. Inherited from the base extension; the
   * editor calls it before `init()`, so an override must keep that assignment.
   */
  bindEditor?: (editor: WriterEditor) => void;

  /**
   * Runs after the editor is bound to the extension and before the editor
   * builds its schema, view, and commands.
   */
  init?: () => null | void;
  // #endregion
}
// #endregion
