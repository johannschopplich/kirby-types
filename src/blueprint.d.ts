/**
 * Blueprint type definitions for Kirby.
 *
 * Types representing field, fieldset, and option structures as returned
 * by Kirby's Form and Fieldset classes when serialized via `toArray()`.
 *
 * @see https://getkirby.com/docs/reference/panel/blueprints
 */

// -----------------------------------------------------------------------------
// Field Options
// -----------------------------------------------------------------------------

/**
 * Rendered option for select, radio, checkbox, and toggle fields.
 *
 * Represents the output of `Option->render()` which is used by
 * fields with the options mixin (select, radio, checkboxes, etc.).
 *
 * @see https://github.com/getkirby/kirby/blob/main/src/Option/Option.php
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
 */
export interface KirbyOption {
  /** Whether the option is disabled */
  disabled: boolean;
  /** Optional icon identifier */
  icon: string | null;
  /** Optional additional info text */
  info: string | null;
  /** Display text (falls back to value if not set) */
  text: string | null;
  /** Option value stored in content file */
  value: string | number | null;
}

// -----------------------------------------------------------------------------
// Field Props (Base)
// -----------------------------------------------------------------------------

/**
 * Base field props shared by all field types.
 *
 * Represents the common properties returned by `Field->toArray()`.
 * Field-specific types extend this with additional props.
 *
 * @see https://github.com/getkirby/kirby/blob/main/src/Form/Field.php
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
 */
export interface KirbyFieldProps {
  /** Optional text shown after the input */
  after?: string;
  /** Whether field receives focus on form load */
  autofocus: boolean;
  /** Optional text shown before the input */
  before?: string;
  /** Default value for new content */
  default?: any;
  /** Whether the field is disabled */
  disabled: boolean;
  /** Help text below the field (supports Markdown) */
  help?: string;
  /** Whether the field is hidden via `when` condition */
  hidden: boolean;
  /** Icon identifier */
  icon?: string;
  /** Human-readable field label */
  label?: string;
  /** Field identifier within the blueprint */
  name: string;
  /** Placeholder text for empty fields */
  placeholder?: string;
  /** Whether the field is required */
  required: boolean;
  /** Whether field values can be saved (false for info/headline fields) */
  saveable: boolean;
  /** Whether the field is translatable in multi-lang setups */
  translate: boolean;
  /** Field type identifier (e.g., `text`, `textarea`, `blocks`) */
  type: string;
  /** Current field value */
  value?: any;
  /** Conditional visibility rules */
  when?: Record<string, any>;
  /** Field width in grid (e.g., `1/1`, `1/2`, `1/3`) */
  width: string;
}

// -----------------------------------------------------------------------------
// Field Props (Type-Specific)
// -----------------------------------------------------------------------------

/**
 * Props for text fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/text
 */
export interface KirbyTextFieldProps extends KirbyFieldProps {
  type: "text" | "slug" | "url" | "email" | "tel";
  /** Value converter: `lower`, `upper`, `ucfirst`, `slug` */
  converter?: "lower" | "upper" | "ucfirst" | "slug";
  /** Whether to show character counter */
  counter: boolean;
  /** Font family: `sans-serif` or `monospace` */
  font: "sans-serif" | "monospace";
  /** Maximum character length */
  maxlength?: number;
  /** Minimum character length */
  minlength?: number;
  /** Validation regex pattern */
  pattern?: string;
  /** Whether spellcheck is enabled */
  spellcheck: boolean;
  value?: string;
}

/**
 * Props for textarea fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/textarea
 */
