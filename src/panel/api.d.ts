/**
 * API type definitions for Kirby Panel.
 *
 * Provides types for the Panel API client and its resource modules.
 */

import type { PanelRequestOptions } from "./base";
import type { Panel } from "./index";

// #region Request Types

/**
 * API request options.
 * @source panel/src/api/index.ts
 */
export interface PanelApiRequestOptions extends Omit<
  PanelRequestOptions,
  "csrf" | "on"
> {
  /**
   * HTTP method, `GET` when omitted. The verb helpers set their own. While
   * method override is on – its default (`api.methodOverride`) – any method
   * other than `GET` and `POST` goes out as `POST`, with the real method in
   * the `x-http-method-override` header.
   */
  method?: string;
  /**
   * Referrer path sent as the `x-panel-referrer` header. API requests send
   * none unless one is passed.
   */
  referrer?: string | false;
  /**
   * Whether to skip the loading indicator, like the `silent` argument of
   * `request()` and the verb helpers.
   */
  silent?: boolean;
}

/**
 * Page and page size of a paginated collection.
 * @source src/Api/Collection.php
 * @source src/Toolkit/Pagination.php
 */
export interface PanelApiPagination {
  page?: number;
  /** Items per page. */
  limit?: number;
}

/**
 * Search request body.
 * @source src/Api/Api.php
 * @source config/api/routes/users.php
 * @source config/api/routes/files.php
 * @source src/Cms/Collection.php
 * @source src/Toolkit/Collection.php
 * @source config/components.php
 */
export interface PanelApiSearchQuery {
  /**
   * Search term, or a term with search options: an options object, or the
   * fields to search as a `|`-separated string.
   */
  search?: string | { query?: string; options?: string | Record<string, any> };
  /** Maximum number of items searched – `paginate` limits the results. */
  limit?: number;
  /** Number of items skipped before searching. */
  offset?: number;
  /** Page size, or page and page size, to paginate the results by. */
  paginate?: number | PanelApiPagination;
}
// #endregion

// #region Model Data Types

/**
 * Base model data returned by Panel API.
 *
 * Common properties shared by page, file, user, and site responses.
 * Extend this type for model-specific properties.
 *
 * @example
 * ```ts
 * // Use directly for generic model handling
 * const model: PanelModelData = await panel.api.get(panel.view.path);
 * console.log(model.title, model.content);
 *
 * // Extend for specific content types
 * interface ArticleData extends PanelModelData<{ text: string; author: string }> {
 *   status: "draft" | "unlisted" | "listed";
 * }
 * ```
 * @source panel/src/api/index.ts
 * @source config/api/models/Page.php
 * @source config/api/models/Site.php
 * @source config/api/models/File.php
 * @source config/api/models/User.php
 */
export interface PanelModelData<TContent = Record<string, any>> {
  /** Model identifier (page id, file id, user id; undefined for site). */
  id?: string;
  /** Model title – only pages and the site carry one, files and users carry `name` instead. */
  title?: string;
  /** Content field values. */
  content: TContent;
}
// #endregion

// #region Auth API

/**
 * User authentication data.
 * @source panel/src/api/auth.ts
 * @source config/api/routes/auth.php
 */
export interface PanelApiLoginData {
  email: string;
  /**
   * Password for a password login. An empty, `null`, or missing password
   * starts a login code or password-reset challenge when one of those
   * methods is enabled, and fails otherwise.
   */
  password?: string | null;
  /** Whether to keep the user logged in for an extended session. */
  remember?: boolean;
}

/**
 * Authentication API methods.
 *
 * @source panel/src/api/auth.ts
 * @source config/api/routes/auth.php
 */
export interface PanelApiAuth {
  /**
   * Logs in a user.
   *
   * @param data - Login credentials
   * @returns `{ code: 200, status: "ok", user }` once logged in, or `{ code: 200, status: "ok", challenge }` when a code, password-reset, or 2FA challenge starts
   */
  login: (data: PanelApiLoginData) => Promise<any>;

  /** Logs out the current user. */
  logout: () => Promise<any>;

  /** Pings the server to keep session alive. */
  ping: () => Promise<any>;

  /**
   * Gets the current user.
   *
   * @param query - Query parameters
   * @returns User data
   */
  user: (query?: Record<string, any>) => Promise<any>;

  /**
   * Verifies a 2FA code.
   *
   * @param code - Verification code
   * @returns `{ code: 200, status: "ok", user }` with the logged-in user
   */
  verifyCode: (code: string) => Promise<any>;
}
// #endregion

// #region Files API

