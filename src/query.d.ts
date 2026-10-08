/**
 * Root a query starts from: a built-in Kirby root or a custom one.
 *
 * Built-in roots:
 * - `site` – The site object.
 * - `page` – A page object.
 * - `user` – A user object.
 * - `users` – All users.
 * - `file` – A file object.
 * - `model` – The page, file, user, or site the query runs on.
 * - `collection` – Named collection, called as `collection("name")`.
 * - `kirby` – The Kirby instance.
 * - `t` – Translation for the given key, called as `t("key")`.
 * - `qr` – QR code for the given data, called as `qr("data")`.
 * - `item` – Current item while options are built from a query or an API.
 * - `arrayItem` – Current array item while options are built from a query.
 * - `structureItem` – Current structure entry while options are built from a query.
 * - `block` – Current block while options are built from a query.
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
  /** @since 5.1.2 */
  | "users"
  | "file"
  | "model"
  | "t"
  | "qr"
  | "item"
  | "arrayItem"
  | "structureItem"
  | "block"
  | CustomModel;

/**
 * Root that a query can only call, as in `t("key")`: its function requires
 * arguments and no query data supplies it bare.
 * @internal
 */
type FunctionOnlyQueryModel = "collection" | "t" | "qr";

/**
 * Root that a query can use without a call, as in `page.title`.
 * @internal
 */
type AccessibleQueryModel<M extends string = never> =
  Exclude<KirbyQueryModel, FunctionOnlyQueryModel> | M;

/**
 * Root that a query can call, as in `page("id")`: a global query function or a
 * custom root.
 * @internal
 */
type CallableQueryModel<M extends string = never> =
  | Exclude<
      KirbyQueryModel,
      "model" | "item" | "arrayItem" | "structureItem" | "block"
    >
  | M;

/**
 * Dot notation query, such as `root.property.method` or `root?.property`.
 * @internal
 */
type DotNotationQuery<M extends string = never> =
  | `${AccessibleQueryModel<M>}.${string}`
  | `${AccessibleQueryModel<M>}?.${string}`;

/**
 * Function notation query, such as `page(params)` or `page(params).chain`.
 * @internal
 */
type FunctionNotationQuery<M extends string = never> =
  | `${CallableQueryModel<M>}(${string})`
  | `${CallableQueryModel<M>}(${string})${string}`;

/**
 * Query that starts with a root and continues with property access or method
 * calls:
 *
 * - **Dot notation**: `root.property.method()` or `root?.property`.
 * - **Function calls**: `page(params)`, calling a global function or custom
 *   root.
 * - **Mixed chains**: `page(params).property.method()`.
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
 * An unknown root is a type error. `collection`, `t`, and `qr` only work as
 * calls; `model`, `item`, `arrayItem`, `structureItem`, and `block` never take
 * `(`. The rest of the chain is not checked.
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
 * // const invalid: KirbyQuery = "collection"; // ❌ Only works as a call
 * // const invalid: KirbyQuery<MyRoots> = "user"; // ❌ Not in custom roots
 * ```
 *
 * @template CustomModel - Optional custom root names to include alongside built-in roots
 */
export type KirbyQuery<CustomModel extends string = never> =
  | AccessibleQueryModel<CustomModel>
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
 * and method calls. The chain splits at every dot, including dots inside method
 * arguments other than the root call's, and `?.` reads as `.` everywhere, inside
 * arguments too.
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
  // Case 0: Null-safe access parses like a dot (e.g., `page?.title`).
  T extends `${infer Head}?.${infer Tail}`
    ? ParseKirbyQuery<`${Head}.${Tail}`, M>
    : // Case 1: Bare root (e.g., `site`, `page`).
      T extends AccessibleQueryModel<M>
      ? { model: T; chain: [] }
      : // Case 2: Method call followed by a chain (e.g., `page("blog").children`).
        T extends `${infer Model extends CallableQueryModel<M>}(${infer Params}).${infer Chain}`
        ? {
            model: Model;
            chain: [
              ParseQuerySegment<`${Model}(${Params})`>,
              ...ParseQueryChain<Chain>,
            ];
          }
        : // Case 3: Method call only (e.g., `page("blog")`).
          T extends `${infer Model extends CallableQueryModel<M>}(${string})`
          ? { model: Model; chain: [ParseQuerySegment<T>] }
          : // Case 4: Dot notation (e.g., `page.children.listed`).
            T extends `${infer Model extends AccessibleQueryModel<M>}.${infer Chain}`
            ? { model: Model; chain: ParseQueryChain<Chain> }
            : never;
