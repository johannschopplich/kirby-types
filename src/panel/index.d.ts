/* eslint-disable perfectionist/sort-named-exports */

/**
 * Kirby Panel type definitions.
 *
 * This is the main entry point for all Panel type definitions.
 * Types are organized into modules for better maintainability:
 *
 * - `base.d.ts` - State, Feature, Modal, History, Event Listeners
 * - `features.d.ts` - View, Dialog, Drawer, Dropdown, Notification, etc.
 * - `helpers.d.ts` - $helper.* utilities
 * - `libraries.d.ts` - $library.* (colors, dayjs, autosize)
 * - `api.d.ts` - API client methods
 * - `writer.d.ts` - Writer (ProseMirror) editor and extensions
 * - `textarea.d.ts` - Textarea toolbar buttons
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

export type {
  TextareaButton,
  TextareaDropdownItem,
  TextareaToolbarContext,
} from "./textarea";
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
 * Vue application instance with Panel extensions.
 *
 * The Panel Vue app includes additional properties on the Vue prototype:
 * - `$panel` - The Panel instance.
 * - `$helper` - Utility functions for common operations.
 * - `$library` - External libraries (colors, dayjs, autosize).
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
 * Components can be defined as:
 * - Vue component options object with template or render function
 * - Component that extends another component by name.
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
      /** Named mixins (e.g., `"dialog"`, `"drawer"`, `"section"`) or component objects. */
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
 * Global Panel configuration.
 *
 * @source panel/src/panel/panel.js
 * @source src/Panel/View.php
 */
