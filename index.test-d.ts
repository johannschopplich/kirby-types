import { expectAssignable, expectNotAssignable } from "tsd";
import type { KirbyQuery, KirbyQueryRequest, KirbyQueryResponse } from ".";

interface KirbySite {
  title: string;
  children: {
    id: string;
    title: string;
    isListed: boolean;
  }[];
}

// Query
expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>('kirby.page("about")');
expectAssignable<KirbyQuery>('collection("notes")');
expectAssignable<KirbyQuery<"custom">>("custom");
expectAssignable<KirbyQuery<"custom">>("custom.cover");
expectNotAssignable<KirbyQuery>("kirby(");
expectNotAssignable<KirbyQuery>('kirby("about');

// KQL Query Request
expectAssignable<KirbyQueryRequest>({
  query: "site",
  select: {
    title: true,
    children: {
      query: "site.children",
      select: {
        id: true,
        title: true,
        isListed: true,
      },
    },
  },
});

// KQL Query Response
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
