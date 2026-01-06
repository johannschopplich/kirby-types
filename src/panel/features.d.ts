/**
 * Feature type definitions for Kirby Panel.
 *
 * This module provides typed interfaces for all Panel features,
 * including state objects, features, and modals.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/panel
 * @since 4.0.0
 */

import type {
  NotificationContext,
  NotificationTheme,
  NotificationType,
  PanelEventCallback,
  PanelEventListeners,
  PanelFeature,
  PanelFeatureDefaults,
  PanelHistory,
  PanelModal,
  PanelModalListeners,
  PanelRequestOptions,
  PanelState,
} from "./base";

// -----------------------------------------------------------------------------
// Timer
// -----------------------------------------------------------------------------

/**
 * Simple timer utility for auto-closing notifications.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/timer.js
 * @since 4.0.0
 */
export interface PanelTimer {
  /** Current interval ID, or null if not running */
  interval: ReturnType<typeof setInterval> | null;

  /**
   * Starts the timer with a callback.
   * Stops any previous timer first.
   *
   * @param timeout - Delay in milliseconds
   * @param callback - Function to call after timeout
   */
  start: (timeout: number | null, callback: () => void) => void;

  /**
   * Stops the timer and clears the interval.
   */
  stop: () => void;
}

// -----------------------------------------------------------------------------
// Activation
// -----------------------------------------------------------------------------

/**
 * Default state for the activation feature.
 */
export interface PanelActivationDefaults {
  /** Whether the activation card is visible */
  isOpen: boolean;
}

/**
 * Activation state for license registration prompts.
 *
 * Controls visibility of the license activation card based on
 * session storage state.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/activiation.js
 * @since 4.0.0
 */
export interface PanelActivation extends PanelState<PanelActivationDefaults> {
  /** Whether the activation card is visible */
  isOpen: boolean;

  /**
   * Closes the activation card and persists state to session storage.
   */
  close: () => void;

  /**
   * Opens the activation card and clears session storage state.
   */
  open: () => void;
}

// -----------------------------------------------------------------------------
// Drag
// -----------------------------------------------------------------------------

/**
 * Default state for drag operations.
 */
export interface PanelDragDefaults {
  /** Type of item being dragged */
  type: string | null;
  /** Data associated with the dragged item */
  data: Record<string, any>;
}

/**
 * Drag state for tracking drag-and-drop operations.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/drag.js
 * @since 4.0.0
 */
export interface PanelDrag extends PanelState<PanelDragDefaults> {
  /** Type of item being dragged */
  type: string | null;
  /** Data associated with the dragged item */
  data: Record<string, any>;

  /** Whether a drag operation is in progress */
  readonly isDragging: boolean;

  /**
   * Starts a drag operation with type and data.
   *
   * @param type - Drag item type (e.g., `"page"`, `"file"`)
   * @param data - Associated data (string or object)
   */
  start: (type: string, data: string | Record<string, any>) => void;

  /**
   * Stops the current drag operation and resets state.
   */
  stop: () => void;
}

// -----------------------------------------------------------------------------
// Theme
// -----------------------------------------------------------------------------

/**
 * Default state for theme management.
 */
export interface PanelThemeDefaults {
  /** User's theme preference from localStorage */
  setting: string | null;
  /** System preference from media query */
  system: "light" | "dark";
}

/**
 * Theme type values.
 */
export type PanelThemeValue = "light" | "dark" | "system";

/**
 * Theme state for managing Panel color scheme.
 *
 * Supports user preference, system preference, and config-based themes.
 * Watches system media query for dark mode changes.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/theme.js
 * @since 5.0.0
 */
export interface PanelTheme extends Omit<
  PanelState<PanelThemeDefaults>,
  "reset" | "set"
> {
  /** User's theme preference from localStorage */
  setting: string | null;
  /** System preference from media query */
  system: "light" | "dark";

  /** Theme from Panel config */
  readonly config: string;

  /** Resolved current theme */
  readonly current: "light" | "dark";

  /**
   * Resets theme to config/system default.
   * Removes localStorage preference.
   */
  reset: () => void;

  /**
   * Sets user theme preference.
   * Persists to localStorage.
   *
   * @param theme - Theme value
   */
  set: (theme: PanelThemeValue) => void;
}

