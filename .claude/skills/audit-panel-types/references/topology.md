# Topology – stable cluster → source map

Each entry lists the symbols the agent owns, the source **modules** (extension-free), and the PHP authority.

Clusters, modules, and watchpoints hold for both lines; an entry tagged **(K6 line)** applies only when the root is Kirby 6.

## base.d.ts

### `base`

- **Symbols**: PanelState, PanelFeature, PanelFeatureDefaults, PanelModal, PanelModalEvent, PanelModalListeners, PanelModalSubmitResponse, PanelSuccessResponse, PanelHistory, PanelHistoryMilestone, PanelEventCallback, PanelEventListenerMap, PanelEventListeners, PanelRequestOptions, PanelRefreshOptions, PanelContext, NotificationType, NotificationTheme
- **Modules**: `panel/src/panel/{state,feature,modal,listeners,request,notification}`, `panel/src/helpers/history`
- **PHP**: `src/Panel/{View,Dialog,Drawer}.php`, `src/Panel/Json.php` (Fiber response keys)
- **Watch**: request emits `x-panel`, `x-panel-globals`, `x-panel-referrer` (K6 line; Kirby 5 emits `x-fiber*`). `NotificationType`: only `"error"`/`"fatal"` are ever assigned to `state.type`; the wider `success`/`info` union is unreachable – note, don't flag.

## features.d.ts

Hybrid clusters – PHP rules nullability. Panel `*State` is JS-bootstrap shape, not PHP authority (defaults-as-runtime fallacy).

### `features-stateonly`

- **Symbols**: PanelTimer, PanelActivation*, PanelDrag*, PanelTheme*, PanelThemeValue, PanelLanguage*, PanelMenu*, PanelMenuEntry, PanelSystem*, PanelTranslation*, PanelUser*
- **Modules**: `panel/src/panel/{activation,drag,theme,language,menu,system,translation,user}`, `panel/src/helpers/timer`
- **PHP**: `src/Panel/View.php` (`$translation`, `$system`, `$language`, `$user`, `$menu` resolvers)
- **Watch**: PHP overrules Panel TS – title `string`. Menu state is `entries` on Kirby 5; **(K6 line)** `items` of `{component, key, props}` UI-Button wrappers. `PanelLanguage` re-lists fields manually (no Defaults intersection); `locale`/`url` are stripped by `state.set()` before reaching `panel.language` – they belong on `PanelLanguageInfo`, not here.

### `features-notification`

- **Symbols**: PanelNotificationOptions, PanelErrorObject, PanelNotificationDefaults, PanelNotification
- **Modules**: `panel/src/panel/notification`, `panel/src/helpers/error` (internal `isAbortError`, never a public helper)
- **PHP**: silent (no `$notification` resolver – client-only state). Authority falls to the Panel source.

### `features-view`

- **Symbols**: PanelBreadcrumbItem, PanelViewDefaults, PanelView, PanelSearchPagination, PanelSearchOptions, PanelSearchResponse, PanelSearcher
- **Modules**: `panel/src/panel/{view,search,feature}`
- **PHP**: `src/Panel/{View,Page,File,User,Site}.php` (`$view` resolver + per-model props)
- **Watch**: PanelView extends PanelFeature – never re-flag inherited members; focus on what view ADDS/OVERRIDES. `PanelView.path` non-nullable (PHP always sets it) even though JS `defaults()` returns null.

### `features-upload`

- **Symbols**: PanelUploadFile, PanelUploadReplaceFile, PanelUploadDefaults, PanelUpload
- **Modules**: `panel/src/panel/upload` (+ `panel/src/helpers/upload` for context)
- **PHP**: `src/Panel/File.php` (server file model for `replacing` / `completed`)
- **Watch**: **(K6 line)** the Panel TS reuses its queued-upload type for `replacing`, which is WRONG against PHP – PHP is authority for the `replacing` shape.

### `features-content`

- **Symbols**: PanelContentVersion, PanelContentVersions, PanelContentLock, PanelContentEnv, PanelContent
- **Modules**: `panel/src/panel/content` (**(K6 line)** `renewLock`)
- **PHP**: `src/Content/{Lock,Version}.php`
- **Watch**: PanelContent is a plain `reactive({...})` returned by `Content(panel)` – it does NOT extend PanelFeature. Don't flag a missing-extends. `save()` keeps `| void` on the Kirby 4/5 line: 5.0–5.5 resolve to `void`.

### `features-modals`

