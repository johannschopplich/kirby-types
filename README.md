# kirby-types

[![NPM version](https://img.shields.io/npm/v/kirby-types?color=a1b858&label=)](https://www.npmjs.com/package/kirby-types)

A collection of TypeScript types to work with [Kirby CMS](https://getkirby.com), mainly in the context of the Kirby Query Language and [headless Kirby usage](https://github.com/johannschopplich/kirby-headless).

## Setup

```bash
# pnpm
pnpm add -D kirby-types

# npm
npm i -D kirby-types

# yarn
yarn add -D kirby-types
```

## Basic Usage

```ts
import type { KirbyQuery, ParseKirbyQuery } from "kirby-types";

// Strictly typed query
const query: KirbyQuery = 'page.children.filterBy("featured", true)';

// Parse query strings into structured objects
type BasicQuery = ParseKirbyQuery<"site">;
// Result: { model: "site"; chain: [] }

type DotNotationQuery = ParseKirbyQuery<"page.children.listed">;
// Result: {
//   model: "page";
//   chain: [
//     { type: "property"; name: "children" },
//     { type: "property"; name: "listed" }
//   ]
// }

type MethodQuery = ParseKirbyQuery<'site("home")'>;
// Result: {
//   model: "site";
//   chain: [{ type: "method"; name: "site"; params: '"home"' }]
// }

type ComplexQuery =
  ParseKirbyQuery<'page.children.filterBy("status", "published")'>;
// Result: {
//   model: "page";
//   chain: [
//     { type: "property"; name: "children" },
//     { type: "method"; name: "filterBy"; params: '"status", "published"' }
//   ]
// }
```

## API

By clicking on a type name, you will be redirected to the corresponding TypeScript definition file.

### API

- [`KirbyApiResponse`](./src/api.d.ts) - Matches the response of a [Kirby API request](https://getkirby.com/docs/reference/api).

### Query

- [`KirbyQueryModel`](./src/query.d.ts) - Matches any supported KirbyQL model.
- [`KirbyQuery`](./src/query.d.ts) - Matches a KirbyQL [`query`](https://getkirby.com/docs/guide/blueprints/query-language).
- [`ParseKirbyQuery`](./src/query.d.ts) - Parses a KirbyQL query string into a structured object with model and chain information.

### Blocks

- [`KirbyBlock`](./src/blocks.d.ts) - Matches a [Kirby block](https://getkirby.com/docs/guide/page-builder).
- [`KirbyDefaultBlockType`](./src/blocks.d.ts) - Matches any [Kirby default block type](https://getkirby.com/docs/reference/panel/blocks).
- [`KirbyDefaultBlocks`](./src/blocks.d.ts) - Maps each of [Kirby's default block type](https://getkirby.com/docs/reference/panel/blocks) to its corresponding block content.

### Layout

- [`KirbyLayout`](./src/layout.d.ts) - Matches a [Kirby layout](https://getkirby.com/docs/reference/panel/fields/layout).
- [`KirbyLayoutColumn`](./src/layout.d.ts) - Matches any [supported layout width](https://getkirby.com/docs/reference/panel/fields/layout#defining-your-own-layouts__available-widths).

### KQL

- [`KirbyQuerySchema`](./src/kql.d.ts) - Matches a [KQL query schema](https://github.com/getkirby/kql).
- [`KirbyQueryRequest`](./src/kql.d.ts) - Matches any [KQL request](https://github.com/getkirby/kql).
- [`KirbyQueryResponse`](./src/kql.d.ts) - Matches any [KQL response](https://github.com/getkirby/kql).

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
