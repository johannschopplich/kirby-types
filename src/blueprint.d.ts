/**
 * Blueprint type definitions for Kirby: field, fieldset, and option props as
 * the backend sends them to the Panel.
 *
 * @see https://getkirby.com/docs/reference/panel/blueprints
 */

import type { HtmlString } from "./panel/index.js";

// #region Field Options

/**
 * Rendered option of an options field like select, radio, checkboxes, or
 * toggles. In the Panel, `text` and `info` are `HtmlString`s, except in a
 * select field, where they are plain strings.
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
 * @source src/Form/Field/SelectField.php
 * @source src/Toolkit/HtmlString.php
 */
export interface KirbyOption {
  disabled: boolean;
  icon: string | null;
  info: string | HtmlString | null;
  /** Display text, falling back to `value`. */
  text: string | HtmlString | null;
  /** Value stored in the content file. */
  value: string | number | null;
}
// #endregion

// #region Field Props (Base)

/**
 * Props of a field as the backend sends them; the field-specific types extend
 * them. A field that is not an input field omits `autofocus`, `required`, and
 * `translate`, and receives `disabled` only when the current user may not
 * update the model or the field is not translatable into the current language.
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
 * @source src/Form/Field/InputField.php
 * @source src/Form/Field/DisplayField.php
 * @source src/Form/Fields.php
 * @source src/Form/Field/HiddenField.php
 * @source src/Form/Mixin/After.php
 * @source src/Form/Mixin/Autofocus.php
 * @source src/Form/Mixin/Before.php
 * @source src/Form/Mixin/DefaultValue.php
 * @source src/Form/Mixin/Disabled.php
 * @source src/Form/Mixin/Fields.php
 * @source src/Form/Mixin/Help.php
 * @source src/Form/Mixin/Icon.php
 * @source src/Form/Mixin/Name.php
 * @source src/Form/Mixin/Placeholder.php
 * @source src/Form/Mixin/Required.php
 * @source src/Form/Mixin/Translatable.php
 * @source src/Form/Mixin/Type.php
 * @source src/Form/Mixin/When.php
 * @source src/Form/Mixin/Width.php
 * @source src/Cms/Fieldset.php
 * @source src/Panel/Controller/Dialog/ModelCreateDialogController.php
 * @source src/Toolkit/HtmlString.php
 */
export interface KirbyFieldProps {
  /** Text shown after the input. */
  after?: string;
  /** Whether the field receives focus when the form loads. */
  autofocus?: boolean;
  /** Text shown before the input. */
  before?: string;
  /**
   * Default value for new content; sent only for fields in a structure,
   * object, or fieldset, and in the create dialog.
   */
  default?: any;
  disabled?: boolean;
  /**
   * Help text below the field, rendered from KirbyText to HTML; an
   * `HtmlString` in the Panel.
   */
  help?: string | HtmlString;
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

/**
 * Props of an input field. Every built-in field type that stores a value is
 * one, except `hidden`.
 *
 * @source src/Form/Mixin/Label.php
 */
export interface KirbyInputFieldProps extends KirbyFieldProps {
  autofocus: boolean;
  disabled: boolean;
  label: string;
  required: boolean;
  translate: boolean;
  width: string;
}
// #endregion

// #region Fieldset (Block Type Definition)

/**
 * Tab within a fieldset.
 *
 * @source src/Cms/Fieldset.php
 * @source panel/src/components/Layout/Tabs.vue
 */
export interface KirbyFieldsetTab {
  /** Field definitions in this tab. */
  fields: Record<string, KirbyFieldProps>;
  /** Tab label; absent when the fieldset defines no `tabs`. */
  label?: string | null;
  /** Tab identifier; absent when the fieldset defines no `tabs`. */
  name?: string;
  /**
   * Further options the blueprint sets on the tab, such as `icon` or `badge`.
   */
  [key: string]: any;
}

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
 * @source panel/src/components/Forms/Blocks/Block.vue
 * @source panel/src/components/Forms/Blocks/Blocks.vue
 * @source panel/src/components/Forms/Blocks/Types/Fields.vue
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
  /**
   * Whether the block is edited in place: a newly added block gets focus
   * instead of opening its drawer, and the `fields` preview edits its fields
   * inline.
   */
  wysiwyg: boolean;
}

