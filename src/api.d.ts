/**
 * Response envelope of the Kirby API for the KQL endpoint `/api/query` and for
 * errors.
 *
 * Model and collection endpoints return their payload under `data`, not `result`.
 *
 * @typeParam T - Type of the result data
 *
 * @see https://getkirby.com/docs/reference/api
 *
 * @example
 * ```ts
 * // Typed KQL response for a page
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
 *   status: "error",
 *   message: "not found"
 *   // result is undefined for errors
 * };
 * ```
 */
export interface KirbyApiResponse<T = any> {
  /**
   * HTTP status code. An error whose code lies outside `400`–`599` is sent as
   * HTTP `500` but keeps its own code here.
   */
  code: number;
  status: "ok" | "error";
  /** Response data, present only on success. */
  result?: T;
  /**
   * Error message. Outside debug mode, an unexpected PHP error carries a
   * generic message instead of its own.
   */
  message?: string;
  /**
   * Error key of a Kirby exception, such as `error.page.notFound`, or `null`
   * for other exceptions.
   */
  key?: string | null;
  /**
   * Additional details of a Kirby exception, an empty array for other
   * exceptions.
   */
  details?: Record<string, any> | any[];
  /** Class name of the thrown exception, present only in debug mode. */
  exception?: string;
  /**
   * File that threw the exception, relative to the document root, present
   * only in debug mode.
   */
  file?: string;
  /** Line that threw the exception, present only in debug mode. */
  line?: number;
  /**
   * Route pattern that matched the request, `null` without one, present only
   * in debug mode.
   */
  route?: string | null;
}
