/**
 * Represents the standard response structure from the Kirby API.
 *
 * @typeParam T - The type of the result data. Defaults to `any`.
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
  /** HTTP status code of the response. */
  code: number;
  /** Status string, typically `"ok"` for success or `"error"` for failures. */
  status: string;
  /** The response data. Only present for successful responses. */
  result?: T;
}
