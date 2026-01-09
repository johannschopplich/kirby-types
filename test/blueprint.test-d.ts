import type {
  KirbyBlocksFieldProps,
  KirbyBlockValue,
  KirbyColorFieldProps,
  KirbyDateFieldProps,
  KirbyFieldProps,
  KirbyFieldsetGroup,
  KirbyFieldsetProps,
  KirbyFieldsetTab,
  KirbyFilesFieldProps,
  KirbyLayoutColumnValue,
  KirbyLayoutFieldProps,
  KirbyLayoutValue,
  KirbyNumberFieldProps,
  KirbyObjectFieldProps,
  KirbyOption,
  KirbyOptionsFieldProps,
  KirbyStructureColumn,
  KirbyStructureFieldProps,
  KirbyTextFieldProps,
  KirbyToggleFieldProps,
  KirbyWriterFieldProps,
} from "../src/blueprint";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// =============================================================================
// 1. KIRBY OPTION
// =============================================================================

expectAssignable<KirbyOption>({
  disabled: false,
  icon: null,
  info: null,
  text: "Draft",
  value: "draft",
});

expectAssignable<KirbyOption>({
  disabled: true,
  icon: "page",
  info: "Additional info",
  text: "Published",
  value: 1,
});

// =============================================================================
// 2. BASE FIELD PROPS
// =============================================================================

expectAssignable<KirbyFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "title",
  required: true,
  saveable: true,
  translate: true,
  type: "text",
  width: "1/2",
});

expectAssignable<KirbyFieldProps>({
  after: "$",
  autofocus: true,
  before: "Price:",
  default: "Default value",
  disabled: false,
  help: "Help text with **markdown**",
  hidden: false,
  icon: "text",
  label: "Title",
  name: "title",
  placeholder: "Enter title...",
  required: false,
  saveable: true,
  translate: false,
  type: "text",
  value: "Current value",
  when: { status: "draft" },
  width: "1/1",
});

// =============================================================================
// 3. TEXT FIELD PROPS
// =============================================================================

expectAssignable<KirbyTextFieldProps>({
  autofocus: false,
  counter: true,
  disabled: false,
  font: "sans-serif",
  hidden: false,
  name: "title",
  required: false,
  saveable: true,
  spellcheck: true,
  translate: true,
  type: "text",
  width: "1/1",
});

expectAssignable<KirbyTextFieldProps>({
  autofocus: false,
  converter: "slug",
  counter: false,
  disabled: false,
  font: "monospace",
  hidden: false,
  maxlength: 100,
  minlength: 5,
  name: "code",
  pattern: "^[a-z]+$",
  required: true,
  saveable: true,
  spellcheck: false,
  translate: false,
  type: "textarea",
  value: "some-slug",
  width: "1/2",
});

// All text-like types
expectType<"text" | "textarea" | "slug" | "url" | "email" | "tel">(
  {} as KirbyTextFieldProps["type"],
);

// =============================================================================
// 4. NUMBER FIELD PROPS
// =============================================================================

expectAssignable<KirbyNumberFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "quantity",
  required: false,
  saveable: true,
  translate: false,
  type: "number",
  width: "1/4",
});

expectAssignable<KirbyNumberFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  max: 100,
  min: 0,
  name: "price",
  required: true,
  saveable: true,
  step: 0.01,
  translate: false,
  type: "number",
  value: 49.99,
  width: "1/2",
});

// =============================================================================
// 5. OPTIONS FIELD PROPS
// =============================================================================

expectAssignable<KirbyOptionsFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "category",
  options: [
    { disabled: false, icon: null, info: null, text: "News", value: "news" },
    { disabled: false, icon: null, info: null, text: "Blog", value: "blog" },
  ],
  required: false,
  saveable: true,
  translate: true,
  type: "select",
  width: "1/2",
});

expectAssignable<KirbyOptionsFieldProps>({
  autofocus: false,
  columns: 3,
  disabled: false,
  hidden: false,
  max: 3,
  min: 1,
  name: "tags",
  options: [],
  required: true,
  saveable: true,
  translate: true,
  type: "checkboxes",
  value: ["tag1", "tag2"],
  width: "1/1",
});

