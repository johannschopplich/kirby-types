import type {
  KirbyBlock,
  KirbyCodeLanguage,
  KirbyDefaultBlockType,
} from "../src/blocks";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// =============================================================================
// KIRBY BLOCK TESTS
// =============================================================================

// --- 1. Default Block Types ---

// Text block
expectAssignable<KirbyBlock<"text">>({
  content: { text: "Hello World" },
  id: "1",
  isHidden: false,
  type: "text",
});

expectAssignable<KirbyBlock<"text">>({
  content: { text: "Another text content" },
  id: "text-2",
  isHidden: true,
  type: "text",
});

// Code block
expectAssignable<KirbyBlock<"code">>({
  content: { code: "console.log('hello')", language: "js" },
  id: "code-1",
  isHidden: false,
  type: "code",
});

// Gallery block
expectAssignable<KirbyBlock<"gallery">>({
  content: {
    images: ["image1.jpg", "image2.jpg"],
    caption: "Gallery caption",
    ratio: "16/9",
    crop: true,
  },
  id: "gallery-1",
  isHidden: false,
  type: "gallery",
});

// Heading block
expectAssignable<KirbyBlock<"heading">>({
  content: { level: "1", text: "Main Title" },
  id: "heading-1",
  isHidden: false,
  type: "heading",
});

// Image block (internal)
expectAssignable<KirbyBlock<"image">>({
  content: {
    location: "kirby",
    image: ["test.jpg"],
    alt: "Test image",
    caption: "A test image",
    link: "https://example.com",
    ratio: "1/1",
    crop: true,
  },
  id: "image-1",
  isHidden: false,
  type: "image",
});

// Image block (external)
expectAssignable<KirbyBlock<"image">>({
  content: {
    location: "web",
    src: "https://example.com/image.jpg",
    alt: "External image",
    caption: null,
    link: null,
    ratio: "16/9",
    crop: false,
  },
  id: "image-2",
  isHidden: false,
  type: "image",
});

// List block
expectAssignable<KirbyBlock<"list">>({
  content: { text: "List item content" },
  id: "list-1",
  isHidden: false,
  type: "list",
});

// Markdown block
expectAssignable<KirbyBlock<"markdown">>({
  content: { text: "# Markdown content\n\nSome **bold** text." },
  id: "markdown-1",
  isHidden: false,
  type: "markdown",
});

// Quote block (with citation)
expectAssignable<KirbyBlock<"quote">>({
  content: {
    text: "Life is what happens when you're busy making other plans.",
    citation: "John Lennon",
  },
  id: "quote-1",
  isHidden: false,
  type: "quote",
});

// Quote block (without citation - citation is optional)
expectAssignable<KirbyBlock<"quote">>({
  content: {
    text: "An anonymous quote without attribution.",
  },
  id: "quote-2",
  isHidden: false,
  type: "quote",
});

// Video block (external/web)
expectAssignable<KirbyBlock<"video">>({
  content: {
    location: "web",
    url: "https://youtube.com/watch?v=123",
    caption: "Video caption",
  },
  id: "video-1",
  isHidden: false,
  type: "video",
});

// Video block (internal/kirby)
expectAssignable<KirbyBlock<"video">>({
  content: {
    location: "kirby",
    video: ["video.mp4"],
    poster: ["poster.jpg"],
    caption: null,
    autoplay: false,
    muted: true,
    loop: false,
    controls: true,
    preload: "auto",
  },
  id: "video-2",
  isHidden: false,
  type: "video",
});

// --- 2. Custom Content Types ---

// Overwriting the default content type for same block type
expectAssignable<KirbyBlock<"video", { videoId: number }>>({
  content: { videoId: 123 },
  id: "1",
  isHidden: false,
  type: "video",
});

// Completely custom block type
expectAssignable<KirbyBlock<"custom", { foo: string }>>({
  content: { foo: "Hello World" },
  id: "1",
  isHidden: false,
  type: "custom",
});

// --- 3. Type Inference Tests ---

// Test KirbyDefaultBlockType union
expectType<
  | "code"
  | "gallery"
  | "heading"
  | "image"
  | "line"
  | "list"
  | "markdown"
  | "quote"
  | "table"
  | "text"
  | "video"
>({} as KirbyDefaultBlockType);

// Test default content types
expectType<{ code: string; language: KirbyCodeLanguage }>(
  {} as KirbyBlock<"code">["content"],
);

expectType<{
  images: string[];
  caption: string | null;
  ratio: string | null;
  crop: boolean;
}>({} as KirbyBlock<"gallery">["content"]);

expectType<{ text: string }>({} as KirbyBlock<"text">["content"]);

// Test custom content type override
expectType<{ videoId: number }>(
  {} as KirbyBlock<"video", { videoId: number }>["content"],
);

expectType<{ customField: boolean }>(
  {} as KirbyBlock<"customType", { customField: boolean }>["content"],
);

// Test with never content (edge case)
expectType<Record<string, never>>({} as KirbyBlock<"unknownType">["content"]);

// =============================================================================
// NEGATIVE TESTS (INVALID BLOCKS)
// =============================================================================

// --- 1. Wrong Content Types ---

// Wrong content type for default blocks
expectNotAssignable<KirbyBlock<"code">>({
  content: { text: "wrong content" }, // Should be { code: string; language: string }
  id: "1",
  isHidden: false,
  type: "code",
});

expectNotAssignable<KirbyBlock<"gallery">>({
  content: { videos: ["video.mp4"] }, // Should be { images: string[] }
  id: "1",
  isHidden: false,
  type: "gallery",
});

// --- 2. Missing Required Fields ---

expectNotAssignable<KirbyBlock<"text">>({
  content: { text: "Hello" },
  // Missing id, isHidden, type
});

// --- 3. Wrong Type Field ---

expectNotAssignable<KirbyBlock<"text">>({
  content: { text: "Hello" },
  id: "1",
  isHidden: false,
  type: "wrong", // Should be "text"
});