export interface KirbyTextareaFieldProps extends KirbyFieldProps {
  type: "textarea";
  /** Format buttons: true/false or array of allowed buttons (headlines, italic, bold, link, email, file, code, ul, ol) */
  buttons?: boolean | string[];
  /** Whether to show character counter */
  counter: boolean;
  /** File picker options (query string or config object) */
  files?: string | Record<string, any>;
  /** Font family: `sans-serif` or `monospace` */
  font: "sans-serif" | "monospace";
  /** Maximum character length */
  maxlength?: number;
  /** Minimum character length */
  minlength?: number;
  /** Textarea size */
  size?: "small" | "medium" | "large" | "huge";
  /** Whether spellcheck is enabled */
  spellcheck: boolean;
  /** Upload configuration */
  uploads?: false | string | Record<string, any>;
  value?: string;
}

/**
 * Props for number fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/number
 */
export interface KirbyNumberFieldProps extends KirbyFieldProps {
  type: "number";
  /** Maximum value */
  max?: number;
  /** Minimum value */
  min?: number;
  /** Step increment, or `"any"` to allow any decimal value */
  step?: number | "any";
  value?: number;
}

/**
 * Props for select, radio, checkboxes, multiselect, and toggles fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/select
 */
export interface KirbyOptionsFieldProps extends KirbyFieldProps {
  type: "select" | "radio" | "checkboxes" | "multiselect" | "toggles";
  /** Input acceptance mode for multiselect: `"all"` or `"options"` */
  accept?: "all" | "options";
  /** Whether to show batch select toggle (checkboxes only) */
  batch?: boolean;
  /** Number of columns for layout (radio, checkboxes) */
  columns?: number;
  /** Whether toggles should span full width */
  grow?: boolean;
  /** Whether to show labels for icon-only toggles */
  labels?: boolean;
  /** Maximum number of selected options (checkboxes, multiselect) */
  max?: number;
  /** Minimum number of selected options (checkboxes, multiselect) */
  min?: number;
  /** Available options */
  options: KirbyOption[];
  /** Whether a toggle can be deactivated on click (toggles only) */
  reset?: boolean;
  value?: string | string[];
}

/**
 * Props for toggle fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/toggle
 */
export interface KirbyToggleFieldProps extends KirbyFieldProps {
  type: "toggle";
  /** Text shown when toggle is off */
  text?: string | [string, string];
  value?: boolean;
}

/**
 * Props for date and time fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/date
 */
export interface KirbyDateFieldProps extends KirbyFieldProps {
  type: "date" | "time";
  /** Whether to show the dropdown calendar (date only) */
  calendar?: boolean;
  /** Date/time display format (dayjs tokens) */
  display?: string;
  /** Storage format for the value (from datetime mixin) */
  format?: string;
  /** Maximum date/time */
  max?: string;
  /** Minimum date/time */
  min?: string;
  /** Hour notation: `12` or `24` (time only) */
  notation?: 12 | 24;
  /** Step configuration for rounding (size and unit like `"minute"`, `"hour"`, `"day"`) */
  step?: { size: number; unit: string };
  /** Whether to include time picker (date only) */
  time?: boolean | Record<string, any>;
  value?: string;
}

/**
 * Picker item data as returned by the Panel API.
 */
export interface KirbyPickerItem {
  /** Item identifier (UUID or ID) */
  id: string;
  /** Display text */
  text?: string;
  /** Additional info text */
  info?: string;
  /** Image configuration */
  image?: Record<string, any>;
  /** Item link URL */
  link?: string;
  [key: string]: any;
}

/**
 * Props for files, pages, and users fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/files
 */
export interface KirbyFilesFieldProps extends KirbyFieldProps {
  type: "files" | "pages" | "users";
  /** Placeholder text when no items are selected */
  empty?: string;
  /** Image settings for each item */
  image?: Record<string, any>;
  /** Info text template for each item */
  info?: string;
  /** Display layout for selected items */
  layout?: "list" | "cardlets" | "cards";
  /** Whether each item should be clickable */
  link?: boolean;
  /** Maximum number of items */
  max?: number;
  /** Minimum number of items */
  min?: number;
  /** Whether multiple selection is allowed */
  multiple: boolean;
  /** Query for available items */
  query?: string;
  /** Whether to show search field in picker */
  search?: boolean;
  /** Layout size for cards */
  size?: "tiny" | "small" | "medium" | "large" | "huge" | "full" | "auto";
  /** Whether to store `"uuid"` or `"id"` in content file */
  store?: "uuid" | "id";
  /** Include subpages in picker (pages field only) */
  subpages?: boolean;
  /** Text template for each item */
  text?: string;
  /** Upload configuration (files field only) */
  uploads?: false | string | Record<string, any>;
  /** Selected items (transformed picker data, not raw IDs) */
  value?: KirbyPickerItem[];
}

