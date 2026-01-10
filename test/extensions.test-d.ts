import type { DefineComponent } from "vue";
import type {
  Panel,
  PanelApp,
  PanelPluginExtensions,
  TextareaButton,
  TextareaToolbarContext,
  WriterExtension,
  WriterMarkExtension,
  WriterNodeExtension,
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
// 2. WRITER GENERIC EXTENSION
// =============================================================================

// Minimal generic extension
expectAssignable<WriterExtension>({
  name: "history",
  type: "extension",
});

// Generic extension with commands (like History)
expectAssignable<WriterExtension>({
  name: "history",
  defaults: {
    depth: 100,
    newGroupDelay: 500,
  },
  commands() {
    return {
      undo: () => true,
      redo: () => true,
    };
  },
  keys() {
    return {
      "Mod-z": () => true,
      "Mod-y": () => true,
    };
  },
  plugins() {
    return [];
  },
});

// Generic extension with custom keyboard shortcuts (like Keys)
expectAssignable<WriterExtension>({
  name: "customKeys",
  keys() {
    return {
      "Ctrl-s": () => {
        // Custom save handler
        return true;
      },
    };
  },
});

// =============================================================================
// 3. WRITER MARK EXTENSION
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
// 4. WRITER NODE EXTENSION
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
      h1: () =>
        utils.toggleBlockType(type, schema.nodes.paragraph, { level: 1 }),
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
// 5. TEXTAREA BUTTON
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
      // Arrow function captures outer `this` (toolbar context)
      click: () => {
        // In real code: this.command("prepend", "#")
      },
    },
    {
      label: "Heading 2",
      icon: "h2",
      click: () => {
        // In real code: this.command("prepend", "##")
      },
    },
  ],
});

// =============================================================================
// 6. TEXTAREA TOOLBAR CONTEXT
// =============================================================================

declare const context: TextareaToolbarContext;

expectType<void>(context.command("toggle", "**"));
expectType<void>(
  context.command("insert", (input: string, selection: string) =>
    selection.toUpperCase(),
  ),
);
expectType<void>(context.close());
expectType<string>(context.$t("toolbar.button.bold"));

// =============================================================================
// 7. PANEL PLUGIN EXTENSIONS
// =============================================================================

// Full plugin registration example
expectAssignable<PanelPluginExtensions>({
  blocks: {
    video: `<k-block-video :source="content.source" />`,
    gallery: {
      extends: "k-block-type-default",
      template: `<div class="gallery">...</div>`,
    },
  },
  components: {
    "k-custom-component": {
      template: `<div>Custom</div>`,
    },
  },
  fields: {
    "color-picker": {
      extends: "k-text-field",
      template: `<k-field v-bind="$props">...</k-field>`,
    },
  },
  icons: {
    custom: `<svg>...</svg>`,
  },
  sections: {
    stats: {
      template: `<div>{{ data }}</div>`,
    },
  },
  viewButtons: {
    "my-button": {
      template: `<k-button>Click me</k-button>`,
    },
  },
  created(app) {
    expectType<PanelApp>(app);
  },
  textareaButtons: {
    timestamp: {
      label: "Timestamp",
      icon: "clock",
      click() {
        this.command("insert", () => new Date().toISOString());
      },
    },
  },
  writerMarks: {
    highlight: {
      schema: {
        parseDOM: [{ tag: "mark" }],
        toDOM: () => ["mark", 0],
      },
    },
  },
  writerNodes: {
    callout: {
      schema: {
        content: "block+",
        group: "block",
        parseDOM: [{ tag: "div.callout" }],
        toDOM: () => ["div", { class: "callout" }, 0],
      },
    },
  },
});

// Minimal plugin (empty extensions)
expectAssignable<PanelPluginExtensions>({});

// Block as string shorthand
expectAssignable<PanelPluginExtensions>({
  blocks: {
    simple: `<div>{{ content.text }}</div>`,
  },
});

// Plugin with only icons
expectAssignable<PanelPluginExtensions>({
  icons: {
    "custom-icon": `<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="8"/></svg>`,
  },
});

// Plugin with third-party data
expectAssignable<PanelPluginExtensions>({
  thirdParty: {
    myPlugin: {
      apiKey: "test",
      options: { debug: true },
    },
  },
});

// =============================================================================
// 8. PANEL.PLUGIN() METHOD
// =============================================================================

declare const panel: Panel;

// Plugin registration function
expectType<void>(panel.plugin("my-plugin", {}));
expectType<void>(
  panel.plugin("my-plugin", {
    fields: {
      "color-picker": {
        template: `<k-field v-bind="$props">...</k-field>`,
      },
    },
  }),
);

// Access to plugins storage
expectType<Record<string, DefineComponent>>(panel.plugins.components);
expectType<Record<string, string>>(panel.plugins.icons);
expectType<Record<string, TextareaButton>>(panel.plugins.textareaButtons);
expectType<Record<string, WriterMarkExtension>>(panel.plugins.writerMarks);
expectType<Record<string, WriterNodeExtension>>(panel.plugins.writerNodes);

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
