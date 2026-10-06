/**
 * Helper type definitions for Kirby Panel.
 *
 * Provides types for the `$helper` utilities available on the Vue prototype.
 *
 * @since 4.0.0
 */

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
   * @param query - Search query; `null` and `undefined` return the array
   *   unfiltered before 5.5.0 and throw since.
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
   * @since 5.4.4
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
   * Trims characters from the beginning (greedy).
   * Matches `replace` literally.
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
   * Trims characters from the end (greedy).
   * Matches `replace` literally.
   *
   * @param string - String to trim
   * @param replace - Substring to strip repeatedly
   * @returns Trimmed string
   */
  rtrim: (string: string, replace?: string) => string;

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
   * Sanitizes HTML by only keeping allowed marks and nodes.
   *
   * @param html - HTML string to sanitize
   * @param options - Allowed marks/nodes (defaults to common writer marks)
   * @param options.marks - Allowed marks: `true` for all, `false` for none, an array of mark names, or a map of mark name to `true`, `false`, or mark options
   * @param options.nodes - Allowed nodes, in the same forms as `marks`
   * @returns Sanitized HTML string
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
   * Replaces `{name}`, `{{name}}`, and dotted-path placeholders (e.g. `{nested.prop}`) with values from the lookup object.
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
   * Deep clones a value. Returns `undefined` unchanged.
   * Uses `structuredClone`.
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
   * @since 5.0.0
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
   * Recursively merges source into target.
   *
   * @param target - Target object
   * @param source - Source object
   * @returns The mutated target
   */
  merge: <
    T extends Record<string, any>,
    S extends Record<string, any> = Partial<T>,
  >(
    target: T,
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
   * @since 5.4.4
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
   * @returns Clipboard content, or `null` when nothing could be read; `""`
   *   for a plain read of an empty clipboard before 5.5.0
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
  /** API endpoint paths of the field, its section, and its model. */
  endpoints?: { field?: string; section?: string; model?: string };
  fields?: Record<string, PanelFieldDefinition>;
  /** Name of the parent field, set on subfields by `subfields()`. */
  section?: string;
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
   * Annotates subfields with the parent's section name and, when present, its API endpoints (suffixing the field endpoint with the subfield name).
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
  /** Key of the matching link type. */
  type: string;
  link: string;
}

/**
 * Link preview data.
 *
 * @source panel/src/helpers/link.ts
 */
export interface PanelLinkPreview {
  label: string;
  /** Panel image settings; `url` is set only when an image resolves. */
  image?: { url?: string; [key: string]: any } | null;
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
   * Fetches preview data for a link.
   *
   * @param link - Link detection result
   * @param fields - Fields to fetch
   * @returns Preview data or `null`
   */
  preview: (
    link: PanelLinkDetection,
    fields?: string[],
  ) => Promise<PanelLinkPreview | null>;

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
  /**
   * Always `"k-status-icon"`.
   *
   * @deprecated Removed in 5.0.0.
   */
  class?: string;
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
  /** Override filename. */
  filename?: string;
  /** Request headers. */
  headers?: Record<string, string>;
  /** Additional form attributes (values are coerced to strings). */
  attributes?: Record<string, string | number>;
  /**
   * AbortSignal for cancellation.
   *
   * @since 5.0.0
   */
  abort?: AbortSignal;
  progress?: PanelUploadProgressCallback;
  /** Complete callback (declared but never invoked at runtime). */
  complete?: () => void;
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
  /** Call on leading edge. */
  leading?: boolean;
  /** Call on trailing edge. */
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
  /** Call on leading edge. */
  leading?: boolean;
  /** Call on trailing edge. */
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
 * Panel helpers available on the Vue prototype as `$helper`.
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
 */
export interface PanelHelpers {
  /**
   * @source panel/src/helpers/array.ts
   */
  array: PanelHelpersArray;

  /**
   * @source panel/src/helpers/clipboard.ts
   */
  clipboard: PanelHelpersClipboard;

  /**
   * Deep clones a value.
   * Shortcut for `object.clone()`.
   * @source panel/src/helpers/object.ts
   * @source panel/src/helpers/index.ts
   */
  clone: <T>(value: T) => T;

  /**
   * Resolves CSS color to CSS variable.
   *
   * @param value - Color name or value
   * @returns CSS variable if one matches, otherwise the lowercased value; `undefined` if not a string
   * @source panel/src/helpers/color.ts
   */
  color: (value: unknown) => string | undefined;

