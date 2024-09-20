import type { KirbyBlock } from "../src/blocks";
import { expectAssignable } from "tsd";

expectAssignable<KirbyBlock<"text">>({
  content: { text: "Hello World" },
  id: "1",
  isHidden: false,
  type: "text",
});

// Overwriting the default content type for same block type
expectAssignable<KirbyBlock<"video", { videoId: number }>>({
  content: { videoId: 123 },
  id: "1",
  isHidden: false,
  type: "video",
});

expectAssignable<KirbyBlock<"custom", { foo: string }>>({
  content: { foo: "Hello World" },
  id: "1",
  isHidden: false,
  type: "custom",
});
