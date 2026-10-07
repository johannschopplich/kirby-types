/**
 * Feature type definitions for Kirby Panel.
 *
 * This module provides typed interfaces for all Panel features,
 * including state objects, features, and modals.
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
 * @source panel/src/helpers/timer.ts
 */
export interface PanelTimer {
  /**
   * Whether the timer is currently running.
   * @since 5.5.0
   */
  readonly isRunning: boolean;

  /**
   * Starts the timer with a callback.
   * Stops any previous timer first. Does nothing if `timeout <= 0`.
   *
   * @param timeout - Interval in milliseconds
   * @param callback - Function to call every `timeout` ms
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
 * @source panel/src/panel/drag.ts
 */
export interface PanelDrag
  extends PanelState<PanelDragDefaults>, PanelDragDefaults {
  /** Whether a drag operation is in progress. */
  readonly isDragging: boolean;

  /**
   * Starts a drag operation with type and data.
   *
   * @param type - Drag item type (e.g., `"text"`, `"data"`)
   * @param data - Payload, the drag text for `"text"`
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
 * Theme preference accepted by `set()`.
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
 * @source src/Panel/View.php
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
   * Usually `"light"` or `"dark"`, but may be any custom theme key that
   * `setting`, or without it `config`, holds.
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
 * @source src/Panel/View.php
 * @source src/Cms/Language.php
 */
export interface PanelLanguageDefaults {
  /** Language code (e.g., `"en"`, `"de"`); `null` on single-language sites. */
  code: string | null;
  default: boolean;
  /** Text direction. */
  direction: "ltr" | "rtl";
  /**
   * Whether the language uses a custom domain.
   * @since 5.2.3
   */
  hasCustomDomain: boolean;
  /** Language name; `null` on single-language sites. */
  name: string | null;
  /** Slug conversion rules; empty on single-language sites. */
  rules: Record<string, string>;
}

/**
 * Content language state.
 *
 * Represents the current content language for multilingual sites.
 *
 * @source panel/src/panel/language.ts
 * @source src/Panel/View.php
 * @source src/Cms/Language.php
 */
export interface PanelLanguage
  extends PanelState<PanelLanguageDefaults>, PanelLanguageDefaults {
  /** Alias for `default` property. */
  readonly isDefault: boolean;
}
// #endregion

// #region Menu

/**
 * Sidebar menu entry, bound as props onto a `k-button`.
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
   * navigating.
   */
  dialog?: string | Record<string, any>;
  /** Whether the entry is rendered as visually disabled. */
  disabled?: boolean;
  /**
   * Drawer URL or options – when set, the entry opens a drawer instead of
   * navigating.
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
 * @source src/Panel/View.php
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
 * @source panel/src/panel/menu.ts
 */
export interface PanelMenu
  extends Omit<PanelState<PanelMenuDefaults>, "set">, PanelMenuDefaults {
  /**
   * Closes the mobile menu on a click outside of it.
   * @internal
   */
  blur: (event: Event) => void;

  /**
   * Collapses the sidebar menu.
   * Persists state to localStorage on desktop.
   */
  close: () => void;

  /**
   * Closes the mobile menu on the escape key.
   * @internal
   */
  escape: () => void;

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
   * Sets the menu entries and restores the open or closed state.
   */
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
  /** Details passed to `open()`, unread by the Panel; an empty object by default. */
  details: Record<string, any>;
  icon: string | null;
  /**
   * Whether the notification is open. In view context an error shows as a
   * dialog instead of the notification bar.
   */
  isOpen: boolean;
  message: string | null;
  theme: NotificationTheme | null;
  /** Auto-close timeout in ms; `0`, the default, disables auto-close. */
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
  context?: PanelContext | null;
  details?: Record<string, any>;
  icon?: string | null;
  message?: string | null;
  theme?: NotificationTheme | null;
  /**
   * Auto-close delay in ms. For non-error notifications a missing or falsy
   * value (including `0`) falls back to `4000` ms; a negative one disables
   * auto-close. `error` and `fatal` notifications keep the passed value and
   * otherwise never auto-close.
   */
  timeout?: number;
  type?: NotificationType | null;
}

/**
 * Plain error object that `error()` and `fatal()` accept. `fatal()` shows its
 * `message`, or `Something went wrong` without one; `error()` always reads
 * `Something went wrong`.
 * @source panel/src/panel/notification.ts
 */
export interface PanelErrorObject {
  message?: string;
}

/**
 * Notification state for user feedback.
 *
 * Displays contextual notifications in view, dialog, or drawer.
 * Supports auto-close timers and different severity levels.
 *
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

  /** Logs the message to the console, prefixed with `Deprecated: `. */
  deprecated: (message: string) => void;

  /**
   * Opens an error notification: in view context as an error dialog, in
   * dialog and drawer context as the notification bar. A response that
   * cannot be parsed becomes a fatal notification, and an authentication
   * error sends a logged-in user to the logout, which throws a redirect
   * error.
   *
   * @param error - Error instance, message string, or plain object
   */
  error: (
    error: Error | string | PanelErrorObject,
  ) => PanelNotificationDefaults;

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
   */
  info: (info?: string | PanelNotificationOptions) => PanelNotificationDefaults;

  /**
   * Opens a notification. When passed a string, delegates to `success()`.
   * Otherwise fills in the Panel's current context unless the options pass
   * one, replaces a falsy `timeout` with `4000` ms for types other than
   * `error` and `fatal`, opens the notification, and starts the auto-close
   * timer.
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
 * @source src/Panel/View.php
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
  /** Site title, or `"Kirby Panel"` when the site has none. */
  title: string;
}

/**
 * System state with server configuration.
 *
 * Contains static system information from the server.
 *
 * @source panel/src/panel/system.ts
 * @source src/Panel/View.php
 */
export interface PanelSystem
  extends PanelState<PanelSystemDefaults>, PanelSystemDefaults {}
// #endregion

// #region Translation (Interface Language)

/**
 * Default state for interface translation.
 * @source panel/src/panel/translation.ts
 * @source src/Panel/View.php
 */
export interface PanelTranslationDefaults {
  /** Translation code (e.g., `"en"`, `"de"`). */
  code: string;
  /** Translation strings by key. */
  data: Record<string, string>;
  /** Text direction. */
  direction: "ltr" | "rtl";
  name: string;
  /**
   * First day of the week, `0` (Sunday) to `6` (Saturday), from the
   * `date.weekday` option or the translation's locale.
   * @since 5.0.0
   */
  weekday: number;
}

/**
 * Interface translation state.
 *
 * Manages UI translations for the current user.
 * Updates document language and direction on change.
 *
 * @source panel/src/panel/translation.ts
 * @source src/Panel/View.php
 */
export interface PanelTranslation
  extends
    Omit<PanelState<PanelTranslationDefaults>, "set">,
    PanelTranslationDefaults {
  /** Sets translation state and updates document language/direction. */
  set: (state: Partial<PanelTranslationDefaults>) => PanelTranslationDefaults;

  /**
   * Fetches a translation string with optional placeholder replacement.
   *
   * @param key - Translation key (non-strings return `undefined`)
   * @param data - Placeholder values
   * @param fallback - Fallback if key not found
   * @returns Translated string, or the fallback for a missing key (`undefined`
   *   without one)
   */
  translate: (
    key: unknown,
    data?: Record<string, any>,
    fallback?: string | null,
  ) => string | null | undefined;
}
// #endregion

// #region User

/**
 * Default state for the current user.
 * @source panel/src/panel/user.ts
 * @source src/Panel/View.php
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
 * @source panel/src/panel/user.ts
 * @source src/Panel/View.php
 */
export interface PanelUser
  extends PanelState<PanelUserDefaults>, PanelUserDefaults {}
// #endregion

// #region View

/**
 * Breadcrumb item for view navigation.
 * @source panel/src/panel/view.ts
 * @source panel/src/components/Navigation/Breadcrumb.vue
 * @source src/Panel/Page.php
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
 * @source src/Panel/Panel.php
 */
export interface PanelViewDefaults extends PanelFeatureDefaults {
  /** Crumbs after the area crumb; model views end with the current model. */
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
 * @source panel/src/panel/view.ts
 * @source panel/src/panel/feature.ts
 */
export interface PanelView
  extends
    Omit<PanelFeature<PanelViewDefaults>, "set" | "path">,
    PanelViewDefaults {
  /** Loads a view, canceling any previous request first. */
  load: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<PanelViewDefaults>;

  /**
   * Sets view state, updates document title and browser URL, and returns the
   * merged state.
   */
  set: (state: Partial<PanelViewDefaults>) => PanelViewDefaults;

  /** Rejects with an error; submitting a view is not implemented. */
  submit: () => Promise<never>;
}
// #endregion

// #region Dropdown

/**
 * Dropdown menu option. In an option list, a `"-"` entry renders a
 * separator instead.
 *
 * @source panel/src/components/Dropdowns/DropdownContent.vue
 * @source panel/src/components/Navigation/Button.vue
 * @source panel/src/components/Navigation/Link.vue
 */
export interface PanelDropdownOption {
  /** Text shown in place of `text`. */
  label?: string;

