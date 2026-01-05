/**
 * Base type definitions for Kirby Panel.
 *
 * This module provides the foundational types for the Panel's
 * state management hierarchy: State → Feature → Modal.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/panel
 * @since 4.0.0
 */

// -----------------------------------------------------------------------------
// State Management
// -----------------------------------------------------------------------------

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
 * // State is used by: language, menu, notification, system, translation, user, drag, theme
 * const notification: PanelState<PanelNotificationDefaults> = panel.notification;
 * notification.set({ message: "Saved!" });
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/state.js
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
   * @returns The restored state object
   */
  reset: () => TDefaults;

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

  /**
   * Validates that the state is a plain object.
   * @throws Error if state is not an object
   */
  validateState: (state: any) => boolean;
}

// -----------------------------------------------------------------------------
// State Base Types (for extends clauses)
// -----------------------------------------------------------------------------

/**
 * Base interface providing common state methods.
 * Used as an intermediate type for features that extend State.
 * @internal
 */
export interface PanelStateBase {
  key: () => string;
  defaults: () => Record<string, any>;
  reset: () => Record<string, any>;
  set: (state: Record<string, any>) => Record<string, any>;
  state: () => Record<string, any>;
  validateState: (state: any) => boolean;
}

/**
 * Base interface for Features extending State with event listeners.
 * @internal
 */
export interface PanelFeatureBase extends PanelStateBase, PanelEventListeners {
  abortController: AbortController | null;
  component: string | null;
  isLoading: boolean;
  path: string | null;
  props: Record<string, any>;
  query: Record<string, any>;
  referrer: string | null;
  timestamp: number | null;
}

/**
 * Base interface for Modals extending Feature.
 * @internal
 */
export interface PanelModalBase extends PanelFeatureBase {
  id: string | null;
  isOpen: boolean;
  history: PanelHistory;
}

/**
 * Base interface for History implementations.
 * @internal
 */
export interface PanelHistoryBase {
  milestones: PanelHistoryMilestone[];
}

// -----------------------------------------------------------------------------
// Event Listeners
// -----------------------------------------------------------------------------

/**
 * Event callback function type.
 */
export type PanelEventCallback<TReturn = any> = (...args: any[]) => TReturn;

/**
 * Map of event names to their callback functions.
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
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/listeners.js
 */
export interface PanelEventListeners<TEvents extends string = string> {
  /**
   * Map of registered event listeners.
   * Keys are event names, values are callback functions.
   */
  on: PanelEventListenerMap<TEvents>;

  /**
   * Registers a single event listener.
   * Only functions are registered; other values are ignored.
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
  addEventListeners: (listeners: PanelEventListenerMap<TEvents>) => void;

  /**
   * Emits an event, calling the registered listener if any.
   *
   * @param event - Event name to emit
   * @param args - Arguments to pass to the listener
   * @returns Listener result, or a noop function if no listener exists
   */
  emit: <TReturn = any>(
    event: TEvents,
    ...args: any[]
  ) => TReturn | (() => void);

  /**
   * Checks if a listener is registered for an event.
   *
   * @param event - Event name to check
   * @returns True if a function is registered for this event
   */
  hasEventListener: (event: TEvents) => boolean;

  /**
   * Returns all registered listeners.
   */
  listeners: () => PanelEventListenerMap<TEvents>;
}

// -----------------------------------------------------------------------------
// Feature
// -----------------------------------------------------------------------------

/**
 * Default properties for Feature state.
 */
