/* eslint-disable perfectionist/sort-named-exports */

/**
 * Kirby Panel Type Definitions
 *
 * This is the main entry point for all Panel type definitions.
 * Types are organized into modules for better maintainability:
 *
 * - `panel.base.ts` - State, Feature, Modal, History, Event Listeners
 * - `panel.features.ts` - View, Dialog, Drawer, Dropdown, Notification, etc.
 * - `panel.helpers.ts` - $helper.* utilities
 * - `panel.libraries.ts` - $library.* (colors, dayjs, autosize)
 * - `panel.api.ts` - API client methods
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/panel
 * @since 4.0.0
 */

import type { ComponentPublicInstance, VueConstructor } from "vue";
import type { PanelApi } from "./api";
import type {
  PanelContext,
  PanelFeatureDefaults,
  PanelRequestOptions,
} from "./base";
import type * as PanelFeatures from "./features";
import type { PanelHelpers } from "./helpers";
import type { PanelLibrary } from "./libraries";

// =============================================================================
// Re-exports from panel.api.ts
// =============================================================================

export type {
  // Request Types
  PanelApiRequestOptions,
  PanelApiPagination,
  PanelApiSearchQuery,
  // Auth
  PanelApiLoginData,
  PanelApiAuth,
  // Files
  PanelApiFiles,
  // Languages
  PanelApiLanguageData,
  PanelApiLanguages,
  // Pages
  PanelApiPageCreateData,
  PanelApiPageDuplicateOptions,
  PanelApiPages,
  // Roles
  PanelApiRoles,
  // Site
  PanelApiSite,
  // System
  PanelApiSystemInstallData,
  PanelApiSystemRegisterData,
  PanelApiSystem,
  // Translations
  PanelApiTranslations,
  // Users
  PanelApiUserCreateData,
  PanelApiUsers,
  // Main API Interface
  PanelApi,
} from "./api";

// =============================================================================
// Re-exports from panel.base.ts
// =============================================================================

export type {
  // State Management
  PanelState,
  PanelStateBase,
  PanelFeatureBase,
  PanelModalBase,
  PanelHistoryBase,
  // Event Listeners
  PanelEventCallback,
  PanelEventListenerMap,
  PanelEventListeners,
  // Feature
  PanelFeatureDefaults,
  PanelFeature,
  // Modal
  PanelModalEvent,
  PanelModalListeners,
  PanelSuccessResponse,
  PanelModal,
  // History
  PanelHistoryMilestone,
  PanelHistory,
  // Request Options
  PanelRequestOptions,
  PanelRefreshOptions,
  // Context & Notification Types
  PanelContext,
  NotificationContext,
  NotificationType,
  NotificationTheme,
} from "./base";

// =============================================================================
// Re-exports from panel.features.ts
// =============================================================================

export type {
  // Timer
  PanelTimer,
  // Activation
  PanelActivationDefaults,
  PanelActivation,
  // Drag
  PanelDragDefaults,
  PanelDrag,
  // Theme
  PanelThemeDefaults,
  PanelThemeValue,
  PanelTheme,
  // Language
  PanelLanguageDefaults,
  PanelLanguage,
  // Menu
  PanelMenuEntry,
  PanelMenuDefaults,
  PanelMenu,
  // Notification
  PanelNotificationDefaults,
  PanelNotificationOptions,
  PanelErrorObject,
  PanelNotification,
  // System
  PanelSystemDefaults,
  PanelSystem,
  // Translation
  PanelTranslationDefaults,
  PanelTranslation,
  // User
  PanelUserDefaults,
  PanelUser,
  // View
  PanelBreadcrumbItem,
  PanelViewDefaults,
  PanelView,
  // Dropdown
  PanelDropdownOption,
  PanelDropdown,
  // Dialog
  PanelDialogDefaults,
  PanelDialog,
  // Drawer
  PanelDrawerDefaults,
  PanelDrawer,
  // Content
  PanelContentVersion,
  PanelContentVersions,
  PanelContentLock,
  PanelContentEnv,
  PanelContent,
  // Searcher
  PanelSearchPagination,
  PanelSearchOptions,
  PanelSearchResult,
  PanelSearcher,
  // Upload
  PanelUploadFile,
  PanelUploadDefaults,
  PanelUpload,
  // Events
  PanelKeychain,
  PanelEventEmitter,
  PanelEvents,
} from "./features";

// =============================================================================
// Re-exports from panel.helpers.ts
// =============================================================================