/**
 * Color option for the color field.
 */
export interface KirbyColorOption {
  /** Color value (hex, rgb, or hsl) */
  value: string;
  /** Optional display text/label */
  text?: string;
}

/**
 * Props for color fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/color
 */
export interface KirbyColorFieldProps extends KirbyFieldProps {
  type: "color";
  /** Whether to allow alpha transparency */
  alpha?: boolean;
  /** CSS color format to display and store */
  format?: "hex" | "rgb" | "hsl";
  /** Color picker mode */
  mode?: "picker" | "input" | "options";
  /** Predefined color options */
  options?: KirbyColorOption[];
  value?: string;
}

/**
 * Props for range fields (slider input).
 *
 * @see https://getkirby.com/docs/reference/panel/fields/range
 */
export interface KirbyRangeFieldProps extends KirbyFieldProps {
  type: "range";
  /** Maximum value (default: 100) */
  max?: number;
  /** Minimum value */
  min?: number;
  /** Step increment, or `"any"` for any decimal value */
  step?: number | "any";
  /** Tooltip configuration (before/after text) or boolean to enable/disable */
  tooltip?: boolean | { before?: string; after?: string };
  value?: number;
}

/**
 * Search configuration for tags field.
 */
export interface KirbyTagsSearch {
  /** Maximum items to display in dropdown */
  display?: number;
  /** Minimum characters before search starts */
  min?: number;
}

/**
 * Props for tags fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/tags
 */
export interface KirbyTagsFieldProps extends KirbyFieldProps {
  type: "tags";
  /** Input acceptance: `"all"` for any input, `"options"` for predefined only */
  accept?: "all" | "options";
  /** Tag icon */
  icon?: string;
  /** Display layout: `"list"` for full-width tags */
  layout?: "list" | null;
  /** Maximum number of tags */
  max?: number;
  /** Minimum number of tags */
  min?: number;
  /** Predefined tag options */
  options?: KirbyOption[];
  /** Search configuration or boolean to enable/disable */
  search?: boolean | KirbyTagsSearch;
  /** Tag separator for storage (default: `,`) */
  separator?: string;
  /** Whether to sort tags by dropdown position */
  sort?: boolean;
  value?: string[];
}

/**
 * Props for link fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/link
 */
export interface KirbyLinkFieldProps extends KirbyFieldProps {
  type: "link";
  /** Allowed link types */
  options?: ("anchor" | "url" | "page" | "file" | "email" | "tel" | "custom")[];
  value?: string;
}

/**
 * Column definition for structure field table display.
 */
export interface KirbyStructureColumn {
  /** Column label */
  label?: string;
  /** Column width */
  width?: string;
  /** Field type for display */
  type?: string;
  /** Whether to show mobile */
  mobile?: boolean;
  /** Text alignment */
  align?: "left" | "center" | "right";
  /** Value template */
  value?: string;
  /** Before text */
  before?: string;
  /** After text */
  after?: string;
}

/**
 * Props for structure fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/structure
 */
