/* eslint-disable perfectionist/sort-named-exports */

/**
 * Types for the `Panel` interface, plus the re-exports of every Panel module.
 */

import type {
  App,
  AppConfig,
  ComponentCustomProperties,
  ComponentOptions,
  ComponentPublicInstance,
  ConcreteComponent,
  DefineComponent,
  Plugin,
} from "vue";
import type { KirbyAnyFieldProps, KirbyModelImage } from "../blueprint";
import type { PanelApi } from "./api";
import type {
  PanelContext,
  PanelFeatureDefaults,
  PanelRequestOptions,
  PanelResponseActions,
} from "./base";
import type * as PanelFeatures from "./features";
import type { PanelHelpers } from "./helpers";
import type { PanelLibrary } from "./libraries";
import type { TextareaButton } from "./textarea";
import type { WriterMarkExtension, WriterNodeExtension } from "./writer";

// #region Re-exports from api.d.ts

export type {
  PanelApiAuth,
  PanelApiCollectionResponse,
  PanelApiFiles,
  PanelApiLanguageData,
  PanelApiLanguages,
  PanelApiLoginData,
  PanelApiPageCreateData,
  PanelApiPageDuplicateOptions,
  PanelApiPages,
  PanelApiPagination,
  PanelApiRequestOptions,
  PanelApiRoles,
  PanelApiSearchQuery,
  PanelApiSite,
  PanelApiSystem,
  PanelApiSystemInstallData,
  PanelApiSystemRegisterData,
  PanelApiTranslation,
  PanelApiTranslations,
  PanelApiUserCreateData,
  PanelApiUsers,
  PanelApi,
  PanelModelData,
} from "./api";
// #endregion

// #region Re-exports from base.d.ts

export type {
  PanelState,
  PanelEventCallback,
  PanelEventListenerMap,
  PanelEventListeners,
  PanelFeatureDefaults,
  PanelFeature,
  PanelModalEvent,
  PanelModalListeners,
  PanelResponseActions,
  PanelModalSubmitResponse,
  PanelModalDefaults,
  PanelModal,
  PanelHistoryMilestone,
  PanelHistory,
  PanelRequestOptions,
  PanelRefreshOptions,
  PanelContext,
  NotificationType,
  NotificationTheme,
} from "./base";
// #endregion

// #region Re-exports from features.d.ts

export type {
  PanelTimer,
  PanelActivation,
  PanelDrag,
  PanelThemeValue,
  PanelTheme,
  PanelLanguage,
  PanelMenuButtonProps,
  PanelMenuItem,
  PanelMenu,
  PanelNotificationOptions,
  PanelErrorObject,
  PanelNotification,
  PanelSystem,
  PanelTranslation,
  PanelUser,
  PanelBreadcrumbItem,
  PanelView,
  PanelDropdownOption,
  PanelDropdown,
  PanelDialog,
  PanelDrawer,
  PanelContentVersion,
  PanelContentVersions,
  PanelContentLock,
  PanelContentEnv,
  PanelContent,
  PanelSearchPagination,
  PanelSearchOptions,
  PanelSearchResponse,
  PanelSearcher,
  PanelUploadFile,
  PanelUpload,
  PanelEventEmitter,
  PanelEvents,
} from "./features";
// #endregion

// #region Re-exports from helpers.d.ts

export type { PanelHelpers } from "./helpers";
// #endregion

// #region Re-exports from libraries.d.ts

export type { PanelLibrary } from "./libraries";
// #endregion

// #region Re-exports from textarea.d.ts

export type { TextareaButton, TextareaToolbarContext } from "./textarea";
// #endregion

// #region Re-exports from writer.d.ts

export type {
  WriterEditor,
  WriterEditorEvents,
  WriterEditorSelectPayload,
  WriterEditorTransactionPayload,
  WriterToolbarButton,
  WriterUtils,
  WriterMarkContext,
  WriterNodeContext,
  WriterExtensionContext,
  WriterExtension,
  WriterMarkExtension,
  WriterNodeExtension,
} from "./writer";
// #endregion

// #region Panel App

/**
 * Global properties the Panel installs on every component instance.
 *
 * @example
 * ```ts
 * // In a Vue component
 * const slug = this.$helper.slug("My Page Title");
 * const date = this.$library.dayjs("2024-01-15").format("DD.MM.YYYY");
 * ```
 * @source panel/src/panel/panel.ts
 * @source panel/src/panel/legacy.ts
 * @source panel/src/index.ts
 * @source panel/src/helpers/index.ts
 * @source panel/src/libraries/index.ts
 * @source panel/src/types/vue.d.ts
 */
export interface PanelGlobalProperties {
  $panel: Panel;
  $library: PanelLibrary;
  $helper: PanelHelpers;
  /** Escapes HTML; alias of `$helper.string.escapeHTML()`. */
  $esc: PanelHelpers["string"]["escapeHTML"];
  // #region Shortcuts

