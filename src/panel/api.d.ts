/**
 * API type definitions for Kirby Panel.
 *
 * Provides types for the Panel API client and its resource modules.
 *
 * @see https://github.com/getkirby/kirby/tree/main/panel/src/api
 * @since 4.0.0
 */

import type { PanelRequestOptions } from "./base";

// -----------------------------------------------------------------------------
// Request Types
// -----------------------------------------------------------------------------

/**
 * API request options.
 */
export interface PanelApiRequestOptions extends PanelRequestOptions {
  /** Whether to skip loading indicator */
  silent?: boolean;
}

/**
 * Pagination query parameters.
 */
export interface PanelApiPagination {
  /** Page number */
  page?: number;
  /** Items per page */
  limit?: number;
}

/**
 * Search query parameters.
 */
export interface PanelApiSearchQuery extends PanelApiPagination {
  /** Search query string */
  query?: string;
  /** Field selection */
  select?: string;
  /** Sort field and direction */
  sort?: string;
}

// -----------------------------------------------------------------------------
// Auth API
// -----------------------------------------------------------------------------

/**
 * User authentication data.
 */
export interface PanelApiLoginData {
  /** User email */
  email: string;
  /** User password */
  password: string;
  /** Remember login */
  remember?: boolean;
}

/**
 * Authentication API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/auth.js
 */
export interface PanelApiAuth {
  /**
   * Logs in a user.
   *
   * @param data - Login credentials
   * @returns User data
   */
  login: (data: PanelApiLoginData) => Promise<unknown>;

  /**
   * Logs out the current user.
   */
  logout: () => Promise<void>;

  /**
   * Pings the server to keep session alive.
   */
  ping: () => Promise<void>;

  /**
   * Gets the current user.
   *
   * @param query - Query parameters
   * @param options - Request options
   * @returns User data
   */
  user: (
    query?: Record<string, unknown>,
    options?: PanelApiRequestOptions,
  ) => Promise<unknown>;

  /**
   * Verifies a 2FA code.
   *
   * @param code - Verification code
   * @param data - Additional data
   * @returns Verification result
   */
  verifyCode: (
    code: string,
    data?: Record<string, unknown>,
  ) => Promise<unknown>;
}

// -----------------------------------------------------------------------------
// Files API
// -----------------------------------------------------------------------------

/**
 * Files API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/files.js
 */
export interface PanelApiFiles {
  /**
   * Changes a file's name.
   *
   * @param parent - Parent page/site path
   * @param filename - Current filename
   * @param to - New name (without extension)
   * @returns Updated file data
   */
  changeName: (
    parent: string | null,
    filename: string,
    to: string,
  ) => Promise<unknown>;

  /**
   * Deletes a file.
   *
   * @param parent - Parent page/site path
   * @param filename - Filename to delete
   */
  delete: (parent: string | null, filename: string) => Promise<void>;

  /**
   * Gets a file.
   *
   * @param parent - Parent page/site path
   * @param filename - Filename
   * @param query - Query parameters
   * @returns File data
   */
  get: (
    parent: string | null,
    filename: string,
    query?: Record<string, unknown>,
  ) => Promise<unknown>;

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
    data: Record<string, unknown>,
  ) => Promise<unknown>;

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

// -----------------------------------------------------------------------------
// Languages API
// -----------------------------------------------------------------------------

/**
 * Language data for create/update.
 */
export interface PanelApiLanguageData {
  /** Language code */
  code: string;
  /** Language name */
  name?: string;
  /** Text direction */
  direction?: "ltr" | "rtl";
  /** Whether default language */
  default?: boolean;
  /** Locale code */
  locale?: string;
  /** Slug conversion rules */
  rules?: Record<string, string>;
}

/**
 * Languages API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/languages.js
 */
export interface PanelApiLanguages {
  /**
   * Creates a new language.
   *
   * @param code - Language code
   * @param data - Language data
   * @returns Created language
   */
  create: (code: string, data: PanelApiLanguageData) => Promise<unknown>;

  /**
   * Deletes a language.
   *
   * @param code - Language code
   */
  delete: (code: string) => Promise<void>;

  /**
   * Gets a language.
   *
   * @param code - Language code
   * @returns Language data
   */
  get: (code: string) => Promise<unknown>;

  /**
   * Lists all languages.
   *
   * @returns Array of languages
   */
  list: () => Promise<unknown[]>;

