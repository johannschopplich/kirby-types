/**
 * Helper type definitions for Kirby Panel.
 *
 * Provides types for the `$helper` utilities available on the Vue prototype.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/helpers
 * @since 4.0.0
 */

// -----------------------------------------------------------------------------
// Array Helpers
// -----------------------------------------------------------------------------

/**
 * Search options for array filtering.
 */
export interface PanelArraySearchOptions {
  /** Minimum query length (default: 0) */
  min?: number;
  /** Field to search in (default: `"text"`) */
  field?: string;
  /** Maximum results to return */
  limit?: number;
}

/**
 * Array helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/array.js
 */
export interface PanelHelpersArray {
  /**
   * Creates an array from an object or returns input if already array.
   *
   * @param object - Object or array to convert
   * @returns Array of values
   */
  fromObject: <T>(object: T[] | Record<string, T>) => T[];

  /**
   * Searches through an array by query string.
   *
   * @param array - Array to search
   * @param query - Search query
   * @param options - Search options
   * @returns Filtered array
   */
  search: <T extends Record<string, any>>(
    array: T[],
    query: string,
    options?: PanelArraySearchOptions,
  ) => T[];

  /**
   * Sorts array by field and direction.
   *
   * @param array - Array to sort
   * @param sortBy - Sort specification (e.g., `"name asc"`, `"date desc"`)
   * @returns Sorted array
   */
  sortBy: <T extends Record<string, any>>(array: T[], sortBy: string) => T[];

  /**
   * Splits array into subarrays using delimiter element.
   *
   * @param array - Array to split
   * @param delimiter - Element to split on
   * @returns Array of subarrays
   */
  split: <T>(array: T[], delimiter: T) => T[][];

  /**
   * Wraps non-array values in an array.
   *
   * @param array - Value to wrap
   * @returns Original array or wrapped value
   */
  wrap: <T>(array: T | T[]) => T[];
}

// -----------------------------------------------------------------------------
// String Helpers
// -----------------------------------------------------------------------------

/**
 * Slug conversion rules.
 */
export type PanelSlugRules = Record<string, string>[];

/**
 * String helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/string.js
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
   * @param string - String to escape
   * @returns Escaped string
   */
  escapeHTML: (string: string) => string;

  /**
   * Checks if string contains emoji characters.
   *
   * @param string - String to check
   * @returns True if contains emoji
   */
  hasEmoji: (string: string) => boolean;

  /**
   * Checks if string is empty or falsy.
   *
   * @param string - String to check
   * @returns True if empty
   */
  isEmpty: (string: string | null | undefined) => boolean;

  /**
   * Converts first letter to lowercase.
   *
   * @param string - String to convert
   * @returns Converted string
   */
  lcfirst: (string: string) => string;

  /**
   * Trims characters from the beginning (greedy).
   *
   * @param string - String to trim
   * @param replace - Characters to remove
   * @returns Trimmed string
   */
  ltrim: (string: string, replace: string) => string;

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
   *
   * @param string - String to trim
   * @param replace - Characters to remove
   * @returns Trimmed string
   */
  rtrim: (string: string, replace: string) => string;

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
   * Replaces template placeholders with values.
   * Supports `{{name}}` and `{{nested.prop}}` syntax.
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

// -----------------------------------------------------------------------------
// Object Helpers
// -----------------------------------------------------------------------------

/**
 * Object helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/object.js
 */
export interface PanelHelpersObject {
  /**
   * Deep clones an object or array using structuredClone.
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
   * @returns True if empty
   */
  isEmpty: (value: unknown) => boolean;

  /**
   * Checks if input is a plain object (not array, null, etc.).
   *
   * @param input - Value to check
   * @returns True if plain object
   */
  isObject: (input: unknown) => input is Record<string, unknown>;

  /**
   * Counts keys in an object.
   *
   * @param object - Object to count
   * @returns Number of keys
   */
  length: (object: Record<string, any>) => number;

  /**
   * Recursively merges source into target.
   *
   * @param target - Target object
   * @param source - Source object
   * @returns Merged object
   */
  merge: <T extends Record<string, any>>(target: T, source?: Partial<T>) => T;

