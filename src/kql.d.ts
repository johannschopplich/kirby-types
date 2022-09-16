import type { KirbyQuery } from "./query";

export interface KirbyQueryRequest {
  query: KirbyQuery;
  select?: Record<string, any> | string[];
  pagination?: {
    /** @default 100 */
    limit?: number;
    page?: number;
  };
}

export interface KirbyQueryResponse<
  T = any,
  Pagination extends boolean = false
> {
  code: number;
  status: string;
  result?: Pagination extends true
    ? {
        data: T;
        pagination: {
          page: number;
          pages: number;
          offset: number;
          limit: number;
          total: number;
        };
      }
    : T;
}
