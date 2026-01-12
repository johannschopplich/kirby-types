import type { KirbyQuery, ParseKirbyQuery } from "../src/query";
import { expectAssignable, expectNotAssignable, expectType } from "tsd";

// -----------------------------------------------------------------------------
// KIRBY QUERY TESTS
// -----------------------------------------------------------------------------

// --- 1. Basic Model Names ---

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

// --- 2. Simple Dot Notation ---

expectAssignable<KirbyQuery>("site.title");
expectAssignable<KirbyQuery>("page.slug");
expectAssignable<KirbyQuery>("user.email");
expectAssignable<KirbyQuery>("file.url");
expectAssignable<KirbyQuery>("kirby.version");

// --- 3. Basic Function Calls ---

expectAssignable<KirbyQuery>('page("notes")');
expectAssignable<KirbyQuery>('site("home")');
expectAssignable<KirbyQuery>('user("admin")');
expectAssignable<KirbyQuery>('file("image.jpg")');

// --- 4. Complex Query Chains ---

// Multiple chained methods
expectAssignable<KirbyQuery>('site.children.listed().sortBy("date", "desc")');
expectAssignable<KirbyQuery>('page.images.template("gallery").first()');
expectAssignable<KirbyQuery>('collection.filterBy("status", "published")');

// Complex parameter combinations
expectAssignable<KirbyQuery>('page.filterBy("date", ">=", "2023-01-01")');
expectAssignable<KirbyQuery>('collection.sortBy("title", "asc", "num")');
expectAssignable<KirbyQuery>("page.limit(10, 5)");

// Long query chains
expectAssignable<KirbyQuery>(
  'page("blog").children.filterBy("status", "published").sortBy("date").limit(10)',
);
expectAssignable<KirbyQuery>(
  'site.find("projects").children.listed.filterBy("featured", true).shuffle()',
);

// Very long chains (should work)
expectAssignable<KirbyQuery>(
  'site.children.listed().filterBy("template", "article").sortBy("date", "desc").limit(5).first()',
);

// Complex nested parameters
expectAssignable<KirbyQuery>(
  'page.children.filterBy("date", ">=", "2023-01-01").filterBy("status", "!=", "draft")',
);

// Mixed notation complexity
expectAssignable<KirbyQuery>(
  'page("blog").children.listed().filterBy("featured", true).sortBy("date").limit(10)',
);

// --- 5. Advanced Syntax Validation ---

// Mixed quotes in parameters
expectAssignable<KirbyQuery>('page("title").filterBy(\'status\', "published")');
expectAssignable<KirbyQuery>("site.find('notes').children");

// Numeric and boolean parameters
expectAssignable<KirbyQuery>('page.filterBy("featured", true)');
expectAssignable<KirbyQuery>('collection.filterBy("count", 5)');
expectAssignable<KirbyQuery>('page.filterBy("rating", ">=", 4.5)');

// Nested parentheses in parameters
expectAssignable<KirbyQuery>('page.filterBy("nested(test)", "value")');
expectAssignable<KirbyQuery>('site.find("page(with)parens").children');

// Complex parameter combinations
expectAssignable<KirbyQuery>(
  'page.filterBy("date", ">=", "2023-01-01 10:00:00")',
);
expectAssignable<KirbyQuery>(
  'collection.sortBy("title", "asc", "locale", "en_US")',
);
expectAssignable<KirbyQuery>("page.slice(0, 10)");

// Numbers in valid contexts
expectAssignable<KirbyQuery>("page.limit(10)");
expectAssignable<KirbyQuery>("page.offset(5)");
expectAssignable<KirbyQuery>('page.filterBy("count", 100)');

// --- 6. Custom Models ---

expectAssignable<KirbyQuery<"customModel">>("customModel");
expectAssignable<KirbyQuery<"customModel">>("customModel.cover");

// Union custom models
expectAssignable<KirbyQuery<"product" | "category">>("product.price");
expectAssignable<KirbyQuery<"product" | "category">>("category.name");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("product");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("category");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("brand");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("product.price");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("category.name");
expectAssignable<KirbyQuery<"product" | "category" | "brand">>("brand.logo");

// -----------------------------------------------------------------------------
// KIRBY QUERY PARSED TESTS
// -----------------------------------------------------------------------------

// --- 1. Basic Model Parsing ---

expectType<{ model: "site"; chain: [] }>({} as ParseKirbyQuery<"site">);

expectType<{ model: "page"; chain: [] }>({} as ParseKirbyQuery<"page">);

expectType<{ model: "user"; chain: [] }>({} as ParseKirbyQuery<"user">);

// --- 2. Dot Notation Parsing ---

expectType<{
  model: "site";
  chain: [{ type: "property"; name: "title" }];
}>({} as ParseKirbyQuery<"site.title">);

expectType<{
  model: "page";
  chain: [
    { type: "property"; name: "children" },
    { type: "property"; name: "listed" },
  ];
}>({} as ParseKirbyQuery<"page.children.listed">);

// --- 3. Method Call Parsing ---

expectType<{
  model: "page";
  chain: [{ type: "method"; name: "page"; params: '"notes"' }];
}>({} as ParseKirbyQuery<'page("notes")'>);

expectType<{
  model: "site";
  chain: [{ type: "method"; name: "site"; params: '"home"' }];
}>({} as ParseKirbyQuery<'site("home")'>);

// --- 4. Complex Chain Parsing ---

// Simple chain parsing (this works)
expectType<{
  model: "page";
  chain: [
    { type: "property"; name: "children" },
    { type: "method"; name: "filterBy"; params: '"status", "published"' },
  ];
}>({} as ParseKirbyQuery<'page.children.filterBy("status", "published")'>);

// --- 5. Custom Model Parsing ---

expectType<{ model: "customModel"; chain: [] }>(
  {} as ParseKirbyQuery<"customModel", "customModel">,
);

expectType<{
  model: "customModel";
  chain: [{ type: "property"; name: "cover" }];
}>({} as ParseKirbyQuery<"customModel.cover", "customModel">);

// --- 6. Invalid Queries (should return never) ---

expectType<never>({} as ParseKirbyQuery<"unknown">);

// Note: Some edge cases still parse but create empty/invalid segments
// The validation happens at the KirbyQuery level, not ParseKirbyQuery level

// -----------------------------------------------------------------------------
// NEGATIVE TESTS (INVALID QUERIES)
// -----------------------------------------------------------------------------

// Note: Complex syntax validation (unmatched quotes, unbalanced parentheses,
// double dots, trailing dots, empty segments) is not feasible with TypeScript's
// template literal type system limitations. We focus on model name validation.

// --- 1. Invalid Model Names ---

expectNotAssignable<KirbyQuery>("unknown");
expectNotAssignable<KirbyQuery>("invalidModel");
expectNotAssignable<KirbyQuery>("Site"); // Case sensitive
expectNotAssignable<KirbyQuery>(""); // Empty string

// --- 2. Custom Model Validation ---

expectNotAssignable<KirbyQuery<"customModel">>("otherModel");
expectNotAssignable<KirbyQuery<"customModel">>("unknownModel");
expectNotAssignable<KirbyQuery<"product" | "category">>("brand");
expectNotAssignable<KirbyQuery<"product" | "category">>("unknown");