  /**
   * Compares objects by JSON stringification.
   *
   * @param a - First object
   * @param b - Second object
   * @returns True if identical
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

// -----------------------------------------------------------------------------
// URL Helpers
// -----------------------------------------------------------------------------

/**
 * URL helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/url.js
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
    query?: Record<string, string | number | boolean | null>,
    origin?: string | URL,
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
    query?: Record<string, string | number | boolean | null>,
    origin?: string | URL,
  ) => URL;

  /**
   * Checks if URL string starts with http:// or https://.
   *
   * @param url - URL to check
   * @returns True if absolute
   */
  isAbsolute: (url: string) => boolean;

  /**
   * Checks if URL is on the same origin as current page.
   *
   * @param url - URL to check
   * @returns True if same origin
   */
  isSameOrigin: (url: string | URL) => boolean;

  /**
   * Validates URL format.
   *
   * @param url - URL to validate
   * @param strict - Use Kirby's URL regex for validation
   * @returns True if valid URL
   */
  isUrl: (url: string | URL, strict?: boolean) => boolean;

  /**
   * Converts relative path to absolute URL.
   *
   * @param path - Path to convert
   * @param origin - Base origin
   * @returns Absolute URL string
   */
  makeAbsolute: (path: string, origin?: string | URL) => string;

  /**
   * Converts string to URL object.
   *
   * @param url - URL string or object
   * @param origin - Base origin for relative URLs
   * @returns URL object
   */
  toObject: (url: string | URL, origin?: string | URL) => URL;
}

// -----------------------------------------------------------------------------
// Clipboard Helpers
// -----------------------------------------------------------------------------

/**
 * Clipboard helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/clipboard.js
 */
export interface PanelHelpersClipboard {
  /**
   * Reads from clipboard event or string.
   *
   * @param event - ClipboardEvent or string
   * @param plain - Read as plain text only
   * @returns Clipboard content or null if empty
   */
  read: (event: ClipboardEvent | string, plain?: boolean) => string | null;

  /**
   * Writes to clipboard. Objects are auto-JSONified.
   *
   * @param value - Value to write
   * @param event - ClipboardEvent for event-based writing
   * @returns True if successful
   */
  write: (value: any, event?: ClipboardEvent) => boolean;
}

// -----------------------------------------------------------------------------
// Embed Helpers
// -----------------------------------------------------------------------------

/**
 * Embed helper utilities for video providers.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/embed.js
 */
export interface PanelHelpersEmbed {
  /**
   * Converts YouTube URL to embed URL.
   *
   * @param url - YouTube video URL
   * @param doNotTrack - Enable privacy-enhanced mode
   * @returns Embed URL or false if not valid
   */
  youtube: (url: string, doNotTrack?: boolean) => string | false;

  /**
   * Converts Vimeo URL to embed URL.
   *
   * @param url - Vimeo video URL
   * @param doNotTrack - Enable do-not-track mode
   * @returns Embed URL or false if not valid
   */
  vimeo: (url: string, doNotTrack?: boolean) => string | false;

  /**
   * Auto-detects provider and converts to embed URL.
   *
   * @param url - Video URL
   * @param doNotTrack - Privacy mode
   * @returns Embed URL or false if not valid
   */
  video: (url: string, doNotTrack?: boolean) => string | false;
}

// -----------------------------------------------------------------------------
// Field Helpers
// -----------------------------------------------------------------------------

/**
 * Field definition object.
 */
export interface PanelFieldDefinition {
  /** Field type */
  type?: string;
  /** Default value */
  default?: any;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Conditional visibility */
  when?: Record<string, any>;
  /** API endpoint */
  endpoints?: { field?: string; section?: string; model?: string };
  /** Nested fields */
  fields?: Record<string, PanelFieldDefinition>;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Field helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/field.js
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
   * Checks if field is visible based on 'when' conditions.
   *
   * @param field - Field definition
   * @param values - Current form values
   * @returns True if visible
   */
  isVisible: (
    field: PanelFieldDefinition,
    values: Record<string, any>,
  ) => boolean;

  /**
   * Propagates parent field's API endpoints to nested subfield definitions.
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

// -----------------------------------------------------------------------------
// File Helpers
// -----------------------------------------------------------------------------

/**
 * File helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/file.js
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
   * @returns Formatted size (e.g., `"1.2 MB"`)
   */
  niceSize: (size: number) => string;
}

