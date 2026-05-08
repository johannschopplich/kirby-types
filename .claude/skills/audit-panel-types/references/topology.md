# Topology – pass 1 cluster → source mapping

23 clusters total. Paste the relevant cluster's entry into the pass-1 prompt template in [AGENTS.md](AGENTS.md#pass-1). Each entry lists the symbols the agent owns plus all three sources (PHP, K6 TS, K5 JS).

If a K6 source is unmigrated or a PHP source is silent, the agent records that as `no K6 source` / `PHP silent` and proceeds with the remaining sources.

## K6 file relocations to remember

- K5 `panel/src/panel/timer.js` → K6 `panel/src/helpers/timer.ts` (also: singleton became class, `interval` → `isRunning` getter)
- K5 `panel/src/panel/history.js` → K6 `panel/src/helpers/history.ts`
- K5 `panel/src/panel/activiation.js` → K6 `panel/src/panel/activation.ts` (typo fixed)

## K6 surface still on `.js` (do not assume TS)

- `panel/src/panel/{panel,app,legacy}.js` – Panel bootstrap, Vue-3 `App` factory, and the legacy Vue-3 install plugin that ports K5's `app.config.globalProperties.$api/$dialog/$drawer/...` shims. Do NOT import these for type evidence.
- `panel/src/api/{auth,files,languages,pages,roles,site,system,translations,users}.js` – byte-identical to K5; only `panel/src/api/index.ts` is migrated.
- `panel/src/components/Forms/Writer/{Editor,Extension,Extensions,Mark,Node,Marks/*,Nodes/*}.js` – byte-identical to K5; only `Emitter.ts` and `Utils/index.ts` are migrated. Individual `Utils/*.js` helpers are still JS.

## New K6-only surface

- `panel/src/panel/observers.ts` – new `panel.observers` reactive object with a `resize: ResizeObserver`. Add to `index-panel` (or `base`) with `@since 6` if absent in kirby-types.
- `panel/src/helpers/error.ts` – internal-only (`isAbortError`); NOT registered on `$helper`. Used by `notification` to decide whether an aborted request surfaces an error.

## base.d.ts

### `base`

- **Symbols**: PanelState, PanelStateBase, PanelFeature, PanelFeatureDefaults, PanelFeatureBase, PanelModal, PanelModalEvent, PanelModalListeners, PanelModalBase, PanelSuccessResponse, PanelHistory, PanelHistoryMilestone, PanelHistoryBase, PanelEventCallback, PanelEventListenerMap, PanelEventListeners, PanelRequestOptions, PanelRefreshOptions, PanelContext, NotificationContext, NotificationType, NotificationTheme
- **PHP**: `kirby/src/Panel/{View,Dialog,Drawer}.php`, `kirby/src/Panel/Json.php` (Fiber response keys)
- **K6 TS**: `panel/src/panel/{state,feature,modal,listeners,request,notification}.ts`; `panel/src/helpers/history.ts`
- **K5 JS**: `panel/src/panel/{state,feature,modal,history,listeners,request,notification}.js`
- **K6 header rename**: K6 `request.ts` emits `x-panel`, `x-panel-globals`, `x-panel-referrer` (was `x-fiber*` in K5).
- **K6-only listener helpers**: `PanelEventListeners.removeEventListener(event)` and `removeEventListeners()` (K6 `Feature.set()` resets via `removeEventListeners()`).
- **K6-only history helper**: `PanelHistory.hasPrevious(): boolean`.
- **NotificationType**: K5 and K6 only ever assign `"error"` or `"fatal"` to `state.type`; the wider union (`success`/`info`) is unreachable.

## features.d.ts (6 clusters)

All Feature clusters are **hybrid**: PHP owns the response shape, K6 TS owns method signatures and modern narrowings, K5 JS is the legacy runtime. For property nullability, PHP wins (see [rubric.md](rubric.md)).

### `features-stateonly`

