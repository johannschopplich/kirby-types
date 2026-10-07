/**
 * Helper type definitions for Kirby Panel.
 *
 * Provides types for the `$helper` utilities available on the Vue prototype.
 */

// #region Array Helpers

/**
 * @source panel/src/helpers/array.ts
 */
export interface PanelArraySearchOptions {
  /** Query length at or below which the array is returned unfiltered (default: `0`). */
  min?: number;
  /** Field to search in (default: `"text"`). */
  field?: string;
  /** Maximum results to return. */
  limit?: number;
}

/**
 * @source panel/src/helpers/array.ts
 */
export interface PanelHelpersArray {
  /**
   * Returns an array as-is, an object's values otherwise, and `[]` for `null`
   * or `undefined`.
   */
  fromObject: <T>(object: T[] | Record<string, T> | null | undefined) => T[];

  /**
   * Filters items whose `options.field` value contains the query,
   * case-insensitively; items with an empty field are dropped.
   *
   * @param query - Search query; `null` and `undefined` throw unless
   *   `options.min` reaches the length of their string form.
   */
  search: <T extends Record<string, any>>(
    array: T[],
    query: string | null | undefined,
    options?: PanelArraySearchOptions,
  ) => T[];

  /**
   * Sorts the array in place by field and direction, case-insensitively.
   *
   * @param sortBy - Sort specification (e.g., `"name asc"`, `"date desc"`)
   */
  sortBy: <T extends Record<string, any>>(array: T[], sortBy: string) => T[];

  /**
   * Splits array into subarrays at every occurrence of the string delimiter.
   * The delimiter itself is not included in the output.
   *
   * @param array - Array to split
   * @param delimiter - String element to split on
   * @returns Array of subarrays
   */
  split: <T>(array: T[], delimiter: string) => T[][];

  /**
   * Wraps non-array values in an array.
   *
   * @param array - Value to wrap
   * @returns Original array or wrapped value
   */
  wrap: <T>(array: T | T[]) => T[];
}
// #endregion

// #region String Helpers

/**
 * Ordered character maps applied before slugging; each key is replaced
 * literally by its value.
 *
 * @source panel/src/helpers/string.ts
 */
export type PanelSlugRules = Record<string, string>[];

/**
 * @source panel/src/helpers/string.ts
 */
export interface PanelHelpersString {
  /**
   * Converts camelCase to kebab-case.
   */
  camelToKebab: (string: string) => string;

  /**
   * Escapes HTML special characters.
   */
  escapeHTML: (string: unknown) => string;

  /**
   * Checks if the value is a string containing an emoji. Digits, `#`, and `*`
   * count as emoji unless the string consists only of lowercase letters,
   * digits, `_`, and `-`.
   */
  hasEmoji: (string: unknown) => boolean;

  /**
   * Checks if a string is shaped like an email address.
   *
   * @param string - String to check
   * @param strict - Reject a trailing query/hash after the domain
   * @returns `true` if the string looks like an email address
   * @since 5.4.4
   */
  isEmail: (string: unknown, strict?: boolean) => boolean;

  /**
   * Checks if string is empty or falsy.
   *
   * @returns `true` if empty
   */
  isEmpty: (string: unknown) => boolean;

  /**
   * Converts first letter to lowercase.
   */
  lcfirst: (string: string) => string;

  /**
   * Strips every leading repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   *
   * @param replace - Substring to strip repeatedly
   */
  ltrim: (string: string, replace?: string) => string;

  /**
   * Prefixes string with zeros until length is reached.
   *
   * @param length - Target length (default: `2`)
   */
  pad: (value: string | number, length?: number) => string;

  /**
   * Generates random alphanumeric string.
   *
   * @param length - String length
   */
  random: (length: number) => string;

  /**
   * Strips every trailing repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   *
   * @param replace - Substring to strip repeatedly
   */
  rtrim: (string: string, replace?: string) => string;

