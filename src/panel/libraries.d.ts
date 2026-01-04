/**
 * Library type definitions for Kirby Panel.
 *
 * Provides types for the `$library` utilities available on the Vue prototype.
 * Includes color manipulation, date handling (dayjs), and textarea autosize.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/libraries
 * @since 4.0.0
 */

// -----------------------------------------------------------------------------
// Color Types
// -----------------------------------------------------------------------------

/**
 * Color format identifiers.
 */
export type PanelColorFormat = "hex" | "rgb" | "hsl" | "hsv";

/**
 * RGB color object.
 */
export interface PanelColorRGB {
  /** Red channel (0-255) */
  r: number;
  /** Green channel (0-255) */
  g: number;
  /** Blue channel (0-255) */
  b: number;
  /** Alpha channel (0-1) */
  a?: number;
}

/**
 * HSL color object.
 */
export interface PanelColorHSL {
  /** Hue (0-360) */
  h: number;
  /** Saturation (0-1) */
  s: number;
  /** Lightness (0-1) */
  l: number;
  /** Alpha channel (0-1) */
  a?: number;
}

/**
 * HSV color object.
 */
export interface PanelColorHSV {
  /** Hue (0-360) */
  h: number;
  /** Saturation (0-1) */
  s: number;
  /** Value/Brightness (0-1) */
  v: number;
  /** Alpha channel (0-1) */
  a?: number;
}

/**
 * Any color object type.
 */
export type PanelColorObject = PanelColorRGB | PanelColorHSL | PanelColorHSV;

/**
 * Color input (string or object).
 */
export type PanelColorInput = string | PanelColorObject;

/**
 * Color library for color space conversions.
 *
 * Provides comprehensive color manipulation including
 * parsing CSS color strings and converting between
 * HEX, RGB, HSL, and HSV color spaces.
 *
 * @example
 * ```ts
 * const rgb = this.$library.colors.parse('hsl(180 50% 50%)');
 * const hex = this.$library.colors.convert(rgb, 'hex');
 * const css = this.$library.colors.toString(hex, 'rgb');
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/libraries/colors.js
 * @since 4.0.0
 */
export interface PanelLibraryColors {
  /**
   * Converts a color to another color space.
   *
   * @param color - Color to convert (hex string or color object)
   * @param format - Target format
   * @returns Converted color
   * @throws Error if invalid color or conversion
   */
  convert: {
    (color: string, format: "hex"): string;
    (color: string, format: "rgb"): PanelColorRGB;
    (color: string, format: "hsl"): PanelColorHSL;
    (color: string, format: "hsv"): PanelColorHSV;
    (color: PanelColorRGB, format: "hex"): string;
    (color: PanelColorRGB, format: "rgb"): PanelColorRGB;
    (color: PanelColorRGB, format: "hsl"): PanelColorHSL;
    (color: PanelColorRGB, format: "hsv"): PanelColorHSV;
    (color: PanelColorHSL, format: "hex"): string;
    (color: PanelColorHSL, format: "rgb"): PanelColorRGB;
    (color: PanelColorHSL, format: "hsl"): PanelColorHSL;
    (color: PanelColorHSL, format: "hsv"): PanelColorHSV;
    (color: PanelColorHSV, format: "hex"): string;
    (color: PanelColorHSV, format: "rgb"): PanelColorRGB;
    (color: PanelColorHSV, format: "hsl"): PanelColorHSL;
    (color: PanelColorHSV, format: "hsv"): PanelColorHSV;
    (
      color: PanelColorInput,
      format: PanelColorFormat,
    ): string | PanelColorObject;
  };

  /**
   * Parses a CSS color string to HEX string or color object.
   *
   * Supports:
   * - HEX: #fff, #ffffff, #ffffffff
   * - RGB: rgb(255 255 255), rgb(255, 255, 255), rgba(255 255 255 / 0.5)
   * - HSL: hsl(180 50% 50%), hsl(180deg 50% 50% / 0.5)
   *
   * @param string - CSS color string
   * @returns Parsed color or null/false if invalid
   */
  parse: (
    string: string,
  ) => string | PanelColorRGB | PanelColorHSL | null | false;

