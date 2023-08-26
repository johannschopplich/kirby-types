import { expectAssignable, expectNotAssignable } from "tsd";
import type { KirbyQuery } from "../src/query";

expectAssignable<KirbyQuery>("site");
expectAssignable<KirbyQuery>("site.title");
expectAssignable<KirbyQuery>('page("notes")');
expectAssignable<KirbyQuery>('page.children.filterBy("featured", true)');
expectAssignable<KirbyQuery>(
  'site.find("notes").children.listed.filterBy("tags", "ocean", ",")',
);
expectAssignable<KirbyQuery>('page.images.template("image")');
expectAssignable<KirbyQuery<"customModel">>("customModel.cover");

expectNotAssignable<KirbyQuery>("unknown"); // Not a valid model
expectNotAssignable<KirbyQuery>('site("'); // Empty parentheses
expectNotAssignable<KirbyQuery>('site("value"'); // Missing closing parenthesis