export interface KirbyStructureFieldProps extends KirbyFieldProps {
  type: "structure";
  /** Whether to enable batch editing */
  batch?: boolean;
  /** Column definitions for table display */
  columns?: Record<string, KirbyStructureColumn>;
  /** Whether to allow duplicating rows */
  duplicate?: boolean;
  /** Placeholder text when no entries exist */
  empty?: string;
  /** Nested field definitions */
  fields: Record<string, KirbyFieldProps>;
  /** Number of entries per page before pagination */
  limit?: number;
  /** Maximum number of entries */
  max?: number;
  /** Minimum number of entries */
  min?: number;
  /** Whether to prepend new entries */
  prepend?: boolean | null;
  /** Whether entries are sortable via drag & drop */
  sortable?: boolean | null;
  /** Sort entries by field (disables drag & drop) */
  sortBy?: string;
  value?: Record<string, any>[];
}

/**
 * Props for object fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/object
 */
export interface KirbyObjectFieldProps extends KirbyFieldProps {
  type: "object";
  /** Placeholder text when no data exists */
  empty?: string;
  /** Nested field definitions */
  fields: Record<string, KirbyFieldProps>;
  value?: Record<string, any> | "";
}

/**
 * Props for blocks fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/blocks
 */
export interface KirbyBlocksFieldProps extends KirbyFieldProps {
  type: "blocks";
  /** Empty state configuration */
  empty?: string;
  /** Available block fieldsets */
  fieldsets: Record<string, KirbyFieldsetProps>;
  /** Fieldset group configuration */
  fieldsetGroups?: Record<string, KirbyFieldsetGroup>;
  /** Group name for fieldsets */
  group?: string;
  /** Maximum number of blocks */
  max?: number;
  /** Minimum number of blocks */
  min?: number;
  /** Format JSON output with indentation */
  pretty?: boolean;
  value?: KirbyBlockValue[];
}

/**
 * Props for layout fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 */
export interface KirbyLayoutFieldProps extends KirbyFieldProps {
  type: "layout";
  /** Empty state configuration */
  empty?: string;
  /** Available block fieldsets */
  fieldsets: Record<string, KirbyFieldsetProps>;
  /** Fieldset group configuration */
  fieldsetGroups?: Record<string, KirbyFieldsetGroup>;
  /** Group name for fieldsets */
  group?: string;
  /** Available layout configurations (column width arrays) */
  layouts: string[][];
  /** Maximum number of layouts */
  max?: number;
  /** Minimum number of layouts */
  min?: number;
  /** Layout selector styling options (size: `"small"`|`"medium"`|`"large"`|`"huge"`, columns count) */
  selector?: {
    size?: "small" | "medium" | "large" | "huge";
    columns?: number;
  };
  /** Layout settings fieldset (rendered via `Fieldset->toArray()`) */
  settings?: KirbyFieldsetProps;
  value?: KirbyLayoutValue[];
}

/**
 * Props for writer fields.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/writer
 */
export interface KirbyWriterFieldProps extends KirbyFieldProps {
  type: "writer";
  /** Whether to show character counter */
  counter: boolean;
  /** Available heading levels (1-6) */
  headings?: number[];
  /** Whether only inline formatting is allowed */
  inline: boolean;
  /** Available formatting marks (`bold`, `italic`, `underline`, `strike`, `code`, `link`, `email`) or `true`/`false` */
  marks?: string[] | boolean;
  /** Maximum character length */
  maxlength?: number;
  /** Minimum character length */
  minlength?: number;
  /** Available block nodes (`paragraph`, `heading`, `bulletList`, `orderedList`, `quote`) or `true`/`false` */
  nodes?: string[] | boolean;
  /** Toolbar configuration */
  toolbar?: Record<string, any>;
  value?: string;
}

/**
 * Props for entries fields.
 * A simplified structure field for single-field entries.
 *
 * @since Kirby 5.0.0
 * @see https://getkirby.com/docs/reference/panel/fields/entries
 */
export interface KirbyEntriesFieldProps extends KirbyFieldProps {
  type: "entries";
  /** Placeholder text when no entries exist */
  empty?: string;
  /** Single field definition for entry items */
  field: KirbyFieldProps;
  /** Maximum number of entries */
  max?: number;
  /** Minimum number of entries */
  min?: number;
  /** Whether entries are sortable via drag & drop */
  sortable?: boolean;
  value?: any[];
}

