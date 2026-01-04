import type { KirbyApiResponse } from "./api";
import type { KirbyQuery } from "./query";

/**
 * Defines the structure of a KQL (Kirby Query Language) query schema.
 * Used for building nested, structured queries against Kirby content.
 *
 * @see https://github.com/getkirby/kql
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
 *   query: "page",
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
 */
export interface KirbyQuerySchema {
  /** The KQL query string to execute. */
  query: KirbyQuery;
  /**
   * Fields to select from the query result.
   * Can be an array of field names or an object for nested queries.
   */
  select?:
    | string[]
    | Record<string, string | number | boolean | KirbyQuerySchema>;
}

/**
 * Represents a complete KQL request with optional pagination.
 * Extends {@link KirbyQuerySchema} with pagination options.
 *
 * @see https://github.com/getkirby/kql
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
 */
export interface KirbyQueryRequest extends KirbyQuerySchema {
  /**
   * Pagination options for limiting and offsetting results.
   */
  pagination?: {
    /**
     * Maximum number of items to return.
     * @default 100
     */
    limit?: number;
    /** Page number to retrieve (1-indexed). */
    page?: number;
  };
}

/**
 * Represents the response from a KQL query.
 * Wraps the result in a {@link KirbyApiResponse} with optional pagination metadata.
 *
 * @typeParam T - The type of the result data.
 * @typeParam Pagination - Whether pagination metadata is included. When `true`, the result is wrapped in `{ data, pagination }`.
 *
 * @see https://github.com/getkirby/kql
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
 */
export type KirbyQueryResponse<
  T = any,
  Pagination extends boolean = false,
> = KirbyApiResponse<
  Pagination extends true
    ? {
        /** The query result data. */
        data: T;
        /** Pagination metadata. */
        pagination: {
          /** Current page number (1-indexed). */
          page: number;
          /** Total number of pages. */
          pages: number;
          /** Number of items skipped (offset). */
          offset: number;
          /** Maximum items per page. */
          limit: number;
          /** Total number of items across all pages. */
          total: number;
        };
      }
    : T
>;
