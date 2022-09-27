import { expectAssignable, expectNotAssignable } from "tsd";
import type { KirbyQueryRequest, KirbyQueryResponse } from "./kql";

interface KirbySite {
  title: string;
  children: {
    id: string;
    title: string;
    isListed: boolean;
  }[];
}

/**
 * KQL Query Request
 */

expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    title: true,
  },
});

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

expectNotAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    children: {
      query: "site.children",
      select: {
        id: null,
      },
    },
  },
});

/**
 * KQL Query Response
 */

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