// -----------------------------------------------------------------------------
// Language (Content Language)
// -----------------------------------------------------------------------------

/**
 * Default state for content language.
 */
export interface PanelLanguageDefaults {
  /** Language code (e.g., `"en"`, `"de"`) */
  code: string | null;
  /** Whether this is the default language */
  default: boolean;
  /** Text direction */
  direction: "ltr" | "rtl";
  /** Language name */
  name: string | null;
  /** Slug conversion rules */
  rules: Record<string, string> | null;
}

/**
 * Content language state.
 *
 * Represents the current content language for multilingual sites.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/language.js
 * @since 4.0.0
 */
export interface PanelLanguage extends PanelState<PanelLanguageDefaults> {
  /** Language code (e.g., `"en"`, `"de"`) */
  code: string | null;
  /** Whether this is the default language */
  default: boolean;
  /** Text direction */
  direction: "ltr" | "rtl";
  /** Language name */
  name: string | null;
  /** Slug conversion rules */
  rules: Record<string, string> | null;

  /** Alias for `default` property */
  readonly isDefault: boolean;
}

// -----------------------------------------------------------------------------
// Menu
// -----------------------------------------------------------------------------

/**
 * Menu entry types.
 */
export interface PanelMenuEntry {
  /** Whether this entry is currently active */
  current: boolean;
  /** Icon name */
  icon: string;
  /** Link URL */
  link: string;
  /** Display text */
  text: string;
  /** Tooltip text */
  title: string;
}

/**
 * Default state for the sidebar menu.
 */
export interface PanelMenuDefaults {
  /** Menu entries (items or separator strings) */
  entries: (PanelMenuEntry | "-")[];
  /** Whether menu is being hovered */
  hover: boolean;
  /** Whether menu is expanded */
  isOpen: boolean;
}

/**
 * Sidebar menu state.
 *
 * Manages the Panel sidebar with responsive behavior
 * for mobile and desktop layouts.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/menu.js
 * @since 4.0.0
 */
export interface PanelMenu extends Omit<PanelState<PanelMenuDefaults>, "set"> {
  /** Menu entries (items or separator strings) */
  entries: (PanelMenuEntry | "-")[];
  /** Whether menu is being hovered */
  hover: boolean;
  /** Whether menu is expanded */
  isOpen: boolean;

  /**
   * Handles outside clicks to close mobile menu.
   * Returns false if not mobile/open, void otherwise.
   * @internal
   */
  blur: (event: Event) => false | void;

  /**
   * Collapses the sidebar menu.
   * Persists state to localStorage on desktop.
   */
  close: () => void;

  /**
   * Handles escape key to close mobile menu.
   * Returns false if not mobile/open, void otherwise.
   * @internal
   */
  escape: () => false | void;

  /**
   * Expands the sidebar menu.
   * Removes localStorage state on desktop.
   */
  open: () => void;

  /**
   * Handles resize between mobile and desktop.
   * @internal
   */
  resize: () => void;

  /**
   * Sets menu entries and handles initial resize.
   */
  set: (entries: (PanelMenuEntry | "-")[]) => PanelMenuDefaults;

  /**
   * Toggles the sidebar menu state.
   */
  toggle: () => void;
}

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

/**
 * Default state for notifications.
 */
export interface PanelNotificationDefaults {
  /** Context where notification appears */
  context: NotificationContext | null;
  /** Additional details (for error dialogs) */
  details: Record<string, any> | null;
  /** Icon name */
  icon: string | null;
  /** Whether notification is visible */
  isOpen: boolean;
  /** Notification message */
  message: string | null;
  /** Visual theme */
  theme: NotificationTheme | null;
  /** Auto-close timeout in ms */
  timeout: number | null;
  /** Notification type */
  type: NotificationType | null;
}

/**
 * Options for opening a notification.
 */
export interface PanelNotificationOptions {
  /** Context where notification appears */
  context?: NotificationContext;
  /** Additional details */
  details?: Record<string, any>;
  /** Icon name */
  icon?: string;
  /** Notification message */
  message?: string;
  /** Visual theme */
  theme?: NotificationTheme;
  /** Auto-close timeout in ms (default: 4000 for non-errors) */
  timeout?: number;
  /** Notification type */
  type?: NotificationType;
}

/**
 * Error object for notifications.
 */
