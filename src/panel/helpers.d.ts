/**
 * Helper type definitions for Kirby Panel.
 *
 * Provides types for the `$helper` utilities registered as a global property
 * on the Panel app.
 */

import type { App } from "vue";

// #region Array Helpers

/**
 * Search options for array filtering.
 *
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
 * Array helper utilities.
 *
 * @source panel/src/helpers/array.ts
 */
export interface PanelHelpersArray {
  /**
   * Creates an array from an object or returns input if already array.
   *
   * @param object - Object or array to convert
   * @returns Array of values
   */
  fromObject: <T>(object: T[] | Record<string, T> | null | undefined) => T[];

  /**
   * Searches through an array by query string.
   *
   * @param array - Array to search
   * @param query - Search query; `null` and `undefined` throw unless
   *   `options.min` reaches the length of their string form.
   * @param options - Search options
   * @returns Filtered array
   */
  search: <T extends Record<string, any>>(
    array: T[],
    query: string | null | undefined,
    options?: PanelArraySearchOptions,
  ) => T[];

  /**
   * Sorts the array in place by field and direction, case-insensitively.
   *
   * @param array - Array to sort
   * @param sortBy - Sort specification (e.g., `"name asc"`, `"date desc"`)
   * @returns Sorted array
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
 * Slug conversion rules.
 *
 * @source panel/src/helpers/string.ts
 */
export type PanelSlugRules = Record<string, string>[];

/**
 * String helper utilities.
 *
 * @source panel/src/helpers/string.ts
 */
export interface PanelHelpersString {
  /**
   * Converts camelCase to kebab-case.
   *
   * @param string - String to convert
   * @returns Kebab-case string
   */
  camelToKebab: (string: string) => string;

  /**
   * Escapes HTML special characters.
   *
   * @param string - Value to escape
   * @returns Escaped string
   */
  escapeHTML: (string: unknown) => string;

  /**
   * Checks if string contains emoji characters.
   *
   * @param string - String to check
   * @returns `true` if contains emoji
   */
  hasEmoji: (string: unknown) => boolean;

  /**
   * Checks if a string is shaped like an email address.
   *
   * @param string - String to check
   * @param strict - Reject a trailing query/hash after the domain
   * @returns `true` if the string looks like an email address
   */
  isEmail: (string: unknown, strict?: boolean) => boolean;

  /**
   * Checks if string is empty or falsy.
   *
   * @param string - String to check
   * @returns `true` if empty
   */
  isEmpty: (string: unknown) => boolean;

  /**
   * Converts first letter to lowercase.
   *
   * @param string - String to convert
   * @returns Converted string
   */
  lcfirst: (string: string) => string;

  /**
   * Strips every leading repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   *
   * @param string - String to trim
   * @param replace - Substring to strip repeatedly
   * @returns Trimmed string
   */
  ltrim: (string: string, replace?: string) => string;

  /**
   * Prefixes string with zeros until length is reached.
   *
   * @param value - Value to pad
   * @param length - Target length (default: 2)
   * @returns Padded string
   */
  pad: (value: string | number, length?: number) => string;

  /**
   * Generates random alphanumeric string.
   *
   * @param length - String length
   * @returns Random string
   */
  random: (length: number) => string;

  /**
   * Strips every trailing repeat of `replace`, matched literally; without
   * `replace` the string comes back unchanged.
   *
   * @param string - String to trim
   * @param replace - Substring to strip repeatedly
   * @returns Trimmed string
   */
  rtrim: (string: string, replace?: string) => string;

  /**
   * Sanitizes HTML by only keeping allowed marks and nodes.
   *
   * @param html - HTML string to sanitize
   * @param options - Allowed marks/nodes (defaults to common writer marks)
   * @param options.marks - Allowed marks: `true` for all, `false` for none, an array of mark names and extension instances, or a map of mark name to `true`, `false`, or mark options
   * @param options.nodes - Allowed nodes, in the same forms as `marks`
   * @returns Promise resolving to the sanitized HTML string
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
   * @param string - String to convert
   * @param rules - Language/ASCII conversion rules
   * @param allowed - Allowed characters (default: `"a-z0-9"`)
   * @param separator - Separator character (default: `"-"`)
   * @returns Slug string
   */
  slug: (
    string: string,
    rules?: PanelSlugRules,
    allowed?: string,
    separator?: string,
  ) => string;