// All options types
expectType<"select" | "radio" | "checkboxes" | "multiselect" | "toggles">(
  {} as KirbyOptionsFieldProps["type"],
);

// =============================================================================
// 6. TOGGLE FIELD PROPS
// =============================================================================

expectAssignable<KirbyToggleFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "featured",
  required: false,
  saveable: true,
  translate: false,
  type: "toggle",
  value: true,
  width: "1/4",
});

expectAssignable<KirbyToggleFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "status",
  required: false,
  saveable: true,
  text: ["Inactive", "Active"],
  translate: false,
  type: "toggle",
  value: false,
  width: "1/2",
});

// =============================================================================
// 7. DATE FIELD PROPS
// =============================================================================

expectAssignable<KirbyDateFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "publishDate",
  required: false,
  saveable: true,
  translate: false,
  type: "date",
  width: "1/2",
});

expectAssignable<KirbyDateFieldProps>({
  autofocus: false,
  calendar: true,
  disabled: false,
  display: "DD.MM.YYYY",
  hidden: false,
  max: "2030-12-31",
  min: "2020-01-01",
  name: "deadline",
  required: true,
  saveable: true,
  step: { size: 1, unit: "day" },
  time: true,
  translate: false,
  type: "date",
  value: "2024-06-15",
  width: "1/3",
});

// =============================================================================
// 8. FILES FIELD PROPS
// =============================================================================

expectAssignable<KirbyFilesFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  multiple: true,
  name: "images",
  required: false,
  saveable: true,
  translate: false,
  type: "files",
  width: "1/1",
});

expectAssignable<KirbyFilesFieldProps>({
  autofocus: false,
  disabled: false,
  empty: "No files selected",
  hidden: false,
  image: { cover: true },
  info: "{{ file.size }}",
  link: true,
  max: 5,
  min: 1,
  multiple: true,
  name: "gallery",
  query: "page.images",
  required: true,
  saveable: true,
  search: true,
  store: "uuid",
  text: "{{ file.filename }}",
  translate: false,
  type: "files",
  value: [{ id: "image.jpg", text: "image.jpg" }],
  width: "1/1",
});

// =============================================================================
// 9. COLOR FIELD PROPS
// =============================================================================

expectAssignable<KirbyColorFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  name: "background",
  required: false,
  saveable: true,
  translate: false,
  type: "color",
  width: "1/4",
});

expectAssignable<KirbyColorFieldProps>({
  alpha: true,
  autofocus: false,
  disabled: false,
  format: "hsl",
  hidden: false,
  mode: "options",
  name: "theme",
  options: [{ value: "#ff0000", text: "Red" }],
  required: false,
  saveable: true,
  translate: false,
  type: "color",
  value: "hsl(0, 100%, 50%)",
  width: "1/2",
});

// =============================================================================
// 10. STRUCTURE FIELD PROPS
// =============================================================================

expectAssignable<KirbyStructureFieldProps>({
  autofocus: false,
  disabled: false,
  fields: {
    title: {
      autofocus: false,
      disabled: false,
      hidden: false,
      name: "title",
      required: true,
      saveable: true,
      translate: true,
      type: "text",
      width: "1/1",
    },
  },
  hidden: false,
  name: "items",
  required: false,
  saveable: true,
  translate: true,
  type: "structure",
  width: "1/1",
});

expectAssignable<KirbyStructureColumn>({
  label: "Title",
  width: "1/2",
  type: "text",
  mobile: true,
  align: "left",
});

// =============================================================================
// 11. OBJECT FIELD PROPS
// =============================================================================

expectAssignable<KirbyObjectFieldProps>({
  autofocus: false,
  disabled: false,
  fields: {
    street: {
      autofocus: false,
      disabled: false,
      hidden: false,
      name: "street",
      required: true,
      saveable: true,
      translate: true,
      type: "text",
      width: "1/1",
    },
  },
  hidden: false,
  name: "address",
  required: false,
  saveable: true,
  translate: true,
  type: "object",
  width: "1/1",
});

// Object value can be empty string (Kirby quirk)
expectType<Record<string, unknown> | "">(
  {} as KirbyObjectFieldProps["value"],
);

