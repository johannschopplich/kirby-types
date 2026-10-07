/**
 * Helper type definitions for Kirby Panel.
 *
 * Provides types for the `$helper` utilities registered as a global property
 * on the Panel app.
 */

import type { App } from "vue";

// #region Array Helpers

/**
 * @source panel/src/helpers/array.ts
 */
export interface PanelArraySearchOptions {
  /**
   * Query length at or below which the array is returned unfiltered
   * (default: `0`).
   */
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
   * Splits the array into subarrays at every element equal to `delimiter`,
   * which is dropped from the output.
   */
  split: <T>(array: T[], delimiter: string) => T[][];

  /** Wraps a non-array value in an array; an array comes back as-is. */
  wrap: <T>(array: T | T[]) => T[];
}
// #endregion

// #region String Helpers

/**
 * Ordered character maps applied to the trimmed, lowercased string before
 * slugging; each key is replaced literally by its value, so a key with
 * uppercase letters never matches. A key starting with `/` has its first and
 * last characters stripped first.
 *
 * @source panel/src/helpers/string.ts
 */
export type PanelSlugRules = Record<string, string>[];

/**
 * @source panel/src/helpers/string.ts
 */
export interface PanelHelpersString {
  camelToKebab: (string: string) => string;

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
   * @param strict - Reject a trailing query or hash after the domain
   */
  isEmail: (string: unknown, strict?: boolean) => boolean;

  /** Checks if the value is falsy or converts to an empty string, such as `[]`. */
  isEmpty: (string: unknown) => boolean;

  /**
   * Converts first letter to lowercase.
   */
  lcfirst: (string: string) => string;

  /**
   * Strips every leading repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   */
  ltrim: (string: string, replace?: string) => string;

  /**
   * Prefixes the value with zeros up to `length` characters.
   *
   * @param length - Target length (default: `2`)
   */
  pad: (value: string | number, length?: number) => string;

  /** Generates a random alphanumeric string of `length` characters. */
  random: (length: number) => string;

  /**
   * Strips every trailing repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   */
  rtrim: (string: string, replace?: string) => string;

  /**
   * Sanitizes HTML by only keeping allowed marks and nodes.
   *
   * @param html - HTML to sanitize; a falsy value resolves to `""`
   * @param options - Allowed marks and nodes
   * @param options.marks - Allowed marks: `true` for all, `false` for none, an
   *   array of mark names and extension instances, or a map of mark name to
   *   `true`, `false`, or mark options (default: `bold`, `code`, `italic`,
   *   `link`, `strike`, `sub`, `sup`, `underline`)
   * @param options.nodes - Allowed nodes, in the same forms as `marks`; `doc`,
   *   `text`, and `paragraph` are always installed (default: inline content
   *   only, which flattens block structure)
   */
  sanitizeHTML: (
    html: unknown,
    options?: {
      marks?:
        | boolean
        | (string | Record<string, any>)[]
        | Record<string, unknown>
        | null;
      nodes?:
        | boolean
        | (string | Record<string, any>)[]
        | Record<string, unknown>
        | null;
    },
  ) => Promise<string>;

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

  stripHTML: (string: string) => string;

  /**
   * Replaces `{name}`, `{{name}}`, and dotted-path placeholders such as
   * `{nested.prop}` with entries from `values`; an unresolved placeholder
   * renders as `…`.
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
   * Reverses the entities `escapeHTML()` produces; any other entity stays
   * as-is.
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
   * Deep copies plain objects and arrays and unwraps reactive proxies into
   * plain data. Every other value, including `Date`, `Map`, and class
   * instances, comes back as-is.
   */
  clone: { <T>(value: T): T; (): undefined };

  /**
   * Keeps the entries for which `predicate` returns `true`.
   */
  filter: <T extends Record<string, any>>(
    object: T,
    predicate: (value: T[keyof T], key: string) => boolean,
  ) => Partial<T>;