  /**
   * Strips HTML tags from string.
   *
   * @param string - String to strip
   * @returns Plain text string
   */
  stripHTML: (string: string) => string;

  /**
   * Replaces `{name}`, `{{name}}`, and dotted-path placeholders (e.g. `{nested.prop}`) with values from the lookup object.
   * An unresolved placeholder renders as `…`.
   *
   * @param string - Template string
   * @param values - Replacement values
   * @returns Interpolated string
   */
  template: (string: string, values?: Record<string, any>) => string;

  /**
   * Converts first letter to uppercase.
   *
   * @param string - String to convert
   * @returns Converted string
   */
  ucfirst: (string: string) => string;

  /**
   * Converts first letter of each word to uppercase.
   *
   * @param string - String to convert
   * @returns Converted string
   */
  ucwords: (string: string) => string;

  /**
   * Converts HTML entities back to characters.
   *
   * @param string - String to unescape
   * @returns Unescaped string
   */
  unescapeHTML: (string: string) => string;

  /**
   * Generates a UUID v4 string.
   *
   * @returns UUID string
   */
  uuid: () => string;
}
// #endregion

// #region Object Helpers

/**
 * Object helper utilities.
 *
 * @source panel/src/helpers/object.ts
 */
export interface PanelHelpersObject {
  /**
   * Deep copies plain objects and arrays and unwraps reactive proxies into
   * plain data. Every other value, including `Date`, `Map`, and class
   * instances, is returned as is.
   *
   * @param value - Value to clone
   * @returns Cloned value
   */
  clone: <T>(value: T) => T;

  /**
   * Filters object entries by predicate.
   *
   * @param object - Object to filter
   * @param predicate - Filter function
   * @returns Filtered object
   */
  filter: <T extends Record<string, any>>(
    object: T,
    predicate: (value: T[keyof T], key: string) => boolean,
  ) => Partial<T>;

  /**
   * Checks if value is empty (`null`, `undefined`, `""`, empty object/array).
   *
   * @param value - Value to check
   * @returns `true` if empty
   */
  isEmpty: (value: unknown) => boolean;

  /**
   * Checks if input is a plain object (not array, `null`, etc.).
   *
   * @param input - Value to check
   * @returns `true` if plain object
   */
  isObject: (input: unknown) => input is Record<string, unknown>;

  /**
   * Counts keys in an object.
   *
   * @param object - Object to count
   * @returns Number of keys
   */
  length: (object?: Record<string, any> | null) => number;

  /**
   * Recursively merges source into target. Mutates the target and the
   * source's nested objects, which the target then references.
   *
   * @param target - Target object (default: a new empty object)
   * @param source - Source object
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
   * @param obj - Object to convert
   * @returns Object with lowercase keys
   */
  toLowerKeys: <T>(obj: Record<string, T>) => Record<string, T>;
}
// #endregion

// #region URL Helpers

/**
 * URL helper utilities.
 *
 * @source panel/src/helpers/url.ts
 */
export interface PanelHelpersUrl {
  /**
   * Returns the base URL from the `<base>` element or window origin.
   *
   * @returns Base URL
   */
  base: () => URL;

  /**
   * Builds URLSearchParams from object, merging with origin query.
   * Nested objects become `parent[child]` keys, `null` removes a param, and
   * `undefined` leaves it untouched.
   *
   * @param query - Query parameters
   * @param origin - Existing URL or query string
   * @returns URLSearchParams object
   */
  buildQuery: (
    query?: Record<string, unknown>,
    origin?: string | Record<string, string> | URL,
  ) => URLSearchParams;

  /**
   * Builds a full URL object with query parameters.
   *
   * @param url - URL path or object
   * @param query - Query parameters
   * @param origin - Base origin URL
   * @returns Complete URL object
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
   * @param url - URL to check
   * @returns `true` if the URL uses a dangerous scheme
   */
  hasDangerousScheme: (url: unknown) => boolean;

  /**
   * Checks if URL string starts with `http://` or `https://`.
   *
   * @param url - URL to check
   * @returns `true` if absolute
   */
  isAbsolute: (url: unknown) => boolean;

  /**
   * Checks if URL is on the same origin as current page.
   *
   * @param url - URL to check
   * @returns `true` if same origin
   */
  isSameOrigin: (url: string | URL) => boolean;

