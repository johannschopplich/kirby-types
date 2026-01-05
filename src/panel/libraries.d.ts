/**
 * Library type definitions for Kirby Panel.
 *
 * Provides types for the `$library` utilities available on the Vue prototype.
 * Includes color manipulation, date handling (dayjs), and textarea autosize.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/libraries
 * @since 4.0.0
 */

import type { ConfigType, Dayjs, OpUnitType } from "dayjs";

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
 * const rgb = this.$library.colors.parse("hsl(180 50% 50%)");
 * const hex = this.$library.colors.convert(rgb, "hex");
 * const css = this.$library.colors.toString(hex, "rgb");
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
   * - HEX: `#fff`, `#ffffff`, `#ffffffff`
   * - RGB: `rgb(255 255 255)`, `rgb(255, 255, 255)`, `rgba(255 255 255 / 0.5)`
   * - HSL: `hsl(180 50% 50%)`, `hsl(180deg 50% 50% / 0.5)`
   *
   * @param string - CSS color string
   * @returns Parsed color or `null` if invalid
   */
  parse: (
    string: string,
  ) => string | PanelColorRGB | PanelColorHSL | null | false;

  /**
   * Parses a color string and converts to target format.
   *
   * @param string - CSS color string
   * @param format - Target format
   * @returns Converted color or `false` if invalid
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
   * @param alpha - Include alpha channel (default: `true`)
   * @returns CSS color string
   * @throws Error if unsupported color or format (HSV cannot be output as CSS)
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
 * ISO format type for Kirby's `toISO`/`iso` methods.
 */
export type PanelDayjsISOFormat = "date" | "time" | "datetime";

/**
 * Valid units for Kirby's `round()` method.
 *
 * Note: `day` is an alias for `date`. Units `week` and `millisecond`
 * are NOT supported by `round()` and will throw an error.
 */
export type PanelDayjsRoundUnit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "date"
  | "month"
  | "year";

/**
 * Valid units for Kirby's `merge()` method.
 */
export type PanelDayjsMergeUnit =
  | "year"
  | "month"
  | "date"
  | "hour"
  | "minute"
  | "second";

/**
 * Pattern part information.
 */
export interface PanelDayjsPatternPart {
  /** Part index in pattern */
  index: number;
  /** Unit type or undefined for separators */
  unit?: "year" | "month" | "day" | "hour" | "minute" | "second" | "meridiem";
  /** Start position in pattern string */
  start: number;
  /** End position in pattern string */
  end: number;
}

/**
 * Pattern analyzer object returned by `dayjs.pattern()`.
 */
export interface PanelDayjsPattern {
  /** Original pattern string */
  pattern: string;
  /** Parsed pattern parts */
  parts: PanelDayjsPatternPart[];
  /**
   * Gets part information at cursor position/selection range.
   *
   * @param start - Start position
   * @param end - End position (defaults to start)
   * @returns Part info or undefined
   */
  at: (start: number, end?: number) => PanelDayjsPatternPart | undefined;
  /**
   * Formats a dayjs instance using this pattern.
   *
   * @param dt - Dayjs instance
   * @returns Formatted string or `null` if invalid
   */
  format: (dt: Dayjs) => string | null;
}

/**
 * Kirby plugin extensions for dayjs instances.
 *
 * These methods are added by Kirby's custom dayjs plugins.
 */
export interface PanelDayjsExtensions {
  /**
   * Formats as ISO string (Kirby format).
   *
   * @param format - `"date"` → `"YYYY-MM-DD"`, `"time"` → `"HH:mm:ss"`, `"datetime"` → `"YYYY-MM-DD HH:mm:ss"`
   * @returns ISO formatted string
   */
  toISO: (format?: PanelDayjsISOFormat) => string;

  /**
   * Validates datetime against an upper or lower (min/max) boundary.
   *
   * @param boundary - Boundary as ISO string
   * @param type - `"min"` or `"max"`
   * @param unit - Comparison unit (default: `"day"`)
   * @returns Whether the date is valid against the boundary
   */
  validate: (
    boundary: string,
    type: "min" | "max",
    unit?: OpUnitType,
  ) => boolean;