  $api: PanelApi;
  /** Opens a dialog; alias of `$panel.dialog.open()`. */
  $dialog: PanelFeatures.PanelDialog["open"];
  /** Opens a drawer; alias of `$panel.drawer.open()`. */
  $drawer: PanelFeatures.PanelDrawer["open"];
  /**
   * Returns a closure that opens a dropdown; alias of
   * `$panel.dropdown.openAsync()`.
   */
  $dropdown: PanelFeatures.PanelDropdown["openAsync"];
  $events: PanelFeatures.PanelEvents;
  /** Opens a view; alias of `$panel.view.open()`. */
  $go: PanelFeatures.PanelView["open"];
  /** Wraps a value as trusted HTML; alias of `$panel.html()`. */
  $h: Panel["html"];
  /** Reloads the current view; alias of `$panel.reload()`. */
  $reload: Panel["reload"];
  /** Translates a key; alias of `$panel.t()`. */
  $t: Panel["t"];
  /** Translates a key into trusted HTML; alias of `$panel.th()`. */
  $th: Panel["th"];
  /** Builds a Panel URL; alias of `$panel.url()`. */
  $url: Panel["url"];
  // #endregion
}

/**
 * @source panel/src/panel/panel.ts
 * @source panel/src/index.ts
 * @source panel/src/types/vue.d.ts
 */
export type PanelApp = Omit<App, "config"> & {
  config: Omit<AppConfig, "globalProperties"> & {
    globalProperties: ComponentCustomProperties & PanelGlobalProperties;
  };
};
// #endregion

// #region Plugin Component Types

/**
 * Vue component options for Panel plugin extensions.
 *
 * Components can be an options object or a `defineComponent()` result that
 * provides at least one of:
 * - a template
 * - a render function
 * - a `setup()` function
 * - an `extends` component.
 *
 * Without any of them, the component is skipped with a console warning.
 * @source panel/src/panel/plugins.ts
 */
export type PanelComponentExtension =
  | DefineComponent<any, any, any, any, any, any, any, any, any, any, any>
  | (Omit<ComponentOptions<any>, "mixins" | "extends" | "render"> & {
      /** Component to extend, by name (e.g., `"k-text-field"`) or by options. */
      extends?: string | ComponentOptions<any> | ConcreteComponent;
      /** Named mixins (`"dialog"`, `"drawer"`) or component objects. */
      mixins?: (string | ComponentOptions<any> | ConcreteComponent)[];
      /** `null` clears an inherited render function so the component's own template applies. */
      render?: ComponentOptions<any>["render"] | null;
    });
// #endregion

// #region Panel Configuration

/**
 * Panel settings from the site config.
 *
 * @source panel/src/panel/panel.ts
 * @source src/Panel/State.php
 */
export interface PanelConfig {
  api: {
    /**
     * Whether API requests other than `GET` and `POST` are sent as `POST` with
     * an `X-HTTP-Method-Override` header.
     */
    methodOverride: boolean;
  };
  debug: boolean;
  /**
   * Whether the textarea toolbar writes links and emails as KirbyText tags
   * instead of Markdown, from the `panel.kirbytext` option.
   */
  kirbytext: boolean;
  /**
   * Default color theme from the `panel.theme` option (`"system"` unless
   * configured). A theme the user picks overrides it.
   */
  theme: string;
  /**
   * Interface language code from the `panel.language` option, `"en"` unless
   * configured. The active interface translation lives on
   * `panel.translation`.
   */
  translation: string;
  /**
   * Chunk size in bytes for chunked file uploads, kept below the server's
   * upload limit.
   */
  upload: number;
  /**
   * Maximum number of files uploaded in parallel, from the `panel.uploads`
   * option (`3` unless configured).
   */
  uploads: number;
}
// #endregion

// #region Panel Permissions

/**
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsAccess {
  /**
   * Access to custom Panel areas registered by plugins, keyed by area id;
   * present for every registered area.
   */
  [area: string]: boolean;
  account: boolean;
  languages: boolean;
  panel: boolean;
  site: boolean;
  system: boolean;
  users: boolean;
}

/**
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsFiles {
  access: boolean;
  changeName: boolean;
  changeTemplate: boolean;
  create: boolean;
  delete: boolean;
  list: boolean;
  read: boolean;
  replace: boolean;
  sort: boolean;
  update: boolean;
}

/**
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsLanguages {
  create: boolean;
  delete: boolean;
  update: boolean;
}

/**
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsPages {
  access: boolean;
  changeSlug: boolean;
  changeStatus: boolean;
  changeTemplate: boolean;
  changeTitle: boolean;
  create: boolean;
  delete: boolean;
  duplicate: boolean;
  list: boolean;
  move: boolean;
  preview: boolean;
  read: boolean;
  sort: boolean;
  update: boolean;
}

/**
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsSite {
  access: boolean;
  changeTitle: boolean;
  preview: boolean;
  update: boolean;
}

/**
 * User management permissions (for other users).
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsUsers {
  access: boolean;
  changeEmail: boolean;
  changeLanguage: boolean;
  changeName: boolean;
  changePassword: boolean;
  changeRole: boolean;
  create: boolean;
  delete: boolean;
  list: boolean;
  update: boolean;
}

/**
 * Current user permissions (for own account).
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsUser {
  access: boolean;
  changeEmail: boolean;
  changeLanguage: boolean;
  changeName: boolean;
  changePassword: boolean;
  changeRole: boolean;
  delete: boolean;
  list: boolean;
  update: boolean;
}

/**
 * Permissions of the logged-in user's role. A model's blueprint `options`
 * can override them – read a model view's `permissions` prop for that model.
 *
 * @source panel/src/panel/panel.ts
 * @source src/Cms/AppPlugins.php
 * @source src/Cms/Permissions.php
 * @source src/Panel/State.php
 */