  /**
   * Checks if the value is a string, `URL`, or `Location` that parses as a URL.
   *
   * @param url - URL to validate
   * @param strict - Use Kirby's URL regex for validation
   * @returns `true` if valid URL
   */
  isUrl: (url: unknown, strict?: boolean) => url is URL | Location | string;

  /**
   * Converts relative path to absolute URL.
   *
   * @param path - Path to convert
   * @param origin - Base origin
   * @returns Absolute URL string
   */
  makeAbsolute: (path: string | URL, origin?: string | URL) => string;

  /**
   * Converts string to URL object.
   *
   * @param url - URL string or object
   * @param origin - Base origin for relative URLs
   * @returns URL object
   */
  toObject: (url: string | URL, origin?: string | URL) => URL;
}
// #endregion

// #region Clipboard Helpers

/**
 * Clipboard helper utilities.
 *
 * @source panel/src/helpers/clipboard.ts
 */
export interface PanelHelpersClipboard {
  /**
   * Reads from clipboard event or string.
   *
   * @param event - Event (narrowed to ClipboardEvent at runtime) or string
   * @param plain - Read as plain text only
   * @returns Clipboard content, or `null` when nothing could be read
   */
  read: (event?: Event | string | null, plain?: boolean) => string | null;

  /**
   * Writes to clipboard. Objects are auto-JSONified.
   *
   * @param value - Value to write (non-strings are JSON-stringified)
   * @param event - Event for event-based writing (narrowed to ClipboardEvent at runtime)
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
   * @param url - Video URL
   * @param doNotTrack - Privacy mode
   * @returns Embed URL or `false` if not valid
   */
  video: (url: string, doNotTrack?: boolean) => string | false;
}
// #endregion

// #region Field Helpers

/**
 * Field definition object.
 *
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
 * Field helper utilities.
 *
 * @source panel/src/helpers/field.ts
 */
export interface PanelHelpersField {
  /**
   * Gets default value for a field definition.
   *
   * @param field - Field definition
   * @returns Default value
   */
  defaultValue: (field: PanelFieldDefinition) => any;

  /**
   * Creates form values object from field definitions.
   *
   * @param fields - Field definitions
   * @returns Form values object
   */
  form: (fields: Record<string, PanelFieldDefinition>) => Record<string, any>;

  /**
   * Checks if a field is visible. Returns `false` for hidden fields, otherwise evaluates `when` conditions against current form values.
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
   * Points each subfield's API endpoints at the parent's field endpoint,
   * suffixed with `+` and the subfield name, when the parent has endpoints.
   * Mutates the passed subfield definitions.
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
 * File helper utilities.
 *
 * @source panel/src/helpers/file.ts
 */
export interface PanelHelpersFile {
  /**
   * Extracts file extension from filename.
   *
   * @param filename - Filename
   * @returns Extension without dot
   */
  extension: (filename: string) => string;

  /**
   * Extracts filename without extension.
   *
   * @param filename - Filename
   * @returns Name without extension
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
 * Keyboard helper utilities.
 *
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
 * Link type definition.
 *
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
 * Detected link result.
 *
 * @source panel/src/helpers/link.ts
 */
export interface PanelLinkDetection {
  /** Key of the matching link type; the first type's key for an empty value. */
  type: string;
  link: string;
}

/**
 * Link helper utilities.
 *
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
   *
   * @param value - Permalink value
   * @returns File UUID
   */
  getFileUUID: (value: string) => string;

  /**
   * Converts a page permalink to a `page://` UUID.
   *
   * @param value - Permalink value
   * @returns Page UUID
   */
  getPageUUID: (value: string) => string;

  /**
   * Checks if value is a file UUID or permalink.
   *
   * @param value - Value to check
   * @returns `true` if file reference
   */
  isFileUUID: (value: string) => boolean;

  /**
   * Checks if value is `site://`, a `page://` UUID, or a page permalink.
   *
   * @param value - Value to check
   * @returns `true` if page reference
   */
  isPageUUID: (value: string) => boolean;

