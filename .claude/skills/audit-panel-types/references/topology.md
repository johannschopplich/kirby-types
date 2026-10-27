# Topology

## base.d.ts

### `base`

- **Symbols**: PanelState, PanelFeature, PanelFeatureDefaults, PanelModal, PanelModalEvent, PanelModalListeners, PanelModalSubmitResponse, PanelHistory, PanelHistoryMilestone, PanelResponseActions, PanelEventCallback, PanelEventListenerMap, PanelEventListeners, PanelRequestOptions, PanelRefreshOptions, PanelContext, NotificationType, NotificationTheme
- **Modules**: `panel/src/panel/{state,feature,modal,listeners,request,notification}`, `panel/src/helpers/history`
- **PHP**: `src/Panel/Response/{View,Dialog,Drawer,Json}Response.php` (response keys)
- **Watch**: request emits `x-panel`, `x-panel-globals`, `x-panel-referrer`.

## features.d.ts

Hybrid clusters: defaults-as-runtime fallacy.

### `features-stateonly`

- **Symbols**: PanelTimer, PanelActivation*, PanelDrag*, PanelTheme*, PanelThemeValue, PanelLanguage*, PanelMenu*, PanelSystem*, PanelTranslation*, PanelUser*
- **Modules**: `panel/src/panel/{activation,drag,theme,language,menu,system,translation,user}`, `panel/src/helpers/timer`
- **PHP**: `src/Panel/State.php` (`$translation`, `$system`, `$language`, `$user`, `$menu` resolvers)
- **Watch**: `PanelSystem.title` stays `string` (PHP overrules Panel TS). Menu state is `items` of `{component, key, props}` UI-Button wrappers. `PanelLanguage` lacks `locale`/`url`: `state.set()` strips them before they reach `panel.language` – they belong on `PanelLanguageInfo`, not here.

### `features-notification`

- **Symbols**: PanelNotificationOptions, PanelErrorObject, PanelNotificationDefaults, PanelNotification
- **Modules**: `panel/src/panel/notification`, `panel/src/helpers/error` (internal `isAbortError`, never a public helper)
- **PHP**: silent (no `$notification` resolver – client-only state). Authority falls to the Panel source.

### `features-view`

- **Symbols**: PanelBreadcrumbItem, PanelViewDefaults, PanelView, PanelSearchPagination, PanelSearchOptions, PanelSearchResponse, PanelSearcher
- **Modules**: `panel/src/panel/{view,search,feature}`
- **PHP**: `src/Panel/{State,Page,File,User,Site}.php` (`$view` resolver + per-model props), `src/Panel/Controller/View/*ViewController.php` (breadcrumbs)

### `features-upload`

- **Symbols**: PanelUploadFile, PanelUploadReplaceFile, PanelUploadDefaults, PanelUpload
- **Modules**: `panel/src/panel/upload` (+ `panel/src/helpers/upload` for context)
- **PHP**: `src/Panel/File.php` (server file model for `replacing` / `completed`)
- **Watch**: the Panel TS reuses its queued-upload type for `replacing`; the `replacing` shape follows `File.php`.

### `features-content`

- **Symbols**: PanelContentVersion, PanelContentVersions, PanelContentLock, PanelContentEnv, PanelContent
- **Modules**: `panel/src/panel/content` (`renewLock`)
- **PHP**: `src/Content/{Lock,Version}.php`
- **Watch**: PanelContent is a plain `reactive({...})` returned by `Content(panel)`, outside the PanelFeature hierarchy.

### `features-modals`

- **Symbols**: PanelDropdownOption, PanelDropdown, PanelDialogDefaults, PanelDialog, PanelDrawerDefaults, PanelDrawer, PanelEventEmitter, PanelEvents
- **Modules**: `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}`
- **PHP**: `src/Panel/State.php` (`$dialogs`/`$drawers`/`$dropdowns` config endpoints), `src/Panel/Response/{Dialog,Drawer}Response.php`

## api.d.ts

JS/TS client is source of truth. PHP routes (`config/api/routes/*.php`) consulted only when JSDoc on the wrapper is missing.

### `api-core`

- **Symbols**: PanelApi, PanelApiRequestOptions, PanelApiPagination, PanelApiSearchQuery, PanelModelData, PanelApiAuth, PanelApiLoginData
- **Modules**: `panel/src/api/{index,auth}`, `panel/src/panel/request`. Verb helpers (`get/post/patch/delete/request`) are methods on the `Api` class in `index`. `auth.ping()` posts `auth/ping`. The `api.pingId` field and `api.ping()` method coexist.

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

JS/TS source is the runtime contract. Every `helperRegistrations` entry of the source map is a `PanelHelpers` member, else a `missing` finding.

### `helpers-data`

