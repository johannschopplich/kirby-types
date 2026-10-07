/**
 * Base type definitions for Kirby Panel.
 *
 * This module provides the foundational types for the Panel's
 * state management hierarchy: State → Feature → Modal.
 */

// #region State Management

/**
 * Base state interface for Panel state objects.
 *
 * The Panel uses a hierarchical state management pattern where all
 * reactive state objects inherit from this base. State objects are
 * created via factory functions that return Vue reactive objects.
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

  /**
   * Returns all default values for the state.
   * Used for state restoration and initialization.
   */
  defaults: () => TDefaults;

  /**
   * Restores the default state by calling `set(defaults())`.
   */
  reset: () => void;

  /**
   * Sets a new state, merging with defaults.
   * Missing properties are filled from defaults.
   *
   * @param state - Partial state to merge
   * @returns The complete merged state
   */
  set: (state: Partial<TDefaults>) => TDefaults;

  /**
   * Returns the current state filtered to default keys only.
   * Properties not in defaults are excluded.
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
 * Map of event names to their callback functions.
 * @source panel/src/panel/listeners.ts
 */
export type PanelEventListenerMap<TEvents extends string = string> = Partial<
  Record<TEvents, PanelEventCallback>
>;

/**
 * Event listener mixin interface.
 *
 * Provides event handling capabilities for Panel features.
 * This is mixed into Feature and Modal classes to enable
 * custom event handling without a full event bus.
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
   * event with a console warning. Only functions are registered; other
   * values are ignored.
   *
   * @param event - Event name to listen for
   * @param callback - Function to call when event fires
   */
  addEventListener: (event: TEvents, callback: PanelEventCallback) => void;

  /**
   * Registers multiple event listeners at once.
   * Invalid listener objects are silently ignored.
   *
   * @param listeners - Object mapping event names to callbacks
   */
  addEventListeners: (listeners?: PanelEventListenerMap<TEvents>) => void;

  /**
   * Emits an event, calling the registered listener if any.
   *
   * @param event - Event name to emit
   * @param args - Arguments to pass to the listener
   * @returns Listener result, or `undefined` when no listener is registered.
   */
  emit: <TReturn = any>(event: TEvents, ...args: any[]) => TReturn | undefined;

  /**
   * Checks if a listener is registered for an event.
   *
   * @param event - Event name to check
   * @returns `true` if a function is registered for this event
   */
  hasEventListener: (event: TEvents) => boolean;

  /** Returns all registered listeners. */
  listeners: () => PanelEventListenerMap<TEvents>;

  /**
   * Removes the listener registered for `event`.
   *
   * @param event - Event name whose listener should be removed
   */
  removeEventListener: (event: TEvents) => void;

  /**
   * Clears every registered listener. Called automatically when feature
   * state is replaced.
   */
  removeEventListeners: () => void;
}
// #endregion

// #region Feature

/**
 * @source panel/src/panel/feature.ts
 * @source src/Panel/Response/JsonResponse.php
 */
export interface PanelFeatureDefaults {
  component: string | null;
  isLoading: boolean;
  on: PanelEventListenerMap;
  path: string | null;
  props: Record<string, any>;
  query: Record<string, any>;
  referrer: string | null;
  timestamp: number | null;
}

/**
 * Feature interface with loading and request capabilities.
 *
 * Features are the main building blocks of the Panel, providing
 * loading states, API requests, and event handling. They extend
 * State with HTTP request methods and the event listener mixin.
 *
 * Features include: view, dropdown.
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
  extends PanelState<TDefaults>, PanelEventListeners {
  /**
   * Controller for canceling the pending request, created anew on each
   * `load()` call; `undefined` until the first load.
   */
  abortController: AbortController | undefined;

  /**
   * Current Vue component name to render.
   * Set by the backend response.
   */
  component: string | null;

  /**
   * Whether the feature is currently loading data.
   * Set to `true` during `load()`, `get()`, and `post()` calls.
   */
  isLoading: boolean;

  /**
   * Relative path for the feature.
   * Used for API requests and URL building.
   */
  path: string | null;

  /**
   * Props passed to the Vue component.
   * Contains all data from the backend response.
   */
  props: Record<string, any>;

  /** URL query parameters from the latest request. */
  query: Record<string, any>;

  /** Previous path for navigation and redirects. */
  referrer: string | null;

  /** Timestamp from the backend for cache invalidation. */
  timestamp: number | null;

  /**
   * Sends a GET request and returns the response.
   * Sets `isLoading` during the request.
   *
   * @param url - URL to fetch
   * @param options - Request options
   * @returns Response data or `false` on error
   */
  get: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<any | false>;

  /**
   * Loads a feature from the server and opens it.
   * Creates an `AbortController` for the request, then routes through
   * `panel.open()`.
   *
   * @param url - Feature URL to load
   * @param options - Request options
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
   * @param feature - URL string, URL object, or state object
   * @param options - Request options or submit handler function
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
   * @param options - Request options
   * @returns Response data or `false` on error
   * @throws Error if feature has no path
   */
  post: (value?: any, options?: PanelRequestOptions) => Promise<any | false>;

  /**
   * Reloads properties from the server to refresh state.
   * Only updates props if the component matches.
   *
   * @param options - Request options
   * @returns The feature's state after refresh
   */
  refresh: (options?: PanelRefreshOptions) => Promise<TDefaults | undefined>;

  /**
   * Reloads the feature by re-opening its current URL.
   *
   * @param options - Request options
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
 * @source panel/src/panel/modal.ts
 * @source panel/src/panel/feature.ts
 */
