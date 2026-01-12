<div align="center">
  <img src="./.github/favicon.svg" alt="kirby-types logo" width="144">

# kirby-types

A collection of TypeScript types for [Kirby CMS](https://getkirby.com).

[Quick Start](#quick-start) •
[Common Patterns](#common-patterns) •
[Panel Types](#panel-types) •
[API Reference](#api-reference)

</div>

## When to Use

| Use Case                                                     | Types to Import                                 |
| ------------------------------------------------------------ | ----------------------------------------------- |
| **Fetching page data** from Kirby's API                      | `KirbyApiResponse`, `KirbyBlock`, `KirbyLayout` |
| **Building KQL queries** with type safety                    | `KirbyQueryRequest`, `KirbyQueryResponse`       |
| **Developing Panel plugins** (Vue components, custom fields) | `Panel`, `PanelApi`                             |
| **Creating Writer extensions** (rich text editor)            | `WriterMarkExtension`, `WriterNodeExtension`    |

## Setup

```bash
# pnpm
pnpm add -D kirby-types

# npm
npm i -D kirby-types

# yarn
yarn add -D kirby-types
```

## Quick Start

### Typing KQL Responses

```ts
import type { KirbyQueryRequest, KirbyQueryResponse } from "kirby-types";

// Define your query with full type safety
const request: KirbyQueryRequest = {
  query: "site",
  select: {
    title: true,
    children: {
      query: "site.children",
      select: ["id", "title", "isListed"],
    },
  },
};

// Type the response
interface SiteData {
  title: string;
  children: { id: string; title: string; isListed: boolean }[];
}

type Response = KirbyQueryResponse<SiteData>;
```

### Typing Blocks with Content

```ts
import type { KirbyBlock } from "kirby-types";

// Default block types are fully typed
const textBlock: KirbyBlock<"text"> = {
  id: "abc123",
  type: "text",
  isHidden: false,
  content: { text: "<p>Hello world</p>" },
};

// Custom blocks with your own content structure
interface HeroContent {
  title: string;
  image: string;
  cta: string;
}

const heroBlock: KirbyBlock<"hero", HeroContent> = {
  id: "def456",
  type: "hero",
  isHidden: false,
  content: {
    title: "Welcome",
    image: "hero.jpg",
    cta: "Learn more",
  },
};
```

### Typing Layouts

```ts
import type { KirbyBlock, KirbyLayout } from "kirby-types";

const layout: KirbyLayout = {
  id: "layout-1",
  attrs: { class: "highlight" },
  columns: [
    { id: "col-1", width: "1/3", blocks: [] },
    { id: "col-2", width: "2/3", blocks: [] },
  ],
};
```

## Common Patterns

### Pattern 1: Full Page Response with Blocks and Layouts

```ts
import type { KirbyBlock, KirbyLayout, PanelModelData } from "kirby-types";

// Define custom block types alongside defaults
interface CallToActionContent {
  text: string;
  url: string;
  style: "primary" | "secondary";
}

type CustomBlock =
  | KirbyBlock<"text">
  | KirbyBlock<"heading">
  | KirbyBlock<"image">
  | KirbyBlock<"cta", CallToActionContent>;

interface BlogPostContent {
  date: string;
  author: string;
  blocks: CustomBlock[];
  layout: KirbyLayout[];
}

type BlogPostPage = PanelModelData<BlogPostContent>;
```

### Pattern 2: KQL Queries with Pagination

```ts
import type { KirbyQueryRequest, KirbyQueryResponse } from "kirby-types";

// Define request
const request: KirbyQueryRequest = {
  query: 'page("blog").children.listed',
  select: {
    title: "page.title",
    date: "page.date.toDate",
    excerpt: "page.text.toBlocks.excerpt(200)",
  },
  pagination: { limit: 10, page: 1 },
};

// Type the response data
interface BlogPostSummary {
  title: string;
  date: string;
  excerpt: string;
}

// With pagination (second generic = true)
type PaginatedResponse = KirbyQueryResponse<BlogPostSummary[], true>;

// Response shape:
// {
//   code: 200,
//   status: "ok",
//   result: {
//     data: BlogPostSummary[],
//     pagination: { page, pages, offset, limit, total }
//   }
// }
```

## Panel Types

For Panel plugin development, type the global `window.panel` object:

```ts
import type { Panel } from "kirby-types";

declare global {
  interface Window {
    panel: Panel;
  }
}
```

Common Panel operations:

```ts
// Notifications
window.panel.notification.success("Changes saved");
window.panel.notification.error("Something went wrong");

// Theme
window.panel.theme.set("dark");

// Navigation
await window.panel.view.open("/pages/blog");
await window.panel.dialog.open("/dialogs/pages/create");

// API calls
const page = await window.panel.api.pages.read("blog");
await window.panel.api.pages.update("blog", { title: "New Title" });

// Content state
const currentContent = panel.content.version("changes");
```

## Advanced: Writer Extensions

For ProseMirror-based Writer extensions (requires optional peer dependencies):

```ts
import type { WriterMarkExtension } from "kirby-types";

const highlight: WriterMarkExtension = {
  button: {
    icon: "highlight",
    label: "Highlight",
  },
  commands({ type, utils }) {
    return () => utils.toggleMark(type);
  },
  inputRules({ type, utils }) {
    return [utils.markInputRule(/\*\*([^*]+)\*\*$/, type)];
  },
  schema: {
    parseDOM: [{ tag: "mark" }],
    toDOM: () => ["mark", 0],
  },
};
```

<details>
<summary>Required peer dependencies for Writer types</summary>

```bash
pnpm add -D prosemirror-commands prosemirror-inputrules prosemirror-model prosemirror-schema-list prosemirror-state prosemirror-view
```

</details>

## API Reference

### Content Types (Most Used)

| Type                                         | Description                        |
| -------------------------------------------- | ---------------------------------- |
| [`KirbyApiResponse<T>`](./src/api.d.ts)      | Standard API response wrapper      |
| [`KirbyBlock<T, U>`](./src/blocks.d.ts)      | Block with type and content        |
| [`KirbyLayout`](./src/layout.d.ts)           | Layout row with columns            |
| [`KirbyLayoutColumn`](./src/layout.d.ts)     | Column with width and blocks       |
| [`KirbyDefaultBlocks`](./src/blocks.d.ts)    | Map of default block content types |
| [`KirbyDefaultBlockType`](./src/blocks.d.ts) | Union of default block type names  |

### KQL Types

| Type                                         | Description                           |
| -------------------------------------------- | ------------------------------------- |
| [`KirbyQueryRequest`](./src/kql.d.ts)        | KQL request with pagination           |
| [`KirbyQueryResponse<T, P>`](./src/kql.d.ts) | KQL response with optional pagination |
| [`KirbyQuerySchema`](./src/kql.d.ts)         | KQL query schema structure            |
| [`KirbyQuery<M>`](./src/query.d.ts)          | Valid KQL query string                |
| [`ParseKirbyQuery<T>`](./src/query.d.ts)     | Parse query string to structured type |

### Panel Types

| Type                                       | Description                     |
| ------------------------------------------ | ------------------------------- |
| [`Panel`](./src/panel/index.d.ts)          | Main Panel interface            |
| [`PanelApi`](./src/panel/api.d.ts)         | API client methods              |
| [`PanelState`](./src/panel/base.d.ts)      | Base state interface            |
| [`PanelFeature`](./src/panel/base.d.ts)    | Feature with loading states     |
| [`PanelModal`](./src/panel/base.d.ts)      | Modal (dialog/drawer) interface |
| [`PanelHelpers`](./src/panel/helpers.d.ts) | Utility functions               |

### Blueprint Types

| Type                                               | Description                              |
| -------------------------------------------------- | ---------------------------------------- |
| [`KirbyFieldProps`](./src/blueprint.d.ts)          | Base field props from `Field->toArray()` |
| [`KirbyFieldsetProps`](./src/blueprint.d.ts)       | Fieldset from `Fieldset->toArray()`      |
| [`KirbyBlocksFieldProps`](./src/blueprint.d.ts)    | Blocks field props with fieldsets        |
| [`KirbyStructureFieldProps`](./src/blueprint.d.ts) | Structure field props with nested fields |
| [`KirbyLayoutFieldProps`](./src/blueprint.d.ts)    | Layout field props with settings         |
| [`KirbyAnyFieldProps`](./src/blueprint.d.ts)       | Union of all field prop types            |

### Writer Types

| Type                                             | Description                        |
| ------------------------------------------------ | ---------------------------------- |
| [`WriterEditor`](./src/panel/writer.d.ts)        | Main editor instance               |
| [`WriterMarkExtension`](./src/panel/writer.d.ts) | Mark extension interface           |
| [`WriterNodeExtension`](./src/panel/writer.d.ts) | Node extension interface           |
| [`WriterUtils`](./src/panel/writer.d.ts)         | ProseMirror commands and utilities |

<details>
<summary>View all Blueprint field types</summary>

| Type                                              | Description                     |
| ------------------------------------------------- | ------------------------------- |
| [`KirbyTextFieldProps`](./src/blueprint.d.ts)     | Text field props                |
| [`KirbyTextareaFieldProps`](./src/blueprint.d.ts) | Textarea field props            |
| [`KirbyNumberFieldProps`](./src/blueprint.d.ts)   | Number field props              |
| [`KirbyDateFieldProps`](./src/blueprint.d.ts)     | Date and time field props       |
| [`KirbyFilesFieldProps`](./src/blueprint.d.ts)    | Files/pages/users picker props  |
| [`KirbyOptionsFieldProps`](./src/blueprint.d.ts)  | Select/radio/checkboxes/toggles |
| [`KirbyToggleFieldProps`](./src/blueprint.d.ts)   | Toggle (boolean) field props    |
| [`KirbyColorFieldProps`](./src/blueprint.d.ts)    | Color picker field props        |
| [`KirbyRangeFieldProps`](./src/blueprint.d.ts)    | Range slider field props        |
| [`KirbyTagsFieldProps`](./src/blueprint.d.ts)     | Tags field props                |
| [`KirbyLinkFieldProps`](./src/blueprint.d.ts)     | Link field props                |
| [`KirbyObjectFieldProps`](./src/blueprint.d.ts)   | Object field props              |
| [`KirbyWriterFieldProps`](./src/blueprint.d.ts)   | Writer (rich text) field props  |

</details>

## Optional Dependencies

Vue is an optional peer dependency for Panel types:

```bash
pnpm add -D vue@^2.7.0
```

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
