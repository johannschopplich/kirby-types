/**
 * Root a query starts from: a built-in Kirby root or a custom one.
 *
 * Built-in roots:
 * - `site` – The site object.
 * - `page` – The page in context.
 * - `user` – The user in context, else the logged-in user.
 * - `users` – All users.
 * - `file` – The file in context.
 * - `model` – The page, file, user, or site the query runs on.
 * - `collection` – Named collection, called as `collection("name")`.
 * - `kirby` – The Kirby instance.
 * - `t` – Translation for the given key, called as `t("key")`.
 * - `qr` – QR code for the given data, called as `qr("data")`.
 * - `item` – Current item while options are built from a query or an API.
 * - `arrayItem` – Current array item while options are built from a query.
 * - `structureItem` – Current structure entry while options are built from a query.
 * - `block` – Current block while options are built from a query.
 * - `this` – The whole data context, for keys that are not valid identifiers, as in `this["my-key"]`.
 *
 * @example
 * ```ts
 * // Built-in roots
 * const siteRoot: KirbyQueryRoot = "site";
 * const pageRoot: KirbyQueryRoot = "page";
 *
 * // Custom roots
 * type CustomRoots = "product" | "category";
 * const customRoot: KirbyQueryRoot<CustomRoots> = "product";
 * ```
 *
 * @source src/Query/Query.php
 * @source src/Query/Runners/Scope.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Option/OptionsQuery.php
 * @source src/Option/OptionsApi.php
 */
export type KirbyQueryRoot<R extends string = never> =
  | "collection"
  | "kirby"
  | "site"
  | "page"
  | "user"
  | "users"
  | "file"
  | "model"
  | "t"
  | "qr"
  | "item"
  | "arrayItem"
  | "structureItem"
  | "block"
  | "this"
  | R;

/**
 * Root that a query can only call, as in `t("key")`: its function requires
 * arguments and no query data supplies it bare.
 * @internal
 */
type FunctionOnlyQueryRoot = "collection" | "t" | "qr";

/**
 * Root that a query can use without a call, as in `page.title`.
 * @internal
 */
type AccessibleQueryRoot<R extends string = never> =
  Exclude<KirbyQueryRoot, FunctionOnlyQueryRoot> | R;

/**
 * Root that a query can call, as in `page("id")`: a global query function or a
 * custom root.
 * @internal
 */
type CallableQueryRoot<R extends string = never> =
  | Exclude<
      KirbyQueryRoot,
      "model" | "item" | "arrayItem" | "structureItem" | "block" | "this"
    >
  | R;

/**
 * Dot notation query, such as `root.property.method`, `root?.property`, or
 * `root[key]`.
 * @internal
 */
type DotNotationQuery<R extends string = never> =
  | `${AccessibleQueryRoot<R>}.${string}`
  | `${AccessibleQueryRoot<R>}?.${string}`
  | `${AccessibleQueryRoot<R>}[${string}`;

/**
 * Function notation query, such as `page(params)` or `page(params).chain`.
 * @internal
 */
type FunctionNotationQuery<R extends string = never> =
  | `${CallableQueryRoot<R>}(${string})`
  | `${CallableQueryRoot<R>}(${string})${string}`;

/**
 * Binary or ternary operator the parser accepts after an expression.
 * @internal
 */
type QueryOperator =
  | "??"
  | "?:"
  | "?"
  | "||"
  | "OR"
  | "&&"
  | "AND"
  | "=="
  | "==="
  | "!="
  | "!=="
  | "<"
  | "<="
  | ">"
  | ">="
  | "+"
  | "-"
  | "*"
  | "/"
  | "%";

/**
 * Operator expression on a bare root, such as `root ?? fallback`,
 * `root ? a : b`, or `root && other`.
 * @internal
 */
type OperatorQuery<R extends string = never> =
  `${AccessibleQueryRoot<R>} ${QueryOperator} ${string}`;

