/**
 * Languages the code block offers.
 * @see https://github.com/getkirby/kirby/blob/main/config/blocks/code/code.yml
 */
export type KirbyCodeLanguage =
  | "bash"
  | "basic"
  | "c"
  | "clojure"
  | "cpp"
  | "csharp"
  | "css"
  | "diff"
  | "elixir"
  | "elm"
  | "erlang"
  | "go"
  | "graphql"
  | "haskell"
  | "html"
  | "java"
  | "js"
  | "json"
  | "latext"
  | "less"
  | "lisp"
  | "lua"
  | "makefile"
  | "markdown"
  | "markup"
  | "objectivec"
  | "pascal"
  | "perl"
  | "php"
  | "text"
  | "python"
  | "r"
  | "ruby"
  | "rust"
  | "sass"
  | "scss"
  | "shell"
  | "sql"
  | "swift"
  | "typescript"
  | "vbnet"
  | "xml"
  | "yaml";

/**
 * Content shape of each default block type, keyed by type name.
 *
 * @see https://getkirby.com/docs/reference/panel/blocks
 *
 * @example
 * ```ts
 * // Access content type for a specific block
 * type CodeContent = KirbyDefaultBlocks["code"];
 * // Result: { code: string; language: KirbyCodeLanguage | "" }
 * ```
 */
export interface KirbyDefaultBlocks {
  /** @see https://getkirby.com/docs/reference/panel/blocks/code */
  code: {
    code: string;
    language: KirbyCodeLanguage | "";
  };

  /** @see https://getkirby.com/docs/reference/panel/blocks/gallery */
  gallery: {
    images: string[];
    caption: string;
    ratio: string;
    crop: "true" | "false";
  };

  /** @see https://getkirby.com/docs/reference/panel/blocks/heading */
  heading: {
    /** Heading tag, or `""` for content saved without a level. */
    level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "";
    text: string;
    /** Anchor ID of a heading pasted or parsed from HTML with an `id` attribute. */
    id?: string;
  };

  /**
   * Kirby image file or external image URL, discriminated by `location`.
   * @see https://getkirby.com/docs/reference/panel/blocks/image
   */
  image:
    | {
        /** Internal Kirby image file. */
        location: "kirby";
        /** File references. */
        image: string[];
        alt: string;
        /** Caption, may contain inline HTML. */
        caption: string;
        /** URL the image links to. */
        link: string;
        /** Aspect ratio, such as `"16/9"` or `"1/1"`, or `""` for auto. */
        ratio: string;
        /** Whether to crop the image to fit the ratio. */
        crop: "true" | "false";
      }
    | {
        /** External image. */
        location: "web";
        src: string;
        alt: string | null;
        /** Caption, may contain inline HTML. */
        caption: string | null;
        /** URL the image links to. */
        link: string | null;
        /** Aspect ratio, such as `"16/9"` or `"1/1"`, or `""` for auto. */
        ratio: string;
        /** Whether to crop the image to fit the ratio. */
        crop: "true" | "false";
      };

  /**
   * Horizontal divider with no content fields.
   * @see https://getkirby.com/docs/reference/panel/blocks/line
   */
  line: Record<string, never>;

  /**
   * Bulleted or numbered list.
   * @see https://getkirby.com/docs/reference/panel/blocks/list
   */
  list: {
    text: string;
  };

  /** @see https://getkirby.com/docs/reference/panel/blocks/markdown */
  markdown: {
    text: string;
  };

  /** @see https://getkirby.com/docs/reference/panel/blocks/quote */
  quote: {
    text: string;
    /** Citation, `null` for HTML parsed without a `<footer>`. */
    citation: string | null;
  };

  /**
   * Tabular data whose content shape varies with its rows and columns.
   */
  table: Record<string, any>;

  /**
   * Rich text from a WYSIWYG editor.
   * @see https://getkirby.com/docs/reference/panel/blocks/text
   */
  text: {
    text: string;
  };

  /**
   * Kirby video file or external video URL, discriminated by `location`.
   * @see https://getkirby.com/docs/reference/panel/blocks/video
   */
  video:
    | {
        /** External video source. */
        location: "web";
        /** External video URL (YouTube, Vimeo, etc.). */
        url: string;
        /** Caption, may contain inline HTML. */
        caption: string;
      }
    | {
        /** Internal Kirby video file. */
        location: "kirby";
        /** File references. */
        video: string[];
        /** Poster image file references. */
        poster: string[];
        /** Caption, may contain inline HTML. */
        caption: string;
        autoplay: "true" | "false";
        muted: "true" | "false";
        loop: "true" | "false";
        controls: "true" | "false";
        preload: "auto" | "metadata" | "none" | "";
      };
}

/**
 * Block from a blocks or layout field, its content typed by the block type.
 *
 * @typeParam T - Block type name
 * @typeParam U - Custom content shape, overriding the default content of `T`
 *
 * @see https://getkirby.com/docs/guide/page-builder
 *
 * @example
 * ```ts
 * // Using a default block type
 * const textBlock: KirbyBlock<"text"> = {
 *   id: "abc123",
 *   type: "text",
 *   isHidden: false,
 *   content: { text: "Hello world" }
 * };
 *
 * // Using a custom block type
 * const customBlock: KirbyBlock<"hero", { title: string; image: string }> = {
 *   id: "def456",
 *   type: "hero",
 *   isHidden: false,
 *   content: { title: "Welcome", image: "hero.jpg" }
 * };
 * ```
 */
export interface KirbyBlock<
  T extends string = keyof KirbyDefaultBlocks,
  U extends Record<string, any> | undefined = undefined,
> {
  /**
   * Content fields: `U` if given, else the default content of `T`, else empty.
   */
  content: U extends Record<string, any>
    ? U
    : T extends keyof KirbyDefaultBlocks
      ? KirbyDefaultBlocks[T]
      : Record<string, never>;
  /** UUID v4. */
  id: string;
  /** Whether the block is hidden in the frontend output. */
  isHidden: boolean;
  type: T;
}

/**
 * @example
 * ```ts
 * function isDefaultBlock(type: string): type is KirbyDefaultBlockType {
 *   return ["code", "gallery", "heading", "image", "line", "list", "markdown", "quote", "table", "text", "video"].includes(type);
 * }
 * ```
 */
export type KirbyDefaultBlockType = keyof KirbyDefaultBlocks;