  /**
   * Sanitizes HTML by only keeping allowed marks and nodes.
   *
   * @param html - HTML to sanitize; a falsy value returns `""`
   * @param options - Allowed marks and nodes
   * @param options.marks - Allowed marks: `true` for all, `false` for none, an array of mark names, or a map of mark name to `true`, `false`, or mark options (default: `bold`, `code`, `italic`, `link`, `strike`, `sub`, `sup`, `underline`)
   * @param options.nodes - Allowed nodes, in the same forms as `marks`; `doc`, `text`, and `paragraph` are always installed (default: inline content only, which flattens block structure)
   * @since 5.5.0
   */
  sanitizeHTML: (
    html: unknown,
    options?: {
      marks?: boolean | string[] | Record<string, unknown> | null;
      nodes?: boolean | string[] | Record<string, unknown> | null;
    },
  ) => string;

  /**
   * Converts string to ASCII slug.
   *
   * @param rules - Language/ASCII conversion rules
   * @param allowed - Allowed characters (default: `"a-z0-9"`)
   * @param separator - Separator character (default: `"-"`)
   */
  slug: (
    string: string,
    rules?: PanelSlugRules,
    allowed?: string,
    separator?: string,
  ) => string;

  /**
   * Strips HTML tags from string.
   */
  stripHTML: (string: string) => string;

  /**
   * Replaces `{name}`, `{{name}}`, and dotted-path placeholders (e.g. `{nested.prop}`) with values from the lookup object.
   * An unresolved placeholder renders as `…`.
   *
   * @param values - Replacement values
   */
  template: (string: string, values?: Record<string, any>) => string;

  /**
   * Converts first letter to uppercase.
   */
  ucfirst: (string: string) => string;

  /**
   * Converts first letter of each word to uppercase.
   */
  ucwords: (string: string) => string;

  /**
   * Converts HTML entities back to characters.
   */
  unescapeHTML: (string: string) => string;

  /**
   * Generates a UUID v4 string.
   */
  uuid: () => string;
}
// #endregion

// #region Object Helpers

/**
 * @source panel/src/helpers/object.ts
 */
export interface PanelHelpersObject {
  /**
   * Deep clones a value. Returns `undefined` unchanged.
   * Uses `structuredClone`.
   *
   * @param value - Value to clone
   * @returns Cloned value
   */
  clone: { <T>(value: T): T; (): undefined };

  /**
   * Filters object entries by predicate.
   *
   * @since 5.0.0
   */
  filter: <T extends Record<string, any>>(
    object: T,
    predicate: (value: T[keyof T], key: string) => boolean,
  ) => Partial<T>;

  /**
   * Checks if value is empty (`null`, `undefined`, `""`, empty object/array).
   *
   * @returns `true` if empty
   */
  isEmpty: (value: unknown) => boolean;

  /**
   * Checks if input is a plain object (not array, `null`, etc.).
   *
   * @returns `true` if plain object
   */
  isObject: (input: unknown) => input is Record<string, unknown>;

  /**
   * Counts keys in an object.
   *
   * @returns Number of keys
   */
  length: (object?: Record<string, any> | null) => number;

  /**
   * Recursively merges source into target. Mutates the target and the
   * source's nested objects, which the target then references.
   *
   * @param target - Target object (default: a new empty object)
   * @returns The mutated target
   */
  merge: <
    T extends Record<string, any> = Record<string, any>,
    S extends Record<string, any> = Partial<T>,
  >(
    target?: T,
    source?: S,
  ) => T & S;

  /**
   * Compares objects by JSON stringification.
   *
   * @param a - First object
   * @param b - Second object
   * @returns `true` if identical
   */
  same: (a: unknown, b: unknown) => boolean;

  /**
   * Converts all object keys to lowercase.
   *
   * @returns Object with lowercase keys
   */
  toLowerKeys: <T>(obj: Record<string, T>) => Record<string, T>;
}
// #endregion

// #region URL Helpers

/**
 * @source panel/src/helpers/url.ts
 */
export interface PanelHelpersUrl {
  /**
   * Returns the base URL from the `<base>` element or window origin.
   */
  base: () => URL;

  /**
   * Builds `URLSearchParams` from the origin's query, with each query entry
   * set over it as a string; `null` values are skipped.
   *
   * @param origin - Existing query as a URL, a query string, or a record
   */
  buildQuery: (
    query?: Record<string, unknown>,
    origin?: string | Record<string, string> | URL,
  ) => URLSearchParams;

  /**
   * Resolves `url` to a URL object and sets the query entries on its search
   * params. A `URL` instance is mutated and returned.
   *
   * @param origin - Base origin URL
   */
  buildUrl: (
    url?: string | URL,
    query?: Record<string, unknown>,
    origin?: string | URL,
  ) => URL;

