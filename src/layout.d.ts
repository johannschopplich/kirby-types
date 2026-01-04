import type { KirbyBlock } from "./blocks";

/**
 * Valid column width values for Kirby layouts.
 * Expressed as fractions (e.g., `"1/2"` for half width).
 *
 * @see https://getkirby.com/docs/reference/panel/fields/layout#defining-your-own-layouts__available-widths
 */
export type KirbyLayoutColumnWidth =
  | "1/1"
  | "1/2"
  | "1/3"
  | "1/4"
  | "1/6"
  | "1/12"
  | "2/2"
  | "2/3"
  | "2/4"
  | "2/6"
  | "2/12"
  | "3/3"
  | "3/4"
  | "3/6"
  | "3/12"
  | "4/4"
  | "4/6"
  | "4/12"
  | "5/6"
  | "5/12"
  | "6/6"
  | "6/12"
  | "7/12"
  | "8/12"
  | "9/12"
  | "10/12"
  | "11/12"
  | "12/12";

/**
 * Represents a single column within a Kirby layout row.
 * Each column has a width and contains blocks.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 *
 * @example
 * ```ts
 * const column: KirbyLayoutColumn = {
 *   id: "col-abc123",
 *   width: "1/2",
 *   blocks: [
 *     { id: "block-1", type: "text", isHidden: false, content: { text: "Hello" } }
 *   ]
 * };
 * ```
 */
export interface KirbyLayoutColumn {
  /** Unique identifier for the column (UUID v4). */
  id: string;
  /**
   * Column width as a fraction.
   * Common values: `"1/1"` (full), `"1/2"` (half), `"1/3"` (third), `"1/4"` (quarter).
   */
  width: KirbyLayoutColumnWidth;
  /** Array of blocks contained within this column. */
  blocks: KirbyBlock[];
}

/**
 * Represents a Kirby layout row containing multiple columns.
 * Layouts are used for flexible page building with a grid-based system.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 *
 * @example
 * ```ts
 * const layout: KirbyLayout = {
 *   id: "layout-xyz789",
 *   attrs: { class: "highlight" },
 *   columns: [
 *     { id: "col-1", width: "1/2", blocks: [] },
 *     { id: "col-2", width: "1/2", blocks: [] }
 *   ]
 * };
 * ```
 *
 * @example
 * ```ts
 * // Layout with empty attrs (as array)
 * const simpleLayout: KirbyLayout = {
 *   id: "layout-abc",
 *   attrs: [],
 *   columns: [
 *     { id: "col-1", width: "1/1", blocks: [] }
 *   ]
 * };
 * ```
 */
export interface KirbyLayout {
  /** Unique identifier for the layout row (UUID v4). */
  id: string;
  /**
   * Custom attributes for the layout row.
   * Can be a key-value object or an empty array when no attrs are set.
   */
  attrs: Record<string, any> | string[];
  /** Array of columns in this layout row. */
  columns: KirbyLayoutColumn[];
}
