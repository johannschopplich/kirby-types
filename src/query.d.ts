/**
 * Root a query starts from: a built-in Kirby root or a custom one.
 *
 * Built-in roots:
 * - `site` – The site object.
 * - `page` – A page object.
 * - `user` – A user object.
 * - `file` – A file object.
 * - `collection` – A collection object.
 * - `kirby` – The Kirby instance.
 * - `content` – Content field data.
 * - `item` – Generic item in collections.
 * - `arrayItem` – An item in an array.
 * - `structureItem` – An item in a structure field.
 * - `block` – A block in the blocks field.
 *
 * @example
 * ```ts
 * // Built-in roots
 * const siteRoot: KirbyQueryModel = "site";
 * const pageRoot: KirbyQueryModel = "page";
 *
 * // Custom roots
 * type CustomRoots = "product" | "category";
 * const customRoot: KirbyQueryModel<CustomRoots> = "product";
 * ```
 *
 * @template CustomModel - Additional custom root names to include
 */
export type KirbyQueryModel<CustomModel extends string = never> =
  | "collection"
  | "kirby"
  | "site"
  | "page"
  | "user"
  | "file"
  | "content"
  | "item"
  | "arrayItem"
  | "structureItem"
  | "block"
  | CustomModel;

/**
 * Dot notation query, such as `root.property.method`.
 * @internal
 */
type DotNotationQuery<M extends string = never> =
  `${KirbyQueryModel<M>}.${string}`;

/**
 * Function notation query, such as `root(params)` or `root(params).chain`.
 * @internal
 */
type FunctionNotationQuery<M extends string = never> =
  | `${KirbyQueryModel<M>}(${string})`
  | `${KirbyQueryModel<M>}(${string})${string}`;

/**
 * Query that starts with a root and continues with property access or method
 * calls:
 *
 * - **Dot notation**: `root.property.method()`
 * - **Function calls**: `root(params)`
 * - **Mixed chains**: `root(params).property.method()`
 *
 * @example
 * ```ts
 * // Dot notation queries
 * const dotQuery: KirbyQueryChain = "page.children.listed";
 * const methodQuery: KirbyQueryChain = "page.children.filterBy('featured', true)";
 *
 * // Function notation queries
 * const funcQuery: KirbyQueryChain = 'site("home")';
 * const mixedQuery: KirbyQueryChain = 'page("blog").children.sortBy("date")';
 *
 * // With custom roots
 * type CustomRoots = "product" | "category";
 * const customQuery: KirbyQueryChain<CustomRoots> = "product.price";
 * ```
 *
 * @template M - Optional custom root names to include in validation
 */
export type KirbyQueryChain<M extends string = never> =
  DotNotationQuery<M> | FunctionNotationQuery<M>;

/**
 * Kirby Query Language (KQL) string, checked against the known roots. It
 * accepts:
 * - Bare roots (e.g., `"site"`, `"page"`)
 * - Property chains (e.g., `"page.children.listed"`)
 * - Method calls (e.g., `'site("home")'`, `'page.filterBy("status", "published")'`)
 * - Complex mixed queries (e.g., `'page("blog").children.filterBy("featured", true).sortBy("date")'`).
 *
 * An unknown root is a type error; the rest of the chain is not checked.
 *
 * @example
 * ```ts
 * // Valid queries
 * const simpleQuery: KirbyQuery = "site";
 * const propertyQuery: KirbyQuery = "page.children.listed";
 * const methodQuery: KirbyQuery = 'page.filterBy("featured", true)';
 * const complexQuery: KirbyQuery = 'site("home").children.sortBy("date", "desc").limit(10)';
 *
 * // Custom roots
 * type MyRoots = "product" | "category";
 * const customQuery: KirbyQuery<MyRoots> = "product.price";
 *
 * // Invalid queries (these will cause TypeScript errors)
 * // const invalid: KirbyQuery = "unknownRoot"; // ❌ Unknown root
 * // const invalid: KirbyQuery<MyRoots> = "user"; // ❌ Not in custom roots
 * ```
 *
 * @template CustomModel - Optional custom root names to include alongside built-in roots
 */
export type KirbyQuery<CustomModel extends string = never> =
  | KirbyQueryModel<CustomModel>
  | (string extends KirbyQueryChain<CustomModel>
      ? never
      : KirbyQueryChain<CustomModel>);

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
 * Parses a Kirby Query Language (KQL) string into its root, returned as
 * `model` (e.g., `site`, `page`, `user`), and a `chain` of property accesses
 * and method calls.
 *
 * @example
 * ```ts
 * // Bare root query
 * type Basic = ParseKirbyQuery<"site">;
 * // Result: { model: "site"; chain: [] }
 *
 * // Property chain query
 * type Props = ParseKirbyQuery<"page.children.listed">;
 * // Result: {
 * //   model: "page";
 * //   chain: [
 * //     { type: "property"; name: "children" },
 * //     { type: "property"; name: "listed" }
 * //   ]
 * // }
 *
 * // Method call query
 * type Method = ParseKirbyQuery<'site("home")'>;
 * // Result: {
 * //   model: "site";
 * //   chain: [{ type: "method"; name: "site"; params: '"home"' }]
 * // }
 *
 * // Complex query with mixed property and method calls
 * type Complex = ParseKirbyQuery<'page.children.filterBy("featured", true).sortBy("date")'>;
 * // Result: {
 * //   model: "page";
 * //   chain: [
 * //     { type: "property"; name: "children" },
 * //     { type: "method"; name: "filterBy"; params: '"featured", true' },
 * //     { type: "method"; name: "sortBy"; params: '"date"' }
 * //   ]
 * // }
 * ```
 *
 * @template T - The query string to parse
 * @template M - Optional custom root names to include in validation
 */
export type ParseKirbyQuery<T extends string, M extends string = never> =
  // Case 1: Bare root (e.g., `site`, `page`).
  T extends KirbyQueryModel<M>
    ? { model: T; chain: [] }
    : // Case 2: Dot notation (e.g., `page.children.listed`).
      T extends `${infer Model}.${infer Chain}`
      ? Model extends KirbyQueryModel<M>
        ? { model: Model; chain: ParseQueryChain<Chain> }
        : never
      : // Case 3: Method call only (e.g., `site("home")`).
        T extends `${infer Model}(${infer Params})`
        ? Model extends KirbyQueryModel<M>
          ? { model: Model; chain: [ParseQuerySegment<T>] }
          : never
        : // Case 4: Method call followed by chain (e.g., `site("home").children`)
          T extends `${infer Model}(${infer Params})${infer Rest}`
          ? Model extends KirbyQueryModel<M>
            ? Rest extends `.${infer Chain}`
              ? {
                  model: Model;
                  chain: [
                    ParseQuerySegment<`${Model}(${Params})`>,
                    ...ParseQueryChain<Chain>,
                  ];
                }
              : never
            : never
          : never;