/**
 * Files API methods.
 *
 * `parent` is the API path of the file's parent model – `site`, `pages/blog+post` or `users/abc` – or `null` to address the file by its UUID or permalink alone, or a site file by its filename.
 *
 * @source panel/src/api/files.ts
 */
export interface PanelApiFiles {
  /**
   * Changes a file's name.
   *
   * @param parent - Parent API path
   * @param filename - Current filename
   * @param to - New name (without extension)
   * @returns Updated file data
   */
  changeName: (
    parent: string | null,
    filename: string,
    to: string,
  ) => Promise<any>;

  /**
   * Deletes a file.
   *
   * @param parent - Parent API path
   * @param filename - Filename to delete
   */
  delete: (parent: string | null, filename: string) => Promise<any>;

  /**
   * Gets a file.
   *
   * @param parent - Parent API path
   * @param filename - Filename
   * @param query - Query parameters
   * @returns File data
   */
  get: (
    parent: string | null,
    filename: string,
    query?: Record<string, any>,
  ) => Promise<any>;

  /**
   * Converts a `file://` UUID or a `/@/file/` permalink to `@<uuid>`, and
   * returns any other value unchanged.
   *
   * @param id - Filename, UUID, or permalink
   * @returns API-formatted ID
   */
  id: (id: string) => string;

  /**
   * Gets Panel link for a file.
   *
   * @param parent - Parent path
   * @param filename - Filename
   * @param path - Additional path
   * @returns Panel link
   */
  link: (parent: string | null, filename: string, path?: string) => string;

  /**
   * Updates a file's content.
   *
   * @param parent - Parent path
   * @param filename - Filename
   * @param data - Content data
   * @returns Updated file data
   */
  update: (
    parent: string | null,
    filename: string,
    data: Record<string, any>,
  ) => Promise<any>;

  /**
   * Gets API URL for a file.
   *
   * @param parent - Parent path
   * @param filename - Filename
   * @param path - Additional path
   * @returns API URL
   */
  url: (parent: string | null, filename: string, path?: string) => string;
}
// #endregion

// #region Languages API

/**
 * Language data for create/update.
 * @source src/Cms/Language.php
 */
export interface PanelApiLanguageData {
  code: string;
  name?: string;
  /** Text direction. */
  direction?: "ltr" | "rtl";
  default?: boolean;
  /** Locale code. */
  locale?: string;
  /** Custom slug conversion rules, merged over the locale's default rules. */
  slugs?: Record<string, string>;
  /** SmartyPants options for this language. */
  smartypants?: Record<string, any>;
  /** Language variables keyed by translation key. */
  translations?: Record<string, any>;
  /** Custom URL for this language, absolute or relative to the site URL. */
  url?: string;
}

/**
 * Languages API methods.
 *
 * @source panel/src/api/languages.ts
 */
export interface PanelApiLanguages {
  /**
   * Creates a new language.
   *
   * @param data - Language data (including code)
   * @returns Created language
   */
  create: (data: PanelApiLanguageData) => Promise<any>;

  /**
   * Deletes a language.
   *
   * @param code - Language code
   */
  delete: (code: string) => Promise<any>;

  /**
   * Gets a language.
   *
   * @param code - Language code
   * @returns Language data
   */
  get: (code: string) => Promise<any>;

  /**
   * Lists all languages.
   *
   * @returns Wrapped Kirby collection response (`{ data, pagination }`)
   */
  list: () => Promise<any>;

  /**
   * Updates a language.
   *
   * @param code - Language code
   * @param data - Updated data
   * @returns Updated language
   */
  update: (
    code: string,
    data: Partial<Omit<PanelApiLanguageData, "code">>,
  ) => Promise<any>;
}
// #endregion

// #region Pages API

/**
 * Page creation data.
 * @source src/Cms/PageActions.php
 */
export interface PanelApiPageCreateData {
  /** Page slug, derived from `content.title` when omitted. */
  slug?: string;
  template?: string;
  /** Initial content. */
  content?: Record<string, any>;
  /**
   * Content per language on a multi-language site. Each translation's
   * content runs through the fields' save handlers.
   */
  translations?: { code: string; content?: Record<string, any> }[];
  /** Whether the page starts as a draft, `true` by default – `false` creates an unlisted page. */
  draft?: boolean;
}

/**
 * Page duplicate options.
 * @source panel/src/api/pages.ts
 */
export interface PanelApiPageDuplicateOptions {
  /** Whether to copy the page's children, `false` by default. */
  children?: boolean;
  /** Whether to copy the page's files, `false` by default. */
  files?: boolean;
}

/**
 * Pages API methods.
 *
 * @source panel/src/api/pages.ts
 */
