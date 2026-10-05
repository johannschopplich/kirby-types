/**
 * Feature type definitions for Kirby Panel.
 *
 * This module provides typed interfaces for all Panel features,
 * including state objects, features, and modals.
 *
 * @since 4.0.0
 */

import type {
  NotificationTheme,
  NotificationType,
  PanelContext,
  PanelEventCallback,
  PanelEventListenerMap,
  PanelEventListeners,
  PanelFeature,
  PanelFeatureDefaults,
  PanelModal,
  PanelModalListeners,
  PanelRequestOptions,
  PanelState,
} from "./base";

// #region Timer

/**
 * Simple timer utility for auto-closing notifications.
 *
 * @since 4.0.0
 * @source panel/src/helpers/timer.ts
 */
export interface PanelTimer {
  /** Whether the timer is currently running. */
  readonly isRunning: boolean;

  /**
   * Starts the timer with a callback.
   * Stops any previous timer first. Does nothing if `timeout <= 0`.
   *
   * @param timeout - Delay in milliseconds; values `<= 0` skip
   * @param callback - Function to call after timeout
   */
  start: (timeout: number, callback: () => void) => void;

  /** Stops the timer and clears the interval. */
  stop: () => void;
}
// #endregion

// #region Activation

/**
 * Default state for the activation feature.
 * @source panel/src/panel/activation.ts
 */
export interface PanelActivationDefaults {
  /** Whether the activation card is visible. */
  isOpen: boolean;
}

/**
 * Activation state for license registration prompts.
 *
 * Controls visibility of the license activation card based on
 * session storage state.
 *
 * @since 4.0.0
 * @source panel/src/panel/activation.ts
 */
export interface PanelActivation
  extends PanelState<PanelActivationDefaults>, PanelActivationDefaults {
  /** Closes the activation card and persists state to session storage. */
  close: () => void;

  /** Opens the activation card and clears session storage state. */
  open: () => void;
}
// #endregion

// #region Drag

/**
 * Default state for drag operations.
 * @source panel/src/panel/drag.ts
 */
export interface PanelDragDefaults {
  /** Type of item being dragged. */
  type: string | null;
  /** Data associated with the dragged item. */
  data: string | Record<string, any>;
}

/**
 * Drag state for tracking drag-and-drop operations.
 *
 * @since 4.0.0
 * @source panel/src/panel/drag.ts
 */
export interface PanelDrag
  extends PanelState<PanelDragDefaults>, PanelDragDefaults {
  /** Whether a drag operation is in progress. */
  readonly isDragging: boolean;

  /**
   * Starts a drag operation with type and data.
   *
   * @param type - Drag item type (e.g., `"page"`, `"file"`)
   * @param data - Associated data (string or object)
   */
  start: (type: string, data: string | Record<string, any>) => void;

  /** Stops the current drag operation and resets state. */
  stop: () => void;
}
// #endregion

// #region Theme

/**
 * Default state for theme management.
 * @source panel/src/panel/theme.ts
 */
export interface PanelThemeDefaults {
  /** User's theme preference from localStorage. */
  setting: string | null;
  /** System preference from media query. */
  system: "light" | "dark";
}

/**
 * Theme type values.
 * @source panel/src/panel/theme.ts
 */
export type PanelThemeValue = "light" | "dark" | "system";

/**
 * Theme state for managing Panel color scheme.
 *
 * Supports user preference, system preference, and config-based themes.
 * Watches system media query for dark mode changes.
 *
 * @since 5.0.0
 * @source panel/src/panel/theme.ts
 */