  /**
   * Updates a language.
   *
   * @param code - Language code
   * @param data - Updated data
   * @returns Updated language
   */
  update: (
    code: string,
    data: Partial<PanelApiLanguageData>,
  ) => Promise<unknown>;
}

// -----------------------------------------------------------------------------
// Pages API
// -----------------------------------------------------------------------------

/**
 * Page creation data.
 */
export interface PanelApiPageCreateData {
  /** Page slug */
  slug: string;
  /** Page title */
  title?: string;
  /** Page template */
  template?: string;
  /** Initial content */
  content?: Record<string, unknown>;
  /** Initial status */
  status?: "draft" | "unlisted" | "listed";
}

/**
 * Page duplicate options.
 */
export interface PanelApiPageDuplicateOptions {
  /** Copy children pages */
  children?: boolean;
  /** Copy files */
  files?: boolean;
}

/**
 * Pages API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/pages.js
 */
export interface PanelApiPages {
  /**
   * Gets a page's blueprint.
   *
   * @param parent - Page ID
   * @returns Blueprint data
   */
  blueprint: (parent: string) => Promise<unknown>;

  /**
   * Gets available blueprints for a page.
   *
   * @param parent - Page ID
   * @param section - Section name
   * @returns Array of blueprints
   */
  blueprints: (parent: string, section?: string) => Promise<unknown[]>;

  /**
   * Changes a page's slug.
   *
   * @param id - Page ID
   * @param slug - New slug
   * @returns Updated page
   */
  changeSlug: (id: string, slug: string) => Promise<unknown>;

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
  ) => Promise<unknown>;

  /**
   * Changes a page's template.
   *
   * @param id - Page ID
   * @param template - New template
   * @returns Updated page
   */
  changeTemplate: (id: string, template: string) => Promise<unknown>;

  /**
   * Changes a page's title.
   *
   * @param id - Page ID
   * @param title - New title
   * @returns Updated page
   */
  changeTitle: (id: string, title: string) => Promise<unknown>;

  /**
   * Searches children pages.
   *
   * @param id - Parent page ID
   * @param query - Search query
   * @returns Search results
   */
  children: (id: string, query?: PanelApiSearchQuery) => Promise<unknown>;

  /**
   * Creates a new page.
   *
   * @param parent - Parent page ID (null for root)
   * @param data - Page data
   * @returns Created page
   */
  create: (
    parent: string | null,
    data: PanelApiPageCreateData,
  ) => Promise<unknown>;

  /**
   * Deletes a page.
   *
   * @param id - Page ID
   * @param data - Delete options
   */
  delete: (id: string, data?: { force?: boolean }) => Promise<void>;

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
  ) => Promise<unknown>;

  /**
   * Gets a page.
   *
   * @param id - Page ID
   * @param query - Query parameters
   * @returns Page data
   */
  get: (id: string, query?: Record<string, unknown>) => Promise<unknown>;

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
  files: (id: string, query?: PanelApiSearchQuery) => Promise<unknown>;

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
   * @returns Preview URL
   */
  preview: (id: string) => Promise<string>;

  /**
   * Searches pages.
   *
   * @param parent - Parent page ID (null for root)
   * @param query - Search query
   * @returns Search results
   */
  search: (
    parent: string | null,
    query?: PanelApiSearchQuery,
  ) => Promise<unknown>;

  /**
   * Updates a page's content.
   *
   * @param id - Page ID
   * @param data - Content data
   * @returns Updated page
   */
  update: (id: string, data: Record<string, unknown>) => Promise<unknown>;

  /**
   * Gets API URL for a page.
   *
   * @param id - Page ID
   * @param path - Additional path
   * @returns API URL
   */
  url: (id: string | null, path?: string) => string;
}

// -----------------------------------------------------------------------------
// Roles API
// -----------------------------------------------------------------------------

/**
 * Roles API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/roles.js
 */
export interface PanelApiRoles {
  /**
   * Gets a role.
   *
   * @param name - Role name
   * @returns Role data
   */
  get: (name: string) => Promise<unknown>;

  /**
   * Lists available roles.
   *
   * @param user - User ID for context
   * @param query - Query parameters
   * @returns Array of roles
   */
  list: (user?: string, query?: Record<string, unknown>) => Promise<unknown[]>;
}

// -----------------------------------------------------------------------------
// Site API
// -----------------------------------------------------------------------------

/**
 * Site API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/site.js
 */