/**
 * Stats report item for the stats field.
 *
 * @see https://github.com/getkirby/kirby/blob/main/src/Panel/Ui/Stat.php
 */
export interface KirbyStatsReport {
  /** Report label */
  label: string;
  /** Report value (always string after toString() processing) */
  value: string;
  /** Dialog path to open on click */
  dialog?: string;
  /** Drawer path to open on click */
  drawer?: string;
  /** Icon identifier */
  icon?: string;
  /** Additional info text */
  info?: string;
  /** Link URL */
  link?: string;
  /** Color theme */
  theme?: string;
}

/**
 * Props for stats fields.
 * Display stats/metrics as cards.
 *
 * @since Kirby 5.1.0
 * @see https://getkirby.com/docs/reference/panel/fields/stats
 */
export interface KirbyStatsFieldProps extends KirbyFieldProps {
  type: "stats";
  /** Array of report objects (resolved from query if originally a string) */
  reports: KirbyStatsReport[];
  /** Card size */
  size?: "tiny" | "small" | "medium" | "large";
}

// -----------------------------------------------------------------------------
// Block & Layout Values
// -----------------------------------------------------------------------------

/**
 * Block value as stored in content.
 */
export interface KirbyBlockValue {
  /** Block content fields */
  content: Record<string, any>;
  /** Unique block identifier */
  id: string;
  /** Whether the block is hidden */
  isHidden: boolean;
  /** Block type identifier */
  type: string;
}

/**
 * Layout column value as stored in content.
 */
export interface KirbyLayoutColumnValue {
  /** Blocks in this column */
  blocks: KirbyBlockValue[];
  /** Unique column identifier */
  id: string;
  /** Column width fraction */
  width: string;
}

/**
 * Layout value as stored in content.
 */
export interface KirbyLayoutValue {
  /** Layout attributes */
  attrs: Record<string, any> | any[];
  /** Layout columns */
  columns: KirbyLayoutColumnValue[];
  /** Unique layout identifier */
  id: string;
}

// -----------------------------------------------------------------------------
// Fieldset (Block Type Definition)
// -----------------------------------------------------------------------------

/**
 * Fieldset props as returned by `Fieldset->toArray()`.
 *
 * Represents a block type definition with its fields organized in tabs.
 * Used by blocks and layout fields.
 *
 * @see https://github.com/getkirby/kirby/blob/main/src/Cms/Fieldset.php
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
 */
export interface KirbyFieldsetProps {
  /** Whether the fieldset is disabled */
  disabled: boolean;
  /** Whether the block can be edited (has fields) */
  editable: boolean;
  /** Icon identifier */
  icon: string | null;
  /** Short label for block selector */
  label: string | null;
  /** Human-readable block name */
  name: string;
  /** Preview mode: `fields`, field name, or custom component */
  preview: string | boolean | null;
  /** Tabs containing field definitions */
  tabs: Record<string, KirbyFieldsetTab>;
  /** Whether the block is translatable */
  translate: boolean;
  /** Block type identifier (e.g., `text`, `heading`, `image`) */
  type: string;
  /** Whether the fieldset should be hidden */
  unset: boolean;
  /** Whether the block uses WYSIWYG editing */
  wysiwyg: boolean;
}

/**
 * Tab within a fieldset.
 */
export interface KirbyFieldsetTab {
  /** Field definitions in this tab */
  fields: Record<string, KirbyFieldProps>;
  /** Tab label */
  label?: string;
  /** Tab identifier */
  name: string;
}

/**
 * Fieldset group for organizing block types.
 */
export interface KirbyFieldsetGroup {
  /** Group label */
  label: string;
  /** Group identifier */
  name: string;
  /** Whether the group is open by default */
  open: boolean;
  /** Block types in this group */
  sets: string[];
}

// -----------------------------------------------------------------------------
// Union Types
// -----------------------------------------------------------------------------

/**
 * Union of all field prop types.
 */
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
