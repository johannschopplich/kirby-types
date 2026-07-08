# Topology – stable cluster → source map

Paste the relevant cluster's entry into the pass-1 prompt template in [agent-prompts.md](agent-prompts.md#pass-1). Each entry lists the symbols the agent owns, the source **modules** (extension-free), and the PHP authority.

**File status is NOT in this file.** Which modules ship `.js`, `.ts`, or are `absent` in K5/K6 comes from `source-map.json` (produced by `scripts/probe.sh`). Module paths below are written extension-free precisely so they never rot – the agent resolves each one against the map.

**the Vue-2 hold** is the recurring token below – the one posture the standing rubric gates on Kirby 6 SHIPPING: the plugin shape in `index-panel` stays Vue 2, everything else in migrated K6 TS is learnable evidence now. Record hold violations as `drift`, never backport.

`@since` is per-symbol and git-derived – `git log -S <symbol>` in the K5 checkout, never a "K6-only" guess. See [rubric.md](rubric.md).

## Modeling notes (special surface)

- `panel/src/panel/html` – `panel.html` binds ONLY the default factory `html(value: unknown): HtmlString`; `HtmlString extends String` (static `resolve<T>`) is a SEPARATE class export, not nested under `panel.html`. Model in `index-panel` as a minimal branded type: `interface HtmlString extends String {}` + `interface PanelHtml { (value: unknown): HtmlString }`, `html: PanelHtml`. The `String` wrapper trips `ts/no-wrapper-object-types` – suppress inline with a why-comment.
- `panel/src/panel/observers` – `panel.observers` (`reactive({ resize: ResizeObserver })`).
- `panel/src/helpers/error` – internal-only (`isAbortError`); NOT on `$helper`. Used by `notification` to decide whether an aborted request surfaces an error. Never model as a public helper.

## base.d.ts

### `base`

- **Symbols**: PanelState, PanelFeature, PanelFeatureDefaults, PanelModal, PanelModalEvent, PanelModalListeners, PanelSuccessResponse, PanelHistory, PanelHistoryMilestone, PanelEventCallback, PanelEventListenerMap, PanelEventListeners, PanelRequestOptions, PanelRefreshOptions, PanelContext, NotificationType, NotificationTheme
- **Modules**: `panel/src/panel/{state,feature,modal,listeners,request,notification}`, `panel/src/helpers/history`
- **PHP**: `kirby/src/Panel/{View,Dialog,Drawer}.php`, `kirby/src/Panel/Json.php` (Fiber response keys)
- **Watch**: request emits `x-panel`, `x-panel-globals`, `x-panel-referrer` (was `x-fiber*` in K5) – drift, already documented. `NotificationType`: only `"error"`/`"fatal"` are ever assigned to `state.type`; the wider `success`/`info` union is unreachable – note, don't flag.

## features.d.ts (6 clusters)

Hybrid clusters – PHP rules nullability. K6 `*State` is JS-bootstrap shape, not PHP authority. Never widen on K6/JS evidence alone.

### `features-stateonly`

- **Symbols**: PanelTimer, PanelActivation*, PanelDrag*, PanelTheme*, PanelThemeValue, PanelLanguage*, PanelMenu*, PanelMenuEntry, PanelSystem*, PanelTranslation*, PanelUser*
- **Modules**: `panel/src/panel/{activation,drag,theme,language,menu,system,translation,user}`, `panel/src/helpers/timer` (K5 kept a `activiation.js` typo before the rename – the map keys off the K6 name)
- **PHP**: `kirby/src/Panel/View.php` (`$translation`, `$system`, `$language`, `$user`, `$menu` resolvers)
- **Watch**: PHP overrules K6 – `PanelSystem.csrf: string` (not `string | null`), `PanelLanguageInfo.slugs: Record` (not `string[]`), title `string`. `PanelMenuEntry`: K6 rebuilt sidebar items into `{component, key, props}` UI-Button wrappers – the Vue-2 hold, record as `drift`. `PanelLanguage` re-lists fields manually (no Defaults intersection); `locale`/`url` are stripped by `state.set()` before reaching `panel.language` – they belong on `PanelLanguageInfo`, not here.

### `features-notification`

- **Symbols**: PanelNotificationOptions, PanelErrorObject, PanelNotificationDefaults, PanelNotification
- **Modules**: `panel/src/panel/notification`, `panel/src/helpers/error` (internal `isAbortError`)
- **PHP**: silent (no `$notification` resolver – client-only state). Authority falls to K6 TS.

### `features-view`

- **Symbols**: PanelBreadcrumbItem, PanelViewDefaults, PanelView, PanelSearchPagination, PanelSearchOptions, PanelSearchResult, PanelSearcher
- **Modules**: `panel/src/panel/{view,search,feature}`
- **PHP**: `kirby/src/Panel/{View,Page,File,User,Site}.php` (`$view` resolver + per-model props)
- **Watch**: PanelView extends PanelFeature – never re-flag inherited members; focus on what view ADDS/OVERRIDES. `PanelView.path` non-nullable (PHP always sets it) even though JS `defaults()` returns null.