export type {
  // Array
  PanelArraySearchOptions,
  PanelHelpersArray,
  // String
  PanelSlugRules,
  PanelHelpersString,
  // Object
  PanelHelpersObject,
  // URL
  PanelHelpersUrl,
  // Clipboard
  PanelHelpersClipboard,
  // Embed
  PanelHelpersEmbed,
  // Field
  PanelFieldDefinition,
  PanelHelpersField,
  // File
  PanelHelpersFile,
  // Keyboard
  PanelHelpersKeyboard,
  // Link
  PanelLinkType,
  PanelLinkDetection,
  PanelLinkPreview,
  PanelHelpersLink,
  // Page
  PanelPageStatusProps,
  PanelHelpersPage,
  // Upload
  PanelUploadProgressCallback,
  PanelUploadCompleteCallback,
  PanelUploadParams,
  // Utility Types
  PanelDebounceOptions,
  PanelThrottleOptions,
  PanelDebouncedFunction,
  PanelSortOptions,
  PanelComparator,
  // Main Helpers Interface
  PanelHelpers,
} from "./helpers";

// =============================================================================
// Re-exports from panel.libraries.ts
// =============================================================================

export type {
  // Color Types
  PanelColorFormat,
  PanelColorRGB,
  PanelColorHSL,
  PanelColorHSV,
  PanelColorObject,
  PanelColorInput,
  PanelLibraryColors,
  // Dayjs Types
  PanelDayjsISOFormat,
  PanelDayjsPatternPart,
  PanelDayjsPattern,
  PanelDayjsInstance,
  PanelDayjsInput,
  PanelDayjsUnit,
  PanelLibraryDayjs,
  // Autosize
  PanelLibraryAutosize,
  // Main Library Interface
  PanelLibrary,
} from "./libraries";

// =============================================================================
// Re-exports from panel.writer.ts
// =============================================================================

export type {
  // Writer Utilities
  WriterUtils,
  // Writer Contexts
  WriterMarkContext,
  WriterNodeContext,
  WriterExtensionContext,
} from "./writer";

// =============================================================================
// Panel App
// =============================================================================

/**
 * Vue application instance with Panel extensions.
 *
 * The Panel Vue app includes additional properties on the Vue prototype:
 * - `$helper` - Utility functions for common operations
 * - `$library` - External libraries (colors, dayjs, autosize)
 *
 * @example
 * ```ts
 * // In a Vue component
 * const slug = this.$helper.slug("My Page Title");
 * const date = this.$library.dayjs("2024-01-15").format("DD.MM.YYYY");
 * ```
 */
export type PanelApp = InstanceType<VueConstructor> & {
  $library: PanelLibrary;
  $helper: PanelHelpers;
  /** Shortcut for escaping HTML (alias for `$helper.string.escapeHTML`) */
  $esc: (string: string) => string;
};

// =============================================================================
// Panel Configuration
// =============================================================================

/**
 * Panel API configuration.
 */
export interface PanelConfigApi {
  /** Whether to use method override for PUT/PATCH/DELETE */
  methodOverride: boolean;
}

/**
 * Global Panel configuration.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/config/config.js
 */
export interface PanelConfig {
  /** API configuration */
  api: PanelConfigApi;
  /** Whether debug mode is enabled */
  debug: boolean;
  /** Whether KirbyText is enabled */
  kirbytext: boolean;
  /** Current theme setting */
  theme: string;
  /** Current translation code */
  translation: string;
  /** Maximum upload size in bytes */
  upload: number;
}

// =============================================================================
// Panel Permissions
// =============================================================================

/**
 * Access permissions for Panel areas.
 */
export interface PanelPermissionsAccess {
  account: boolean;
  languages: boolean;
  panel: boolean;
  site: boolean;
  system: boolean;
  users: boolean;
}

/**
 * File operation permissions.
 */