export interface PanelErrorObject {
  /** Error message */
  message: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Error key for special handling */
  key?: string;
}

/**
 * Notification state for user feedback.
 *
 * Displays contextual notifications in view, dialog, or drawer.
 * Supports auto-close timers and different severity levels.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/notification.js
 * @since 4.0.0
 */
export interface PanelNotification extends PanelState<PanelNotificationDefaults> {
  /** Context where notification appears */
  context: NotificationContext | null;
  /** Additional details (for error dialogs) */
  details: Record<string, any> | null;
  /** Icon name */
  icon: string | null;
  /** Whether notification is visible */
  isOpen: boolean;
  /** Notification message */
  message: string | null;
  /** Visual theme */
  theme: NotificationTheme | null;
  /** Auto-close timeout in ms */
  timeout: number | null;
  /** Notification type */
  type: NotificationType | null;

  /** Timer for auto-close functionality */
  timer: PanelTimer;

  /** Whether this is a fatal error notification */
  readonly isFatal: boolean;

  /**
   * Closes the notification and resets state.
   */
  close: () => PanelNotificationDefaults;

  /**
   * Logs a deprecation warning to console.
   *
   * @param message - Deprecation message
   */
  deprecated: (message: string) => void;

  /**
   * Creates an error notification.
   * Opens error dialog in view context.
   * May redirect to logout for auth errors.
   *
   * @param error - Error object, string, or Error instance
   * @returns Notification state, or void if redirected
   */
  error: (
    error: Error | string | PanelErrorObject,
  ) => PanelNotificationDefaults | void;

  /**
   * Creates a fatal error notification.
   * Displayed in an isolated iframe.
   *
   * @param error - Error object, string, or Error instance
   */
  fatal: (error: Error | string) => PanelNotificationDefaults;

  /**
   * Creates an info notification.
   *
   * @param info - Message string or options object
   */
  info: (info?: string | PanelNotificationOptions) => PanelNotificationDefaults;

  /**
   * Opens a notification with the given options.
   *
   * @param notification - Message string or options object
   */
  open: (
    notification: string | PanelNotificationOptions,
  ) => PanelNotificationDefaults;

  /**
   * Creates a success notification.
   *
   * @param success - Message string or options object
   */
  success: (
    success?: string | PanelNotificationOptions,
  ) => PanelNotificationDefaults;
}

// -----------------------------------------------------------------------------
// System
// -----------------------------------------------------------------------------

/**
 * Default state for system information.
 */
export interface PanelSystemDefaults {
  /** ASCII character replacements for slugs */
  ascii: Record<string, string>;
  /** CSRF token for API requests */
  csrf: string;
  /** Whether running on localhost */
  isLocal: boolean;
  /** Locale names by code */
  locales: Record<string, string>;
  /** Slug rules by language */
  slugs: Record<string, string>;
  /** Site title */
  title: string;
}

/**
 * System state with server configuration.
 *
 * Contains static system information from the server.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/system.js
 * @since 4.0.0
 */
export interface PanelSystem extends PanelState<PanelSystemDefaults> {
  /** ASCII character replacements for slugs */
  ascii: Record<string, string>;
  /** CSRF token for API requests */
  csrf: string;
  /** Whether running on localhost */
  isLocal: boolean;
  /** Locale names by code */
  locales: Record<string, string>;
  /** Slug rules by language */
  slugs: Record<string, string>;
  /** Site title */
  title: string;
}

// -----------------------------------------------------------------------------
// Translation (Interface Language)
// -----------------------------------------------------------------------------

/**
 * Default state for interface translation.
 */
export interface PanelTranslationDefaults {
  /** Translation code (e.g., `"en"`, `"de"`) */
  code: string;
  /** Translation strings by key */
  data: Record<string, string>;
  /** Text direction */
  direction: "ltr" | "rtl";
  /** Translation name */
  name: string;
  /** First day of week (`0`=Sunday, `1`=Monday) */
  weekday: number;
}

/**
 * Interface translation state.
 *
 * Manages UI translations for the current user.
 * Updates document language and direction on change.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/translation.js
 * @since 4.0.0
 */