### `features-upload`

- **Symbols**: PanelUploadFile, PanelUploadDefaults, PanelUpload
- **Modules**: `panel/src/panel/upload` (+ `panel/src/helpers/upload` for context)
- **PHP**: `kirby/src/Panel/File.php` (server file model for `replacing` / `completed`)
- **Watch**: K6 reuses its queued-upload type for `replacing`, which is WRONG against PHP – do NOT learn from K6 for the `replacing` shape. PHP is authority.

### `features-content`

- **Symbols**: PanelContentVersion, PanelContentVersions, PanelContentLock, PanelContentEnv, PanelContent
- **Modules**: `panel/src/panel/content` (K6-only methods `unlock`, `renewLock` – git-verify `@since`)
- **PHP**: `kirby/src/Content/{Lock,Version}.php`, `kirby/src/Cms/ContentTranslation.php`
- **Watch**: PanelContent is a plain `reactive({...})` returned by `Content(panel)` – it does NOT extend PanelFeature. Don't flag a missing-extends.

### `features-modals`

- **Symbols**: PanelDropdownOption, PanelDropdownDefaults, PanelDropdown, PanelDialogDefaults, PanelDialog, PanelDrawerDefaults, PanelDrawer, PanelEventEmitter, PanelEvents
- **Modules**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}`
- **PHP**: `kirby/src/Panel/View.php` (`$dialogs`/`$drawers`/`$dropdowns` config endpoints), `kirby/src/Panel/{Dialog,Drawer}.php`
- **Watch**: Dialog/Drawer/Dropdown extend PanelModal – never re-flag inherited members. K5 retains `legacy`/`ref`/`openComponent` for Vue-2 plugin compat; if K6 dropped them, `@deprecated`, don't delete.

## api.d.ts (4 clusters)

JS/TS client is source of truth. PHP routes (`kirby/config/api/routes/*.php`) consulted only when JSDoc on the wrapper is missing. Query bags stay `Record<string, any>`; dynamic response data stays `Promise<any>` – intentional looseness.

### `api-core`

- **Symbols**: PanelApi, PanelApiRequestOptions, PanelApiPagination, PanelApiSearchQuery, PanelModelData, PanelApiAuth, PanelApiLoginData
- **Modules**: `panel/src/api/{index,auth}`, `panel/src/panel/request`. Verb helpers (`get/post/patch/delete/request`) are methods on the `Api` class in `index`, not separate files in K6; K5 keeps separate verb files. `auth` exposes `ping()` posting `auth/ping` – NO `ping` → `pingId` rename; `pingId` field and `ping()` method coexist.

### `api-content`

- **Symbols**: PanelApiPages*, PanelApiSite, PanelApiFiles
- **Modules**: `panel/src/api/{pages,site,files}`

### `api-users`

- **Symbols**: PanelApiUsers*, PanelApiRoles, PanelApiLanguages*
- **Modules**: `panel/src/api/{users,roles,languages}`

### `api-system`

- **Symbols**: PanelApiTranslations, PanelApiSystem*
- **Modules**: `panel/src/api/{translations,system}`

## helpers.d.ts (3 clusters)

JS/TS source is the runtime contract. Anchors are short property names (`array:`, `slug:`) – disambiguate against the wrapping interface when a name appears both as a sub-interface member and a top-level shortcut.

### `helpers-data`

- **Sub-properties on `PanelHelpers`**: `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut), `writer` (shortcut)
- **Modules**: `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed,writer,index}`. `helper.writer` is registered in `index` (check `source-map.json` `helperRegistrations`) backed by the `writer` module.

### `helpers-string`

- **Sub-properties on `PanelHelpers`**: `string`, `url`, `link`, `keyboard`, `focus`, `clipboard`, `color`, `pad`, `slug`, `uuid` (shortcuts)
- **Modules**: `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color,index}`
- **Watch**: transformers keep `string` on their subject param (intentional DX / autocomplete), even though source widened to `unknown`; predicates take `unknown`. Do not widen transformers – see rubric.

### `helpers-util`

- **Sub-properties on `PanelHelpers`**: `debounce`, `throttle`, `isComponent`, `isUploadEvent`, `upload`
- **Modules**: `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload}`
- **Watch**: `queue` and `regex` are NOT on `$helper` (regex is a side-effect augment of `RegExp.escape`) – don't flag as missing. `isComponent`'s optional `app` param stays loose (`unknown`) – the Vue-2 hold.

## libraries.d.ts

### `libraries`

- **Symbols**: PanelLibrary, PanelLibraryColors, PanelLibraryDayjs, PanelDayjsExtensions, PanelDayjsStaticExtensions, PanelDayjsPattern, PanelLibraryAutosize
- **Modules**: `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-interpret,dayjs-iso,dayjs-merge,dayjs-pattern,dayjs-round,dayjs-validate}` (+ `@types/autosize`)
- **Watch**: K6 uses `declare module 'dayjs'` to globally augment `Dayjs`; kirby-types intentionally keeps a `Dayjs & PanelDayjsExtensions` intersection on chainable returns. Do NOT switch to global augmentation – note as intentional divergence.

## writer.d.ts (3 clusters)

Prosemirror-typed. Where the map shows a module `ts`, expect learnFrom tightenings (command `attrs`, `keys` accepting `Command`, `view` returning `MarkView`/`NodeView`).

### `writer-editor`

- **Symbols**: WriterEditor, WriterToolbarButton, WriterUtils, WriterMarkContext, WriterNodeContext, WriterExtensionContext, WriterExtension
- **Modules**: `panel/src/components/Forms/Writer/{Editor,Extension,Extensions,Emitter}`, `panel/src/components/Forms/Writer/Utils/*`

### `writer-marks`

- **Symbols**: WriterMarkExtension
- **Modules**: `panel/src/components/Forms/Writer/Mark`, `panel/src/components/Forms/Writer/Marks/*`

### `writer-nodes`

- **Symbols**: WriterNodeExtension
- **Modules**: `panel/src/components/Forms/Writer/Node`, `panel/src/components/Forms/Writer/Nodes/*`

## textarea.d.ts

### `textarea`

- **Symbols**: TextareaButton, TextareaToolbarContext
- **Modules**: `panel/src/components/Forms/Toolbar/{TextareaToolbar,Toolbar,index,EmailDialog,LinkDialog}` (Vue components + index), `panel/src/components/Forms/Input/TextareaInput`
- **Watch**: the Toolbar is Vue, not migrated to TS – K5 source is the contract. `plugins` only widens `textareaButtons` to `Record<string, unknown>` (no button-shape opinion).

## index.d.ts (4 clusters)

### `index-panel`

- **Symbols**: Panel, PanelApp, PanelComponentExtension, PanelPlugins, PanelPluginExtensions, PanelGlobalState, PanelRequestResponse, PanelSearchType, PanelSearches, PanelUrls (+ `panel.html`)
- **Modules**: `panel/src/panel/{panel,app,plugins,request,search,html,observers}`, `panel/src/index`
- **PHP**: `kirby/src/Panel/{Panel,State,View}.php` (urls/globals/searches)
- **Watch**: **the Vue-2 hold** – `PanelApp`/`PanelComponentExtension`/`PanelPlugins`/`PanelPluginExtensions`/`created(app)` stay Vue 2. K6's Vue-3 plugin shape (`App`/`Plugin`/`ConcreteComponent`/`ComponentOptions` from `vue@3`) is `drift` only, never backport. Non-Vue symbols (`PanelRequestResponse`, `PanelUrls`, `PanelSearches`) learnFrom freely. `panel.html` is the new addition (see Modeling notes); `panel.observers` already present.

### `index-config`

- **Symbols**: PanelConfig, PanelLanguageInfo
- **Modules**: `panel/src/panel/panel` (the `Config` type + `config` defaults)
- **PHP**: `kirby/src/Panel/{View,Document,State}.php`, `kirby/src/Cms/Language.php`
- **Watch**: defaults are bootstrap state, not runtime contract – cite PHP for nullability (defaults-as-runtime fallacy). Neither K5 nor K6 `Language::toArray()` emits `slugs` – the old slugs watchpoint is moot.

### `index-permissions`

PHP-rooted. PHP `toArray()` is the shape; JS only consumes the JSON.

- **Symbols**: PanelPermissions, PanelPermissions{Access,Files,Languages,Pages,Site,Users,User}
- **PHP**: `kirby/src/Cms/{Permissions,UserPermissions,FilePermissions,PagePermissions,SitePermissions,LanguagePermissions}.php`, `kirby/src/Panel/View.php`
- **Watch**: K6 PHP refactored internals (`$actions` → `$defaults`, `$extendedAreas`) but the public `toArray()` shape is unchanged. Per-blueprint deep model permissions are intentional looseness.

### `index-viewprops`

PHP-rooted. PHP `props()` / `toArray()` is the response shape.

- **Symbols**: PanelViewProps, PanelViewProps{LockUser,Lock,Permissions,Versions,Tab,Navigation,Model,Button}
- **PHP**: `kirby/src/Panel/{Model,View,Page,File,User,Site}.php`, `kirby/src/Cms/{Page,File,User,Site}Blueprint.php`, `kirby/src/Panel/Ui/Button.php`, `kirby/src/Panel/Ui/Buttons/ViewButton{,s}.php`, `kirby/src/Content/Lock.php`
- **Watch**: K6 restructured props via `ModelViewController` (adds `component`/`breadcrumb`, always-present `next`/`prev`/`title`, drops nested `model`). While kirby-types targets K5, record K6's restructuring as `drift` only. Deep per-blueprint model shapes (`PanelViewPropsModel` per content type) are intentional looseness. K6 ViewState in `view` is JS-side state, not the server `props` payload – don't import it here.
