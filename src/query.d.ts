// https://github.com/getkirby/kql/blob/4c8cdd88c076cdef5323efcd4f0fda38c0865eed/src/Kql/Kql.php#L73
export type KirbyQueryModel =
  | "collection"
  | "file"
  | "kirby"
  | "page"
  | "site"
  | "user"
  | "arrayItem"
  | "structureItem"
  | "block"
  | (string & Record<never, never>);

export type KirbyQuery =
  | KirbyQueryModel
  | `${KirbyQueryModel}.${string}`
  | `${KirbyQueryModel}(${string})${string}`;
