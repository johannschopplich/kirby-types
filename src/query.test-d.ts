import { expectAssignable, expectNotAssignable } from "tsd";
import type { KirbyQuery } from "./query";

expectAssignable<KirbyQuery>("collection");
expectAssignable<KirbyQuery>("file");
expectAssignable<KirbyQuery>("kirby");
expectAssignable<KirbyQuery>("page");
expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>("user");
expectAssignable<KirbyQuery>('collection("notes")');
expectAssignable<KirbyQuery>('kirby.page("notes")');
expectAssignable<KirbyQuery>('page("notes").children.listed');
expectAssignable<KirbyQuery<"customModel">>("customModel");
expectAssignable<KirbyQuery<"customModel">>("customModel.cover");

expectNotAssignable<KirbyQuery>("kirby(");
expectNotAssignable<KirbyQuery>("kirby)");
expectNotAssignable<KirbyQuery>('kirby("about');
