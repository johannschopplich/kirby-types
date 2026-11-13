import type { KirbyBlock } from "./blocks.js";

/**
 * Column width as a fraction of the row, such as `"1/2"` for half. A
 * blueprint's `layouts` may list any fraction, such as `"1/5"`.
 *
 * @source src/Cms/LayoutColumn.php
 * @source src/Form/Field/LayoutField.php
 * @source panel/src/components/Layout/Grid.vue
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
  | "12/12"
  | (string & {});

/**
 * Column of a layout row.
 *
 * @example
 * ```ts
 * const column: KirbyLayoutColumn = {
 *   id: "9d4b2f1e-6c3a-4e8b-a5d7-2f1c8e9b0a34",
 *   width: "1/2",
 *   blocks: [
 *     {
 *       id: "e2a7c5d9-1b4f-4a6e-8c3d-7f9e0b2a1c56",
 *       type: "text",
 *       isHidden: false,
 *       content: { text: "Hello" }
 *     }
 *   ]
 * };
 * ```
 *
 * @source src/Cms/LayoutColumn.php
 * @source src/Cms/Item.php
 */
export interface KirbyLayoutColumn {
  /** UUID v4. */
  id: string;
  /** `"1/1"` when unset. */
  width: KirbyLayoutColumnWidth;
  blocks: KirbyBlock[];
}

/**
 * Row of a layout field, split into columns.
 *
 * @example
 * ```ts
 * const layout: KirbyLayout = {
 *   id: "3f8a1c6e-2d4b-4b9a-9e7f-5c0d1a2b3e48",
 *   attrs: { class: "highlight" },
 *   columns: [
 *     { id: "7b2e9d4c-8a1f-4c3e-b6d5-0e9f2a1b4c67", width: "1/2", blocks: [] },
 *     { id: "c5d0a3f7-4e2b-4d8c-a1e9-6b7f3c2d0e95", width: "1/2", blocks: [] }
 *   ]
 * };
 * ```
 *
 * @source src/Cms/Layout.php
 * @source src/Cms/Item.php
 */
export interface KirbyLayout {
  /** UUID v4. */
  id: string;
  /**
   * Values of the layout's settings fields; an empty array, not an object,
   * when there are none.
   */
  attrs: Record<string, any>;
  columns: KirbyLayoutColumn[];
}