  /**
   * Checks if a URL begins with a dangerous URI scheme (e.g. `javascript:`,
   * `vbscript:`, `data:`) after stripping ignorable characters.
   *
   * @returns `true` if the URL uses a dangerous scheme
   * @since 5.4.4
   */
  hasDangerousScheme: (url: unknown) => boolean;

  /**
   * Checks if URL string starts with `http://` or `https://`.
   *
   * @returns `true` if absolute
   */
  isAbsolute: (url: unknown) => boolean;

  /**
   * Checks if URL is on the same origin as current page.
   *
   * @returns `true` if same origin
   */
  isSameOrigin: (url: string | URL) => boolean;

  /**
   * Checks if the value is a `URL`, a `Location`, or a string that resolves
   * against the current page, which nearly any string does.
   *
   * @param strict - Also check the value against Kirby's URL validator
   */
  isUrl: (url: unknown, strict?: boolean) => url is URL | Location | string;

  /**
   * Prefixes a path with `origin`; a path starting with `http://` or
   * `https://` comes back unchanged.
   *
   * @param origin - Base for a relative path (default: the base URL)
   */
  makeAbsolute: (path: string | URL, origin?: string | URL) => string;

  /**
   * Converts a URL string to a URL object; a `URL` instance comes back as-is.
   *
   * @param url - URL string or object
   * @param origin - Base for a relative path (default: the base URL)
   */
  toObject: (url: string | URL, origin?: string | URL) => URL;
}
// #endregion

// #region Clipboard Helpers

/**
 * @source panel/src/helpers/clipboard.ts
 */
export interface PanelHelpersClipboard {
  /**
   * Reads a string as-is or the content of a `ClipboardEvent`, preventing its
   * default. Prefers HTML over plain text and turns non-breaking spaces into
   * spaces.
   *
   * @param event - Clipboard event or string; any other event yields `null`
   * @param plain - Read only the plain text, without the space normalization
   * @returns Clipboard content, or `null` when nothing could be read
   */
  read: (event?: Event | string | null, plain?: boolean) => string | null;

  /**
   * Writes to the clipboard; every non-string value is JSON-stringified. Sets
   * the plain text of a `ClipboardEvent`, otherwise copies through a temporary
   * textarea.
   *
   * @param event - Clipboard event to write to
   * @returns Always `true` (no failure detection)
   */
  write: (value: unknown, event?: Event) => boolean;
}
// #endregion

// #region Embed Helpers

/**
 * Embed helper utilities for video providers.
 *
 * @source panel/src/helpers/embed.ts
 */
export interface PanelHelpersEmbed {
  /**
   * Converts YouTube URL to embed URL.
   *
   * @param url - YouTube video URL
   * @param doNotTrack - Enable privacy-enhanced mode
   * @returns Embed URL or `false` if not valid
   */
  youtube: (url: string, doNotTrack?: boolean) => string | false;

  /**
   * Converts Vimeo URL to embed URL.
   *
   * @param url - Vimeo video URL
   * @param doNotTrack - Enable do-not-track mode
   * @returns Embed URL or `false` if not valid
   */
  vimeo: (url: string, doNotTrack?: boolean) => string | false;

  /**
   * Auto-detects provider and converts to embed URL.
   *
   * @returns Embed URL or `false` if not valid
   */
  video: (url: string, doNotTrack?: boolean) => string | false;
}
// #endregion

// #region Field Helpers

/**
 * @source panel/src/helpers/field.ts
 */
export interface PanelFieldDefinition {
  type?: string;
  name?: string;
  default?: any;
  disabled?: boolean;
  hidden?: boolean;
  /** Conditional visibility. */
  when?: Record<string, any>;
  /** API endpoint paths of the field, its section, and its model. */
  endpoints?: { field?: string; section?: string; model?: string };
  fields?: Record<string, PanelFieldDefinition>;
  /** Name of the parent field, set on subfields by `subfields()`. */
  section?: string;
  [key: string]: any;
}

/**
 * @source panel/src/helpers/field.ts
 */
export interface PanelHelpersField {
  /**
   * Resolves a field's default value: a clone of `default`, else the default
   * of the field component's `value` prop (called when a function), else
   * `null`. Returns `undefined` when the field component has no `value` prop,
   * which makes `form()` skip the field.
   */
  defaultValue: (field: PanelFieldDefinition) => any;

