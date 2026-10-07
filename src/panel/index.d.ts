/* eslint-disable perfectionist/sort-named-exports */

/**
 * Kirby Panel type definitions: the `Panel` interface and the re-exports of
 * every Panel module.
 */

import type {
  ComponentOptions,
  DefineComponent,
  PluginFunction,
  PluginObject,
  VueConstructor,
} from "vue";
import type { PanelApi } from "./api";
import type {
  PanelContext,
  PanelFeatureDefaults,
  PanelRequestOptions,
} from "./base";
import type * as PanelFeatures from "./features";
import type { PanelHelpers } from "./helpers";
import type { PanelLibrary } from "./libraries";
import type { TextareaButton } from "./textarea";
import type { WriterMarkExtension, WriterNodeExtension } from "./writer";

// #region Re-exports from api.d.ts

export type {
  PanelApiAuth,
  PanelApiFiles,
  PanelApiLanguages,
  PanelApiPages,
  PanelApiRoles,
  PanelApiSite,
  PanelApiSystem,
  PanelApiTranslations,
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
  PanelModalSubmitResponse,
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
  PanelMenuEntry,
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
 * Vue application instance. The Panel adds the `$`-prefixed members to the
 * Vue prototype, so every component reads them from `this`.
 *
 * @example
 * ```ts
 * // In a Vue component
 * const slug = this.$helper.slug("My Page Title");
 * const date = this.$library.dayjs("2024-01-15").format("DD.MM.YYYY");
 * ```
 * @source panel/src/panel/app.js
 * @source panel/src/panel/legacy.js
 * @source panel/src/index.js
 * @source panel/src/helpers/index.ts
 * @source panel/src/libraries/index.ts
 * @source panel/src/types/vue.d.ts
 */
export type PanelApp = InstanceType<VueConstructor> & {
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
  /** Opens a dropdown; alias of `$panel.dropdown.openAsync()`. */
  $dropdown: PanelFeatures.PanelDropdown["openAsync"];
  $events: PanelFeatures.PanelEvents;
  /** Opens a view; alias of `$panel.view.open()`. */
  $go: PanelFeatures.PanelView["open"];
  /** Reloads the current view; alias of `$panel.reload()`. */
  $reload: Panel["reload"];
  /** Translates a key; alias of `$panel.t()`. */
  $t: Panel["t"];
  /** Builds a Panel URL; alias of `$panel.url()`. */
  $url: Panel["url"];
  // #endregion
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
 * - an `extends` component.
 *
 * Without any of them, the component is skipped with a console warning.
 * @source panel/src/panel/plugins.ts
 */
export type PanelComponentExtension =
  | DefineComponent<any, any, any, any, any, any, any, any, any, any, any>
  | (Omit<ComponentOptions<any>, "mixins" | "extends" | "render"> & {
      /** Component to extend, by name (e.g., `"k-text-field"`) or by options. */
      extends?:
        | string
        | ComponentOptions<any>
        | VueConstructor
        | DefineComponent<
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any,
            any
          >;
      /** Named mixins (`"dialog"`, `"drawer"`, `"section"`) or component objects. */
      mixins?: (
        | string
        | ComponentOptions<any>
        | VueConstructor
        | DefineComponent<any, any, any, any, any, any, any, any, any, any, any>
      )[];
      /** `null` clears an inherited render function so the component's own template applies. */
      render?: ComponentOptions<any>["render"] | null;
    });
// #endregion

// #region Panel Configuration

/**
 * Panel settings the backend derives from the site options and the
 * server's upload limits.
 *
 * @source panel/src/panel/panel.js
 * @source src/Panel/View.php
 */
export interface PanelConfig {
  api: {
    /**
     * Whether API requests other than `GET` and `POST` are sent as `POST`
     * with an `X-HTTP-Method-Override` header.
     *
     * @since 5.0.0
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
   *
   * @since 5.1.0
   */
  theme: string;
  /**
   * Interface language code from the `panel.language` option, `"en"` unless
   * configured. The active interface translation lives on
   * `panel.translation`.
   */
  translation: string;
  /**
   * Chunk size in bytes for chunked file uploads – 95% of the smallest
   * server upload limit.
   *
   * @since 5.0.0
   */
  upload: number;
}
// #endregion

// #region Panel Permissions

/**
 * Access permissions for Panel areas.
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
  /** @since 5.0.0 */
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
  /**
   * Whether the user may open the site preview.
   * @since 5.5.2
   */
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
 * Permissions of the current user's role. Blueprint `options` can override
 * them per model, as a model view's `permissions` prop reflects.
 *
 * @source panel/src/panel/panel.js
 * @source src/Cms/Permissions.php
 * @source src/Panel/View.php
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
 * Search type an accessible area registers. `icon` defaults to `"search"`,
 * `label` to the id turned into a label.
 * @source src/Panel/View.php
 */
export interface PanelSearchType {
  icon: string;
  label: string;
  id: string;
}

/**
 * Available search types in the Panel.
 * @source panel/src/panel/panel.js
 * @source src/Panel/View.php
 * @source config/areas/site/searches.php
 * @source config/areas/users/searches.php
 */
export interface PanelSearches {
  /** Omitted when the user has no access to the site area. */
  pages?: PanelSearchType;
  /** Omitted when the user has no access to the site area. */
  files?: PanelSearchType;
  /** Omitted when the user has no access to the users area. */
  users?: PanelSearchType;
  [key: string]: PanelSearchType | undefined;
}
// #endregion

// #region Panel URLs

/**
 * Base URLs for Panel operations.
 * @source panel/src/panel/panel.js
 * @source src/Panel/View.php
 */
export interface PanelUrls {
  api: string;
  site: string;
}
// #endregion

// #region Panel Request Response

/**
 * Result of `panel.request()`.
 *
 * @source panel/src/panel/request.ts
 */
export interface PanelRequestResponse {
  /** Request built from the URL, the query, and the Panel's headers. */
  request: Request;
  /**
   * Parsed response: a plain object that exposes the pre-resolved body
   * (`json`, `text`) alongside status metadata.
   */
  response: {
    headers: Headers;
    /** Parsed JSON body. */
    json: any;
    ok: boolean;
    status: number;
    statusText: string;
    /** Raw response text. */
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
 *   // Custom sections
 *   sections: {
 *     stats: {
 *       template: `<div>{{ data }}</div>`
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
   * Vue components to register globally in the Panel.
   */
  components?: Record<string, PanelComponentExtension>;

  /**
   * Custom field types.
   *
   * Registered as `k-${name}-field` components.
   */
  fields?: Record<string, PanelComponentExtension>;

  /**
   * SVG icon definitions.
   */
  icons?: Record<string, string>;

  /**
   * Custom section types.
   *
   * Registered as `k-${name}-section` components.
   * The `section` mixin is automatically prepended to the mixins array.
   */
  sections?: Record<string, PanelComponentExtension>;

  /**
   * View button components.
   *
   * Registered as `k-${name}-view-button` components.
   *
   * @since 5.0.0
   */
  viewButtons?: Record<string, PanelComponentExtension>;

  /**
   * Vue plugins to install via `Vue.use()`.
   */
  use?:
    | Record<string, PluginObject<any> | PluginFunction<any>>
    | (PluginObject<any> | PluginFunction<any>)[];

  /**
   * Runs in the `created` hook of the Panel's root component and receives
   * that component instance. The application itself is available as
   * `window.panel.app`.
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
  created?: (instance: PanelApp) => void;

  /**
   * Component that replaces the default login form.
   */
  login?: PanelComponentExtension;

  /**
   * Custom textarea toolbar buttons.
   */
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
 * Panel plugin system.
 *
 * Manages Vue components, icons, and extensions registered by plugins.
 *
 * @source panel/src/panel/plugins.ts
 * @source panel/public/js/plugins.js
 * @source panel/src/panel/app.js
 */
export interface PanelPlugins {
  // #region Helper Functions

  /**
   * Resolves an `extends` given as a component name to that component, or
   * drops it with a console warning when no such component is registered.
   *
   * @param name - Component name being registered
   * @returns The component options, mutated in place
   * @since 5.0.0
   */
  resolveComponentExtension: (
    app: VueConstructor,
    name: string,
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Replaces the mixin names `"dialog"`, `"drawer"`, and `"section"` with
   * their mixins, skipping one the extended component already includes.
   *
   * @returns The component options, mutated in place
   * @since 5.0.0
   */
  resolveComponentMixins: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Sets `render` to `null` when the component has a template, so the
   * template wins over an inherited render function.
   *
   * @returns The component options, mutated in place
   * @since 5.0.0
   */
  resolveComponentRender: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;
  // #endregion

  // #region Plugin Data

  /** Registered Vue components. */
  components: Record<string, PanelComponentExtension>;

  /** Callbacks to run in the `created` hook of the root component. */
  created: ((instance: PanelApp) => void)[];

  /** Registered SVG icons. */
  icons: Record<string, string>;

  /** Custom login component, `undefined` until a plugin registers one. */
  login?: PanelComponentExtension;

  /** Reserved bucket for plugin-registered routes (initialized empty; not currently written to by `panel.plugin()`). */
  routes: Record<string, any>[];

  /**
   * Registered textarea toolbar buttons.
   */
  textareaButtons: Record<string, TextareaButton>;

  /** Registered third-party plugin data. */
  thirdParty: Record<string, any>;

  /** Vue plugins installed via `Vue.use()`. */
  use: (PluginObject<any> | PluginFunction<any>)[];

  /**
   * Reserved bucket for view-button plugins (initialized empty; entries are actually stored under `components` as `k-${name}-view-button`).
   *
   * @since 5.0.0
   */
  viewButtons: Record<
    string,
    | DefineComponent<any, any, any, any, any, any, any, any, any, any, any>
    | Record<string, any>
  >;

  /** Reserved bucket for plugin-registered views (initialized empty; not currently written to by `panel.plugin()`). */
  views: Record<string, Record<string, any>>;

  /**
   * Registered writer marks.
   */
  writerMarks: Record<string, WriterMarkExtension>;

  /**
   * Registered writer nodes.
   */
  writerNodes: Record<string, WriterNodeExtension>;
  // #endregion
}
// #endregion

// #region Panel Language Info

/**
 * Language information for multi-language sites.
 * @source src/Cms/Language.php
 * @source src/Panel/View.php
 */
export interface PanelLanguageInfo {
  /** Language code (e.g., `"en"`, `"de"`). */
  code: string;
  default: boolean;
  direction: "ltr" | "rtl";
  /**
   * Whether the language is configured with an absolute `url` (e.g.
   * `https://example.de` or `//example.de`) rather than a path prefix.
   *
   * @since 5.2.3
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
 * @source panel/src/panel/panel.js
 * @source src/Panel/View.php
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
 * @source panel/src/panel/panel.js
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
  menu?: PanelGlobalState["menu"]["entries"];
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
 * @source panel/src/panel/panel.js
 * @source panel/src/index.js
 * @source panel/src/panel/legacy.js
 * @source panel/src/panel/request.ts
 * @source panel/src/panel/translation.ts
 * @source panel/public/js/plugins.js
 * @source src/Panel/View.php
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
   * Returns the document title. Setting it appends `" | "` and the system
   * title when the system has one.
   */
  get title(): string;
  set title(title: string);

  /** Whether `open()` is loading a URL – a view, dialog, drawer, or dropdown. */
  isLoading: boolean;

  /**
   * Whether the Panel lost its connection, from the browser's `offline`
   * event or a failed request.
   */
  isOffline: boolean;
  // #endregion

  // #region State Objects (extend State)

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

  /** @since 5.0.0 */
  theme: PanelFeatures.PanelTheme;

  translation: PanelFeatures.PanelTranslation;

  upload: PanelFeatures.PanelUpload;

  user: PanelFeatures.PanelUser;
  // #endregion

  // #region Features (extend Feature)

  /**
   * Content versioning and saving.
   *
   * @since 5.0.0
   */
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

  urls: PanelUrls;
  // #endregion

  // #region Methods

  /**
   * Builds the Panel singleton from the collected plugin data and the
   * initial server state.
   *
   * @param plugins - Plugin data `panel.plugin()` collected
   * @returns The Panel instance
   */
  create: (plugins?: Record<string, any>) => Panel;

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
   * @returns Notification state if opened, `void` otherwise
   */
  error: (
    error: unknown,
    openNotification?: boolean,
  ) => void | PanelFeatures.PanelNotificationDefaults;

  /**
   * Sends a GET request through the Panel router.
   *
   * @returns Response data
   */
  get: (url: string | URL, options?: PanelRequestOptions) => Promise<any>;

  /**
   * Opens a URL through the Panel router and sets the Panel state from the
   * response. A state object instead of a URL is set directly.
   *
   * @returns The new Panel state, or on failure the error notification state or `undefined`
   */
  open: (
    url: string | URL | PanelStateInput,
    options?: PanelRequestOptions,
  ) => Promise<
    PanelGlobalState | PanelFeatures.PanelNotificationDefaults | undefined
  >;

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
   * @param options - Request options, including the `method`
   */
  request: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelRequestResponse>;

  /**
   * Opens the search dialog with the search type preselected, or runs the
   * search when given a query. Without a type, the dialog preselects the
   * current view's search type.
   *
   * @param type - Search type, such as `"pages"`, `"files"`, or `"users"`
   * @param options - Search options (`page`, `limit`)
   * @returns Search results when a query is provided, `undefined` if a newer search aborted the request
   */
  search: {
    (type?: string): Promise<void>;
    (
      type: string,
      query: string,
      options?: PanelFeatures.PanelSearchOptions,
    ): Promise<PanelFeatures.PanelSearchResponse | undefined>;
  };

  /**
   * Applies a new Panel state: updates the globals, calls each feature's
   * `set()`, opens or closes the modals and the dropdown, and opens the view
   * when present.
   *
   * @returns `undefined`, or the `open()` promise when a modal state carries a `redirect`
   */
  set: (state?: PanelStateInput) => void | ReturnType<Panel["open"]>;

  /** Returns the globals and every feature's current state. */
  state: () => PanelGlobalState;

  /**
   * Translates a key into the current interface language, filling
   * `{placeholder}` values from `data`. A missing key falls back to
   * `fallback`.
   */
  t: (
    key: string,
    data?: Record<string, any>,
    fallback?: string | null,
  ) => string;

  /** @deprecated Alias of `t()`; use `t()` instead. */
  $t: Panel["t"];

  /**
   * Creates a URL object for a Panel path.
   *
   * @param path - Path or URL to build (default: empty string)
   * @param query - Query parameters
   * @param origin - Base origin
   * @returns URL object
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
 * User who last edited the content, or the current user when there are no
 * unsaved changes. Both fields are `null` when that user is unknown or not
 * listable.
 * @source src/Content/Lock.php
 */
interface PanelViewPropsLockUser {
  id: string | null;
  email: string | null;
}

/**
 * Content lock state.
 * @source src/Content/Lock.php
 * @source src/Panel/Model.php
 * @source panel/src/panel/content.js
 */
interface PanelViewPropsLock {
  /** @since 5.0.0 */
  isLegacy: boolean;
  /** @since 5.0.0 */
  isLocked: boolean;
  /**
   * ISO 8601 timestamp of the last change. The Panel replaces it with a
   * `Date` after each save of the current view.
   *
   * @since 5.0.0
   */
  modified: string | Date | null;
  /** @since 5.0.0 */
  user: PanelViewPropsLockUser;
}

/**
 * Content permissions for a view.
 * @source src/Cms/ModelPermissions.php
 * @source src/Cms/Blueprint.php
 * @source src/Cms/PageBlueprint.php
 * @source src/Cms/FileBlueprint.php
 * @source src/Cms/UserBlueprint.php
 * @source src/Cms/SiteBlueprint.php
 * @source src/Panel/Site.php
 */
interface PanelViewPropsPermissions {
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
 * @source src/Panel/Model.php
 */
interface PanelViewPropsVersions {
  latest: Record<string, any>;
  changes: Record<string, any>;
}

/**
 * Blueprint tab.
 * @source src/Cms/Blueprint.php
 */
interface PanelViewPropsTab {
  label: string;
  /** `null` when the blueprint omits an icon. */
  icon: string | null;
  /**
   * List of columns, or an object keyed by column name when the blueprint
   * names its columns.
   */
  columns: Record<string, any>[] | Record<string, Record<string, any>>;
  link: string;
  name: string;
  /** Any other key the blueprint sets on the tab. */
  [key: string]: any;
}

/**
 * Link to a sibling model, for `next` and `prev`.
 * @source src/Panel/Model.php
 * @source src/Panel/Page.php
 * @source src/Panel/File.php
 * @source src/Panel/User.php
 */
interface PanelViewPropsNavigation {
  link: string;
  title: string;
}

/**
 * Legacy nested model information.
 *
 * Emitted on Page, File, User and Site views, each with its own key set.
 * The fields below model the Page variant. File sends `dimensions`,
 * `extension`, `filename`, `id`, `link`, `mime`, `niceSize`, `parent` (the
 * parent's Panel path), `template`, `type`, `url` and `uuid`; User sends
 * `account`, `avatar`, `email`, `id`, `language`, `link`, `name`, `role`,
 * `username` and `uuid`; Site sends only `link`, `previewUrl`, `title` and
 * `uuid`.
 *
 * @source src/Panel/Page.php
 * @source src/Panel/File.php
 * @source src/Panel/User.php
 * @source src/Panel/Site.php
 */
interface PanelViewPropsModel {
  id: string;
  link: string;
  parent: string;
  /** `null` when the user may not open a preview of the model. */
  previewUrl: string | null;
  status: "draft" | "listed" | "unlisted";
  title: string;
  /** `null` when the `content.uuid` option is `false`. */
  uuid: string | null;
}

/**
 * Button in the view header.
 * @source src/Panel/Ui/Buttons/ViewButton.php
 * @source src/Panel/Ui/Button.php
 * @source src/Panel/Ui/Buttons/ViewButtons.php
 * @source src/Panel/Ui/Component.php
 * @source src/Panel/Ui/Buttons/LanguagesDropdown.php
 */
interface PanelViewPropsButton {
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
    /** Whether another translation has unsaved changes. Sent by the languages dropdown. */
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
    /** Inline CSS style string. */
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
 * Props of a page, site, file, or user view.
 * @source src/Panel/Model.php
 * @source src/Panel/Page.php
 * @source src/Panel/File.php
 * @source src/Panel/User.php
 * @source src/Panel/Site.php
 * @source src/Cms/Blueprint.php
 */
export interface PanelViewProps {
  /** @since 5.0.0 */
  api: string;
  /**
   * View buttons, with `"-"` separators between groups.
   *
   * @since 5.0.0
   */
  buttons: (PanelViewPropsButton | "-")[];
  /** @since 5.0.0 */
  id: string;
  /** @since 5.0.0 */
  link: string;
  lock: PanelViewPropsLock;
  permissions: PanelViewPropsPermissions;
  tabs: PanelViewPropsTab[];
  /**
   * `null` when the `content.uuid` option is `false`.
   *
   * @since 5.0.0
   */
  uuid: string | null;
  /** @since 5.0.0 */
  versions: PanelViewPropsVersions;
  /**
   * Active blueprint tab: the one the `tab` query parameter names, else the
   * first. Blueprint-level fields, sections or columns form a single tab, so
   * it is absent only for an empty blueprint.
   */
  tab?: PanelViewPropsTab;
  /**
   * Link to the next sibling, `null` when there is none. Absent on Site
   * views.
   */
  next?: PanelViewPropsNavigation | null;
  /**
   * Link to the previous sibling, `null` when there is none. Absent on Site
   * views.
   */
  prev?: PanelViewPropsNavigation | null;
  blueprint: string;
  /** @deprecated Use the top-level view props instead. */
  model: PanelViewPropsModel;
  /**
   * View title. File and User views leave it out of the props and set only
   * the view's own `title`.
   *
   * @since 5.0.0
   */
  title?: string;
}

/**
 * @source src/Panel/File.php
 * @source src/Panel/Ui/FilePreview.php
 */
export interface PanelFileViewProps extends PanelViewProps {
  /** @since 5.0.0 */
  extension: string;
  /** @since 5.0.0 */
  filename: string;
  /** @since 5.0.0 */
  mime: string | null;
  /** Preview component the view renders above its tabs. */
  preview: { component: string; key: string; props: Record<string, any> };
  /** @since 5.0.0 */
  type: string | null;
  /** @since 5.0.0 */
  url: string;
}

/**
 * Props of a user view, also sent to the account view.
 *
 * @source src/Panel/User.php
 */
export interface PanelUserViewProps extends PanelViewProps {
  /** @since 5.0.0 */
  avatar: string | null;
  canChangeEmail: boolean;
  canChangeLanguage: boolean;
  canChangeName: boolean;
  /** Whether the logged-in user may move this user to another role. */
  canChangeRole: boolean;
  /** @since 5.0.0 */
  email: string | null;
  /**
   * Name of the user's Panel language.
   *
   * @since 5.0.0
   */
  language: string;
  /** @since 5.0.0 */
  name: string;
  /**
   * Title of the user's role.
   *
   * @since 5.0.0
   */
  role: string;
  /** @since 5.0.0 */
  username: string | null;
}
// #endregion
