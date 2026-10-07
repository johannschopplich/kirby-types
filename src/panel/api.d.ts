/** Types for the Panel API client and its resource modules. */

// #region Request Types

/**
 * Options for `request()` and the verb helpers, passed on to `fetch()`.
 * @source panel/src/api/request.js
 * @source panel/src/api/index.js
 * @source panel/src/api/get.js
 * @source panel/src/api/post.js
 */
export interface PanelApiRequestOptions extends Omit<RequestInit, "headers"> {
  /**
   * Request body, sent as-is by `request()`. `post()`, `patch()`, and
   * `delete()` replace it with their JSON-encoded `data`.
   */
  body?: BodyInit | null;
  /**
   * Headers merged over the default `content-type`, `x-csrf`, and
   * `x-language` headers. A `null` value drops a default header.
   */
  headers?: Record<string, string | null>;
  /**
   * HTTP method. The verb helpers set their own. While method override is
   * on – its default (`api.methodOverride`) – any method other than `GET`
   * and `POST` goes out as `POST`, with the real method in the
   * `x-http-method-override` header. A request without a method goes out as
   * `GET`, or as `POST` while method override is on.
   */
  method?: string;
  /**
   * Whether to skip the loading indicator, like the `silent` argument of
   * `request()` and the verb helpers.
   * @since 5.0.0
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
 * Properties shared by the page, file, user, and site data the Panel API
 * returns. Extend it for model-specific properties.
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
  /** Model ID, `undefined` for the site. */
  id?: string;
  /** Title of a page or the site – files and users carry `name` instead. */
  title?: string;
  /** Content field values. */
  content: TContent;
}
// #endregion

// #region Auth API

/**
 * @source panel/src/api/auth.js
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
 * @source panel/src/api/auth.js
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

  /** Pings the server to keep the session alive. */
  ping: () => Promise<any>;

  /**
   * Gets the current user.
   *
   * @param query - Query parameters
   * @returns User data
   */
  user: (query?: Record<string, any>) => Promise<any>;

  /**
   * Verifies the code of the active login, password-reset, or 2FA challenge
   * and logs the user in.
   *
   * @param code - Verification code
   * @returns `{ code: 200, status: "ok", user }` with the logged-in user
   */
  verifyCode: (code: string) => Promise<any>;
}
// #endregion

// #region Files API

/**
 * `parent` is the API path of the file's parent model – `site`,
 * `pages/blog+post`, or `users/abc` – or `null` to address the file by its
 * UUID or permalink alone, or a site file by its filename.
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
   * Returns the API path of a file.
   *
   * @param parent - Parent path
   * @param filename - Filename
   * @param path - Additional path
   * @returns API path, relative to the API endpoint
   */
  url: (parent: string | null, filename: string, path?: string) => string;
}
// #endregion

// #region Languages API

/**
 * Language data for `create()` and `update()`.
 * @source src/Cms/Language.php
 */
export interface PanelApiLanguageData {
  code: string;
  name?: string;
  direction?: "ltr" | "rtl";
  default?: boolean;
  /** Locale, or a locale per category keyed by `LC_*` constant name. */
  locale?: string | Record<string, string>;
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
 * Methods for a multi-language site. Every call rejects unless the
 * `languages` option is enabled.
 *
 * @source panel/src/api/languages.js
 * @source config/api/routes.php
 * @source config/api/routes/languages.php
 */
export interface PanelApiLanguages {
  /**
   * Creates a new language.
   *
   * @param data - Language data
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
 * @source src/Cms/PageActions.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Content/Translations.php
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
   * @since 5.0.0
   */
  translations?: {
    /** Language code, the default language when omitted. */
    code?: string;
    content?: Record<string, any>;
    /** Slug of the page in this language. */
    slug?: string;
  }[];
  /** Whether the page starts as a draft, `true` by default – `false` creates an unlisted page. */
  draft?: boolean;
}

/**
 * @source panel/src/api/pages.js
 */
export interface PanelApiPageDuplicateOptions {
  /** Whether to copy the page's children, `false` by default. */
  children?: boolean;
  /** Whether to copy the page's files, `false` by default. */
  files?: boolean;
}

/**
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
   * @param section - Section name to narrow the blueprints to; when omitted, the templates the page can change to, its current one included
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
   * @param position - Sort position of a `listed` page
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
   * Searches a page's children.
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
   * @param slug - New slug, or `null` to append the duplicate suffix to the current one
   * @param options - Duplicate options
   * @returns Duplicated page
   */
  duplicate: (
    id: string,
    slug: string | null,
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
   * @returns Preview URL, or `null` when the page or the current user cannot preview it
   */
  preview: (id: string) => Promise<string | null>;

  /**
   * Searches direct children of a parent page (or the site root).
   *
   * @param parent - Parent page ID (`null` for root)
   * @param query - Search query
   * @returns Search results with only `id`, `title`, and `hasChildren` per page
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
   * Returns the API path of a page.
   *
   * @param id - Page ID
   * @param path - Additional path
   * @returns API path, relative to the API endpoint
   */
  url: (id: string | null, path?: string) => string;
}
// #endregion

// #region Roles API

/**
 * @source panel/src/api/roles.js
 * @source config/api/routes/roles.php
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
   * @param params - Query parameters; `canBe: "changed"` keeps the roles whose users the current user may change the role of, `canBe: "created"` the roles the current user may create users with; an admin gets every role.
   * @returns Wrapped Kirby collection response (`{ data, pagination }`)
   */
  list: (params?: Record<string, any>) => Promise<any>;
}
// #endregion

