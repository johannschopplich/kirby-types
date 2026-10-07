/**
 * Base types of the Panel's state hierarchy: State → Feature → Modal.
 */

// #region State Management

/**
 * Vue-reactive base of every Panel state, including features and modals.
 *
 * @typeParam TDefaults - Shape of the default state object
 *
 * @example
 * ```ts
 * const notification: PanelState<PanelNotificationDefaults> = panel.notification;
 * notification.set({ message: "Saved!" });
 * ```
 *
 * @source panel/src/panel/state.ts
 */
export interface PanelState<TDefaults extends object = Record<string, any>> {
  /**
   * Returns the state key identifier.
   * Used by backend responses to target the correct state object.
   */
  key: () => string;

  defaults: () => TDefaults;

  /**
   * Restores the default state by calling `set(defaults())`.
   */
  reset: () => void;

  /**
   * Sets a new state, merging with defaults.
   * Missing and `null` properties are filled from defaults.
   *
   * @param state - Partial state to merge
   * @returns The complete merged state
   * @throws Error if `state` is not an object
   */
  set: (state: Partial<TDefaults>) => TDefaults;

  /**
   * Returns the current state, limited to the keys of `defaults()`. A `null`
   * or `undefined` value falls back to its default.
   */
  state: () => TDefaults;
}
// #endregion

// #region Event Listeners

/**
 * @source panel/src/panel/listeners.ts
 */
export type PanelEventCallback<TReturn = any> = (...args: any[]) => TReturn;

/**
 * @source panel/src/panel/listeners.ts
 */
export type PanelEventListenerMap<TEvents extends string = string> = Partial<
  Record<TEvents, PanelEventCallback>
>;

/**
 * Event listener mixin of every feature and modal, such as `panel.view`,
 * `panel.dialog`, and `panel.drawer`, for custom events without a full
 * event bus.
 *
 * @typeParam TEvents - Union of valid event names
 *
 * @example
 * ```ts
 * panel.dialog.addEventListener("submit", (value) => {
 *   console.log("Dialog submitted:", value);
 * });
 *
 * panel.dialog.emit("submit", formData);
 * ```
 *
 * @source panel/src/panel/listeners.ts
 */
export interface PanelEventListeners<TEvents extends string = string> {
  on: PanelEventListenerMap<TEvents>;

  /**
   * Registers a single event listener, replacing an existing one for the
   * event with a console warning.
   *
   * @param event - Event name to listen for
   * @param callback - Function to call when event fires
   */
  addEventListener: (event: TEvents, callback: PanelEventCallback) => void;

  /**
   * Registers multiple event listeners at once.
   *
   * @param listeners - Object mapping event names to callbacks
   */
  addEventListeners: (listeners?: PanelEventListenerMap<TEvents>) => void;

  /**
   * Emits an event, calling the registered listener if any.
   *
   * @param event - Event name to emit
   * @param args - Arguments to pass to the listener
   * @returns Listener result, or `undefined` when no listener is registered
   */
  emit: <TReturn = any>(event: TEvents, ...args: any[]) => TReturn | undefined;

  /** Checks if a listener is registered for `event`. */
  hasEventListener: (event: TEvents) => boolean;

  /** Returns all registered listeners. */
  listeners: () => PanelEventListenerMap<TEvents>;

  /**
   * Removes the listener registered for `event`.
   * @since 5.5.0
   */
  removeEventListener: (event: TEvents) => void;

  /**
   * Clears every registered listener. Called automatically when feature
   * state is replaced.
   * @since 5.5.0
   */
  removeEventListeners: () => void;
}
// #endregion

// #region Feature

/**
 * @source panel/src/panel/feature.ts
 * @source src/Panel/Json.php
 */
export interface PanelFeatureDefaults {
  /** Current Vue component name to render. */
  component: string | null;

  /**
   * Whether the feature is currently loading data.
   * Set to `true` during `load()`, `get()`, and `post()` calls.
   */
  isLoading: boolean;

  on: PanelEventListenerMap;

  /** Relative path, used for API requests and URL building. */
  path: string | null;

  /** Props passed to the Vue component. */
  props: Record<string, any>;

  /** URL query parameters from the latest request. */
  query: Record<string, any>;

  /** Previous path for navigation and redirects. */
  referrer: string | null;

  /** Timestamp from the backend for cache invalidation. */
  timestamp: number | null;
}

/**
 * State that loads from the server, with request methods, a loading state,
 * and event listeners. Features include `panel.view` and `panel.dropdown`.
 *
 * @typeParam TDefaults - Shape of the feature's default state
 *
 * @example
 * ```ts
 * // Load a view
 * await panel.view.load("/pages/home");
 *
 * // Open a dropdown with options
 * await panel.dropdown.open("pages/home/options");
 * ```
 *
 * @source panel/src/panel/feature.ts
 */
