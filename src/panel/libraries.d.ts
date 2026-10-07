/**
 * Library type definitions for Kirby Panel.
 *
 * Provides types for the `$library` utilities available to every component.
 * Includes color manipulation, date handling (dayjs), and textarea autosize.
 */

import type {
  ConfigType,
  Dayjs,
  OptionType,
  PluginFunc,
  UnitTypeLong,
} from "dayjs";

// #region Color Types

/**
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
 * const color = this.$library.colors.parse("hsl(180 50% 50%)");
 * if (color) {
 *   const hex = this.$library.colors.convert(color, "hex");
 *   const css = this.$library.colors.toString(hex, "rgb");
 * }
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
   * - HEX: `#fff`, `#ffff`, `#ffffff`, `#ffffffff`, also without `#`
   * - RGB: `rgb(255 255 255)`, `rgb(255, 255, 255)`, `rgba(255 255 255 / 0.5)`, `rgb(100% 100% 100% / 50%)`
   * - HSL: `hsl(180 50% 50%)`, `hsl(180deg 50% 50% / 0.5)`, `hsla(0.5turn, 50%, 50%, 0.5)`
   *
   * @param string - CSS color string
   * @returns Parsed color, `null` if unparsable, or `false` for empty input
   */
  parse: (
    string: string,
  ) => string | PanelColorRGB | PanelColorHSL | null | false;

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
  /** Start position in the pattern, or in the rendered string when the parts are positioned against a datetime. */
  start: number;
  /** End position (inclusive) in the pattern, or in the rendered string when the parts are positioned against a datetime. */
  end: number;
}

/**
 * Pattern analyzer object returned by `dayjs.pattern()`.
 * @source panel/src/libraries/dayjs-pattern.ts
 */
export interface PanelDayjsPattern {
  /** Display pattern the analyzer reads, empty when none is given. */
  source: string;

  /**
   * Strings the pattern escapes and prints as they are,
   * e.g. `["um"]` for `DD.MM.YYYY [um] HH:mm`.
   */
  readonly literals: string[];

  /**
   * Whether the pattern describes a date or a time: `time` when every unit
   * it shows is a time unit, `date` otherwise, including for a pattern
   * without any unit.
   */
  readonly type: "date" | "time";

  /**
   * Units the pattern is made up of, in the order they appear,
   * e.g. `["month", "day", "year"]` for `MM/DD/YYYY`.
   */
  readonly units: NonNullable<PanelDayjsPatternPart["unit"]>[];

  /**
   * Returns the parts of the pattern, one per letter sequence.
   *
   * Without a valid datetime, the parts are positioned in the pattern itself.
   * With one, they are positioned in the string the datetime renders into,
   * as a token and what it prints can differ in width, e.g. `MMMM` printing
   * `September`.
   *
   * @param dt - Datetime to position the parts against
   */
  parts: (dt?: Dayjs | null) => PanelDayjsPatternPart[];

  /**
   * Returns the part at a cursor position or selection range.
   *
   * Falls back to the part the selection starts in, then to the first part.
   *
   * @param start - Start position
   * @param end - End position (default: `start`)
   * @param dt - Datetime to position the parts against
   * @returns Matching part, or `undefined` if the pattern has no parts
   */
  at: (
    start: number,
    end?: number,
    dt?: Dayjs | null,
  ) => PanelDayjsPatternPart | undefined;

  /**
   * Formats a datetime with this pattern.
   *
   * @param dt - Dayjs instance
   * @returns Formatted string, or `null` for a missing or invalid datetime
   */
  format: (dt?: Dayjs | null) => string | null;
}

/**
 * Kirby plugin extensions for dayjs instances.
 * @source panel/src/libraries/dayjs-iso.ts
 * @source panel/src/libraries/dayjs-validate.ts
 * @source panel/src/libraries/dayjs-round.ts
 */
export interface PanelDayjsExtensions {
  /**
   * Formats as ISO string (Kirby format).
   *
   * @param type - `"date"` → `"YYYY-MM-DD"`, `"time"` → `"HH:mm:ss"`, `"datetime"` → `"YYYY-MM-DD HH:mm:ss"` (default: `"datetime"`)
   * @returns ISO formatted string
   */
  toISO: (type?: "date" | "time" | "datetime") => string;