- **Symbols**: PanelTimer, PanelActivation*, PanelDrag*, PanelTheme*, PanelThemeValue, PanelLanguage*, PanelMenu*, PanelMenuEntry, PanelSystem*, PanelTranslation*, PanelUser*
- **PHP**: `kirby/src/Panel/View.php` (`$translation`, `$system`, `$language`, `$user`, `$menu` resolvers)
- **K6 TS**: `panel/src/panel/{drag,theme,language,menu,system,translation,user,activation}.ts`; `panel/src/helpers/timer.ts`
- **K5 JS**: `panel/src/panel/{timer,activiation,drag,theme,language,menu,system,translation,user}.js` (note typo `activiation`)

### `features-notification`

- **Symbols**: PanelNotificationOptions, PanelErrorObject, PanelNotificationDefaults, PanelNotification
- **PHP**: silent (no `$notification` resolver – client-only state). Authority falls to K6 TS.
- **K6 TS**: `panel/src/panel/notification.ts`, `panel/src/helpers/error.ts` (internal `isAbortError` used by `notification.error()`)
- **K5 JS**: `panel/src/panel/notification.js`, `panel/src/panel/timer.js`

### `features-view`

- **Symbols**: PanelBreadcrumbItem, PanelViewDefaults, PanelView, PanelSearchPagination, PanelSearchOptions, PanelSearchResult, PanelSearcher
- **PHP**: `kirby/src/Panel/{View,Page,File,User,Site}.php` (`$view` resolver + per-model props)
- **K6 TS**: `panel/src/panel/{view,search,feature}.ts`
- **K5 JS**: `panel/src/panel/{view,search,feature}.js`

### `features-upload`

- **Symbols**: PanelUploadFile, PanelUploadDefaults, PanelUpload
- **PHP**: `kirby/src/Panel/File.php` (server file model shape for `replacing` / `completed`)
- **K6 TS**: `panel/src/panel/upload.ts` (note: K6 reuses queued-upload type for `replacing`, which is wrong against PHP – do not learn from K6 here)
- **K5 JS**: `panel/src/panel/upload.js` (+ `panel/src/helpers/upload.js` for context)

### `features-content`

- **Symbols**: PanelContentVersion, PanelContentVersions, PanelContentLock, PanelContentEnv, PanelContent
- **PHP**: `kirby/src/Content/{Lock,Version}.php`, `kirby/src/Cms/ContentTranslation.php`
- **K6 TS**: `panel/src/panel/content.ts` (K6-only methods `unlock` and `renewLock`)
- **K5 JS**: `panel/src/panel/content.js`
- **Inheritance note**: `PanelContent` is a plain `reactive({...})` returned by `Content(panel)` – it does NOT extend `PanelFeature`. Do not flag that as a missing-extends.

### `features-modals`

- **Symbols**: PanelDropdownOption, PanelDropdownDefaults, PanelDropdown, PanelDialogDefaults, PanelDialog, PanelDrawerDefaults, PanelDrawer, PanelEventEmitter, PanelEvents
- **PHP**: `kirby/src/Panel/View.php` (`$dialogs` / `$drawers` / `$dropdowns` config endpoints), `kirby/src/Panel/{Dialog,Drawer}.php`
- **K6 TS**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}.ts`
- **K5 JS**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}.js` (retains `legacy`/`ref`/`openComponent` for Vue-2 plugin compatibility)

## api.d.ts (4 clusters)

JS client (K5 + K6) is the source of truth. PHP routes (`kirby/config/api/routes/*.php`) are consulted only when JSDoc on the JS wrapper is missing.

### `api-core`

- **Symbols**: PanelApi, PanelApiRequestOptions, PanelApiPagination, PanelApiSearchQuery, PanelModelData, PanelApiAuth, PanelApiLoginData
- **K6 TS**: `panel/src/api/index.ts` only (auth + verb wrappers still JS – see below)
- **K5 JS**: `panel/src/api/{index,request,get,post,patch,delete,auth}.js`. K6 still uses `auth.js`; the rename `ping` → `pingId` in K6's `auth.js` is verified vs K5.

