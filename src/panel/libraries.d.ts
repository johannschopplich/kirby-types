/**
 * Library type definitions for Kirby Panel.
 *
 * Provides types for the `$library` utilities available on the Vue prototype.
 * Includes color manipulation, date handling (dayjs), and textarea autosize.
 */

import type {
  ConfigType,
  Dayjs,
  OptionType,
  PluginFunc,
  UnitType,
  UnitTypeLong,
} from "dayjs";

// #region Color Types

/**
 * Color format identifiers.
 *
 * @source panel/src/libraries/colors.ts
 */
export type PanelColorFormat = "hex" | "rgb" | "hsl" | "hsv";

/**
 * @source panel/src/libraries/colors.ts
 */
export interface PanelColorRGB {
  /** Red channel (0-255). */
  r: number;
  /** Green channel (0-255). */
  g: number;
  /** Blue channel (0-255). */
  b: number;
  /** Alpha channel (0-1). */
  a?: number;
}

/**
 * @source panel/src/libraries/colors.ts
 */
export interface PanelColorHSL {
  /** Hue (0-360). */
  h: number;
  /** Saturation (0-1). */
  s: number;
  /** Lightness (0-1). */
  l: number;
  /** Alpha channel (0-1). */
  a?: number;
}

/**
 * @source panel/src/libraries/colors.ts
 */
export interface PanelColorHSV {
  /** Hue (0-360). */
  h: number;
  /** Saturation (0-1). */
  s: number;
  /** Value/Brightness (0-1). */
  v: number;
  /** Alpha channel (0-1). */
  a?: number;
}

/**
 * @source panel/src/libraries/colors.ts
 */
export type PanelColorObject = PanelColorRGB | PanelColorHSL | PanelColorHSV;

/**
 * Any color, as a CSS string or an object.
 *
 * @source panel/src/libraries/colors.ts
 */
export type PanelColor = string | PanelColorObject;

/**
 * Parses CSS color strings and converts between HEX, RGB, HSL, and HSV color spaces.
 *
 * @example
 * ```ts
 * const rgb = this.$library.colors.parse("hsl(180 50% 50%)");
 * const hex = this.$library.colors.convert(rgb, "hex");
 * const css = this.$library.colors.toString(hex, "rgb");
 * ```
 *
 * @source panel/src/libraries/colors.ts
 * @source panel/src/libraries/colors-checks.ts
 * @source panel/src/libraries/colors-func.ts
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
    (color: PanelColor, format: PanelColorFormat): string | PanelColorObject;
  };

  /**
   * Parses a CSS color string to HEX string or color object.
   *
   * Supports:
   * - HEX: `#fff`, `#ffff`, `#ffffff`, `#ffffffff`
   * - RGB: `rgb(255 255 255)`, `rgb(255, 255, 255)`, `rgba(255 255 255 / 0.5)`
   * - HSL: `hsl(180 50% 50%)`, `hsl(180deg 50% 50% / 0.5)`
   *
   * @param string - CSS color string
   * @returns Parsed color, `null` if unparsable, or `false` for empty input
   */
  parse: (string: string) => string | PanelColorObject | null | false;

  /**
   * Parses a color string and converts to target format.
   *
   * @param string - CSS color string
   * @param format - Target format
   * @returns Converted color, `null` if unparsable, or `false` for empty input
   */
  parseAs: {
    (string: string, format: "hex"): string | null | false;
    (string: string, format: "rgb"): PanelColorRGB | null | false;
    (string: string, format: "hsl"): PanelColorHSL | null | false;
    (string: string, format: "hsv"): PanelColorHSV | null | false;
    (
      string: string,
      format?: PanelColorFormat,
    ): string | PanelColorObject | null | false;
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
    color: PanelColor,
    format?: PanelColorFormat,
    alpha?: boolean,
  ) => string;
}
// #endregion

// #region Dayjs Types

/**
 * @source panel/src/libraries/dayjs-pattern.ts
 */
export interface PanelDayjsPatternPart {
  index: number;
  /** Unit the part refers to, `undefined` for a letter sequence that is not a supported token, e.g. `Do`. */
  unit?: "year" | "month" | "day" | "hour" | "minute" | "second" | "meridiem";
  /** Start position in the pattern. */
  start: number;
  /** End position (inclusive) in the pattern. */
  end: number;
}

/**
 * Pattern analyzer object returned by `dayjs.pattern()`.
 * @source panel/src/libraries/dayjs-pattern.ts
 */
export interface PanelDayjsPattern {
  pattern: string;
  parts: PanelDayjsPatternPart[];
  /**
   * Gets part information at cursor position/selection range.
   *
   * @param start - Start position
   * @param end - End position (defaults to start)
   * @returns Part info or `undefined`
   */
  at: (start: number, end?: number) => PanelDayjsPatternPart | undefined;
  /**
   * Formats a dayjs instance using this pattern.
   *
   * @param dt - Dayjs instance (optional)
   * @returns Formatted string or `null` if invalid
   */
  format: (dt?: Dayjs | null) => string | null;
}

/**
 * Kirby plugin extensions for dayjs instances.
 * @source panel/src/libraries/dayjs-iso.ts
 * @source panel/src/libraries/dayjs-validate.ts
 * @source panel/src/libraries/dayjs-merge.ts
 * @source panel/src/libraries/dayjs-round.ts
 */
