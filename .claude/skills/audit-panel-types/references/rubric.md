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
- K6 plugin shape (Vue 3 `App` / `Plugin` / `ConcreteComponent`): kirby-types stays Vue 2 until Kirby 6 ships. Record as drift only.

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
- **`@source` carries provenance.** One `@source <file>` per authoritative file on the wrapping interface. File-only paths, no `:line` suffix. Children inherit; never duplicate a parent's path. No `@see` – source URLs rot.

## When Kirby 6 leaves RC

Drop the Vue-2 deferral in "K6 evidence rules" and treat K6 TS as a co-authority with PHP. Clear `@since 6` tags introduced as forward signals; convert lingering K5-only `@deprecated` notes into deletions.
