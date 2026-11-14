import type { KirbyApiResponse } from "./api.js";
import type { KirbyQuery } from "./query.js";

/**
 * KQL (Kirby Query Language) query with an optional, nestable field selection.
 *
 * @example
 * ```ts
 * // Simple query
 * const schema: KirbyQuerySchema = {
 *   query: "site"
 * };
 *
 * // Query with field selection
 * const schemaWithSelect: KirbyQuerySchema = {
 *   query: 'page("about")',
 *   select: ["title", "url", "content"]
 * };
 *
 * // Nested query with sub-selections
 * const nestedSchema: KirbyQuerySchema = {
 *   query: "site.children",
 *   select: {
 *     title: true,
 *     url: true,
 *     children: {
 *       query: "page.children",
 *       select: ["title", "url"]
 *     }
 *   }
 * };
 * ```
 *
 * @source src/Kql/Kql.php
 */
export interface KirbyQuerySchema {
  /**
   * Query whose result the selection applies to, `site` when omitted. Over the
   * KQL API, a page or file query starts at a call, such as `page("about")`. A
   * query that finds nothing, such as a missing page, gives a `null` result.
   */
  query?: KirbyQuery;
  /**
   * Field names as an array or a comma-separated string, `"?"` for help on the
   * result, or an object that maps each key to `true`, `false` (skip), a query
   * string, or a nested query. Without it, an object result comes with its
   * default keys. On an array result, a comma-separated string fails and each
   * key takes the array's value as-is.
   */
  select?:
    | string
    | string[]
    | Record<string, string | boolean | KirbyQueryNestedRequest>;
}

/**
 * KQL alias of an object that a nested query can start at, besides the core
 * query roots.
 * @internal
 *
 * @source src/Kql/Interceptors/Blueprint/Blueprint.php
 * @source src/Kql/Interceptors/Content/Content.php
 * @source src/Kql/Interceptors/Content/Field.php
 * @source src/Kql/Interceptors/Cms/Layout.php
 * @source src/Kql/Interceptors/Cms/LayoutColumn.php
 * @source src/Kql/Interceptors/Content/Lock.php
 * @source src/Kql/Interceptors/Toolkit/Obj.php
 * @source src/Kql/Interceptors/Panel/Model.php
 * @source src/Kql/Interceptors/Cms/Role.php
 * @source src/Kql/Interceptors/Cms/Translation.php
 * @source src/Kql/Interceptors/Content/Version.php
 * @source src/Kql/Interceptors/Content/VersionId.php
 */
type KirbyQueryObjectAlias =
  | "blueprint"
  | "content"
  | "field"
  | "layout"
  | "layoutColumn"
  | "lock"
  | "obj"
  | "panel"
  | "role"
  | "translation"
  | "version"
  | "versionId";

/**
 * @internal
 *
 * @source src/Kql/Kql.php
 */
interface KirbyQueryNestedRequest extends Omit<
  KirbyQueryRequest,
  "query" | "queries"
> {
  /**
   * Query whose result the selection applies to, the parent object's field or
   * method of the same key when omitted. Can also start at the parent object's
   * KQL alias, such as `layout` or `field`, used without a call.
   */
  query?: Exclude<
    KirbyQuery<KirbyQueryObjectAlias>,
    `${KirbyQueryObjectAlias}(${string}` | `!${KirbyQueryObjectAlias}(${string}`
  >;
}

/**
 * KQL request: a {@link KirbyQuerySchema} with optional pagination, or a set
 * of named queries.
 *
 * @example
 * ```ts
 * // Paginated request for blog posts
 * const request: KirbyQueryRequest = {
 *   query: 'page("blog").children.listed',
 *   select: {
 *     title: "page.title",
 *     date: "page.date.toDate",
 *     excerpt: "page.excerpt.kirbytext"
 *   },
 *   pagination: {
 *     limit: 10,
 *     page: 1
 *   }
 * };
 * ```
 *
 * @source src/Kql/Kql.php
 */
export interface KirbyQueryRequest extends KirbyQuerySchema {
  /**
   * Named queries, each run on its own. The result holds each query's result
   * under the same key; `query`, `select`, and `pagination` are ignored.
   */
  queries?:
    | Record<string, KirbyQuery | KirbyQueryRequest>
    | (KirbyQuery | KirbyQueryRequest)[];
  /**
   * Pagination of a collection result. Applies only when `query` and `select`
   * are set and the query returns a collection; the result is then
   * `{ data, pagination }`. An empty object leaves the result unpaginated.
   */
  pagination?: {
    /**
     * Maximum number of items to return, at least `1`; `20` when omitted
     * (unless the `pagination.limit` option is configured).
     */
    limit?: number;
    /**
     * Page number, 1-indexed; `1` when omitted. A page past the last one fails
     * the request with a `404` error.
     */
    page?: number;
  };
}

/**
 * KQL response, wrapped in a {@link KirbyApiResponse}.
 *
 * @typeParam T - Type of the result data
 * @typeParam Pagination - Whether `result` is `{ data, pagination }`
 *
 * @example
 * ```ts
 * // Response without pagination
 * interface Page {
 *   title: string;
 *   url: string;
 * }
 *
 * const response: KirbyQueryResponse<Page> = {
 *   code: 200,
 *   status: "ok",
 *   result: { title: "Home", url: "/" }
 * };
 * ```
 *
 * @example
 * ```ts
 * // Response with pagination
 * interface Post {
 *   title: string;
 *   date: string;
 * }
 *
 * const paginatedResponse: KirbyQueryResponse<Post[], true> = {
 *   code: 200,
 *   status: "ok",
 *   result: {
 *     data: [
 *       { title: "Post 1", date: "2024-01-01" },
 *       { title: "Post 2", date: "2024-01-02" }
 *     ],
 *     pagination: {
 *       page: 1,
 *       pages: 5,
 *       offset: 0,
 *       limit: 10,
 *       total: 50
 *     }
 *   }
 * };
 * ```
 *
 * @source extensions/api.php
 * @source src/Kql/Kql.php
 */
export type KirbyQueryResponse<
  T = any,
  Pagination extends boolean = false,
> = KirbyApiResponse<
  Pagination extends true
    ? {
        data: T;
        pagination: {
          /** Current page, 1-indexed; `0` for an empty result. */
          page: number;
          /** Total number of pages; `0` for an empty result. */
          pages: number;
          /** Number of items skipped. */
          offset: number;
          /** Maximum items per page. */
          limit: number;
          /** Total number of items across all pages. */
          total: number;
        };
      }
    : T
>;