// -----------------------------------------------------------------------------
// Keyboard Helpers
// -----------------------------------------------------------------------------

/**
 * Keyboard helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/keyboard.js
 */
export interface PanelHelpersKeyboard {
  /**
   * Returns the meta key name for the current OS.
   *
   * @returns `"cmd"` on Mac, `"ctrl"` on other OS
   */
  metaKey: () => "cmd" | "ctrl";
}

// -----------------------------------------------------------------------------
// Link Helpers
// -----------------------------------------------------------------------------

/**
 * Link type definition.
 */
export interface PanelLinkType {
  /** Detection function */
  detect: (value: string) => boolean;
  /** Icon name */
  icon: string;
  /** Type identifier */
  id: string;
  /** Display label */
  label: string;
  /** Extracts link from value */
  link: (value: string) => string;
  /** Input placeholder */
  placeholder?: string;
  /** Input validation pattern */
  pattern?: string;
  /** Input type */
  input?: string;
  /** Converts input to stored value */
  value: (value: string) => string;
}

/**
 * Detected link result.
 */
export interface PanelLinkDetection {
  /** Detected type */
  type: string;
  /** Extracted link */
  link: string;
}

/**
 * Link preview data.
 */
export interface PanelLinkPreview {
  /** Display label */
  label: string;
  /** Preview image */
  image?: { url: string; [key: string]: any };
}

/**
 * Link helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/link.js
 */
export interface PanelHelpersLink {
  /**
   * Detects link type and extracts link value.
   *
   * @param value - Link value to detect
   * @param types - Custom type definitions
   * @returns Detection result or undefined if no match
   */
  detect: (
    value: string,
    types?: Record<string, PanelLinkType>,
  ) => PanelLinkDetection | undefined;

  /**
   * Converts file permalink to file:// UUID.
   *
   * @param value - Permalink value
   * @returns File UUID
   */
  getFileUUID: (value: string) => string;

  /**
   * Converts page permalink to page:// UUID.
   *
   * @param value - Permalink value
   * @returns Page UUID
   */
  getPageUUID: (value: string) => string;

  /**
   * Checks if value is a file UUID or permalink.
   *
   * @param value - Value to check
   * @returns True if file reference
   */
  isFileUUID: (value: string) => boolean;

  /**
   * Checks if value is a page UUID or permalink.
   *
   * @param value - Value to check
   * @returns True if page reference
   */
  isPageUUID: (value: string) => boolean;

  /**
   * Fetches preview data for a link.
   *
   * @param link - Link detection result
   * @param fields - Fields to fetch
   * @returns Preview data or null
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

// -----------------------------------------------------------------------------
// Page Helpers
// -----------------------------------------------------------------------------

/**
 * Page status button props.
 */
export interface PanelPageStatusProps {
  /** Status title */
  title: string;
  /** Status icon */
  icon: string;
  /** Status color */
  theme?: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Button size */
  size: string;
  /** Button style */
  style: string;
}

/**
 * Page helper utilities.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/page.js
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

// -----------------------------------------------------------------------------
// Upload Helpers
// -----------------------------------------------------------------------------

/**
 * Upload progress callback.
 */
export type PanelUploadProgressCallback = (
  xhr: XMLHttpRequest,
  file: File,
  percent: number,
) => void;

/**
 * Upload complete callback.
 */
export type PanelUploadCompleteCallback = (
  xhr: XMLHttpRequest,
  file: File,
  response: any,
) => void;

/**
 * Upload parameters.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/upload.js
 */
export interface PanelUploadParams {
  /** Upload endpoint URL */
  url: string;
  /** HTTP method (default: `"POST"`) */
  method?: string;
  /** Form field name (default: `"file"`) */
  field?: string;
  /** Override filename */
  filename?: string;
  /** Request headers */
  headers?: Record<string, string>;
  /** Additional form attributes */
  attributes?: Record<string, any>;
  /** AbortSignal for cancellation */
  abort?: AbortSignal;
  /** Progress callback */
  progress?: PanelUploadProgressCallback;
  /** Complete callback */
  complete?: PanelUploadCompleteCallback;
  /** Success callback */
  success?: PanelUploadCompleteCallback;
  /** Error callback */
  error?: PanelUploadCompleteCallback;
}

// -----------------------------------------------------------------------------
// Debounce/Throttle Helpers
// -----------------------------------------------------------------------------

/**
 * Debounce options.
 */
export interface PanelDebounceOptions {
  /** Call on leading edge (default: false) */
  leading?: boolean;
  /** Call on trailing edge (default: true) */
  trailing?: boolean;
}

/**
 * Throttle options.
 */
export interface PanelThrottleOptions {
  /** Call on leading edge (default: true) */
  leading?: boolean;
  /** Call on trailing edge (default: false) */
  trailing?: boolean;
}

/**
 * Debounced function (without cancel method).
 */
export interface PanelDebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

/**
 * Throttled function with cancel method.
 */
export interface PanelThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancels pending invocation */
  cancel: () => void;
}