  /**
   * Creates a debounced function. Accepts `options` since 5.0.0.
   *
   * @param fn - Function to debounce
   * @param delay - Delay in milliseconds
   * @param options - Debounce options
   * @returns Debounced function
   * @source panel/src/helpers/debounce.ts
   * @source panel/src/helpers/index.ts
   */
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: PanelDebounceOptions,
  ) => PanelDebouncedFunction<T>;

  /**
   * @source panel/src/helpers/embed.ts
   */
  embed: PanelHelpersEmbed;

  /**
   * @source panel/src/helpers/field.ts
   */
  field: PanelHelpersField;

  /**
   * @source panel/src/helpers/file.ts
   */
  file: PanelHelpersFile;

  /**
   * Sets focus to element or first focusable child.
   *
   * @param element - Selector, element, or `null` (returns `false`)
   * @param field - Specific input name to focus
   * @returns The focused element, or `false` if nothing could be focused
   * @source panel/src/helpers/focus.ts
   */
  focus: (
    element: string | HTMLElement | null,
    field?: string,
  ) => HTMLElement | false;

  /**
   * Checks if component is registered globally.
   *
   * @param name - Component name
   * @returns `true` if registered
   * @source panel/src/helpers/isComponent.ts
   * @source panel/src/helpers/index.ts
   */
  isComponent: (name: string) => boolean;

  /**
   * Checks if event is a file drag/drop event.
   *
   * @param event - Event to check
   * @returns `true` if file upload event
   * @source panel/src/helpers/isUploadEvent.ts
   * @source panel/src/helpers/index.ts
   */
  isUploadEvent: (event: DragEvent) => boolean;

  /**
   * @source panel/src/helpers/keyboard.ts
   */
  keyboard: PanelHelpersKeyboard;

  /**
   * @source panel/src/helpers/link.ts
   */
  link: PanelHelpersLink;

  /**
   * @source panel/src/helpers/object.ts
   */
  object: PanelHelpersObject;

  /**
   * Left-pads value with zeros.
   * Shortcut for `string.pad()`.
   * @source panel/src/helpers/index.ts
   * @source panel/src/helpers/string.ts
   */
  pad: (value: string | number, length?: number) => string;

  /**
   * @source panel/src/helpers/page.ts
   */
  page: PanelHelpersPage;

  /**
   * Converts aspect ratio to percentage.
   *
   * @param fraction - Ratio string (default: `"3/2"`)
   * @param fallback - Value returned when the fraction does not split into two parts (default: `"100%"`)
   * @param vertical - Calculate for vertical orientation (default: `true`)
   * @returns Percentage string
   * @source panel/src/helpers/ratio.ts
   */
  ratio: (fraction?: string, fallback?: string, vertical?: boolean) => string;

  /**
   * Converts string to slug.
   * Shortcut for `string.slug()`.
   * @source panel/src/helpers/index.ts
   * @source panel/src/helpers/string.ts
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
   * @source panel/src/helpers/sort.ts
   */
  sort: (options?: PanelSortOptions) => PanelComparator;

  /**
   * @source panel/src/helpers/string.ts
   */
  string: PanelHelpersString;

  /**
   * Creates a throttled function.
   *
   * @param fn - Function to throttle
   * @param delay - Delay in milliseconds
   * @param options - Throttle options
   * @returns Throttled function with cancel method
   * @since 5.0.0
   * @source panel/src/helpers/throttle.ts
   * @source panel/src/helpers/index.ts
   */
  throttle: <T extends (...args: any[]) => any>(
    fn: T,
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
   *   object when the body is not JSON; stays pending on a network error or abort
   * @source panel/src/helpers/upload.ts
   * @source panel/src/helpers/index.ts
   */
  upload: (file: File, params: PanelUploadParams) => Promise<unknown>;

  /**
   * @source panel/src/helpers/url.ts
   */
  url: PanelHelpersUrl;

  /**
   * Generates UUID v4 string.
   * Shortcut for `string.uuid()`.
   * @source panel/src/helpers/index.ts
   * @source panel/src/helpers/string.ts
   */
  uuid: () => string;

  /**
   * Writer (ProseMirror) extension helpers for resolving allowed marks/nodes
   * and building extension instances.
   *
   * @since 5.5.0
   * @source panel/src/helpers/writer.js
   * @source panel/src/helpers/index.ts
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
   * argument (boolean, array, object map, or `undefined`).
   *
   * @param available - Map of all available extensions keyed by name
   * @param allowed - `true` to allow all, `false` to allow none, an array of
   *   names, or an object map (keys set to `false` are filtered out)
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
   * Keeps the order of `allowed` since 5.6.0, the order of `available` before;
   * for marks, that order sets the nesting priority.
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
