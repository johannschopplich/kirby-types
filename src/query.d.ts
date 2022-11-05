// https://github.com/getkirby/kql/blob/4c8cdd88c076cdef5323efcd4f0fda38c0865eed/src/Kql/Kql.php#L73
export type KirbyQueryModel<CustomModel extends string = never> =
  | "collection"
  | "file"
  | "kirby"
  | "page"
  | "site"
  | "user"
  | CustomModel;

export type KirbyQuery<CustomModel extends string = never> =
  | KirbyQueryModel<CustomModel>
  | `${KirbyQueryModel<CustomModel>}.${string}`
  | `${KirbyQueryModel<CustomModel>}(${string})${string}`;