export interface PanelPermissionsFiles {
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
 * Language operation permissions.
 */
export interface PanelPermissionsLanguages {
  create: boolean;
  delete: boolean;
  update: boolean;
}

/**
 * Page operation permissions.
 */
export interface PanelPermissionsPages {
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
 */
export interface PanelPermissionsSite {
  changeTitle: boolean;
  update: boolean;
}

/**
 * User management permissions (for other users).
 */
export interface PanelPermissionsUsers {
  changeEmail: boolean;
  changeLanguage: boolean;
  changeName: boolean;
  changePassword: boolean;
  changeRole: boolean;
  create: boolean;
  delete: boolean;
  update: boolean;
}

/**
 * Current user permissions (for own account).
 */
export interface PanelPermissionsUser {
  changeEmail: boolean;
  changeLanguage: boolean;
  changeName: boolean;
  changePassword: boolean;
  changeRole: boolean;
  delete: boolean;
  update: boolean;
}

/**
 * Complete permission set for the current user.
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions/permissions
 */
export interface PanelPermissions {
  access: PanelPermissionsAccess;
  files: PanelPermissionsFiles;
  languages: PanelPermissionsLanguages;
  pages: PanelPermissionsPages;
  site: PanelPermissionsSite;
  users: PanelPermissionsUsers;
  user: PanelPermissionsUser;
}

// =============================================================================
// Panel Search
// =============================================================================

/**
 * Search type definition.
 */
export interface PanelSearchType {
  /** Icon for the search type */
  icon: string;
  /** Display label */
  label: string;
  /** Unique identifier */
  id: string;
}

/**
 * Available search types in the Panel.
 */
export interface PanelSearches {
  pages: PanelSearchType;
  files: PanelSearchType;
  users: PanelSearchType;
  [key: string]: PanelSearchType;
}

// =============================================================================
// Panel URLs
// =============================================================================

/**
 * Base URLs for Panel operations.
 */
export interface PanelUrls {
  /** API endpoint URL */
  api: string;
  /** Site URL */
  site: string;
}

// =============================================================================
// Panel Request Response
// =============================================================================

/**
 * Response object from Panel requests.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/request.js
 */
export interface PanelRequestResponse {
  /** The original Request object */
  request: Request;
  /** The parsed response */
  response: {
    /** Parsed JSON data */
    json: any;
    /** Raw response text */
    text: string;
  };
}

// =============================================================================
// Panel Plugins
// =============================================================================

/**
 * Third-party plugin data.
 */
export type PanelPluginsThirdParty = Record<string, any>;

/**
 * Custom view button definitions.
 */
export type PanelPluginsViewButtons = Record<
  string,
  ComponentPublicInstance | Record<string, any>
>;

/**
 * Custom writer node definitions.
 */
export type PanelPluginsWriterNodes = Record<string, Record<string, any>>;

/**
 * Custom view definitions.
 */
export type PanelPluginsViews = Record<string, Record<string, any>>;

/**
 * Panel plugin system.
 *
 * Manages Vue components, icons, and extensions registered by plugins.
 * Properties are ordered to match `panel/public/js/plugins.js`.
 *
 * @see https://getkirby.com/docs/reference/plugins/extensions
 */
export interface PanelPlugins {
  // ---------------------------------------------------------------------------
  // Helper Functions (from panel/src/panel/plugins.js)
  // ---------------------------------------------------------------------------

  /**
   * Resolves a component extension if defined as component name.
   *
   * @param app - Vue application instance
   * @param name - Component name being registered
   * @param component - Component options object
   * @returns Updated/extended component options
   */
  resolveComponentExtension: (app: any, name: string, component: any) => any;

  /**
   * Resolves available mixins if they are defined.
   *
   * @param component - Component options object
   * @returns Updated component options with resolved mixins
   */
  resolveComponentMixins: (component: any) => any;

  /**
   * Resolves a component's competing template/render options.
   *
   * @param component - Component options object
   * @returns Updated component options
   */
  resolveComponentRender: (component: any) => any;

  // ---------------------------------------------------------------------------
  // Plugin Data (ordered as in panel/public/js/plugins.js)
  // ---------------------------------------------------------------------------

  /** Registered Vue components */
  components: Record<string, ComponentPublicInstance>;

  /** Callbacks to run after Panel creation */
  created: Array<() => void>;

  /** Registered SVG icons */
  icons: Record<string, string>;

  /** Custom login component (set dynamically by plugins) */
  login: ComponentPublicInstance | null;

  /** Registered Panel routes */
  routes: Record<string, any>[];

  /** Registered textarea toolbar buttons */
  textareaButtons: Record<string, Record<string, any>>;

  /** Registered third-party plugin data */
  thirdParty: PanelPluginsThirdParty;

  /** Installed Vue plugins via `Vue.use()` */
  use: any[];

  /** Registered view buttons */
  viewButtons: PanelPluginsViewButtons;

  /** Registered Panel views */
  views: PanelPluginsViews;

  /** Registered writer marks */
  writerMarks: Record<string, Record<string, any>>;