/**
 * Query that starts with a root and continues with property access, method
 * calls, or an operator:
 *
 * - **Dot notation**: `root.property.method()`, `root?.property`, or `root[key]`.
 * - **Function calls**: `page(params)`, calling a global query function. A
 *   custom root takes `(` only when a plugin registers it as one; a custom
 *   root from the query data throws when called.
 * - **Mixed chains**: `page(params).property.method()`.
 * - **Operators**: `root ?? fallback`, `root ?: fallback`, `root ? a : b`,
 *   or a logical, comparison, or arithmetic operator such as `root && other`.
 *
 * @example
 * ```ts
 * // Dot notation queries
 * const dotQuery: KirbyQueryChain = "page.children.listed";
 * const methodQuery: KirbyQueryChain = "page.children.filterBy('featured', true)";
 *
 * // Function notation queries
 * const funcQuery: KirbyQueryChain = 'page("home")';
 * const mixedQuery: KirbyQueryChain = 'page("blog").children.sortBy("date")';
 *
 * // With custom roots
 * type CustomRoots = "product" | "category";
 * const customQuery: KirbyQueryChain<CustomRoots> = "product.price";
 * ```
 *
 * @typeParam R - Custom root names to include
 *
 * @source src/Query/Parser/Parser.php
 * @source src/Query/Parser/Tokenizer.php
 * @source src/Query/Visitors/DefaultVisitor.php
 */
export type KirbyQueryChain<R extends string = never> =
  DotNotationQuery<R> | FunctionNotationQuery<R> | OperatorQuery<R>;

/**
 * Kirby query string, checked against the known roots. It accepts:
 * - Bare roots (e.g., `"site"`, `"page"`)
 * - Property chains (e.g., `"page.children.listed"`)
 * - Method calls (e.g., `'page("home")'`, `'page.children.filterBy("status", "listed")'`)
 * - Complex mixed queries (e.g., `'page("blog").children.filterBy("featured", true).sortBy("date")'`).
 *
 * A query is a type error unless it starts with a known root, alone or followed
 * by `.`, `?.`, `[`, `(`, or a spaced operator such as `??`, `?:`, `?`, `&&`,
 * `==`, or `+` – `!page.isListed` and `page??fallback` fail. `collection`, `t`,
 * and `qr` only work as calls; `model`, `item`, `arrayItem`, `structureItem`,
 * `block`, and `this` never take `(`. The rest of the chain is not checked.
 *
 * @example
 * ```ts
 * // Valid queries
 * const simpleQuery: KirbyQuery = "site";
 * const propertyQuery: KirbyQuery = "page.children.listed";
 * const methodQuery: KirbyQuery = 'page.children.filterBy("featured", true)';
 * const complexQuery: KirbyQuery = 'page("home").children.sortBy("date", "desc").limit(10)';
 *
 * // Custom roots
 * type MyRoots = "product" | "category";
 * const customQuery: KirbyQuery<MyRoots> = "product.price";
 *
 * // Invalid queries (these will cause TypeScript errors)
 * // const invalid: KirbyQuery = "unknownRoot"; // ❌ Unknown root
 * // const invalid: KirbyQuery = "collection"; // ❌ Only works as a call
 * // const invalid: KirbyQuery<MyRoots> = "brand"; // ❌ Not a built-in or custom root
 * ```
 *
 * @typeParam R - Custom root names to include
 *
 * @source src/Query/Query.php
 * @source src/Query/Parser/Parser.php
 * @source src/Query/Visitors/DefaultVisitor.php
 */
export type KirbyQuery<R extends string = never> =
  | AccessibleQueryRoot<R>
  | (string extends KirbyQueryChain<R> ? never : KirbyQueryChain<R>);

/**
 * Parses a query segment as a property access or a method call.
 *
 * @example
 * ```ts
 * type Property = ParseQuerySegment<"children">;
 * // Result: { type: "property"; name: "children" }
 *
 * type Method = ParseQuerySegment<'filterBy("status", "published")'>;
 * // Result: { type: "method"; name: "filterBy"; params: '"status", "published"' }
 * ```
 *
 * @internal
 */