  /**
   * Creates form values object from field definitions.
   *
   * @returns Form values object
   */
  form: (fields: Record<string, PanelFieldDefinition>) => Record<string, any>;

  /**
   * Checks if a field or section is visible. Returns `false` for hidden fields, otherwise evaluates `when` conditions against current form values.
   *
   * @param field - Field definition
   * @param values - Current form values
   * @returns `true` if visible
   */
  isVisible: (
    field: PanelFieldDefinition,
    values: Record<string, any>,
  ) => boolean;

  /**
   * Sets each subfield's `section` to the parent field's name. Points each
   * subfield's API endpoints at the parent's field endpoint, suffixed with `+`
   * and the subfield name, when the parent has endpoints. Mutates the passed
   * subfield definitions.
   *
   * @param field - Parent field
   * @param fields - Subfield definitions
   * @returns Enhanced field definitions
   */
  subfields: (
    field: PanelFieldDefinition,
    fields: Record<string, PanelFieldDefinition>,
  ) => Record<string, PanelFieldDefinition>;
}
// #endregion

// #region File Helpers

/**
 * @source panel/src/helpers/file.ts
 */
export interface PanelHelpersFile {
  /**
   * Extracts the part after the last dot, or the whole filename when it has
   * no dot.
   */
  extension: (filename: string) => string;

  /**
   * Extracts the part before the last dot, or `""` when the filename has no
   * dot.
   */
  name: (filename: string) => string;

  /**
   * Formats byte size as human-readable string.
   *
   * @param size - Size in bytes
   * @returns Formatted size (e.g., `"1KB"`, `"1.3MB"`)
   */
  niceSize: (size: number) => string;
}
// #endregion

// #region Keyboard Helpers

/**
 * @source panel/src/helpers/keyboard.ts
 */
export interface PanelHelpersKeyboard {
  /**
   * Returns the meta key name for the current OS.
   *
   * @returns `"cmd"` on Mac, `"ctrl"` on other OS
   */
  metaKey: () => "cmd" | "ctrl";
}
// #endregion

// #region Link Helpers

/**
 * @source panel/src/helpers/link.ts
 */
export interface PanelLinkType {
  /** Returns `true` if the value belongs to this link type. */
  detect: (value: string) => boolean;
  icon: string;
  id: string;
  label: string;
  /** Extracts link from value. */
  link: (value: string) => string;
  placeholder?: string;
  /** Input validation pattern. */
  pattern?: string;
  input?: string;
  /** Converts input to stored value. */
  value: (value: string) => string;
}

/**
 * @source panel/src/helpers/link.ts
 */
export interface PanelLinkDetection {
  /**
   * Key of the matching link type; for an empty value, the first type's key,
   * or `"url"` when the type map is empty.
   */
  type: string;
  link: string;
}

/**
 * @source panel/src/helpers/link.ts
 * @source src/Panel/Model.php
 */
export interface PanelLinkPreview {
  label: string;
  /** Panel image settings; `url` is set only when an image resolves. */
  image?: { url?: string; [key: string]: any } | null;
}

/**
 * @source panel/src/helpers/link.ts
 */
export interface PanelHelpersLink {
  /**
   * Detects link type and extracts link value.
   *
   * @param value - Link value to detect
   * @param types - Custom type definitions
   * @returns Detection result or `undefined` if no match
   */
  detect: (
    value: string,
    types?: Record<string, PanelLinkType>,
  ) => PanelLinkDetection | undefined;

  /**
   * Converts a file permalink to a `file://` UUID.
   */
  getFileUUID: (value: string) => string;

  /**
   * Converts a page permalink to a `page://` UUID.
   */
  getPageUUID: (value: string) => string;

  /**
   * Checks if value is a file UUID or permalink.
   *
   * @returns `true` if file reference
   */
  isFileUUID: (value: string) => boolean;

  /**
   * Checks if value is `site://`, a `page://` UUID, or a page permalink.
   *
   * @returns `true` if page reference
   */
  isPageUUID: (value: string) => boolean;

  /**
   * Fetches the label and image of a page or file link; `site://` resolves to
   * the site label, any other link to `{ label: link }`.
   *
   * @param fields - Fields to fetch (default: `["title", "panelImage"]` for pages, `["filename", "panelImage"]` for files)
   * @returns Preview data, or `null` for an empty link or a failed request
   */
  preview: (
    link: PanelLinkDetection,
    fields?: string[],
  ) => Promise<PanelLinkPreview | null>;