export interface PanelTranslation extends PanelState<PanelTranslationDefaults> {
  /** Translation code (e.g., `"en"`, `"de"`) */
  code: string;
  /** Translation strings by key */
  data: Record<string, string>;
  /** Text direction */
  direction: "ltr" | "rtl";
  /** Translation name */
  name: string;
  /** First day of week (`0`=Sunday, `1`=Monday) */
  weekday: number;

  /**
   * Sets translation state and updates document language/direction.
   */
  set: (state: Partial<PanelTranslationDefaults>) => PanelTranslationDefaults;

  /**
   * Fetches a translation string with optional placeholder replacement.
   *
   * @param key - Translation key
   * @param data - Placeholder values
   * @param fallback - Fallback if key not found
   * @returns Translated string or undefined
   */
  translate: (
    key: string,
    data?: Record<string, any>,
    fallback?: string | null,
  ) => string | undefined;
}

// -----------------------------------------------------------------------------
// User
// -----------------------------------------------------------------------------

/**
 * Default state for the current user.
 */
export interface PanelUserDefaults {
  /** User email */
  email: string | null;
  /** User ID */
  id: string | null;
  /** User's interface language */
  language: string | null;
  /** User's role */
  role: string | null;
  /** Username */
  username: string | null;
}

/**
 * Current user state.
 *
 * Contains information about the logged-in user.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/user.js
 * @since 4.0.0
 */
export interface PanelUser extends PanelState<PanelUserDefaults> {
  /** User email */
  email: string | null;
  /** User ID */
  id: string | null;
  /** User's interface language */
  language: string | null;
  /** User's role */
  role: string | null;
  /** Username */
  username: string | null;
}

// -----------------------------------------------------------------------------
// View
// -----------------------------------------------------------------------------

/**
 * Breadcrumb item for view navigation.
 */
export interface PanelBreadcrumbItem {
  /** Display label */
  label: string;
  /** Navigation link */
  link: string;
}

/**
 * Default state for the view feature.
 */
export interface PanelViewDefaults extends PanelFeatureDefaults {
  /** Breadcrumb navigation items */
  breadcrumb: PanelBreadcrumbItem[];
  /** Label for current breadcrumb */
  breadcrumbLabel: string | null;
  /** View icon */
  icon: string | null;
  /** View ID */
  id: string | null;
  /** View link */
  link: string | null;
  /** Default search type */
  search: string;
  /** View title */
  title: string | null;
}

/**
 * View feature for main Panel content.
 *
 * Manages the primary view state, document title,
 * and browser history.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/view.js
 * @since 4.0.0
 */
export interface PanelView extends Omit<
  PanelFeature<PanelViewDefaults>,
  "set"