  text?: string | number;

  icon?: string;

  /**
   * Click action. The dropdown closes first, then:
   * - a callback runs with `this` bound to the dropdown component
   * - a string is emitted as an `action` event on the dropdown
   * - an object emits `name` on the dropdown and `global` on the global
   *   event bus, each with `payload`.
   */
  click?:
    (() => void) | string | { name?: string; payload?: any; global?: string };

  /** Visibility condition – the option is hidden when `false`. */
  when?: boolean;

  disabled?: boolean;

  /** Value of the `aria-current` attribute, for active-state styling. */
  current?: boolean | string;

  /** URL or Panel path the option links to. */
  link?: string;

  /** Link target, such as `"_blank"`. Applies only with `link`. */
  target?: string;

  /**
   * Value of the link's `rel` attribute. Applies only with `link`. A
   * `"_blank"` target replaces it with `"noreferrer noopener"`.
   *
   * @since 5.2.0
   */
  rel?: string;

  /**
   * Downloads the linked file instead of opening it. Applies only with
   * `link`.
   *
   * @since 5.0.0
   */
  download?: boolean;

  /**
   * Tooltip text. Also the option's accessible label when `text` is unset.
   *
   * @since 5.2.0
   */
  title?: string;

  /**
   * Dialog to open on click instead of running `click`: a Panel path, or an
   * object `panel.dialog.open()` accepts.
   */
  dialog?: string | Record<string, any>;