export interface PanelPermissions {
  access: PanelPermissionsAccess;
  files: PanelPermissionsFiles;
  languages: PanelPermissionsLanguages;
  pages: PanelPermissionsPages;
  site: PanelPermissionsSite;
  users: PanelPermissionsUsers;
  user: PanelPermissionsUser;
  /**
   * Permission categories registered by plugins, keyed by the plugin name
   * with `/` replaced by `.` (`acme/shop` registers `acme.shop`).
   */
  [category: `${string}.${string}`]: Record<string, boolean>;
}
// #endregion

// #region Panel Search

/**
 * Search type an accessible area registers.
 * @source src/Panel/State.php
 * @source panel/src/panel/search.ts
 */
export interface PanelSearchType {
  /** `"search"` unless the area's search sets an icon. */
  icon: string;
  /** Search id turned into a label unless the area's search sets one. */
  label: string;
  id: string;
}

/**
 * Available search types in the Panel.
 * @source panel/src/panel/panel.ts
 * @source src/Panel/State.php
 * @source src/Panel/Area.php
 * @source config/areas/site/searches.php
 * @source config/areas/users/searches.php
 */
export interface PanelSearches {
  /**
   * Omitted when the user has no access to the site area or a plugin
   * disables the search.
   */
  pages?: PanelSearchType;
  /**
   * Omitted when the user has no access to the site area or a plugin
   * disables the search.
   */
  files?: PanelSearchType;
  /**
   * Omitted when the user has no access to the users area or a plugin
   * disables the search.
   */
  users?: PanelSearchType;
  [key: string]: PanelSearchType | undefined;
}
// #endregion

// #region Panel URLs

/**
 * @source panel/src/panel/panel.ts
 * @source src/Panel/State.php
 */
export interface PanelUrls {
  api: string;
  /** URL of the Panel's icon sprite. */
  icons: string;
  panel: string;
  site: string;
}
// #endregion

// #region Panel Request Response

/**
 * Result of `panel.request()`.
 *
 * @source panel/src/panel/request.ts
 * @source panel/src/panel/html.ts
 */
export interface PanelRequestResponse {
  /**
   * Request built from the URL and the query, with the Panel's headers unless
   * `external` is set.
   */
  request: Request;
  /**
   * Parsed response: a plain object that exposes the pre-resolved body
   * (`json`, `text`) alongside status metadata.
   */
  response: {
    headers: Headers;
    /**
     * Parsed JSON body. On a Panel request, each `<key>` entry arrives renamed
     * to `key`, its strings wrapped as `HtmlString`. On an external request,
     * `null` unless the response is valid JSON.
     */
    json: any;
    ok: boolean;
    status: number;
    statusText: string;
    text: string;
    /** Final response URL (after redirects). */
    url: string;
  };
}
// #endregion

// #region Panel Plugin Extensions

/**
 * Extensions object passed to `window.panel.plugin()`.
 *
 * @example
 * ```ts
 * window.panel.plugin("my-plugin", {
 *   // Custom block types
 *   blocks: {
 *     video: `<k-block-video :source="content.source" />`
 *   },
 *
 *   // Custom field types
 *   fields: {
 *     "color-picker": {
 *       extends: "k-text-field",
 *       template: `<k-field v-bind="$props">...</k-field>`
 *     }
 *   },
 *
 *   // Textarea toolbar buttons
 *   textareaButtons: {
 *     timestamp: {
 *       label: "Insert Timestamp",
 *       icon: "clock",
 *       click() {
 *         this.command("insert", () => new Date().toISOString());
 *       }
 *     }
 *   },
 *
 *   // Writer marks and nodes
 *   writerMarks: {
 *     highlight: {
 *       button: { icon: "highlight", label: "Highlight" },
 *       schema: {
 *         parseDOM: [{ tag: "mark" }],
 *         toDOM: () => ["mark", 0]
 *       }
 *     }
 *   }
 * });
 * ```
 *
 * @source panel/public/js/plugins.js
 * @source panel/src/panel/plugins.ts
 * @source panel/src/panel/app.ts
 */
export interface PanelPluginExtensions {
  /**
   * Custom block types for the blocks field.
   *
   * Can be either a template string (shorthand) or a component options object.
   * Registered as `k-block-type-${name}` components that extend
   * `k-block-type-default` unless they set their own `extends`.
   */
  blocks?: Record<string, string | PanelComponentExtension>;

  /**
   * Vue components to register globally in the Panel. A name an existing
   * component already has, core components included, replaces that component
   * with a console warning.
   */
  components?: Record<string, PanelComponentExtension>;

