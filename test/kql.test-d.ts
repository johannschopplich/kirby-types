// Tests representative core types for `src/kql.d.ts` – not exhaustive.
import type { KirbyQueryRequest, KirbyQueryResponse } from "../src/kql";
import { expectAssignable, expectNotAssignable } from "tsd";

// #region Query Request & Response

interface KirbySite {
  title: string;
  children: { id: string; title: string; isListed: boolean }[];
}

expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: { title: true },
});

expectAssignable<KirbyQueryRequest>({
  query: "page.children.listed",
  select: ["id", "title", "slug", "content"],
});

// Nested queries
expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: ["id", "title", "isListed"],
    },
  },
});

// Nested query starting at a KQL object alias
expectAssignable<KirbyQueryRequest>({
  query: "page.layouts",
  select: { columns: { query: "layout.columns", select: ["width"] } },
});

// Pagination
expectAssignable<KirbyQueryRequest>({
  query: "site.children",
  select: { id: true, title: true },
  pagination: { limit: 10, page: 1 },
});

// Named queries
expectAssignable<KirbyQueryRequest>({
  queries: { site: "site", about: 'page("about")' },
});

// Response
expectAssignable<KirbyQueryResponse<KirbySite>>({
  code: 200,
  status: "ok",
  result: {
    title: "Site",
    children: [{ id: "home", title: "Home", isListed: true }],
  },
});

expectAssignable<KirbyQueryResponse<never>>({
  code: 404,
  status: "error",
  message: "not found",
});
// #endregion

// #region Negative Tests

expectNotAssignable<KirbyQueryResponse<never>>({
  code: 404,
  status: "Not Found",
});

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "some.children", // Invalid query root
      select: { id: true },
    },
  },
} as const);

// An alias takes no call.
expectNotAssignable<KirbyQueryRequest>({
  query: "page.layouts",
  select: { columns: { query: 'layout("x")', select: { width: true } } },
} as const);

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: { id: null }, // null is not allowed
    },
  },
} as const);
// #endregion
