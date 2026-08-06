# Rubric

## Authority order

**PHP `toArray()` / `props()` > K6 TS > K5 JS.**

PHP is the response-shape contract for everything Features render. K6 TS is the modern type-safe runtime – stronger evidence than K5 JS for method signatures, new symbols, narrowed unions. K5 JS only wins when PHP and K6 are silent.

K6 TS is **evidence-strength, not absolute**. PHP overrules K6 when they disagree:

- `PanelSystem.csrf` – K6 typed `string | null`, PHP `csrfFromSession()` always returns `string`. Keep `string`.
- `PanelLanguageInfo.slugs` – K6 typed `string[]`, PHP emits `Record<string, string>`. Keep the record.

## Anti-pattern: defaults-as-runtime fallacy

JS `defaults()` is bootstrap state, not runtime contract. Cite PHP for nullability claims. Never widen a property to `T | null` on JS evidence alone.

## Finding categories

- **drift** – K5 ↔ K6 source differs in a way that affects runtime shape. Informational; gates whether K6 type is safe to learn from.
- **learnFrom** – K6 type is stricter or clearer AND PHP and K5 confirm the shape is identical for both versions. Safe-to-backport candidate.
- **renameCandidate** – K6 uses a different name that better reflects intent. Surface for the user gate; never auto-applied.
- **missing** – public Kirby member not represented in TS.
- **redundant** – TS member without runtime backing.
- **signatureMismatch** – wrong arity, param types, or return type.
- **soft** – JSDoc shape narrower than `any` / `Record<string, any>` widening allows; lower severity.

## Skip – never report

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc on either side
- Test-only references (`*.test.{js,ts}`)
- Inherited `*Defaults` members on the wrapping state interface. State interfaces extend their Defaults via intersection (e.g. `PanelUser extends PanelState<PanelUserDefaults>, PanelUserDefaults`); the Defaults interface is the declaration site. Never duplicate the property+JSDoc pair onto the state interface during ACT.

## Intentional looseness – note, do not flag or widen

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for dynamic backend response data
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by `LC_*` constants, blueprint-driven view tabs)
- Feature/State properties whose JS `defaults()` returns `null` but whose PHP response always sets a value (e.g. `PanelView.path`, `PanelSystem.csrf`, `PanelTranslation.code`). Type is non-nullable; do not re-widen on JS evidence.

## K6 evidence rules

- Drop K6's `Prettify<T>` wrappers. IDE hover aid only, no runtime constraint.
- `type TODO = any` in K6 means "K6 has no opinion". Skip – not learnFrom, not drift.
- Keep `Record<string, any>` unless K6 narrows to `Record<string, unknown>` with shape evidence, not stylistic.
- K6 plugin shape (Vue 3 `App` / `Plugin` / `ConcreteComponent`): kirby-types stays Vue 2 until Kirby 6 SHIPS (published, not alpha/beta/RC). Record as drift only. This is the ONLY thing the Vue-2 hold covers – everything else in the migrated K6 TS is already usable as learnFrom evidence now.
- **`@since` needs git from a full-history checkout.** Never assign a version from a topology hint. `git log -S <symbol>` for the introducing commit, then `git tag --contains <commit> | grep -E '^[0-9]' | sort -V | head -1` for the earliest release. Run this against a **full-history** root: a shallow clone (probe raises a `SHALLOW-HISTORY` flag) whose oldest tag is the current release mis-dates every earlier member to that release. When the K5 root is shallow, date against the full-history K6 checkout (tags back to 3.x) or `gh` upstream instead. Confirmed-K6-only (git-verified): `panel.html`/`HtmlString` (6.0.0). Confirmed-earlier: `removeEventListener(s)` (5.5.0), `hasPrevious` (5.5.0 – the History→helper migration added it; absent at 5.4.x), `string.sanitizeHTML` (5.5.0), `helper.writer` (5.5.0). A member present since the 4.0.0 baseline carries **no** property-level `@since` – baseline tags live only on module/interface docblocks; do not add `@since 4.0.0` to a property, drop the tag.

## K6-only members

Pull K6-only members (present in K6 source, absent in K5) into TS now with the `@since 6` JSDoc tag. The IDE surfaces the tag on hover; K5 runtime is the consumer's responsibility.

- `@since 6` goes at the end of the JSDoc block, after `@param` / `@returns`.
- Optionality mirrors the K6 source. Don't auto-widen to optional to "stay K5-safe".
- K5-only members that K6 dropped or renamed: `@deprecated` with a one-line note pointing at the K6 replacement.
- DEFER the Vue-3 plugin shape (`App` / `Plugin` / `ConcreteComponent` in `index-panel`) – Vue-version migration, not a K5/K6 split.

## Escape hatch

If you cannot locate PHP source confirming runtime nullability, DEFER any nullable widening and emit a `soft` finding. Never widen on JS evidence alone.

## JSDoc style

- **Body describes runtime behavior.** What a plugin author observes. PHP/JS class names, `Foo::bar()` references, factory names, controller names, internal property names (`$actions`/`$defaults`), file paths – none belong in JSDoc prose.
- **A doc that repeats the name and the type is not written.** `/** Icon name */` above `icon?: string` earns nothing, and neither does `/** Files API */` above `files: PanelApiFiles`. Add the member bare. That an editor shows the doc on hover is a reason to write one worth reading, not a reason to write one at all.
- **Prose ends with a period**, one line or twenty: `/** Text shown after the input. */`. A block-tag description that continues the signature ends at its last word and takes none – `@param event - Event name to listen for`, `@since 6`, `@source panel/src/panel/state.ts`. Once a tag's text runs to a sentence it is prose and is punctuated as prose, which is why `@deprecated` notes take the period.
- **Callables open with a third-person verb, everything else takes a noun phrase.** `key: () => string` gets "Returns the state key identifier."; `timestamp: number | null` gets "Timestamp from the backend for cache invalidation." A function-typed property is a callable and takes the verb.
- **Bulleted lists** completing a colon lead-in are punctuated once, on the last item. Items keyed by a label are independent descriptions and each take a period. A list of literal values under a label is verbatim and takes none.
- **Sections are `// #region Name` … `// #endregion`,** never a rule-line banner and never a bare label. Regions nest – `WriterUtils` and `PanelEvents` group members inside an interface that way.
- **`@source` carries provenance.** One `@source <file>` per authoritative file on the wrapping interface. File-only paths, no `:line` suffix. Children inherit; never duplicate a parent's path. No `@see` – source URLs rot. A **phantom `@source`** cites a `.js` the source map marks migrated to `.ts`: replace it, don't dual-source. Dual-source only when the map shows both a K5 `.js` and a K6 `.ts` genuinely exist.

## When Kirby 6 ships (probe posture flag)

`probe.mjs` raises a `RE-CONFIRM` posture flag when K6's version loses its `-alpha`/`-beta`/`-rc` suffix. On the user's confirmation: release **the Vue-2 hold** (adopt the Vue-3 plugin shape in `index-panel`) and treat K6 TS as co-authority with PHP. Clear `@since 6` tags introduced as forward signals; convert lingering K5-only `@deprecated` notes into deletions. When the map reports the K5 root absent, retire the K5-JS half of each cluster and the `<KIRBY_K5_ROOT>` argument.
