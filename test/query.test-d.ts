// Tests representative core types for `src/query.d.ts` – not exhaustive.
import type { KirbyQuery, ParseKirbyQuery } from "../src/query";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// #region Query Validation

// Bare roots
expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>("page");
expectAssignable<KirbyQuery>("user");
expectAssignable<KirbyQuery>("users");
expectAssignable<KirbyQuery>("file");
expectAssignable<KirbyQuery>("kirby");
expectAssignable<KirbyQuery>("model");
expectAssignable<KirbyQuery>("item");
expectAssignable<KirbyQuery>("arrayItem");
expectAssignable<KirbyQuery>("structureItem");
expectAssignable<KirbyQuery>("block");

// Dot notation
expectAssignable<KirbyQuery>("site.title");
expectAssignable<KirbyQuery>("page.slug");
expectAssignable<KirbyQuery>("user.email");
expectAssignable<KirbyQuery>("file.url");
expectAssignable<KirbyQuery>("kirby.version");
expectAssignable<KirbyQuery>("page?.title");

// Operators
expectAssignable<KirbyQuery>("page ?? site");

// Function calls
expectAssignable<KirbyQuery>('page("notes")');
expectAssignable<KirbyQuery>('user("admin")');
expectAssignable<KirbyQuery>('file("image.jpg")');

// Complex chains
expectAssignable<KirbyQuery>('site.children.listed().sortBy("date", "desc")');
expectAssignable<KirbyQuery>('page.images.template("gallery").first()');
expectAssignable<KirbyQuery>(
  'collection("articles").filterBy("status", "published")',
);
expectAssignable<KirbyQuery>(
  'page.children.filterBy("date", ">=", "2023-01-01")',
);
expectAssignable<KirbyQuery>(
  'page("blog").children.filterBy("status", "published").sortBy("date").limit(10)',
);

// Custom roots
expectAssignable<KirbyQuery<"customModel">>("customModel");
expectAssignable<KirbyQuery<"customModel">>("customModel.cover");
expectAssignable<KirbyQuery<"product" | "category">>("product.price");
// #endregion

// #region Query Parsing

expectType<{ model: "site"; chain: [] }>({} as ParseKirbyQuery<"site">);
expectType<{ model: "page"; chain: [] }>({} as ParseKirbyQuery<"page">);

expectType<{
  model: "site";
  chain: [{ type: "property"; name: "title" }];
}>({} as ParseKirbyQuery<"site.title">);

expectType<{
  model: "page";
  chain: [{ type: "method"; name: "page"; params: '"notes"' }];
}>({} as ParseKirbyQuery<'page("notes")'>);

expectType<{
  model: "page";
  chain: [
    { type: "method"; name: "page"; params: '"blog"' },
    { type: "property"; name: "children" },
  ];
}>({} as ParseKirbyQuery<'page("blog").children'>);

expectType<{ model: "customModel"; chain: [] }>(
  {} as ParseKirbyQuery<"customModel", "customModel">,
);

// Invalid queries return never
expectType<never>({} as ParseKirbyQuery<"unknown">);
expectType<never>({} as ParseKirbyQuery<'model("x")'>);
// #endregion

// #region Negative Tests

expectNotAssignable<KirbyQuery>("unknown");
expectNotAssignable<KirbyQuery>("invalidModel");
expectNotAssignable<KirbyQuery>("Site"); // Case sensitive
expectNotAssignable<KirbyQuery>(""); // Empty string
expectNotAssignable<KirbyQuery>("content");
expectNotAssignable<KirbyQuery>('model("x")'); // Not callable
expectNotAssignable<KirbyQuery>("collection"); // Only works as a call
expectNotAssignable<KirbyQuery>("t.foo");
expectNotAssignable<KirbyQuery<"customModel">>("otherModel");
expectNotAssignable<KirbyQuery<"product" | "category">>("brand");
// #endregion
