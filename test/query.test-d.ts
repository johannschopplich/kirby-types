import type { KirbyQuery, ParseKirbyQuery } from "../src/query";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// -----------------------------------------------------------------------------
// 1. Query Validation
// -----------------------------------------------------------------------------

// Basic model names
expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>("page");
expectAssignable<KirbyQuery>("user");
expectAssignable<KirbyQuery>("file");
expectAssignable<KirbyQuery>("collection");
expectAssignable<KirbyQuery>("kirby");
expectAssignable<KirbyQuery>("content");
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

// Function calls
expectAssignable<KirbyQuery>('page("notes")');
expectAssignable<KirbyQuery>('site("home")');
expectAssignable<KirbyQuery>('user("admin")');
expectAssignable<KirbyQuery>('file("image.jpg")');

// Complex chains
expectAssignable<KirbyQuery>('site.children.listed().sortBy("date", "desc")');
expectAssignable<KirbyQuery>('page.images.template("gallery").first()');
expectAssignable<KirbyQuery>('collection.filterBy("status", "published")');
expectAssignable<KirbyQuery>('page.filterBy("date", ">=", "2023-01-01")');
expectAssignable<KirbyQuery>(
  'page("blog").children.filterBy("status", "published").sortBy("date").limit(10)',
);

// Custom models
expectAssignable<KirbyQuery<"customModel">>("customModel");
expectAssignable<KirbyQuery<"customModel">>("customModel.cover");
expectAssignable<KirbyQuery<"product" | "category">>("product.price");

// -----------------------------------------------------------------------------
// 2. Query Parsing
// -----------------------------------------------------------------------------

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

expectType<{ model: "customModel"; chain: [] }>(
  {} as ParseKirbyQuery<"customModel", "customModel">,
);

// Invalid queries return never
expectType<never>({} as ParseKirbyQuery<"unknown">);

// -----------------------------------------------------------------------------
// 3. Negative Tests
// -----------------------------------------------------------------------------

expectNotAssignable<KirbyQuery>("unknown");
expectNotAssignable<KirbyQuery>("invalidModel");
expectNotAssignable<KirbyQuery>("Site"); // Case sensitive
expectNotAssignable<KirbyQuery>(""); // Empty string
expectNotAssignable<KirbyQuery<"customModel">>("otherModel");
expectNotAssignable<KirbyQuery<"product" | "category">>("brand");