export type PanelModalEvent =
  "cancel" | "close" | "closed" | "input" | "open" | "submit" | "success";

/**
 * Bound listener functions returned by `modal.listeners()`.
 * @source panel/src/panel/modal.ts
 */
export interface PanelModalListeners {
  cancel: () => Promise<void>;
  close: (id?: string | true) => Promise<void>;
  input: (value: any) => void;
  submit: (value?: any, options?: PanelRequestOptions) => Promise<any>;
  success: (response: PanelModalSubmitResponse | string) => any;
  [key: string]: ((...args: any[]) => any) | undefined;
}

/**
 * Success response from modal submission.
 * @source panel/src/panel/modal.ts
 */
export interface PanelModalSubmitResponse {
  /** Text of the success notification. */
  message?: string;
  /** Events to emit (string or array of strings). */
  event?: string | string[];
  /** Whether to emit the global `"success"` event (default: `true`). */
  emit?: boolean;
  /** URL to navigate to. */
  route?: string | { url: string; options?: PanelRequestOptions };
  /** Alternative to `route`; `null` when there is nowhere to go. */
  redirect?: string | { url: string; options?: PanelRequestOptions } | null;
  /**
   * Options for the view reload that follows when neither `route` nor
   * `redirect` is set. The view reloads either way.
   */
  reload?: PanelRequestOptions;
  [key: string]: any;
}

/**
 * Modal interface for dialogs and drawers.
 *
 * Modals extend features with overlay-specific functionality
 * like history navigation, form handling, and open/close states.
 *
 * Modals include `dialog` and `drawer`.
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
 * // Close with history navigation
 * panel.drawer.goTo("previous-drawer-id");
 * ```
 *
 * @source panel/src/panel/modal.ts
 */
export interface PanelModal<
  TDefaults extends object = PanelFeatureDefaults & { id: string | null },
> extends PanelFeature<TDefaults> {
  /**
   * Unique ID for identifying nested modals.
   * Auto-generated via UUID if not provided.
   */
  id: string | null;

  isOpen: boolean;

  /**
   * Navigation history for nested modals.
   * Stores state snapshots for back navigation.
   */
  history: PanelHistory;

  /**
   * Quick access to `props.value`, or an empty object when unset.
   * Dialogs and drawers often contain forms.
   */
  readonly value: Record<string, any>;

  /** Cancels the modal by emitting `"cancel"` and closing. */
  cancel: () => Promise<void>;

  /**
   * Closes the modal, optionally by ID.
   * Reopens the previous modal when the history holds one.
   *
   * @param id - Specific modal ID, `true` to close all, or `undefined` for current
   */
  close: (id?: string | true) => Promise<void>;

  /**
   * Sets focus to the first focusable input or a specific input.
   *
   * @param input - Optional input name to focus
   */
  focus: (input?: string) => void;

  /**
   * Navigates to a specific modal in history by ID.
   *
   * @param id - Milestone ID to navigate to
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
   * as open once a component is set.
   *
   * @param modal - URL or state object
   * @param options - Request options
   * @returns The modal's state after opening
   */
  open: (
    modal: string | URL | Partial<TDefaults>,
    options?: PanelRequestOptions | PanelEventCallback,
  ) => Promise<TDefaults>;

  /**
   * Reloads the modal by closing it and re-opening its current URL.
   *
   * @param options - Request options
   * @returns `false` if no path exists, otherwise the `open()` result
   */
  reload: (options?: PanelRequestOptions) => Promise<TDefaults | false>;

  /**
   * Sets modal state, auto-generating an ID if not provided.
   *
   * @param state - State to set
   * @returns The complete state
   */
  set: (state: Partial<TDefaults>) => TDefaults;

  /**
   * Submits the modal form.
   * Does nothing while loading. Checks for a submit listener
   * first, then sends a POST request if a path exists.
   *
   * @param value - Form value (defaults to `props.value`)
   * @param options - Request options
   * @returns Response from listener, POST, or closes if no handler
   */
  submit: (value?: any, options?: PanelRequestOptions) => Promise<any>;

  /**
   * Handles success response after submission.
   * Shows notification, emits events, and handles redirect/reload.
   *
   * @param success - Success response object or message string
   * @returns The `success` listener's result if one is registered, `undefined` for a string message, otherwise the given response
   */
  success: (success: PanelModalSubmitResponse | string) => any;

  /**
   * Emits events specified in the success response.
   * Wraps single events in array and emits `"success"` unless disabled.
   *
   * @param state - Success response with event data
   */
  successEvents: (state: PanelModalSubmitResponse) => void;

  /**
   * Shows a success notification if response contains a message.
   *
   * @param state - Success response with optional message
   */
  successNotification: (state: PanelModalSubmitResponse) => void;

  /**
   * Handles redirects from success response.
   *
   * @param state - Success response with route/redirect
   * @returns `false` if no redirect, otherwise navigates
   */
  successRedirect: (state: PanelModalSubmitResponse) => false | Promise<any>;
}
// #endregion

