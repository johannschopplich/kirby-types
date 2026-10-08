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
 * Props of a field as the backend sends them; the field-specific types extend
 * them. Input fields always send `autofocus`, `disabled`, `required`, and
 * `translate`; other fields omit them, but receive `disabled` when the current
 * user may not update the model or the field is not translatable into the
 * current language.
 *
 * @example
 * ```ts
 * const field: KirbyFieldProps = {
 *   autofocus: false,
 *   disabled: false,
 *   hidden: false,
 *   label: "Title",
 *   name: "title",
 *   required: true,
 *   saveable: true,
 *   translate: true,
 *   type: "text",
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
  autofocus?: boolean;
  /** Text shown before the input. */
  before?: string;
  /** Default value for new content. */
  default?: any;
  disabled?: boolean;
  /** Help text below the field, rendered from KirbyText to HTML. */
  help?: string;
  /** Whether the field type is never shown, like `hidden`. */
  hidden: boolean;
  icon?: string;
  label?: string;
  /** Field identifier within the blueprint. */
  name: string;
  /** Placeholder text for empty fields. */
  placeholder?: string;
  required?: boolean;
  /** Whether the field stores a value; `false` for `info` or `headline`. */
  saveable: boolean;
  /** Whether the field is translatable on multi-language sites. */
  translate?: boolean;
  /** Field type, e.g. `text`, `textarea`, or `blocks`. */
  type: string;
  /** Conditional visibility rules. */
  when?: Record<string, any>;
  /**
   * Field width in the grid, e.g. `1/1`, `1/2`, or `1/3`; absent for `hidden`.
   */
  width?: string;
}
// #endregion

// #region Field Props (Type-Specific)

/**
 * @see https://getkirby.com/docs/reference/panel/fields/text
 */
export interface KirbyTextFieldProps extends KirbyFieldProps {
  type: "text" | "slug" | "url" | "email" | "tel" | "password";
  /**
   * Regex character class the slug may contain, replacing `a-z0-9` (slug
   * only).
   */
  allow?: string;
  /** Browser autocomplete hint, e.g. `email` or `url`. */
  autocomplete?: string;
  /** Converter applied to the value before it is saved. */
  converter?: "label" | "lower" | "upper" | "ucfirst" | "slug";
  /** Whether to show the character counter. */
  counter: boolean;
  font: "sans-serif" | "monospace";
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /** Path shown with the slug below the field (slug only). */
  path?: string;
  /** Validation regex pattern. */
  pattern?: string;
  spellcheck?: boolean;
  /** Field the slug is generated from while it changes (slug only). */
  sync?: string;
  /** Button that fills the slug from another field (slug only). */
  wizard?: boolean | { field?: string; text?: string };
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
  buttons: boolean | string[];
  /** Whether to show the character counter. */
  counter: boolean;
  font: "sans-serif" | "monospace";
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  size?: "small" | "medium" | "large" | "huge";
  spellcheck?: boolean;
  /**
   * Upload settings like the accepted file types, or `false` when uploads are
   * off.
   */
  uploads: false | Record<string, any>;
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
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/select
 */
export interface KirbyOptionsFieldProps extends KirbyFieldProps {
  type: "select" | "radio" | "checkboxes" | "toggles";
  /** Whether to show batch select toggle (checkboxes only). */
  batch?: boolean;
  /** Number of columns for layout (radio, checkboxes). */
  columns?: number;
  /** Whether toggles should span full width. */
  grow?: boolean;
  /** Whether to show labels for icon-only toggles. */
  labels?: boolean;
  /** Maximum number of selected options (checkboxes only). */
  max?: number;
  /** Minimum number of selected options (checkboxes only). */
  min?: number;
  options: KirbyOption[];
  /** Whether a toggle can be deactivated on click (toggles only). */
  resettable?: boolean;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/toggle
 */
export interface KirbyToggleFieldProps extends KirbyFieldProps {
  type: "toggle";
  /** Text next to the toggle, or a pair of texts for off and on. */
  text?: string | [string, string];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/date
 */
export interface KirbyDateFieldProps extends KirbyFieldProps {
  type: "date" | "time";
  /** Whether to show the dropdown calendar (date only). */
  calendar?: boolean;
  /** Date/time display format (dayjs tokens). */
  display: string;
  /** Format the value is saved in. */
  format: string;
  /** Maximum date/time. */
  max?: string;
  /** Minimum date/time. */
  min?: string;
  /** Hour notation (time only). */
  notation?: 12 | 24;
  /**
   * Rounding step: a `size` of a `unit` like `"minute"`, `"hour"`, or `"day"`.
   */
  step: { size: number; unit: string };
  /** Props of the time input, or `false` without one (date only). */
  time?: false | KirbyDateFieldProps;
}

/**
 * Picker item data as returned by the Panel API.
 */
export interface KirbyPickerItem {
  /**
   * Model ID; the stored reference for an item the current user may not list.
   */
  id: string;
  /** Display text. */
  text: string;
  /** Info text, `null` for an item the current user may not list. */
  info: string | null;
  image: Record<string, any> | null;
  /** Panel path, `false` for an item the current user may not list. */
  link: string | false;
  /** Layout of the field the item belongs to. */
  layout: "list" | "cardlets" | "cards";
  /**
   * Current user's permissions on the model; an empty array for an item the
   * current user may not list.
   */
  permissions: Record<string, boolean> | [];
  /**
   * Model UUID, `null` with UUIDs disabled; the stored reference for an item
   * the current user may not list.
   */
  uuid: string | null;
  [key: string]: any;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/files
 */
export interface KirbyFilesFieldProps extends KirbyFieldProps {
  /** Picker type, also for blueprints that set `files`, `pages`, or `users`. */
  type: "filepicker" | "pagepicker" | "userpicker";
  /** Placeholder text when no items are selected. */
  empty?: string;
  /** Image settings for each item. */
  image?: Record<string, any>;
  /** Info text template for each item. */
  info?: string;
  /** Display layout for selected items. */
  layout: "list" | "cardlets" | "cards";
  /** Whether each item should be clickable. */
  link: boolean;
  /** Maximum number of items. */
  max?: number;
  /** Minimum number of items. */
  min?: number;
  /** Whether multiple selection is allowed. */
  multiple: boolean;
  /** API path of the field's parent model (`filepicker` only). */
  parent?: string;
  /** Query for available items. */
  query?: string;
  /** Whether the picker shows a search field. */
  search: boolean;
  /** Layout size for cards. */
  size: "tiny" | "small" | "medium" | "large" | "huge" | "full" | "auto";
  /** Reference saved in the content file. */
  store: "uuid" | "id";
  /** Whether the picker includes subpages (`pagepicker` only). */
  subpages?: boolean;
  /** Text template for each item. */
  text?: string;
  /**
   * Upload settings like the accepted file types, or `false` when uploads are
   * off (`filepicker` only).
   */
  uploads?: false | Record<string, any>;
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
  alpha: boolean;
  /** CSS color format to display and store. */
  format: "hex" | "rgb" | "hsl";
  mode: "picker" | "input" | "options";
  /** Predefined color options. */
  options: KirbyColorOption[];
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/range
 */
export interface KirbyRangeFieldProps extends KirbyFieldProps {
  type: "range";
  /** Maximum value, `100` by default. */
  max: number;
  min?: number;
  /** Step increment, or `"any"` for any decimal value. */
  step?: number | "any";
  /** Whether to show the value tooltip, or its `before` and `after` text. */
  tooltip: boolean | { after: string | null; before: string | null };
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
 * @see https://getkirby.com/docs/reference/panel/fields/multiselect
 */
export interface KirbyTagsFieldProps extends KirbyFieldProps {
  type: "tags" | "multiselect";
  /** Accepted input: any (`"all"`) or only the options (`"options"`). */
  accept: "all" | "options";
  icon: string;
  /** Display layout: `"list"` for full-width tags. */
  layout?: "list";
  /** Maximum number of tags. */
  max?: number;
  /** Minimum number of tags. */
  min?: number;
  /** Predefined tag options. */
  options: KirbyOption[];
  search: boolean | KirbyTagsSearch;
  /** Tag separator for storage (default: `,`). */
  separator: string;
  /** Whether to sort tags by dropdown position. */
  sort: boolean;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/link
 */
export interface KirbyLinkFieldProps extends KirbyFieldProps {
  type: "link";
  /** Allowed link types. */
  options: ("anchor" | "url" | "page" | "file" | "email" | "tel" | "custom")[];
}

/**
 * Column definition for structure field table display.
 */
export interface KirbyStructureColumn {
  label: string;
  width?: string;
  /** Field type for display. */
  type: string;
  /** Whether the column shows on mobile. */
  mobile?: boolean;
  align?: "left" | "center" | "right";
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
  batch: boolean;
  /** Column definitions for table display. */
  columns: Record<string, KirbyStructureColumn>;
  /** Whether to allow duplicating rows. */
  duplicate: boolean;
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
  prepend: boolean;
  /** Whether entries are sortable via drag & drop. */
  sortable: boolean;
  /** Field to sort entries by, e.g. `title desc`; disables drag & drop. */
  sortBy?: string;
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
  group: string;
  /** Maximum number of blocks. */
  max?: number;
  /** Minimum number of blocks. */
  min?: number;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 */
export interface KirbyLayoutFieldProps extends KirbyFieldProps {
  type: "layout";
  /** Placeholder text when no layouts exist. */
  empty?: string;
  /** Available block fieldsets. */
  fieldsets: Record<string, KirbyFieldsetProps>;
  fieldsetGroups?: Record<string, KirbyFieldsetGroup>;
  /** Unused drag-and-drop group; column blocks always use `layout`. */
  group: string;
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
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/writer
 */
export interface KirbyWriterFieldProps extends KirbyFieldProps {
  type: "writer";
  /** Whether to show the character counter. */
  counter: boolean;
  /** Available heading levels (1-6). */
  headings: number[];
  /** Whether only inline formatting is allowed. */
  inline: boolean;
  /**
   * Allowed marks out of `bold`, `clear`, `code`, `email`, `italic`, `link`,
   * `strike`, `sub`, `sup`, and `underline`, `true`/`false` for all or none,
   * or an object keyed by mark where `false` excludes one.
   */
  marks?: string[] | boolean | Record<string, any>;
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /**
   * Allowed nodes out of `paragraph`, `heading`, `bulletList`, `orderedList`,
   * `horizontalRule`, and `quote`, `true`/`false` for all or none, or an
   * object keyed by node where `false` excludes one.
   */
  nodes?: string[] | boolean | Record<string, any>;
  spellcheck?: boolean;
  /** Toolbar options `inline`, `marks`, and `nodes`; a boolean has no effect. */
  toolbar?: boolean | Record<string, any>;
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
  sortable: boolean;
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
  dialog: string | null;
  /** Drawer path to open on click. */
  drawer: string | null;
  icon: string | null;
  info: string | null;
  /** Link URL, `null` when unset or unsafe. */
  link: string | null;
  /** Color theme. */
  theme: string | null;
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
  size: "tiny" | "small" | "medium" | "large" | "huge";
}
// #endregion

// #region Block & Layout Values

/**
 * Block value as stored in content.
 */
export interface KirbyBlockValue {
  /** Values of the block's fields. */
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
  attrs: Record<string, any>;
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
 *   icon: "title",
 *   label: null,
 *   name: "Heading",
 *   preview: "heading",
 *   tabs: {
 *     content: {
 *       fields: { level: {...}, text: {...} }
 *     }
 *   },
 *   translate: true,
 *   type: "heading",
 *   unset: false,
 *   wysiwyg: true
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
  /** Block title template filled from the block content, e.g. `{{ text }}`. */
  label: string | null;
  /** Human-readable block name. */
  name: string;
  /**
   * Block preview to render, e.g. `fields` or `heading`; `false` disables it,
   * and without one the block type's preview applies.
   */
  preview: string | boolean | null;
  /** Tabs containing field definitions. */
  tabs: Record<string, KirbyFieldsetTab>;
  /** Whether the block is translatable. */
  translate: boolean;
  /** Block type, e.g. `text`, `heading`, or `image`. */
  type: string;
  /**
   * Blueprint flag, forced to `true` together with `disabled` for a
   * non-translatable block in a secondary language; the Panel acts on
   * `disabled` only.
   */
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
  /** Tab label; absent when the fieldset defines no `tabs`. */
  label?: string | null;
  /** Tab identifier; absent when the fieldset defines no `tabs`. */
  name?: string;
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