  /** Registered writer nodes */
  writerNodes: PanelPluginsWriterNodes;
}

// =============================================================================
// Panel Language Info
// =============================================================================

/**
 * Language information for multi-language sites.
 */
export interface PanelLanguageInfo {
  /** Language code (e.g., `"en"`, `"de"`) */
  code: string;
  /** Whether this is the default language */
  default: boolean;
  /** Text direction */
  direction: "ltr" | "rtl";
  /** Display name */
  name: string;
  /** Slug conversion rules */
  rules: Record<string, string>;
}

// =============================================================================
// Panel Global State
// =============================================================================

/**
 * Global Panel state for `panel.state()`.
 */
export interface PanelGlobalState {
  activation: PanelFeatures.PanelActivationDefaults;
  dialog: PanelFeatures.PanelDialogDefaults;
  drag: PanelFeatures.PanelDragDefaults;
  drawer: PanelFeatures.PanelDrawerDefaults;
  dropdown: PanelFeatureDefaults;
  language: PanelFeatures.PanelLanguageDefaults;
  menu: PanelFeatures.PanelMenuDefaults;
  notification: PanelFeatures.PanelNotificationDefaults;
  system: PanelFeatures.PanelSystemDefaults;
  theme: PanelFeatures.PanelThemeDefaults;
  translation: PanelFeatures.PanelTranslationDefaults;
  user: PanelFeatures.PanelUserDefaults;
  view: PanelFeatures.PanelViewDefaults;
}

// =============================================================================
// Main Panel Interface
// =============================================================================

/**
 * The main Panel interface.
 *
 * The Panel is the central object managing the Kirby admin interface.
 * It provides access to all features, configuration, and the API client.
 *
 * @example
 * ```ts
 * // Access via window.$panel in browser
 * const panel = window.$panel;
 *
 * // Navigate to a page
 * await panel.view.open("/pages/home");
 *
 * // Open a dialog
 * await panel.dialog.open("/dialogs/pages/create");
 *
 * // Make an API request
 * const data = await panel.get("/api/pages/home");
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/panel.js
 */
export interface Panel {
  // ---------------------------------------------------------------------------
  // Core Properties
  // ---------------------------------------------------------------------------

  /** Vue application instance */
  readonly app: PanelApp;

  /** Current editing context */
  readonly context: PanelContext;

  /** Whether debug mode is enabled */
  readonly debug: boolean;

  /** Text direction */
  readonly direction: "ltr" | "rtl";

  /** Document title */
  title: string;

  /** Whether any feature is loading */
  isLoading: boolean;

  /** Whether the browser is offline */
  isOffline: boolean;

  // ---------------------------------------------------------------------------
  // State Objects (extend State)
  // ---------------------------------------------------------------------------

  /** License activation state */
  activation: PanelFeatures.PanelActivation;

  /** Drag and drop state */
  drag: PanelFeatures.PanelDrag;

  /** Global event handling */
  events: PanelFeatures.PanelEvents;

  /** Current language state */
  language: PanelFeatures.PanelLanguage;

  /** Navigation menu state */
  menu: PanelFeatures.PanelMenu;

  /** Notification display */
  notification: PanelFeatures.PanelNotification;

  /** Search functionality */
  searcher: PanelFeatures.PanelSearcher;

  /** System information */
  system: PanelFeatures.PanelSystem;

  /** Theme settings */
  theme: PanelFeatures.PanelTheme;

  /** Translation data */
  translation: PanelFeatures.PanelTranslation;

  /** File upload handling */
  upload: PanelFeatures.PanelUpload;

  /** Current user data */
  user: PanelFeatures.PanelUser;

  // ---------------------------------------------------------------------------
  // Features (extend Feature)
  // ---------------------------------------------------------------------------

  /** Content versioning and saving */
  content: PanelFeatures.PanelContent;

  /** Dropdown menus */
  dropdown: PanelFeatures.PanelDropdown;

  /** Main view */
  view: PanelFeatures.PanelView;

  // ---------------------------------------------------------------------------
  // Modals (extend Modal)
  // ---------------------------------------------------------------------------

  /** Modal dialogs */
  dialog: PanelFeatures.PanelDialog;

  /** Slide-out drawers */
  drawer: PanelFeatures.PanelDrawer;

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  /** API client */
  api: PanelApi;

  /** Panel configuration */
  config: PanelConfig;

  /** Available languages */
  languages: PanelLanguageInfo[];

  /** License status */
  license: string;

  /** Whether multi-language is enabled */
  multilang: boolean;

  /** User permissions */
  permissions: PanelPermissions;

  /** Plugin system */
  plugins: PanelPlugins;

  /** Available search types */
  searches: PanelSearches;

  /** Base URLs */
  urls: PanelUrls;

