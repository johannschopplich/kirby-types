import type { KirbyQueryRequest, KirbyQueryResponse } from "../src/kql";
import { expectAssignable, expectNotAssignable } from "tsd";

// -----------------------------------------------------------------------------
// KQL TESTS
// -----------------------------------------------------------------------------

interface KirbySite {
  title: string;
  children: {
    id: string;
    title: string;
    isListed: boolean;
  }[];
}

// --- 1. Basic Query Requests ---

expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    title: true,
  },
});

expectAssignable<KirbyQueryRequest>({
  query: "page.children.listed",
  select: ["id", "title", "slug", "content"],
});

// --- 2. Nested Query Requests ---

expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: ["id", "title", "isListed"],
    },
  },
});

expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: {
        id: true,
        title: true,
        isListed: "page.isListed",
      },
    },
  },
});

// --- 3. Pagination ---

expectAssignable<KirbyQueryRequest>({
  query: "site.children",
  select: {
    id: true,
    title: true,
  },
  pagination: {
    limit: 10,
    page: 1,
  },
});

expectAssignable<KirbyQueryRequest>({
  query: "page.children",
  select: ["title", "slug"],
  pagination: {
    limit: 5,
  },
});

// --- 4. Query Response Tests ---

expectAssignable<KirbyQueryResponse<KirbySite>>({
  code: 200,
  status: "OK",
  result: {
    title: "Site",
    children: [
      {
        id: "home",
        title: "Home",
        isListed: true,
      },
    ],
  },
});

// Error response
expectAssignable<KirbyQueryResponse<never>>({
  code: 404,
  status: "Not Found",
});

// -----------------------------------------------------------------------------
// NEGATIVE TESTS (INVALID KQL)
// -----------------------------------------------------------------------------

// --- 1. Invalid Query Models ---

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "some.children", // Invalid query model
      select: {
        id: true,
      },
    },
  },
});

// --- 2. Invalid Select Values ---

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: {
        id: null, // null is not allowed
      },
    },
  },
});
