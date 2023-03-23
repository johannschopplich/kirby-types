# kirby-fest

[![NPM version](https://img.shields.io/npm/v/kirby-fest?color=a1b858&label=)](https://www.npmjs.com/package/kirby-fest)

A collection of TypeScript types to work with Kirby, mainly in the context of the Kirby Query Language.

## Setup

```bash
# pnpm
pnpm add -D kirby-fest

# npm
npm i -D kirby-fest
```

## Basic Usage

```ts
import type { KirbyQuery } from "kirby-fest";

// Strictly typed query for the Kirby Query Language
const query: KirbyQuery = 'kirby.page("about")';
```

## API

Click the type names for complete docs.

### Query

- [`KirbyQueryModel`](./src/query.d.ts) - Matches any [supported KirbyQL model](https://github.com/getkirby/kql/blob/66abd20093e5656b0f7e6f51ee04f630ab38f2a3/src/Kql/Kql.php#L73).
- [`KirbyQuery`](./src/query.d.ts) - Matches a KirbyQL [`query`](https://getkirby.com/docs/guide/blueprints/query-language).

### Blocks

- [`KirbyBlockType`](./src/blocks.d.ts) - Matches any [Kirby block type](https://getkirby.com/docs/reference/panel/blocks).
- [`KirbyBlock`](./src/blocks.d.ts) - Matches a [Kirby block](https://getkirby.com/docs/guide/page-builder).

### Layout

- [`KirbyLayout`](./src/layout.d.ts) - Matches a [Kirby layout](https://getkirby.com/docs/reference/panel/fields/layout).
- [`KirbyLayoutColumn`](./src/layout.d.ts) - Matches any [supported layout width](https://getkirby.com/docs/reference/panel/fields/layout#defining-your-own-layouts__available-widths).

### KQL

- [`KirbyQuerySchema`](./src/kql.d.ts) - Matches a [KQL query schema](https://github.com/getkirby/kql).
- [`KirbyQueryRequest`](./src/kql.d.ts) - Matches any [KQL request](https://github.com/getkirby/kql).
- [`KirbyQueryResponse`](./src/kql.d.ts) - Matches any [KQL response](https://github.com/getkirby/kql).

## License

[MIT](./LICENSE) License © 2022-present [Johann Schopplich](https://github.com/johannschopplich)
