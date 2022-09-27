import { expectAssignable, expectNotAssignable } from "tsd";
import type { KirbyQuery } from "./query";

expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>('kirby.page("about")');
expectAssignable<KirbyQuery>('collection("notes")');
expectAssignable<KirbyQuery<"custom">>("custom");
expectAssignable<KirbyQuery<"custom">>("custom.cover");
expectNotAssignable<KirbyQuery>("kirby(");
expectNotAssignable<KirbyQuery>('kirby("about');
