/**
 * Blueprint type definitions for Kirby: field, fieldset, and option props as
 * the backend sends them to the Panel.
 *
 * @see https://getkirby.com/docs/reference/panel/blueprints
 */

// #region Field Options

/**
 * Rendered option of an options field like select, radio, checkboxes, or
 * toggles.
 *
 * @example
 * ```ts
 * const option: KirbyOption = {
 *   disabled: false,
 *   icon: "page",
 *   info: "Additional info",
 *   text: "Draft",
 *   value: "draft"
 * };
 * ```
 *
 * @source src/Option/Option.php
 */
export interface KirbyOption {
  disabled: boolean;
  icon: string | null;
  info: string | null;
  /** Display text, falling back to `value`. */
  text: string | null;
  /** Value stored in the content file. */
  value: string | number | null;
}
// #endregion

// #region Field Props (Base)

/**
 * Props every field type shares; the field-specific types extend them.
 *
 * @example
 * ```ts
 * const field: KirbyFieldProps = {
 *   name: "title",
 *   type: "text",
 *   label: "Title",
 *   required: true,
 *   width: "1/2"
 * };
 * ```
 *
 * @source src/Form/Field.php
 */
export interface KirbyFieldProps {
  /** Text shown after the input. */
  after?: string;
  /** Whether the field receives focus when the form loads. */
  autofocus: boolean;
  /** Text shown before the input. */
  before?: string;
  /** Default value for new content. */
  default?: any;
  disabled: boolean;
  /** Help text below the field (supports Markdown). */
  help?: string;
  /** Whether the field type is never shown, like `hidden`. */
  hidden: boolean;
  icon?: string;
  label?: string;
  /** Field identifier within the blueprint. */
  name: string;
  /** Placeholder text for empty fields. */
  placeholder?: string;
  required: boolean;
  /** Whether the field stores a value; `false` for `info` or `headline`. */
  saveable: boolean;
  /** Whether the field is translatable on multi-language sites. */
  translate: boolean;
  /** Field type, e.g. `text`, `textarea`, or `blocks`. */
  type: string;
  value?: any;
  /** Conditional visibility rules. */
  when?: Record<string, any>;
  /** Field width in the grid, e.g. `1/1`, `1/2`, or `1/3`. */
  width: string;
}
// #endregion

// #region Field Props (Type-Specific)

/**
 * @see https://getkirby.com/docs/reference/panel/fields/text
 */
