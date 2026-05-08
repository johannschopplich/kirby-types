# Rubric

Pasted verbatim into both agent prompts.

## Authority order

**PHP `toArray()` / `props()` > K6 TS > K5 JS.**

PHP is the response-shape contract for everything Features render. K6 TS is the modern type-safe runtime – stronger evidence than K5 JS for method signatures, new symbols, and narrowed unions. K5 JS is the legacy runtime and only wins when PHP and K6 are silent (e.g. helpers K6 hasn't migrated, the API client where K5 and K6 are byte-identical).

K6 TS is **evidence-strength, not absolute**. PHP overruled K6 in 4 of 39 cases on the last run. Examples:

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
- **K6 plugin shape** (Vue 3 `App` / `Plugin` / `ConcreteComponent`) is recorded as drift only. kirby-types stays Vue 2 augmentation.

## Escape hatch

If you cannot locate PHP source confirming runtime nullability, DEFER any nullable widening and emit a `soft` finding. Never widen on JS evidence alone.