  /**
   * Checks if the value is `null`, `undefined`, `""`, or an empty plain object
   * or array.
   */
  isEmpty: (value: unknown) => boolean;

  /**
   * Checks if the input is a plain object; arrays, `null`, and class instances
   * are not.
   */
  isObject: (input: unknown) => input is Record<string, unknown>;

  /** Counts the keys of an object; `null` and `undefined` yield `0`. */
  length: (object?: Record<string, any> | null) => number;

  /**
   * Recursively merges `source` into `target`. Mutates `target` and the nested
   * objects of `source`, which `target` then references.
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

  /** Compares two values by their JSON serialization, so key order matters. */
  same: (a: unknown, b: unknown) => boolean;

  /** Copies the object with every key lowercased. */
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
   * set over it as a string. Nested objects become `parent[child]` keys,
   * `null` removes a param, and `undefined` leaves it untouched.
   *
   * @param origin - Existing query as a URL, a query string, or a record
   */
  buildQuery: (
    query?: Record<string, unknown>,
    origin?: string | Record<string, string> | URL,
  ) => URLSearchParams;

  /**
   * Builds a full URL object with query parameters. A `URL` passed as `url`
   * is updated in place and returned.
   *
   * @param origin - Base for a relative `url` (default: the base URL)
   */
  buildUrl: (
    url?: string | URL,
    query?: Record<string, unknown>,
    origin?: string | URL,
  ) => URL;

  /**
   * Checks if a URL begins with a dangerous URI scheme (e.g. `javascript:`,
   * `vbscript:`, `data:`) after removing every character other than letters
   * and colons.
   */
  hasDangerousScheme: (url: unknown) => boolean;

  /** Checks if the value starts with `http://` or `https://`. */
  isAbsolute: (url: unknown) => boolean;

  /** Checks if the URL is on the same origin as the current page. */
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
 * @source panel/src/helpers/embed.ts
 */
export interface PanelHelpersEmbed {
  /**
   * Converts YouTube URL to embed URL.
   *
   * @param doNotTrack - Enable privacy-enhanced mode
   * @returns Embed URL or `false` if not valid
   */
  youtube: (url: string, doNotTrack?: boolean) => string | false;

  /**
   * Converts Vimeo URL to embed URL.
   *
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
  /** API endpoint paths of the field and its model. */
  endpoints?: { field?: string; model?: string };
  fields?: Record<string, PanelFieldDefinition>;
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

  /** Collects the default value of each field, keyed by field name. */
  form: (fields: Record<string, PanelFieldDefinition>) => Record<string, any>;

  /**
   * Checks if a field is visible. Returns `false` for hidden fields,
   * otherwise evaluates the `when` conditions against `values`, the current
   * form values.
   */
  isVisible: (
    field: PanelFieldDefinition,
    values: Record<string, any>,
  ) => boolean;

  /**
   * Sets each subfield's endpoints when the parent has them: `field` to the
   * parent's `field` endpoint suffixed with `+` and the subfield name, `model`
   * to the parent's `model` endpoint.
   * Mutates the passed subfield definitions.
   *
   * @param field - Parent field
   * @param fields - Subfield definitions
   * @returns The mutated subfield definitions
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
  /** Returns `"cmd"` on Apple devices, `"ctrl"` elsewhere. */
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
 */
export interface PanelHelpersLink {
  /**
   * Detects link type and extracts link value.
   *
   * @param types - Link types to match against (default: all link types)
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

  /** Checks if the value is a file UUID or permalink. */
  isFileUUID: (value: string) => boolean;