  /**
   * Custom field types.
   *
   * Registered as `k-${name}-field` components.
   */
  fields?: Record<string, PanelComponentExtension>;

  /**
   * Inner SVG markup of a 24×24 icon, without the wrapping `<svg>`, keyed by
   * icon name.
   */
  icons?: Record<string, string>;

  /**
   * View button components.
   *
   * Registered as `k-${name}-view-button` components.
   */
  viewButtons?: Record<string, PanelComponentExtension>;

  /** Vue plugins to install via `app.use()`. */
  use?: Record<string, Plugin> | Plugin[];

  /**
   * Runs in the `created` hook of the Panel's root component and receives
   * that component instance. The application itself is available as
   * `window.panel.app`. A callback that throws shows an error notification,
   * and the other plugins' callbacks still run.
   *
   * @example
   * ```ts
   * window.panel.plugin("my-plugin", {
   *   created(instance) {
   *     console.log("Panel created", instance.$panel);
   *   }
   * });
   * ```
   */
  created?: (instance: ComponentPublicInstance) => void;

  textareaButtons?: Record<string, TextareaButton>;

  /**
   * Arbitrary data for other plugins to read, such as configuration.
   */
  thirdParty?: Record<string, any>;

  /**
   * Custom Writer inline formatting marks.
   */
  writerMarks?: Record<string, WriterMarkExtension>;

  /**
   * Custom Writer block-level nodes.
   */
  writerNodes?: Record<string, WriterNodeExtension>;
}
// #endregion

// #region Panel Plugins

/**
 * Components, icons, and extensions registered by plugins.
 *
 * @source panel/src/panel/plugins.ts
 * @source panel/public/js/plugins.js
 * @source panel/src/panel/app.ts
 */
export interface PanelPlugins {
  // #region Helper Functions

  /**
   * Resolves an `extends` given as a component name to that component, or
   * drops it with a console warning when no such component is registered.
   *
   * @param name - Component name being registered
   * @returns The component options, mutated in place
   */
  resolveComponentExtension: (
    app: App,
    name: string,
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Replaces the mixin names `"dialog"` and `"drawer"` with their mixins,
   * skipping one the extended component already includes. Drops any other
   * mixin name with a console warning.
   *
   * @returns The component options, mutated in place
   */
  resolveComponentMixins: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Sets `render` to `null` when the component has a template, so the
   * template wins over an inherited render function.
   *
   * @returns The component options, mutated in place
   */
  resolveComponentRender: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;
  // #endregion

  // #region Plugin Data

  components: Record<string, PanelComponentExtension>;

  /** Callbacks to run in the `created` hook of the root component. */
  created: ((instance: ComponentPublicInstance) => void)[];

  icons: Record<string, string>;

  textareaButtons: Record<string, TextareaButton>;

  thirdParty: Record<string, any>;

  /** Vue plugins installed via `app.use()`. */
  use: Plugin[];

  writerMarks: Record<string, WriterMarkExtension>;

  writerNodes: Record<string, WriterNodeExtension>;
  // #endregion
}
// #endregion

// #region Panel Language Info

/**
 * Language information for multi-language sites.
 * @source panel/src/panel/panel.ts
 * @source src/Cms/Language.php
 * @source src/Panel/State.php
 */
export interface PanelLanguageInfo {
  /** Language code (e.g., `"en"`, `"de"`). */
  code: string;
  default: boolean;
  direction: "ltr" | "rtl";
  /**
   * Whether the language is configured with an absolute `url` (e.g.
   * `https://example.de` or `//example.de`) rather than a path prefix.
   */
  hasCustomDomain: boolean;
  /** PHP locale settings keyed by `LC_*` integer constants (e.g., `LC_ALL`, `LC_CTYPE`). */
  locale: Record<number, string>;
  name: string;
  /** Slug transliteration rules, mapping a character to its replacement. */
  rules: Record<string, string>;
  /**
   * Language URL: the configured custom domain as is, else the language's
   * path (`/<code>` unless configured) on the site URL.
   */
  url: string;
}
// #endregion

// #region Panel Global State

/**
 * Global Panel state for `panel.state()`.
 * @source panel/src/panel/panel.ts
 * @source src/Panel/State.php
 */
export interface PanelGlobalState {
  config: PanelConfig;
  dialog: PanelFeatures.PanelDialogDefaults;
  drawer: PanelFeatures.PanelDrawerDefaults;
  dropdown: PanelFeatureDefaults;
  language: PanelFeatures.PanelLanguageDefaults;
  languages: PanelLanguageInfo[];
  license: Panel["license"];
  menu: PanelFeatures.PanelMenuDefaults;
  multilang: boolean;
  notification: PanelFeatures.PanelNotificationDefaults;
  permissions: PanelPermissions;
  searches: PanelSearches;
  system: PanelFeatures.PanelSystemDefaults;
  translation: PanelFeatures.PanelTranslationDefaults;
  urls: PanelUrls;
  user: PanelFeatures.PanelUserDefaults;
  view: PanelFeatures.PanelViewDefaults;
}

/**
 * State accepted by `panel.set()` and `panel.open()`. A global replaces its
 * current value whole when the new value has the same type; a feature state
 * and the view replace theirs, with omitted keys reset to their defaults.
 * `null` or `false` for a modal or the dropdown closes it; a modal's
 * `redirect` opens that path and skips the rest of the state.
 *
 * @source panel/src/panel/panel.ts
 */
type PanelStateInput = Partial<
  Pick<
    PanelGlobalState,
    | "config"
    | "languages"
    | "license"
    | "multilang"
    | "permissions"
    | "searches"
    | "urls"
  >
> & {
  [
    K in
      "language" | "notification" | "system" | "translation" | "user" | "view"
  ]?: Partial<PanelGlobalState[K]>;
} & {
  menu?: PanelGlobalState["menu"]["items"];
  dialog?:
    | (Partial<PanelGlobalState["dialog"]> & { redirect?: string })
    | null
    | false;
  drawer?:
    | (Partial<PanelGlobalState["drawer"]> & { redirect?: string })
    | null
    | false;
  dropdown?: Partial<PanelGlobalState["dropdown"]> | null | false;
};
// #endregion

// #region Panel HTML

/**
 * Trusted, pre-escaped HTML string wrapper that interpolates, concatenates,
 * and serializes like a plain string. Where `v-safe-html` escapes a plain
 * string, it writes an `HtmlString` through as HTML, and `th()` fills it into
 * a placeholder unescaped.
 * @source panel/src/panel/html.ts
 * @source panel/src/config/safeHtml.ts
 */
// eslint-disable-next-line ts/no-wrapper-object-types -- Mirrors the Panel's `class HtmlString extends String`.
export interface HtmlString extends String {}

/**
 * @source panel/src/panel/html.ts
 */
export interface PanelHtml {
  (value: unknown): HtmlString;
}
// #endregion

// #region Main Panel Interface

/**
 * Panel instance, holding every feature, the configuration, and the API
 * client.
 *
 * @example
 * ```ts
 * // `window.panel` in the browser, `this.$panel` inside components
 * const panel = window.panel;
 *
 * // Navigate to a page
 * await panel.view.open("/pages/home");
 *
 * // Open a dialog
 * await panel.dialog.open("pages/create");
 *
 * // Make an API request
 * const page = await panel.api.get("pages/home");
 * ```
 *
 * @source panel/src/panel/panel.ts
 * @source panel/src/index.ts
 * @source panel/src/panel/html.ts
 * @source panel/src/panel/legacy.ts
 * @source panel/src/panel/observers.ts
 * @source panel/src/panel/request.ts
 * @source panel/src/panel/search.ts
 * @source panel/src/panel/translation.ts
 * @source panel/src/helpers/url.ts
 * @source panel/public/js/plugins.js
 * @source src/Panel/State.php
 * @source src/Cms/LicenseStatus.php
 */
export interface Panel {
  // #region Core Properties