export interface PanelFeatureDefaults {
  abortController: AbortController | null;
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
 * Features include: view, dropdown, content
 *
 * @typeParam TDefaults - Shape of the feature's default state
 *
 * @example
 * ```ts
 * // Load a view
 * await panel.view.load("/pages/home");
 *
 * // Open a dropdown with options
 * await panel.dropdown.open("/dropdowns/pages/home/options");
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/feature.js
 */
export interface PanelFeature<TDefaults extends object = PanelFeatureDefaults>
  extends PanelState<TDefaults>, PanelEventListeners {
  /**
   * AbortController for canceling pending requests.
   * Created on each `load()` call to enable request cancellation.
   */
  abortController: AbortController | null;

  /**
   * Current Vue component name to render.
   * Set by the backend response.
   */
  component: string | null;

  /**
   * Whether the feature is currently loading data.
   * Set to true during `load()`, `get()`, and `post()` calls.
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

  /**
   * URL query parameters from the latest request.
   */
  query: Record<string, any>;

  /**
   * Previous path for navigation and redirects.
   */
  referrer: string | null;

  /**
   * Timestamp from the backend for cache invalidation.
   */
  timestamp: number | null;

  /**
   * Sends a GET request and returns the response.
   * Sets `isLoading` during the request.
   *
   * @param url - URL to fetch
   * @param options - Request options
   * @returns Response data or false on error
   */
  get: (
    url: string | URL,
    options?: PanelRequestOptions,
  ) => Promise<any | false>;

  /**
   * Loads a feature from the server and opens it.
   * Creates an AbortController and routes through `panel.open()`.
   *
   * @param url - Feature URL to load
   * @param options - Request options or submit handler function
   * @returns The feature's state after loading
   */
  load: (
    url: string | URL,
    options?: PanelRequestOptions | PanelEventCallback,
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
   * @returns Response data or false on error
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
   */
  reload: (options?: PanelRequestOptions) => Promise<void>;

  /**
   * Creates a full URL object for the current path and query.
   */
  url: () => URL;
}

// -----------------------------------------------------------------------------
// Modal
// -----------------------------------------------------------------------------

/**
 * Modal event types for dialogs and drawers.
 */
export type PanelModalEvent =
  | "cancel"
  | "close"
  | "closed"
  | "input"
  | "open"
  | "submit"
  | "success";

/**
 * Bound listener functions returned by `modal.listeners()`.
 */
export interface PanelModalListeners {
  cancel: () => Promise<void>;
  close: (id?: string | boolean) => Promise<void>;
  input: (value: any) => void;
  submit: (value?: any, options?: PanelRequestOptions) => Promise<any>;
  success: (response: PanelSuccessResponse) => void;
  /** Additional custom event listeners */
  [key: string]: ((...args: any[]) => any) | undefined;
}

/**
 * Success response from modal submission.
 */
export interface PanelSuccessResponse {
  /** Success message to display */
  message?: string;
  /** Events to emit (string or array of strings) */
  event?: string | string[];
  /** Whether to emit the global `"success"` event (default: true) */
  emit?: boolean;
  /** URL to navigate to */
  route?: string | { url: string; options?: PanelRequestOptions };
  /** Alternative to route */
  redirect?: string | { url: string; options?: PanelRequestOptions };
  /** Whether to reload the view */
  reload?: boolean | PanelRequestOptions;
  /** Additional properties */
  [key: string]: any;
}

/**
 * Modal interface for dialogs and drawers.
 *
 * Modals extend features with overlay-specific functionality
 * like history navigation, form handling, and open/close states.
 * They manage document overflow and scroll position when open.
 *
 * Modals include: dialog, drawer
 *
 * @typeParam TDefaults - Shape of the modal's default state
 *
 * @example
 * ```ts
 * // Open a dialog
 * await panel.dialog.open("/dialogs/pages/create", {
 *   on: {
 *     submit: (value) => console.log("Created:", value)
 *   }
 * });
 *
 * // Close with history navigation
 * panel.drawer.goTo("previous-drawer-id");
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/modal.js
 */
export interface PanelModal<
  TDefaults extends object = PanelFeatureDefaults & { id: string | null },
> extends PanelFeature<TDefaults> {
  /**
   * Unique ID for identifying nested modals.
   * Auto-generated via UUID if not provided.
   */
  id: string | null;

  /**
   * Whether the modal is currently visible.
   */
  isOpen: boolean;

  /**
   * Navigation history for nested modals.
   * Stores state snapshots for back navigation.
   */
  history: PanelHistory;

  /**
   * Quick access to `props.value`.
   * Dialogs and drawers often contain forms.
   */
  readonly value: any;

  /**
   * Cancels the modal by emitting 'cancel' and closing.
   */
  cancel: () => Promise<void>;

  /**
   * Closes the modal, optionally by ID.
   *
   * @param id - Specific modal ID, `true` to close all, or undefined for current
   * @returns Promise resolving to the previous modal's state, or void
   */
  close: (id?: string | boolean) => Promise<TDefaults | void>;

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
   * Updates the form value and emits 'input' event.
   * Uses Vue's `set()` for reactivity.
   *
   * @param value - New form value
   */
  input: (value: any) => void;

  /**
   * Returns bound listener functions for the Fiber component.
   * Includes: cancel, close, input, submit, success, plus custom listeners.
   */
  listeners: () => PanelModalListeners;

  /**
   * Opens the modal by URL or state object.
   * Closes any non-matching notifications and blocks document overflow.
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
   * Reloads the modal by closing and reopening at the same URL.
   *
   * @param options - Request options
   * @returns False if no path exists, otherwise void
   */
  reload: (options?: PanelRequestOptions) => Promise<void | false>;

  /**
   * Sets modal state, auto-generating an ID if not provided.
   *
   * @param state - State to set
   * @returns The complete state
   */
  set: (state: Partial<TDefaults>) => TDefaults;

  /**
   * Submits the modal form.
   * Checks for submit listener first, then sends POST if path exists.
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
   * @returns The success response
   */
  success: (success: PanelSuccessResponse | string) => PanelSuccessResponse;

  /**
   * Emits events specified in the success response.
   * Wraps single events in array and emits 'success' unless disabled.
   *
   * @param state - Success response with event data
   */
  successEvents: (state: PanelSuccessResponse) => void;

  /**
   * Shows a success notification if response contains a message.
   *
   * @param state - Success response with optional message
   */
  successNotification: (state: PanelSuccessResponse) => void;

  /**
   * Handles redirects from success response.
   *
   * @param state - Success response with route/redirect
   * @returns False if no redirect, otherwise navigates
   */
  successRedirect: (
    state: PanelSuccessResponse,
  ) => false | void | Promise<void>;
}

// -----------------------------------------------------------------------------
// History
// -----------------------------------------------------------------------------

/**
 * A history milestone representing a saved modal state.
 */
export interface PanelHistoryMilestone {
  /** Unique identifier for this milestone */
  id: string;
  /** Additional state properties */
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
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/panel/history.js
 */
export interface PanelHistory {
  /**
   * Array of stored state milestones.
   */
  milestones: PanelHistoryMilestone[];

