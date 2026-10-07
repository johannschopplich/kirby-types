/**
 * Feature type definitions for Kirby Panel: state objects, features, and
 * modals.
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
import type { HtmlString } from "./index";

// #region Timer

/**
 * Interval timer behind the notification auto-close.
 *
 * @source panel/src/helpers/timer.ts
 */
export interface PanelTimer {
  readonly isRunning: boolean;

  /**
   * Starts calling `callback` every `timeout` milliseconds, stopping any
   * previous timer first. A `timeout <= 0` only stops the previous timer.
   */
  start: (timeout: number, callback: () => void) => void;

  /** Stops the timer; safe to call when it is not running. */
  stop: () => void;
}
// #endregion

// #region Activation

/**
 * @source panel/src/panel/activation.ts
 */
export interface PanelActivationDefaults {
  /** Whether the activation card is visible. */
  isOpen: boolean;
}

/**
 * License activation card; once closed, it stays hidden in the same tab,
 * across reloads.
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
 * @source panel/src/panel/drag.ts
 */
export interface PanelDragDefaults {
  /** Type of the dragged item; `null` when no drag is in progress. */
  type: string | null;
  data: string | Record<string, any>;
}

/**
 * Type and payload of the drag in progress.
 *
 * @source panel/src/panel/drag.ts
 */