type ParseQuerySegment<T extends string> =
  T extends `${infer Name}(${infer Params})`
    ? {
        type: "method";
        name: Name;
        params: Params;
      }
    : {
        type: "property";
        name: T;
      };

/**
 * Recursively parses a chain of query segments separated by dots.
 *
 * @example
 * ```ts
 * type Chain = ParseQueryChain<"children.listed.first">;
 * // Result: [
 * //   { type: "property"; name: "children" },
 * //   { type: "property"; name: "listed" },
 * //   { type: "property"; name: "first" }
 * // ]
 * ```
 *
 * @internal
 */
type ParseQueryChain<T extends string> =
  T extends `${infer First}.${infer Rest}`
    ? [ParseQuerySegment<First>, ...ParseQueryChain<Rest>]
    : [ParseQuerySegment<T>];

/**
 * Parses a Kirby query string into its `root` (e.g., `site`, `page`, `user`)
 * and a `chain` of property accesses and method calls. The chain splits at
 * every dot, including dots inside method arguments other than the root call's,
 * and `?.` reads as `.` everywhere, inside arguments too. `[key]` access and
 * operators such as `??`, `?:`, `==`, or `!` are not parsed: on a bare root the
 * result is `never`; after a chain they stay inside the segment names, split at
 * any dot they contain.
 *
 * @example
 * ```ts
 * // Bare root query
 * type Basic = ParseKirbyQuery<"site">;
 * // Result: { root: "site"; chain: [] }
 *
 * // Property chain query
 * type Props = ParseKirbyQuery<"page.children.listed">;
 * // Result: {
 * //   root: "page";
 * //   chain: [
 * //     { type: "property"; name: "children" },
 * //     { type: "property"; name: "listed" }
 * //   ]
 * // }
 *
 * // Method call query
 * type Method = ParseKirbyQuery<'page("notes")'>;
 * // Result: {
 * //   root: "page";
 * //   chain: [{ type: "method"; name: "page"; params: '"notes"' }]
 * // }
 *
 * // Complex query with mixed property and method calls
 * type Complex = ParseKirbyQuery<'page.children.filterBy("featured", true).sortBy("date")'>;
 * // Result: {
 * //   root: "page";
 * //   chain: [
 * //     { type: "property"; name: "children" },
 * //     { type: "method"; name: "filterBy"; params: '"featured", true' },
 * //     { type: "method"; name: "sortBy"; params: '"date"' }
 * //   ]
 * // }
 * ```
 *
 * @typeParam T - The query string to parse
 * @typeParam R - Custom root names to include
 *
 * @source src/Query/Parser/Parser.php
 */
export type ParseKirbyQuery<T extends string, R extends string = never> =
  // Case 0: Null-safe access parses like a dot (e.g., `page?.title`).
  T extends `${infer Head}?.${infer Tail}`
    ? ParseKirbyQuery<`${Head}.${Tail}`, R>
    : // Case 1: Bare root (e.g., `site`, `page`).
      T extends AccessibleQueryRoot<R>
      ? { root: T; chain: [] }
      : // Case 2: Method call followed by a chain (e.g., `page("blog").children`).
        T extends `${infer Root extends CallableQueryRoot<R>}(${infer Params}).${infer Chain}`
        ? {
            root: Root;
            chain: [
              ParseQuerySegment<`${Root}(${Params})`>,
              ...ParseQueryChain<Chain>,
            ];
          }
        : // Case 3: Method call only (e.g., `page("blog")`).
          T extends `${infer Root extends CallableQueryRoot<R>}(${string})`
          ? { root: Root; chain: [ParseQuerySegment<T>] }
          : // Case 4: Dot notation (e.g., `page.children.listed`).
            T extends `${infer Root extends AccessibleQueryRoot<R>}.${infer Chain}`
            ? { root: Root; chain: ParseQueryChain<Chain> }
            : never;