  /**
   * Adds a state to history.
   * The state must have an `id` property.
   *
   * @param state - State object with required `id`
   * @param replace - If true, replaces the last milestone instead of adding
   * @throws Error if state has no `id`
   */
  add: (state: PanelHistoryMilestone, replace?: boolean) => void;

  /**
   * Gets milestone at a specific index.
   * Supports negative indices (-1 for last).
   *
   * @param index - Array index
   * @returns Milestone at index, or undefined
   */
  at: (index: number) => PanelHistoryMilestone | undefined;

  /**
   * Clears all milestones from history.
   */
  clear: () => void;

  /**
   * Gets milestone by ID, or all milestones if no ID provided.
   *
   * @param id - Milestone ID, or null/undefined for all
   * @returns Single milestone, all milestones, or undefined
   */
  get: (
    id?: string | null,
  ) => PanelHistoryMilestone | PanelHistoryMilestone[] | undefined;

  /**
   * Navigates to a milestone, removing all items after it.
   *
   * @param id - Milestone ID to navigate to
   * @returns The milestone, or undefined if not found
   */
  goto: (id: string) => PanelHistoryMilestone | undefined;

  /**
   * Checks if a milestone exists in history.
   *
   * @param id - Milestone ID to check
   */
  has: (id: string) => boolean;

  /**
   * Gets the array index of a milestone.
   *
   * @param id - Milestone ID
   * @returns Index, or -1 if not found
   */
  index: (id: string) => number;

  /**
   * Checks if history has no milestones.
   */
  isEmpty: () => boolean;

  /**
   * Gets the last milestone in history.
   */
  last: () => PanelHistoryMilestone | undefined;

  /**
   * Removes a milestone by ID, or the last milestone if no ID.
   *
   * @param id - Milestone ID, or null to remove last
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
   * Index -1 replaces the last milestone.
   *
   * @param index - Array index to replace
   * @param state - New state to insert
   */
  replace: (index: number, state: PanelHistoryMilestone) => void;
}

// -----------------------------------------------------------------------------
// Request Options
// -----------------------------------------------------------------------------

/**
 * Options for Panel API requests.
 */
export interface PanelRequestOptions {
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body for POST/PATCH */
  body?: any;
  /** Query parameters */
  query?: Record<string, string | number | boolean>;
  /** AbortSignal for request cancellation */
  signal?: AbortSignal;
  /**
   * If true, skips setting `isLoading` state.
   * Useful for background requests.
   */
  silent?: boolean;
  /**
   * Event listeners to attach to the feature.
   */
  on?: PanelEventListenerMap;
}

/**
 * Extended options for refresh requests.
 */
export interface PanelRefreshOptions extends PanelRequestOptions {
  /** URL to refresh from (defaults to current URL) */
  url?: string | URL;
}

// -----------------------------------------------------------------------------
// Context & Notification Types
// -----------------------------------------------------------------------------

/**
 * Panel context indicating which layer is currently active.
 * Used to determine where notifications appear and which feature has focus.
 */
export type PanelContext = "view" | "dialog" | "drawer";

/**
 * Context for notifications indicating where they should appear.
 * Matches the active editing layer.
 */
export type NotificationContext = "view" | "dialog" | "drawer";

/**
 * Type of notification determining behavior and persistence.
 * - `info`: General information, auto-closes
 * - `success`: Operation completed, auto-closes
 * - `error`: Operation failed, persists until dismissed
 * - `fatal`: Critical error, displayed in isolated iframe
 */
export type NotificationType = "error" | "success" | "fatal" | "info";

/**
 * Visual theme for notifications.
 * - `positive`: Green, for success
 * - `negative`: Red, for errors
 * - `info`: Blue, for information
 */
export type NotificationTheme = "positive" | "negative" | "info";
