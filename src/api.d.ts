/**
 * Standard response envelope of the Kirby API.
 *
 * @typeParam T - Type of the result data
 *
 * @see https://getkirby.com/docs/reference/api
 *
 * @example
 * ```ts
 * // Typed API response for a page
 * interface PageData {
 *   id: string;
 *   title: string;
 *   url: string;
 * }
 *
 * const response: KirbyApiResponse<PageData> = {
 *   code: 200,
 *   status: "ok",
 *   result: {
 *     id: "home",
 *     title: "Home",
 *     url: "/"
 *   }
 * };
 * ```
 *
 * @example
 * ```ts
 * // Error response
 * const errorResponse: KirbyApiResponse = {
 *   code: 404,
 *   status: "error"
 *   // result is undefined for errors
 * };
 * ```
 */
export interface KirbyApiResponse<T = any> {
  /** HTTP status code. */
  code: number;
  /** Typically `"ok"` on success and `"error"` on failure. */
  status: string;
  /** Response data, present only on success. */
  result?: T;
}