  /**
   * Validates the datetime against a lower or upper (min/max) boundary,
   * compared at full precision.
   *
   * Returns `false` for an invalid datetime or a boundary that is no ISO string.
   *
   * @param boundary - Boundary as ISO string. If falsy, returns `true` when the dayjs instance is valid.
   * @param type - `"min"` or `"max"` (default: `"min"`)
   * @returns Whether the datetime lies within the boundary
   */
  validate: (boundary?: string, type?: "min" | "max") => boolean;

  /**
   * Rounds to the nearest step of a unit, e.g. to the nearest 15 minutes.
   *
   * `day` is read as `date`. All sub-units of the step unit are cleared,
   * down to the milliseconds.
   *
   * Only the next smaller unit is rounded, and it can carry over: 13:45
   * rounded to a 4-hour step carries over to 14:00 first and lands on
   * 16:00, not on the nearer 12:00.
   *
   * @param unit - Unit to round to (default: `"date"`)
   * @param size - Step size (default: `1`). Has to divide the unit evenly, e.g. `15` of 60 minutes; `date`, `month`, and `year` only take `1`.
   * @returns Rounded dayjs instance
   * @throws If the unit or the step size is not supported
   */
  round: (unit?: UnitTypeLong, size?: number) => Dayjs & PanelDayjsExtensions;
}

/**
 * @source panel/src/libraries/dayjs.ts
 */
export type PanelDayjsInstance = Dayjs & PanelDayjsExtensions;

/**
 * Options for `dayjs.parse()`.
 *
 * @source panel/src/libraries/dayjs-parse.ts
 */
export interface PanelDayjsParseOptions {
  /** Display pattern the input is matched against first, e.g. `DD.MM.YYYY`. */
  pattern?: string;
  /** Whether to skip the informed guesses when the input does not match the pattern exactly. */
  strict?: boolean;
  /** Datetime type to guess, the pattern's own type by default. `datetime` guesses like `date`. */
  type?: "date" | "time" | "datetime";
}

/**
 * Kirby plugin extensions for the dayjs function (static methods).
 * @source panel/src/libraries/dayjs-iso.ts
 * @source panel/src/libraries/dayjs-parse.ts
 * @source panel/src/libraries/dayjs-pattern.ts
 */
export interface PanelDayjsStaticExtensions {
  /**
   * Parses input against a display pattern.
   *
   * Matches the pattern exactly first, which already reads digits typed
   * without separators and localized month names and day periods. Unless
   * `strict` is set, falls back to informed guesses: partial input or
   * another unit order.
   * Units the input leaves out are filled in: more significant ones from now,
   * less significant ones with their minimum.
   *
   * @param input - Input string to parse
   * @param options - Pattern, strictness, and datetime type to parse with
   * @returns Dayjs instance, or `null` for empty input or when nothing matched
   */
  parse: (
    input: string,
    options?: PanelDayjsParseOptions,
  ) => PanelDayjsInstance | null;

  /**
   * Parses input against a display pattern, falling back to informed guesses.
   *
   * @param input - Input string to parse
   * @param format - Expected datetime type (default: `"date"`)
   * @param pattern - Display pattern to match first
   * @returns Dayjs instance or `null` if nothing matched
   * @deprecated Use `parse()` instead.
   */
  interpret: (
    input: string,
    format?: "date" | "time" | "datetime",
    pattern?: string,
  ) => PanelDayjsInstance | null;

  /**
   * Parses ISO formatted string.
   *
   * Tries all three formats when `type` is omitted.
   *
   * @param value - ISO string
   * @param type - ISO format type
   * @returns Dayjs instance or `null` if invalid
   */
  iso: (
    value: string,
    type?: "date" | "time" | "datetime",
  ) => PanelDayjsInstance | null;

  /**
   * Creates a pattern analyzer for date/time formatting.
   *
   * @param pattern - Display pattern, e.g. `DD.MM.YYYY`. A missing pattern reads as an empty one.
   * @returns Pattern analyzer object
   */
  pattern: (pattern?: string | null) => PanelDayjsPattern;
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
 * const parsed = this.$library.dayjs.parse("15.01.2024", { pattern: "DD.MM.YYYY" });
 * ```
 *
 * @source panel/src/libraries/dayjs.ts
 * @source panel/src/libraries/dayjs-locale.ts
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
   * Also activates a locale by Kirby translation code, e.g. `pt_BR` or
   * `sr@latin`, built from the browser's date data when dayjs has none
   * registered. Falls back to `en` when the browser knows neither the
   * full code nor its base language.
   *
   * @param preset - Locale name, Kirby translation code, or locale object
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
 * Panel libraries available to every component as `$library`.
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
