import type { KirbyApiResponse } from "./api";
import type { KirbyQuery } from "./query";

/**
 * KQL (Kirby Query Language) query with an optional, nestable field selection.
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
  query: KirbyQuery;
  /** Field names, or an object for nested queries. */
  select?:
    string[] | Record<string, string | number | boolean | KirbyQuerySchema>;
}

/**
 * KQL request: a {@link KirbyQuerySchema} with optional pagination.
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
  pagination?: {
    /**
     * Maximum number of items to return.
     * @default 100
     */
    limit?: number;
    /** Page number, 1-indexed. */
    page?: number;
  };
}

/**
 * KQL response, wrapped in a {@link KirbyApiResponse}.
 *
 * @typeParam T - Type of the result data
 * @typeParam Pagination - Whether `result` is `{ data, pagination }`
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
        data: T;
        pagination: {
          /** Current page, 1-indexed. */
          page: number;
          /** Total number of pages. */
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
