// https://github.com/getkirby/kql/blob/66abd20093e5656b0f7e6f51ee04f630ab38f2a3/src/Kql/Kql.php#L73
export type KirbyQueryModel<T extends string = never> =
  | "collection"
  | "file"
  | "kirby"
  | "page"
  | "site"
  | "user"
  | T;

export type KirbyQuery<T extends string = never> =
  | KirbyQueryModel<T>
  | `${KirbyQueryModel<T>}.${string}`
  | `${KirbyQueryModel<T>}(${string})`;
