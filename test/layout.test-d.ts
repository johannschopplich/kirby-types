import type {
  KirbyLayout,
  KirbyLayoutColumn,
  KirbyLayoutColumnWidth,
} from "../src/layout";
import { expectAssignable, expectNotAssignable } from "tsd";

// -----------------------------------------------------------------------------
// LAYOUT TYPE TESTS
// -----------------------------------------------------------------------------

// --- 1. KirbyLayoutColumnWidth ---

expectAssignable<KirbyLayoutColumnWidth>("1/1");
expectAssignable<KirbyLayoutColumnWidth>("1/2");
expectAssignable<KirbyLayoutColumnWidth>("1/3");
expectAssignable<KirbyLayoutColumnWidth>("2/3");
expectAssignable<KirbyLayoutColumnWidth>("1/4");
expectAssignable<KirbyLayoutColumnWidth>("3/4");
expectAssignable<KirbyLayoutColumnWidth>("1/12");
expectAssignable<KirbyLayoutColumnWidth>("6/12");
expectAssignable<KirbyLayoutColumnWidth>("12/12");

// Invalid widths
expectNotAssignable<KirbyLayoutColumnWidth>("1/5");
expectNotAssignable<KirbyLayoutColumnWidth>("full");
expectNotAssignable<KirbyLayoutColumnWidth>("50%");

// --- 2. KirbyLayoutColumn ---

expectAssignable<KirbyLayoutColumn>({
  id: "col-1",
  width: "1/2",
  blocks: [],
});

expectAssignable<KirbyLayoutColumn>({
  id: "col-2",
  width: "1/3",
  blocks: [
    {
      id: "block-1",
      type: "text",
      isHidden: false,
      content: { text: "Hello world" },
    },
  ],
});

// Column with multiple blocks
expectAssignable<KirbyLayoutColumn>({
  id: "col-3",
  width: "2/3",
  blocks: [
    {
      id: "block-1",
      type: "heading",
      isHidden: false,
      content: { level: "h2", text: "Title" },
    },
    {
      id: "block-2",
      type: "text",
      isHidden: false,
      content: { text: "Paragraph" },
    },
  ],
});

// --- 3. KirbyLayout ---

// Layout with object attrs
expectAssignable<KirbyLayout>({
  id: "layout-1",
  attrs: { class: "highlight", style: "background: blue" },
  columns: [{ id: "col-1", width: "1/1", blocks: [] }],
});

// Layout with empty array attrs (Kirby returns [] when no attrs)
expectAssignable<KirbyLayout>({
  id: "layout-2",
  attrs: [],
  columns: [
    { id: "col-1", width: "1/2", blocks: [] },
    { id: "col-2", width: "1/2", blocks: [] },
  ],
});

// Layout with multiple columns of different widths
expectAssignable<KirbyLayout>({
  id: "layout-3",
  attrs: {},
  columns: [
    { id: "col-1", width: "1/4", blocks: [] },
    { id: "col-2", width: "1/2", blocks: [] },
    { id: "col-3", width: "1/4", blocks: [] },
  ],
});

// -----------------------------------------------------------------------------
// NEGATIVE TESTS
// -----------------------------------------------------------------------------

// Missing required fields
expectNotAssignable<KirbyLayoutColumn>({
  id: "col-1",
  // Missing width and blocks
});

expectNotAssignable<KirbyLayout>({
  id: "layout-1",
  // Missing attrs and columns
});

// Invalid width type
expectNotAssignable<KirbyLayoutColumn>({
  id: "col-1",
  width: "invalid",
  blocks: [],
});
