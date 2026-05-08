# Rubric

## Authority order

**PHP `toArray()` / `props()` > K6 TS > K5 JS.**

PHP is the response-shape contract for everything Features render. K6 TS is the modern type-safe runtime – stronger evidence than K5 JS for method signatures, new symbols, and narrowed unions. K5 JS is the legacy runtime and only wins when PHP and K6 are silent (e.g. helpers K6 hasn't migrated, the API client where K5 and K6 are byte-identical).

Agents are read-only on sources; Write is permitted only to the supplied JSON output path, before returning.

K6 TS is **evidence-strength, not absolute**. PHP overrules K6 when they disagree. Examples:

- `PanelSystem.csrf` – K6 typed `string | null`, but PHP's `csrfFromSession()` always returns `string`. Kept `string`.
- `PanelLanguageInfo.slugs` – K6 typed `string[]`, but PHP emits `Record<string, string>`. Kept the record.

## Anti-pattern: defaults-as-runtime fallacy

Citing a JS `defaults()` return value as evidence that a property is nullable at runtime. JS defaults are bootstrap state; the PHP response shape is the runtime contract. Do not widen a property to `T | null` on JS evidence alone.

```
Not: "PanelView.path is `string | null` because feature.js defaults() returns null."
Yes: "PanelView.path is `string` – View.php (Str::after, always returns string) sets it on every response."
```

## Finding categories

- **drift** – K5 ↔ K6 source differs in a way that affects runtime shape. Informational; gates whether K6 type is safe to learn from.
- **learnFrom** – K6 type is stricter or clearer AND PHP and K5 confirm the shape is identical for both versions. Safe-to-backport candidate.
- **renameCandidate** – K6 uses a different name that better reflects intent. Surface for user approval (see [renames.md](renames.md)).
- **missing** – public Kirby member not represented in TS.
- **redundant** – TS member without runtime backing.
- **signatureMismatch** – wrong arity, param types, or return type.
- **soft** – JSDoc shape narrower than `any` / `Record<string, any>` widening allows; lower severity.

## Skip – never report

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc on either side
- Test-only references (`*.test.{js,ts}`)

## Intentional looseness – note, do not flag

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for dynamic backend response data
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by `LC_*` constants, blueprint-driven view tabs)

## Intentional non-nullability – note, do not widen

Feature/State properties whose JS `defaults()` returns `null` but whose PHP response always sets a value (e.g. `PanelView.path`, `PanelSystem.csrf`, `PanelTranslation.code`). Type is non-nullable; do not re-widen on JS evidence.

## K6 evidence rules

- **Drop K6's `Prettify<T>` wrappers.** IDE hover-card aid only, no runtime constraint.
- **`type TODO = any` in K6** (defined in `panel/src/types/global.d.ts`) means "K6 has no opinion". Skip TODO occurrences – not learnFrom, not drift.
- **Keep `Record<string, any>`** unless K6 narrows to `Record<string, unknown>` _with shape evidence_, not stylistic.
- **K6 plugin shape** (Vue 3 `App` / `Plugin` / `ConcreteComponent`): kirby-types augments Vue 2 until Kirby 6 ships; record K6 plugin Vue-3 shape as drift only.

## K6-only members

K6-only methods/fields (present in K6 source, absent in K5) are **pulled in now** with the `@since 6` JSDoc tag. The plugin author's IDE shows the tag in hover; runtime behavior on K5 is the consumer's responsibility.

- **Tag, not prose prefix.** Add `@since 6` at the end of the JSDoc block (after `@param` / `@returns`). Body prose describes what the member does; do not prefix it with "K6 only:".
- **Optionality follows the K6 source.** If K6 declares the member optional (`?:`), mirror that. If K6 declares it required, keep it required – do NOT auto-widen to optional just to "stay K5-safe".
- **K5-only members K6 dropped or renamed**: tag with `@deprecated` and explain the K6 replacement. Examples: `PanelMenu.entries` (K6 renamed to `items`), `PanelHelpersLink.preview` (K6 dropped from default export), `PanelState.validateState` (K6 inlined into `set()`).
- **Genuinely-legacy Vue-2 bridge** already tagged `@deprecated` (e.g. `PanelDialog.legacy`, `ref`, `openComponent`) – keep the tag; revise the prose to drop redundant "K5 only:" prefixes.
- **Examples that ACT under this rule**: `PanelContent.unlock`, `PanelContent.renewLock` get `@since 6`; `PanelUrls.panel?`, `PanelMenuEntry.icon` (K6-emitted optionals) also get `@since 6`.

This rule supersedes the older "DEFER K6-only methods" guidance. The only K6 surface that still DEFERs is the **Vue-3 plugin shape** (App/Plugin/ConcreteComponent in `index-panel`) – that's a Vue-version migration, not a K5/K6 split.

## Escape hatch

If you cannot locate PHP source confirming runtime nullability, DEFER any nullable widening and emit a `soft` finding. Never widen on JS evidence alone.
