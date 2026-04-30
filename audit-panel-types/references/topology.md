# Topology – pass 1 cluster → Kirby source mapping

Each row is one agent. Paste the relevant rows into the agent prompt template in [agent-pass1.md](agent-pass1.md).

## base.d.ts

| Cluster | Owns symbols                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Kirby sources                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `base`  | `PanelState`, `PanelStateBase`, `PanelFeature`, `PanelFeatureDefaults`, `PanelFeatureBase`, `PanelModal`, `PanelModalEvent`, `PanelModalListeners`, `PanelModalBase`, `PanelSuccessResponse`, `PanelHistory`, `PanelHistoryMilestone`, `PanelHistoryBase`, `PanelEventCallback`, `PanelEventListenerMap`, `PanelEventListeners`, `PanelRequestOptions`, `PanelRefreshOptions`, `PanelContext`, `NotificationContext`, `NotificationType`, `NotificationTheme` | `panel/src/panel/{state,feature,modal,history,listeners,request,notification}.js` |

## features.d.ts (6 clusters)

| Cluster                 | Owns symbols                                                                                                                                                                          | Kirby sources                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `features-stateonly`    | `PanelTimer`, `PanelActivation*`, `PanelDrag*`, `PanelTheme*`, `PanelThemeValue`, `PanelLanguage*`, `PanelMenu*`, `PanelMenuEntry`, `PanelSystem*`, `PanelTranslation*`, `PanelUser*` | `panel/src/panel/{timer,activiation,drag,theme,language,menu,system,translation,user}.js` (note typo `activiation`) |
| `features-notification` | `PanelNotificationOptions`, `PanelErrorObject`, `PanelNotificationDefaults`, `PanelNotification`                                                                                      | `panel/src/panel/notification.js`, `panel/src/panel/timer.js`                                                       |
| `features-view`         | `PanelBreadcrumbItem`, `PanelViewDefaults`, `PanelView`, `PanelSearchPagination`, `PanelSearchOptions`, `PanelSearchResult`, `PanelSearcher`                                          | `panel/src/panel/{view,search,feature}.js`                                                                          |
| `features-upload`       | `PanelUploadFile`, `PanelUploadDefaults`, `PanelUpload`                                                                                                                               | `panel/src/panel/upload.js` (+ `panel/src/helpers/upload.js` for context)                                           |
| `features-content`      | `PanelContentVersion`, `PanelContentVersions`, `PanelContentLock`, `PanelContentEnv`, `PanelContent`                                                                                  | `panel/src/panel/content.js`                                                                                        |
| `features-modals`       | `PanelDropdownOption`, `PanelDropdownDefaults`, `PanelDropdown`, `PanelDialogDefaults`, `PanelDialog`, `PanelDrawerDefaults`, `PanelDrawer`, `PanelEventEmitter`, `PanelEvents`       | `panel/src/panel/{dropdown,dialog,drawer,events,modal,feature}.js`                                                  |

## api.d.ts (4 clusters)

| Cluster       | Owns symbols                                                                                                                             | Kirby sources                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `api-core`    | `PanelApi`, `PanelApiRequestOptions`, `PanelApiPagination`, `PanelApiSearchQuery`, `PanelModelData`, `PanelApiAuth`, `PanelApiLoginData` | `panel/src/api/{index,request,get,post,patch,delete,auth}.js` |
| `api-content` | `PanelApiPages*`, `PanelApiSite`, `PanelApiFiles`                                                                                        | `panel/src/api/{pages,site,files}.js`                         |
| `api-users`   | `PanelApiUsers*`, `PanelApiRoles`, `PanelApiLanguages*`                                                                                  | `panel/src/api/{users,roles,languages}.js`                    |
| `api-system`  | `PanelApiTranslations`, `PanelApiSystem*`                                                                                                | `panel/src/api/{translations,system}.js`                      |

JS client is the source of truth. Consult `kirby/config/api/routes/*.php` only when JSDoc on the JS wrapper is missing.

## helpers.d.ts (3 clusters)

