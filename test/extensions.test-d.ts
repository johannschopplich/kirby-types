import type {
  TextareaButton,
  TextareaCommand,
  TextareaToolbarContext,
  WriterMarkExtension,
  WriterMarkSchema,
  WriterNodeExtension,
  WriterNodeSchema,
  WriterToolbarButton,
} from "../src/panel";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// =============================================================================
// 1. WRITER TOOLBAR BUTTON
// =============================================================================

expectAssignable<WriterToolbarButton>({
  icon: "bold",
  label: "Bold",
});

expectAssignable<WriterToolbarButton>({
  id: "h1",
  command: "h1",
  icon: "h1",
  label: "Heading 1",
  name: "heading",
  attrs: { level: 1 },
  separator: true,
  when: ["heading", "paragraph"],
});

// =============================================================================
// 2. WRITER MARK SCHEMA
// =============================================================================

expectAssignable<WriterMarkSchema>({
  parseDOM: [{ tag: "strong" }],
  toDOM: () => ["strong", 0],
});

expectAssignable<WriterMarkSchema>({
  attrs: {
    href: { default: null },
    target: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs: (dom) => ({
        href: (dom as HTMLElement).getAttribute("href"),
      }),
    },
  ],
  toDOM: (mark) => ["a", { href: mark.attrs.href }, 0],
});

// =============================================================================
// 3. WRITER NODE SCHEMA
// =============================================================================

expectAssignable<WriterNodeSchema>({
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM: () => ["p", 0],
});

expectAssignable<WriterNodeSchema>({
  attrs: { level: { default: 1 } },
  content: "inline*",
  group: "block",
  defining: true,
  draggable: false,
  parseDOM: [
    { tag: "h1", attrs: { level: 1 } },
    { tag: "h2", attrs: { level: 2 } },
  ],
  toDOM: (node) => [`h${node.attrs.level}`, 0],
});

// =============================================================================
// 4. WRITER MARK EXTENSION
// =============================================================================

// Minimal mark extension
expectAssignable<WriterMarkExtension>({
  schema: {
    parseDOM: [{ tag: "mark" }],
    toDOM: () => ["mark", 0],
  },
});

// Full mark extension (like Bold)
expectAssignable<WriterMarkExtension>({
  button: {
    icon: "bold",
    label: "Bold",
  },
  defaults: {
    shortcut: "Mod-b",
  },
  schema: {
    parseDOM: [{ tag: "strong" }, { tag: "b" }],
    toDOM: () => ["strong", 0],
  },
  commands({ type, utils }) {
    return () => utils.toggleMark(type);
  },
  inputRules({ type, utils }) {
    return [utils.markInputRule(/\*\*([^*]+)\*\*$/, type)];
  },
  keys({ type, utils }) {
    return {
      "Mod-b": () => utils.toggleMark(type),
    };
  },
  pasteRules({ type, utils }) {
    return [utils.markPasteRule(/\*\*([^*]+)\*\*/g, type)];
  },
  plugins() {
    return [
      {
        props: {
          handleClick: () => false,
        },
      },
    ];
  },
});

// Mark extension with multiple commands (like Link)
expectAssignable<WriterMarkExtension>({
  button: { icon: "url", label: "Link" },
  schema: {
    attrs: { href: { default: null } },
    parseDOM: [{ tag: "a[href]" }],
    toDOM: () => ["a", 0],
  },
  commands({ type, utils }) {
    return {
      insertLink: () => utils.toggleMark(type),
      removeLink: () => utils.removeMark(type),
    };
  },
});

// Mark extension with multiple buttons (like heading levels)
expectAssignable<WriterMarkExtension>({
  button: [
    { id: "h1", icon: "h1", label: "Heading 1" },
    { id: "h2", icon: "h2", label: "Heading 2" },
  ],
});

// =============================================================================
// 5. WRITER NODE EXTENSION
// =============================================================================

// Minimal node extension
expectAssignable<WriterNodeExtension>({
  schema: {
    content: "block+",
    group: "block",
    parseDOM: [{ tag: "blockquote" }],
    toDOM: () => ["blockquote", 0],
  },
});

// Full node extension (like Heading)
expectAssignable<WriterNodeExtension>({
  button: [
    { id: "h1", icon: "h1", label: "H1", attrs: { level: 1 } },
    { id: "h2", icon: "h2", label: "H2", attrs: { level: 2 } },
  ],
  defaults: {
    levels: [1, 2, 3],
  },
  schema: {
    attrs: { level: { default: 1 } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "h1", attrs: { level: 1 } }],
    toDOM: (node) => [`h${node.attrs.level}`, 0],
  },
  commands({ type, schema, utils }) {
    return {
      toggleHeading: (attrs) =>
        utils.toggleBlockType(type, schema.nodes.paragraph, attrs),
      h1: () => utils.toggleBlockType(type, schema.nodes.paragraph, { level: 1 }),
    };
  },
  inputRules({ type, utils }) {
    return [utils.textblockTypeInputRule(/^#\s$/, type, () => ({ level: 1 }))];
  },
  keys({ type, utils }) {
    return {
      "Shift-Ctrl-1": () => utils.setBlockType(type, { level: 1 }),
    };
  },
});

// =============================================================================
// 6. TEXTAREA BUTTON
// =============================================================================

expectAssignable<TextareaButton>({
  label: "Bold",
  icon: "bold",
  click() {
    this.command("toggle", "**");
  },
});

expectAssignable<TextareaButton>({
  label: "Insert Timestamp",
  icon: "clock",
  click() {
    this.command("insert", () => new Date().toISOString());
  },
  shortcut: "t",
});

expectAssignable<TextareaButton>({
  label: "Headings",
  icon: "title",
  click() {
    this.command("prepend", "#");
  },
  dropdown: [
    {
      label: "Heading 1",
      icon: "h1",
      click() {
        this.command("prepend", "#");
      },
    },
    {
      label: "Heading 2",
      icon: "h2",
      click() {
        this.command("prepend", "##");
      },
    },
  ],
});

// =============================================================================
// 7. TEXTAREA COMMAND TYPE
// =============================================================================

expectType<TextareaCommand>("dialog" as TextareaCommand);
expectType<TextareaCommand>("insert" as TextareaCommand);
expectType<TextareaCommand>("prepend" as TextareaCommand);
expectType<TextareaCommand>("toggle" as TextareaCommand);
expectType<TextareaCommand>("upload" as TextareaCommand);
expectType<TextareaCommand>("wrap" as TextareaCommand);
expectType<TextareaCommand>("file" as TextareaCommand);

// =============================================================================
// 8. TEXTAREA TOOLBAR CONTEXT
// =============================================================================

declare const context: TextareaToolbarContext;

expectType<void>(context.command("toggle", "**"));
expectType<void>(context.command("insert", (input: string, selection: string) => selection.toUpperCase()));
expectType<void>(context.close());
expectType<string>(context.$t("toolbar.button.bold"));

// =============================================================================
// NEGATIVE TESTS
// =============================================================================

// Missing required fields
expectNotAssignable<WriterToolbarButton>({
  icon: "bold",
  // Missing label
});

expectNotAssignable<TextareaButton>({
  label: "Bold",
  // Missing icon and click
});

expectNotAssignable<TextareaButton>({
  label: "Bold",
  icon: "bold",
  // Missing click
});