// #region Site API

/**
 * @source panel/src/api/site.js
 * @source config/api/routes/site.php
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
   * Searches the site's children.
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
   * Sends the content as a `POST`, which no `site` route accepts, so the call
   * rejects – send `panel.api.patch("site", data)` instead.
   *
   * @param data - Content data
   */
  update: (data: Record<string, any>) => Promise<any>;
}
// #endregion

// #region System API

/**
 * System installation data: the first user's create data, with a required
 * password.
 * @source config/api/routes/system.php
 * @source src/Cms/UserActions.php
 * @source panel/src/components/Views/Installation/InstallationView.vue
 */
export interface PanelApiSystemInstallData extends PanelApiUserCreateData {
  password: string;
  /**
   * Role of the first user, `default` when omitted, or `nobody` if no
   * `default` role exists – the Panel's installer sends `admin`.
   */
  role?: string;
}

/**
 * @source config/api/routes/system.php
 */
export interface PanelApiSystemRegisterData {
  license: string;
  /** Licensee email. */
  email: string;
}

/**
 * @source panel/src/api/system.js
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
   * Creates the first user on an uninstalled site and signs them in.
   *
   * @param data - Installation data
   * @returns Created user
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
 * @source panel/src/api/translations.js
 * @source config/api/routes/translations.php
 */
export interface PanelApiTranslations {
  /**
   * Gets a translation.
   *
   * @param locale - Translation code, e.g. `de` or `pt_BR`
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
 * @source src/Cms/UserActions.php
 * @source src/Cms/User.php
 * @source src/Cms/ModelWithContent.php
 */
export interface PanelApiUserCreateData {
  /** User ID, generated when omitted. */
  id?: string;
  email: string;
  password?: string;
  name?: string;
  /**
   * Role ID, `default` when omitted, or `nobody` if no `default` role
   * exists.
   */
  role?: string;
  /** Panel interface language code. */
  language?: string;
  content?: Record<string, any>;
  /**
   * Content per language on a multi-language site. Each translation's
   * content runs through the fields' save handlers.
   * @since 5.0.0
   */
  translations?: {
    /** Language code, the default language when omitted. */
    code?: string;
    content?: Record<string, any>;
  }[];
}

/**
 * @source panel/src/api/users.js
 * @source config/api/routes/users.php
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
   * Gets the blueprints accepted by a user's sections.
   *
   * @param id - User ID
   * @param section - Section name to narrow the blueprints to; all sections when omitted
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
   * @param language - Panel interface language code, e.g. `de` or `pt_BR`
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
   * @param data - User data
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
   * Queries users through the `users/search` endpoint.
   *
   * @param query - Search query
   * @returns Paginated users response
   */
  list: (query?: PanelApiSearchQuery) => Promise<any>;

  /**
   * Returns the roles the user can be switched to, as select options – only
   * their current role when the current user may not change it.
   *
   * @param id - User ID
   * @returns Array of role options shaped for select inputs
   */
  roles: (
    id: string,
  ) => Promise<{ info: string; text: string; value: string }[]>;

  /**
   * Searches users – the same request as `list()`.
   *
   * @param query - Search query
   * @returns Paginated users response
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
   * Returns the API path of a user.
   *
   * @param id - User ID (`null` for the users collection root)
   * @param path - Additional path
   * @returns API path, relative to the API endpoint
   */
  url: (id: string | null, path?: string) => string;
}
// #endregion

// #region Main API Interface

/**
 * Request methods for any Kirby API endpoint, plus wrappers for the ones the
 * Panel uses.
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
  /** CSRF token for requests, read live from the system. */
  readonly csrf: string;

  endpoint: string;

  /** @since 5.0.0 */
  methodOverride: boolean;

  /**
   * Interval ID of the auth heartbeat that pings every 5 minutes; scheduled
   * on setup and restarted after each request. The heartbeat skips the ping
   * while the Panel is offline.
   */
  ping: ReturnType<typeof setInterval>;

  /** Active request IDs. */
  requests: string[];

  /** Number of running requests (initialized to `0`, never updated at runtime). */
  running: number;

  /**
   * Current language code, or `null` when no language is active; `undefined`
   * until the first request sets it from the Panel's active language.
   */
  language: string | null | undefined;

  /**
   * Sends a request to the API. A model response resolves to its `data`, any
   * other response to the full JSON.
   *
   * @param path - API path
   * @param options - Request options
   * @param silent - Skip loading indicator
   * @returns Response JSON, or the model data of a model response
   */
  request: <T = any>(
    path: string,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a `GET` request.
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
   * Makes a `POST` request.
   *
   * @param path - API path
   * @param data - Request body
   * @param options - Request options
   * @param method - HTTP method, `POST` by default
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
   * Makes a `PATCH` request.
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
   * Makes a `DELETE` request.
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