// #region History

/**
 * A history milestone representing a saved modal state.
 * @source panel/src/helpers/history.ts
 */
export interface PanelHistoryMilestone {
  id: string;
  /** Additional state properties. */
  [key: string]: any;
}

/**
 * History interface for modal navigation.
 *
 * Tracks navigation milestones within modals to enable
 * back/forward navigation in nested dialogs and drawers.
 * Each milestone stores a complete state snapshot.
 *
 * @example
 * ```ts
 * // Navigate back in drawer history
 * const previous = panel.drawer.history.last();
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
   * Adds a state to history.
   * A state whose `id` is already stored is ignored, unless `replace` is
   * `true`.
   * The state must have an `id` property.
   *
   * @param state - State object with required `id`
   * @param replace - If `true`, replaces the last milestone instead of adding
   * @throws Error if state has no `id`
   */
  add: (state: PanelHistoryMilestone, replace?: boolean) => void;

  /**
   * Gets milestone at a specific index.
   * Supports negative indices (`-1` for last).
   *
   * @param index - Array index
   * @returns Milestone at index, or `undefined`
   */
  at: (index: number) => PanelHistoryMilestone | undefined;

  clear: () => void;

  /**
   * Gets milestone by ID, or all milestones if no ID provided.
   *
   * @param id - Milestone ID, or `null`/`undefined` for all
   * @returns Single milestone, all milestones, or `undefined`
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

  /**
   * Checks if a milestone exists in history.
   *
   * @param id - Milestone ID to check
   */
  has: (id: string) => boolean;

  /**
   * Returns `true` when more than one milestone is stored.
   */
  hasPrevious: () => boolean;

  /**
   * Gets the array index of a milestone.
   *
   * @param id - Milestone ID
   * @returns Index, or `-1` if not found
   */
  index: (id: string) => number;

  /** Checks if history has no milestones. */
  isEmpty: () => boolean;

  /** Gets the last milestone in history. */
  last: () => PanelHistoryMilestone | undefined;

  /**
   * Removes a milestone by ID, or the last milestone if no ID.
   *
   * @param id - Milestone ID, or `null` to remove last
   * @returns Updated milestones array
   */
  remove: (id?: string | null) => PanelHistoryMilestone[];

  /**
   * Removes the last milestone from history.
   *
   * @returns Updated milestones array
   */
  removeLast: () => PanelHistoryMilestone[];

  /**
   * Replaces a milestone at a specific index.
   * Index `-1` replaces the last milestone.
   *
   * @param index - Array index to replace
   * @param state - New state to insert
   */
  replace: (index: number, state: PanelHistoryMilestone) => void;
}
// #endregion

// #region Request Options

/**
 * Options for Panel API requests.
 * @source panel/src/panel/request.ts
 * @source panel/src/panel/feature.ts
 * @source panel/src/panel/panel.ts
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
  /**
   * Query parameters. Nested objects become `parent[child]` keys; `null`
   * removes the param, also one already in the URL.
   */
  query?: Record<string, any>;
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
   */
  language?: string | null;
  /**
   * CSRF token sent as the `x-csrf` header.
   * Defaults to the system token; `false` omits the header.
   */
  csrf?: string | false;
  /**
   * Globals sent as the `x-panel-globals` header.
   * Arrays are joined with commas; strings are forwarded as-is.
   */
  globals?: string | string[];
  /**
   * Referrer path sent as the `x-panel-referrer` header.
   * Defaults to the current view path; `false` omits the header.
   */
  referrer?: string | false;
}

/**
 * Extended options for refresh requests.
 * @source panel/src/panel/feature.ts
 */
export interface PanelRefreshOptions extends PanelRequestOptions {
  /** URL to refresh from (defaults to current URL). */
  url?: string | URL;
}
// #endregion

// #region Context & Notification Types

/**
 * Panel context indicating which layer is currently active.
 * Used to determine where notifications appear and which feature has focus.
 * @source panel/src/panel/panel.ts
 * @source panel/src/panel/notification.ts
 */
export type PanelContext = "view" | "dialog" | "drawer";

/**
 * Type of notification determining behavior and persistence.
 * Only `error` and `fatal` are written to `state.type`; `success()` and
 * `info()` shortcuts set `theme` (and `icon`) instead of `type`.
 * - `error`: Operation failed, persists until dismissed.
 * - `fatal`: Critical error, displayed in isolated iframe.
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
 * Kirby leaves `state.theme` untyped and matches the stylesheet by prefix, so
 * plain color names (`red`, `green`, ...) and suffixed variants such as
 * `positive-icon` are styled as well. Hence the open union.
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