export interface PanelApiPages {
  /**
   * Gets a page's blueprint.
   *
   * @param parent - Page ID
   * @returns Blueprint data
   */
  blueprint: (parent: string) => Promise<any>;

  /**
   * Gets available blueprints for a page.
   *
   * @param parent - Page ID
   * @param field - Field name to narrow the blueprints to; when omitted, the templates the page can change to, its current one included
   * @returns Array of blueprints
   */
  blueprints: (parent: string, field?: string) => Promise<any[]>;

  /**
   * Changes a page's slug.
   *
   * @param id - Page ID
   * @param slug - New slug
   * @returns Updated page
   */
  changeSlug: (id: string, slug: string) => Promise<any>;

  /**
   * Changes a page's status.
   *
   * @param id - Page ID
   * @param status - New status
   * @param position - Sort position (for listed)
   * @returns Updated page
   */
  changeStatus: (
    id: string,
    status: "draft" | "unlisted" | "listed",
    position?: number,
  ) => Promise<any>;

  /**
   * Changes a page's template.
   *
   * @param id - Page ID
   * @param template - New template
   * @returns Updated page
   */
  changeTemplate: (id: string, template: string) => Promise<any>;

  /**
   * Changes a page's title.
   *
   * @param id - Page ID
   * @param title - New title
   * @returns Updated page
   */
  changeTitle: (id: string, title: string) => Promise<any>;

