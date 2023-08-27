# kirby-types

[![NPM version](https://img.shields.io/npm/v/kirby-types?color=a1b858&label=)](https://www.npmjs.com/package/kirby-types)

A collection of TypeScript types to work with [Kirby CMS](https://getkirby.com), mainly in the context of the Kirby Query Language.

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
import type { KirbyQuery } from "kirby-types";

// Strictly typed query
const query: KirbyQuery = 'page.children.filterBy("featured", true)';

// Invalid queries will throw a type error
let invalidQuery: KirbyQuery;
invalidQuery = "unknown"; // Not a valid model
invalidQuery = 'site("'; // Empty parentheses
invalidQuery = 'site("value"'; // Missing closing parenthesis
```

## API

By clicking on a type name, you will be redirected to the corresponding TypeScript definition file.

### Query

- [`KirbyQueryModel`](./src/query.d.ts) - Matches any [supported KirbyQL model](https://github.com/getkirby/kql/blob/66abd20093e5656b0f7e6f51ee04f630ab38f2a3/src/Kql/Kql.php#L73).
- [`KirbyQuery`](./src/query.d.ts) - Matches a KirbyQL [`query`](https://getkirby.com/docs/guide/blueprints/query-language).

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
