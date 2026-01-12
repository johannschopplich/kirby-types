import type { KirbyQueryRequest, KirbyQueryResponse } from "../src/kql";
import { expectAssignable, expectNotAssignable } from "tsd";

// -----------------------------------------------------------------------------
// 1. Query Request & Response
// -----------------------------------------------------------------------------

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

// Pagination
expectAssignable<KirbyQueryRequest>({
  query: "site.children",
  select: { id: true, title: true },
  pagination: { limit: 10, page: 1 },
});

// Response
expectAssignable<KirbyQueryResponse<KirbySite>>({
  code: 200,
  status: "OK",
  result: {
    title: "Site",
    children: [{ id: "home", title: "Home", isListed: true }],
  },
});

expectAssignable<KirbyQueryResponse<never>>({
  code: 404,
  status: "Not Found",
});

// -----------------------------------------------------------------------------
// 2. Negative Tests
// -----------------------------------------------------------------------------

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "some.children", // Invalid query model
      select: { id: true },
    },
  },
});

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: { id: null }, // null is not allowed
    },
  },
});