  /**
   * Merges date or time parts from another dayjs instance.
   *
   * @param dt - Dayjs instance to merge from
   * @param units - `"date"`, `"time"`, or array of specific units
   * @returns New dayjs instance (returns `this` if `dt` is invalid)
   */
  merge: (
    dt: Dayjs | null | undefined,
    units?: "date" | "time" | PanelDayjsMergeUnit[],
  ) => Dayjs & PanelDayjsExtensions;

  /**
   * Rounds to nearest unit step.
   *
   * @param unit - Unit to round (default: `"date"`)
   * @param size - Step size (default: `1`). Must divide evenly into the unit's range.
   * @returns Rounded dayjs instance
   * @throws Error if unit is invalid or size doesn't divide evenly
   */
  round: (
    unit?: PanelDayjsRoundUnit,
    size?: number,
  ) => Dayjs & PanelDayjsExtensions;
}

/**
 * Kirby-extended dayjs instance type.
 *
 * Combines the standard dayjs `Dayjs` class with Kirby's plugin extensions.
 */
export type PanelDayjsInstance = Dayjs & PanelDayjsExtensions;

/**
 * Kirby plugin extensions for the dayjs function (static methods).
 */
export interface PanelDayjsStaticExtensions {
  /**
   * Interprets date/time from various human-readable formats.
   * Tries multiple format variations automatically.
   *
   * @param input - Input string to parse
   * @param format - Expected format type (default: `"date"`)
   * @returns Dayjs instance or `null` if no format matched
   */
  interpret: (
    input: string,
    format?: "date" | "time",
  ) => PanelDayjsInstance | null;

  /**
   * Parses ISO formatted string.
   *
   * @param value - ISO string
   * @param format - ISO format type. If omitted, tries all three formats.
   * @returns Dayjs instance or `null` if invalid
   */
  iso: (
    value: string,
    format?: PanelDayjsISOFormat,
  ) => PanelDayjsInstance | null;

  /**
   * Creates a pattern analyzer for date/time formatting.
   *
   * @param pattern - Date format pattern (e.g., "YYYY-MM-DD")
   * @returns Pattern analyzer object
   */
  pattern: (pattern: string) => PanelDayjsPattern;
}

/**
 * Extended dayjs library with Kirby plugins.
 *
 * Provides date manipulation with additional methods
 * for Panel-specific date handling. Extends the official
 * dayjs types with Kirby's custom plugins.
 *
 * @example
 * ```ts
 * const dt = this.$library.dayjs("2024-01-15");
 * const iso = dt.toISO("date"); // "2024-01-15"
 * const rounded = dt.round("minute", 15); // Round to 15-minute intervals
 * const parsed = this.$library.dayjs.interpret("Jan 15 2024", "date");
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/libraries/dayjs.js
 * @since 4.0.0
 */
export interface PanelLibraryDayjs extends PanelDayjsStaticExtensions {
  /**
   * Creates a dayjs instance.
   */
  (date?: ConfigType): PanelDayjsInstance;
  (date?: ConfigType, format?: string, strict?: boolean): PanelDayjsInstance;
  (
    date?: ConfigType,
    format?: string,
    locale?: string,
    strict?: boolean,
  ): PanelDayjsInstance;

  /** Extends dayjs with a plugin */
  extend: <T = unknown>(
    plugin: (
      option: T,
      dayjsClass: typeof Dayjs,
      dayjsFactory: typeof import("dayjs"),
    ) => void,
    option?: T,
  ) => typeof import("dayjs");

  /** Gets or sets the global locale */
  locale: (preset?: string, object?: object, isLocal?: boolean) => string;

  /** Type guard for dayjs instances */
  isDayjs: (value: unknown) => value is PanelDayjsInstance;

  /** Creates a dayjs instance from Unix timestamp (seconds) */
  unix: (t: number) => PanelDayjsInstance;
}

// -----------------------------------------------------------------------------
// Autosize Types
// -----------------------------------------------------------------------------

/**
 * Autosize library for textarea auto-resizing.
 *
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
 * const hex = this.$library.colors.toString({ r: 255, g: 0, b: 0 }, "hex");
 * const date = this.$library.dayjs("2024-01-15").format("DD.MM.YYYY");
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
