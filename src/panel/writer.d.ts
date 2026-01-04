/**
 * Type definitions for Kirby Writer (ProseMirror-based rich text editor).
 *
 * These types document the context objects passed to Writer extension methods
 * (`commands`, `keys`, `plugins`, `inputRules`, `pasteRules`) by Kirby's
 * Writer component.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer
 */

import type { InputRule } from "prosemirror-inputrules";
import type { MarkType, NodeType, Schema } from "prosemirror-model";
import type { Command, EditorState, Plugin } from "prosemirror-state";

/**
 * Kirby Writer utility functions.
 *
 * A collection of ProseMirror commands and custom helpers for working
 * with marks, nodes, and editor state. These utilities are passed to
 * extension methods via the context object.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer/Utils/index.js
 */
export interface WriterUtils {
  // ProseMirror commands
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

  // ProseMirror input rules
  /** Creates an input rule that wraps matching text in a node */
  wrappingInputRule: typeof import("prosemirror-inputrules").wrappingInputRule;
  /** Creates an input rule that changes the textblock type */
  textblockTypeInputRule: typeof import("prosemirror-inputrules").textblockTypeInputRule;

  // ProseMirror schema list
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

  // Custom utilities

  /**
   * Gets the attributes of the active mark of the given type.
   * @param state - The current editor state
   * @param type - The mark type to get attributes for
   * @returns The mark attributes or an empty object
   */
  getMarkAttrs: (state: EditorState, type: MarkType) => Record<string, unknown>;

  /**
   * Gets the attributes of the active node of the given type.
   * @param state - The current editor state
   * @param type - The node type to get attributes for
   * @returns The node attributes or an empty object
   */
  getNodeAttrs: (state: EditorState, type: NodeType) => Record<string, unknown>;

  /**
   * Creates a command that inserts a node of the given type.
   * @param type - The node type to insert
   * @param attrs - Optional attributes for the node
   * @returns A ProseMirror command
   */
  insertNode: (type: NodeType, attrs?: Record<string, unknown>) => Command;

  /**
   * Creates an input rule that applies a mark when the pattern matches.
   * @param regexp - The pattern to match
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the match
   * @returns An input rule
   */
  markInputRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (match: RegExpMatchArray) => Record<string, unknown>,
  ) => InputRule;

  /**
   * Checks if a mark of the given type is active in the current selection.
   * @param state - The current editor state
   * @param type - The mark type to check
   * @returns True if the mark is active
   */
  markIsActive: (state: EditorState, type: MarkType) => boolean;

  /**
   * Creates a paste rule that applies a mark to pasted text matching the pattern.
   * @param regexp - The pattern to match
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the match
   * @returns A ProseMirror plugin
   */
  markPasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (match: string) => Record<string, unknown>,
  ) => Plugin;

  /**
   * Clamps a value between a minimum and maximum.
   * @param value - The value to clamp
   * @param min - The minimum allowed value
   * @param max - The maximum allowed value
   * @returns The clamped value
   */
  minMax: (value: number, min: number, max: number) => number;

  /**
   * Creates an input rule that inserts a node when the pattern matches.
   * @param regexp - The pattern to match
   * @param type - The node type to insert
   * @param getAttrs - Optional function to compute node attributes from the match
   * @returns An input rule
   */
  nodeInputRule: (
    regexp: RegExp,
    type: NodeType,
    getAttrs?: (match: RegExpMatchArray) => Record<string, unknown>,
  ) => InputRule;

  /**
   * Checks if a node of the given type is active in the current selection.
   * @param state - The current editor state
   * @param type - The node type to check
   * @param attrs - Optional attributes to match
   * @returns True if the node is active
   */
  nodeIsActive: (
    state: EditorState,
    type: NodeType,
    attrs?: Record<string, unknown>,
  ) => boolean;

  /**
   * Creates a paste rule that applies a mark to pasted URLs matching the pattern.
   * @param regexp - The pattern to match URLs
   * @param type - The mark type to apply
   * @param getAttrs - Optional function to compute mark attributes from the URL
   * @returns A ProseMirror plugin
   */
  pasteRule: (
    regexp: RegExp,
    type: MarkType,
    getAttrs?: (url: string) => Record<string, unknown>,
  ) => Plugin;

  /**
   * Creates a command that removes a mark from the current selection.
   * @param type - The mark type to remove
   * @returns A ProseMirror command
   */
  removeMark: (type: MarkType) => Command;

  /**
   * Creates a command that toggles between two block types.
   * @param type - The block type to toggle to
   * @param toggleType - The block type to toggle back to (usually paragraph)
   * @param attrs - Optional attributes for the node
   * @returns A ProseMirror command
   */
  toggleBlockType: (
    type: NodeType,
    toggleType: NodeType,
    attrs?: Record<string, unknown>,
  ) => Command;

  /**
   * Creates a command that toggles a list.
   * @param type - The list type to toggle
   * @param itemType - The list item type
   * @returns A ProseMirror command
   */
  toggleList: (type: NodeType, itemType: NodeType) => Command;

  /**
   * Creates a command that toggles wrapping the selection in a node.
   * @param type - The node type to wrap in
   * @returns A ProseMirror command
   */
  toggleWrap: (type: NodeType) => Command;

  /**
   * Creates a command that updates the attributes of the active mark.
   * @param type - The mark type to update
   * @param attrs - The new attributes
   * @returns A ProseMirror command
   */
  updateMark: (type: MarkType, attrs: Record<string, unknown>) => Command;
}

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
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer/Extensions.js:124-134
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
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer/Extensions.js:124-134
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
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/components/Forms/Writer/Extensions.js:112-121
 */
export interface WriterExtensionContext {
  /** The ProseMirror schema with all registered nodes and marks */
  schema: Schema;
  /** Writer utility functions */
  utils: WriterUtils;
}