export interface KirbyTextFieldProps extends KirbyFieldProps {
  type: "text" | "slug" | "url" | "email" | "tel";
  /** Converter applied to the value before it is saved. */
  converter?: "lower" | "upper" | "ucfirst" | "slug";
  /** Whether to show the character counter. */
  counter: boolean;
  font: "sans-serif" | "monospace";
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /** Validation regex pattern. */
  pattern?: string;
  spellcheck: boolean;
  value?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/textarea
 */
export interface KirbyTextareaFieldProps extends KirbyFieldProps {
  type: "textarea";
  /**
   * Toolbar buttons: `true` for the default set, `false` for none, or a list
   * of `headlines`, `italic`, `bold`, `link`, `email`, `file`, `code`, `ul`,
   * `ol`, and `|` for a divider.
   */
  buttons?: boolean | string[];
  /** Whether to show the character counter. */
  counter: boolean;
  /** File picker options, or a query string. */
  files?: string | Record<string, any>;
  font: "sans-serif" | "monospace";
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  size?: "small" | "medium" | "large" | "huge";
  spellcheck: boolean;
  uploads?: false | string | Record<string, any>;
  value?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/number
 */
export interface KirbyNumberFieldProps extends KirbyFieldProps {
  type: "number";
  max?: number;
  min?: number;
  /** Step increment, or `"any"` to allow any decimal value. */
  step?: number | "any";
  value?: number;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/select
 */
export interface KirbyOptionsFieldProps extends KirbyFieldProps {
  type: "select" | "radio" | "checkboxes" | "multiselect" | "toggles";
  /** Input a multiselect accepts: any (`"all"`) or only its options. */
  accept?: "all" | "options";
  /** Whether to show batch select toggle (checkboxes only). */
  batch?: boolean;
  /** Number of columns for layout (radio, checkboxes). */
  columns?: number;
  /** Whether toggles should span full width. */
  grow?: boolean;
  /** Whether to show labels for icon-only toggles. */
  labels?: boolean;
  /** Maximum number of selected options (checkboxes, multiselect). */
  max?: number;
  /** Minimum number of selected options (checkboxes, multiselect). */
  min?: number;
  options: KirbyOption[];
  /** Whether a toggle can be deactivated on click (toggles only). */
  reset?: boolean;
  value?: string | string[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/toggle
 */
export interface KirbyToggleFieldProps extends KirbyFieldProps {
  type: "toggle";
  /** Text next to the toggle, or a pair of texts for off and on. */
  text?: string | [string, string];
  value?: boolean;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/date
 */
export interface KirbyDateFieldProps extends KirbyFieldProps {
  type: "date" | "time";
  /** Whether to show the dropdown calendar (date only). */
  calendar?: boolean;
  /** Date/time display format (dayjs tokens). */
  display?: string;
  /** Format the value is saved in. */
  format?: string;
  /** Maximum date/time. */
  max?: string;
  /** Minimum date/time. */
  min?: string;
  /** Hour notation (time only). */
  notation?: 12 | 24;
  /**
   * Rounding step: a `size` of a `unit` like `"minute"`, `"hour"`, or `"day"`.
   */
  step?: { size: number; unit: string };
  /** Whether to show the time input, or its options (date only). */
  time?: boolean | Record<string, any>;
  value?: string;
}

/**
 * Picker item data as returned by the Panel API.
 */
export interface KirbyPickerItem {
  /** Item identifier (UUID or ID). */
  id: string;
  /** Display text. */
  text?: string;
  info?: string;
  image?: Record<string, any>;
  link?: string;
  [key: string]: any;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/files
 */
export interface KirbyFilesFieldProps extends KirbyFieldProps {
  type: "files" | "pages" | "users";
  /** Placeholder text when no items are selected. */
  empty?: string;
  /** Image settings for each item. */
  image?: Record<string, any>;
  /** Info text template for each item. */
  info?: string;
  /** Display layout for selected items. */
  layout?: "list" | "cardlets" | "cards";
  /** Whether each item should be clickable. */
  link?: boolean;
  /** Maximum number of items. */
  max?: number;
  /** Minimum number of items. */
  min?: number;
  /** Whether multiple selection is allowed. */
  multiple: boolean;
  /** Query for available items. */
  query?: string;
  /** Whether the picker shows a search field. */
  search?: boolean;
  /** Layout size for cards. */
  size?: "tiny" | "small" | "medium" | "large" | "huge" | "full" | "auto";
  /** Reference saved in the content file. */
  store?: "uuid" | "id";
  /** Whether the picker includes subpages (pages field only). */
  subpages?: boolean;
  /** Text template for each item. */
  text?: string;
  /** Upload configuration (files field only). */
  uploads?: false | string | Record<string, any>;
  /** Selected items (transformed picker data, not raw IDs). */
  value?: KirbyPickerItem[];
}

/**
 * Color option for the color field.
 */
export interface KirbyColorOption {
  /** Color value (hex, rgb, or hsl). */
  value: string;
  /** Display text. */
  text?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/color
 */
export interface KirbyColorFieldProps extends KirbyFieldProps {
  type: "color";
  /** Whether to allow alpha transparency. */
  alpha?: boolean;
  /** CSS color format to display and store. */
  format?: "hex" | "rgb" | "hsl";
  mode?: "picker" | "input" | "options";
  /** Predefined color options. */
  options?: KirbyColorOption[];
  value?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/range
 */
export interface KirbyRangeFieldProps extends KirbyFieldProps {
  type: "range";
  /** Maximum value (default: `100`). */
  max?: number;
  min?: number;
  /** Step increment, or `"any"` for any decimal value. */
  step?: number | "any";
  /** Whether to show the value tooltip, or its `before` and `after` text. */
  tooltip?: boolean | { before?: string; after?: string };
  value?: number;
}

/**
 * Search configuration for tags field.
 */
export interface KirbyTagsSearch {
  /** Maximum items to display in dropdown. */
  display?: number;
  /** Minimum characters before search starts. */
  min?: number;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/tags
 */
export interface KirbyTagsFieldProps extends KirbyFieldProps {
  type: "tags";
  /** Accepted input: any (`"all"`) or only the options (`"options"`). */
  accept?: "all" | "options";
  icon?: string;
  /** Display layout: `"list"` for full-width tags. */
  layout?: "list" | null;
  /** Maximum number of tags. */
  max?: number;
  /** Minimum number of tags. */
  min?: number;
  /** Predefined tag options. */
  options?: KirbyOption[];
  search?: boolean | KirbyTagsSearch;
  /** Tag separator for storage (default: `,`). */
  separator?: string;
  /** Whether to sort tags by dropdown position. */
  sort?: boolean;
  value?: string[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/link
 */
export interface KirbyLinkFieldProps extends KirbyFieldProps {
  type: "link";
  /** Allowed link types. */
  options?: ("anchor" | "url" | "page" | "file" | "email" | "tel" | "custom")[];
  value?: string;
}

/**
 * Column definition for structure field table display.
 */
export interface KirbyStructureColumn {
  label?: string;
  width?: string;
  /** Field type for display. */
  type?: string;
  /** Whether the column shows on mobile. */
  mobile?: boolean;
  align?: "left" | "center" | "right";
  /** Value template. */
  value?: string;
  /** Text shown before the value. */
  before?: string;
  /** Text shown after the value. */
  after?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/structure
 */
export interface KirbyStructureFieldProps extends KirbyFieldProps {
  type: "structure";
  /** Whether to enable batch editing. */
  batch?: boolean;
  /** Column definitions for table display. */
  columns?: Record<string, KirbyStructureColumn>;
  /** Whether to allow duplicating rows. */
  duplicate?: boolean;
  /** Placeholder text when no entries exist. */
  empty?: string;
  /** Nested field definitions. */
  fields: Record<string, KirbyFieldProps>;
  /** Number of entries per page before pagination. */
  limit?: number;
  /** Maximum number of entries. */
  max?: number;
  /** Minimum number of entries. */
  min?: number;
  /** Whether to prepend new entries. */
  prepend?: boolean | null;
  /** Whether entries are sortable via drag & drop. */
  sortable?: boolean | null;
  /** Field to sort entries by, e.g. `title desc`; disables drag & drop. */
  sortBy?: string;
  value?: Record<string, any>[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/object
 */
export interface KirbyObjectFieldProps extends KirbyFieldProps {
  type: "object";
  /** Placeholder text when no data exists. */
  empty?: string;
  /** Nested field definitions. */
  fields: Record<string, KirbyFieldProps>;
  value?: Record<string, any> | "";
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/blocks
 */
export interface KirbyBlocksFieldProps extends KirbyFieldProps {
  type: "blocks";
  /** Placeholder text when no blocks exist. */
  empty?: string;
  /** Available block fieldsets. */
  fieldsets: Record<string, KirbyFieldsetProps>;
  fieldsetGroups?: Record<string, KirbyFieldsetGroup>;
  /** Drag-and-drop group; blocks move between fields that share it. */
  group?: string;
  /** Maximum number of blocks. */
  max?: number;
  /** Minimum number of blocks. */
  min?: number;
  /** Whether to save the blocks as indented JSON. */
  pretty?: boolean;
  value?: KirbyBlockValue[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 */
export interface KirbyLayoutFieldProps extends KirbyFieldProps {
  type: "layout";
  /** Empty state configuration. */
  empty?: string;
  /** Available block fieldsets. */
  fieldsets: Record<string, KirbyFieldsetProps>;
  /** Fieldset group configuration. */
  fieldsetGroups?: Record<string, KirbyFieldsetGroup>;
  /** Group name for fieldsets. */
  group?: string;
  /** Available layout configurations (column width arrays). */
  layouts: string[][];
  /** Maximum number of layouts. */
  max?: number;
  /** Minimum number of layouts. */
  min?: number;
  /** Size and column count of the layout selector. */
  selector?: {
    size?: "small" | "medium" | "large" | "huge";
    columns?: number;
  };
  /** Fieldset for each layout's settings. */
  settings?: KirbyFieldsetProps;
  value?: KirbyLayoutValue[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/writer
 */
export interface KirbyWriterFieldProps extends KirbyFieldProps {
  type: "writer";
  /** Whether to show the character counter. */
  counter: boolean;
  /** Available heading levels (1-6). */
  headings?: number[];
  /** Whether only inline formatting is allowed. */
  inline: boolean;
  /**
   * Allowed marks out of `bold`, `italic`, `underline`, `strike`, `code`,
   * `link`, and `email`, or `true`/`false` for all or none.
   */
  marks?: string[] | boolean;
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /**
   * Allowed nodes out of `paragraph`, `heading`, `bulletList`, `orderedList`,
   * and `quote`, or `true`/`false` for all or none.
   */
  nodes?: string[] | boolean;
  toolbar?: Record<string, any>;
  value?: string;
}

/**
 * Simplified structure field with a single field per entry.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/entries
 */
export interface KirbyEntriesFieldProps extends KirbyFieldProps {
  type: "entries";
  /** Placeholder text when no entries exist. */
  empty?: string;
  /** Field each entry holds. */
  field: KirbyFieldProps;
  /** Maximum number of entries. */
  max?: number;
  /** Minimum number of entries. */
  min?: number;
  /** Whether entries are sortable via drag & drop. */
  sortable?: boolean;
  value?: any[];
}

/**
 * Stats report item for the stats field.
 *
 * @source src/Panel/Ui/Stat.php
 */
export interface KirbyStatsReport {
  label: string;
  /** Report value, converted to a string. */
  value: string;
  /** Dialog path to open on click. */
  dialog?: string;
  /** Drawer path to open on click. */
  drawer?: string;
  icon?: string;
  info?: string;
  link?: string;
  /** Color theme. */
  theme?: string;
}

/**
 * Field showing reports as cards.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/stats
 */
export interface KirbyStatsFieldProps extends KirbyFieldProps {
  type: "stats";
  /** Reports, resolved from a query if the blueprint sets a string. */
  reports: KirbyStatsReport[];
  /** Card size. */
  size?: "tiny" | "small" | "medium" | "large";
}
// #endregion

// #region Block & Layout Values

/**
 * Block value as stored in content.
 */
export interface KirbyBlockValue {
  /** Block content fields. */
  content: Record<string, any>;
  /** Unique block identifier. */
  id: string;
  isHidden: boolean;
  /** Block type identifier. */
  type: string;
}

/**
 * Layout column value as stored in content.
 */
export interface KirbyLayoutColumnValue {
  blocks: KirbyBlockValue[];
  /** Unique column identifier. */
  id: string;
  /** Column width fraction. */
  width: string;
}

/**
 * Layout value as stored in content.
 */
export interface KirbyLayoutValue {
  /** Values of the layout's settings fields. */
  attrs: Record<string, any> | any[];
  columns: KirbyLayoutColumnValue[];
  /** Unique layout identifier. */
  id: string;
}
// #endregion

// #region Fieldset (Block Type Definition)

/**
 * Block type definition with its fields organized in tabs, used by the
 * blocks and layout fields.
 *
 * @example
 * ```ts
 * const fieldset: KirbyFieldsetProps = {
 *   disabled: false,
 *   editable: true,
 *   icon: "text",
 *   label: null,
 *   name: "Heading",
 *   preview: "fields",
 *   tabs: {
 *     content: {
 *       fields: { text: {...}, level: {...} },
 *       label: "Content",
 *       name: "content"
 *     }
 *   },
 *   translate: true,
 *   type: "heading",
 *   unset: false,
 *   wysiwyg: false
 * };
 * ```
 *
 * @source src/Cms/Fieldset.php
 */
export interface KirbyFieldsetProps {
  disabled: boolean;
  /** Whether the block can be edited (has fields). */
  editable: boolean;
  icon: string | null;
  /** Short label for block selector. */
  label: string | null;
  /** Human-readable block name. */
  name: string;
  /** Preview mode: `fields`, field name, or custom component. */
  preview: string | boolean | null;
  /** Tabs containing field definitions. */
  tabs: Record<string, KirbyFieldsetTab>;
  /** Whether the block is translatable. */
  translate: boolean;
  /** Block type, e.g. `text`, `heading`, or `image`. */
  type: string;
  /** Whether the fieldset should be hidden. */
  unset: boolean;
  /** Whether the block uses WYSIWYG editing. */
  wysiwyg: boolean;
}

/**
 * Tab within a fieldset.
 */
export interface KirbyFieldsetTab {
  /** Field definitions in this tab. */
  fields: Record<string, KirbyFieldProps>;
  label?: string;
  /** Tab identifier. */
  name: string;
}

/**
 * Fieldset group for organizing block types.
 */
export interface KirbyFieldsetGroup {
  label: string;
  /** Group identifier. */
  name: string;
  /** Whether the group is open by default. */
  open: boolean;
  /** Block types in this group. */
  sets: string[];
}
// #endregion

// #region Union Types

export type KirbyAnyFieldProps =
  | KirbyFieldProps
  | KirbyTextFieldProps
  | KirbyTextareaFieldProps
  | KirbyNumberFieldProps
  | KirbyOptionsFieldProps
  | KirbyToggleFieldProps
  | KirbyDateFieldProps
  | KirbyFilesFieldProps
  | KirbyColorFieldProps
  | KirbyRangeFieldProps
  | KirbyTagsFieldProps
  | KirbyLinkFieldProps
  | KirbyStructureFieldProps
  | KirbyObjectFieldProps
  | KirbyEntriesFieldProps
  | KirbyBlocksFieldProps
  | KirbyLayoutFieldProps
  | KirbyWriterFieldProps
  | KirbyStatsFieldProps;
// #endregion