### `api-content`

- **Symbols**: PanelApiPages\*, PanelApiSite, PanelApiFiles
- **K6 TS**: no K6 source (`pages.js`/`site.js`/`files.js` byte-identical to K5)
- **K5 JS**: `panel/src/api/{pages,site,files}.js`

### `api-users`

- **Symbols**: PanelApiUsers*, PanelApiRoles, PanelApiLanguages*
- **K6 TS**: no K6 source (`users.js`/`roles.js`/`languages.js` byte-identical to K5)
- **K5 JS**: `panel/src/api/{users,roles,languages}.js`

### `api-system`

- **Symbols**: PanelApiTranslations, PanelApiSystem\*
- **K6 TS**: no K6 source (`translations.js`/`system.js` byte-identical to K5)
- **K5 JS**: `panel/src/api/{translations,system}.js`

## helpers.d.ts (3 clusters)

K6 has migrated most helpers to TS. JS source is the runtime contract; K6 TS gives stricter signatures.

### `helpers-data`

- **Sub-properties on `PanelHelpers`**: `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut), `writer` (K6-added shortcut – verify against `helpers/index.ts`)
- **K6 TS**: `panel/src/helpers/{array,object,sort,field,page,ratio,embed}.ts`, `panel/src/helpers/index.ts`. Note: `helpers/file.ts` does not exist – K6 still imports `./file.js`. K6 added `helper.writer` (registered in `helpers/index.ts`); record as missing if absent in `PanelHelpers`.
- **K5 JS**: `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed,index}.js`

### `helpers-string`

- **Sub-properties on `PanelHelpers`**: `string`, `url`, `link`, `keyboard`, `focus`, `clipboard`, `color`, `pad`, `slug`, `uuid` (shortcuts)
- **K6 TS**: `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color}.ts`, `panel/src/helpers/index.ts`. Note: K6 added `string.sanitizeHTML`, widened `url.isUrl` to a type predicate, and tolerates `unknown` in many entry points.
- **K5 JS**: `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color,index}.js`

### `helpers-util`

- **Sub-properties on `PanelHelpers`**: `debounce`, `throttle`, `isComponent`, `isUploadEvent`, `upload`
- **K6 TS**: `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload}.ts`. Note: K6 `isComponent` gained an optional `app?: App` parameter; `upload` returns `Promise<unknown>`.
- **K5 JS**: `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload,queue,regex,index}.js`. `queue` and `regex` are NOT registered on `$helper` (regex is a side-effect global augment of `RegExp.escape`). Don't flag them as missing.

## libraries.d.ts

### `libraries`

- **Symbols**: PanelLibrary, PanelLibraryColors, PanelLibraryDayjs, PanelDayjsExtensions, PanelDayjsStaticExtensions, PanelDayjsPattern, PanelLibraryAutosize
- **K6 TS**: `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-{interpret,iso,merge,pattern,round,validate}}.ts`. Note: K6 uses `declare module 'dayjs'` to globally augment `Dayjs`; kirby-types intentionally avoids that and keeps `Dayjs & PanelDayjsExtensions` intersection on chainable returns.
- **K5 JS**: `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-*}.js` + `@types/autosize`

## writer.d.ts (3 clusters)

K6 has only migrated `Emitter.ts` and `Utils/index.ts` so far. `Mark.js`, `Node.js`, and the `Marks/*.js` / `Nodes/*.js` extensions are byte-identical between K5 and K6.

### `writer-editor`

- **Symbols**: WriterEditor, WriterToolbarButton, WriterUtils, WriterMarkContext, WriterNodeContext, WriterExtensionContext, WriterExtension
- **K6 TS**: `panel/src/components/Forms/Writer/{Emitter.ts,Utils/index.ts}` (rest still `.js`)
- **K5 JS**: `panel/src/components/Forms/Writer/{Editor,Extension,Extensions,Emitter,Utils/*,Extensions/*}.js`

### `writer-marks`

- **Symbols**: WriterMarkExtension
- **K6 TS**: no K6 source (still `.js`)
- **K5 JS**: `panel/src/components/Forms/Writer/{Mark.js,Marks/*.js}`

### `writer-nodes`

- **Symbols**: WriterNodeExtension
- **K6 TS**: no K6 source (still `.js`)
- **K5 JS**: `panel/src/components/Forms/Writer/{Node.js,Nodes/*.js}`

## textarea.d.ts

### `textarea`

- **Symbols**: TextareaButton, TextareaToolbarContext
- **K6 TS**: no K6 source (Vue components, not migrated). K6 `plugins.ts` only widens `textareaButtons` to `Record<string, unknown>`.
- **K5 JS**: `panel/src/components/Forms/Toolbar/{TextareaToolbar.vue,Toolbar.vue,index.js,EmailDialog.vue,LinkDialog.vue}` + `panel/src/components/Forms/Input/TextareaInput.vue`

## index.d.ts (4 clusters)

### `index-panel`

- **Symbols**: Panel, PanelApp, PanelComponentExtension, PanelPlugins, PanelPluginExtensions, PanelGlobalState, PanelRequestResponse, PanelSearchType, PanelSearches, PanelUrls
- **PHP**: `kirby/src/Panel/{Panel,State,View}.php` for urls/globals/searches
- **K6 TS**: `panel/src/panel/{plugins,request,search}.ts` (K6 `panel.js` and `app.js` are still JS). Plugin shape is Vue 3 (`App`, `Plugin`, `ConcreteComponent`, `ComponentOptions`). K6 adds `panel.observers` (`reactive({ resize: ResizeObserver })` from `panel/src/panel/observers.ts`) – flag as missing/`@since 6` if absent.
- **K5 JS**: `panel/src/panel/{panel,plugins,request,search,app}.js`, `panel/src/index.js`, `panel/public/js/plugins.js`

### `index-config`

- **Symbols**: PanelConfig, PanelLanguageInfo
- **PHP**: `kirby/src/Panel/{View,Document,State}.php`, `kirby/src/Cms/Language.php`
- **K6 TS**: no K6 source (K6 `panel.js` is still JS – its `defaults` and `globals` are byte-similar to K5)
- **K5 JS**: `panel/src/panel/panel.js` (defaults)

### `index-permissions`

PHP-rooted cluster. JS only consumes the JSON; do not compare against JS for these.

- **Symbols**: PanelPermissions, PanelPermissions{Access,Files,Languages,Pages,Site,Users,User}
- **PHP**: `kirby/src/Cms/{Permissions,UserPermissions,FilePermissions,PagePermissions,SitePermissions,LanguagePermissions}.php`, `kirby/src/Panel/View.php`
- **K6 TS**: no K6 source (no TS Permissions types). K6 PHP refactored internals (`$actions` → `$defaults`, added `$extendedAreas`) but the public `toArray()` shape is unchanged.
- **K5 JS**: not source-of-truth for this cluster

### `index-viewprops`

PHP-rooted cluster. PHP `props()` / `toArray()` is the response shape.

- **Symbols**: PanelViewProps, PanelViewProps{LockUser,Lock,Permissions,Versions,Tab,Navigation,Model,Button}
- **PHP**: `kirby/src/Panel/{Model,View,Page,File,User,Site}.php`, `kirby/src/Cms/{Page,File,User,Site}Blueprint.php`, `kirby/src/Panel/Ui/Buttons/ViewButton{,s}.php`, `kirby/src/Content/Lock.php`
- **K6 TS**: K6 has `ViewState` etc. in `panel/src/panel/view.ts` but it is JS-side state, not the full server `props` payload. Do NOT import K6 ViewState shape for `PanelViewProps`. K6 also restructured view props through `ModelViewController` (adds `component`, `breadcrumb`, always-present `next`/`prev`/`title`, drops legacy nested `model`) – record as drift only when targeting K5.
- **K5 JS**: not source-of-truth for this cluster