> {
  /** Breadcrumb navigation items */
  breadcrumb: PanelBreadcrumbItem[];
  /** Label for current breadcrumb */
  breadcrumbLabel: string | null;
  /** View icon */
  icon: string | null;
  /** View ID */
  id: string | null;
  /** View link */
  link: string | null;
  /** Default search type */
  search: string;
  /** View title */
  title: string | null;

  /**
   * Loads a view, canceling any previous request.
   */
  load: (
    url: string | URL,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelViewDefaults>;

  /**
   * Sets view state and updates document title and browser URL.
   */
  set: (state: Partial<PanelViewDefaults>) => void;

  /**
   * Submits the view form.
   * @throws Error - Not yet implemented
   */
  submit: () => Promise<never>;
}

// -----------------------------------------------------------------------------
// Dropdown
// -----------------------------------------------------------------------------

/**
 * Dropdown option item.
 */
export interface PanelDropdownOption {
  /** Option text */
  text: string;
  /** Icon name */
  icon?: string;
  /** Click handler or link */
  click?: () => void | string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Dropdown feature for context menus.
 *
 * Manages dropdown menus loaded from the server
 * or created programmatically.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/dropdown.js
 * @since 4.0.0
 */
export interface PanelDropdown extends PanelFeature<PanelFeatureDefaults> {
  /**
   * Closes the dropdown and resets state.
   */
  close: () => void;

  /**
   * Opens a dropdown by URL or state object.
   * URLs are prefixed with `/dropdowns/`.
   */
  open: (
    dropdown: string | URL | Partial<PanelFeatureDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelFeatureDefaults>;

  /**
   * Opens a dropdown asynchronously.
   *
   * @deprecated Since 4.0.0 - Use `open()` instead
   */
  openAsync: (
    dropdown: string | URL | Partial<PanelFeatureDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => (ready?: () => void) => Promise<PanelFeatureDefaults>;

  /**
   * Returns dropdown options array from props.
   */
  options: () => PanelDropdownOption[];

  /**
   * Sets dropdown state, handling deprecated responses.
   */
  set: (state: Partial<PanelFeatureDefaults>) => PanelFeatureDefaults;
}

// -----------------------------------------------------------------------------
// Dialog
// -----------------------------------------------------------------------------

/**
 * Default state for the dialog modal.
 */
export interface PanelDialogDefaults extends PanelFeatureDefaults {
  /** Unique dialog ID */
  id: string | null;
  /** Whether using legacy Vue component */
  legacy: boolean;
  /** Reference to legacy component */
  ref: any;
}

/**
 * Dialog modal for overlays.
 *
 * Supports both modern fiber dialogs and legacy Vue component dialogs.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/dialog.js
 * @since 4.0.0
 */
export interface PanelDialog extends PanelModal<PanelDialogDefaults> {
  /** Whether using legacy Vue component */
  legacy: boolean;
  /** Reference to legacy component */
  ref: any;

  /**
   * Closes the dialog, handling legacy components.
   */
  close: () => Promise<void>;

  /**
   * Opens a dialog by URL, state object, or legacy component.
   */
  open: (
    dialog:
      | string
      | URL
      | Partial<PanelDialogDefaults>
      | { component: string; props?: Record<string, any> },
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDialogDefaults>;

  /**
   * Opens a legacy Vue component dialog.
   *
   * @param dialog - Vue component instance
   * @deprecated Since 4.0.0 - Use `open()` with component object instead
   */
  openComponent: (dialog: any) => Promise<PanelDialogDefaults>;
}

// -----------------------------------------------------------------------------
// Drawer
// -----------------------------------------------------------------------------

/**
 * Default state for the drawer modal.
 */
export interface PanelDrawerDefaults extends PanelFeatureDefaults {
  /** Unique drawer ID */
  id: string | null;
}

/**
 * Drawer modal for side panels.
 *
 * Supports nested drawers with breadcrumb navigation.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/drawer.js
 * @since 4.0.0
 */
export interface PanelDrawer extends PanelModal<PanelDrawerDefaults> {
  /** Breadcrumb from history milestones */
  readonly breadcrumb: PanelHistory["milestones"];

  /** Drawer icon, defaults to `"box"` */
  readonly icon: string;

  /**
   * Opens a drawer by URL or state object.
   */
  open: (
    drawer: string | URL | Partial<PanelDrawerDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDrawerDefaults>;

  /**
   * Switches drawer tabs.
   *
   * @param tab - Tab name to switch to
   * @returns False if no tabs exist, void otherwise
   */
  tab: (tab: string) => void | false;

  /**
   * Returns drawer event listeners for Vue component binding.
   */
  listeners: () => PanelModalListeners;
}

// -----------------------------------------------------------------------------
// Content
// -----------------------------------------------------------------------------

/**
 * Content version representing saved or changed state.
 */
export interface PanelContentVersion {
  [field: string]: any;
}

/**
 * Content versions container.
 */
export interface PanelContentVersions {
  /** Original saved content */
  latest: PanelContentVersion;
  /** Current unsaved changes */
  changes: PanelContentVersion;
}

/**
 * Lock state for content editing.
 */
export interface PanelContentLock {
  /** Whether content is locked by another user */
  isLocked: boolean;
  /** Lock modification timestamp */
  modified?: Date;
  /** User who holds the lock */
  user?: { id: string; email: string };
  /** Whether using legacy lock system */
  isLegacy?: boolean;
}

/**
 * Environment context for content operations.
 */
export interface PanelContentEnv {
  /** API endpoint path */
  api?: string;
  /** Content language code */
  language?: string;
}

/**
 * Content feature for form state management.
 *
 * Manages content versions, saving, publishing, and lock handling.
 * Provides automatic save on input with throttling.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/content.js
 * @since 5.0.0
 */
export interface PanelContent {
  /** Reference to lock dialog if open */
  dialog: PanelDialog | null;

  /** Whether content is being saved/published/discarded */
  isProcessing: boolean;

  /** AbortController for save requests */
  saveAbortController: AbortController | null;

  /** Throttled save function (1000ms) */
  saveLazy: ((
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<void>) & { cancel: () => void };

  /**
   * Cancels any ongoing or scheduled save requests.
   */
  cancelSaving: () => void;

  /**
   * Returns object with all changed fields.
   *
   * @param env - Environment context
   * @throws Error if called for another view
   */
  diff: (env?: PanelContentEnv) => Record<string, any>;

  /**
   * Discards all unpublished changes.
   *
   * @param env - Environment context
   * @throws Error if locked or another view
   */
  discard: (env?: PanelContentEnv) => Promise<void>;

  /**
   * Emits a content event with environment context.
   *
   * @param event - Event name (prefixed with `"content."`)
   * @param options - Additional event data
   * @param env - Environment context
   */
  emit: (
    event: string,
    options?: Record<string, any>,
    env?: PanelContentEnv,
  ) => void;

  /**
   * Returns consistent environment with api and language.
   *
   * @param env - Override values
   */
  env: (env?: PanelContentEnv) => Required<PanelContentEnv>;

  /**
   * Whether there are any unsaved changes.
   *
   * @param env - Environment context
   */
  hasDiff: (env?: PanelContentEnv) => boolean;

  /**
   * Whether the API endpoint belongs to the current view.
   *
   * @param env - Environment context
   */
  isCurrent: (env?: PanelContentEnv) => boolean;

  /**
   * Whether the current view is locked.
   *
   * @param env - Environment context
   */
  isLocked: (env?: PanelContentEnv) => boolean;

  /**
   * Gets the lock state for the current view.
   *
   * @param env - Environment context
   * @throws Error if called for another view
   */
  lock: (env?: PanelContentEnv) => PanelContentLock;

  /**
   * Opens the lock dialog to inform about other edits.
   *
   * @param lock - Lock information
   */
  lockDialog: (lock: PanelContentLock) => void;

  /**
   * Merges new values with current changes.
   *
   * @param values - Values to merge
   * @param env - Environment context
   * @throws Error if called for another view
   */
  merge: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Record<string, any>;

  /**
   * Publishes current changes.
   *
   * @param values - Additional values to merge first
   * @param env - Environment context
   * @throws Error if called for another view
   */
  publish: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<void>;

  /**
   * Sends a content API request.
   *
   * @param method - API method (save, publish, discard)
   * @param values - Request payload
   * @param env - Environment context
   */
  request: (
    method?: "save" | "publish" | "discard",
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<any>;

  /**
   * Saves current changes.
   *
   * @param values - Values to save
   * @param env - Environment context
   */
  save: (values?: Record<string, any>, env?: PanelContentEnv) => Promise<void>;

  /**
   * Updates form values and saves.
   *
   * @param values - Values to update
   * @param env - Environment context
   */
  update: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<void>;

  /**
   * Updates form values with delay (throttled).
   *
   * @param values - Values to update
   * @param env - Environment context
   */
  updateLazy: (values?: Record<string, any>, env?: PanelContentEnv) => void;

  /**
   * Returns a specific version of content.
   *
   * @param versionId - Version identifier
   */
  version: (versionId: "latest" | "changes") => PanelContentVersion;

  /**
   * Returns all content versions.
   */
  versions: () => PanelContentVersions;
}

// -----------------------------------------------------------------------------
// Searcher
// -----------------------------------------------------------------------------

/**
 * Search pagination info.
 */
export interface PanelSearchPagination {
  page?: number;
  limit?: number;
  total?: number;
}

/**
 * Search query options.
 */
export interface PanelSearchOptions {
  /** Page number */
  page?: number;
  /** Results per page */
  limit?: number;
}

/**
 * Search result from API.
 */
export interface PanelSearchResult {
  /** Result list (null if query too short) */
  results: any[] | null;
  /** Pagination info */
  pagination: PanelSearchPagination;
}

/**
 * Searcher feature for Panel search.
 *
 * Manages search dialog and query requests.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/search.js
 * @since 4.4.0
 */
export interface PanelSearcher {
  /** AbortController for current request */
  controller: AbortController | null;

  /** Number of active requests */
  requests: number;

  /** Whether any search is loading */
  readonly isLoading: boolean;

  /**
   * Opens the search dialog.
   *
   * @param type - Search type (e.g., `"pages"`, `"files"`, `"users"`)
   */
  open: (type?: string) => void;

  /**
   * Queries the search API.
   * Returns empty results for queries under 2 characters.
   *
   * @param type - Search type
   * @param query - Search query
   * @param options - Pagination options
   */
  query: (
    type: string,
    query: string,
    options?: PanelSearchOptions,
  ) => Promise<PanelSearchResult>;
}

// -----------------------------------------------------------------------------
// Upload
// -----------------------------------------------------------------------------

/**
 * Upload file state representing a file in the upload queue.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/upload.js
 */
export interface PanelUploadFile {
  /** Unique file ID */
  id: string;
  /** Original File object */
  src: File;
  /** File name without extension */
  name: string;
  /** File extension without dot */
  extension: string;
  /** Original filename with extension */
  filename: string;
  /** File size in bytes */
  size: number;
  /** Formatted file size (e.g., `"1.2 MB"`) */
  niceSize: string;
  /** MIME type */
  type: string;
  /** Blob URL for preview */
  url: string;
  /** Upload progress (`0`-`100`) */
  progress: number;
  /** Whether upload completed */
  completed: boolean;
  /** Error message if failed */
  error: string | null;
  /** Response model after successful upload */
  model: any | null;
}

/**
 * Default state for upload feature.
 */
export interface PanelUploadDefaults {
  /** AbortController for current upload */
  abort: AbortController | null;
  /** Accepted file types */
  accept: string;
  /** Additional file attributes */
  attributes: Record<string, any>;
  /** Files to upload */
  files: PanelUploadFile[];
  /** Maximum number of files */
  max: number | null;
  /** Whether multiple files allowed */
  multiple: boolean;
  /** File preview data */
  preview: Record<string, any>;
  /** File being replaced */
  replacing: PanelUploadFile | null;
  /** Upload endpoint URL */
  url: string | null;
}

/**
 * Upload feature for file handling.
 *
 * Manages file selection, upload progress, and completion.
 * Supports chunked uploads for large files.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/upload.js
 * @since 4.0.0
 */
export interface PanelUpload
  extends PanelState<PanelUploadDefaults>, PanelEventListeners {
  /** AbortController for current upload */
  abort: AbortController | null;
  /** Accepted file types */
  accept: string;
  /** Additional file attributes */
  attributes: Record<string, any>;
  /** Files to upload */
  files: PanelUploadFile[];
  /** Maximum number of files */
  max: number | null;
  /** Whether multiple files allowed */
  multiple: boolean;
  /** File preview data */
  preview: Record<string, any>;
  /** File being replaced */
  replacing: PanelUploadFile | null;
  /** Upload endpoint URL */
  url: string | null;

  /** Hidden file input element */
  input: HTMLInputElement | null;

  /** Files that completed uploading */
  readonly completed: PanelUploadFile[];

  /**
   * Shows success notification and emits model.update.
   */
  announce: () => void;

  /**
   * Cancels current upload and resets state.
   */
  cancel: () => Promise<void>;

  /**
   * Called when upload dialog submit clicked.
   */
  done: () => Promise<void>;

  /**
   * Finds duplicate file by comparing properties.
   * Returns the index of the duplicate file, or false if not found.
   *
   * @param file - File to check
   * @returns Index of duplicate file or false
   */
  findDuplicate: (file: File) => number | false;

  /**
   * Checks if file has a unique name.
   *
   * @param file - File to check
   */
  hasUniqueName: (file: File) => boolean;

  /**
   * Converts File to enriched upload file object.
   *
   * @param file - File to convert
   */
  file: (file: File) => PanelUploadFile;

  /**
   * Opens file upload dialog.
   *
   * @param files - Initial files
   * @param options - Upload options
   */
  open: (
    files?: File[] | FileList,
    options?: Partial<PanelUploadDefaults>,
  ) => void;

  /**
   * Opens system file picker.
   *
   * @param options - Upload options
   */
  pick: (options?: Partial<PanelUploadDefaults>) => void;

  /**
   * Removes a file from the list.
   *
   * @param id - File ID to remove
   */
  remove: (id: string) => void;

  /**
   * Opens picker to replace an existing file.
   *
   * @param file - File to replace
   * @param options - Upload options
   */
  replace: (
    file: PanelUploadFile,
    options?: Partial<PanelUploadDefaults>,
  ) => void;

  /**
   * Adds files to upload list with deduplication.
   *
   * @param files - Files to add
   * @param options - Upload options
   */
  select: (
    files: File[] | FileList,
    options?: Partial<PanelUploadDefaults>,
  ) => void;

  /**
   * Sets state and registers event listeners.
   */
  set: (state: Partial<PanelUploadDefaults>) => PanelUploadDefaults;

  /**
   * Submits and uploads all remaining files.
   */
  submit: () => Promise<void>;

  /**
   * Uploads a single file with chunking support.
   *
   * @param file - File to upload
   * @param attributes - Additional attributes
   */
  upload: (
    file: PanelUploadFile,
    attributes?: Record<string, any>,
  ) => Promise<void>;
}

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

/**
 * Keychain modifier string (e.g., `'cmd.shift.s'`).
 */
export type PanelKeychain = string;

/**
 * Event emitter interface (mitt-compatible).
 */
export interface PanelEventEmitter {
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler?: (...args: any[]) => void) => void;
}

/**
 * Events feature for global event handling.
 *
 * Provides global event subscriptions and keyboard shortcut handling.
 * Uses mitt for the internal event bus.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/events.js
 * @since 4.0.0
 */
export interface PanelEvents extends PanelEventEmitter {
  /** Element that was entered during drag */
  entered: Element | null;

  // Global event handlers

  /**
   * Handles window beforeunload event.
   *
   * @param event - BeforeUnloadEvent
   */
  beforeunload: (event: BeforeUnloadEvent) => void;

  /**
   * Handles document blur event.
   *
   * @param event - FocusEvent
   */
  blur: (event: FocusEvent) => void;

  /**
   * Handles document click event.
   *
   * @param event - MouseEvent
   */
  click: (event: MouseEvent) => void;

  /**
   * Handles clipboard copy event.
   *
   * @param event - ClipboardEvent
   */
  copy: (event: ClipboardEvent) => void;

  /**
   * Handles window dragenter event.
   *
   * @param event - DragEvent
   */
  dragenter: (event: DragEvent) => void;

  /**
   * Handles window dragexit event.
   *
   * @param event - DragEvent
   */
  dragexit: (event: DragEvent) => void;

  /**
   * Handles window dragleave event.
   *
   * @param event - DragEvent
   */
  dragleave: (event: DragEvent) => void;

  /**
   * Handles window dragover event.
   *
   * @param event - DragEvent
   */
  dragover: (event: DragEvent) => void;

  /**
   * Handles window drop event.
   *
   * @param event - DragEvent
   */
  drop: (event: DragEvent) => void;

  /**
   * Handles document focus event.
   *
   * @param event - FocusEvent
   */
  focus: (event: FocusEvent) => void;

  /**
   * Creates keychain modifier string.
   *
   * @param type - Event type
   * @param event - KeyboardEvent
   * @returns Keychain string (e.g., `'keydown.cmd.shift.s'`)
   */
  keychain: (type: "keydown" | "keyup", event: KeyboardEvent) => PanelKeychain;

  /**
   * Handles window keydown event.
   *
   * @param event - KeyboardEvent
   */
  keydown: (event: KeyboardEvent) => void;

  /**
   * Handles window keyup event.
   *
   * @param event - KeyboardEvent
   */
  keyup: (event: KeyboardEvent) => void;

  /**
   * Handles offline event.
   *
   * @param event - Event
   */
  offline: (event: Event) => void;

  /**
   * Handles online event.
   *
   * @param event - Event
   */
  online: (event: Event) => void;

  /**
   * Handles clipboard paste event.
   *
   * @param event - ClipboardEvent
   */
  paste: (event: ClipboardEvent) => void;

  /**
   * Handles window popstate event (browser back).
   *
   * @param event - PopStateEvent
   */
  popstate: (event: PopStateEvent) => void;

  /**
   * Prevents event default and propagation.
   *
   * @param event - Event to prevent
   */
  prevent: (event: Event) => void;

  /**
   * Subscribes all global event listeners.
   */
  subscribe: () => void;

  /**
   * Unsubscribes all global event listeners.
   */
  unsubscribe: () => void;
}