// =============================================================================
// 12. BLOCKS FIELD PROPS
// =============================================================================

expectAssignable<KirbyBlocksFieldProps>({
  autofocus: false,
  disabled: false,
  fieldsets: {},
  hidden: false,
  name: "content",
  required: false,
  saveable: true,
  translate: true,
  type: "blocks",
  width: "1/1",
});

expectAssignable<KirbyBlockValue>({
  content: { text: "Hello" },
  id: "block-1",
  isHidden: false,
  type: "text",
});

// =============================================================================
// 13. LAYOUT FIELD PROPS
// =============================================================================

expectAssignable<KirbyLayoutFieldProps>({
  autofocus: false,
  disabled: false,
  fieldsets: {},
  hidden: false,
  layouts: [["1/1"], ["1/2", "1/2"], ["1/3", "1/3", "1/3"]],
  name: "builder",
  required: false,
  saveable: true,
  translate: true,
  type: "layout",
  width: "1/1",
});

expectAssignable<KirbyLayoutValue>({
  attrs: { class: "highlight" },
  columns: [{ blocks: [], id: "col-1", width: "1/1" }],
  id: "layout-1",
});

expectAssignable<KirbyLayoutColumnValue>({
  blocks: [{ content: {}, id: "b1", isHidden: false, type: "text" }],
  id: "col-1",
  width: "1/2",
});

// =============================================================================
// 14. WRITER FIELD PROPS
// =============================================================================

expectAssignable<KirbyWriterFieldProps>({
  autofocus: false,
  disabled: false,
  hidden: false,
  inline: false,
  name: "text",
  required: false,
  saveable: true,
  translate: true,
  type: "writer",
  width: "1/1",
});

expectAssignable<KirbyWriterFieldProps>({
  autofocus: false,
  counter: true,
  disabled: false,
  headings: [1, 2, 3],
  hidden: false,
  inline: true,
  marks: ["bold", "italic", "link"],
  maxlength: 500,
  minlength: 10,
  name: "excerpt",
  nodes: false,
  required: true,
  saveable: true,
  translate: true,
  type: "writer",
  value: "<p>Content</p>",
  width: "1/1",
});

// =============================================================================
// 15. FIELDSET PROPS
// =============================================================================

expectAssignable<KirbyFieldsetProps>({
  disabled: false,
  editable: true,
  icon: "text",
  label: null,
  name: "Text",
  preview: "fields",
  tabs: {
    content: {
      fields: {},
      label: "Content",
      name: "content",
    },
  },
  translate: true,
  type: "text",
  unset: false,
  wysiwyg: false,
});

expectAssignable<KirbyFieldsetTab>({
  fields: {
    text: {
      autofocus: false,
      disabled: false,
      hidden: false,
      name: "text",
      required: false,
      saveable: true,
      translate: true,
      type: "writer",
      width: "1/1",
    },
  },
  label: "Content",
  name: "content",
});

expectAssignable<KirbyFieldsetGroup>({
  label: "Text",
  name: "text",
  open: true,
  sets: ["text", "heading", "quote"],
});

// =============================================================================
// NEGATIVE TESTS
// =============================================================================

// Missing required base props
expectNotAssignable<KirbyFieldProps>({
  name: "title",
  type: "text",
  // Missing: autofocus, disabled, hidden, required, saveable, translate, width
});

// Wrong type literal
expectNotAssignable<KirbyTextFieldProps>({
  autofocus: false,
  counter: true,
  disabled: false,
  font: "sans-serif",
  hidden: false,
  name: "title",
  required: false,
  saveable: true,
  spellcheck: true,
  translate: true,
  type: "number", // Should be text/textarea/slug/url/email/tel
  width: "1/1",
});

// Invalid font value
expectNotAssignable<KirbyTextFieldProps>({
  autofocus: false,
  counter: true,
  disabled: false,
  font: "comic-sans", // Should be sans-serif or monospace
  hidden: false,
  name: "title",
  required: false,
  saveable: true,
  spellcheck: true,
  translate: true,
  type: "text",
  width: "1/1",
});
