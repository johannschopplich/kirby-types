// https://github.com/getkirby/kql/blob/4c8cdd88c076cdef5323efcd4f0fda38c0865eed/src/Kql/Kql.php#L73
export type KirbyQueryModel<CustomModel extends string = never> =
  | "collection"
  | "file"
  | "kirby"
  | "page"
  | "site"
  | "user"
  | "arrayItem"
  | "structureItem"
  | "block"
  | CustomModel;

type KirbyChainQuery =
  // Allows for `site.title` but also `site.title.upper`, etc.
  | `${string}.${string}`
  // Allows for `page("id")<string>`, etc.
  | `${string}(${string})${string}`;

export type KirbyQuery<CustomModel extends string = never> =
  | KirbyQueryModel<CustomModel>
  // Ensures that it must match the pattern exactly, but not more broadly
  | (string extends KirbyChainQuery ? never : KirbyChainQuery);