  readonly app: PanelApp;

  /**
   * Editing context: `"dialog"` while a dialog is open, else `"drawer"` while
   * a drawer is, else `"view"`.
   */
  readonly context: PanelContext;

  readonly debug: boolean;

  readonly direction: "ltr" | "rtl";

  /**
   * Document title. Setting it appends `" | "` and the system title when the
   * system has one.
   */
  get title(): string;
  set title(title: string | null);

  /**
   * Whether the Panel is loading: a URL through `open()`, a non-silent API
   * request, or results in the search view.
   */
  isLoading: boolean;

  /**
   * Whether the Panel lost its connection, from the browser's `offline`
   * event or a request that fails to reach the server.
   */
  isOffline: boolean;

  /**
   * Shared singleton observers. `resize` dispatches a `resize` `CustomEvent`
   * on each observed target, its `detail` holding the target's content
   * `width` and `height`.
   */
  observers: {
    resize: ResizeObserver;
  };

  /** Wraps a value as trusted, pre-escaped HTML. */
  html: PanelHtml;
  // #endregion

  // #region State Objects

  /** License activation state. */
  activation: PanelFeatures.PanelActivation;

  drag: PanelFeatures.PanelDrag;

  events: PanelFeatures.PanelEvents;

  /** Current content language, as opposed to the interface `translation`. */
  language: PanelFeatures.PanelLanguage;

  menu: PanelFeatures.PanelMenu;

  notification: PanelFeatures.PanelNotification;

  searcher: PanelFeatures.PanelSearcher;

  system: PanelFeatures.PanelSystem;

  theme: PanelFeatures.PanelTheme;

  translation: PanelFeatures.PanelTranslation;

  upload: PanelFeatures.PanelUpload;

  user: PanelFeatures.PanelUser;
  // #endregion

  // #region Features

  /** Content versioning and saving. */
  content: PanelFeatures.PanelContent;

  dropdown: PanelFeatures.PanelDropdown;

  view: PanelFeatures.PanelView;
  // #endregion

  // #region Modals (extend Modal)

  dialog: PanelFeatures.PanelDialog;