// -----------------------------------------------------------------------------
// Sort Helper
// -----------------------------------------------------------------------------

/**
 * Sort options.
 */
export interface PanelSortOptions {
  /** Sort descending (default: false) */
  desc?: boolean;
  /** Case insensitive comparison (default: false) */
  insensitive?: boolean;
}

/**
 * Comparator function for sorting.
 */
export type PanelComparator = (a: string, b: string) => number;

// -----------------------------------------------------------------------------
// Main Helpers Interface
// -----------------------------------------------------------------------------

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
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/helpers/index.js
 */
export interface PanelHelpers {
  /** Array utilities */
  array: PanelHelpersArray;

  /** Clipboard utilities */
  clipboard: PanelHelpersClipboard;

  /**
   * Deep clones a value.
   * Shortcut for `object.clone()`.
   */
  clone: <T>(value: T) => T;

  /**
   * Resolves CSS color to CSS variable.
   *
   * @param value - Color name or value
   * @returns CSS variable or original value, undefined if not a string
   */
  color: (value: string) => string | undefined;

  /**
   * Creates a debounced function.
   *
   * @param fn - Function to debounce
   * @param delay - Delay in milliseconds
   * @param options - Debounce options
   * @returns Debounced function with cancel method
   */
  debounce: <T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options?: PanelDebounceOptions,
  ) => PanelDebouncedFunction<T>;

  /** Video embed utilities */
  embed: PanelHelpersEmbed;

  /** Field utilities */
  field: PanelHelpersField;

  /** File utilities */
  file: PanelHelpersFile;

  /**
   * Sets focus to element or first focusable child.
   *
   * @param element - Selector or element
   * @param field - Specific input name to focus
   * @returns The focused element, or false if nothing could be focused
   */
  focus: (element: string | HTMLElement, field?: string) => HTMLElement | false;

  /**
   * Checks if component is registered globally.
   *
   * @param name - Component name
   * @returns True if registered
   */
  isComponent: (name: string) => boolean;

  /**
   * Checks if event is a file drag/drop event.
   *
   * @param event - Event to check
   * @returns True if file upload event
   */
  isUploadEvent: (event: Event) => boolean;

  /** Keyboard utilities */
  keyboard: PanelHelpersKeyboard;

  /** Link utilities */
  link: PanelHelpersLink;

  /** Object utilities */
  object: PanelHelpersObject;

  /**
   * Left-pads value with zeros.
   * Shortcut for `string.pad()`.
   */
  pad: (value: string | number, length?: number) => string;

  /** Page utilities */
  page: PanelHelpersPage;

  /**
   * Converts aspect ratio to percentage.
   *
   * @param fraction - Ratio string (e.g., `"3/2"`)
   * @param fallback - Fallback value (default: `"100%"`)
   * @param vertical - Calculate for vertical orientation
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

  /** String utilities */
  string: PanelHelpersString;

  /**
   * Creates a throttled function.
   *
   * @param fn - Function to throttle
   * @param delay - Delay in milliseconds
   * @param options - Throttle options
   * @returns Throttled function with cancel method
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
   * @returns Promise resolving to response
   */
  upload: (file: File, params: PanelUploadParams) => Promise<any>;

  /** URL utilities */
  url: PanelHelpersUrl;

  /**
   * Generates UUID v4 string.
   * Shortcut for `string.uuid()`.
   */
  uuid: () => string;
}
