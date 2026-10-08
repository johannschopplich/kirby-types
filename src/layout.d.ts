import type { KirbyBlock } from "./blocks";

/**
 * Column width as a fraction of the row, such as `"1/2"` for half.
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
 * Column of a layout row.
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
  /** UUID v4. */
  id: string;
  /** Fraction of the row, `"1/1"` if unset. */
  width: KirbyLayoutColumnWidth;
  blocks: KirbyBlock<string>[];
}

/**
 * Row of a layout field, split into columns.
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
  /** UUID v4. */
  id: string;
  /** Values of the layout's settings fields. */
  attrs: Record<string, any>;
  columns: KirbyLayoutColumn[];
}
