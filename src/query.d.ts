/**
 * Represents all supported model names in Kirby Query Language.
 *
 * This type includes all built-in Kirby models that can be used as the starting point
 * for queries, plus any custom models you define.
 *
 * Built-in models include:
 * - `site` - The site object
 * - `page` - A page object
 * - `user` - A user object
 * - `file` - A file object
 * - `collection` - A collection object
 * - `kirby` - The Kirby instance
 * - `content` - Content field data
 * - `item` - Generic item in collections
 * - `arrayItem` - An item in an array
 * - `structureItem` - An item in a structure field
 * - `block` - A block in the blocks field
 *
 * @example
 * ```ts
 * // Using built-in models
 * const siteModel: KirbyQueryModel = "site";
 * const pageModel: KirbyQueryModel = "page";
 *
 * // Using with custom models
 * type CustomModels = "product" | "category";
 * const customModel: KirbyQueryModel<CustomModels> = "product";
 * ```
 *
 * @template CustomModel - Additional custom model names to include
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
 * Helper type for dot notation queries (e.g., `model.property.method`).
 * @internal
 */
type DotNotationQuery<M extends string = never> =
  `${KirbyQueryModel<M>}.${string}`;

/**
 * Helper type for function notation queries (e.g., `model(params)` or `model(params).chain`).
 * @internal
 */
type FunctionNotationQuery<M extends string = never> =
  | `${KirbyQueryModel<M>}(${string})`
  | `${KirbyQueryModel<M>}(${string})${string}`;

/**
 * Represents query chains that extend beyond a simple model name.
 *
 * This type covers all valid query patterns that start with a model and include
 * additional property access or method calls:
 *
 * - **Dot notation**: `model.property.method()`
 * - **Function calls**: `model(params)`
 * - **Mixed chains**: `model(params).property.method()`
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
 * // With custom models
 * type CustomModels = "product" | "category";
 * const customQuery: KirbyQueryChain<CustomModels> = "product.price";
 * ```
 *
 * @template M - Optional custom model names to include in validation
 */
export type KirbyQueryChain<M extends string = never> =
  | DotNotationQuery<M>
  | FunctionNotationQuery<M>;

/**
 * Represents any valid Kirby Query Language (KQL) string.
 *
 * This is the main type for validating KQL queries. It accepts:
 * - Simple model names (e.g., `"site"`, `"page"`)
 * - Property chains (e.g., `"page.children.listed"`)
 * - Method calls (e.g., `'site("home")'`, `'page.filterBy("status", "published")'`)
 * - Complex mixed queries (e.g., `'page("blog").children.filterBy("featured", true).sortBy("date")'`)
 *
 * Invalid queries (unknown models, malformed syntax) will be rejected at the type level.
 *
 * @example
 * ```ts
 * // Valid queries
 * const simpleQuery: KirbyQuery = "site";
 * const propertyQuery: KirbyQuery = "page.children.listed";
 * const methodQuery: KirbyQuery = 'page.filterBy("featured", true)';
 * const complexQuery: KirbyQuery = 'site("home").children.sortBy("date", "desc").limit(10)';
 *
 * // Custom models
 * type MyModels = "product" | "category";
 * const customQuery: KirbyQuery<MyModels> = "product.price";
 *
 * // Invalid queries (these will cause TypeScript errors)
 * // const invalid: KirbyQuery = "unknownModel"; // ❌ Unknown model
 * // const invalid: KirbyQuery<MyModels> = "user"; // ❌ Not in custom models
 * ```
 *
 * @template CustomModel - Optional custom model names to include alongside built-in models
 */
export type KirbyQuery<CustomModel extends string = never> =
  | KirbyQueryModel<CustomModel>
  | (string extends KirbyQueryChain<CustomModel>
      ? never
      : KirbyQueryChain<CustomModel>);

/**
 * Parses a Kirby Query Language (KQL) string into a structured object.
 *
 * This type breaks down a query string into its constituent parts:
 * - `model`: The root model the query starts with (e.g., `site`, `page`, `user`)
 * - `chain`: An array of query segments representing the method calls and property accesses
 *
 * @example
 * ```ts
 * // Basic model query
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
 * @template M - Optional custom model names to include in validation
 */
export type ParseKirbyQuery<T extends string, M extends string = never> =
  // Case 1: Simple model name (e.g., "site", "page")
  T extends KirbyQueryModel<M>
    ? { model: T; chain: [] }
    : // Case 2: Dot notation (e.g., "page.children.listed")
      T extends `${infer Model}.${infer Chain}`
      ? Model extends KirbyQueryModel<M>
        ? { model: Model; chain: ParseQueryChain<Chain> }
        : never
      : // Case 3: Method call only (e.g., 'site("home")')
        T extends `${infer Model}(${infer Params})`
        ? Model extends KirbyQueryModel<M>
          ? { model: Model; chain: [ParseQuerySegment<T>] }
          : never
        : // Case 4: Method call followed by chain (e.g., 'site("home").children')
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
 * Parses a single query segment to determine if it's a property access or method call.
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