- **Symbols**: PanelDropdownOption, PanelDropdownDefaults, PanelDropdown, PanelDialogDefaults, PanelDialog, PanelDrawerDefaults, PanelDrawer, PanelEventEmitter, PanelEvents
- **Modules**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}`
- **PHP**: `src/Panel/View.php` (`$dialogs`/`$drawers`/`$dropdowns` config endpoints), `src/Panel/{Dialog,Drawer}.php`
- **Watch**: Dialog/Drawer extend PanelModal, Dropdown extends PanelFeature – review only the members each adds or overrides. Kirby 5 keeps `legacy`/`ref`/`openComponent` for Vue-2 plugin compat; the K6 line has none of them.

## api.d.ts

JS/TS client is source of truth. PHP routes (`config/api/routes/*.php`) consulted only when JSDoc on the wrapper is missing. Query bags and response data are intentional looseness.

### `api-core`

- **Symbols**: PanelApi, PanelApiRequestOptions, PanelApiPagination, PanelApiSearchQuery, PanelModelData, PanelApiAuth, PanelApiLoginData
- **Modules**: `panel/src/api/{index,auth}`, `panel/src/panel/request`. Verb helpers (`get/post/patch/delete/request`) are separate files on Kirby 5 and methods on the `Api` class in `index` on the K6 line. `auth.ping()` posts `auth/ping`. **(K6 line)** the `api.pingId` field and `api.ping()` method coexist. On Kirby 5, `api.ping` is the heartbeat interval ID.

### `api-content`

- **Symbols**: PanelApiPage*, PanelApiSite, PanelApiFiles
- **Modules**: `panel/src/api/{pages,site,files}`

### `api-users`

- **Symbols**: PanelApiUser*, PanelApiRoles, PanelApiLanguage*
- **Modules**: `panel/src/api/{users,roles,languages}`

### `api-system`

- **Symbols**: PanelApiTranslations, PanelApiSystem*
- **Modules**: `panel/src/api/{translations,system}`

## helpers.d.ts

JS/TS source is the runtime contract. Every `helperRegistrations` entry of the source map is a `PanelHelpers` member, else a `missing` finding. Anchors are short property names (`array:`, `slug:`) – disambiguate against the wrapping interface when a name appears both as a sub-interface member and a top-level shortcut.

### `helpers-data`

- **Symbols**: PanelHelpers, PanelHelpers{Array,Object,Field,File,Page,Embed,Writer}, PanelArraySearchOptions, PanelSortOptions, PanelComparator, PanelFieldDefinition, PanelPageStatusProps
- **Sub-properties on `PanelHelpers`**: `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut), `writer` (shortcut), **(K6 line)** `items`
- **Modules**: `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed,writer,index}`, **(K6 line)** `panel/src/helpers/items`. `helper.writer` is registered in `index` (check `source-map.json` `helperRegistrations`) backed by the `writer` module.

### `helpers-string`

- **Symbols**: PanelHelpers{String,Url,Clipboard,Keyboard,Link}, PanelSlugRules, PanelLink*
- **Sub-properties on `PanelHelpers`**: `string`, `url`, `link`, `keyboard`, `focus`, `clipboard`, `color`, `pad`, `slug`, `uuid` (shortcuts)
- **Modules**: `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color,index}`
- **Watch**: transformers keep `string` on their subject param (intentional DX / autocomplete), even though source widened to `unknown`; predicates take `unknown`. Do not widen transformers – see rubric.

### `helpers-util`

- **Symbols**: PanelUpload{Params,ProgressCallback,ResultCallback}, PanelDebounce*, PanelThrottle*
- **Sub-properties on `PanelHelpers`**: `debounce`, `throttle`, `isComponent`, `isUploadEvent`, `upload`
- **Modules**: `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload}`
- **Watch**: `queue` and `regex` are NOT on `$helper` (regex is a side-effect augment of `RegExp.escape`) – don't flag as missing. **(K6 line)** `isComponent` takes the Vue `app`.

## libraries.d.ts

### `libraries`

- **Symbols**: PanelLibrary*, PanelColor*, PanelDayjs*
- **Modules**: `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-iso,dayjs-pattern,dayjs-round,dayjs-validate}`, on Kirby 5 also `dayjs-interpret` and `dayjs-merge`, **(K6 line)** `panel/src/libraries/{dayjs-locale,dayjs-parse}` (+ `@types/autosize`)
- **Watch**: the Panel uses `declare module 'dayjs'` to globally augment `Dayjs`; kirby-types intentionally keeps a `Dayjs & PanelDayjsExtensions` intersection on chainable returns – note it as intentional divergence.

## writer.d.ts

Prosemirror-typed. Where the map shows a module `ts`, expect `tighten` findings (command `attrs`, `keys` accepting `Command`, `view` returning `MarkView`/`NodeView`).

### `writer-editor`

- **Symbols**: WriterEditor*, WriterToolbarButton, WriterUtils, WriterMarkContext, WriterNodeContext, WriterExtensionContext, WriterExtension, WriterExtensions
- **Modules**: `panel/src/components/Forms/Writer/{Editor,Extension,Extensions,Emitter}`, `panel/src/components/Forms/Writer/Utils/*`

### `writer-marks`

- **Symbols**: WriterMarkExtension
- **Modules**: `panel/src/components/Forms/Writer/Mark`, `panel/src/components/Forms/Writer/Marks/*`

### `writer-nodes`

- **Symbols**: WriterNodeExtension
- **Modules**: `panel/src/components/Forms/Writer/Node`, `panel/src/components/Forms/Writer/Nodes/*`

## textarea.d.ts

### `textarea`

- **Symbols**: TextareaButton, TextareaToolbarContext, TextareaDropdownItem
- **Modules**: `panel/src/components/Forms/Toolbar/{TextareaToolbar,Toolbar,index,EmailDialog,LinkDialog}` (Vue components + index), `panel/src/components/Forms/Input/TextareaInput`
- **Watch**: the Toolbar is Vue, not migrated to TS – the `.vue` source is the contract. `plugins` only widens `textareaButtons` to `Record<string, unknown>` (no button-shape opinion).

## index.d.ts

### `index-panel`

- **Symbols**: Panel, PanelApp, PanelComponentExtension, PanelPlugins, PanelPluginExtensions, PanelGlobalState, PanelRequestResponse, PanelSearchType, PanelSearches, PanelUrls (+ **(K6 line)** PanelGlobalProperties, PanelHtml, HtmlString)
- **Modules**: `panel/src/panel/{panel,app,legacy,plugins,request,search}`, `panel/src/types/{vue,global}`, `panel/src/index`, **(K6 line)** `panel/src/panel/{html,observers}`
- **PHP**: `src/Panel/{Panel,View}.php` (urls/globals/searches)
- **Watch**: `PanelApp`/`PanelComponentExtension`/`PanelPlugins`/`PanelPluginExtensions`/`created` follow the line's Vue version – Vue 2 on `main`; **(K6 line)** Vue 3 `App`/`Plugin`/`ComponentPublicInstance`, plus `panel.html`, which binds only the default factory while `HtmlString` is a separate export, and `panel.observers`, a `reactive({ resize: ResizeObserver })`. Every `panelSingletons` entry of the source map is a `Panel` member, else a `missing` finding. The component globals – `PanelApp`'s shortcuts on `main`, **(K6 line)** `PanelGlobalProperties`, which `panel-globals.d.ts` augments onto every component – mirror Kirby's own `ComponentCustomProperties` in `panel/src/types/vue`: a shortcut Kirby adds, drops, or deprecates there moves the same way here. **(K6 line)** `PanelComponentExtension` follows the `Component` type in `plugins`.

### `index-config`

- **Symbols**: PanelConfig, PanelLanguageInfo
- **Modules**: `panel/src/panel/panel` (the `Config` type + `config` defaults)
- **PHP**: `src/Panel/{View,Document}.php`, `src/Cms/Language.php`
- **Watch**: defaults-as-runtime fallacy.

### `index-permissions`

PHP-rooted. PHP `toArray()` is the shape; JS only consumes the JSON.

- **Symbols**: PanelPermissions, PanelPermissions{Access,Files,Languages,Pages,Site,Users,User}
- **PHP**: `src/Cms/{Permissions,UserPermissions,FilePermissions,PagePermissions,SitePermissions,LanguagePermissions}.php`, `src/Panel/View.php`
- **Watch**: **(K6 line)** PHP refactored internals (`$actions` → `$defaults`, `$extendedAreas`) but the public `toArray()` shape is unchanged.

### `index-viewprops`

PHP-rooted. PHP `props()` / `toArray()` is the response shape.

- **Symbols**: PanelViewProps, PanelViewProps{LockUser,Lock,Permissions,Versions,Tab,Navigation,Model,Button}
- **PHP**: `src/Panel/{Model,View,Page,File,User,Site}.php`, `src/Cms/{Page,File,User,Site}Blueprint.php`, `src/Panel/Ui/Button.php`, `src/Panel/Ui/Buttons/ViewButton{,s}.php`, `src/Content/Lock.php`
- **Watch**: **(K6 line)** `ModelViewController` builds the props – always-present `next`/`prev`/`title`, no nested `model`; `component`/`breadcrumb`/`search` sit on the view envelope, not in `props`. The Panel's `ViewState` in `view` is JS-side state, not the server `props` payload – don't import it here.