  /**
   * Checks if the value is `site://`, a `page://` UUID, or a page permalink.
   */
  isPageUUID: (value: string) => boolean;

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
   *   translated `disabled` label to the title
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
  /** Additional `FormData` entries; values are coerced to strings. */
  attributes?: Record<string, string | number>;
  /**
   * Signal that cancels the request when it aborts during the upload; no
   * further callback runs and the returned promise stays pending.
   */
  abort?: AbortSignal;
  progress?: PanelUploadProgressCallback;
  /** Receives the parsed response once the upload succeeds. */
  success?: PanelUploadResultCallback;
  /**
   * Receives the error response when the server reports an error or returns
   * a body that is not JSON.
   */
  error?: PanelUploadResultCallback;
}
// #endregion

// #region Debounce/Throttle Helpers

/**
 * Without options, the callback fires on the trailing edge only; in a passed
 * object, an unset key counts as `false`.
 *
 * @source panel/src/helpers/debounce.ts
 */
export interface PanelDebounceOptions {
  /** Whether the callback fires on the leading edge. */
  leading?: boolean;
  /** Whether the callback fires on the trailing edge. */
  trailing?: boolean;
}

/**
 * Without options, the callback fires on the leading edge only; in a passed
 * object, an unset key counts as `false`.
 *
 * @source panel/src/helpers/throttle.ts
 */
export interface PanelThrottleOptions {
  /** Whether the callback fires on the leading edge. */
  leading?: boolean;
  /** Whether the callback fires on the trailing edge. */
  trailing?: boolean;
}

/**
 * @source panel/src/helpers/debounce.ts
 */
export interface PanelDebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
}

/**
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
  /** Descending order (default: `false`). */
  desc?: boolean;
  /** Case-insensitive comparison (default: `false`). */
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
 * Panel helpers registered as the `$helper` global property of the Panel app.
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
 * @source panel/src/helpers/items.ts
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
   * Deep copies plain objects and arrays and unwraps reactive proxies into
   * plain data. Shortcut for `object.clone()`.
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
   * Tries the first `field` input, `autofocus` element, input, submit button,
   * and button inside the element, in that order, and focuses the first of
   * them that is focusable, or else the element itself. Without `field`,
   * leaves the focus alone when it already sits inside the element.
   *
   * @param element - Selector, element, or `null` (returns `false`)
   * @param field - Specific input name to focus
   * @returns The focused element, or `false` if nothing was focused
   */
  focus: (
    element: string | HTMLElement | null,
    field?: string,
  ) => HTMLElement | false;

  /**
   * Checks if a component is registered globally under exactly this name.
   *
   * @param app - Vue app instance (default: `window.panel?.app`)
   */
  isComponent: (name: string, app?: App) => boolean;

  /**
   * Checks if a drag event carries files and no plain text.
   */
  isUploadEvent: (event: DragEvent) => boolean;

  /**
   * Requests item props by model ID. Calls from the same tick share requests
   * of up to 100 IDs per endpoint and query, and an ID already in flight
   * joins the pending request. A blank ID, an unknown ID, a model the user
   * may not list, or a failed request resolves to `undefined` – the promise
   * never rejects. A failed request still reaches the Panel's error
   * handling, so an expired session or a lost connection surfaces to the
   * user.
   *
   * @param endpoint - API endpoint, e.g. `"items/files"`
   * @param id - Model ID, e.g. `"file://abc"`, or an array of model IDs
   * @param query - Query passed on to the endpoint
   * @returns Item props, or an array of them in the order of the IDs
   */
  items: {
    (
      endpoint: string,
      id: string,
      query?: Record<string, any>,
    ): Promise<Record<string, any> | undefined>;
    (
      endpoint: string,
      ids: string[],
      query?: Record<string, any>,
    ): Promise<(Record<string, any> | undefined)[]>;
  };

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
   * @param fallback - Value returned when the fraction does not split into two
   *   parts (default: `"100%"`)
   * @param vertical - Calculate for vertical orientation (default: `true`)
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
   */
  throttle: <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: PanelThrottleOptions,
  ) => PanelThrottledFunction<T>;

  /**
   * Uploads a file via `XMLHttpRequest`.
   *
   * @returns Promise resolving to the parsed JSON response; rejects with the
   *   server's error response, or a generic `{ status: "error", message }`
   *   object when the body is not JSON; stays pending on a network error or
   *   abort.
   */
  upload: (file: File, params: PanelUploadParams) => Promise<unknown>;

  url: PanelHelpersUrl;

  /**
   * Generates UUID v4 string.
   * Shortcut for `string.uuid()`.
   */
  uuid: () => string;

  writer: PanelHelpersWriter;
}
// #endregion