/**
 * Fieldset group for organizing block types.
 *
 * @source src/Cms/Fieldsets.php
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

// #region Field Props (Type-Specific)

/**
 * @see https://getkirby.com/docs/reference/panel/fields/text
 * @source src/Form/Field/TextField.php
 * @source src/Form/Field/SlugField.php
 * @source src/Form/Field/UrlField.php
 * @source src/Form/Field/EmailField.php
 * @source src/Form/Field/TelField.php
 * @source src/Form/Field/PasswordField.php
 * @source src/Form/Mixin/Autocomplete.php
 * @source src/Form/Mixin/Converter.php
 * @source src/Form/Mixin/Counter.php
 * @source src/Form/Mixin/Font.php
 * @source src/Form/Mixin/Maxlength.php
 * @source src/Form/Mixin/Minlength.php
 * @source src/Form/Mixin/Pattern.php
 * @source src/Form/Mixin/Spellcheck.php
 * @source panel/src/components/Forms/Field/PasswordField.vue
 * @source panel/src/components/Forms/Field/SlugField.vue
 * @source panel/src/helpers/string.ts
 */
export interface KirbyTextFieldProps extends KirbyInputFieldProps {
  type: "text" | "slug" | "url" | "email" | "tel" | "password";
  /**
   * Regex character class the slug may contain, replacing `a-z0-9` (slug
   * only).
   */
  allow?: string;
  /** HTML `autocomplete` attribute of the input. */
  autocomplete?: string;
  /** Converter applied to the value before it is saved. */
  converter?: "label" | "lower" | "upper" | "ucfirst" | "slug";
  /** Whether to show the character counter. */
  counter: boolean;
  font: "sans-serif" | "monospace";
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length; `8` for `password` when unset. */
  minlength?: number;
  /**
   * Prefix of the slug preview below the field, which `help` replaces (slug
   * only).
   */
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
 * Upload options of a field. Options without a value are left out.
 *
 * @source src/Form/Field/ModelPickerField.php
 * @source src/Form/Mixin/Upload.php
 */
export interface KirbyFieldUploads {
  /**
   * Accepted file types; those of `template` when set, else the `accept` set
   * in the blueprint, else `"*"`.
   */
  accept?: string;
  /**
   * Query for the model that stores the uploads; the field's model when unset.
   */
  parent?: string;
  /** Image settings of the field's items (`filepicker` only). */
  preview?: string | Record<string, any>;
  /** File template assigned to uploaded files. */
  template?: string;
  [key: string]: any;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/textarea
 * @source src/Form/Field/TextareaField.php
 * @source src/Form/Mixin/Counter.php
 * @source src/Form/Mixin/Font.php
 * @source src/Form/Mixin/Maxlength.php
 * @source src/Form/Mixin/Minlength.php
 * @source src/Form/Mixin/Spellcheck.php
 * @source src/Form/Mixin/Upload.php
 * @source panel/src/components/Forms/Input/TextareaInput.vue
 */
export interface KirbyTextareaFieldProps extends KirbyInputFieldProps {
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
  /** Upload options, or `false` without uploads. */
  uploads: false | KirbyFieldUploads;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/number
 * @source src/Form/Field/NumberField.php
 */
export interface KirbyNumberFieldProps extends KirbyInputFieldProps {
  type: "number";
  max?: number;
  min?: number;
  /** Step increment, or `"any"` to allow any decimal value. */
  step?: number | "any";
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/select
 * @source src/Form/Field/SelectField.php
 * @source src/Form/Field/RadioField.php
 * @source src/Form/Field/CheckboxesField.php
 * @source src/Form/Field/TogglesField.php
 * @source src/Form/Field/OptionsField.php
 * @source src/Form/Mixin/Batch.php
 * @source src/Form/Mixin/Columns.php
 * @source src/Form/Mixin/Max.php
 * @source src/Form/Mixin/Min.php
 * @source src/Form/Mixin/Options.php
 */
export interface KirbyOptionsFieldProps extends KirbyInputFieldProps {
  type: "select" | "radio" | "checkboxes" | "toggles";
  /** Whether to show batch select toggle (checkboxes only). */
  batch?: boolean;
  /** Number of columns for layout (radio, checkboxes). */
  columns?: number;
  /** Whether the toggles span the full width (toggles only). */
  grow?: boolean;
  /** Whether to show labels for icon-only toggles (toggles only). */
  labels?: boolean;
  /** Maximum number of selected options (checkboxes only). */
  max?: number;
  /**
   * Minimum number of selected options (checkboxes only); `1` when unset on a
   * required field, and setting it makes the field required.
   */
  min?: number;
  options: KirbyOption[];
  /** Whether a toggle can be deactivated on click (toggles only). */
  reset?: boolean;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/toggle
 * @source src/Form/Field/ToggleField.php
 * @source src/Toolkit/HtmlString.php
 */
export interface KirbyToggleFieldProps extends KirbyInputFieldProps {
  type: "toggle";
  /**
   * Text next to the toggle, or a pair of texts for off and on; `HtmlString`s
   * in the Panel.
   */
  text?: string | HtmlString | [string | HtmlString, string | HtmlString];
}

/**
 * `min` and `max` are formatted `Y-m-d`, `Y-m-d H:i:s` with a `time` input,
 * or `H:i:s` for `time`.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/date
 * @source src/Form/Field/DateField.php
 * @source src/Form/Field/TimeField.php
 * @source src/Form/Field/DateTimeField.php
 * @source src/Toolkit/Date.php
 */
export interface KirbyDateFieldProps extends KirbyInputFieldProps {
  type: "date" | "time";
  /** Whether to show the dropdown calendar (date only). */
  calendar?: boolean;
  /** Date/time display format (dayjs tokens). */
  display: string;
  /**
   * PHP `date()` format the value is saved in; when unset, `Y-m-d`,
   * `Y-m-d H:i:s` with a `time` input, or `H:i:s` for `time`.
   */
  format: string;
  /** Latest allowed value. */
  max?: string;
  /** Earliest allowed value. */
  min?: string;
  /** Hour notation (time only). */
  notation?: 12 | 24;
  /**
   * Rounding step: a `size` of a `unit` like `"minute"`, `"hour"`, or `"day"`;
   * with a `time` input, the time input's step.
   */
  step: { size: number; unit: string };
  /** Props of the time input, or `false` without one (date only). */
  time?: false | KirbyDateFieldProps;
}

/**
 * Panel preview image of a page, file, user, or site. `url`, `src`, and
 * `srcset` are set only when the model has an image file.
 *
 * @source src/Panel/Model.php
 * @source src/Panel/User.php
 */
export interface KirbyModelImage {
  /** Background behind the image or icon, such as `"pattern"` or `"black"`. */
  back: string;
  /** Icon color, such as `"gray-500"`. */
  color: string;
  /** Whether the image fills its frame instead of fitting into it. */
  cover: boolean;
  /** Icon shown without an image file, such as `"page"`. */
  icon: string;
  url?: string;
  src?: string;
  srcset?: string | null;
  /** Further image options from the blueprint, such as `ratio`. */
  [key: string]: any;
}

/**
 * Page, file, or user item as the Panel API returns it for pickers and lists.
 * An item the current user may not list, or whose model no longer exists,
 * stands in with the stored reference as `id` and `uuid`, plain-string
 * `text`, `info: null`, `link: false`, and empty `permissions`.
 *
 * @source src/Panel/Ui/Item.php
 * @source src/Panel/Ui/Item/ModelItem.php
 * @source src/Panel/Ui/Item/ProtectedItem.php
 * @source src/Panel/Ui/Item/MissingItem.php
 */
export interface KirbyModelItem {
  id: string;
  /** `null` with UUIDs disabled. */
  uuid: string | null;
  /** Display text, an `HtmlString` for every layout except `table`. */
  text: string | HtmlString;
  /** Info text, an `HtmlString` for every layout except `table`. */
  info: string | HtmlString | null;
  image: KirbyModelImage | null;
  /** Panel path of the model. */
  link: string | false;
  /** Layout of the field the item belongs to. */
  layout: "list" | "cardlets" | "cards" | "table";
  /** Current user's permissions on the model. */
  permissions: Record<string, boolean> | [];
  [key: string]: any;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/files
 * @source src/Form/Field/ModelPickerField.php
 * @source src/Form/Field/FilePickerField.php
 * @source src/Form/Field/PagePickerField.php
 * @source src/Form/Mixin/ItemSize.php
 * @source src/Form/Mixin/Min.php
 * @source src/Form/Mixin/Upload.php
 * @source src/Blueprint/Normalizer.php
 * @source src/Panel/Model.php
 */
export interface KirbyModelPickerFieldProps extends KirbyInputFieldProps {
  /** Picker type, also for blueprints that set `files`, `pages`, or `users`. */
  type: "filepicker" | "pagepicker" | "userpicker";
  /** Placeholder text when no items are selected. */
  empty?: string;
  /**
   * Image settings for each item, a query string, `"icon"` to show only the
   * icon, or `false` for none.
   */
  image?: false | string | Record<string, any>;
  /** Info text template for each item. */
  info?: string;
  /** Display layout for selected items. */
  layout: "list" | "cardlets" | "cards";
  /** Whether each item should be clickable. */
  link: boolean;
  /** Maximum number of items. */
  max?: number;
  /**
   * Minimum number of items; `1` when unset on a required field, and setting
   * it makes the field required.
   */
  min?: number;
  /** Whether multiple selection is allowed. */
  multiple: boolean;
  /**
   * API path of the model the blueprint's `parent` query resolves to, else of
   * the field's own model (`filepicker` only).
   */
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
  /** Upload options, or `false` without uploads (`filepicker` only). */
  uploads?: false | KirbyFieldUploads;
}

/**
 * Column of a files or pages list in `layout: table`.
 *
 * @source src/Form/Field/ModelListField.php
 * @source src/Form/Field/PageListField.php
 */
export interface KirbyModelListColumn {
  label: string;
  width?: string;
  /** Field type for display; absent on a blueprint column that sets none. */
  type?: string;
  /** Whether the column shows on mobile. */
  mobile?: boolean;
  align?: "left" | "center" | "right";
  /** Text shown before the value. */
  before?: string;
  /** Text shown after the value. */
  after?: string;
  /**
   * Field the column reads its value from; absent on the built-in `image`,
   * `title`, `info`, and `flag` columns unless the blueprint redefines them.
   */
  id?: string;
  /** Further options the blueprint sets on the column. */
  [key: string]: any;
}

/**
 * List of files or pages, by default the model's own. The entries load from
 * the field's own API endpoint, not from the props.
 *
 * @source src/Form/Field/ModelListField.php
 * @source src/Form/Field/FileListField.php
 * @source src/Form/Field/PageListField.php
 * @source src/Form/Mixin/Batch.php
 * @source src/Form/Mixin/ItemSize.php
 * @source src/Blueprint/Normalizer.php
 */
export interface KirbyModelListFieldProps extends KirbyFieldProps {
  /** List type, also for blueprints that set a `files` or `pages` section. */
  type: "filelist" | "pagelist";
  /**
   * File types the `template` file blueprint accepts, as an HTML `accept`
   * value (`filelist` only).
   */
  accept?: string;
  batch: boolean;
  /** Column definitions for `layout: table`; an empty array otherwise. */
  columns: Record<string, KirbyModelListColumn> | [];
  /** Text for the empty state. */
  empty?: string;
  layout: "list" | "cardlets" | "cards" | "table";
  /**
   * Panel path of the model the entries come from; absent when that is the
   * field's own model.
   */
  link?: string;
  /** Maximum number of entries. */
  max?: number;
  /** Minimum number of entries. */
  min?: number;
  /** Whether the list offers a search to filter its entries. */
  searchable: boolean;
  /** Card size for `layout: cards`. */
  size: "tiny" | "small" | "medium" | "large" | "huge" | "full" | "auto";
}

/**
 * Color option for the color field.
 *
 * @source src/Form/Field/ColorField.php
 * @source src/Toolkit/HtmlString.php
 */
export interface KirbyColorOption {
  /** Color value (hex, rgb, or hsl). */
  value: string;
  /**
   * Label of the color, an `HtmlString` in the Panel; absent when the
   * blueprint lists bare values.
   */
  text?: string | HtmlString;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/color
 * @source src/Form/Field/ColorField.php
 */
export interface KirbyColorFieldProps extends KirbyInputFieldProps {
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
 * @source src/Form/Field/RangeField.php
 * @source src/Form/Field/NumberField.php
 * @source panel/src/components/Forms/Input/RangeInput.vue
 */
export interface KirbyRangeFieldProps extends KirbyInputFieldProps {
  type: "range";
  /** Maximum value, `100` when unset. */
  max: number;
  /** Minimum value, `0` when unset. */
  min?: number;
  /** Step increment, `1` when unset, or `"any"` for any decimal value. */
  step?: number | "any";
  /** Whether to show the value tooltip, or its `before` and `after` text. */
  tooltip: boolean | { after: string | null; before: string | null };
}

/**
 * Search configuration for tags field.
 *
 * @source panel/src/components/Forms/Input/PicklistInput.vue
 */
export interface KirbyTagsSearch {
  /** Maximum items to display in dropdown. */
  display?: number;
  /** Whether the search also matches the options' info text. */
  info?: boolean;
  /** Minimum characters before search starts. */
  min?: number;
  placeholder?: string;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/tags
 * @see https://getkirby.com/docs/reference/panel/fields/multiselect
 * @source src/Form/Field/TagsField.php
 * @source src/Form/Field/MultiselectField.php
 * @source src/Form/Field/OptionsField.php
 * @source src/Form/Mixin/Max.php
 * @source src/Form/Mixin/Min.php
 * @source src/Form/Mixin/Options.php
 * @source src/Form/Mixin/Separator.php
 */
export interface KirbyTagsFieldProps extends KirbyInputFieldProps {
  type: "tags" | "multiselect";
  /** Accepted input: any (`"all"`) or only the options (`"options"`). */
  accept: "all" | "options";
  icon: string;
  /** Display layout: `"list"` for full-width tags. */
  layout?: "list";
  /** Maximum number of tags. */
  max?: number;
  /**
   * Minimum number of tags; `1` when unset on a required field, and setting it
   * makes the field required.
   */
  min?: number;
  /** Predefined tag options. */
  options: KirbyOption[];
  search: boolean | KirbyTagsSearch;
  /** Separator between the stored tags, `,` when unset. */
  separator: string;
  /** Whether to sort tags by dropdown position. */
  sort: boolean;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/link
 * @source src/Form/Field/LinkField.php
 */
export interface KirbyLinkFieldProps extends KirbyInputFieldProps {
  type: "link";
  /** Allowed link types. */
  options: ("anchor" | "url" | "page" | "file" | "email" | "tel" | "custom")[];
}

/**
 * Column definition for structure field table display.
 *
 * @source src/Form/Mixin/TableColumns.php
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
  /** Further options the blueprint sets on the column, such as `display`. */
  [key: string]: any;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/structure
 * @source src/Form/Field/StructureField.php
 * @source src/Form/Mixin/Batch.php
 * @source src/Form/Mixin/Duplicate.php
 * @source src/Form/Mixin/Fields.php
 * @source src/Form/Mixin/Min.php
 * @source src/Form/Mixin/Prepend.php
 * @source src/Form/Mixin/Sortable.php
 * @source src/Form/Mixin/SortBy.php
 * @source src/Form/Mixin/TableColumns.php
 */
export interface KirbyStructureFieldProps extends KirbyInputFieldProps {
  type: "structure";
  /** Whether to enable batch editing. */
  batch: boolean;
  /**
   * Column definitions for table display; an empty array when no field yields
   * a column.
   */
  columns: Record<string, KirbyStructureColumn> | [];
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
  /**
   * Minimum number of entries; `1` when unset on a required field, and setting
   * it makes the field required.
   */
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
 * @source src/Form/Field/ObjectField.php
 * @source src/Form/Mixin/Fields.php
 */
export interface KirbyObjectFieldProps extends KirbyInputFieldProps {
  type: "object";
  /** Placeholder text when no data exists. */
  empty?: string;
  /** Nested field definitions. */
  fields: Record<string, KirbyFieldProps>;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/blocks
 * @source src/Form/Field/BlocksField.php
 * @source src/Form/Mixin/Min.php
 * @source panel/src/components/Forms/Blocks/Blocks.vue
 */
export interface KirbyBlocksFieldProps extends KirbyInputFieldProps {
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
  /**
   * Minimum number of blocks; `1` when unset on a required field, and setting
   * it makes the field required.
   */
  min?: number;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/layout
 * @source src/Form/Field/LayoutField.php
 * @source src/Form/Field/BlocksField.php
 * @source src/Form/Mixin/Min.php
 * @source panel/src/components/Forms/Layouts/LayoutColumn.vue
 * @source panel/src/components/Forms/Layouts/LayoutSelector.vue
 */
export interface KirbyLayoutFieldProps extends KirbyInputFieldProps {
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
  /**
   * Minimum number of layouts; `1` when unset on a required field, and setting
   * it makes the field required.
   */
  min?: number;
  /** Size and column count of the layout selector. */
  selector?: {
    /** Dialog size, `medium` when omitted. */
    size?: "small" | "medium" | "large" | "huge";
    /** Number of columns, `3` when omitted. */
    columns?: number;
  };
  /** Fieldset for each layout's settings. */
  settings?: KirbyFieldsetProps;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/writer
 * @source src/Form/Field/WriterField.php
 * @source src/Form/Field/ProseMirrorField.php
 * @source src/Form/Mixin/Counter.php
 * @source src/Form/Mixin/Maxlength.php
 * @source src/Form/Mixin/Minlength.php
 * @source src/Form/Mixin/Spellcheck.php
 * @source panel/src/components/Forms/Input/WriterInput.vue
 * @source panel/src/helpers/writer.ts
 */
export interface KirbyWriterFieldProps extends KirbyInputFieldProps {
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
   * or an object keyed by mark where `false` excludes one; all marks when
   * unset.
   */
  marks?: string[] | boolean | Record<string, any>;
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /**
   * Allowed nodes out of `paragraph`, `heading`, `bulletList`, `orderedList`,
   * `horizontalRule`, and `quote`, `true`/`false` for all or none, or an
   * object keyed by node where `false` excludes one; `heading`,
   * `bulletList`, and `orderedList` when unset.
   */
  nodes?: string[] | boolean | Record<string, any>;
  spellcheck?: boolean;
  /** Toolbar options `inline`, `marks`, and `nodes`; a boolean has no effect. */
  toolbar?: boolean | Record<string, any>;
}

/**
 * @see https://getkirby.com/docs/reference/panel/fields/list
 * @source src/Form/Field/ListField.php
 * @source src/Form/Field/ProseMirrorField.php
 * @source src/Form/Mixin/Maxlength.php
 * @source src/Form/Mixin/Minlength.php
 * @source src/Form/Mixin/Spellcheck.php
 * @source panel/src/components/Forms/Input/ListInput.vue
 * @source panel/src/components/Forms/Input/WriterInput.vue
 * @source panel/src/helpers/writer.ts
 */
export interface KirbyListFieldProps extends KirbyInputFieldProps {
  type: "list";
  /**
   * Allowed marks out of `bold`, `clear`, `code`, `email`, `italic`, `link`,
   * `strike`, `sub`, `sup`, and `underline`, `true`/`false` for all or none,
   * or an object keyed by mark where `false` excludes one; all marks when
   * unset.
   */
  marks?: string[] | boolean | Record<string, any>;
  /** Maximum character length. */
  maxlength?: number;
  /** Minimum character length. */
  minlength?: number;
  /** Allowed list types out of `bulletList` and `orderedList`. */
  nodes?: string[] | boolean | Record<string, any>;
  spellcheck?: boolean;
  /** Toolbar options `inline`, `marks`, and `nodes`; a boolean has no effect. */
  toolbar?: boolean | Record<string, any>;
}

/**
 * Simplified structure field with a single field per entry.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/entries
 * @source src/Form/Field/EntriesField.php
 * @source src/Form/Mixin/Min.php
 * @source src/Form/Mixin/Sortable.php
 */
export interface KirbyEntriesFieldProps extends KirbyInputFieldProps {
  type: "entries";
  /** Placeholder text when no entries exist. */
  empty?: string;
  /** Field each entry holds. */
  field: KirbyFieldProps;
  /** Maximum number of entries. */
  max?: number;
  /**
   * Minimum number of entries; `1` when unset on a required field, and setting
   * it makes the field required.
   */
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
  theme: string | null;
}

/**
 * Field showing reports as cards.
 *
 * @see https://getkirby.com/docs/reference/panel/fields/stats
 * @source src/Form/Field/StatsField.php
 * @source src/Panel/Ui/Stats.php
 * @source panel/src/components/Layout/Stats.vue
 */
export interface KirbyStatsFieldProps extends KirbyFieldProps {
  type: "stats";
  /** Reports, resolved from a query if the blueprint sets a string. */
  reports: KirbyStatsReport[];
  /** Text size of each report's value, `large` when unset. */
  size: "tiny" | "small" | "medium" | "large" | "huge";
}
// #endregion

// #region Union Types

export type KirbyAnyFieldProps =
  | KirbyFieldProps
  | KirbyInputFieldProps
  | KirbyTextFieldProps
  | KirbyTextareaFieldProps
  | KirbyNumberFieldProps
  | KirbyOptionsFieldProps
  | KirbyToggleFieldProps
  | KirbyDateFieldProps
  | KirbyModelPickerFieldProps
  | KirbyModelListFieldProps
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
  | KirbyListFieldProps
  | KirbyStatsFieldProps;
// #endregion
