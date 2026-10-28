# Rubric

## Latest Release

kirby-types types Kirby 6, for Vue 3 plugins. Its `@since` baseline lives in `scripts/kirby.mjs`, and the probe copies it into the source map.

Types and docs describe Kirby 6's **latest release** and nothing beyond it. Until its first stable release, `v6/develop` stands in for the latest release; a prerelease tag is no release. An older Kirby 6 release shows only as `@since` on a member or declaration it lacked. The latest release's shape is the whole type:

- A member a later release removed is deleted.
- A member the latest release always sets is required, even where older releases omitted it.
- A value only an older release returns leaves the union.
- The prose names no version.
- A member the latest release deprecates keeps `@deprecated` with what to use instead, or what happens without it; a member it accepts but ignores is deleted.
- A member the latest release marks `@unstable` carries a bare `@unstable` tag.

## Authority order

**PHP `toArray()` / `props()` > Panel source.**

PHP is the response-shape contract for everything Features render. Panel TS is the type-safe runtime – stronger evidence than Panel JS for method signatures, narrowed unions, new symbols.

Panel TS is **evidence-strength, not absolute**. PHP overrules it when they disagree:

- `PanelSystem.slugs` – the Panel TS types `string[]`, PHP emits `Record<string, string>`. Keep the record.

## Anti-pattern: defaults-as-runtime fallacy

For a property PHP fills, JS `defaults()` is bootstrap state, not runtime contract. Cite PHP for its nullability and never widen it to `T | null` on JS evidence alone: `PanelView.path` and `PanelTranslation.code` stay non-nullable. A browser-only property takes its nullability from the latest release's Panel source. Without PHP evidence for a nullability, DEFER the widening.

## Finding categories

- **tighten**: the Panel's own TS type is stricter or clearer than ours, and PHP, where it emits the shape, agrees. Adopt it, unless it rejects a value the runtime accepts: `PanelComponentExtension.extends` keeps taking a `DefineComponent`.
- **renameCandidate**: the source uses a different name that better reflects intent. An approved rename replaces the name outright: the old name leaves the types.
- **missing**: public Kirby member not represented in TS.
- **redundant**: TS member without runtime backing.
- **signatureMismatch**: wrong arity, param types, or return type, or a doc naming a shape the type rejects.
- **soft**: JSDoc shape narrower than `any` / `Record<string, any>` widening allows; lower severity.
- **Defaults members** are reported and patched on the `*Defaults` interface, their declaration site (`PanelUser extends PanelState<PanelUserDefaults>, PanelUserDefaults`).

## Skip – never report

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc
- Test-only references (`*.test.{js,ts}`)
- Inherited members: a declaration that extends another is reviewed only for what it adds or overrides.

## Intentional looseness – note, do not flag or widen

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for dynamic backend response data
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by `LC_*` constants)

The looseness ends where Kirby sets the keys: an `any` or `Record<string, any>` over a shape PHP builds with fixed keys is a **tighten**, inside a blueprint-driven value too. A tab's `columns` hold `{ width, fields }` whatever fields the blueprint puts in them.

## Panel TS evidence

- Drop `Prettify<T>` wrappers.
- `type TODO = any` means "Kirby has no opinion". Skip it.
- Keep `Record<string, any>` where the source writes `Record<string, unknown>` without shape evidence; that swap is stylistic.

## `@since`

- **Git from a full-history root.** `git log -S <symbol>` for the introducing commit, then `git tag --contains <commit> | grep -E '^[0-9]' | sort -V | head -1` for the earliest release. Read the file at that tag and at the previous release tag (`git show <tag>:<path>`) before writing the version: a patch release often carries the change (`6.1.1`, not `6.1.0` or `6.2.0`). A prerelease tag, or an untagged commit on the develop branch standing in for the latest release, dates to its release: a member first tagged `6.0.0-alpha.2` is present at the 6.0.0 baseline.
- **Nothing present at the baseline carries `@since`.**

## JSDoc style

- **Body describes runtime behavior.** What a plugin author passes, gets, and must avoid, never how Kirby produces it: "pass `admin` for an admin account", not "the installer sends `admin`". A mechanism stays only as its consequence – "pings while the Panel is online", not when the ping is scheduled. No data flow, no step-by-step retelling of the implementation, no list of which fields Kirby reads for what, no "as … reflects", no reason Kirby has for a value. PHP/JS class names, `Foo::bar()` references, factory names, controller names, internal property names (`$actions`/`$defaults`), file paths, and internal constants such as intervals or batch sizes – none belong in JSDoc prose. The default of an option the user sets stays. Provenance belongs in `@source`.
- **A doc that repeats the name and the type is not written.** `/** Icon name */` above `icon?: string` earns nothing, and neither does `/** Files API */` above `files: PanelApiFiles`. Add the member bare.
- **Length follows substance.** Edge cases, fallbacks, units, empty values, ordering, and gotchas a caller can hit stay however many lines they take. A trim cuts only filler ("Useful for…", "Can be used to…"), a pointer to a sibling, and mechanism; a trim that sends the reader to the source got worse.
- **Each fact lives once, on the member it describes.** A default sits on its field, not again on the method that applies it; a fact true of every member sits on the interface.
- **Prose ends with a period**, one line or twenty: `/** Text shown after the input. */`. A block-tag description that continues the signature ends at its last word and takes none – `@param event - Event name to listen for`, `@since 6.1.0`, `@source panel/src/panel/state.ts`. Once a tag's text runs to a sentence it is prose and is punctuated as prose.
- **Values take backticks wherever a doc names them** – body, `@param`, `@returns`: ``@returns `true` if empty``.
- **Callables open with a third-person verb, everything else takes a noun phrase.** `key: () => string` gets "Returns the state key, such as `"view"` or `"dialog"`."; `timestamp: number | null` gets "Server time in milliseconds when the view was sent; `null` on other features." A function-typed property is a callable and takes the verb.
- **Bulleted lists** completing a colon lead-in are punctuated once, on the last item. Items keyed by a label are independent descriptions and each take a period. A list of literal values under a label is verbatim and takes none.
- **Sections are `// #region Name` … `// #endregion`,** never a rule-line banner and never a bare label. Regions nest – `WriterUtils` and `PanelEvents` group members inside an interface that way.
- **`@source` carries provenance.** One `@source <file>` per authoritative file on the wrapping interface. File-only paths, no `:line` suffix. Children inherit; never duplicate a parent's path. No `@see`. A **dead `@source`** is one the source map lists under `deadSources`: re-point it to the file that now holds the code, or drop it when the code is gone.
