import type {
  KirbyLayout,
  KirbyLayoutColumn,
  KirbyLayoutColumnWidth,
} from "../src/layout";
import { expectAssignable, expectNotAssignable } from "tsd";

// -----------------------------------------------------------------------------
// 1. Layout Types
// -----------------------------------------------------------------------------

expectAssignable<KirbyLayoutColumnWidth>("1/1");
expectAssignable<KirbyLayoutColumnWidth>("1/2");
expectAssignable<KirbyLayoutColumnWidth>("1/3");
expectAssignable<KirbyLayoutColumnWidth>("2/3");
expectAssignable<KirbyLayoutColumnWidth>("1/4");
expectAssignable<KirbyLayoutColumnWidth>("1/12");
expectAssignable<KirbyLayoutColumnWidth>("12/12");

expectNotAssignable<KirbyLayoutColumnWidth>("1/5");
expectNotAssignable<KirbyLayoutColumnWidth>("full");
expectNotAssignable<KirbyLayoutColumnWidth>("50%");

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

expectAssignable<KirbyLayout>({
  id: "layout-1",
  attrs: { class: "highlight" },
  columns: [{ id: "col-1", width: "1/1", blocks: [] }],
});

// Kirby returns [] when no attrs
expectAssignable<KirbyLayout>({
  id: "layout-2",
  attrs: [],
  columns: [
    { id: "col-1", width: "1/2", blocks: [] },
    { id: "col-2", width: "1/2", blocks: [] },
  ],
});

// -----------------------------------------------------------------------------
// 2. Negative Tests
// -----------------------------------------------------------------------------

expectNotAssignable<KirbyLayoutColumn>({
  id: "col-1",
});

expectNotAssignable<KirbyLayout>({
  id: "layout-1",
});

expectNotAssignable<KirbyLayoutColumn>({
  id: "col-1",
  width: "invalid",
  blocks: [],
});
