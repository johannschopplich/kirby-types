# Rubric

## Latest Release

kirby-types types Kirby 6, for Vue 3 Panel plugins and for the frontends that read Kirby's content through the API or KQL. Its `@since` baseline lives in `scripts/kirby.mjs`, and the probe copies it into the source map.

Types and docs describe Kirby 6's **latest release** and nothing beyond it. Until its first stable release, `v6/develop` stands in for the latest release; a prerelease tag is no release. KQL counts the same way: until its first release for Kirby 6, its `v6` branch stands in. An older Kirby 6 release shows only as `@since` on a member or declaration it lacked. The latest release's shape is the whole type:

- A member a later release removed is deleted.
- A member the latest release always sets is required, even where older releases omitted it.
- A value only an older release returns leaves the union.
- The prose names no version.
- A member the latest release deprecates keeps `@deprecated` with what to use instead, or what happens without it; a member it accepts but ignores is deleted.
- A member the latest release marks `@unstable` carries a bare `@unstable` tag.

## Authority Order

**PHP `toArray()` / `props()` > Panel source.**

PHP is the response-shape contract for everything Features render. Panel TS is the type-safe runtime – stronger evidence than Panel JS for method signatures, narrowed unions, new symbols.

Panel TS is **evidence-strength, not absolute**. PHP overrules it when they disagree:

- `PanelSystem.slugs` – the Panel TS types `string[]`, PHP emits `Record<string, string>`. Keep the record.

## Anti-Pattern: Defaults-as-Runtime Fallacy

For a property PHP fills, JS `defaults()` is bootstrap state, not runtime contract. Cite PHP for its nullability and never widen it to `T | null` on JS evidence alone: `PanelView.path` and `PanelTranslation.code` stay non-nullable. A browser-only property takes its nullability from the latest release's Panel source. Without PHP evidence for a nullability, DEFER the widening.

## Finding Categories

- **tighten**: the Panel's own TS type is stricter or clearer than ours, and PHP, where it emits the shape, agrees. Adopt it, unless it rejects a value the runtime accepts: `PanelComponentExtension.extends` keeps taking a `DefineComponent`.
- **renameCandidate**: the source uses a different name that better reflects intent. An approved rename replaces the name outright: the old name leaves the types.
- **missing**: public Kirby member not represented in TS.
- **redundant**: TS member without runtime backing.
- **signatureMismatch**: wrong arity, param types, or return type, or a doc naming a shape the type rejects.
- **soft**: JSDoc shape narrower than `any` / `Record<string, any>` widening allows; lower severity.
- **loosen**: a typed shape that is not actionable, as Intentional Looseness defines it. Its keys give way to `any` or `Record<string, any>`, and a named type no other declaration uses is deleted – unless the source map's `siblingImports` lists it, which makes the deletion a DEFER naming the repos.
- **Kirby bug** findings, as JSDoc Style defines them, file in the bucket the finding would otherwise take, the `note` or `rationale` opening with `Kirby bug` and naming the call that triggers it.
- **Defaults members** are reported and patched on the `*Defaults` interface, their declaration site (`PanelUser extends PanelState<PanelUserDefaults>, PanelUserDefaults`).

## Skip – Never Report

- `#`-prefixed JS class privates
- Symbols marked `@internal` in JSDoc
- Test-only references (`*.test.{js,ts}`)
- Inherited members: a declaration that extends another is reviewed only for what it adds or overrides.

## Intentional Looseness

Each goes under `intentional` and stays as typed:

- `Record<string, any>` for query bags (e.g. `query?: Record<string, any>`)
- `Promise<any>` for a response whose keys the caller or a plugin picks: `panel.api.get()` on a free path, a `select` query, a plugin's route
- A page, file, user, or site in any view but `compact` – `default`, `panel`, `auth`, `selector` – whatever keys PHP fixes
- Deep PHP class shapes too cumbersome to mirror (per-blueprint model permissions, locale arrays keyed by `LC_*` constants)

Beyond these, a shape earns typed keys only when it is **actionable**: a plugin or frontend builds it or reads its keys – an input, a field's or view's props, a block's content, a KQL request, the compact model a list renders. A response the caller passes on or never opens stays `any` or `Record<string, any>`, however fixed Kirby sets its keys: a blueprint, the system data, an `ok` body – a failed call rejects instead – or the free-form `options` a request forwards to a Kirby component, such as the search `options`. Within an actionable shape, the looseness ends where Kirby sets the keys: an `any` or `Record<string, any>` over keys PHP fixes is a **tighten**. A view tab's `columns` hold `{ width, fields }` whatever fields the blueprint puts in them; `users.list` returns each user in the `compact` view of `config/api/models/User.php`. A model without a `default` view returns every field: `roles.get` includes `permissions`, which Role's `compact` view leaves out. Leave out a key the runtime may lack: a user's `avatar` is a File or a FileVersion, so its type holds only the keys both views share.