export interface PanelApiSite {
  /**
   * Gets the site blueprint.
   *
   * @returns Blueprint data
   */
  blueprint: () => Promise<unknown>;

  /**
   * Gets available blueprints for the site.
   *
   * @returns Array of blueprints
   */
  blueprints: () => Promise<unknown[]>;

  /**
   * Changes the site title.
   *
   * @param title - New title
   * @param language - Language code
   * @returns Updated site
   */
  changeTitle: (title: string, language?: string) => Promise<unknown>;

  /**
   * Searches site children.
   *
   * @param query - Search query
   * @param options - Query options
   * @returns Search results
   */
  children: (
    query?: PanelApiSearchQuery,
    options?: Record<string, unknown>,
  ) => Promise<unknown>;

  /**
   * Gets the site.
   *
   * @param query - Query parameters
   * @returns Site data
   */
  get: (query?: Record<string, unknown>) => Promise<unknown>;

  /**
   * Updates the site content.
   *
   * @param data - Content data
   * @param language - Language code
   * @returns Updated site
   */
  update: (
    data: Record<string, unknown>,
    language?: string,
  ) => Promise<unknown>;
}

// -----------------------------------------------------------------------------
// System API
// -----------------------------------------------------------------------------

/**
 * System installation data.
 */
export interface PanelApiSystemInstallData {
  /** Admin email */
  email: string;
  /** Admin password */
  password: string;
  /** Admin language */
  language?: string;
}

/**
 * License registration data.
 */
export interface PanelApiSystemRegisterData {
  /** License key */
  license: string;
  /** Licensee email */
  email: string;
}

/**
 * System API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/system.js
 */
export interface PanelApiSystem {
  /**
   * Gets system information.
   *
   * @param query - Query parameters
   * @returns System data
   */
  get: (query?: Record<string, unknown>) => Promise<unknown>;

  /**
   * Installs Kirby with initial user.
   *
   * @param data - Installation data
   * @param query - Query parameters
   * @returns Installation result
   */
  install: (
    data: PanelApiSystemInstallData,
    query?: Record<string, unknown>,
  ) => Promise<unknown>;

  /**
   * Registers a license.
   *
   * @param data - Registration data
   * @param query - Query parameters
   * @returns Registration result
   */
  register: (
    data: PanelApiSystemRegisterData,
    query?: Record<string, unknown>,
  ) => Promise<unknown>;
}

// -----------------------------------------------------------------------------
// Translations API
// -----------------------------------------------------------------------------

/**
 * Translations API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/translations.js
 */
export interface PanelApiTranslations {
  /**
   * Gets a translation.
   *
   * @param code - Translation code
   * @returns Translation data
   */
  get: (code: string) => Promise<unknown>;

  /**
   * Lists all translations.
   *
   * @returns Array of translations
   */
  list: () => Promise<unknown[]>;
}

// -----------------------------------------------------------------------------
// Users API
// -----------------------------------------------------------------------------

/**
 * User creation data.
 */
export interface PanelApiUserCreateData {
  /** User email */
  email: string;
  /** User password */
  password?: string;
  /** User name */
  name?: string;
  /** User role */
  role?: string;
  /** User language */
  language?: string;
}

/**
 * Users API methods.
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/users.js
 */
export interface PanelApiUsers {
  /**
   * Gets a user's blueprint.
   *
   * @param id - User ID
   * @returns Blueprint data
   */
  blueprint: (id: string) => Promise<unknown>;

  /**
   * Gets available blueprints for users.
   *
   * @param user - User ID for context
   * @param query - Query parameters
   * @returns Array of blueprints
   */
  blueprints: (
    user?: string,
    query?: Record<string, unknown>,
  ) => Promise<unknown[]>;

  /**
   * Changes a user's email.
   *
   * @param id - User ID
   * @param email - New email
   * @returns Updated user
   */
  changeEmail: (id: string, email: string) => Promise<unknown>;

  /**
   * Changes a user's language.
   *
   * @param id - User ID
   * @param language - New language code
   * @returns Updated user
   */
  changeLanguage: (id: string, language: string) => Promise<unknown>;

  /**
   * Changes a user's name.
   *
   * @param id - User ID
   * @param name - New name
   * @returns Updated user
   */
  changeName: (id: string, name: string) => Promise<unknown>;

  /**
   * Changes a user's password.
   *
   * @param id - User ID
   * @param password - New password
   * @param confirmation - Password confirmation
   * @returns Updated user
   */
  changePassword: (
    id: string,
    password: string,
    confirmation: string,
  ) => Promise<unknown>;