  /**
   * Returns available link types.
   *
   * @param keys - Types to keep, in this order; unknown keys are skipped
   */
  types: (keys?: string[]) => Record<string, PanelLinkType>;
}
// #endregion

// #region Page Helpers

/**
 * Page status button props.
 *
 * @source panel/src/helpers/page.ts
 */
export interface PanelPageStatusProps {
  title: string;
  icon: string;
  theme: "negative-icon" | "info-icon" | "positive-icon";
  disabled: boolean;
  size: string;
  /** Inline CSS declarations. */
  style: string;
}

/**
 * @source panel/src/helpers/page.ts
 */
export interface PanelHelpersPage {
  /**
   * Returns props for page status button.
   *
   * @param status - Page status (`"draft"`, `"unlisted"`, `"listed"`)
   * @param disabled - Whether the button is disabled; also appends the
   *   translated "disabled" label to the title
   */
  status: (status: string, disabled?: boolean) => PanelPageStatusProps;
}
// #endregion

// #region Upload Helpers

/**
 * Receives the upload progress as a percentage from `0` to `100`, with a
 * final `100` before `success`.
 *
 * @source panel/src/helpers/upload.ts
 */
export type PanelUploadProgressCallback = (
  xhr: XMLHttpRequest,
  file: File,
  percent: number,
) => void;

/**
 * Upload result callback (used by `success` and `error`).
 *
 * @source panel/src/helpers/upload.ts
 */
export type PanelUploadResultCallback = (
  xhr: XMLHttpRequest,
  file: File,
  response: unknown,
) => void;

/**
 * @source panel/src/helpers/upload.ts
 */
export interface PanelUploadParams {
  /** Upload endpoint URL (default: `"/"`). */
  url?: string;
  /** HTTP method (default: `"POST"`). */
  method?: string;
  /** Form field name (default: `"file"`). */
  field?: string;
  /** Filename sent with the file (default: the file's name). */
  filename?: string;
  headers?: Record<string, string>;
  /** Additional form attributes (values are coerced to strings). */
  attributes?: Record<string, string | number>;
  /**
   * Signal that cancels the request; no callback runs and the returned
   * promise stays pending.
   *
   * @since 5.0.0
   */
  abort?: AbortSignal;
  progress?: PanelUploadProgressCallback;
  success?: PanelUploadResultCallback;
  error?: PanelUploadResultCallback;
}
// #endregion

// #region Debounce/Throttle Helpers

/**
 * Debounce options. Omitting the object calls on the trailing edge only; in a
 * passed object, an unset key counts as `false`.
 *
 * @since 5.0.0
 * @source panel/src/helpers/debounce.ts
 */
export interface PanelDebounceOptions {
  /** Whether the callback fires on the leading edge. */
  leading?: boolean;
  /** Whether the callback fires on the trailing edge. */
  trailing?: boolean;
}

/**
 * Throttle options. Omitting the object calls on the leading edge only; in a
 * passed object, an unset key counts as `false`.
 *
 * @since 5.0.0
 * @source panel/src/helpers/throttle.ts
 */
export interface PanelThrottleOptions {
  /** Whether the callback fires on the leading edge. */
  leading?: boolean;
  /** Whether the callback fires on the trailing edge. */
  trailing?: boolean;
}

/**
 * Debounced function (without cancel method).
 *
 * @source panel/src/helpers/debounce.ts
 */
export interface PanelDebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
}

/**
 * Throttled function with cancel method.
 *
 * @since 5.0.0
 * @source panel/src/helpers/throttle.ts
 */
export interface PanelThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  /** Drops the pending trailing call and ends the cooldown. */
  cancel: () => void;
}
// #endregion

// #region Sort Helper

/**
 * @source panel/src/helpers/sort.ts
 */
export interface PanelSortOptions {
  /** Sort descending (default: `false`). */
  desc?: boolean;
  /** Case insensitive comparison (default: `false`). */
  insensitive?: boolean;
}

/**
 * @source panel/src/helpers/sort.ts
 */
export type PanelComparator = (
  a: string | number,
  b: string | number,
) => number;
// #endregion