export interface PanelFeature<TDefaults extends object = PanelFeatureDefaults>
  extends PanelState<TDefaults>, PanelEventListeners, PanelFeatureDefaults {
  /**
   * Controller for canceling the pending request, created anew on each
   * `load()` call; `undefined` until the first load.
   * @since 5.1.0
   */
  abortController: AbortController | undefined;

  /**
   * Sends a GET request and returns the response.
   * Sets `isLoading` during the request.
   *
   * @param url - URL to fetch
   * @returns Response data or `false` on error
   * @since 5.1.0
   */
  get: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<any | false>;

  /**
   * Loads a feature from the server and opens it through `panel.open()`.
   *
   * @param url - Feature URL to load
   * @returns The feature's state after loading
   */
  load: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<TDefaults>;

  /**
   * Opens a feature by URL or state object.
   * If given a URL, delegates to `load()`. Otherwise sets state directly.
   *
   * @param options - Request options, or a function to register as the `submit` listener
   * @returns The feature's state after opening
   */
  open: (
    feature: string | URL | Partial<TDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<TDefaults>;

  /**
   * Sends a POST request to the feature's path.
   * Uses `props.value` if no value is provided.
   *
   * @param value - Data to send
   * @returns Response data or `false` on error
   * @throws Error if feature has no path
   */
  post: (value?: any, options?: PanelRequestOptions) => Promise<any | false>;

  /**
   * Reloads the props from the server, updating them only when the response
   * targets the same component.
   *
   * @returns The feature's state after refresh, or `undefined` when the
   *   request fails or the response targets another component
   */
  refresh: (options?: PanelRefreshOptions) => Promise<TDefaults | undefined>;

  /**
   * Reloads the feature by re-opening its current URL.
   *
   * @returns `false` if no path exists, otherwise the feature's state after
   *   re-opening
   */
  reload: (options?: PanelRequestOptions) => Promise<TDefaults | false>;

  /** Creates a full URL object for the current path and query. */
  url: () => URL;
}
// #endregion

// #region Modal

/**
 * @source panel/src/panel/modal.js
 * @source panel/src/panel/feature.ts
 */
export type PanelModalEvent =
  "cancel" | "close" | "closed" | "input" | "open" | "submit" | "success";

/**
 * Bound listener functions returned by `modal.listeners()`.
 * @source panel/src/panel/modal.js
 */
export interface PanelModalListeners {
  cancel: () => Promise<void>;
  close: (id?: string | true) => Promise<Record<string, any> | void>;
  input: (value: any) => void;
  submit: (value?: any, options?: PanelRequestOptions) => Promise<any>;
  success: (response: PanelModalSubmitResponse | string) => any;
  [key: string]: ((...args: any[]) => any) | undefined;
}

/**
 * Success response from modal submission.
 * @source panel/src/panel/modal.js
 */
export interface PanelModalSubmitResponse {
  /** Text of the success notification. */
  message?: string;
  /** Global events to emit, each with the response as payload. */
  event?: string | string[];
  /** Whether to emit the global `"success"` event (default: `true`). */
  emit?: boolean;
  /** URL to navigate to. */
  route?: string | { url: string; options?: PanelRequestOptions };
  /** Alternative to `route`; `false` when there is nowhere to go. */
  redirect?: string | { url: string; options?: PanelRequestOptions } | false;
  /**
   * Options for the view reload that follows when neither `route` nor
   * `redirect` is set. The view reloads either way.
   */
  reload?: PanelRequestOptions;
  [key: string]: any;
}

/**
 * Feature shown as an overlay, such as `panel.dialog` and `panel.drawer`,
 * with history navigation, form handling, and open and close states. An
 * open modal manages document overflow and scroll position.
 *
 * @typeParam TDefaults - Shape of the modal's default state
 *
 * @example
 * ```ts
 * // Open a dialog
 * await panel.dialog.open("pages/create", {
 *   on: {
 *     submit: (value) => console.log("Created:", value)
 *   }
 * });
 *
 * // Go back to a stored drawer
 * panel.drawer.goTo("previous-drawer-id");
 * ```
 *
 * @source panel/src/panel/modal.js
 */
export interface PanelModal<
  TDefaults extends object = PanelFeatureDefaults & { id: string | null },
> extends Omit<PanelFeature<TDefaults>, "reload"> {
  /**
   * Unique ID for identifying nested modals.
   * Auto-generated via UUID if not provided.
   */
  id: string | null;

  isOpen: boolean;

  /** State snapshots of nested modals, for back navigation. */
  history: PanelHistory;

  /** Form value, read from `props.value`. */
  readonly value: any;

  /** Cancels the modal by emitting `"cancel"` and closing. */
  cancel: () => Promise<void>;

  /**
   * Closes the modal, optionally by ID.
   * Reopens the previous modal when the history holds one.
   *
   * @param id - Specific modal ID, `true` to close all, or `undefined` for current
   * @returns The previous modal's state, or `void`
   */
  close: (id?: string | true) => Promise<TDefaults | void>;

  /**
   * Focuses the given input, else the first autofocus element, input, or
   * button in the modal. Without `input`, keeps focus that is already
   * inside the modal.
   *
   * @param input - Optional input name to focus
   */
  focus: (input?: string) => void;

  /**
   * Navigates to a modal in history.
   *
   * @param id - Milestone ID
   */
  goTo: (id: string) => void;

  /**
   * Updates the form value and emits the `"input"` event.
   * Ignored while the modal is closed.
   *
   * @param value - New form value
   */
  input: (value: any) => void;

  /**
   * Returns the listeners to bind on the modal component via `v-on`:
   * `cancel`, `close`, `input`, `submit`, `success`, plus custom listeners.
   */
  listeners: () => PanelModalListeners;

  /**
   * Opens the modal by URL or state object.
   * Closes the current notification on first open and marks the modal
   * as open once a component is set, which also blocks document overflow.
   *
   * @param options - Request options, or a function to register as the `submit` listener
   * @returns The modal's state after opening
   */
  open: (
    modal: string | URL | Partial<TDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<TDefaults>;

  /**
   * Reloads the modal by closing it and re-opening its current URL.
   *
   * @returns `false` if no path exists, otherwise `void` (the re-open is not awaited)
   */
  reload: (options?: PanelRequestOptions) => Promise<false | void>;

  /**
   * Sets modal state, auto-generating an ID if not provided.
   *
   * @returns The complete state
   */
  set: (state: Partial<TDefaults>) => TDefaults;

  /**
   * Submits the modal form to the `submit` listener if one is registered,
   * otherwise as a POST request to the modal's path. Does nothing while
   * loading.
   *
   * @param value - Form value (defaults to `props.value`)
   * @returns The `submit` listener's result if one is registered, the
   *   `close()` result without a path, `false` if the request fails, otherwise
   *   the `success()` result; `undefined` while loading
   */
  submit: (value?: any, options?: PanelRequestOptions) => Promise<any>;

  /**
   * Handles the submit response: closes the modal, shows the success
   * notification, emits the response's events, then redirects or reloads
   * the view. A registered `success` listener replaces all of this.
   *
   * @param success - Success response object or message string
   * @returns The `success` listener's result if one is registered, otherwise the given response
   */
  success: (success: PanelModalSubmitResponse | string) => any;

  /**
   * Emits the response's events on the global event bus, then the global
   * `"success"` event unless `emit` is `false`.
   *
   * @param state - Success response with event data
   */
  successEvents: (state: PanelModalSubmitResponse) => void;

  /**
   * Shows a success notification if the response has a `message`.
   *
   * @param state - Success response with optional message
   */
  successNotification: (state: PanelModalSubmitResponse) => void;

  /**
   * Opens the response's `route`, else its `redirect`, via `panel.open()`.
   *
   * @param state - Success response with `route` or `redirect`
   * @returns `false` if there is none, otherwise the `panel.open()` promise
   */
  successRedirect: (state: PanelModalSubmitResponse) => false | Promise<any>;
}
// #endregion

// #region History

/**
 * Modal state saved in the history.
 * @source panel/src/helpers/history.ts
 */
export interface PanelHistoryMilestone {
  id: string;
  /** Additional state properties. */
  [key: string]: any;
}

/**
 * Navigation history of nested dialogs and drawers, each milestone a
 * complete state snapshot.
 *
 * @example
 * ```ts
 * // Navigate back in drawer history
 * const previous = panel.drawer.history.at(-2);
 * if (previous) {
 *   panel.drawer.goTo(previous.id);
 * }
 * ```
 *
 * @source panel/src/helpers/history.ts
 */
export interface PanelHistory {
  milestones: PanelHistoryMilestone[];

  /**
   * Adds a state to history. A state whose `id` is already stored is
   * ignored, unless `replace` is `true`.
   *
   * @param state - State object with required `id`
   * @param replace - If `true`, replaces the last milestone instead of adding
   * @throws Error if state has no `id`
   */
  add: (state: PanelHistoryMilestone, replace?: boolean) => void;

  /**
   * Returns the milestone at an index, or `undefined`. Negative indices
   * count from the end, `-1` being the last.
   */
  at: (index: number) => PanelHistoryMilestone | undefined;

  clear: () => void;

  /**
   * Returns all milestones when `id` is `null` or omitted, otherwise the
   * milestone with that ID, or `undefined` if none matches.
   */
  get: (
    id?: string | null,
  ) => PanelHistoryMilestone | PanelHistoryMilestone[] | undefined;

  /**
   * Navigates to a milestone, removing all items after it.
   *
   * @param id - Milestone ID to navigate to
   * @returns The milestone, or `undefined` if not found
   */
  goto: (id: string) => PanelHistoryMilestone | undefined;

  /** Checks if a milestone with the given ID exists in history. */
  has: (id: string) => boolean;

  /**
   * Returns `true` when more than one milestone is stored.
   * @since 5.5.0
   */
  hasPrevious: () => boolean;

  /**
   * Returns the array index of the milestone with the given ID, or `-1` if
   * not found.
   */
  index: (id: string) => number;

  isEmpty: () => boolean;

  last: () => PanelHistoryMilestone | undefined;

  /**
   * Removes the milestone with the given ID, or the last one when `id` is
   * `null` or omitted.
   *
   * @returns Updated milestones array
   */
  remove: (id?: string | null) => PanelHistoryMilestone[];

  /** Removes the last milestone and returns the remaining ones. */
  removeLast: () => PanelHistoryMilestone[];

  /** Replaces the milestone at an index; `-1` replaces the last one. */
  replace: (index: number, state: PanelHistoryMilestone) => void;
}
// #endregion

// #region Request Options

/**
 * @source panel/src/panel/request.ts
 * @source panel/src/panel/feature.ts
 * @source panel/src/panel/panel.js
 */
export interface PanelRequestOptions extends Omit<
  RequestInit,
  "body" | "headers" | "referrer"
> {
  headers?: Record<string, string>;
  /**
   * Request body. Forms, `FormData`, and objects are sent as JSON;
   * strings are sent as-is.
   */
  body?: string | FormData | HTMLFormElement | Record<string, any> | null;
  /** Query parameters; `null` values are skipped. */
  query?: Record<string, string | number | boolean | null>;
  signal?: AbortSignal;
  /**
   * If `true`, `load()` skips setting the feature's `isLoading` state.
   * Useful for background requests.
   */
  silent?: boolean;
  on?: PanelEventListenerMap;
  /**
   * Content language code sent as the `x-language` header. Defaults to the
   * current content language, so each browser tab keeps its own; an empty
   * value omits the header.
   * @since 5.6.1
   */
  language?: string | null;
  /**
   * CSRF token sent as the `x-csrf` header.
   * Defaults to the system token; `false` omits the header.
   */
  csrf?: string | false;
  /**
   * Globals sent as the `x-fiber-globals` header.
   * Arrays are joined with commas; strings are forwarded as-is.
   */
  globals?: string | string[];
  /**
   * Referrer path sent as the `x-fiber-referrer` header.
   * Defaults to the current view path; `false` omits the header.
   */
  referrer?: string | false;
}

/**
 * @source panel/src/panel/feature.ts
 */
export interface PanelRefreshOptions extends PanelRequestOptions {
  /** URL to refresh from (defaults to current URL). */
  url?: string | URL;
}
// #endregion

// #region Context & Notification Types

/**
 * Layer that is currently active, which decides where notifications appear
 * and which feature has focus.
 * @source panel/src/panel/panel.js
 * @source panel/src/panel/notification.ts
 */
export type PanelContext = "view" | "dialog" | "drawer";

/**
 * Notification type, which decides behavior and persistence. The `success()`
 * and `info()` shortcuts set `theme` and `icon` instead of a type.
 * - `error`: Operation failed, persists until dismissed.
 * - `fatal`: Critical error, displayed in an isolated iframe.
 * @source panel/src/panel/notification.ts
 */
export type NotificationType = "error" | "fatal";

/**
 * Visual theme for notifications.
 * - `positive`: Green, for success.
 * - `negative`: Red, for errors.
 * - `notice`: Orange, for an outcome needing attention that is not an error.
 * - `warning`: Yellow, for a risky action.
 * - `info`: Blue, for information.
 * - `love`: Pink, for licensing prompts.
 * - `passive`: Gray, for muted, secondary content.
 * - `text`: White, for plain, unstyled content.
 *
 * Kirby accepts any string as the theme and matches the stylesheet by prefix,
 * so plain color names (`red`, `green`, ...) and suffixed variants such as
 * `positive-icon` are styled as well.
 * @source panel/src/panel/notification.ts
 * @source panel/src/styles/utilities/theme.css
 */
export type NotificationTheme =
  | "positive"
  | "negative"
  | "notice"
  | "warning"
  | "info"
  | "love"
  | "passive"
  | "text"
  | (string & {});
// #endregion