  /**
   * Drawer to open on click instead of running `click`: a Panel path, or an
   * object `panel.drawer.open()` accepts.
   *
   * @since 5.2.0
   */
  drawer?: string | Record<string, any>;

  /**
   * Design theme, such as `"negative"` for a destructive entry.
   *
   * @since 5.2.0
   */
  theme?: string;

  /**
   * Colored badge on the option. Its `theme` falls back to the option's
   * `theme`.
   *
   * @since 5.2.0
   */
  badge?: { text: string | number; theme?: string };

  [key: string]: any;
}

/**
 * Dropdown feature for context menus.
 *
 * Manages dropdown menus loaded from the server
 * or created programmatically.
 *
 * @source panel/src/panel/dropdown.ts
 * @source panel/src/panel/feature.ts
 * @source src/Panel/Dropdown.php
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
   * Returns a closure that opens the dropdown and invokes `ready(items)` with
   * its options. The closure rejects when the dropdown has no options.
   *
   * @deprecated Use `open()` and read `options()` instead.
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
  set: (
    state: Partial<PanelFeatureDefaults> & {
      options?: (PanelDropdownOption | "-")[];
    },
  ) => PanelFeatureDefaults;
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
   * Whether the dialog is a component instance from a template, opened via
   * the deprecated `openComponent()`, that renders itself.
   */
  legacy: boolean;
  /** The component instance `openComponent()` opened. */
  ref: any;
}

/**
 * Dialog modal for overlays.
 *
 * Supports both server-loaded dialogs and legacy Vue component dialogs.
 *
 * @source panel/src/panel/dialog.js
 * @source panel/src/panel/modal.js
 */
export interface PanelDialog
  extends
    PanelModal<PanelDialogDefaults>,
    Pick<PanelDialogDefaults, "legacy" | "ref"> {
  /**
   * Closes the current dialog and hides a legacy component referenced via
   * `ref`. Reopens the previous dialog when one is stacked in the history.
   * Ignores a modal ID and resolves to `undefined` without waiting for that
   * reopen.
   */
  close: () => Promise<void>;

  /**
   * Opens a dialog by path, `URL`, or state object. A string path loads from
   * `/dialogs/`; an object with `component` and `props` opens inline. An
   * object with `url` loads that path and passes its other keys as options
   * in place of `options`. `replace: true` on a state object swaps the
   * current dialog in the history instead of stacking on top of it.
   */
  open: (
    dialog:
      | string
      | URL
      | (Partial<PanelDialogDefaults> & {
          /** @since 5.2.0 */
          url?: string;
          /** @since 5.1.0 */
          replace?: boolean;
        }),
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
   * state object, the first tab otherwise, and focuses the drawer. A string
   * path loads from `/drawers/`. An object with `url` loads that path and
   * passes its other keys as options in place of `options`. `replace: true`
   * on a state object swaps the current drawer in the history instead of
   * stacking on top of it.
   */
  open: (
    drawer:
      | string
      | URL
      | (Partial<PanelDrawerDefaults> & {
          /** @since 5.2.0 */
          url?: string;
          replace?: boolean;
          tab?: string;
        }),
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDrawerDefaults>;

  /**
   * Switches drawer tabs.
   * If `tab` is omitted, falls back to the first key of `props.tabs`.
   * Returns `false` when there is no tab to switch to; a `tab` name missing
   * from `props.tabs` throws.
   *
   * @param tab - Tab name to switch to
   */
  tab: (tab?: string) => false | void;

  /** Returns the modal listeners extended with drawer-specific `crumb` (history navigation) and `tab` handlers. */
  listeners: () => PanelModalListeners & {
    crumb: (id: string) => void;
    tab: (tab?: string) => false | void;
  };
}
// #endregion

// #region Content

/**
 * Content version representing saved or changed state.
 * @since 5.0.0
 * @source panel/src/panel/content.js
 * @source src/Panel/Model.php
 */
export interface PanelContentVersion {
  [field: string]: any;
}

/**
 * Content versions container.
 * @since 5.0.0
 * @source panel/src/panel/content.js
 * @source src/Panel/Model.php
 */
export interface PanelContentVersions {
  /** Published content. */
  latest: PanelContentVersion;
  /**
   * Content including unpublished changes; equals `latest` when there are
   * none.
   */
  changes: PanelContentVersion;
}

/**
 * Content lock state of a view.
 * @since 5.0.0
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
  /**
   * User holding the lock. Both fields are `null` when nobody holds the lock
   * or the holder is not listable.
   */
  user: { id: string | null; email: string | null };
}

/**
 * Environment of a content operation. Each key it omits falls back to the
 * current view.
 * @since 5.0.0
 * @source panel/src/panel/content.js
 * @source src/Panel/View.php
 * @source src/Panel/Model.php
 */
export interface PanelContentEnv {
  /** Panel path of the model, such as `/pages/blog+post`. */
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
 * @source panel/src/helpers/throttle.ts
 */
export interface PanelContent {
  /** Panel dialog while the lock dialog is open. */
  dialog: PanelDialog | null;

  /** Whether content is being discarded or published. */
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
   * Returns all changed fields; a field removed from the changes maps to
   * `null`.
   *
   * @throws Error if called for another view
   */
  diff: (env?: PanelContentEnv) => Record<string, any>;

  /**
   * Discards all unpublished changes. Resolves without doing anything while
   * `isProcessing` is `true`, and opens the lock dialog instead of rejecting
   * when the server reports a lock.
   *
   * @throws Error if locked or another view
   */
  discard: (env?: PanelContentEnv) => Promise<void>;

  /**
   * Emits a content event with the environment's `api` and `language`
   * merged over `options`.
   *
   * @param event - Event name, emitted as `content.<event>`
   * @param options - Additional event data
   */
  emit: (
    event: string,
    options?: Record<string, any>,
    env?: PanelContentEnv,
  ) => void;

  /**
   * Returns consistent environment with `api` and `language`.
   *
   * @param env - Override values
   */
  env: (env?: PanelContentEnv) => Required<PanelContentEnv>;

  /**
   * Returns whether the content has unpublished changes.
   *
   * @throws Error if called for another view
   */
  hasDiff: (env?: PanelContentEnv) => boolean;

  /**
   * Returns whether the given env's `api` and `language` both match the
   * current view.
   */
  isCurrent: (env?: PanelContentEnv) => boolean;

  /**
   * Returns whether the current view is locked.
   *
   * @throws Error if called for another view
   */
  isLocked: (env?: PanelContentEnv) => boolean;

  /**
   * Gets the lock state for the current view.
   *
   * @throws Error if called for another view
   */
  lock: (env?: PanelContentEnv) => PanelContentLock;

  /** Opens the lock dialog to inform about other edits. */
  lockDialog: (lock: PanelContentLock) => void;

  /**
   * Merges new values with current changes.
   *
   * @param values - Values to merge
   * @throws Error if called for another view
   */
  merge: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Record<string, any>;

  /**
   * Publishes current changes. Resolves without doing anything while
   * `isProcessing` is `true`, and opens the lock dialog instead of rejecting
   * when the server reports a lock.
   *
   * @param values - Additional values to merge first
   * @throws Error if called for another view
   */
  publish: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<void>;

  /**
   * Sends a content API request. A `"save"` request rejects until `save()`
   * has run once.
   */
  request: (
    method?: "save" | "publish" | "discard" | "unlock",
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<any>;

  /**
   * Saves the given values to the changes version without merging them into
   * the view.
   *
   * @returns `true` if saved, `false` if locked or replaced by a newer save
   */
  save: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<boolean>;

  /**
   * Releases the content lock without discarding changes.
   *
   * First saves any pending changes of the current view and resolves to
   * `false` without unlocking when the view got locked or a newer save took
   * over (other save errors reject); otherwise posts to
   * `<api>/changes/unlock` (failures are ignored, the lock expires on its
   * own) and resolves to `true`.
   *
   * @since 5.5.0
   */
  unlock: (env?: PanelContentEnv) => Promise<boolean>;

  /**
   * Sends the unlock request via `navigator.sendBeacon`, which browsers
   * deliver even while the page unloads, and falls back to a regular POST
   * when the beacon cannot be queued. Cancels pending saves first.
   *
   * @since 5.6.0
   */
  unlockBeaconRequest: (env?: PanelContentEnv) => void;

  /**
   * Sends the unlock request as a silent POST to `<api>/changes/unlock`.
   * Cancels pending saves first.
   *
   * @since 5.6.0
   */
  unlockPostRequest: (env?: PanelContentEnv) => Promise<any>;

  /**
   * Updates form values and saves.
   *
   * @param values - Values to update
   * @returns `true` if saved, `false` if locked or replaced by a newer save
   * @throws Error if called for another view
   */
  update: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<boolean>;

  /**
   * Merges the values into the current changes at once and saves them
   * throttled like `saveLazy`.
   *
   * @param values - Values to update
   * @throws Error if called for another view
   */
  updateLazy: (values?: Record<string, any>, env?: PanelContentEnv) => void;

  /** Returns a specific version of content. */
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
 * @source src/Panel/Search.php
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
 * @source src/Panel/Panel.php
 */
export interface PanelSearchOptions {
  page?: number;
  /** Results per page. */
  limit?: number;
}

/**
 * Search response from the API. Server responses also carry the request
 * envelope (`code`, `path`, `query`, `referrer`); the responses `query()`
 * builds itself for short queries and failures carry only `results` and
 * `pagination`.
 *
 * @source panel/src/panel/search.ts
 * @source src/Panel/Controller/Search.php
 * @source src/Panel/Search.php
 * @source src/Panel/Json.php
 */
export interface PanelSearchResponse {
  /**
   * Result items; `null` for a query shorter than two characters and empty
   * when the request fails.
   */
  results: any[] | null;
  pagination: PanelSearchPagination;
  /** HTTP status code. */
  code?: number;
  /** Panel path of the search route. */
  path?: string | null;
  /** Query parameters of the search request. */
  query?: Record<string, any>;
  /** Panel path the request came from. */
  referrer?: string;
}

/**
 * Searcher feature for Panel search.
 *
 * Manages search dialog and query requests.
 *
 * @source panel/src/panel/search.ts
 */
export interface PanelSearcher {
  /**
   * Controller for aborting the pending query, replaced on every `query()`
   * call; `undefined` until the first one.
   */
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
   * Queries a Panel search type, aborting the previous query first. For
   * queries shorter than 2 characters returns
   * `{ results: null, pagination: {} }` without hitting the server. Resolves
   * to `undefined` when the request was aborted by a subsequent search, and
   * to `{ results: [], pagination: {} }` when it fails for any other reason.
   *
   * @param type - Search type
   * @param query - Search query
   * @param options - Pagination options
   */
  query: (
    type: string,
    query: string,
    options?: PanelSearchOptions,
  ) => Promise<PanelSearchResponse | undefined>;
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
 * @source panel/src/components/Dialogs/UploadReplaceDialog.vue
 * @source src/Panel/File.php
 * @source src/Panel/Ui/Item/FileItem.php
 */
export interface PanelUploadReplaceFile {
  /**
   * Relative Panel path of the file, appended to the API URL for the upload
   * and sent as `path` with the `model.update` event.
   */
  link: string;
  /** File extension without dot, used for the picker `accept` filter. */
  extension: string;
  /** MIME type, used for the picker `accept` filter. `null` when undetectable. */
  mime: string | null;
  /** Filename with extension, shown in the replace dialog. */
  filename: string;
  /** Public URL of the current file, previewed in the replace dialog. */
  url: string;
  /**
   * Preview image settings whose `color` and `icon` style the replace dialog;
   * `null` when the image is switched off.
   */
  image?: { color?: string; icon?: string; [key: string]: any } | null;
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
  /** Formatted file size (e.g., `"1.2MB"`). */
  niceSize: string;
  /** MIME type. */
  type: string;
  /** Blob URL for preview. */
  url: string;
  /** Upload progress (`0`-`100`). */
  progress: number;
  completed: boolean;
  /**
   * Error message of the last failed attempt, or of a name another queued
   * file shares; cleared before each new attempt.
   */
  error: string | null;
  /** Server file model, set once the upload completes. */
  model: any | null;
  /**
   * Preview settings spread in from `preview`, such as `icon` or `color`.
   */
  [key: string]: any;
}

/**
 * Default state for upload feature.
 * @source panel/src/panel/upload.js
 * @source src/Panel/Ui/Upload.php
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
  /** Whether multiple files are allowed. */
  multiple: boolean;
  /**
   * Preview settings (`back`, `color`, `cover`, `icon`) spread into every
   * queued file. A boolean, `false` when the section disables images,
   * spreads nothing.
   */
  preview: Record<string, any> | boolean;
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

  /**
   * Emits `cancel`, aborts any ongoing upload, and if some files already
   * finished emits `complete` and announces success before resetting state.
   */
  cancel: () => Promise<void>;

  /**
   * Closes the upload dialog; if any files completed, emits `complete` and
   * `done` with their server file models, announces success, and resets
   * state. `submit()` calls it once every file has uploaded.
   */
  done: () => Promise<void>;

  /**
   * Finds the index of the last file in the queue with the same `src.name`, `src.type`, `src.size`, and `src.lastModified`, so the newest duplicate wins. Returns `-1` if no duplicate is found.
   *
   * @param file - Enriched upload file to check
   * @returns Index of the last duplicate file, or `-1` if none
   */
  findDuplicate: (file: PanelUploadFile) => number;

  /**
   * Returns `true` unless two or more queued files share the file's `name`
   * and `extension`.
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
   * @param files - Files to add, or an input `change` event
   * @param options - Upload options
   */
  select: (
    files: FileList | Event | null,
    options?: PanelUploadOptions,
  ) => void;

  /**
   * Sets state and replaces the event listeners with those in `on`.
   * `max: 1` forces `multiple: false`, and `multiple: false` forces `max: 1`.
   * Returns `undefined` when called without a `state` argument.
   */
  set: (state?: PanelUploadOptions) => PanelUploadDefaults | undefined;

  /**
   * Uploads every file not yet completed, incrementing `attributes.sort`
   * per file, and calls `done()` once all have completed. A file whose name
   * another queued file shares gets an `error` instead. Throws when `url` is
   * unset.
   */
  submit: () => Promise<void>;

  /**
   * Uploads a single file in chunks with the given form `attributes`. On
   * success it marks the file `completed`, stores the server file model in
   * `model`, and emits `file.upload`. On failure, including a call before
   * `submit()` has set `abort`, it stores `error`, resets `progress` to `0`,
   * and emits `file.upload.error`.
   *
   * @param file - File to upload
   * @param attributes - Form data sent with the file
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
 * Global event bus and delegated DOM events.
 *
 * Once `subscribe()` runs, document and window events are re-emitted on the
 * bus under their own name. The bus ships with built-in handlers:
 * - `online` and `offline` toggle `panel.isOffline`
 * - `keydown.cmd.s` emits `<context>.save`, e.g. `dialog.save`
 * - `keydown.cmd.shift.f` and `keydown.cmd./` open the search dialog
 * - `clipboard.write` copies its payload and shows a success notification.
 *
 * @source panel/src/panel/events.ts
 */
export interface PanelEvents extends PanelEventEmitter {
  /** Element the current drag last entered, `null` after a drop or once the drag leaves it. */
  entered: EventTarget | null;

  // #region Global event handlers

  /**
   * Re-emits the window `beforeunload` event on the bus.
   * @since 5.0.0
   */
  beforeunload: (event: BeforeUnloadEvent) => void;

  /** Re-emits the document `blur` event on the bus, listening in the capture phase. */
  blur: (event: FocusEvent) => void;

  /** Re-emits the document `click` event on the bus. */
  click: (event: MouseEvent) => void;

  /** Re-emits the document `copy` event on the bus, listening in the capture phase. */
  copy: (event: ClipboardEvent) => void;

  /**
   * Remembers the target as `entered`, stops the browser default and
   * propagation, and re-emits `dragenter` on the bus.
   */
  dragenter: (event: DragEvent) => void;

  /** Stops the browser default and propagation, clears `entered`, and re-emits `dragexit` on the bus. */
  dragexit: (event: DragEvent) => void;

  /**
   * Stops the browser default and propagation. Re-emits `dragleave` on the
   * bus and clears `entered` only when the drag leaves the element it last
   * entered.
   */
  dragleave: (event: DragEvent) => void;

  /** Stops the browser default and propagation, and re-emits `dragover` on the bus. */
  dragover: (event: DragEvent) => void;

  /** Stops the browser default and propagation, clears `entered`, and re-emits `drop` on the bus. */
  drop: (event: DragEvent) => void;

  /** Re-emits the document `focus` event on the bus, listening in the capture phase. */
  focus: (event: FocusEvent) => void;

  /**
   * Builds the shortcut event name for a keyboard event, e.g.
   * `keydown.cmd.shift.s`: the type, then `cmd` for Meta or Control, `alt`,
   * `shift`, and the key with its first letter lowercased. `Escape` and the
   * arrow keys become `esc`, `up`, `down`, `left`, and `right`; a lone
   * modifier key adds no key part.
   *
   * @param type - Event name to prefix, e.g. `keydown`
   */
  keychain: (type: string, event: KeyboardEvent) => string;

  /**
   * Emits the shortcut event for the key, e.g. `keydown.esc` or
   * `keydown.cmd.s`, then plain `keydown`, on the bus.
   */
  keydown: (event: KeyboardEvent) => void;

  /**
   * Emits the shortcut event for the key, e.g. `keyup.esc`, then plain
   * `keyup`, on the bus.
   */
  keyup: (event: KeyboardEvent) => void;

  /** Re-emits `offline` on the bus, whose built-in handler sets `panel.isOffline`. */
  offline: (event: Event) => void;

  /** Re-emits `online` on the bus, whose built-in handler clears `panel.isOffline`. */
  online: (event: Event) => void;

  /** Re-emits the document `paste` event on the bus, listening in the capture phase. */
  paste: (event: ClipboardEvent) => void;

  /** Re-emits the window `popstate` event, fired on browser back and forward, on the bus. */
  popstate: (event: PopStateEvent) => void;

  /** Stops the event's propagation and its browser default. */
  prevent: (event: Event) => void;
  // #endregion

  /**
   * Adds the document and window listeners that re-emit their events on the
   * bus.
   */
  subscribe: () => void;

  /**
   * Meant to remove the listeners `subscribe()` added, but leaves them
   * attached: it passes the unbound handlers.
   */
  unsubscribe: () => void;
}
// #endregion