export interface PanelDrag
  extends PanelState<PanelDragDefaults>, PanelDragDefaults {
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
 * @source panel/src/panel/theme.ts
 */
export interface PanelThemeDefaults {
  /** User's theme preference from localStorage. */
  setting: string | null;
  /** Color scheme the system prefers, updated when it changes. */
  system: "light" | "dark";
}

/**
 * Theme preference accepted by `set()`.
 * @source panel/src/panel/theme.ts
 */
export type PanelThemeValue = "light" | "dark" | "system";

/**
 * Panel color theme from the user's setting, the `panel.theme` option, or
 * the system preference.
 *
 * @source panel/src/panel/theme.ts
 * @source src/Panel/State.php
 */
export interface PanelTheme
  extends
    Omit<PanelState<PanelThemeDefaults>, "reset" | "set">,
    PanelThemeDefaults {
  /**
   * Default theme from the `panel.theme` option; `"system"` unless configured.
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
   * Clears the user's stored preference, so `current` falls back to
   * `config` or the system.
   */
  reset: () => void;

  /** Sets the user's theme preference and stores it in localStorage. */
  set: (theme: PanelThemeValue) => void;
}
// #endregion

// #region Language (Content Language)

/**
 * @source panel/src/panel/language.ts
 * @source src/Panel/State.php
 * @source src/Cms/Language.php
 */
export interface PanelLanguageDefaults {
  /** Language code (e.g., `"en"`, `"de"`); `null` on single-language sites. */
  code: string | null;
  default: boolean;
  direction: "ltr" | "rtl";
  hasCustomDomain: boolean;
  /** Language name; `null` on single-language sites. */
  name: string | null;
  /** Slug conversion rules; empty on single-language sites. */
  rules: Record<string, string>;
}

/**
 * Content language currently edited in the Panel.
 *
 * @source panel/src/panel/language.ts
 * @source src/Panel/State.php
 * @source src/Cms/Language.php
 */
export interface PanelLanguage
  extends PanelState<PanelLanguageDefaults>, PanelLanguageDefaults {
  /** Alias of `default`. */
  readonly isDefault: boolean;
}
// #endregion

// #region Menu

/**
 * Props of a menu button.
 *
 * The backend drops `null` props, so only `disabled`, `responsive`, and
 * `type` are always present.
 *
 * @source src/Panel/Ui/Button.php
 * @source src/Panel/Menu.php
 */
export interface PanelMenuButtonProps {
  /** Badge shown on the top-right corner of the button. */
  badge?: { text: string | number; theme?: string };
  class?: string;
  /**
   * Whether the entry is currently active; a string sets its `aria-current`
   * value.
   */
  current?: boolean | string;
  /**
   * Dialog URL or options – when set, the entry opens a dialog instead of
   * navigating.
   */
  dialog?: string | Record<string, any>;
  /** Whether the entry is rendered as visually disabled. */
  disabled: boolean;
  /**
   * Drawer URL or options – when set, the entry opens a drawer instead of
   * navigating.
   */
  drawer?: string | Record<string, any>;
  dropdown?: boolean;
  icon?: string;
  /** Area or entry identifier, e.g. `"site"` or `"logout"`. */
  id?: string;
  link?: string;
  /**
   * Whether the text hides on small screens, keeping only the icon;
   * `"text"` hides the icon instead.
   */
  responsive: boolean | string;
  /** Button size, e.g. `"xs"` or `"sm"`. */
  size?: string;
  style?: string;
  /** Anchor target attribute (e.g. `"_blank"`). */
  target?: string;
  text?: string;
  theme?: string;
  /** Tooltip text. */
  title?: string;
  /** Button `type` attribute, `"button"` by default. */
  type: string;
  /** Styling variant, e.g. `"filled"` or `"dimmed"`. */
  variant?: string;
}

/**
 * Menu item, rendered by the backend as a UI component.
 *
 * @source panel/src/panel/menu.ts
 * @source src/Panel/Menu.php
 * @source src/Panel/Ui/Component.php
 */
export interface PanelMenuItem {
  /** Component name, e.g. `"k-button"`. */
  component: string;
  key: string;
  props: PanelMenuButtonProps;
}

/**
 * @source panel/src/panel/menu.ts
 * @source src/Panel/State.php
 */
export interface PanelMenuDefaults {
  /** Whether menu is being hovered. */
  hover: boolean;
  /** Whether menu is expanded. */
  isOpen: boolean;
  /** Menu items and `"-"` separators. */
  items: (PanelMenuItem | "-")[];
}

/**
 * Panel sidebar menu. It starts closed on mobile and restores its last state
 * on desktop.
 *
 * @source panel/src/panel/menu.ts
 */
export interface PanelMenu
  extends Omit<PanelState<PanelMenuDefaults>, "set">, PanelMenuDefaults {
  /**
   * Closes the mobile menu on a click outside of it.
   * @internal
   */
  blur: (event?: Event) => void;

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
   * Sets the menu items and restores the open or closed state.
   */
  set: (items: (PanelMenuItem | "-")[]) => PanelMenuDefaults;

  /** Toggles the sidebar menu state. */
  toggle: () => void;
}
// #endregion

// #region Notification

/**
 * @source panel/src/panel/notification.ts
 */
export interface PanelNotificationDefaults {
  /** Context where notification appears. */
  context: PanelContext | null;
  /**
   * Details passed to `open()`, unread by the Panel; an empty object by
   * default.
   */
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
 * Plain error object that `error()` and `fatal()` accept. Its `message` is
 * shown, or `Something went wrong` without one.
 * @source panel/src/panel/notification.ts
 */
export interface PanelErrorObject {
  message?: string;
  /** Extra details, listed by the error dialog that opens in view context. */
  details?: Record<string, any>;
}

/**
 * Notification in the current view, dialog, or drawer, with an optional
 * auto-close timer.
 *
 * @source panel/src/panel/notification.ts
 */
export interface PanelNotification
  extends PanelState<PanelNotificationDefaults>, PanelNotificationDefaults {
  /** Auto-close timer. */
  timer: PanelTimer;

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
   * @param error - Error instance, message string, or plain
   *   `{ message, details }` object; any other value shows
   *   `Something went wrong`
   */
  error: (error: unknown) => PanelNotificationDefaults;

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
   * Otherwise resets every field the options omit to its default, takes the
   * current Panel context unless the options carry their own, replaces a
   * falsy `timeout` with `4000` ms for types other than `error` and `fatal`,
   * opens the notification, and starts the auto-close timer.
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
 * @source panel/src/panel/system.ts
 * @source src/Panel/State.php
 */
export interface PanelSystemDefaults {
  /** ASCII character replacements for slugs. */
  ascii: Record<string, string>;
  /** CSRF token for API requests. */
  csrf: string;
  /** Whether the Panel runs in a local development environment. */
  isLocal: boolean;
  /**
   * Locale of each interface translation, keyed by translation code
   * (e.g. `{ de: "de_DE" }`).
   */
  locales: Record<string, string>;
  /** Slug character replacements of the current language. */
  slugs: Record<string, string>;
  /** Site title; `"Kirby Panel"` when the site has none. */
  title: string;
}

/**
 * System information from the backend.
 *
 * @source panel/src/panel/system.ts
 * @source src/Panel/State.php
 */
export interface PanelSystem
  extends PanelState<PanelSystemDefaults>, PanelSystemDefaults {}
// #endregion

// #region Translation (Interface Language)

/**
 * @source panel/src/panel/translation.ts
 * @source src/Panel/State.php
 */
export interface PanelTranslationDefaults {
  /** Translation code (e.g., `"en"`, `"de"`). */
  code: string;
  /** Translation strings by key. */
  data: Record<string, string>;
  direction: "ltr" | "rtl";
  name: string;
  /**
   * First day of the week, `0` (Sunday) to `6` (Saturday), from the
   * `date.weekday` option or the translation's locale.
   */
  weekday: number;
}

/**
 * Interface translation of the current user.
 *
 * @source panel/src/panel/translation.ts
 * @source src/Panel/State.php
 */
export interface PanelTranslation
  extends
    Omit<PanelState<PanelTranslationDefaults>, "set">,
    PanelTranslationDefaults {
  /**
   * Sets the state, syncs the document `lang` and the body `dir`, and
   * activates the matching dayjs locale.
   */
  set: (state: Partial<PanelTranslationDefaults>) => PanelTranslationDefaults;

  /**
   * Fetches a translation string and fills its placeholders from `data`.
   * Falls back to `fallback`, then to the key itself. A string as second
   * argument is the fallback shorthand. Non-string keys return `undefined`.
   *
   * @param key - Translation key
   * @param data - Placeholder values, or the fallback string
   * @param fallback - Fallback if the key is not found
   */
  translate: {
    (key: string, fallback: string): string;
    (key: string, data?: Record<string, any>, fallback?: string): string;
    (
      key: unknown,
      data?: Record<string, any> | string,
      fallback?: string,
    ): string | undefined;
  };

  /**
   * Translates like `translate()`, but escapes every filled placeholder and
   * marks the result as trusted HTML. Values wrapped with `panel.html()` pass
   * through unescaped. A string as second argument is the fallback shorthand.
   *
   * @param key - Translation key
   * @param data - Placeholder values, or the fallback string
   * @param fallback - Fallback if the key is not found
   */
  translateHtml: {
    (key: string, fallback: string): HtmlString;
    (key: string, data?: Record<string, any>, fallback?: string): HtmlString;
  };
}
// #endregion

// #region User

/**
 * @source panel/src/panel/user.ts
 * @source src/Panel/State.php
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
 * Logged-in user.
 *
 * @source panel/src/panel/user.ts
 * @source src/Panel/State.php
 */
export interface PanelUser
  extends PanelState<PanelUserDefaults>, PanelUserDefaults {}
// #endregion

// #region View

/**
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
   */
  title?: string;
  /** Icon for plugin-supplied breadcrumbs; core views never set it. */
  icon?: string;
}

/**
 * @source panel/src/panel/view.ts
 * @source panel/src/panel/feature.ts
 * @source src/Panel/State.php
 * @source src/Panel/Area.php
 */
export interface PanelViewDefaults extends PanelFeatureDefaults {
  /**
   * Crumbs shown after the area crumb, which `breadcrumbLabel`, `icon`, and
   * `link` describe.
   */
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
 * Main Panel view, which owns the document title and the browser history.
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
 * Dropdown option. Other button props pass through to the rendered item.
 *
 * @source panel/src/panel/dropdown.ts
 * @source panel/src/components/Dropdowns/Dropdown.vue
 * @source panel/src/components/Navigation/Button.vue
 * @source panel/src/components/Navigation/Link.vue
 */
export interface PanelDropdownOption {
  /** Text shown for the option, in place of `text`. */
  label?: string;
  /** Text shown without `label`; also the option's accessible label. */
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
  /** Whether the option is shown; `false` hides it. */
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
   */
  rel?: string;
  /**
   * Downloads the linked file instead of opening it. Applies only with
   * `link`.
   */
  download?: boolean;
  /** Tooltip text. Also the option's accessible label when `text` is unset. */
  title?: string;
  /**
   * Dialog to open on click instead of running `click`, as a Panel path or
   * a dialog state object.
   */
  dialog?: string | Record<string, any>;
  /**
   * Drawer to open on click instead of running `click`, as a Panel path or
   * a drawer state object.
   */
  drawer?: string | Record<string, any>;
  /** Design theme, such as `"negative"` for a destructive entry. */
  theme?: string;
  /**
   * Colored badge on the option. Its `theme` falls back to the option's
   * `theme`.
   */
  badge?: { text: string | number; theme?: string };
  [key: string]: any;
}

/**
 * Dropdown menu, loaded from the backend or opened from a state object.
 *
 * @source panel/src/panel/dropdown.ts
 * @source panel/src/panel/feature.ts
 * @source src/Panel/Response/DropdownResponse.php
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
 * @source panel/src/panel/dialog.ts
 * @source panel/src/panel/modal.ts
 */
export interface PanelDialogDefaults extends PanelFeatureDefaults {
  /**
   * ID that tells nested dialogs apart, generated when the state brings none.
   */
  id: string | null;
}

/**
 * Panel dialog, loaded from the backend or opened from a state object.
 *
 * @source panel/src/panel/dialog.ts
 * @source panel/src/panel/modal.ts
 */
export interface PanelDialog extends PanelModal<PanelDialogDefaults> {
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
      | (Partial<PanelDialogDefaults> & { url?: string; replace?: boolean }),
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDialogDefaults>;
}
// #endregion

// #region Drawer

/**
 * @source panel/src/panel/drawer.ts
 * @source panel/src/panel/modal.ts
 */
export interface PanelDrawerDefaults extends PanelFeatureDefaults {
  /** ID that tells nested drawers apart, generated when the state brings none. */
  id: string | null;
}

/**
 * Panel drawer. Nested drawers stack up with breadcrumb navigation.
 *
 * @source panel/src/panel/drawer.ts
 * @source panel/src/panel/modal.ts
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
          url?: string;
          replace?: boolean;
          tab?: string;
        }),
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<PanelDrawerDefaults>;

  /**
   * Switches drawer tabs.
   * If `tab` is omitted, falls back to the first key of `props.tabs`.
   * A `tab` name missing from `props.tabs` throws.
   *
   * @param tab - Tab name to switch to
   */
  tab: (tab?: string) => void;

  /**
   * Returns the modal listeners plus the drawer's `crumb` handler, which
   * navigates the history, and its `tab` handler.
   */
  listeners: () => PanelModalListeners & {
    crumb: (id: string) => void;
    tab: (tab?: string) => void;
  };
}
// #endregion

// #region Content

/**
 * Field values of one content version, keyed by field name.
 * @source panel/src/panel/content.ts
 */
export interface PanelContentVersion {
  [field: string]: any;
}

/**
 * Published content and unpublished changes of the current model view.
 * @source panel/src/panel/content.ts
 * @source src/Panel/Controller/View/ModelViewController.php
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
 * @source panel/src/panel/content.ts
 * @source src/Content/Lock.php
 */
export interface PanelContentLock {
  /** Whether the lock comes from a legacy `.lock` file. */
  isLegacy: boolean;
  /** Whether content is locked by another user. */
  isLocked: boolean;
  /**
   * Lock modification timestamp. Initially an ISO 8601 string from the
   * server; after a successful save the Panel replaces it with a `Date`.
   */
  modified: string | Date | null;
  /**
   * User who holds the lock; both fields are `null` when no user is set or
   * the user is not listable.
   */
  user: { id: string | null; email: string | null };
}

/**
 * Target of a content operation; each omitted key defaults to the current
 * view.
 * @source panel/src/panel/content.ts
 * @source src/Panel/State.php
 * @source src/Panel/Controller/View/ModelViewController.php
 */
export interface PanelContentEnv {
  /** Panel path of the model, such as `/pages/blog+post`. */
  api?: string;
  /** Content language code; `null` on single-language sites. */
  language?: string | null;
}

/**
 * Content state of the current model view: versions, saving, publishing,
 * and lock handling. `saveLazy` and `updateLazy` throttle saves while
 * typing.
 *
 * @source panel/src/panel/content.ts
 * @source panel/src/helpers/throttle.ts
 */
export interface PanelContent {
  /** `panel.dialog` while the lock dialog is open, `undefined` otherwise. */
  dialog: PanelDialog | undefined;

  /** Whether content is being discarded or published. */
  isProcessing: boolean;

  /**
   * Saves throttled at `500` ms: the first call saves at once, further
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
   * Returns `env` with its missing `api` and `language` taken from the
   * current view.
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
   * Sets the lock's `modified` timestamp to a fresh `Date`. `save()` calls
   * it after each successful save of the current view.
   *
   * @throws Error if called for another view
   */
  renewLock: (env?: PanelContentEnv) => void;

  /** Sends a content API request. */
  request: (
    method?: "save" | "publish" | "discard" | "unlock",
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<void>;

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
   */
  unlock: (env?: PanelContentEnv) => Promise<boolean>;

  /**
   * Sends the unlock request via `navigator.sendBeacon`, which browsers
   * deliver even while the page unloads, and falls back to a regular POST
   * when the beacon cannot be queued. Cancels pending saves first.
   */
  unlockBeaconRequest: (env?: PanelContentEnv) => void;

  /**
   * Sends the unlock request as a silent POST to `<api>/changes/unlock`.
   * Cancels pending saves first.
   */
  unlockPostRequest: (env?: PanelContentEnv) => Promise<void>;

  /**
   * Updates form values and saves.
   *
   * @returns `true` if saved, `false` if locked or replaced by a newer save
   * @throws Error if called for another view
   */
  update: (
    values?: Record<string, any>,
    env?: PanelContentEnv,
  ) => Promise<boolean>;

  /**
   * Merges the values into the current changes at once and saves them
   * throttled through `saveLazy`.
   *
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
 * @source panel/src/panel/search.ts
 * @source src/Panel/Controller/Search/ModelsSearchController.php
 * @source src/Panel/Response/SearchResponse.php
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
 * @source panel/src/panel/search.ts
 * @source src/Panel/Routes/SearchRoutes.php
 */
export interface PanelSearchOptions {
  page?: number;
  /** Results per page. */
  limit?: number;
}

/**
 * Search response from the Panel backend. Server responses also carry the
 * request envelope (`code`, `path`, `query`, `referrer`); the responses
 * `query()` builds itself for short queries and failures carry only
 * `results` and `pagination`.
 *
 * @source panel/src/panel/search.ts
 * @source src/Panel/Controller/Search/ModelsSearchController.php
 * @source src/Panel/Response/SearchResponse.php
 * @source src/Panel/Response/JsonResponse.php
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
 * Search dialog and the queries behind it.
 *
 * @source panel/src/panel/search.ts
 */
export interface PanelSearcher {
  /**
   * Controller for canceling the pending search, replaced on each `query()`
   * call; `undefined` until the first query.
   */
  controller: AbortController | undefined;

  /** Number of active requests. */
  requests: number;

  /** Whether any search is loading. */
  readonly isLoading: boolean;

  /**
   * Closes the mobile menu and opens the search dialog for the given type.
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
 * client-side queued upload). `link`, `extension`, and `mime` set the upload
 * target and the picker's accept filter; `filename`, `url`, `mime`, and
 * `image` render the replace dialog.
 *
 * @source panel/src/panel/upload.ts
 * @source panel/src/components/Dialogs/UploadReplaceDialog.vue
 * @source src/Panel/Ui/Item/FileItem.php
 * @source src/Panel/Controller/View/FileViewController.php
 * @source src/Panel/File.php
 */
export interface PanelUploadReplaceFile {
  /**
   * Relative Panel path of the file, appended to the API URL for the upload
   * and sent as `path` with the `model.update` event.
   */
  link: string;
  /** File extension without dot, used for the picker `accept` filter. */
  extension: string;
  /**
   * MIME type, used for the picker `accept` filter; `null` when undetectable.
   */
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
 * File in the upload queue.
 *
 * @source panel/src/panel/upload.ts
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
   * Error message of a name clash or a thrown `Error`, cleared before each
   * new attempt. A server-rejected upload leaves it unset.
   */
  error?: string;
  /** Server file model, set once the upload completes. */
  model?: any;
  /**
   * Preview settings spread in from `preview`, such as `icon` or `color`.
   */
  [key: string]: any;
}

/**
 * @source panel/src/panel/upload.ts
 * @source src/Panel/Ui/Upload.php
 */
export interface PanelUploadDefaults {
  /** Accepted file types. */
  accept: string;
  /** Additional file attributes. */
  attributes: Record<string, any>;
  files: PanelUploadFile[];
  /** Maximum number of files. */
  max: number | null;
  /** Whether multiple files are allowed. */
  multiple: boolean;
  /** Event listeners, replacing the previous ones on every `set()` call. */
  on: PanelEventListenerMap;
  /**
   * Preview settings, such as `back`, `color`, `cover`, `icon`, or `query`,
   * spread into every queued file, or `false` when the field disables images.
   */
  preview: Record<string, any> | false;
  /**
   * Server file model being replaced. While set, `open()` shows the replace
   * dialog and `model.update` carries its `link` as `path`.
   */
  replacing: PanelUploadReplaceFile | null;
  /** Upload endpoint URL. */
  url: string | null;
}

type PanelUploadOptions = Partial<PanelUploadDefaults>;

/**
 * File upload with selection, progress, and completion. Large files upload in
 * chunks.
 *
 * @source panel/src/panel/upload.ts
 */
export interface PanelUpload
  extends
    Omit<PanelState<PanelUploadDefaults>, "set">,
    PanelEventListeners,
    PanelUploadDefaults {
  /**
   * Controller for aborting in-flight uploads; `undefined` until the first
   * `submit()`, and kept across `reset()`.
   */
  abort: AbortController | undefined;

  /** Server file models for files that completed uploading. */
  readonly completed: any[];

  /**
   * Shows a success notification and emits `model.update`.
   */
  announce: () => void;

  /**
   * Emits `cancel`, aborts any ongoing upload, and if some files already
   * finished emits `complete` and announces success before resetting state.
   */
  cancel: () => Promise<void>;

  /**
   * Closes the upload dialog and, if any files completed, emits `complete`
   * and `done` and announces success. Resets state either way.
   */
  done: () => Promise<void>;

  /**
   * Finds the last queued file with the same `src.name`, `src.type`,
   * `src.size`, and `src.lastModified`, so the newest duplicate wins.
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

  /** Converts a `File` into an enriched upload file. */
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

  /** Opens the file picker to replace an existing file. */
  replace: (
    file: PanelUploadReplaceFile,
    options?: PanelUploadOptions & { immediate?: boolean },
  ) => void;

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
   * Uploads all files not yet completed and throws when `url` is missing. A
   * file sharing its name and extension with another queued file gets an
   * `error` instead of uploading. A set `attributes.sort` increments once per
   * file, and `done()` runs once every file has completed.
   */
  submit: () => Promise<void>;

  /**
   * Uploads a single file in chunks with the given form `attributes`. On
   * success it marks the file `completed`, stores the server file model in
   * `model`, and emits `file.upload`. On failure, including a call before
   * `submit()` has set `abort`, it resets `progress` to `0` and emits
   * `file.upload.error`. A thrown `Error` also stores its message in
   * `error`; a server-rejected upload leaves `error` unset.
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
 * Mitt-compatible event emitter.
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
 * - `keydown.cmd.s` emits `<context>.save`; `dialog.save` and `drawer.save`
 *   submit the open dialog or drawer
 * - `keydown.cmd.shift.f` and `keydown.cmd./` open the search dialog
 * - `clipboard.write` copies its payload and shows a success notification.
 *
 * @source panel/src/panel/events.ts
 */
export interface PanelEvents extends PanelEventEmitter {
  /**
   * Element the current drag last entered, `null` after a drop or once the
   * drag leaves it.
   */
  entered: EventTarget | null;

  // #region Global event handlers

  /** Re-emits the window `beforeunload` event on the bus. */
  beforeunload: (event: BeforeUnloadEvent) => void;

  /**
   * Re-emits the document `blur` event on the bus, listening in the capture
   * phase.
   */
  blur: (event: FocusEvent) => void;

  /** Re-emits the document `click` event on the bus. */
  click: (event: MouseEvent) => void;

  /**
   * Re-emits the document `copy` event on the bus, listening in the capture
   * phase.
   */
  copy: (event: ClipboardEvent) => void;

  /**
   * Remembers the target as `entered`, stops the browser default and
   * propagation, and re-emits `dragenter` on the bus.
   */
  dragenter: (event: DragEvent) => void;

  /**
   * Stops the browser default and propagation. Re-emits `dragleave` on the
   * bus and clears `entered` only when the drag leaves the element it last
   * entered.
   */
  dragleave: (event: DragEvent) => void;

  /**
   * Stops the browser default and propagation, and re-emits `dragover` on
   * the bus.
   */
  dragover: (event: DragEvent) => void;

  /**
   * Stops the browser default and propagation, clears `entered`, and
   * re-emits `drop` on the bus.
   */
  drop: (event: DragEvent) => void;

  /**
   * Re-emits the document `focus` event on the bus, listening in the capture
   * phase.
   */
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

  /**
   * Re-emits `offline` on the bus, whose built-in handler sets
   * `panel.isOffline`.
   */
  offline: (event: Event) => void;

  /**
   * Re-emits `online` on the bus, whose built-in handler clears
   * `panel.isOffline`.
   */
  online: (event: Event) => void;

  /**
   * Re-emits the document `paste` event on the bus, listening in the capture
   * phase.
   */
  paste: (event: ClipboardEvent) => void;

  /**
   * Re-emits the window `popstate` event, fired on browser back and forward,
   * on the bus.
   */
  popstate: (event: PopStateEvent) => void;

  /** Stops the event's propagation and its browser default. */
  prevent: (event: Event) => void;
  // #endregion

  /**
   * Attaches the document and window listeners that re-emit their events on
   * the bus.
   */
  subscribe: () => void;

  /**
   * Detaches the listeners that `subscribe()` attached, except the
   * capture-phase `blur`, `copy`, `focus`, and `paste` listeners on
   * `document`, which stay attached.
   */
  unsubscribe: () => void;
}
// #endregion