export interface PanelTheme
  extends
    Omit<PanelState<PanelThemeDefaults>, "reset" | "set">,
    PanelThemeDefaults {
  /**
   * Default theme from the `panel.theme` option; `"system"` unless configured.
   * @since 5.1.0
   */
  readonly config: string;

  /**
   * Resolved current theme.
   *
   * Usually `"light"` or `"dark"`, but may be any custom theme key when
   * `setting` is a non-system custom value.
   */
  readonly current: string;

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
// #endregion

// #region Language (Content Language)

/**
 * Default state for content language.
 * @source panel/src/panel/language.ts
 */
export interface PanelLanguageDefaults {
  /** Language code (e.g., `"en"`, `"de"`). */
  code: string | null;
  default: boolean;
  /** Text direction. */
  direction: "ltr" | "rtl";
  /** Whether the language uses a custom domain. */
  hasCustomDomain: boolean;
  name: string | null;
  /** Slug conversion rules. */
  rules: Record<string, string>;
}

/**
 * Content language state.
 *
 * Represents the current content language for multilingual sites.
 *
 * @since 4.0.0
 * @source panel/src/panel/language.ts
 */
export interface PanelLanguage extends PanelState<PanelLanguageDefaults> {
  /** Language code (e.g., `"en"`, `"de"`); `null` on single-language sites. */
  code: string | null;
  default: boolean;
  /** Text direction. */
  direction: "ltr" | "rtl";
  /** Whether the language uses a custom domain. */
  hasCustomDomain: boolean;
  /** Language name; `null` on single-language sites. */
  name: string | null;
  /** Slug conversion rules. */
  rules: Record<string, string>;

  /** Alias for `default` property. */
  readonly isDefault: boolean;
}
// #endregion

// #region Menu

/**
 * Menu entry types.
 *
 * All fields are optional; the backend filters out any falsy values before
 * emitting the entry, so consumers may receive a sparse object.
 *
 * @source panel/src/panel/menu.ts
 * @source src/Panel/Menu.php
 */
export interface PanelMenuEntry {
  /** Whether this entry is currently active. */
  current?: boolean;
  /**
   * Dialog URL or options – when set, the entry opens a dialog instead of
   * navigating. Options objects since 5.2.0, URL strings only before.
   */
  dialog?: string | Record<string, any>;
  /** Whether the entry is rendered as visually disabled. */
  disabled?: boolean;
  /**
   * Drawer URL or options – when set, the entry opens a drawer instead of
   * navigating. Options objects since 5.2.0, URL strings only before.
   */
  drawer?: string | Record<string, any>;
  icon?: string;
  link?: string;
  /** Anchor target attribute (e.g. `"_blank"`). */
  target?: string;
  text?: string;
  /** Tooltip text. */
  title?: string;
}

/**
 * Default state for the sidebar menu.
 * @source panel/src/panel/menu.ts
 */
export interface PanelMenuDefaults {
  /** Menu entries (items or separator strings). */
  entries: (PanelMenuEntry | "-")[];
  /** Whether menu is being hovered. */
  hover: boolean;
  /** Whether menu is expanded. */
  isOpen: boolean;
}

/**
 * Sidebar menu state.
 *
 * Manages the Panel sidebar with responsive behavior
 * for mobile and desktop layouts.
 *
 * @since 4.0.0
 * @source panel/src/panel/menu.ts
 */
export interface PanelMenu
  extends Omit<PanelState<PanelMenuDefaults>, "set">, PanelMenuDefaults {
  /**
   * Handles outside clicks to close mobile menu.
   * Returns `false` if not mobile/open, `void` otherwise.
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
   * Returns `false` if not mobile/open, `void` otherwise.
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

  /** Sets menu entries and handles initial resize. */
  set: (entries: (PanelMenuEntry | "-")[]) => PanelMenuDefaults;

  /** Toggles the sidebar menu state. */
  toggle: () => void;
}
// #endregion

// #region Notification

/**
 * Default state for notifications.
 * @source panel/src/panel/notification.ts
 */
export interface PanelNotificationDefaults {
  /** Context where notification appears. */
  context: PanelContext | null;
  /** Additional details (for error dialogs); defaults to an empty object. */
  details: Record<string, any>;
  icon: string | null;
  /** Whether notification is visible. */
  isOpen: boolean;
  message: string | null;
  /** Visual theme. */
  theme: NotificationTheme | null;
  /** Auto-close timeout in ms; `0` disables auto-close. Default `0`. */
  timeout: number;
  /** Error severity; `null` for success and info notifications. */
  type: "error" | "fatal" | null;
}

/**
 * Options for opening a notification.
 * @source panel/src/panel/notification.ts
 */
export interface PanelNotificationOptions {
  /** Context where notification appears. */
  context?: PanelContext;
  details?: Record<string, any>;
  icon?: string;
  message?: string;
  /** Visual theme. */
  theme?: NotificationTheme;
  /**
   * Auto-close delay in ms. For non-error notifications a missing value
   * falls back to `4000` ms since 4.3.0, and any falsy one (including `0`)
   * since 5.5.0, so auto-close cannot be disabled for them from then on.
   * `error` and `fatal` notifications keep the passed value and otherwise
   * never auto-close.
   */
  timeout?: number;
  type?: NotificationType;
}

/**
 * Plain error object that `error()` and `fatal()` accept. `fatal()` shows its
 * `message`. Before 5.5.0, `error()` showed its `message` too; since 5.5.0 it
 * reads `Something went wrong` instead.
 * @source panel/src/panel/notification.ts
 */
export interface PanelErrorObject {
  message: string;
  /** Details the error dialog lists in view context, read by `error()` before 5.5.0. */
  details?: Record<string, any>;
  /** @deprecated The notification never reads this field. */
  key?: string;
}

/**
 * Notification state for user feedback.
 *
 * Displays contextual notifications in view, dialog, or drawer.
 * Supports auto-close timers and different severity levels.
 *
 * @since 4.0.0
 * @source panel/src/panel/notification.ts
 */
export interface PanelNotification
  extends PanelState<PanelNotificationDefaults>, PanelNotificationDefaults {
  /** Timer for auto-close functionality. */
  timer: PanelTimer;

  /** Whether this is a fatal error notification. */
  readonly isFatal: boolean;

  /** Closes the notification and resets state. */
  close: () => PanelNotificationDefaults;

  /**
   * Logs a deprecation warning to console.
   *
   * @param message - Deprecation message
   */
  deprecated: (message: string) => void;

  /**
   * Shows the error notification bar; in view context also opens an error
   * dialog. A response that cannot be parsed becomes a fatal notification,
   * and an authentication error sends a logged-in user to the logout. The
   * redirect throws since 5.5.0 and returned `false` before.
   *
   * @param error - Error instance, message string, or plain
   *   `{ message, details }` object; since 5.5.0 a plain object shows
   *   `Something went wrong` instead.
   * @returns Notification state, or `false` from a logout redirect before 5.5.0
   */
  error: (
    error: Error | string | PanelErrorObject,
  ) => PanelNotificationDefaults | false;

  /**
   * Creates a fatal error notification, displayed in an isolated iframe.
   * A response that cannot be parsed shows its raw text. A plain object
   * contributes its `message`; without one the notification reads
   * `Something went wrong`.
   *
   * @param error - Error object, string, or plain `{ message }` object
   */
  fatal: (
    error: Error | string | PanelErrorObject,
  ) => PanelNotificationDefaults;

  /**
   * Creates an info notification.
   *
   * @param info - Message string or options object
   * @since 4.3.0
   */
  info: (info?: string | PanelNotificationOptions) => PanelNotificationDefaults;

  /**
   * Opens a notification. When passed a string, delegates to `success()`. Otherwise sets the Panel context, since 4.3.0 replaces a `null` or `undefined` `timeout` (any falsy one since 5.5.0) with `4000` ms for types other than `error` and `fatal`, opens the notification, and starts the auto-close timer.
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
// #endregion

// #region System

/**
 * Default state for system information.
 * @source panel/src/panel/system.ts
 */
export interface PanelSystemDefaults {
  /** ASCII character replacements for slugs. */
  ascii: Record<string, string>;
  /** CSRF token for API requests. */
  csrf: string;
  /** Whether running on localhost. */
  isLocal: boolean;
  /** Locale of each interface translation, keyed by translation code (e.g. `{ de: "de_DE" }`). */
  locales: Record<string, string>;
  /** Slug character replacements of the current language. */
  slugs: Record<string, string>;
  /** Site title. */
  title: string;
}

/**
 * System state with server configuration.
 *
 * Contains static system information from the server.
 *
 * @since 4.0.0
 * @source panel/src/panel/system.ts
 */
export interface PanelSystem
  extends PanelState<PanelSystemDefaults>, PanelSystemDefaults {}
// #endregion

// #region Translation (Interface Language)

/**
 * Default state for interface translation.
 * @source panel/src/panel/translation.ts
 */
export interface PanelTranslationDefaults {
  /** Translation code (e.g., `"en"`, `"de"`). */
  code: string;
  /** Translation strings by key. */
  data: Record<string, string>;
  /** Text direction. */
  direction: "ltr" | "rtl";
  name: string;
  /** First day of week (`0`=Sunday, `1`=Monday). */
  weekday: number;
}

/**
 * Interface translation state.
 *
 * Manages UI translations for the current user.
 * Updates document language and direction on change.
 *
 * @since 4.0.0
 * @source panel/src/panel/translation.ts
 */
export interface PanelTranslation
  extends
    Omit<PanelState<PanelTranslationDefaults>, "set">,
    PanelTranslationDefaults {
  /** Sets translation state and updates document language/direction. */
  set: (state: Partial<PanelTranslationDefaults>) => PanelTranslationDefaults;

  /**
   * Fetches a translation string with optional placeholder replacement.
   * Non-string keys return `undefined` (runtime guard).
   *
   * @param key - Translation key (non-strings return `undefined`)
   * @param data - Placeholder values
   * @param fallback - Fallback if key not found
   * @returns Translated string or `undefined`
   */
  translate: (
    key: unknown,
    data?: Record<string, any>,
    fallback?: string | null,
  ) => string | undefined;
}
// #endregion

// #region User

/**
 * Default state for the current user.
 * @source panel/src/panel/user.ts
 */
export interface PanelUserDefaults {
  email: string | null;
  id: string | null;
  /** User's interface language. */
  language: string | null;
  role: string | null;
  username: string | null;
}

/**
 * Current user state.
 *
 * Contains information about the logged-in user.
 *
 * @since 4.0.0
 * @source panel/src/panel/user.ts
 */
export interface PanelUser
  extends PanelState<PanelUserDefaults>, PanelUserDefaults {}
// #endregion

// #region View

/**
 * Breadcrumb item for view navigation.
 * @source panel/src/panel/view.ts
 */
export interface PanelBreadcrumbItem {
  label: string;
  /**
   * Panel path the crumb links to. Absent for a crumb without a target,
   * which renders disabled.
   */
  link?: string;
  /**
   * Tooltip text, e.g. why a page's crumb is redacted. Falls back to `label`.
   * @since 5.6.0
   */
  title?: string;
  /** Icon for plugin-supplied breadcrumbs; core views never set it. */
  icon?: string;
}

/**
 * Default state for the view feature.
 * @source panel/src/panel/view.ts
 * @source panel/src/panel/feature.ts
 * @source src/Panel/View.php
 */
export interface PanelViewDefaults extends PanelFeatureDefaults {
  /** Breadcrumb navigation items. */
  breadcrumb: PanelBreadcrumbItem[];
  /** Label of the area crumb shown before `breadcrumb`. */
  breadcrumbLabel: string | null;
  icon: string | null;
  id: string | null;
  link: string | null;
  /** Relative path to this view. */
  path: string;
  /** Default search type. */
  search: string;
  title: string | null;
}

/**
 * View feature for main Panel content.
 *
 * Manages the primary view state, document title,
 * and browser history.
 *
 * @since 4.0.0
 * @source panel/src/panel/view.ts
 * @source panel/src/panel/feature.ts
 */
export interface PanelView
  extends
    Omit<PanelFeature<PanelViewDefaults>, "set" | keyof PanelViewDefaults>,
    PanelViewDefaults {
  /** Loads a view, canceling any previous request. */
  load: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelViewDefaults>;

  /**
   * Sets view state and updates document title and browser URL.
   * Returns the merged state since 5.5.0, `void` before.
   */
  set: (state: Partial<PanelViewDefaults>) => PanelViewDefaults | void;

  /**
   * Submits the view form.
   * @throws Error - Not yet implemented
   */
  submit: () => Promise<never>;
}
// #endregion

// #region Dropdown

/**
 * Dropdown option item.
 * @source panel/src/panel/dropdown.ts
 * @source panel/src/components/Dropdowns/DropdownContent.vue
 */
export interface PanelDropdownOption {
  text: string;
  icon?: string;
  /**
   * Click handler: a callback, an action name emitted to the parent
   * component as `action`, or, since 4.3.0, an object that emits `name` on
   * the parent and `global` on the global event bus, each with `payload`.
   */
  click?:
    (() => void) | string | { name?: string; payload?: any; global?: string };
  disabled?: boolean;
  [key: string]: any;
}

/**
 * Dropdown feature for context menus.
 *
 * Manages dropdown menus loaded from the server
 * or created programmatically.
 *
 * @since 4.0.0
 * @source panel/src/panel/dropdown.ts
 * @source panel/src/panel/feature.ts
 */
export interface PanelDropdown extends PanelFeature<PanelFeatureDefaults> {
  /** Closes the dropdown and resets state. */
  close: () => void;

  /**
   * Opens a dropdown by path, `URL`, or state object.
   * A string path loads from `/dropdowns/`; a `URL` object loads as-is.
   */
  open: (
    dropdown: string | URL | Partial<PanelFeatureDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelFeatureDefaults>;

  /**
   * Opens a dropdown asynchronously and returns a closure that invokes
   * `ready(items)` with the resolved option list. The closure rejects when
   * the dropdown has no options.
   *
   * @deprecated Since 4.0.0; use `open()` and read `options()` instead.
   */
  openAsync: (
    dropdown: string | URL | Partial<PanelFeatureDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => (ready: (items: (PanelDropdownOption | "-")[]) => void) => Promise<void>;

  /**
   * Returns the options from props, or an empty array if they are missing.
   * A `"-"` entry renders a separator.
   */
  options: () => (PanelDropdownOption | "-")[];

  /**
   * Sets the dropdown state. A top-level `options` array, the shape dropdown
   * routes respond with, replaces `props` as `props.options`.
   */
  set: (state: Partial<PanelFeatureDefaults>) => PanelFeatureDefaults;
}
// #endregion

// #region Dialog

/**
 * Default state for the dialog modal.
 * @source panel/src/panel/dialog.js
 * @source panel/src/panel/modal.js
 */
export interface PanelDialogDefaults extends PanelFeatureDefaults {
  /**
   * ID that tells nested dialogs apart, generated when the state brings none.
   *
   * @since 5.1.0
   */
  id: string | null;
  /**
   * Whether using legacy Vue component.
   */
  legacy: boolean;
  /**
   * Reference to legacy component.
   */
  ref: any;
}

/**
 * Dialog modal for overlays.
 *
 * Supports both server-loaded dialogs and legacy Vue component dialogs.
 *
 * @since 4.0.0
 * @source panel/src/panel/dialog.js
 * @source panel/src/panel/modal.js
 */
export interface PanelDialog extends PanelModal<PanelDialogDefaults> {
  /**
   * Whether the dialog is a component instance from a template, opened via
   * the deprecated `openComponent()`, that renders itself.
   */
  legacy: boolean;
  /** The component instance `openComponent()` opened. */
  ref: any;

  /**
   * Closes the current dialog and hides a legacy component referenced via
   * `ref`. Ignores a modal ID and resolves to `undefined`.
   */
  close: () => Promise<void>;

  /**
   * Opens a dialog by path, `URL`, state object, or legacy Vue component
   * instance. A string path loads from `/dialogs/`; an object with
   * `component` and `props` opens inline. Since 5.2.0, an object with `url`
   * loads that path and passes its other keys as options. Since 5.1.0,
   * `replace: true` on a state object swaps the current dialog in the history
   * instead of stacking on top of it.
   */
  open: (
    dialog:
      | string
      | URL
      | (Partial<PanelDialogDefaults> & { url?: string; replace?: boolean }),
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDialogDefaults>;

  /**
   * Opens a legacy Vue component dialog.
   *
   * @param dialog - Vue component instance
   * @deprecated Use `open()` with a component object instead.
   */
  openComponent: (dialog: any) => Promise<PanelDialogDefaults>;
}
// #endregion

// #region Drawer

/**
 * Default state for the drawer modal.
 * @source panel/src/panel/drawer.js
 * @source panel/src/panel/modal.js
 */
export interface PanelDrawerDefaults extends PanelFeatureDefaults {
  /** ID that tells nested drawers apart, generated when the state brings none. */
  id: string | null;
}

/**
 * Drawer modal for side panels.
 *
 * Supports nested drawers with breadcrumb navigation.
 *
 * @since 4.0.0
 * @source panel/src/panel/drawer.js
 * @source panel/src/panel/modal.js
 */
export interface PanelDrawer extends PanelModal<PanelDrawerDefaults> {
  /** Drawer states stacked in the history, oldest first. */
  readonly breadcrumb: (PanelDrawerDefaults & { id: string })[];

  /** Drawer icon, defaults to `"box"`. */
  readonly icon: string;

  /**
   * Opens a drawer by path, `URL`, or state object, switches to `tab` of a
   * state object, the first tab otherwise, and focuses the drawer. A string path loads from
   * `/drawers/`. Since 5.2.0, an object with `url` loads that path and passes
   * its other keys as options. `replace: true` on a state object swaps the
   * current drawer in the history instead of stacking on top of it.
   */
  open: (
    drawer:
      | string
      | URL
      | (Partial<PanelDrawerDefaults> & {
          url?: string;
          replace?: boolean;
          tab?: string;
        }),
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDrawerDefaults>;

  /**
   * Switches drawer tabs.
   * If `tab` is omitted, falls back to the first key of `props.tabs`.
   *
   * @param tab - Tab name to switch to
   */
  tab: (tab?: string) => void;

  /** Returns the modal listeners extended with drawer-specific `crumb` (history navigation) and `tab` handlers. */
  listeners: () => PanelModalListeners;
}
// #endregion

// #region Content

/**
 * Content version representing saved or changed state.
 * @source panel/src/panel/content.js
 */
export interface PanelContentVersion {
  [field: string]: any;
}

/**
 * Content versions container.
 * @source panel/src/panel/content.js
 */
export interface PanelContentVersions {
  /** Original saved content. */
  latest: PanelContentVersion;
  /** Current unsaved changes. */
  changes: PanelContentVersion;
}

/**
 * Lock state for content editing.
 *
 * Always emitted as `{ isLegacy, isLocked, modified, user }`. After a
 * successful save, `modified` is replaced in place with a fresh `Date`.
 *
 * @source panel/src/panel/content.js
 * @source src/Content/Lock.php
 */
export interface PanelContentLock {
  /** Whether using the legacy `.lock` file system. */
  isLegacy: boolean;
  /** Whether content is locked by another user. */
  isLocked: boolean;
  /**
   * Lock modification timestamp. Initially an ISO 8601 string from the
   * server; after a successful save the Panel replaces it with a `Date`.
   */
  modified: string | Date | null;
  /** User who holds the lock; both fields are nullable when no user is set. */
  user: { id: string | null; email: string | null };
}

/**
 * Environment context for content operations.
 * @source panel/src/panel/content.js
 * @source src/Panel/View.php
 */
export interface PanelContentEnv {
  /** API endpoint path. */
  api?: string;
  /** Content language code; `null` on single-language sites. */
  language?: string | null;
}

/**
 * Content feature for form state management.
 *
 * Manages content versions, saving, publishing, and lock handling.
 * Provides automatic save on input with throttling.
 *
 * @since 5.0.0
 * @source panel/src/panel/content.js
 */
export interface PanelContent {
  /** Reference to lock dialog if open. */
  dialog: PanelDialog | null;

  /** Whether content is being saved/published/discarded. */
  isProcessing: boolean;

  /**
   * Saves throttled at `1000` ms: the first call saves at once, further
   * calls within the delay collapse into one trailing save.
   */
  saveLazy: ((values?: Record<string, any>, env?: PanelContentEnv) => void) & {
    cancel: () => void;
  };

  /** Cancels any ongoing or scheduled save requests. */
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
   * Returns whether there are any unsaved changes.
   *
   * @param env - Environment context
   */
  hasDiff: (env?: PanelContentEnv) => boolean;

  /**
   * Returns whether the given env's `api` and `language` both match the current view.
   *
   * @param env - Environment context
   */
  isCurrent: (env?: PanelContentEnv) => boolean;

  /**
   * Returns whether the current view is locked.
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
   * @param method - API method: `save`, `publish`, or `discard`
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
   * Resolves to a boolean since 5.6.0, `void` before.
   *
   * @param values - Values to save
   * @param env - Environment context
   * @returns `true` if saved, `false` if locked or replaced by a newer save
   */
  save: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<boolean | void>;

  /**
   * Releases the content lock without discarding changes.
   *
   * Since 5.6.0, first saves any pending changes of the current view and
   * resolves to `false` without unlocking when the view got locked or a
   * newer save took over (other save errors reject); otherwise
   * posts to `<api>/changes/unlock` (failures are ignored, the lock expires
   * on its own) and resolves to `true`. Before 5.6.0, sent the request via
   * `navigator.sendBeacon` and returned nothing.
   *
   * @param env - Environment context
   * @returns `false` if the view got locked or a newer save took over, otherwise `true`
   * @since 5.5.0
   */
  unlock: (env?: PanelContentEnv) => Promise<boolean> | void;

  /**
   * Sends the unlock request via `navigator.sendBeacon`, which browsers
   * deliver even while the page unloads, and falls back to a regular POST
   * when the beacon cannot be queued. Cancels pending saves first.
   *
   * @param env - Environment context
   * @since 5.6.0
   */
  unlockBeaconRequest: (env?: PanelContentEnv) => void;

  /**
   * Sends the unlock request as a silent POST to `<api>/changes/unlock`.
   * Cancels pending saves first.
   *
   * @param env - Environment context
   * @since 5.6.0
   */
  unlockPostRequest: (env?: PanelContentEnv) => Promise<any>;

  /**
   * Updates form values and saves.
   * Resolves to a boolean since 5.6.0, `void` before.
   *
   * @param values - Values to update
   * @param env - Environment context
   * @returns `true` if saved, `false` if locked or replaced by a newer save
   */
  update: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<boolean | void>;

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

  /** Returns all content versions. */
  versions: () => PanelContentVersions;
}
// #endregion

// #region Searcher

/**
 * Search pagination info.
 * @source panel/src/panel/search.ts
 * @source src/Panel/Controller/Search.php
 * @source src/Toolkit/Pagination.php
 */
export interface PanelSearchPagination {
  page?: number;
  firstPage?: number;
  lastPage?: number;
  pages?: number;
  offset?: number;
  limit?: number;
  total?: number;
  start?: number;
  end?: number;
}

/**
 * Search query options.
 * @source panel/src/panel/search.ts
 */
export interface PanelSearchOptions {
  page?: number;
  /** Results per page. */
  limit?: number;
}

/**
 * Search result from API.
 * @source panel/src/panel/search.ts
 * @source src/Panel/Controller/Search.php
 */
export interface PanelSearchResult {
  /**
   * Result items. Since 4.4.0, `null` for a query shorter than two
   * characters and empty when the request fails.
   */
  results: any[] | null;
  pagination: PanelSearchPagination;
}

/**
 * Searcher feature for Panel search.
 *
 * Manages search dialog and query requests.
 *
 * @since 4.4.0
 * @source panel/src/panel/search.ts
 */
export interface PanelSearcher {
  /** AbortController for current request. */
  controller: AbortController | undefined;

  /** Number of active requests. */
  requests: number;

  /** Whether any search is loading. */
  readonly isLoading: boolean;

  /**
   * Opens the search dialog.
   *
   * @param type - Search type (e.g., `"pages"`, `"files"`, `"users"`)
   */
  open: (type: string) => void;

  /**
   * Queries the search API. For queries shorter than 2 characters returns `{ results: null, pagination: {} }` without hitting the server. Resolves to `undefined` when the request was aborted by a subsequent search, and to `{ results: [], pagination: {} }` when it fails for any other reason.
   *
   * @param type - Search type
   * @param query - Search query
   * @param options - Pagination options
   */
  query: (
    type: string,
    query: string,
    options?: PanelSearchOptions,
  ) => Promise<PanelSearchResult | undefined>;
}
// #endregion

// #region Upload

/**
 * Server-side file model passed to `PanelUpload.replace()` and stored in
 * `PanelUploadDefaults.replacing`. Distinct from `PanelUploadFile` (the
 * client-side queued upload). Carries the fields read by `replace()` to
 * configure the upload picker (`url`, `accept`).
 *
 * @source panel/src/panel/upload.js
 */
export interface PanelUploadReplaceFile {
  /** API path segment used to build the upload URL. */
  link: string;
  /** File extension without dot, used for the picker `accept` filter. */
  extension: string;
  /** MIME type, used for the picker `accept` filter. `null` when undetectable. */
  mime: string | null;
  /** Filename with extension, shown in the replace dialog. */
  filename: string;
  /** Public URL of the current file, previewed in the replace dialog. */
  url: string;
  /** Additional server-side fields. */
  [key: string]: any;
}

/**
 * Upload file state representing a file in the upload queue.
 *
 * @source panel/src/panel/upload.js
 */
export interface PanelUploadFile {
  /** Unique file ID. */
  id: string;
  /** Original File object. */
  src: File;
  /** File name without extension. */
  name: string;
  /** File extension without dot. */
  extension: string;
  /** Original filename with extension. */
  filename: string;
  /** File size in bytes. */
  size: number;
  /** Formatted file size (e.g., `"1.2 MB"`). */
  niceSize: string;
  /** MIME type. */
  type: string;
  /** Blob URL for preview. */
  url: string;
  /** Upload progress (`0`-`100`). */
  progress: number;
  completed: boolean;
  /** Error message if failed. */
  error: string | null;
  /** Response model after successful upload. */
  model: any | null;
  /**
   * Preview settings spread in from `preview`, such as `icon` or `color`.
   * @since 4.4.0
   */
  [key: string]: any;
}

/**
 * Default state for upload feature.
 * @source panel/src/panel/upload.js
 */
export interface PanelUploadDefaults {
  /**
   * AbortController for current upload.
   * @since 5.0.0
   */
  abort: AbortController | null;
  /** Accepted file types. */
  accept: string;
  /** Additional file attributes. */
  attributes: Record<string, any>;
  files: PanelUploadFile[];
  /** Maximum number of files. */
  max: number | null;
  /** Whether multiple files allowed. */
  multiple: boolean;
  /**
   * Preview settings (`back`, `color`, `cover`, `icon`) spread into every
   * queued file.
   * @since 4.4.0
   */
  preview: Record<string, any>;
  /** Server file model being replaced (carries `link`, `extension`, `mime`). */
  replacing: PanelUploadReplaceFile | null;
  /** Upload endpoint URL. */
  url: string | null;
}

type PanelUploadOptions = Partial<PanelUploadDefaults> & {
  /** Event listeners, replacing the previous ones on every `set()` call. */
  on?: PanelEventListenerMap;
};

/**
 * Upload feature for file handling.
 *
 * Manages file selection, upload progress, and completion.
 * Supports chunked uploads for large files.
 *
 * @since 4.0.0
 * @source panel/src/panel/upload.js
 */
export interface PanelUpload
  extends
    Omit<PanelState<PanelUploadDefaults>, "set">,
    PanelEventListeners,
    PanelUploadDefaults {
  /** Hidden file input element. */
  input: HTMLInputElement | null;

  /** Server file models for files that completed uploading. */
  readonly completed: any[];

  /**
   * Shows a success notification and emits `model.update`.
   * @since 5.0.0
   */
  announce: () => void;

  /** Emits `cancel`, aborts any ongoing upload, and if some files already finished emits `complete` and announces success before resetting state. */
  cancel: () => Promise<void>;

  /** Closes the upload dialog after all remaining files have uploaded; if any files completed, emits `complete` and `done`, announces success, and resets state. */
  done: () => Promise<void>;

  /**
   * Finds the index of an existing file in the queue with the same `src.name`, `src.type`, `src.size`, and `src.lastModified`. Returns the matching index, or `-1` if no duplicate is found.
   *
   * @param file - Enriched upload file to check
   * @returns Index of the duplicate file, or `-1` if none
   */
  findDuplicate: (file: PanelUploadFile) => number;

  /**
   * Checks if file has a unique name.
   * Compares `file.name` and `file.extension` against the upload queue.
   *
   * @param file - Enriched upload file to check
   */
  hasUniqueName: (file: PanelUploadFile) => boolean;

  /**
   * Converts File to enriched upload file object.
   *
   * @param file - File to convert
   */
  file: (file: File) => PanelUploadFile;

  /**
   * Opens file upload dialog.
   * If `files` is a `FileList`, applies `options` and selects the files.
   * Otherwise treats the first argument as options shorthand.
   *
   * @param files - Initial files (or options shorthand)
   * @param options - Upload options
   */
  open: (
    files?: FileList | PanelUploadOptions,
    options?: PanelUploadOptions,
  ) => void;

  /**
   * Opens system file picker.
   * When `options.immediate` is `true`, bypasses the upload dialog and
   * submits selected files straight away.
   *
   * @param options - Upload options (with optional `immediate` flag)
   */
  pick: (options?: PanelUploadOptions & { immediate?: boolean }) => void;

  /**
   * Removes a file from the list.
   *
   * @param id - File ID to remove
   */
  remove: (id: string) => void;

  /**
   * Opens picker to replace an existing file.
   * The `file` argument is a server file model (reads `file.link`,
   * `file.extension`, `file.mime`), not a queued `PanelUploadFile`.
   *
   * @param file - Server file model being replaced
   * @param options - Upload options
   */
  replace: (file: PanelUploadReplaceFile, options?: PanelUploadOptions) => void;

  /**
   * Adds files to upload list with deduplication.
   * Also accepts an `Event` whose `target.files` is unwrapped to a `FileList`.
   * Throws if the resolved value is not a `FileList`.
   *
   * @param files - Files to add (or input change Event, or `null`)
   * @param options - Upload options
   */
  select: (
    files: FileList | Event | null,
    options?: PanelUploadOptions,
  ) => void;

  /**
   * Sets state and registers event listeners.
   * Returns `undefined` when called without a `state` argument (early-return path).
   */
  set: (state?: PanelUploadOptions) => PanelUploadDefaults | undefined;

  /** Submits and uploads all remaining files. */
  submit: () => Promise<void>;

  /**
   * Uploads a single file with chunking support.
   * Since 5.0.0, fails the file when called before `submit()` has set
   * `abort`: its `error` is set and `file.upload.error` fires.
   *
   * @param file - File to upload
   * @param attributes - Additional attributes
   */
  upload: (
    file: PanelUploadFile,
    attributes?: Record<string, any>,
  ) => Promise<void>;
}
// #endregion

// #region Events

/**
 * Event emitter interface (mitt-compatible).
 * @source panel/src/panel/events.ts
 */
export interface PanelEventEmitter {
  /** Emits an event with a single payload; further arguments are dropped. */
  emit: (event: string, payload?: any) => void;
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler?: (...args: any[]) => void) => void;
}

/**
 * Events feature for global event handling.
 *
 * Provides global event subscriptions and keyboard shortcut handling.
 * Uses mitt for the internal event bus.
 *
 * @since 4.0.0
 * @source panel/src/panel/events.ts
 */
export interface PanelEvents extends PanelEventEmitter {
  /** Element that was entered during drag. */
  entered: EventTarget | null;

  // #region Global event handlers

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
   * Creates keychain modifier string (e.g., `"keydown.cmd.shift.s"`).
   *
   * @param type - Event type
   * @param event - KeyboardEvent
   * @returns Keychain string
   */
  keychain: (type: "keydown" | "keyup", event: KeyboardEvent) => string;

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
  // #endregion

  /** Subscribes all global event listeners. */
  subscribe: () => void;

  /** Unsubscribes all global event listeners. */
  unsubscribe: () => void;
}
// #endregion