| Cluster          | Owns sub-properties on `PanelHelpers`                                                               | Kirby sources                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `helpers-data`   | `array`, `object`, `sort`, `field`, `file`, `page`, `ratio`, `embed`, `clone` (shortcut)            | `panel/src/helpers/{array,object,sort,field,file,page,ratio,embed,index}.js`                  |
| `helpers-string` | `string`, `url`, `link`, `keyboard`, `focus`, `clipboard`, `color`, `pad` `slug` `uuid` (shortcuts) | `panel/src/helpers/{string,url,link,keyboard,focus,clipboard,color,index}.js`                 |
| `helpers-util`   | `debounce`, `throttle`, `isComponent`, `isUploadEvent`, `upload`                                    | `panel/src/helpers/{debounce,throttle,isComponent,isUploadEvent,upload,queue,regex,index}.js` |

`queue` and `regex` are NOT registered on `$helper` (regex is a side-effect global augment of `RegExp.escape`). Don't flag them as missing.

## libraries.d.ts

| Cluster     | Owns symbols                                                                                                                                                 | Kirby sources                                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `libraries` | `PanelLibrary`, `PanelLibraryColors`, `PanelLibraryDayjs`, `PanelDayjsExtensions`, `PanelDayjsStaticExtensions`, `PanelDayjsPattern`, `PanelLibraryAutosize` | `panel/src/libraries/{index,colors,colors-checks,colors-func,dayjs,dayjs-{interpret,iso,merge,pattern,round,validate}}.js` + `@types/autosize` |

## writer.d.ts (3 clusters)

| Cluster         | Owns symbols                                                                                                                                | Kirby sources                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `writer-editor` | `WriterEditor`, `WriterToolbarButton`, `WriterUtils`, `WriterMarkContext`, `WriterNodeContext`, `WriterExtensionContext`, `WriterExtension` | `panel/src/components/Forms/Writer/{Editor,Extension,Extensions,Emitter,Utils/*,Extensions/*}.js` |
| `writer-marks`  | `WriterMarkExtension`                                                                                                                       | `panel/src/components/Forms/Writer/{Mark.js,Marks/*.js}`                                          |
| `writer-nodes`  | `WriterNodeExtension`                                                                                                                       | `panel/src/components/Forms/Writer/{Node.js,Nodes/*.js}`                                          |

## textarea.d.ts

| Cluster    | Owns symbols                               | Kirby sources                                                                                                                                                         |
| ---------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `textarea` | `TextareaButton`, `TextareaToolbarContext` | `panel/src/components/Forms/Toolbar/{TextareaToolbar.vue,Toolbar.vue,index.js,EmailDialog.vue,LinkDialog.vue}` + `panel/src/components/Forms/Input/TextareaInput.vue` |

## index.d.ts (4 clusters)

| Cluster             | Owns symbols                                                                                                                                                                         | Kirby sources                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index-panel`       | `Panel`, `PanelApp`, `PanelComponentExtension`, `PanelPlugins`, `PanelPluginExtensions`, `PanelGlobalState`, `PanelRequestResponse`, `PanelSearchType`, `PanelSearches`, `PanelUrls` | `panel/src/panel/{panel,plugins,request,search,app}.js`, `panel/src/index.js`, `panel/public/js/plugins.js`                                                            |
| `index-config`      | `PanelConfig`, `PanelLanguageInfo`                                                                                                                                                   | `panel/src/panel/panel.js` (defaults) + PHP: `src/Panel/{View,Document}.php`, `src/Cms/Language.php`                                                                   |
| `index-permissions` | `PanelPermissions`, `PanelPermissions{Access,Files,Languages,Pages,Site,Users,User}`                                                                                                 | PHP: `src/Cms/{Permissions,UserPermissions,FilePermissions,PagePermissions,SitePermissions,LanguagePermissions}.php`, `src/Panel/View.php`                             |
| `index-viewprops`   | `PanelViewProps`, `PanelViewProps{LockUser,Lock,Permissions,Versions,Tab,Navigation,Model,Button}`                                                                                   | PHP: `src/Panel/{Model,View,Page,File,User,Site}.php`, `src/Cms/{Page,File,User,Site}Blueprint.php`, `src/Panel/Ui/Buttons/ViewButton{,s}.php`, `src/Content/Lock.php` |