// #region Writer Helpers

/**
 * Helpers that resolve the marks and nodes a Writer field allows and build
 * their extension instances, plugin extensions included.
 *
 * @source panel/src/helpers/writer.ts
 */
export interface PanelHelpersWriter {
  /**
   * Resolves the names of the allowed extensions, plus any instances passed
   * in the `allowed` array.
   *
   * @param available - Map of all available extensions keyed by name
   * @param allowed - `false` to allow none, an array of names and extension
   *   instances (returned unfiltered), or an object map (keys set to `false`
   *   are filtered out); any other value, including `true`, `null`, and
   *   `undefined`, allows all
   */
  allowedExtensions: <T = never>(
    available: Record<string, unknown>,
    allowed?: boolean | (string | T)[] | Record<string, unknown> | null,
  ) => (string | T)[];

  /**
   * Returns the built-in mark instances merged with the plugin marks, keyed by
   * mark name.
   *
   * @param options - Per-mark option overrides keyed by mark name
   */
  availableMarks: (options?: Record<string, any>) => Record<string, any>;

  /**
   * Returns the mark instances from `panel.plugins.writerMarks`, keyed by mark
   * name.
   */
  availableMarksFromPlugins: () => Record<string, any>;

  /**
   * Returns the built-in node instances merged with the plugin nodes, keyed by
   * node name.
   *
   * @param options - Per-node option overrides keyed by node name
   */
  availableNodes: (options?: Record<string, any>) => Record<string, any>;

  /**
   * Returns the node instances from `panel.plugins.writerNodes`, keyed by node
   * name.
   */
  availableNodesFromPlugins: () => Record<string, any>;

  /**
   * Builds the map of mark instances to install for a Writer field from the
   * `marks` configuration, always adding the `required` marks.
   *
   * @param marks - Allowed marks configuration (see `allowedExtensions`)
   */
  createMarks: (
    marks?:
      | boolean
      | (string | Record<string, any>)[]
      | Record<string, unknown>
      | null,
    required?: string[],
  ) => Record<string, any>;

  /**
   * Builds the map of node instances to install for a Writer field from the
   * `nodes` configuration, always adding the `required` nodes, and `listItem`
   * whenever `bulletList` or `orderedList` is installed.
   *
   * @param nodes - Allowed nodes configuration (see `allowedExtensions`)
   */
  createNodes: (
    nodes?:
      | boolean
      | (string | Record<string, any>)[]
      | Record<string, unknown>
      | null,
    required?: string[],
  ) => Record<string, any>;

  /**
   * Extracts per-extension options, keyed by extension name, from an
   * object-map `allowed` configuration, keeping only entries whose value is a
   * non-null object.
   */
  extensionOptions: (
    allowed?: boolean | unknown[] | Record<string, unknown> | null,
  ) => Record<string, Record<string, any>>;

  /**
   * Filters a map of available extensions down to those listed in `allowed`.
   * Keeps the order of `allowed`; for marks, that order sets the nesting
   * priority. An extension instance in the array is installed under its own
   * name.
   *
   * @param allowed - Allowed extension configuration (see `allowedExtensions`)
   */
  filterExtensions: <T extends { name: string }>(
    available: Record<string, T>,
    allowed?: boolean | (string | T)[] | Record<string, unknown> | null,
  ) => Record<string, T>;

  /** Keeps the node instances whose schema sets `inline: true`. */
  keepInlineNodes: <T extends { schema: { inline?: boolean } }>(
    nodes: T[],
  ) => T[];
}
// #endregion
