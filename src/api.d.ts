export interface KirbyApiResponse<T = any> {
  code: number;
  status: string;
  result?: T;
}