  /**
   * Changes a user's role.
   *
   * @param id - User ID
   * @param role - New role
   * @returns Updated user
   */
  changeRole: (id: string, role: string) => Promise<unknown>;

  /**
   * Creates a new user.
   *
   * @param id - User ID (usually email)
   * @param data - User data
   * @returns Created user
   */
  create: (id: string, data: PanelApiUserCreateData) => Promise<unknown>;

  /**
   * Deletes a user.
   *
   * @param id - User ID
   */
  delete: (id: string) => Promise<void>;

  /**
   * Deletes a user's avatar.
   *
   * @param id - User ID
   */
  deleteAvatar: (id: string) => Promise<void>;

  /**
   * Gets a user.
   *
   * @param id - User ID
   * @param query - Query parameters
   * @returns User data
   */
  get: (id: string, query?: Record<string, unknown>) => Promise<unknown>;

  /**
   * Gets Panel link for a user.
   *
   * @param id - User ID
   * @param path - Additional path
   * @returns Panel link
   */
  link: (id: string, path?: string) => string;

  /**
   * Lists all users.
   *
   * @param query - Query parameters
   * @returns Array of users
   */
  list: (query?: Record<string, unknown>) => Promise<unknown[]>;

  /**
   * Gets roles available to a user.
   *
   * @param id - User ID
   * @returns Array of roles
   */
  roles: (id: string) => Promise<unknown[]>;

  /**
   * Searches users.
   *
   * @param query - Search query
   * @param options - Query options
   * @returns Search results
   */
  search: (
    query?: PanelApiSearchQuery,
    options?: Record<string, unknown>,
  ) => Promise<unknown>;

  /**
   * Updates a user's content.
   *
   * @param id - User ID
   * @param data - Content data
   * @returns Updated user
   */
  update: (id: string, data: Record<string, unknown>) => Promise<unknown>;

  /**
   * Gets API URL for a user.
   *
   * @param id - User ID
   * @param path - Additional path
   * @returns API URL
   */
  url: (id: string, path?: string) => string;
}

// -----------------------------------------------------------------------------
// Main API Interface
// -----------------------------------------------------------------------------

/**
 * Panel API client.
 *
 * Provides typed access to all Kirby API endpoints.
 *
 * @example
 * ```ts
 * // Get a page
 * const page = await panel.api.pages.get('home');
 *
 * // Create a new page
 * await panel.api.pages.create('blog', {
 *   slug: 'new-post',
 *   title: 'New Post',
 *   template: 'article'
 * });
 * ```
 *
 * @see https://github.com/getkirby/kirby/blob/main/panel/src/api/index.js
 */
export interface PanelApi {
  /** CSRF token for requests */
  csrf: string;

  /** API base endpoint */
  endpoint: string;

  /** Whether to use method override */
  methodOverride: boolean;

  /** Ping interval ID */
  ping: ReturnType<typeof setInterval> | null;

  /** Active request IDs */
  requests: string[];

  /** Number of running requests */
  running: number;

  /** Current language code */
  language: string;

  /**
   * Makes a raw API request.
   *
   * @param path - API path
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  request: (
    path: string,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<unknown>;

  /**
   * Makes a GET request.
   *
   * @param path - API path
   * @param query - Query parameters
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  get: (
    path: string,
    query?: Record<string, unknown>,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<unknown>;

  /**
   * Makes a POST request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @param upload - Whether uploading file
   * @returns Response data
   */
  post: (
    path: string,
    data?: unknown,
    options?: PanelApiRequestOptions,
    silent?: boolean,
    upload?: boolean,
  ) => Promise<unknown>;

  /**
   * Makes a PATCH request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  patch: (
    path: string,
    data?: unknown,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<unknown>;

  /**
   * Makes a DELETE request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response data
   */
  delete: (
    path: string,
    data?: unknown,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<unknown>;

  /** Authentication methods */
  auth: PanelApiAuth;

  /** Files API */
  files: PanelApiFiles;

  /** Languages API */
  languages: PanelApiLanguages;

  /** Pages API */
  pages: PanelApiPages;

  /** Roles API */
  roles: PanelApiRoles;

  /** Site API */
  site: PanelApiSite;

  /** System API */
  system: PanelApiSystem;

  /** Translations API */
  translations: PanelApiTranslations;

  /** Users API */
  users: PanelApiUsers;
}