## Panel TS Evidence

- Drop `Prettify<T>` wrappers.
- `type TODO = any` means "Kirby has no opinion". Skip it.
- Keep `Record<string, any>` where the source writes `Record<string, unknown>` without shape evidence; that swap is stylistic.

## `@since`

- **Git from a full-history root.** `git log -S <symbol>` for the introducing commit, then `git tag --contains <commit> | grep -E '^[0-9]' | sort -V | head -1` for the earliest release. Read the file at that tag and at the previous release tag (`git show <tag>:<path>`) before writing the version: a patch release often carries the change (`6.1.1`, not `6.1.0` or `6.2.0`). A prerelease tag, or an untagged commit on the develop branch standing in for the latest release, dates to its release: a member first tagged `6.0.0-alpha.2` is present at the 6.0.0 baseline.
- **Nothing present at the baseline carries `@since`.** Nor does anything in `kql.d.ts`: KQL versions apart from Kirby.

## JSDoc Style

- **Body describes runtime behavior.** What a plugin or frontend author passes, gets, and must avoid: "pass `admin` for an admin account", not "the installer sends `admin`". A mechanism stays only as its consequence – "pings while the Panel is online", not when the ping is scheduled. The default of an option the user sets stays. PHP/JS class names, `Foo::bar()` references, factory and controller names, internal property names (`$actions`/`$defaults`), file paths, and internal constants such as intervals or batch sizes stay out of the prose; provenance belongs in `@source`.
- **A doc that repeats the name and the type is not written.** `/** Icon name */` above `icon?: string` earns nothing, and neither does `/** Files API */` above `files: PanelApiFiles`. Add the member bare.
- **A doc carries only actionable facts**: ones that change the code a plugin or frontend author writes – edge cases, fallbacks, units, empty values, ordering, gotchas – however many lines they take. Two stay out even so: what the runtime does with input the type or doc rules out, and a Kirby bug. A trim cuts what is not actionable – filler ("Useful for…"), a pointer to a sibling, how Kirby derives a value, a response fallback no caller branches on; a trim that sends the reader to the source got worse.
- **A Kirby bug** is runtime behavior that breaks Kirby's own contract – a promise that never settles, a callback that fires twice – not a disagreement the Authority Order settles. It stays out of the types too, even where correct use meets it, and a doc line stating one is dropped.
- **Each fact lives once, on the member it describes.** A default sits on its field, not again on the method that applies it; a fact true of every member sits on the interface.
- **Defaults read one way**: an input's as "`x` when omitted", a config option's as "(`x` unless configured)", a `@param`'s as "(default: `x`)", a value the runtime fills in as "`x` when unset". No `@default` tag.
- **Prose ends with a period**, one line or twenty: `/** Text shown after the input. */`. A block-tag description that continues the signature ends at its last word and takes none – `@param event - Event name to listen for`, `@since 6.1.0`, `@source panel/src/panel/state.ts`. Once a tag's text runs to a sentence it is prose and is punctuated as prose.
- **Values take backticks wherever a doc names them** – body, `@param`, `@returns`: ``@returns `true` if empty``.
- **Callables open with a third-person verb, everything else takes a noun phrase.** `key: () => string` gets "Returns the state key, such as `"view"` or `"dialog"`."; `timestamp: number | null` gets "Server time in milliseconds when the view was sent; `null` on other features." A function-typed property is a callable and takes the verb.
- **Bulleted lists** completing a colon lead-in are punctuated once, on the last item. Items keyed by a label are independent descriptions and each take a period. A list of literal values under a label is verbatim and takes none.
- **Sections are `// #region Name` … `// #endregion`,** never a rule-line banner and never a bare label. Regions nest – `WriterUtils` and `PanelEvents` group members inside an interface that way.
- **`@source` carries provenance.** One `@source <file>` per authoritative file on the wrapping interface: a file that backs a member's type or a doc fact on that declaration. File-only paths relative to the Kirby root – in `kql.d.ts`, to the KQL root – with no `:line` suffix. Children inherit; never duplicate a parent's path. No `@see`. A **dead `@source`** is one the source map lists under `deadSources`: re-point it to the file that now holds the code, or drop it when the code is gone.
