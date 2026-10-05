/**
 * API type definitions for Kirby Panel.
 *
 * Provides types for the Panel API client and its resource modules.
 *
 * @since 4.0.0
 */

import type { PanelRequestOptions } from "./base";

// #region Request Types

/**
 * API request options.
 * @source panel/src/api/request.js
 * @source panel/src/api/index.js
 * @source panel/src/panel/request.ts
 */
export interface PanelApiRequestOptions extends PanelRequestOptions {
  /**
   * HTTP method. The verb helpers set their own; without one, the request
   * goes out as `POST` while method override is on, its default
   * (`api.methodOverride`, `api.methodOverwrite` before 5.0.0).
   */
  method?: string;
  /**
   * Whether to skip the loading indicator. Read since 5.0.0 – before,
   * only the `silent` argument of `request()` and the verb helpers counts.
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
 * @source src/Cms/Api.php
 * @source config/api/routes/users.php
 * @source config/api/routes/files.php
 * @source src/Cms/Collection.php
 */
export interface PanelApiSearchQuery {
  /** Search term, or a term with search options. */
  search?: string | { query?: string; options?: Record<string, any> };
  /** Maximum number of items searched – `paginate` limits the results. */
  limit?: number;
  /** Number of items skipped before searching. */
  offset?: number;
  /** Page size, or page and page size, to paginate the results by. */
  paginate?: number | PanelApiPagination;
  /** @deprecated Ignored by the search routes – pass `paginate` instead. */
  page?: number;
  /** @deprecated Ignored by the search routes – pass the term as `search` instead. */
  query?: string;
  /** @deprecated Ignored in the request body – Kirby reads `select` from the URL query only. */
  select?: string;
  /** @deprecated Ignored by the search routes. */
  sort?: string;
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
 * @source panel/src/api/request.js
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
 * @source panel/src/api/auth.js
 */
export interface PanelApiLoginData {
  email: string;
  password: string;
  /** Whether to keep the user logged in for an extended session. */
  remember?: boolean;
}

/**
 * Authentication API methods.
 *
 * @source panel/src/api/auth.js
 */
export interface PanelApiAuth {
  /**
   * Logs in a user.
   *
   * @param data - Login credentials
   * @returns User data
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
   * @returns Verification result
   */
  verifyCode: (code: string) => Promise<any>;
}
// #endregion

// #region Files API

/**
 * Files API methods.
 *
 * `parent` is the API path of the file's parent model – `site`, `pages/blog+post` or `users/abc` – or `null` to address the file by its id or UUID alone.
 *
 * @source panel/src/api/files.js
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
   * Converts file ID/UUID to API format.
   *
   * @param id - File ID or UUID
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

/** Language data for create/update. */
export interface PanelApiLanguageData {
  code: string;
  name?: string;
  /** Text direction. */
  direction?: "ltr" | "rtl";
  default?: boolean;
  /** Locale code. */
  locale?: string;
  /**
   * Slug conversion rules.
   * @deprecated Ignored on create and update – pass `slugs` instead.
   */
  rules?: Record<string, string>;
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
 * @source panel/src/api/languages.js
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
  update: (code: string, data: Partial<PanelApiLanguageData>) => Promise<any>;
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
  /** @deprecated Ignored by Kirby – set the title as `content.title` instead. */
  title?: string;
  template?: string;
  /** Initial content. */
  content?: Record<string, any>;
  /** Whether the page starts as a draft, `true` by default – `false` creates an unlisted page. */
  draft?: boolean;
  /** @deprecated Ignored by Kirby – new pages are drafts unless `draft` is `false`. */
  status?: "draft" | "unlisted" | "listed";
}

/**
 * Page duplicate options.
 * @source panel/src/api/pages.js
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
 * @source panel/src/api/pages.js
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
   * @param section - Section name
   * @returns Array of blueprints
   */
  blueprints: (parent: string, section?: string) => Promise<any[]>;

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
    options: PanelApiPageDuplicateOptions,
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
   * Converts page ID/UUID to API format.
   *
   * @param id - Page ID or UUID
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
 * @source panel/src/api/roles.js
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
 * @source panel/src/api/site.js
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
   * Updates the site content.
   *
   * @param data - Content data
   * @returns Updated site
   */
  update: (data: Record<string, any>) => Promise<any>;
}
// #endregion

// #region System API

/** System installation data. */
export interface PanelApiSystemInstallData {
  /** Admin email. */
  email: string;
  /** Admin password. */
  password: string;
  /** Admin language. */
  language?: string;
  name?: string;
  /** Role of the first user, `default` when omitted – the Panel's installer sends `admin`. */
  role?: string;
}

/** License registration data. */
export interface PanelApiSystemRegisterData {
  /** License key. */
  license: string;
  /** Licensee email. */
  email: string;
}

/**
 * System API methods.
 *
 * @source panel/src/api/system.js
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
 * @source panel/src/api/translations.js
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

/** User creation data. */
export interface PanelApiUserCreateData {
  /** User ID, generated when omitted. */
  id?: string;
  email: string;
  password?: string;
  name?: string;
  role?: string;
  language?: string;
  content?: Record<string, any>;
}

/**
 * Users API methods.
 *
 * @source panel/src/api/users.js
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
   * Gets available blueprints for users.
   *
   * @param id - User ID for context
   * @param section - Section name to filter by
   * @returns Array of blueprints
   */
  blueprints: (id: string, section?: string) => Promise<any[]>;

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
   * @param currentPassword - Current password for verification
   * @returns Updated user
   */
  changePassword: (
    id: string,
    password: string,
    currentPassword: string,
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
   * @param query - Query parameters
   * @returns Paginated users response
   */
  list: (query?: Record<string, any>) => Promise<any>;

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
 * @source panel/src/api/index.js
 * @source panel/src/api/request.js
 * @source panel/src/api/get.js
 * @source panel/src/api/post.js
 * @source panel/src/api/patch.js
 * @source panel/src/api/delete.js
 * @source panel/src/panel/request.ts
 */
export interface PanelApi {
  /** CSRF token for requests. */
  csrf: string;

  /** API base endpoint. */
  endpoint: string;

  /** Whether to use method override. */
  methodOverride: boolean;

  /** Interval ID of the auth heartbeat that pings every 5 minutes; scheduled on setup and restarted after each request. */
  ping: ReturnType<typeof setInterval> | null;

  /** Active request IDs. */
  requests: string[];

  /** Number of running requests (initialized to `0`, never updated at runtime). */
  running: number;

  /** Current language code, or `null` when no language is active; `undefined` until the first request sets it from the Panel's active language. */
  language: string | null | undefined;

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