- **Symbols**: PanelHelpers, PanelHelpers{Array,Object,Field,File,Page,Embed,Writer,Number}, PanelArraySearchOptions, PanelSortOptions, PanelComparator, PanelFieldDefinition, PanelPageStatusProps, PanelPageStatusFlag
- **Sub-properties on `PanelHelpers`**: `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut), `writer` (shortcut), `items`, `number`
- **Modules**: `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed,writer,index,items,number}`. `helper.writer` is registered in `index` (check `source-map.json` `helperRegistrations`) backed by the `writer` module.

### `helpers-string`

- **Symbols**: PanelHelpers{String,Url,Clipboard,Keyboard,Link}, PanelSlugRules, PanelLink*
- **Sub-properties on `PanelHelpers`**: `string`, `url`, `link`, `keyboard`, `focus`, `clipboard`, `color`, `pad`, `slug`, `uuid` (shortcuts)
- **Modules**: `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color,index}`
- **Watch**: transformers keep `string` on their subject param (intentional DX / autocomplete), even though source widened to `unknown`; predicates take `unknown`.

### `helpers-util`

- **Symbols**: PanelUpload{Params,ProgressCallback,ResultCallback}, PanelDebounce*, PanelThrottle*
- **Sub-properties on `PanelHelpers`**: `debounce`, `throttle`, `isComponent`, `isUploadEvent`, `upload`
- **Modules**: `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload}`
- **Watch**: `queue` and `regex` live outside `$helper` (regex is a side-effect augment of `RegExp.escape`). `isComponent` takes the Vue `app`.

## libraries.d.ts

### `libraries`

- **Symbols**: PanelLibrary*, PanelColor*, PanelDayjs*
- **Modules**: `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-iso,dayjs-pattern,dayjs-round,dayjs-validate,dayjs-locale,dayjs-parse}` (+ `@types/autosize`)
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

- **Symbols**: TextareaButton, TextareaToolbarContext
- **Modules**: `panel/src/components/Forms/Toolbar/{TextareaToolbar,Toolbar,index,EmailDialog,LinkDialog}` (Vue components + index), `panel/src/components/Forms/Input/TextareaInput`, `panel/src/components/Dropdowns/Dropdown` (renders the dropdown items), `panel/src/components/Navigation/{Button,Link}` (render the buttons and their links)
- **Watch**: the Toolbar is Vue, not migrated to TS – the `.vue` source is the contract. `plugins` only widens `textareaButtons` to `Record<string, unknown>` (no button-shape opinion).

## index.d.ts

### `index-panel`

- **Symbols**: Panel, PanelApp, PanelComponentExtension, PanelPlugins, PanelPluginExtensions, PanelGlobalState, PanelRequestResponse, PanelSearchType, PanelSearches, PanelUrls, PanelGlobalProperties, PanelHtml, HtmlString
- **Modules**: `panel/src/panel/{panel,app,legacy,plugins,request,search}`, `panel/src/types/{vue,global}`, `panel/src/index`, `panel/src/panel/{html,observers}`
- **PHP**: `src/Panel/{Panel,State}.php` (urls/globals/searches)
- **Watch**: `PanelApp`/`PanelComponentExtension`/`PanelPlugins`/`PanelPluginExtensions`/`created` follow Vue 3 `App`/`Plugin`/`ComponentPublicInstance`. `panel.html` binds only the default factory while `HtmlString` is a separate export; `panel.observers` is a `reactive({ resize: ResizeObserver })`. Every `panelSingletons` entry of the source map is a `Panel` member, else a `missing` finding. The component globals – `PanelGlobalProperties`, which `panel-globals.d.ts` augments onto every component – mirror Kirby's own `ComponentCustomProperties` in `panel/src/types/vue`: a shortcut Kirby adds, drops, or deprecates there moves the same way here. `PanelComponentExtension` follows the `Component` type in `plugins`.

### `index-config`

- **Symbols**: PanelConfig, PanelLanguageInfo
- **Modules**: `panel/src/panel/panel` (the `Config` type + `config` defaults)
- **PHP**: `src/Panel/State.php`, `src/Panel/Response/ViewDocumentResponse.php`, `src/Cms/Language.php`
- **Watch**: defaults-as-runtime fallacy.

### `index-permissions`

PHP-rooted. PHP `toArray()` is the shape; JS only consumes the JSON.

- **Symbols**: PanelPermissions, PanelPermissions{Access,Files,Languages,Pages,Site,Users,User}
- **PHP**: `src/Cms/{Permissions,UserPermissions,FilePermissions,PagePermissions,SitePermissions,LanguagePermissions}.php`, `src/Panel/State.php`

### `index-viewprops`

PHP-rooted. PHP `props()` / `toArray()` is the response shape.

- **Symbols**: PanelViewProps, PanelViewProps{LockUser,Lock,Permissions,Versions,Tab,Navigation,Model,Button}, PanelFileViewProps, PanelUserViewProps
- **PHP**: `src/Panel/{Model,Page,File,User,Site}.php`, `src/Panel/Controller/View/ModelViewController.php`, `src/Blueprint/{Page,File,User,Site}Blueprint.php`, `src/Panel/Ui/Button.php`, `src/Panel/Ui/Button/ViewButton{,s}.php`, `src/Content/Lock.php`
- **Watch**: `ModelViewController` builds the props – always-present `next`/`prev`/`title`, no nested `model`; `component`/`breadcrumb`/`search` sit on the view envelope, not in `props`. The Panel's `ViewState` in `view` is JS-side state; the props type follows the server payload.