  drawer: PanelFeatures.PanelDrawer;
  // #endregion

  // #region Configuration

  api: PanelApi;

  config: PanelConfig;

  languages: PanelLanguageInfo[];

  license:
    | "active"
    | "acknowledged"
    | "demo"
    | "inactive"
    | "legacy"
    | "missing"
    | "unknown";

  multilang: boolean;

  permissions: PanelPermissions;

  plugins: PanelPlugins;

  searches: PanelSearches;

  /** Whether at least one search type is available to the user. */
  readonly hasSearch: boolean;

  urls: PanelUrls;
  // #endregion

  // #region Methods

  /**
   * Shows the response's `message`, emits its events, then opens its
   * `redirect` or, with `reload` set, reloads the view.
   */
  act: (
    response?: PanelResponseActions,
  ) => Promise<
    PanelGlobalState | PanelFeatures.PanelViewDefaults | false | undefined
  >;

  /**
   * Logs a deprecation warning.
   */
  deprecated: (message: string) => void;

  /**
   * Handles a thrown value: ignores aborted requests, navigates the browser
   * for a redirect, marks the Panel offline on a network failure, logs the
   * error in debug mode, and opens an error notification.
   *
   * @param error - Error, message, or any other thrown value
   * @param openNotification - Whether to show the notification (default: `true`)
   */
  error: (error: unknown, openNotification?: boolean) => void;

  /**
   * Sends a GET request through the Panel router.
   *
   * @returns Response data; `{}` for a `null` body, or for an external
   *   request whose response is not JSON
   */
  get: (url: string | URL, options?: PanelRequestOptions) => Promise<any>;

  /**
   * Opens a URL through the Panel router and sets the Panel state from the
   * response. A state object instead of a URL is set directly.
   *
   * @returns The new Panel state, or `undefined` on failure
   */
  open: (
    url: string | URL | PanelStateInput,
    options?: PanelRequestOptions,
  ) => Promise<PanelGlobalState | undefined>;

  /** Returns the open overlays, `"drawer"` before `"dialog"`. */
  overlays: () => ("drawer" | "dialog")[];

  /**
   * Registers a Panel plugin with its extensions. Available only while
   * plugin scripts load, before the Panel boots.
   *
   * @param name - Plugin name, by convention `vendor/plugin`, unused by the runtime
   *
   * @example
   * ```ts
   * window.panel.plugin("my-plugin", {
   *   fields: {
   *     "color-picker": {
   *       extends: "k-text-field",
   *       template: `<k-field v-bind="$props">...</k-field>`
   *     }
   *   },
   *   textareaButtons: {
   *     timestamp: {
   *       label: "Insert Timestamp",
   *       icon: "clock",
   *       click() {
   *         this.command("insert", () => new Date().toISOString());
   *       }
   *     }
   *   }
   * });
   * ```
   */
  plugin: (name: string, extensions: PanelPluginExtensions) => void;

  /**
   * Sends a POST request through the Panel router.
   *
   * @param data - Request body
   * @returns Response data
   */
  post: (
    url: string | URL,
    data?: any,
    options?: PanelRequestOptions,
  ) => Promise<any>;

  /**
   * Throws a redirect error that the Panel's error handler catches and
   * answers by navigating the browser to the absolute URL.
   *
   * @param path - Path or URL to navigate to
   */
  redirect: (path: string | URL) => never;

  /**
   * Reloads the current view.
   *
   * @returns The new view state, or `false` if the view has no path
   */
  reload: (
    options?: PanelRequestOptions,
  ) => Promise<PanelFeatures.PanelViewDefaults | false>;

  /**
   * Sends a request through the Panel router. A cross-origin URL or a
   * non-JSON response rejects with a redirect error, which `panel.error()`
   * turns into a page navigation.
   *
   * With `external: true`, sends a plain request to a third-party URL instead,
   * rejecting on a non-OK status.
   *
   * @param options - Request options, including the `method`
   */
  request: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelRequestResponse>;

  /**
   * Opens the search dialog with the search type preselected, or runs the
   * search when given a query. Without a type, both use the current view's
   * search type.
   *
   * @param type - Search type, such as `"pages"`, `"files"`, or `"users"`
   * @param options - Search options (`page`, `limit`)
   * @returns Search results when a query is provided, `undefined` if a newer search aborted the request
   */
  search: {
    (type?: string): Promise<void>;
    (
      type: string | undefined,
      query: string,
      options?: PanelFeatures.PanelSearchOptions,
    ): Promise<PanelFeatures.PanelSearchResponse | undefined>;
  };

  /**
   * Applies a new Panel state and opens the view, modals, and dropdown it
   * carries.
   */
  set: (state?: PanelStateInput) => void;

  /** Returns the globals and every feature's current state. */
  state: () => PanelGlobalState;

  /**
   * Translates a key into the current interface language, filling
   * `{placeholder}` values from `data`. A missing key falls back to
   * `fallback`, then to the key itself; a string second argument is the
   * fallback.
   */
  t: {
    (key: string, fallback: string): string;
    (key: string, data?: Record<string, any>, fallback?: string): string;
  };