// #region Main Helpers Interface

/**
 * Panel helpers available on the Vue prototype as `$helper`.
 *
 * @example
 * ```ts
 * // In a Vue component
 * this.$helper.string.slug("Hello World");
 * this.$helper.clone(someObject);
 * this.$helper.uuid();
 * ```
 *
 * @source panel/src/helpers/index.ts
 * @source panel/src/helpers/color.ts
 * @source panel/src/helpers/debounce.ts
 * @source panel/src/helpers/focus.ts
 * @source panel/src/helpers/isComponent.ts
 * @source panel/src/helpers/isUploadEvent.ts
 * @source panel/src/helpers/object.ts
 * @source panel/src/helpers/ratio.ts
 * @source panel/src/helpers/sort.ts
 * @source panel/src/helpers/string.ts
 * @source panel/src/helpers/throttle.ts
 * @source panel/src/helpers/upload.ts
 */
export interface PanelHelpers {
  array: PanelHelpersArray;

  clipboard: PanelHelpersClipboard;

  /**
   * Deep clones a value.
   * Shortcut for `object.clone()`.
   */
  clone: { <T>(value: T): T; (): undefined };

  /**
   * Resolves a color name to its `--color-*` CSS variable when one is defined
   * and `pattern` to `var(--pattern)`; passes any other color through
   * lowercased.
   *
   * @returns `undefined` if the value is not a string
   */
  color: (value: unknown) => string | undefined;

  /**
   * Debounces `callback` by `delay` milliseconds.
   */
  debounce: <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: PanelDebounceOptions,
  ) => PanelDebouncedFunction<T>;

  embed: PanelHelpersEmbed;

  field: PanelHelpersField;

  file: PanelHelpersFile;

  /**
   * Focuses the first enabled match inside the element, trying in order the
   * `field` input, an `autofocus` element, an input, a submit button, and a
   * button, and falls back to the element itself. Without `field`, does
   * nothing while focus already sits inside the element.
   *
   * @param element - Selector, element, or `null` (returns `false`)
   * @param field - Name of the input to focus first
   * @returns The focused element, or `false` if nothing could be focused
   */
  focus: (
    element: string | HTMLElement | null,
    field?: string,
  ) => HTMLElement | false;

  /**
   * Checks if a component is registered globally under exactly this name.
   */
  isComponent: (name: string) => boolean;

  /**
   * Checks if a drag event carries files and no plain text.
   */
  isUploadEvent: (event: DragEvent) => boolean;

  keyboard: PanelHelpersKeyboard;

  link: PanelHelpersLink;

  object: PanelHelpersObject;

  /**
   * Left-pads value with zeros.
   * Shortcut for `string.pad()`.
   */
  pad: (value: string | number, length?: number) => string;

  page: PanelHelpersPage;

  /**
   * Converts aspect ratio to percentage.
   *
   * @param fraction - Ratio string (default: `"3/2"`)
   * @param fallback - Value returned when the fraction does not split into two parts (default: `"100%"`)
   * @param vertical - Calculate for vertical orientation (default: `true`)
   * @returns Percentage string
   */
  ratio: (fraction?: string, fallback?: string, vertical?: boolean) => string;

  /**
   * Converts string to slug.
   * Shortcut for `string.slug()`.
   */
  slug: (
    string: string,
    rules?: PanelSlugRules,
    allowed?: string,
    separator?: string,
  ) => string;

  /**
   * Creates a natural-order comparator: numeric runs compare as numbers, hex
   * strings and dates by value, and empty values sort as the smallest.
   */
  sort: (options?: PanelSortOptions) => PanelComparator;

  string: PanelHelpersString;

  /**
   * Throttles `callback` to at most one call per `delay` milliseconds.
   *
   * @since 5.0.0
   */
  throttle: <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: PanelThrottleOptions,
  ) => PanelThrottledFunction<T>;

  /**
   * Uploads a file via XMLHttpRequest.
   *
   * @param file - File to upload
   * @param params - Upload parameters
   * @returns Promise resolving to the parsed JSON response; rejects with the
   *   server's error response, or a generic `{ status: "error", message }`
   *   object when the body is not JSON; stays pending on a network error or abort.
   */
  upload: (file: File, params: PanelUploadParams) => Promise<unknown>;

  url: PanelHelpersUrl;

  /**
   * Generates UUID v4 string.
   * Shortcut for `string.uuid()`.
   */
  uuid: () => string;

  /**
   * Writer (ProseMirror) extension helpers for resolving allowed marks/nodes
   * and building extension instances.
   *
   * @since 5.5.0
   */
  writer: PanelHelpersWriter;
}
// #endregion

