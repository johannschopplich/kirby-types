/**
 * Supported code languages for the code block.
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
 * Maps each of Kirby's default block types to their corresponding content structure.
 *
 * @see https://getkirby.com/docs/reference/panel/blocks
 *
 * @example
 * ```ts
 * // Access content type for a specific block
 * type CodeContent = KirbyDefaultBlocks["code"];
 * // Result: { code: string; language: KirbyCodeLanguage }
 * ```
 */
export interface KirbyDefaultBlocks {
  /**
   * Code block for displaying syntax-highlighted code snippets.
   * @see https://getkirby.com/docs/reference/panel/blocks/code
   */
  code: {
    code: string;
    language: KirbyCodeLanguage;
  };

  /**
   * Gallery block for displaying multiple images.
   * @see https://getkirby.com/docs/reference/panel/blocks/gallery
   */
  gallery: {
    images: string[];
    caption: string | null;
    ratio: string | null;
    crop: boolean;
  };

  /**
   * Heading block for section titles.
   * @see https://getkirby.com/docs/reference/panel/blocks/heading
   */
  heading: {
    level: string;
    text: string;
  };

  /**
   * Image block for displaying a single image.
   * Supports both internal Kirby files and external URLs.
   * Uses a discriminated union based on `location` field.
   * @see https://getkirby.com/docs/reference/panel/blocks/image
   */
  image:
    | {
        /** Internal Kirby image file. */
        location: "kirby";
        /** Internal Kirby file references. */
        image: string[];
        /** Alternative text for accessibility. */
        alt: string | null;
        /** Image caption (supports inline HTML). */
        caption: string | null;
        /** Link URL when image is clicked. */
        link: string | null;
        /** Aspect ratio constraint (e.g., `"16/9"`, `"1/1"`). */
        ratio: string | null;
        /** Whether to crop the image to fit the ratio. */
        crop: boolean;
      }
    | {
        /** External image URL. */
        location: "web";
        /** External image URL. */
        src: string;
        /** Alternative text for accessibility. */
        alt: string | null;
        /** Image caption (supports inline HTML). */
        caption: string | null;
        /** Link URL when image is clicked. */
        link: string | null;
        /** Aspect ratio constraint (e.g., `"16/9"`, `"1/1"`). */
        ratio: string | null;
        /** Whether to crop the image to fit the ratio. */
        crop: boolean;
      };

  /**
   * Horizontal line/divider block.
   * Has no content fields.
   * @see https://getkirby.com/docs/reference/panel/blocks/line
   */
  line: Record<string, never>;

  /**
   * List block for bullet or numbered lists.
   * @see https://getkirby.com/docs/reference/panel/blocks/list
   */
  list: {
    text: string;
  };

  /**
   * Markdown block for raw markdown content.
   * @see https://getkirby.com/docs/reference/panel/blocks/markdown
   */
  markdown: {
    text: string;
  };

  /**
   * Quote block for blockquotes with optional citation.
   * @see https://getkirby.com/docs/reference/panel/blocks/quote
   */
  quote: {
    text: string;
    /** Optional citation/attribution for the quote. */
    citation?: string;
  };

  /**
   * Table block for tabular data.
   * Content structure is dynamic based on rows/columns.
   */
  table: Record<string, any>;

  /**
   * Rich text block (WYSIWYG editor).
   * @see https://getkirby.com/docs/reference/panel/blocks/text
   */
  text: {
    text: string;
  };

  /**
   * Video block for embedding videos.
   * Supports both internal Kirby files and external URLs (YouTube, Vimeo, etc.).
   * Uses a discriminated union based on `location` field.
   * @see https://getkirby.com/docs/reference/panel/blocks/video
   */
  video:
    | {
        /** External video source. */
        location: "web";
        /** External video URL (YouTube, Vimeo, etc.). */
        url: string;
        /** Video caption (supports inline HTML). */
        caption: string | null;
      }
    | {
        /** Internal Kirby video file. */
        location: "kirby";
        /** Internal Kirby video file references. */
        video: string[];
        /** Poster image file references. */
        poster: string[];
        /** Video caption (supports inline HTML). */
        caption: string | null;
        /** Whether to autoplay the video. */
        autoplay: boolean;
        /** Whether to mute the video. */
        muted: boolean;
        /** Whether to loop the video. */
        loop: boolean;
        /** Whether to show video controls. */
        controls: boolean;
        /** Preload behavior. */
        preload: "auto" | "metadata" | "none";
      };
}

/**
 * Represents a Kirby block with its content, metadata, and type information.
 *
 * @typeParam T - The block type identifier. Defaults to any default block type.
 * @typeParam U - Optional custom content structure. When provided, overrides the default content type.
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
   * The block's content fields.
   * Structure depends on the block type or custom content definition.
   */
  content: U extends Record<string, any>
    ? U
    : T extends keyof KirbyDefaultBlocks
      ? KirbyDefaultBlocks[T]
      : Record<string, never>;
  /** Unique identifier for the block (UUID v4). */
  id: string;
  /** Whether the block is hidden in the frontend output. */
  isHidden: boolean;
  /** The block type identifier. */
  type: T;
}

/**
 * Union type of all default Kirby block type names.
 *
 * @example
 * ```ts
 * function isDefaultBlock(type: string): type is KirbyDefaultBlockType {
 *   return ["code", "gallery", "heading", "image", "line", "list", "markdown", "quote", "table", "text", "video"].includes(type);
 * }
 * ```
 */
export type KirbyDefaultBlockType = keyof KirbyDefaultBlocks;
