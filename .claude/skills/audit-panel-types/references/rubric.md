# Rubric

## Lines

Each kirby-types branch types one Kirby release line. Its Kirby majors and `@since` baseline live in `scripts/lines.mjs`, and the probe copies them into the source map.

| Branch         | Package | Plugin shape |
| -------------- | ------- | ------------ |
| `main`         | v1.x    | Vue 2.7      |
| `feat/kirby-6` | v2      | Vue 3        |

Types and docs describe the line's **latest release** and nothing beyond it: a member another line adds, removes, or reshapes belongs to that line's branch. Until the line's first stable release, its develop branch stands in for the latest release; a prerelease tag is no release. An older release of the line shows only as `@since` on a member or declaration it lacked. The latest release's shape is the whole type:

- A member a later release removed is deleted.
- A member the latest release always sets is required, even where older releases omitted it.
- A value only an older release returns leaves the union.
- The prose names no version.
- A member the latest release deprecates keeps `@deprecated` with what to use instead, or what happens without it; a member it accepts but ignores is deleted.

## Authority order

**PHP `toArray()` / `props()` > Panel source.**

PHP is the response-shape contract for everything Features render. Panel TS is the type-safe runtime – stronger evidence than Panel JS for method signatures, narrowed unions, new symbols.

Panel TS is **evidence-strength, not absolute**. PHP overrules it when they disagree:

- `PanelSystem.csrf` – the Panel TS types `string | null`, PHP `csrfFromSession()` always returns `string`. Keep `string`.
- `PanelSystem.slugs` – the Panel TS types `string[]`, PHP emits `Record<string, string>`. Keep the record.

## Anti-pattern: defaults-as-runtime fallacy

For a property PHP fills, JS `defaults()` is bootstrap state, not runtime contract. Cite PHP for its nullability and never widen it to `T | null` on JS evidence alone: `PanelView.path` and `PanelTranslation.code` stay non-nullable. A browser-only property takes its nullability from the latest release's Panel source. Without PHP evidence for a nullability, DEFER the widening.

## Finding categories

- **tighten**: the Panel's own TS type is stricter or clearer than ours AND PHP confirms the shape. Adopt it, unless it rejects a value the runtime accepts: `PanelComponentExtension.extends` keeps taking a `DefineComponent`.
- **renameCandidate**: the source uses a different name that better reflects intent. Surface for the user gate; never auto-applied. An approved rename replaces the name outright: the old name leaves the types.
- **missing**: public Kirby member not represented in TS.
- **redundant**: TS member without runtime backing.
- **signatureMismatch**: wrong arity, param types, or return type, or a doc naming a shape the type rejects.
- **soft**: JSDoc shape narrower than `any` / `Record<string, any>` widening allows; lower severity.

## Skip – never report

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc
- Test-only references (`*.test.{js,ts}`)
- Inherited members: a declaration that extends another is reviewed only for what it adds or overrides.
- A state interface's `*Defaults` members live on the Defaults interface, their declaration site (`PanelUser extends PanelState<PanelUserDefaults>, PanelUserDefaults`); ACT adds a property and its JSDoc there only.

## Intentional looseness – note, do not flag or widen

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for dynamic backend response data
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by `LC_*` constants, blueprint-driven view tabs)

## Panel TS evidence

- Drop `Prettify<T>` wrappers.
- `type TODO = any` means "Kirby has no opinion". Skip it.
- Keep `Record<string, any>` unless the source narrows to `Record<string, unknown>` with shape evidence, not stylistic.

## `@since`

- **Git from a full-history root.** Never assign a version from a topology hint. `git log -S <symbol>` for the introducing commit, then `git tag --contains <commit> | grep -E '^[0-9]' | sort -V | head -1` for the earliest release. Read the file at that tag and at the previous release tag (`git show <tag>:<path>`) before writing the version: a patch release often carries the change (`5.4.1`, not `5.4.0` or `5.5.0`). A prerelease tag, or an untagged commit on the develop branch standing in for the latest release, dates to its release: a member first tagged `6.0.0-alpha.2` is present at the 6.0.0 baseline.
- **Nothing present at the line's baseline carries `@since`.**
- **`@since` dates a member's or declaration's introduction.**

## JSDoc style

- **Body describes runtime behavior.** What a plugin author observes. PHP/JS class names, `Foo::bar()` references, factory names, controller names, internal property names (`$actions`/`$defaults`), file paths – none belong in JSDoc prose.
- **A doc that repeats the name and the type is not written.** `/** Icon name */` above `icon?: string` earns nothing, and neither does `/** Files API */` above `files: PanelApiFiles`. Add the member bare.
- **Prose ends with a period**, one line or twenty: `/** Text shown after the input. */`. A block-tag description that continues the signature ends at its last word and takes none – `@param event - Event name to listen for`, `@since 5.5.0`, `@source panel/src/panel/state.ts`. Once a tag's text runs to a sentence it is prose and is punctuated as prose.
- **Values take backticks wherever a doc names them** – body, `@param`, `@returns`: ``@returns `true` if empty``.
- **Callables open with a third-person verb, everything else takes a noun phrase.** `key: () => string` gets "Returns the state key identifier."; `timestamp: number | null` gets "Timestamp from the backend for cache invalidation." A function-typed property is a callable and takes the verb.
- **Bulleted lists** completing a colon lead-in are punctuated once, on the last item. Items keyed by a label are independent descriptions and each take a period. A list of literal values under a label is verbatim and takes none.
- **Sections are `// #region Name` … `// #endregion`,** never a rule-line banner and never a bare label. Regions nest – `WriterUtils` and `PanelEvents` group members inside an interface that way.
- **`@source` carries provenance.** One `@source <file>` per authoritative file on the wrapping interface. File-only paths, no `:line` suffix. Children inherit; never duplicate a parent's path. No `@see`. A **phantom `@source`** is one the source map lists under `deadSources`: re-point it to the file that now holds the code, or drop it when the code is gone.