  /**
   * Returns available link types.
   *
   * @param keys - Filter to specific types
   * @returns Link type definitions
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
 * Page helper utilities.
 *
 * @source panel/src/helpers/page.ts
 */
export interface PanelHelpersPage {
  /**
   * Returns props for page status button.
   *
   * @param status - Page status (`"draft"`, `"unlisted"`, `"listed"`)
   * @param disabled - Whether to disable
   * @returns Button props
   */
  status: (status: string, disabled?: boolean) => PanelPageStatusProps;
}
// #endregion

// #region Upload Helpers

/**
 * Upload progress callback.
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
 * Upload parameters.
 *
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
  /** Request headers. */
  headers?: Record<string, string>;
  /** Additional form attributes (values are coerced to strings). */
  attributes?: Record<string, string | number>;
  /** AbortSignal for cancellation. */
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
 * Sort options.
 *
 * @source panel/src/helpers/sort.ts
 */
export interface PanelSortOptions {
  /** Sort descending (default: `false`). */
  desc?: boolean;
  /** Case insensitive comparison (default: `false`). */
  insensitive?: boolean;
}

/**
 * Comparator function for sorting.
 *
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
 * Provides utility functions for common operations.
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
  clone: <T>(value: T) => T;

  /**
   * Resolves CSS color to CSS variable.
   *
   * @param value - Color name or value
   * @returns CSS variable if one matches, otherwise the lowercased value; `undefined` if not a string
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
   * Sets focus to element or first focusable child.
   *
   * @param element - Selector, element, or `null` (returns `false`)
   * @param field - Specific input name to focus
   * @returns The focused element, or `false` if nothing could be focused
   */
  focus: (
    element: string | HTMLElement | null,
    field?: string,
  ) => HTMLElement | false;

  /**
   * Checks if component is registered globally.
   *
   * The optional `app` argument defaults to `window.panel?.app`.
   *
   * @param name - Component name
   * @param app - Vue app instance
   * @returns `true` if registered
   */
  isComponent: (name: string, app?: App) => boolean;

  /**
   * Checks if event is a file drag/drop event.
   *
   * @param event - Event to check
   * @returns `true` if file upload event
   */
  isUploadEvent: (event: DragEvent) => boolean;

  /**
   * Requests item props by model ID. Calls from the same tick share one
   * request per endpoint and query, and an ID already in flight joins the
   * pending request. A blank ID, an unknown ID, or a failed request resolves
   * to `undefined` – the promise never rejects. A failed request still
   * reaches the Panel's error handling, so an expired session or a lost
   * connection surfaces to the user.
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
   * Creates a sort comparator function.
   *
   * @param options - Sort options
   * @returns Comparator function
   */
  sort: (options?: PanelSortOptions) => PanelComparator;

  string: PanelHelpersString;

  /**
   * Creates a throttled function.
   *
   * @param callback - Function to throttle
   * @param delay - Delay in milliseconds
   * @param options - Throttle options
   * @returns Throttled function with cancel method
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
 * @source panel/src/helpers/writer.ts
 */
export interface PanelHelpersWriter {
  /**
   * Resolves the list of allowed extensions from a permissive `allowed`
   * argument (boolean, array, object map, or `undefined`).
   *
   * @param available - Map of all available extensions keyed by name
   * @param allowed - `true` to allow all, `false` to allow none, an array of
   *   names and extension instances, or an object map (keys set to `false`
   *   are filtered out)
   * @returns Allowed extension names, plus any instances passed in the array
   */
  allowedExtensions: <T = never>(
    available: Record<string, unknown>,
    allowed?: boolean | (string | T)[] | Record<string, unknown> | null,
  ) => (string | T)[];

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
    marks?:
      | boolean
      | (string | Record<string, any>)[]
      | Record<string, unknown>
      | null,
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
    nodes?:
      | boolean
      | (string | Record<string, any>)[]
      | Record<string, unknown>
      | null,
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
    allowed?: boolean | unknown[] | Record<string, unknown> | null,
  ) => Record<string, Record<string, any>>;

  /**
   * Filters a map of available extensions down to those listed in `allowed`.
   * Keeps the order of `allowed`; for marks, that order sets the nesting
   * priority. An extension instance in the array is installed under its own
   * name.
   *
   * @param available - Map of available extensions keyed by name
   * @param allowed - Allowed extension configuration
   * @returns Map of installed extensions
   */
  filterExtensions: <T extends { name: string }>(
    available: Record<string, T>,
    allowed?: boolean | (string | T)[] | Record<string, unknown> | null,
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
