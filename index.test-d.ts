import { expectAssignable, expectNotAssignable } from "tsd";
import type {
  KirbyBlock,
  KirbyQuery,
  KirbyQueryRequest,
  KirbyQueryResponse,
} from ".";

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

// Blocks
expectAssignable<KirbyBlock<"text">>({
  content: { text: "Hello World" },
  id: "1",
  isHidden: false,
  type: "text",
});
expectAssignable<KirbyBlock<"custom", { foo: string }>>({
  content: { foo: "Hello World" },
  id: "1",
  isHidden: false,
  type: "custom",
});

// KQL Query Request
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