  // ---------------------------------------------------------------------------
  // Methods
  // ---------------------------------------------------------------------------

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
   * Handles an error, optionally opening a notification.
   *
   * @param error - Error or message
   * @param openNotification - Whether to show notification (default: true)
   * @returns Notification state if opened, void otherwise
   */
  error: (
    error: Error | string,
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
   * @returns The new Panel state
   */
  open: (
    url: string | URL | Partial<PanelGlobalState>,
    options?: PanelRequestOptions,
  ) => Promise<PanelGlobalState>;

  /**
   * Returns all open overlay types.
   *
   * Returns an array of currently open overlays in order.
   * Only includes "drawer" and "dialog" - the view is not an overlay.
   *
   * @returns Array of open overlay types
   */
  overlays: () => ("drawer" | "dialog")[];

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
   * Navigates to a different Panel path.
   *
   * @param path - Path to navigate to
   */
  redirect: (path: string) => void;

  /**
   * Reloads the current view.
   *
   * @param options - Request options
   */
  reload: (options?: PanelRequestOptions) => Promise<void>;

  /**
   * Sends a request through the Panel router.
   *
   * Returns an object with both the request and parsed response,
   * or `false` if the request was redirected externally.
   *
   * @param url - URL to request
   * @param options - Request options including method
   * @returns Request/response object or false on redirect
   */
  request: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelRequestResponse | false>;

  /**
   * Opens the search dialog or performs a search query.
   *
   * When called without a query, opens the search dialog
   * with the specified search type pre-selected.
   *
   * When called with a query, performs the search and returns results.
   *
   * @param type - Search type ('pages', 'files', 'users')
   * @param query - Search query string
   * @param options - Search options (page, limit)
   * @returns Search results when query provided, void otherwise
   */
  search: {
    (type: string): void;
    (
      type: string,
      query: string,
      options?: PanelFeatures.PanelSearchOptions,
    ): Promise<PanelFeatures.PanelSearchResult>;
  };

  /**
   * Sets global Panel state.
   *
   * @param state - State to merge
   */
  set: (state: Partial<PanelGlobalState>) => void;

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
   * @param args - Replacement values
   * @returns Translated string
   */
  t: (key: string, ...args: any[]) => string;

  /**
   * Creates a URL object for a Panel path.
   *
   * @param path - Path (default: current path)
   * @param query - Query parameters
   * @param origin - Base origin
   * @returns URL object
   */
  url: (path?: string, query?: Record<string, any>, origin?: string) => URL;
}

// =============================================================================
// View Props (commonly used)
// =============================================================================

/**
 * Lock information for content.
 */
export interface PanelViewPropsLockUser {
  id: string;
  email: string;
}

/**
 * Content lock state.
 */
export interface PanelViewPropsLock {
  isLegacy: boolean;
  isLocked: boolean;
  modified: string | null;
  user: PanelViewPropsLockUser;
}

/**
 * Content permissions for a view.
 */
export interface PanelViewPropsPermissions {
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
 * Version information.
 */
export interface PanelViewPropsVersions {
  latest: Record<string, any>;
  changes: Record<string, any>;
}

/**
 * Tab definition.
 */
export interface PanelViewPropsTab {
  label: string;
  icon: string;
  columns: Record<string, any>[];
  link: string;
  name: string;
}

/**
 * Navigation link (next/prev).
 */
export interface PanelViewPropsNavigation {
  link: string;
  title: string;
}

/**
 * Model information.
 */
export interface PanelViewPropsModel {
  id: string;
  link: string;
  parent: string;
  previewUrl: string;
  status: string;
  title: string;
  uuid: string;
}

/**
 * Button definition.
 */
export interface PanelViewPropsButton {
  component: string;
  key: string;
  props: {
    class?: string;
    disabled?: boolean;
    icon?: string;
    link?: string;
    responsive?: boolean;
    size?: string;
    target?: string;
    title?: string;
    type?: string;
    variant?: string;
  };
}

/**
 * Common view props passed from backend.
 */
export interface PanelViewProps {
  api: string;
  buttons: PanelViewPropsButton[];
  id: string;
  link: string;
  lock: PanelViewPropsLock;
  permissions: PanelViewPropsPermissions;
  tabs: Record<string, any>[];
  uuid: string;
  versions: PanelViewPropsVersions;
  tab: PanelViewPropsTab;
  next: PanelViewPropsNavigation;
  prev: PanelViewPropsNavigation;
  blueprint: string;
  model: PanelViewPropsModel;
  title: string;
}
