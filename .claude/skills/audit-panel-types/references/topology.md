# Topology – pass 1 cluster → source mapping

23 clusters total. Paste the relevant cluster's entry into the agent prompt template in [agent-pass1.md](agent-pass1.md). Each entry lists the symbols the agent owns plus all three sources (PHP, K6 TS, K5 JS).

If a K6 source is unmigrated or a PHP source is silent, the agent records that as `no K6 source` / `PHP silent` and proceeds with the remaining sources.

## K6 file relocations to remember

- K5 `panel/src/panel/timer.js` → K6 `panel/src/helpers/timer.ts` (also: singleton became class, `interval` → `isRunning` getter)
- K5 `panel/src/panel/history.js` → K6 `panel/src/helpers/history.ts`
- K5 `panel/src/panel/activiation.js` → K6 `panel/src/panel/activation.ts` (typo fixed)

## base.d.ts

### `base`

- **Symbols**: PanelState, PanelStateBase, PanelFeature, PanelFeatureDefaults, PanelFeatureBase, PanelModal, PanelModalEvent, PanelModalListeners, PanelModalBase, PanelSuccessResponse, PanelHistory, PanelHistoryMilestone, PanelHistoryBase, PanelEventCallback, PanelEventListenerMap, PanelEventListeners, PanelRequestOptions, PanelRefreshOptions, PanelContext, NotificationContext, NotificationType, NotificationTheme
- **PHP**: `kirby/src/Panel/{View,Dialog,Drawer}.php`, `kirby/src/Panel/Json.php` (Fiber response keys)
- **K6 TS**: `panel/src/panel/{state,feature,modal,listeners,request,notification}.ts`; `panel/src/helpers/history.ts`
- **K5 JS**: `panel/src/panel/{state,feature,modal,history,listeners,request,notification}.js`

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
- **K6 TS**: `panel/src/panel/notification.ts`
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
- **K6 TS**: `panel/src/panel/content.ts` (note K6-only methods `unlock` and `renewLock` – skip if cluster targets K5)
- **K5 JS**: `panel/src/panel/content.js`

### `features-modals`

- **Symbols**: PanelDropdownOption, PanelDropdownDefaults, PanelDropdown, PanelDialogDefaults, PanelDialog, PanelDrawerDefaults, PanelDrawer, PanelEventEmitter, PanelEvents
- **PHP**: `kirby/src/Panel/View.php` (`$dialogs` / `$drawers` / `$dropdowns` config endpoints), `kirby/src/Panel/{Dialog,Drawer}.php`
- **K6 TS**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}.ts`
- **K5 JS**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}.js` (retains `legacy`/`ref`/`openComponent` for Vue-2 plugin compatibility)

## api.d.ts (4 clusters)

JS client (K5 + K6) is the source of truth. PHP routes (`kirby/config/api/routes/*.php`) are consulted only when JSDoc on the JS wrapper is missing.

### `api-core`

- **Symbols**: PanelApi, PanelApiRequestOptions, PanelApiPagination, PanelApiSearchQuery, PanelModelData, PanelApiAuth, PanelApiLoginData
- **K6 TS**: `panel/src/api/index.ts`, `panel/src/api/auth.ts` (K6 migrated; note rename `ping` → `pingId`, drop `running`, narrow `language: string`)
- **K5 JS**: `panel/src/api/{index,request,get,post,patch,delete,auth}.js`

### `api-content`

- **Symbols**: PanelApiPages\*, PanelApiSite, PanelApiFiles
- **K6 TS**: `panel/src/api/{pages,site,files}` (check; may still be `.js` – byte-identical to K5)
- **K5 JS**: `panel/src/api/{pages,site,files}.js`

### `api-users`

- **Symbols**: PanelApiUsers*, PanelApiRoles, PanelApiLanguages*
- **K6 TS**: `panel/src/api/{users,roles,languages}` (check; may still be `.js`)
- **K5 JS**: `panel/src/api/{users,roles,languages}.js`

### `api-system`

- **Symbols**: PanelApiTranslations, PanelApiSystem\*
- **K6 TS**: `panel/src/api/{translations,system}` (check; may still be `.js`)
- **K5 JS**: `panel/src/api/{translations,system}.js`

## helpers.d.ts (3 clusters)

K6 has migrated most helpers to TS. JS source is the runtime contract; K6 TS gives stricter signatures.

### `helpers-data`

- **Sub-properties on `PanelHelpers`**: `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut)
- **K6 TS**: `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed}.ts`, `panel/src/helpers/index.ts`
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
- **K6 TS**: `panel/src/panel/{panel,plugins,request,search}.ts`. Plugin shape is Vue 3 (`App`, `Plugin`, `ConcreteComponent`, `ComponentOptions`) – kirby-types stays Vue 2. Record plugin/PanelApp shape as drift only.
- **K5 JS**: `panel/src/panel/{panel,plugins,request,search,app}.js`, `panel/src/index.js`, `panel/public/js/plugins.js`

### `index-config`

- **Symbols**: PanelConfig, PanelLanguageInfo
- **PHP**: `kirby/src/Panel/{View,Document,State}.php`, `kirby/src/Cms/Language.php`
- **K6 TS**: `panel/src/panel/panel.ts` (defaults)
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