  /**
   * Parses a color string and converts to target format.
   *
   * @param string - CSS color string
   * @param format - Target format
   * @returns Converted color or false if invalid
   */
  parseAs: {
    (string: string, format: "hex"): string | false;
    (string: string, format: "rgb"): PanelColorRGB | false;
    (string: string, format: "hsl"): PanelColorHSL | false;
    (string: string, format: "hsv"): PanelColorHSV | false;
    (
      string: string,
      format?: PanelColorFormat,
    ): string | PanelColorObject | false;
  };

  /**
   * Formats a color as a CSS string.
   *
   * @param color - Color to format (string or object)
   * @param format - Target format (optional, converts if needed)
   * @param alpha - Include alpha channel (default: true)
   * @returns CSS color string
   * @throws Error if unsupported color
   */
  toString: (
    color: PanelColorInput,
    format?: PanelColorFormat,
    alpha?: boolean,
  ) => string;
}

// -----------------------------------------------------------------------------
// Dayjs Types
// -----------------------------------------------------------------------------

/**
 * ISO format type.
 */
export type PanelDayjsISOFormat = "date" | "time" | "datetime";

/**
 * Pattern part information.
 */
export interface PanelDayjsPatternPart {
  /** Pattern token */
  token: string;
  /** Start position */
  start: number;
  /** End position */
  end: number;
}

/**
 * Pattern analyzer object.
 */
export interface PanelDayjsPattern {
  /** Original pattern string */
  pattern: string;
  /** Parsed pattern parts */
  parts: PanelDayjsPatternPart[];
  /**
   * Gets part information at position range.
   *
   * @param start - Start position
   * @param end - End position
   * @returns Part info or undefined
   */
  at: (start: number, end: number) => PanelDayjsPatternPart | undefined;
  /**
   * Formats a dayjs instance using this pattern.
   *
   * @param dt - Dayjs instance
   * @returns Formatted string
   */
  format: (dt: PanelDayjsInstance) => string;
}

/**
 * Extended dayjs instance with Kirby plugins.
 */
export interface PanelDayjsInstance {
  /**
   * Formats as ISO string.
   *
   * @param format - 'date', 'time', or 'datetime'
   * @returns ISO formatted string
   */
  toISO: (format?: PanelDayjsISOFormat) => string;

  /**
   * Validates against a boundary.
   *
   * @param boundary - Boundary date
   * @param type - Validation type
   * @param unit - Comparison unit (default: `'day'`)
   * @returns Whether valid
   */
  validate: (
    boundary: PanelDayjsInput,
    type: "min" | "max",
    unit?: PanelDayjsUnit,
  ) => boolean;

  /**
   * Merges date or time parts from another dayjs.
   *
   * @param dt - Dayjs to merge from
   * @param units - 'date', 'time', or array of units
   * @returns New dayjs instance
   */
  merge: (
    dt: PanelDayjsInput,
    units?: "date" | "time" | PanelDayjsUnit[],
  ) => PanelDayjsInstance;

  /**
   * Rounds to nearest unit step.
   *
   * @param unit - Unit to round (default: `'date'`)
   * @param size - Step size (default: 1)
   * @returns Rounded dayjs instance
   */
  round: (unit?: PanelDayjsUnit, size?: number) => PanelDayjsInstance;

  // Standard dayjs methods
  format: (template?: string) => string;
  valueOf: () => number;
  unix: () => number;
  toString: () => string;
  toDate: () => Date;
  toJSON: () => string;
  toISOString: () => string;
  isValid: () => boolean;
  isSame: (date?: PanelDayjsInput, unit?: PanelDayjsUnit) => boolean;
  isBefore: (date?: PanelDayjsInput, unit?: PanelDayjsUnit) => boolean;
  isAfter: (date?: PanelDayjsInput, unit?: PanelDayjsUnit) => boolean;
  year: () => number;
  month: () => number;
  date: () => number;
  day: () => number;
  hour: () => number;
  minute: () => number;
  second: () => number;
  millisecond: () => number;
  set: (unit: PanelDayjsUnit, value: number) => PanelDayjsInstance;
  add: (value: number, unit?: PanelDayjsUnit) => PanelDayjsInstance;
  subtract: (value: number, unit?: PanelDayjsUnit) => PanelDayjsInstance;
  startOf: (unit: PanelDayjsUnit) => PanelDayjsInstance;
  endOf: (unit: PanelDayjsUnit) => PanelDayjsInstance;
  clone: () => PanelDayjsInstance;
  locale: (locale?: string) => PanelDayjsInstance | string;
}