// #region Writer Helpers

/**
 * Writer extension helper utilities.
 *
 * Resolves which marks and nodes are allowed in a Writer field, builds
 * extension instances (including those contributed by plugins), and exposes
 * the lower-level building blocks used by `createMarks` / `createNodes`.
 *
 * @source panel/src/helpers/writer.js
 * @since 5.5.0
 */
export interface PanelHelpersWriter {
  /**
   * Resolves the list of allowed extension names from a permissive `allowed`
   * argument.
   *
   * @param available - Map of all available extensions keyed by name
   * @param allowed - `false` to allow none, an array of names (returned
   *   unfiltered), or an object map (keys set to `false` are filtered out);
   *   any other value, including `true`, `null`, and `undefined`, allows all
   * @returns Array of allowed extension names
   */
  allowedExtensions: (
    available: Record<string, unknown>,
    allowed?: boolean | string[] | Record<string, unknown> | null,
  ) => string[];

  /**
   * Returns all available built-in mark extension instances merged with
   * mark extensions registered by plugins.
   *
   * @param options - Per-mark option overrides keyed by mark name
   * @returns Map of mark instances keyed by mark name
   */
  availableMarks: (options?: Record<string, any>) => Record<string, any>;

  /**
   * Returns mark extension instances contributed by `panel.plugins.writerMarks`.
   *
   * @returns Map of plugin-provided mark instances
   */
  availableMarksFromPlugins: () => Record<string, any>;

  /**
   * Returns all available built-in node extension instances merged with
   * node extensions registered by plugins.
   *
   * @param options - Per-node option overrides keyed by node name
   * @returns Map of node instances keyed by node name
   */
  availableNodes: (options?: Record<string, any>) => Record<string, any>;

  /**
   * Returns node extension instances contributed by `panel.plugins.writerNodes`.
   *
   * @returns Map of plugin-provided node instances
   */
  availableNodesFromPlugins: () => Record<string, any>;

  /**
   * Builds the final map of mark extensions to install for a Writer field,
   * resolving the `marks` configuration and re-installing any required marks.
   *
   * @param marks - Allowed marks configuration (see `allowedExtensions`)
   * @param required - Mark names that must always be installed
   * @returns Map of mark instances to install
   */
  createMarks: (
    marks?: boolean | string[] | Record<string, unknown> | null,
    required?: string[],
  ) => Record<string, any>;

  /**
   * Builds the final map of node extensions to install for a Writer field,
   * resolving the `nodes` configuration and re-installing any required nodes.
   * Automatically installs `listItem` when a list node is present.
   *
   * @param nodes - Allowed nodes configuration (see `allowedExtensions`)
   * @param required - Node names that must always be installed
   * @returns Map of node instances to install
   */
  createNodes: (
    nodes?: boolean | string[] | Record<string, unknown> | null,
    required?: string[],
  ) => Record<string, any>;

  /**
   * Extracts per-extension options from an object-map `allowed` configuration,
   * keeping only entries whose value is a non-null object.
   *
   * @param allowed - Extension configuration
   * @returns Map of extension options keyed by extension name
   */
  extensionOptions: (
    allowed?: boolean | string[] | Record<string, unknown> | null,
  ) => Record<string, Record<string, any>>;

  /**
   * Filters a map of available extensions down to those listed in `allowed`.
   * Keeps the order of `allowed`; for marks, that order sets the nesting
   * priority.
   *
   * @param available - Map of available extensions keyed by name
   * @param allowed - Allowed extension configuration
   * @returns Map of installed extensions
   */
  filterExtensions: <T>(
    available: Record<string, T>,
    allowed?: boolean | string[] | Record<string, unknown> | null,
  ) => Record<string, T>;

  /**
   * Filters a list of node extension instances down to those whose schema is
   * marked `inline: true`.
   *
   * @param nodes - Node extension instances
   * @returns Inline-only subset
   */
  keepInlineNodes: <T extends { schema: { inline?: boolean } }>(
    nodes: T[],
  ) => T[];
}
// #endregion