  /**
   * Searches children pages.
   *
   * @param id - Parent page ID
   * @param query - Search query
   * @returns Search results
   */
  children: (id: string, query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Creates a new page.
   *
   * @param parent - Parent page ID (`null` or `/` for the site root)
   * @param data - Page data
   * @returns Created page
   */
  create: (parent: string | null, data: PanelApiPageCreateData) => Promise<any>;

  /**
   * Deletes a page.
   *
   * @param id - Page ID
   * @param data - Delete options
   * @param data.force - Force delete even if the page has children or drafts
   */
  delete: (id: string, data?: { force?: boolean }) => Promise<any>;

  /**
   * Duplicates a page.
   *
   * @param id - Page ID
   * @param slug - New slug
   * @param options - Duplicate options
   * @returns Duplicated page
   */
  duplicate: (
    id: string,
    slug: string,
    options?: PanelApiPageDuplicateOptions,
  ) => Promise<any>;

  /**
   * Gets a page.
   *
   * @param id - Page ID
   * @param query - Query parameters
   * @returns Page data
   */
  get: (id: string, query?: Record<string, any>) => Promise<any>;

  /**
   * Converts a page ID to its API form (slashes become `+`), and a `page://`
   * UUID or a `/@/page/` permalink, with or without a language prefix, to
   * `@<uuid>`.
   *
   * @param id - Page ID, UUID, or permalink
   * @returns API-formatted ID
   */
  id: (id: string) => string;

  /**
   * Searches files in a page.
   *
   * @param id - Page ID
   * @param query - Search query
   * @returns Search results
   */
  files: (id: string, query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Gets Panel link for a page.
   *
   * @param id - Page ID
   * @returns Panel link
   */
  link: (id: string) => string;

  /**
   * Gets a page's preview URL.
   *
   * @param id - Page ID
   * @returns Preview URL, or `null` when preview is disabled for the page
   */
  preview: (id: string) => Promise<string | null>;

  /**
   * Searches direct children of a parent page (or the site root).
   *
   * @param parent - Parent page ID (`null` for root)
   * @param query - Search query
   * @returns Search results
   */
  search: (parent: string | null, query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Updates a page's content.
   *
   * @param id - Page ID
   * @param data - Content data
   * @returns Updated page
   */
  update: (id: string, data: Record<string, any>) => Promise<any>;

  /**
   * Gets API URL for a page.
   *
   * @param id - Page ID
   * @param path - Additional path
   * @returns API URL
   */
  url: (id: string | null, path?: string) => string;
}
// #endregion

// #region Roles API

/**
 * Roles API methods.
 *
 * @source panel/src/api/roles.ts
 */
export interface PanelApiRoles {
  /**
   * Gets a role.
   *
   * @param name - Role name
   * @returns Role data
   */
  get: (name: string) => Promise<any>;

  /**
   * Lists available roles.
   *
   * @param params - Query parameters; `canBe: "changed"` or `canBe: "created"` keeps only the roles a user may be switched to or created with
   * @returns Wrapped Kirby collection response (`{ data, pagination }`)
   */
  list: (params?: Record<string, any>) => Promise<any>;
}
// #endregion

// #region Site API

/**
 * Site API methods.
 *
 * @source panel/src/api/site.ts
 */
export interface PanelApiSite {
  /**
   * Gets the site blueprint.
   *
   * @returns Blueprint data
   */
  blueprint: () => Promise<any>;

  /**
   * Gets available blueprints for the site.
   *
   * @returns Array of blueprints
   */
  blueprints: () => Promise<any[]>;

  /**
   * Changes the site title.
   *
   * @param title - New title
   * @returns Updated site
   */
  changeTitle: (title: string) => Promise<any>;

  /**
   * Searches site children.
   *
   * @param query - Search query
   * @returns Search results
   */
  children: (query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Gets the site.
   *
   * @param query - Query parameters, `{ view: "panel" }` when omitted
   * @returns Site data
   */
  get: (query?: Record<string, any>) => Promise<any>;

  /**
   * Meant to update the site content, but sends a `POST` that no `site`
   * route accepts, so the call rejects – send `panel.api.patch("site", data)`
   * instead.
   *
   * @param data - Content data
   */
  update: (data: Record<string, any>) => Promise<any>;
}
// #endregion

// #region System API

/**
 * System installation data.
 * @source config/api/routes/system.php
 * @source src/Cms/UserActions.php
 * @source src/Guards/UserValidators.php
 * @source panel/src/components/Views/Installation/InstallationView.vue
 */
export interface PanelApiSystemInstallData {
  /** Email of the first user. */
  email: string;
  /** Password of the first user. */
  password: string;
  /** Interface language of the first user. */
  language?: string;
  name?: string;
  /** Role of the first user, which has to be `admin`. */
  role: "admin";
}

/**
 * License registration data.
 * @source config/api/routes/system.php
 */
export interface PanelApiSystemRegisterData {
  /** License key. */
  license: string;
  /** Licensee email. */
  email: string;
}

/**
 * System API methods.
 *
 * @source panel/src/api/system.ts
 * @source config/api/routes/system.php
 */
export interface PanelApiSystem {
  /**
   * Gets system information.
   *
   * @param query - Query parameters, `{ view: "panel" }` when omitted
   * @returns System data
   */
  get: (query?: Record<string, any>) => Promise<any>;

  /**
   * Installs Kirby with initial user.
   *
   * @param data - Installation data
   * @returns The newly created admin user
   */
  install: (data: PanelApiSystemInstallData) => Promise<any>;

  /**
   * Registers a license.
   *
   * @param data - Registration data
   * @returns `{ status: "ok", message: "ok", code: 200 }` once the license is registered
   */
  register: (data: PanelApiSystemRegisterData) => Promise<any>;
}
// #endregion

// #region Translations API

/**
 * Translations API methods.
 *
 * @source panel/src/api/translations.ts
 * @source config/api/routes/translations.php
 */
export interface PanelApiTranslations {
  /**
   * Gets a translation.
   *
   * @param locale - Locale code
   * @returns Translation data
   */
  get: (locale: string) => Promise<any>;

  /**
   * Lists all translations.
   *
   * @returns Wrapped Kirby collection response (`{ data, pagination }`)
   */
  list: () => Promise<any>;
}
// #endregion

// #region Users API

/**
 * User creation data.
 * @source src/Cms/UserActions.php
 * @source src/Cms/User.php
 */
export interface PanelApiUserCreateData {
  /** User ID, generated when omitted. */
  id?: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  language?: string;
  content?: Record<string, any>;
  /**
   * Content per language on a multi-language site. Each translation's
   * content runs through the fields' save handlers.
   */
  translations?: { code: string; content?: Record<string, any> }[];
}

/**
 * Users API methods.
 *
 * @source panel/src/api/users.ts
 */
export interface PanelApiUsers {
  /**
   * Gets a user's blueprint.
   *
   * @param id - User ID
   * @returns Blueprint data
   */
  blueprint: (id: string) => Promise<any>;

  /**
   * Gets the blueprints accepted by a user's fields.
   *
   * @param id - User ID
   * @param field - Field name to narrow the blueprints to; all fields when omitted
   * @returns Array of blueprints
   */
  blueprints: (id: string, field?: string) => Promise<any[]>;

  /**
   * Changes a user's email.
   *
   * @param id - User ID
   * @param email - New email
   * @returns Updated user
   */
  changeEmail: (id: string, email: string) => Promise<any>;

  /**
   * Changes a user's language.
   *
   * @param id - User ID
   * @param language - New language code
   * @returns Updated user
   */
  changeLanguage: (id: string, language: string) => Promise<any>;

  /**
   * Changes a user's name.
   *
   * @param id - User ID
   * @param name - New name
   * @returns Updated user
   */
  changeName: (id: string, name: string) => Promise<any>;

  /**
   * Changes a user's password.
   *
   * @param id - User ID
   * @param password - New password
   * @param currentPassword - Password of the acting user, required unless they reset their own password after a password-reset login
   * @returns Updated user
   */
  changePassword: (
    id: string,
    password: string,
    currentPassword?: string,
  ) => Promise<any>;

  /**
   * Changes a user's role.
   *
   * @param id - User ID
   * @param role - New role
   * @returns Updated user
   */
  changeRole: (id: string, role: string) => Promise<any>;

  /**
   * Creates a new user.
   *
   * @param data - User data; `email` is required
   * @returns Created user
   */
  create: (data: PanelApiUserCreateData) => Promise<any>;

  /**
   * Deletes a user.
   *
   * @param id - User ID
   */
  delete: (id: string) => Promise<any>;

  /**
   * Deletes a user's avatar.
   *
   * @param id - User ID
   */
  deleteAvatar: (id: string) => Promise<any>;

  /**
   * Gets a user.
   *
   * @param id - User ID
   * @param query - Query parameters
   * @returns User data
   */
  get: (id: string, query?: Record<string, any>) => Promise<any>;

  /**
   * Gets Panel link for a user.
   *
   * @param id - User ID
   * @param path - Additional path
   * @returns Panel link
   */
  link: (id: string, path?: string) => string;

  /**
   * Queries users via the users/search endpoint.
   *
   * @param query - Search query
   * @returns Paginated users response
   */
  list: (query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Gets roles available to a user.
   *
   * @param id - User ID
   * @returns Array of role options shaped for select inputs
   */
  roles: (
    id: string,
  ) => Promise<{ info: string; text: string; value: string }[]>;

  /**
   * Searches users.
   *
   * @param query - Search query
   * @returns Search results
   */
  search: (query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Updates a user's content.
   *
   * @param id - User ID
   * @param data - Content data
   * @returns Updated user
   */
  update: (id: string, data: Record<string, any>) => Promise<any>;

  /**
   * Gets API URL for a user.
   *
   * @param id - User ID (`null` for the users collection root)
   * @param path - Additional path
   * @returns API URL
   */
  url: (id: string | null, path?: string) => string;
}
// #endregion

// #region Main API Interface

/**
 * Panel API client.
 *
 * Provides typed access to all Kirby API endpoints.
 *
 * @example
 * ```ts
 * // Get a page
 * const page = await panel.api.pages.get("home");
 *
 * // Create a new page
 * await panel.api.pages.create("blog", {
 *   slug: "new-post",
 *   template: "article",
 *   content: { title: "New Post" }
 * });
 * ```
 *
 * @source panel/src/api/index.ts
 * @source panel/src/panel/request.ts
 */
export interface PanelApi {
  csrf: string;
  endpoint: string;
  methodOverride: boolean;

  /** Panel instance the client belongs to, the same object as `window.panel`. */
  panel: Panel;

  /** Interval ID of the auth heartbeat that `ping()` schedules. */
  pingId: ReturnType<typeof setInterval> | undefined;

  /**
   * Clears any existing heartbeat and schedules a new auth ping every 5 minutes.
   * Runs on setup and after each request. The heartbeat skips the ping while
   * the Panel is offline.
   */
  ping: () => void;

  /** Number of API requests in flight. The loading indicator stops once it drops to `0`. */
  requests: number;

  /** Current language code, or `null` when no language is active (set from the Panel's active language on construction and refreshed on each request). */
  language: string | null;

  /**
   * Makes a raw API request.
   *
   * @param path - API path
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  request: <T = any>(
    path: string,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a GET request.
   *
   * @param path - API path
   * @param query - Query parameters
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  get: <T = any>(
    path: string,
    query?: Record<string, any>,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a POST request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param method - HTTP method to send (defaults to `POST`; `patch` and `delete` delegate here to set `PATCH`/`DELETE`)
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  post: <T = any>(
    path: string,
    data?: any,
    options?: PanelApiRequestOptions,
    method?: string,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a PATCH request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  patch: <T = any>(
    path: string,
    data?: any,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a DELETE request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  delete: <T = any>(
    path: string,
    data?: any,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  auth: PanelApiAuth;

  files: PanelApiFiles;

  languages: PanelApiLanguages;

  pages: PanelApiPages;

  roles: PanelApiRoles;

  site: PanelApiSite;

  system: PanelApiSystem;

  translations: PanelApiTranslations;

  users: PanelApiUsers;
}
// #endregion