export interface PanelDayjsExtensions {
  /**
   * Formats as ISO string (Kirby format).
   *
   * @param format - `"date"` → `"YYYY-MM-DD"`, `"time"` → `"HH:mm:ss"`, `"datetime"` → `"YYYY-MM-DD HH:mm:ss"` (default: `"datetime"`)
   * @returns ISO formatted string
   */
  toISO: (format?: "date" | "time" | "datetime") => string;

  /**
   * Validates datetime against an upper or lower (min/max) boundary.
   *
   * @param boundary - Boundary as ISO string. If falsy, returns `true` when the dayjs instance is valid.
   * @param type - `"min"` or `"max"` (default: `"min"`)
   * @param unit - Comparison unit (default: `"day"`)
   * @returns Whether the date is valid against the boundary
   */
  validate: (
    boundary?: string,
    type?: "min" | "max",
    unit?: UnitType,
  ) => boolean;

  /**
   * Merges date or time parts from another dayjs instance.
   *
   * @param dt - Dayjs instance to merge from
   * @param units - `"date"`, `"time"`, or array of specific units (`"year"`, `"month"`, `"date"`, `"hour"`, `"minute"`, `"second"`) (default: `"date"`)
   * @returns New dayjs instance (returns `this` if `dt` is invalid)
   */
  merge: (
    dt: Dayjs | null | undefined,
    units?: "date" | "time" | UnitType[],
  ) => Dayjs & PanelDayjsExtensions;

  /**
   * Rounds to the nearest step of a unit, e.g. to the nearest 15 minutes.
   *
   * `day` is read as `date`. All sub-units of the step unit are cleared,
   * except milliseconds when rounding to `second`.
   * `millisecond` throws.
   *
   * @param unit - Unit to round to (default: `"date"`)
   * @param size - Step size (default: `1`). Has to divide the unit evenly, e.g. `15` of 60 minutes; `date`, `month`, and `year` only take `1`.
   * @returns Rounded dayjs instance
   * @throws If the unit or the step size is not supported
   */
  round: (unit?: UnitTypeLong, size?: number) => Dayjs & PanelDayjsExtensions;
}

export type PanelDayjsInstance = Dayjs & PanelDayjsExtensions;

/**
 * Kirby plugin extensions for the dayjs function (static methods).
 * @source panel/src/libraries/dayjs-interpret.ts
 * @source panel/src/libraries/dayjs-iso.ts
 * @source panel/src/libraries/dayjs-pattern.ts
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
   * Tries all three formats when `format` is omitted.
   *
   * @param value - ISO string
   * @param format - ISO format type
   * @returns Dayjs instance or `null` if invalid
   */
  iso: (
    value: string,
    format?: "date" | "time" | "datetime",
  ) => PanelDayjsInstance | null;

  /**
   * Creates a pattern analyzer for date/time formatting.
   *
   * @param pattern - Date format pattern, e.g. `YYYY-MM-DD`
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
 * @source panel/src/libraries/dayjs.ts
 */
export interface PanelLibraryDayjs extends PanelDayjsStaticExtensions {
  (date?: ConfigType): PanelDayjsInstance;
  (
    date?: ConfigType,
    format?: OptionType,
    strict?: boolean,
  ): PanelDayjsInstance;
  (
    date?: ConfigType,
    format?: OptionType,
    locale?: string,
    strict?: boolean,
  ): PanelDayjsInstance;

  /** Registers a plugin once and returns the dayjs function for chaining. */
  extend: <T = unknown>(plugin: PluginFunc<T>, option?: T) => PanelLibraryDayjs;

  /**
   * Activates or registers a locale and returns the active locale name.
   *
   * @param preset - Locale name or locale object
   * @param object - Locale data to register under `preset`
   * @param isLocal - Whether to return the locale without activating it
   */
  locale: (
    preset?: string | ILocale,
    object?: Partial<ILocale>,
    isLocal?: boolean,
  ) => string;

  /** Loaded locales, keyed by locale name. */
  Ls: Record<string, ILocale>;

  isDayjs: (value: unknown) => value is PanelDayjsInstance;

  /** Creates a dayjs instance from Unix timestamp (seconds). */
  unix: (t: number) => PanelDayjsInstance;
}
// #endregion

// #region Autosize Types

/**
 * Autosize library for textarea auto-resizing.
 *
 * Automatically adjusts textarea height based on content.
 *
 * @source @types/autosize/index.d.ts
 */
export interface PanelLibraryAutosize {
  /**
   * Enables autosize on textarea element(s).
   *
   * @param element - Element(s) to autosize
   * @returns The input element(s)
   */
  <T extends ArrayLike<Element> | Element>(element: T): T;

  /**
   * Triggers a resize update.
   *
   * @param element - Element(s) to update
   * @returns The input element(s)
   */
  update: <T extends ArrayLike<Element> | Element>(element: T) => T;

  /**
   * Removes autosize behavior and restores the original textarea styling.
   *
   * @param element - Element(s) to destroy
   * @returns The input element(s)
   */
  destroy: <T extends ArrayLike<Element> | Element>(element: T) => T;
}
// #endregion

// #region Main Library Interface

/**
 * Panel libraries available on the Vue prototype as `$library`.
 *
 * @example
 * ```ts
 * // In a Vue component
 * const hex = this.$library.colors.toString({ r: 255, g: 0, b: 0 }, "hex");
 * const date = this.$library.dayjs("2024-01-15").format("DD.MM.YYYY");
 * this.$library.autosize(this.$refs.textarea);
 * ```
 *
 * @source panel/src/libraries/index.ts
 */
export interface PanelLibrary {
  autosize: PanelLibraryAutosize;

  colors: PanelLibraryColors;

  dayjs: PanelLibraryDayjs;
}
// #endregion