export interface PanelConfig {
  api: {
    /**
     * Whether requests other than `GET` and `POST` are sent as `POST` with an
     * `X-HTTP-Method-Override` header.
     *
     * @since 5.0.0
     */
    methodOverride: boolean;
  };
  /** Whether debug mode is enabled. */
  debug: boolean;
  /** Whether KirbyText is enabled. */
  kirbytext: boolean;
  /**
   * Default color theme from the `panel.theme` option (`"system"` unless
   * configured). A theme the user picks overrides it.
   *
   * @since 5.1.0
   */
  theme: string;
  /**
   * Default interface language code from the `panel.language` option. The
   * logged-in user's language lives on `panel.translation`.
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
 * File operation permissions.
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
 * Language operation permissions.
 * @source src/Cms/Permissions.php
 */
interface PanelPermissionsLanguages {
  create: boolean;
  delete: boolean;
  update: boolean;
}

/**
 * Page operation permissions.
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
 * Site operation permissions.
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
 * Complete permission set for the current user. Empty when no user is
 * logged in.
 *
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
 * Search type definition.
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
 * Response object from Panel requests.
 *
 * @source panel/src/panel/request.ts
 */
export interface PanelRequestResponse {
  /** The original Request object. */
  request: Request;
  /**
   * Parsed response: a plain object that exposes the pre-resolved body
   * (`json`, `text`) alongside status metadata.
   */
  response: {
    headers: Headers;
    /** Parsed JSON data. */
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
   * Registered as `k-block-type-${name}` components that automatically
   * extend `k-block-type-default`.
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
   *
   * Can be used to add global methods, directives, or mixins.
   */
  use?:
    | Record<string, PluginObject<any> | PluginFunction<any>>
    | (PluginObject<any> | PluginFunction<any>)[];

  /**
   * Callback executed after the Panel Vue app is created.
   *
   * Receives the Vue app instance as parameter.
   *
   * @example
   * ```ts
   * window.panel.plugin("my-plugin", {
   *   created(app) {
   *     console.log("Panel app created", app);
   *   }
   * });
   * ```
   */
  created?: (app: PanelApp) => void;

  /**
   * Custom login form component.
   *
   * Replaces the default login form with a custom implementation.
   */
  login?: PanelComponentExtension;

  /**
   * Custom textarea toolbar buttons.
   */
  textareaButtons?: Record<string, TextareaButton>;

  /**
   * Arbitrary third-party plugin data.
   *
   * Can be used to pass configuration to other plugins.
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
 */
export interface PanelPlugins {
  // #region Helper Functions

  /**
   * Resolves a component extension if defined as component name.
   *
   * @param app - Vue constructor
   * @param name - Component name being registered
   * @param component - Component options object
   * @returns Updated/extended component options
   * @since 5.0.0
   */
  resolveComponentExtension: (
    app: VueConstructor,
    name: string,
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Resolves available mixins if they are defined.
   *
   * @param component - Component options object
   * @returns Updated component options with resolved mixins
   * @since 5.0.0
   */
  resolveComponentMixins: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;

  /**
   * Resolves a component's competing template/render options.
   *
   * @param component - Component options object
   * @returns Updated component options
   * @since 5.0.0
   */
  resolveComponentRender: (
    component: PanelComponentExtension,
  ) => PanelComponentExtension;
  // #endregion

  // #region Plugin Data

  /** Registered Vue components. */
  components: Record<string, PanelComponentExtension>;

  /** Callbacks to run after Panel creation. */
  created: ((app: PanelApp) => void)[];

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

  /** Installed Vue plugins via `Vue.use()`. */
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
  rules: Record<string, string>;
  /** Absolute URL for this language (always resolved against the site URL). */
  url: string;
}
// #endregion

// #region Panel Global State

/**
 * Global Panel state for `panel.state()`.
 * @source panel/src/panel/panel.js
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
 * current value whole; a feature state and the view merge into theirs.
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
      | "language"
      | "menu"
      | "notification"
      | "system"
      | "translation"
      | "user"
      | "view"
  ]?: Partial<PanelGlobalState[K]>;
} & {
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
 * The main Panel interface.
 *
 * The Panel is the central object managing the Kirby admin interface.
 * It provides access to all features, configuration, and the API client.
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
 * @source panel/src/panel/legacy.js
 * @source panel/src/panel/request.ts
 * @source panel/src/index.js
 * @source panel/public/js/plugins.js
 */
export interface Panel {
  // #region Core Properties

  readonly app: PanelApp;

  /** Current editing context. */
  readonly context: PanelContext;

  /** Whether debug mode is enabled. */
  readonly debug: boolean;

  readonly direction: "ltr" | "rtl";

  /** Document title getter/setter; on set, the system title is appended as a suffix when present. */
  title: string;

  /** Whether the Panel is currently loading a new view via `open()`. */
  isLoading: boolean;

  /** Whether the browser is offline. */
  isOffline: boolean;
  // #endregion

  // #region State Objects (extend State)

  /** License activation state. */
  activation: PanelFeatures.PanelActivation;

  drag: PanelFeatures.PanelDrag;

  /** Global event handling. */
  events: PanelFeatures.PanelEvents;

  /** Current language state. */
  language: PanelFeatures.PanelLanguage;

  /** Navigation menu state. */
  menu: PanelFeatures.PanelMenu;

  /** Notification display. */
  notification: PanelFeatures.PanelNotification;

  searcher: PanelFeatures.PanelSearcher;

  system: PanelFeatures.PanelSystem;

  /** @since 5.0.0 */
  theme: PanelFeatures.PanelTheme;

  translation: PanelFeatures.PanelTranslation;

  /** File upload handling. */
  upload: PanelFeatures.PanelUpload;

  /** Current user data. */
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

  /** Whether multi-language is enabled. */
  multilang: boolean;

  /** User permissions. */
  permissions: PanelPermissions;

  plugins: PanelPlugins;

  searches: PanelSearches;

  urls: PanelUrls;
  // #endregion

  // #region Methods

  /**
   * Creates the Panel Vue app.
   *
   * @param plugins - Optional plugins to register
   * @returns The Panel instance
   */
  create: (plugins?: Record<string, any>) => Panel;

  /**
   * Logs a deprecation warning.
   *
   * @param message - Deprecation message
   */
  deprecated: (message: string) => void;

  /**
   * Handles an error: ignores `AbortError`, marks the Panel offline on `OfflineError`, logs in debug mode, and optionally opens an error notification.
   *
   * @param error - Error, message, or any other thrown value
   * @param openNotification - Whether to show notification (default: `true`)
   * @returns Notification state if opened, `void` otherwise
   */
  error: (
    error: unknown,
    openNotification?: boolean,
  ) => void | PanelFeatures.PanelNotificationDefaults;

  /**
   * Sends a GET request through the Panel router.
   *
   * @param url - URL to fetch
   * @param options - Request options
   * @returns Response data
   */
  get: (url: string | URL, options?: PanelRequestOptions) => Promise<any>;

  /**
   * Opens a URL through the Panel router and sets the state.
   *
   * Unlike `get()`, this method also updates the Panel state
   * based on the response.
   *
   * @param url - URL to open or state object
   * @param options - Request options
   * @returns The new Panel state, or on failure the error notification state or `undefined`
   */
  open: (
    url: string | URL | PanelStateInput,
    options?: PanelRequestOptions,
  ) => Promise<
    PanelGlobalState | PanelFeatures.PanelNotificationDefaults | undefined
  >;

  /**
   * Returns the open overlays, `"drawer"` before `"dialog"`. The view is not
   * an overlay.
   */
  overlays: () => ("drawer" | "dialog")[];

  /**
   * Registers a Panel plugin with its extensions. Available only while
   * plugin scripts load, before the Panel boots.
   *
   * @param name - Unique plugin identifier (typically vendor/plugin-name)
   * @param extensions - Plugin extensions to register
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
   * @param url - URL to post to
   * @param data - Request body
   * @param options - Request options
   * @returns Response data
   */
  post: (
    url: string | URL,
    data?: any,
    options?: PanelRequestOptions,
  ) => Promise<any>;

  /**
   * Navigates the browser to the absolute URL by throwing a redirect error
   * that the Panel's error handler catches.
   *
   * @param path - Path or URL to navigate to
   */
  redirect: (path: string | URL) => never;

  /**
   * Reloads the current view.
   *
   * @param options - Request options
   * @returns The new view state, or `false` if the view has no path
   */
  reload: (
    options?: PanelRequestOptions,
  ) => Promise<PanelFeatures.PanelViewDefaults | false>;

  /**
   * Sends a request through the Panel router.
   *
   * Returns an object with both the request and the parsed response.
   * Cross-origin or non-JSON responses trigger a redirect and the promise
   * rejects.
   *
   * @param url - URL to request
   * @param options - Request options including method
   */
  request: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelRequestResponse>;

  /**
   * Opens the search dialog or performs a search query.
   *
   * When called without a query, opens the search dialog
   * with the specified search type pre-selected.
   *
   * When called with a query, performs the search and returns results.
   *
   * Without a type, the dialog preselects the current view's search type.
   *
   * @param type - Search type (`"pages"`, `"files"`, `"users"`)
   * @param query - Search query string
   * @param options - Search options (page, limit)
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
   * Applies a new Panel state: updates globals, dispatches per-feature `set()` calls, opens/closes modals and the dropdown, and opens the view when present.
   *
   * @param state - State to merge; `null` or `false` for `dialog`, `drawer` or `dropdown` closes it
   * @returns `undefined`, or the `open()` promise when a modal state carries a `redirect`
   */
  set: (state?: PanelStateInput) => void | ReturnType<Panel["open"]>;

  /**
   * Returns the current global state.
   *
   * @returns All feature states
   */
  state: () => PanelGlobalState;

  /**
   * Translates a key using the current translation.
   *
   * @param key - Translation key
   * @param data - Placeholder values
   * @param fallback - Fallback if the key is not found
   * @returns Translated string
   */
  t: (
    key: string,
    data?: Record<string, any>,
    fallback?: string | null,
  ) => string;

  /**
   * Translates a key using the current translation.
   *
   * @deprecated Legacy alias of `t()`; use `t()` instead.
   */
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

// #region View Props (commonly used)

/**
 * User holding the content lock. Both fields are `null` when nobody holds
 * the lock or the holder is not listable.
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
 * @source src/Cms/ModelPermissions.php
 * @source src/Cms/PageBlueprint.php
 * @source src/Cms/FileBlueprint.php
 * @source src/Cms/UserBlueprint.php
 * @source src/Cms/SiteBlueprint.php
 * @source src/Panel/Site.php
 */
interface PanelViewPropsPermissions {
  access: boolean;
  /** User permission. Present on User views. */
  changeEmail?: boolean;
  /** User permission. Present on User views. */
  changeLanguage?: boolean;
  /** File / User permission. Present on File and User views. */
  changeName?: boolean;
  /** User permission. Present on User views. */
  changePassword?: boolean;
  /** User permission. Present on User views. */
  changeRole?: boolean;
  /** Page permission. Present on Page views. */
  changeSlug?: boolean;
  /** Page permission. Present on Page views. */
  changeStatus?: boolean;
  /** Page / File permission. Present on Page and File views. */
  changeTemplate?: boolean;
  /** Page / Site permission. Present on Page and Site views. */
  changeTitle?: boolean;
  /** Page / File / User permission. Present on Page, File and User views. */
  create?: boolean;
  /** Page / File / User permission. Present on Page, File and User views. */
  delete?: boolean;
  /** Page permission. Present on Page views. */
  duplicate?: boolean;
  /** Page / File / User permission. Present on Page, File and User views. */
  list?: boolean;
  /** Page permission. Present on Page views. */
  move?: boolean;
  /**
   * Page / Site permission. Present on Page and Site views; on Site views
   * `true` only when both the site and its home page allow the preview.
   */
  preview?: boolean;
  /** Page / File permission. Present on Page and File views. */
  read?: boolean;
  /** File permission. Present on File views. */
  replace?: boolean;
  /** Page / File permission. Present on Page and File views. */
  sort?: boolean;
  update: boolean;
}

/**
 * Version information.
 * @source src/Panel/Model.php
 */
interface PanelViewPropsVersions {
  latest: Record<string, any>;
  changes: Record<string, any>;
}

/**
 * Tab definition.
 * @source src/Cms/Blueprint.php
 */
interface PanelViewPropsTab {
  label: string;
  /** Tab icon. May be `null` when the blueprint omits an icon. */
  icon: string | null;
  /** A list, or an object keyed by column name when the blueprint names its columns. */
  columns: Record<string, any>[] | Record<string, Record<string, any>>;
  link: string;
  name: string;
  /** Any other key the blueprint sets on the tab. */
  [key: string]: any;
}

/**
 * Navigation link (next/prev).
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
  status: string;
  title: string;
  /** `null` when the `content.uuid` option is `false`. */
  uuid: string | null;
}

/**
 * Button definition.
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
    /** Optional badge config rendered next to the button. */
    badge?: Record<string, any>;
    class?: string;
    /** Whether the button represents the current view/route. */
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
    /** Inline dropdown options or query string. */
    options?: string | Record<string, any>[];
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
 * Common view props passed from backend.
 * @source src/Panel/Model.php
 * @source src/Panel/Page.php
 * @source src/Panel/File.php
 * @source src/Panel/User.php
 * @source src/Panel/Site.php
 */
export interface PanelViewProps {
  /** @since 5.0.0 */
  api: string;
  /**
   * View buttons. May contain `'-'` string separators between groups.
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
   * UUID of the model. Is `null` when the `content.uuid` option is `false`.
   *
   * @since 5.0.0
   */
  uuid: string | null;
  /** @since 5.0.0 */
  versions: PanelViewPropsVersions;
  /** Active blueprint tab. Only present when the blueprint defines tabs. */
  tab?: PanelViewPropsTab;
  /**
   * Sibling navigation link to the next model. Emitted only on Page, File
   * and User views (may be `null` when there is no next sibling); not
   * emitted on Site.
   */
  next?: PanelViewPropsNavigation | null;
  /**
   * Sibling navigation link to the previous model. Emitted only on Page,
   * File and User views (may be `null` when there is no previous sibling);
   * not emitted on Site.
   */
  prev?: PanelViewPropsNavigation | null;
  blueprint: string;
  /**
   * Legacy nested model information.
   *
   * @deprecated Use the top-level view props instead.
   */
  model: PanelViewPropsModel;
  /**
   * View title. Page and Site set it inside props, but File and User omit
   * it from the inner props payload (the title appears only on the view
   * envelope).
   *
   * @since 5.0.0
   */
  title?: string;
}
// #endregion
