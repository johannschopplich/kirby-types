import type { KirbyBlock, KirbyDefaultBlockType } from "../src/blocks";
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
  content: { code: "console.log('hello')", language: "javascript" },
  id: "code-1",
  isHidden: false,
  type: "code",
});

// Gallery block
expectAssignable<KirbyBlock<"gallery">>({
  content: { images: ["image1.jpg", "image2.jpg"] },
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

// Image block
expectAssignable<KirbyBlock<"image">>({
  content: {
    location: "kirby",
    image: ["test.jpg"],
    src: "test.jpg",
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

// Quote block
expectAssignable<KirbyBlock<"quote">>({
  content: {
    text: "Life is what happens when you're busy making other plans.",
    citation: "John Lennon",
  },
  id: "quote-1",
  isHidden: false,
  type: "quote",
});

// Video block (default content)
expectAssignable<KirbyBlock<"video">>({
  content: { url: "https://youtube.com/watch?v=123", caption: "Video caption" },
  id: "video-1",
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
  | "list"
  | "markdown"
  | "quote"
  | "text"
  | "video"
>({} as KirbyDefaultBlockType);

// Test default content types
expectType<{ code: string; language: string }>(
  {} as KirbyBlock<"code">["content"],
);

expectType<{ images: string[] }>({} as KirbyBlock<"gallery">["content"]);

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

expectNotAssignable<KirbyBlock<"text">>({
  content: { text: "Hello" },
  id: "1",
  isHidden: false,
  // Missing type
});

expectNotAssignable<KirbyBlock<"text">>({
  content: { text: "Hello" },
  id: "1",
  // Missing isHidden, type
});

// --- 3. Wrong Type Field ---

expectNotAssignable<KirbyBlock<"text">>({
  content: { text: "Hello" },
  id: "1",
  isHidden: false,
  type: "wrong", // Should be "text"
});