  /** @deprecated Alias of `t()`; use `t()` instead. */
  $t: Panel["t"];

  /**
   * Translates a key like `t()`, but escapes every filled placeholder and
   * returns trusted HTML. Values already wrapped by `html()` pass through
   * unescaped.
   *
   * @param data - Placeholder values
   * @param fallback - Text used when the key is missing
   */
  th: {
    (key: string, fallback: string): HtmlString;
    (key: string, data?: Record<string, any>, fallback?: string): HtmlString;
  };

  /**
   * Creates a URL object for a Panel path.
   *
   * @param path - Path or URL to build (default: empty string)
   * @param origin - Base for a relative `path` (default: the base URL)
   */
  url: (
    path?: string | URL,
    query?: Record<string, any>,
    origin?: string | URL,
  ) => URL;
  // #endregion
}
// #endregion

// #region View Props

/**
 * Button in the view header.
 * @source src/Panel/Ui/Button/ViewButton.php
 * @source src/Panel/Ui/Button/ModelButton.php
 * @source src/Panel/Ui/Button.php
 * @source src/Panel/Ui/Button/ViewButtons.php
 * @source src/Panel/Ui/Component.php
 * @source src/Panel/Ui/Button/LanguagesButton.php
 */
export interface PanelViewPropsButton {
  component: string;
  key: string;
  props: {
    /** Badge on the button's top-right corner, like `{ text: 5, theme: "positive" }`. */
    badge?: Record<string, any>;
    class?: string;
    /** Value of the button's `aria-current` attribute. */
    current?: string | boolean;
    /** Dialog endpoint to open on click. */
    dialog?: string;
    disabled: boolean;
    /** Drawer endpoint to open on click. */
    drawer?: string;
    /** Whether the button opens a dropdown. */
    dropdown?: boolean;
    /** Whether another translation has unsaved changes. Present on the languages button. */
    hasDiff?: boolean;
    icon?: string;
    link?: string;
    /**
     * Dropdown options: an inline list, or the path of a dropdown endpoint
     * that loads them.
     */
    options?: string | (Record<string, any> | "-")[];
    responsive: boolean | string;
    size?: string;
    style?: string;
    target?: string;
    /** Visible button label. */
    text?: string;
    /** Visual theme variant (e.g., `"positive"`, `"negative"`). */
    theme?: string;
    title?: string;
    type: string;
    variant?: string;
    /** Extra props a plugin or config button passes through. */
    [key: string]: any;
  };
}

/**
 * User who last edited the content, or the current user when there are no
 * unsaved changes. Both fields are `null` when that user is unknown or not
 * listable.
 * @source src/Content/Lock.php
 */
export interface PanelViewPropsLockUser {
  id: string | null;
  email: string | null;
}

/**
 * Content lock state.
 * @source src/Content/Lock.php
 * @source src/Panel/Controller/View/ModelViewController.php
 * @source panel/src/panel/content.ts
 */
export interface PanelViewPropsLock {
  isLegacy: boolean;
  isLocked: boolean;
  /**
   * ISO 8601 timestamp of the last change. The Panel replaces it with a
   * `Date` after each save of the current view.
   */
  modified: string | Date | null;
  user: PanelViewPropsLockUser;
}

/**
 * Content permissions for a view.
 * @source src/Guards/ModelGuards.php
 * @source src/Blueprint/PageBlueprint.php
 * @source src/Blueprint/FileBlueprint.php
 * @source src/Blueprint/UserBlueprint.php
 * @source src/Blueprint/SiteBlueprint.php
 * @source src/Panel/Controller/View/SiteViewController.php
 */
export interface PanelViewPropsPermissions {
  access: boolean;
  /** Present on User views. */
  changeEmail?: boolean;
  /** Present on User views. */
  changeLanguage?: boolean;
  /** Present on File and User views. */
  changeName?: boolean;
  /** Present on User views. */
  changePassword?: boolean;
  /** Present on User views. */
  changeRole?: boolean;
  /** Present on Page views. */
  changeSlug?: boolean;
  /** Present on Page views. */
  changeStatus?: boolean;
  /** Present on Page and File views. */
  changeTemplate?: boolean;
  /** Present on Page and Site views. */
  changeTitle?: boolean;
  /** Present on Page, File, and User views. */
  create?: boolean;
  /** Present on Page, File, and User views. */
  delete?: boolean;
  /** Present on Page views. */
  duplicate?: boolean;
  /** Present on Page, File, and User views. */
  list?: boolean;
  /** Present on Page views. */
  move?: boolean;
  /**
   * Present on Page and Site views; on Site views `true` only when both the
   * site and its home page allow the preview.
   */
  preview?: boolean;
  /** Present on Page and File views. */
  read?: boolean;
  /** Present on File views. */
  replace?: boolean;
  /** Present on Page and File views. */
  sort?: boolean;
  update: boolean;
}

/**
 * Form values of the saved (`latest`) and the unsaved (`changes`) content in
 * the current language. `changes` equals `latest` when nothing is unsaved.
 * @source src/Panel/Controller/View/ModelViewController.php
 */
export interface PanelViewPropsVersions {
  latest: Record<string, any>;
  changes: Record<string, any>;
}

/**
 * @source src/Blueprint/Normalizer.php
 * @source src/Blueprint/Tab.php
 */
export interface PanelViewPropsTabColumn {
  /** @default '1/1' */
  width: string;
  /** Resolved field props, keyed by the lowercase field name. */
  fields: Record<string, KirbyAnyFieldProps>;
  /** Any other key the blueprint sets on the column. */
  [key: string]: any;
}

/**
 * Active blueprint tab, its columns carrying the resolved field props.
 * @source src/Blueprint/Tab.php
 * @source src/Blueprint/Tabs.php
 */
export interface PanelViewPropsTab {
  label: string;
  /** `null` when the blueprint omits an icon. */
  icon: string | null;
  /**
   * List of columns, or an object keyed by column name when the blueprint
   * names its columns.
   */
  columns: PanelViewPropsTabColumn[] | Record<string, PanelViewPropsTabColumn>;
  link: string;
  name: string;
  /** Any other key the blueprint sets on the tab. */
  [key: string]: any;
}

/**
 * Link to a sibling model, for `next` and `prev`.
 * @source src/Panel/Model.php
 * @source src/Panel/Controller/View/ModelViewController.php
 * @source src/Panel/Controller/View/PageViewController.php
 * @source src/Panel/Controller/View/FileViewController.php
 * @source src/Panel/Controller/View/UserViewController.php
 */
export interface PanelViewPropsNavigation {
  link: string;
  title: string;
}

/**
 * Props of a page, site, file, or user view.
 * @source src/Panel/Controller/View/ModelViewController.php
 * @source src/Panel/Controller/View/PageViewController.php
 * @source src/Panel/Controller/View/SiteViewController.php
 * @source src/Panel/Controller/View/FileViewController.php
 * @source src/Panel/Controller/View/UserViewController.php
 * @source src/Panel/Ui/View.php
 * @source src/Panel/Ui/Component.php
 * @source src/Blueprint/Tab.php
 * @source src/Blueprint/Tabs.php
 */
export interface PanelViewProps {
  api: string;
  /** View buttons, with `"-"` separators between groups. */
  buttons: (PanelViewPropsButton | "-")[];
  id: string;
  link: string;
  lock: PanelViewPropsLock;
  permissions: PanelViewPropsPermissions;
  /** Tab bar entries. `fields` lists the lowercase names of the tab's fields. */
  tabs: {
    fields: string[];
    icon: string | null;
    label: string;
    link: string;
    name: string;
  }[];
  /** Absent when the `content.uuid` option is `false`. */
  uuid?: string;
  versions: PanelViewPropsVersions;
  /**
   * Active blueprint tab: the one the `tab` query parameter names, else the
   * first. Blueprint-level fields, sections or columns form a single tab, so
   * it is absent only for an empty blueprint.
   */
  tab?: PanelViewPropsTab;
  /** Link to the next sibling, `null` when there is none. */
  next: PanelViewPropsNavigation | null;
  /** Link to the previous sibling, `null` when there is none. */
  prev: PanelViewPropsNavigation | null;
  blueprint: string;
  title: string;
}

/**
 * @source src/Panel/Controller/View/FileViewController.php
 * @source src/Panel/Ui/FilePreview.php
 * @source src/Panel/Ui/FilePreview/ImageFilePreview.php
 */
export interface PanelFileViewProps extends PanelViewProps {
  extension: string;
  filename: string;
  mime?: string;
  /** Preview component the view renders above its tabs. */
  preview: {
    component: string;
    key: string;
    props: {
      /** Rows of the details table; `text` is `null` for an unknown MIME type. */
      details: { title: string; text: string | null; link?: string }[];
      image?: KirbyModelImage;
      url: string;
      /** Whether the editor can set a focus point. Present on image previews. */
      focusable?: boolean;
      /** Aspect ratio, present only for an SVG without a natural size. */
      ratio?: number;
      /** Extra props a plugin's file preview passes. */
      [key: string]: any;
    };
  };
  type?: string;
  url: string;
}

/**
 * Props of a user view, also sent to the account view.
 *
 * @source src/Panel/Controller/View/UserViewController.php
 * @source src/Panel/Model.php
 */
export interface PanelUserViewProps extends PanelViewProps {
  avatar?: string;
  /**
   * Whether the logged-in user may change this user's email; also `false`
   * while another user has unsaved changes to the content.
   */
  canChangeEmail: boolean;
  /**
   * Whether the logged-in user may change this user's language; also `false`
   * while another user has unsaved changes to the content.
   */
  canChangeLanguage: boolean;
  /**
   * Whether the logged-in user may change this user's name; also `false`
   * while another user has unsaved changes to the content.
   */
  canChangeName: boolean;
  /** Whether the logged-in user may move this user to another role. */
  canChangeRole: boolean;
  email?: string;
  /** Name of the user's Panel language. */
  language: string;
  name: string;
  /** Title of the user's role. */
  role: string;
  username?: string;
}
// #endregion