/**
 * Dayjs input types.
 */
export type PanelDayjsInput =
  | string
  | number
  | Date
  | PanelDayjsInstance
  | null
  | undefined;

/**
 * Dayjs unit types.
 */
export type PanelDayjsUnit =
  | "year"
  | "month"
  | "week"
  | "day"
  | "date"
  | "hour"
  | "minute"
  | "second"
  | "millisecond";

/**
 * Extended dayjs library with Kirby plugins.
 *
 * Provides date manipulation with additional methods
 * for Panel-specific date handling.
 *
 * @example
 * ```ts
 * const dt = this.$library.dayjs('2024-01-15');
 * const iso = dt.toISO('date'); // '2024-01-15'
 * const rounded = dt.round('hour', 15); // Round to 15-minute intervals
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/libraries/dayjs.js
 * @since 4.0.0
 */
export interface PanelLibraryDayjs {
  /**
   * Creates a dayjs instance.
   *
   * @param date - Date input
   * @param format - Parse format
   * @returns Dayjs instance
   */
  (date?: PanelDayjsInput, format?: string): PanelDayjsInstance;

  /**
   * Interprets date/time from various formats.
   * Tries multiple format variations automatically.
   *
   * @param input - Input string
   * @param format - Expected format type
   * @returns Dayjs instance
   */
  interpret: (
    input: string,
    format?: PanelDayjsISOFormat,
  ) => PanelDayjsInstance;

  /**
   * Parses ISO formatted string.
   *
   * @param value - ISO string
   * @param format - ISO format type
   * @returns Dayjs instance
   */
  iso: (value: string, format?: PanelDayjsISOFormat) => PanelDayjsInstance;

  /**
   * Creates a pattern analyzer.
   *
   * @param pattern - Date format pattern
   * @returns Pattern analyzer object
   */
  pattern: (pattern: string) => PanelDayjsPattern;

  // Standard dayjs static methods
  extend: (plugin: unknown) => void;
  locale: (locale?: string) => string;
  isDayjs: (value: unknown) => value is PanelDayjsInstance;
}

// -----------------------------------------------------------------------------
// Autosize Types
// -----------------------------------------------------------------------------

/**
 * Autosize library for textarea auto-resizing.
 *
 * External library from npm package "autosize".
 * Automatically adjusts textarea height based on content.
 *
 * @see https://www.npmjs.com/package/autosize
 */
export interface PanelLibraryAutosize {
  /**
   * Enables autosize on textarea element(s).
   *
   * @param element - Element(s) to autosize
   * @returns The input element(s)
   */
  (
    element: HTMLTextAreaElement | HTMLTextAreaElement[] | NodeList,
  ): typeof element;

  /**
   * Triggers a resize update.
   *
   * @param element - Element(s) to update
   */
  update: (
    element: HTMLTextAreaElement | HTMLTextAreaElement[] | NodeList,
  ) => void;

  /**
   * Destroys autosize on element(s).
   *
   * @param element - Element(s) to destroy
   */
  destroy: (
    element: HTMLTextAreaElement | HTMLTextAreaElement[] | NodeList,
  ) => void;
}

// -----------------------------------------------------------------------------
// Main Library Interface
// -----------------------------------------------------------------------------

/**
 * Panel libraries available on the Vue prototype as `$library`.
 *
 * Provides utilities for color manipulation, date handling,
 * and textarea auto-resizing.
 *
 * @example
 * ```ts
 * // In a Vue component
 * const hex = this.$library.colors.toString({ r: 255, g: 0, b: 0 }, 'hex');
 * const date = this.$library.dayjs('2024-01-15').format('DD.MM.YYYY');
 * this.$library.autosize(this.$refs.textarea);
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/libraries/index.js
 */
export interface PanelLibrary {
  /**
   * Textarea auto-resize library.
   */
  autosize: PanelLibraryAutosize;

  /**
   * Color manipulation library.
   */
  colors: PanelLibraryColors;

  /**
   * Date manipulation library (extended dayjs).
   */
  dayjs: PanelLibraryDayjs;
}
