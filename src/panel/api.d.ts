/** Types for the Panel API client and its resource modules. */

import type { PanelRequestOptions } from "./base";
import type { Panel, PanelLanguageInfo, PanelPermissions } from "./index";

// #region Request Types

/**
 * @source panel/src/api/index.ts
 * @source panel/src/panel/request.ts
 */
export interface PanelApiRequestOptions extends Omit<
  PanelRequestOptions,
  "csrf" | "external" | "on"
> {
  /**
   * Content language code sent as the `x-language` header, the current
   * content language when omitted or empty.
   */
  language?: string | null;
  /** HTTP method, `GET` when omitted; the verb helpers overwrite it. */
  method?: string;
  /**
   * Referrer path sent as the `x-panel-referrer` header. API requests send
   * none unless one is passed.
   */
  referrer?: string | false;
  /** Whether to skip the loading indicator. */
  silent?: boolean;
}

/**
 * Page and page size of a paginated collection.
 * @source src/Api/Collection.php
 * @source src/Toolkit/Pagination.php
 * @source src/Cms/Pagination.php
 * @source src/Api/Api.php
 */
export interface PanelApiPagination {
  /**
   * Page number, `1` when omitted; a page past either end returns the first or
   * last page.
   */
  page?: number;
  /**
   * Items per page, the `pagination.limit` option when omitted (`20` unless
   * configured).
   */
  limit?: number;
}

/**
 * @source src/Api/Collection.php
 */
export interface PanelApiCollectionResponse<T = Record<string, any>> {
  code: 200;
  data: T[];
  pagination: { page: number; total: number; offset: number; limit: number };
  status: "ok";
  type: "collection";
}

/**
 * Response of an action that has nothing to return but success.
 * @source src/Api/Api.php
 */
export interface PanelApiOkResponse {
  status: "ok";
  message: "ok";
  code: 200;
}

/**
 * @source config/components.php
 */
export interface PanelApiSearchOptions {
  /**
   * Fields to search, compared case-insensitively; every field when omitted
   * or empty.
   */
  fields?: string[];
  /**
   * Minimum length of the term and of each word searched, `2` when omitted;
   * a shorter term finds nothing.
   */
  minlength?: number;
  /**
   * Score multiplier per lowercase field name, `1` for any field left out;
   * a page's `id` and `title` default to `64`.
   */
  score?: Record<string, number>;
  /** Words dropped from the term before searching. */
  stopwords?: string[];
  /** Whether to match whole words only, `false` when omitted. */
  words?: boolean;
  /** Any other option a custom `search` component reads. */
  [key: string]: any;
}

/**
 * Search request body.
 * @source src/Api/Api.php
 * @source src/Api/Collection.php
 * @source config/api/routes/users.php
 * @source config/api/routes/files.php
 * @source src/Cms/Collection.php
 * @source src/Toolkit/Collection.php
 * @source config/components.php
 */
export interface PanelApiSearchQuery {
  /**
   * Search term, or a term with search options: an options object, or the
   * fields to search as a `|`-separated string. An empty string returns every
   * item.
   */
  search?:
    string | { query?: string; options?: string | PanelApiSearchOptions };
  /** Maximum number of items searched – `paginate` limits the results. */
  limit?: number;
  /** Number of items skipped before searching. */
  offset?: number;
  /**
   * Page size, or page and page size, to paginate the results by; the first
   * page of `100` items when omitted.
   */
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
 * @source panel/src/api/index.ts
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
  content: TContent;
}
// #endregion

// #region Blueprint Types

/**
 * @source src/Blueprint/Normalizer.php
 * @source src/Blueprint/Tab.php
 */
export interface PanelBlueprintColumn<TField = Record<string, any>> {
  width: string;
  /**
   * Field definitions from the blueprint in an API response; in a view's
   * `tab`, the resolved field props keyed by the lowercase field name.
   */
  fields: Record<string, TField>;
  /** Any other key the blueprint sets on the column. */
  [key: string]: any;
}

/**
 * @source src/Blueprint/Tab.php
 * @source src/Blueprint/Tabs.php
 */
export interface PanelBlueprintTab<TField = Record<string, any>> {
  label: string;
  /** `null` when the blueprint omits an icon. */
  icon: string | null;
  /**
   * List of columns, or an object keyed by column name when the blueprint
   * names its columns.
   */
  columns:
    | PanelBlueprintColumn<TField>[]
    | Record<string, PanelBlueprintColumn<TField>>;
  link: string;
  name: string;
  /** Any other key the blueprint sets on the tab. */
  [key: string]: any;
}

/**
 * Blueprint of the site or a user.
 * @source config/api/models/SiteBlueprint.php
 * @source config/api/models/UserBlueprint.php
 * @source src/Blueprint/Blueprint.php
 */
export interface PanelApiBlueprint {
  name: string;
  options: Record<string, any>;
  tabs: PanelBlueprintTab[];
  title: string;
}

/**
 * @source src/Blueprint/PageBlueprint.php
 */
export interface PanelApiPageBlueprintStatus {
  label: string;
  text: string | null;
  icon: string;
  theme: string;
  /** Any other key the blueprint sets on the status. */
  [key: string]: any;
}

/**
 * @source config/api/models/PageBlueprint.php
 * @source src/Blueprint/PageBlueprint.php
 */
export interface PanelApiPageBlueprint extends PanelApiBlueprint {
  /** Sorting mode – `default`, `zero`, `date`, or a query for the number. */
  num: string;
  /**
   * Preview URL from the blueprint, else whether the page may be
   * previewed.
   */
  preview: string | boolean;
  /**
   * Status options of the page; `draft` is missing for the home and error
   * page.
   */
  status: {
    draft?: PanelApiPageBlueprintStatus;
    unlisted?: PanelApiPageBlueprintStatus;
    listed?: PanelApiPageBlueprintStatus;
  };
}
// #endregion

// #region Auth API

/**
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
 * @source panel/src/api/auth.ts
 * @source config/api/routes/auth.php
 * @source src/Api/Api.php
 * @source src/Auth/Status.php
 */
export interface PanelApiAuth {
  /**
   * Logs in a user.
   *
   * @param data - Login credentials
   * @returns `user` once logged in, or the `challenge` type when a code, password-reset, or 2FA challenge starts – `null` when no challenge type is enabled
   */
  login: (
    data: PanelApiLoginData,
  ) => Promise<
    | { code: 200; status: "ok"; user: Record<string, any> }
    | { code: 200; status: "ok"; challenge: string | null }
  >;

  /** Logs out the current user. */
  logout: () => Promise<PanelApiOkResponse>;

  /** Pings the server to keep the session alive. */
  ping: () => Promise<PanelApiOkResponse>;

  /** Gets the current user. */
  user: (query?: Record<string, any>) => Promise<any>;

  /**
   * Verifies the code of the active login, password-reset, or 2FA challenge
   * and logs the user in.
   *
   * @param code - Verification code
   */
  verifyCode: (
    code: string,
  ) => Promise<{ code: 200; status: "ok"; user: Record<string, any> }>;
}
// #endregion

// #region Files API

/**
 * `parent` is the API path of the file's parent model – `site`, `account`,
 * `pages/blog+post`, or `users/abc` – or `null` to address the file by its
 * UUID or permalink alone, or a site file by its filename.
 *
 * @source panel/src/api/files.ts
 * @source config/api/routes/files.php
 * @source src/Cms/Find.php
 * @source src/Cms/App.php
 * @source src/Cms/FileActions.php
 */
export interface PanelApiFiles {
  /**
   * @param filename - Current filename
   * @param to - New name (without extension)
   * @returns Updated file data
   */
  changeName: (
    parent: string | null,
    filename: string,
    to: string,
  ) => Promise<any>;

  delete: (
    parent: string | null,
    filename: string,
  ) => Promise<PanelApiOkResponse>;

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
   */
  id: (id: string) => string;

  /**
   * Gets Panel link for a file.
   *
   * @param path - Additional path
   */
  link: (parent: string | null, filename: string, path?: string) => string;

  /**
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
 * @source src/Toolkit/Locale.php
 */
export interface PanelApiLanguageCreateData {
  /** Language code, slugified on create. */
  code: string;
  /** Display name, the code when omitted. */
  name?: string;
  /** Text direction, `ltr` when omitted. */
  direction?: "ltr" | "rtl";
  /**
   * Whether the language is the default; the first language created always
   * is.
   */
  default?: boolean;
  /** Locale, or a locale per category keyed by `LC_*` constant name. */
  locale?: string | Record<string, string>;
  /** Language variables keyed by translation key. */
  translations?: Record<string, any>;
  /** Custom URL for this language, absolute or relative to the site URL. */
  url?: string;
}

/**
 * @source config/api/models/Language.php
 */
export type PanelApiLanguage = Omit<PanelLanguageInfo, "hasCustomDomain">;

/**
 * Methods for a multi-language site. Every call rejects unless the
 * `languages` option is enabled.
 *
 * @source panel/src/api/languages.ts
 * @source config/api/routes.php
 * @source config/api/routes/languages.php
 * @source src/Cms/Language.php
 */
export interface PanelApiLanguages {
  create: (data: PanelApiLanguageCreateData) => Promise<PanelApiLanguage>;

  /**
   * @param code - Language code
   */
  delete: (code: string) => Promise<PanelApiOkResponse>;

  /**
   * @param code - Language code
   */
  get: (code: string) => Promise<PanelApiLanguage>;

  list: () => Promise<PanelApiCollectionResponse<PanelApiLanguage>>;

  /**
   * @param code - Language code
   */
  update: (
    code: string,
    data: Partial<Omit<PanelApiLanguageCreateData, "code">>,
  ) => Promise<PanelApiLanguage>;
}
// #endregion

// #region Pages API

/**
 * @source config/api/models/Page.php
 * @source src/Cms/Page.php
 * @source src/Uuid/Uuids.php
 */
export interface PanelApiPageCompact {
  id: string;
  /** Sorting number, `null` for an unlisted page or a draft. */
  num: number | null;
  title: string;
  url: string;
  /** `null` when the `content.uuid` option is `false`. */
  uuid: string | null;
}

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
   */
  translations?: {
    /** Language code, the default language when omitted. */
    code?: string;
    content?: Record<string, any>;
    /** Slug of the page in this language. */
    slug?: string;
  }[];
  /** Whether the page starts as a draft, `true` when omitted – `false` creates an unlisted page. */
  draft?: boolean;
}

/**
 * @source panel/src/api/pages.ts
 */
export interface PanelApiPageDuplicateOptions {
  /** Whether to copy the page's children, `false` when omitted. */
  children?: boolean;
  /** Whether to copy the page's files, `false` when omitted. */
  files?: boolean;
}

/**
 * @source panel/src/api/pages.ts
 * @source config/api/routes/pages.php
 * @source config/api/collections.php
 * @source src/Cms/Page.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Form/Field/PageListField.php
 * @source src/Cms/PageActions.php
 * @source src/Guards/PageValidators.php
 */
export interface PanelApiPages {
  /**
   * @param parent - Page ID
   */
  blueprint: (parent: string) => Promise<PanelApiPageBlueprint>;

  /**
   * Gets available blueprints for a page.
   *
   * @param parent - Page ID
   * @param field - Field name to narrow the blueprints to (default: the
   *   templates the page can change to, its current one included)
   */
  blueprints: (
    parent: string,
    field?: string,
  ) => Promise<{ name: string; title: string }[]>;

  /**
   * @param id - Page ID
   * @returns Updated page
   */
  changeSlug: (id: string, slug: string) => Promise<any>;

  /**
   * @param id - Page ID
   * @param position - Sort position of a `listed` page
   * @returns Updated page
   */
  changeStatus: (
    id: string,
    status: "draft" | "unlisted" | "listed",
    position?: number,
  ) => Promise<any>;

  /**
   * @param id - Page ID
   * @returns Updated page
   */
  changeTemplate: (id: string, template: string) => Promise<any>;

  /**
   * @param id - Page ID
   * @returns Updated page
   */
  changeTitle: (id: string, title: string) => Promise<any>;

  /**
   * Searches a page's children.
   *
   * @param id - Parent page ID
   */
  children: (
    id: string,
    query?: PanelApiSearchQuery,
  ) => Promise<PanelApiCollectionResponse<PanelApiPageCompact>>;

  /**
   * @param parent - Parent page ID (`null` or `/` for the site root)
   * @returns Created page
   */
  create: (parent: string | null, data: PanelApiPageCreateData) => Promise<any>;

  /**
   * @param id - Page ID
   * @param data - Delete options
   * @param data.force - Force delete even if the page has children or drafts
   */
  delete: (
    id: string,
    data?: { force?: boolean },
  ) => Promise<PanelApiOkResponse>;

  /**
   * @param id - Page ID
   * @param slug - New slug, or `null` to append the duplicate suffix to the current one
   * @returns Duplicated page
   */
  duplicate: (
    id: string,
    slug: string | null,
    options?: PanelApiPageDuplicateOptions,
  ) => Promise<any>;

  /**
   * @param id - Page ID
   */
  get: (id: string, query?: Record<string, any>) => Promise<any>;

  /**
   * Converts a page ID to its API form (slashes become `+`), and a `page://`
   * UUID or a `/@/page/` permalink, with or without a language prefix, to
   * `@<uuid>`.
   *
   * @param id - Page ID, UUID, or permalink
   */
  id: (id: string) => string;

  /**
   * Searches files in a page.
   *
   * @param id - Page ID
   */
  files: (
    id: string,
    query?: PanelApiSearchQuery,
  ) => Promise<PanelApiCollectionResponse>;

  /**
   * Gets Panel link for a page.
   *
   * @param id - Page ID, never a UUID or permalink
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
   */
  search: (
    parent: string | null,
    query?: PanelApiSearchQuery,
  ) => Promise<
    PanelApiCollectionResponse<{
      id: string;
      title: string;
      hasChildren: boolean;
    }>
  >;

  /**
   * @param id - Page ID
   * @param data - Content data
   * @returns Updated page
   */
  update: (id: string, data: Record<string, any>) => Promise<any>;

  /**
   * Returns the API path of a page.
   *
   * @param id - Page ID (`null` for the `pages` collection), never a UUID or permalink
   * @param path - Additional path
   * @returns API path, relative to the API endpoint
   */
  url: (id: string | null, path?: string) => string;
}
// #endregion

// #region Roles API

/**
 * @source config/api/models/Role.php
 * @source src/Cms/Role.php
 */
export interface PanelApiRoleCompact {
  description: string | null;
  name: string;
  title: string;
}

/**
 * @source config/api/models/Role.php
 * @source src/Cms/Permissions.php
 */
export interface PanelApiRole extends PanelApiRoleCompact {
  permissions: PanelPermissions;
}

/**
 * Only the roles the current user may access; `get()` rejects any other as
 * not found.
 *
 * @source panel/src/api/roles.ts
 * @source config/api/routes/roles.php
 * @source config/api/collections.php
 * @source src/Api/Collection.php
 * @source src/Cms/Roles.php
 * @source src/Cms/Find.php
 */
export interface PanelApiRoles {
  get: (name: string) => Promise<PanelApiRole>;

  list: (params?: {
    /**
     * `"changed"` keeps the roles whose users the current user may move to
     * another role, `"created"` the roles the current user may create a user
     * with; an admin gets every role.
     */
    canBe?: "changed" | "created";
    page?: number;
    /** Items per page, `100` when omitted. */
    limit?: number;
  }) => Promise<PanelApiCollectionResponse<PanelApiRoleCompact>>;
}
// #endregion

// #region Site API

/**
 * @source panel/src/api/site.ts
 * @source config/api/routes/site.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Form/Field/PageListField.php
 * @source config/api/collections.php
 * @source src/Http/Router.php
 */
export interface PanelApiSite {
  blueprint: () => Promise<PanelApiBlueprint>;

  /** Gets the page blueprints the site's `pagelist` fields accept. */
  blueprints: () => Promise<{ name: string; title: string }[]>;

  /**
   * @returns Updated site
   */
  changeTitle: (title: string) => Promise<any>;

  /** Searches the site's children. */
  children: (
    query?: PanelApiSearchQuery,
  ) => Promise<PanelApiCollectionResponse<PanelApiPageCompact>>;

  /**
   * @param query - Query parameters (default: `{ view: "panel" }`)
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
 * password and the `admin` role.
 * @source config/api/routes/system.php
 * @source src/Cms/UserActions.php
 * @source src/Guards/UserValidators.php
 * @source panel/src/components/Views/Installation/InstallationView.vue
 */
export interface PanelApiSystemInstallData extends PanelApiUserCreateData {
  password: string;
  role: "admin";
}

/**
 * @source config/api/routes/system.php
 * @source src/Cms/License.php
 */
export interface PanelApiSystemRegisterData {
  license: string;
  /** Licensee email. */
  email: string;
}

/**
 * System data in the `panel` view.
 * @source config/api/models/System.php
 * @source config/api/models/License.php
 * @source src/Cms/System.php
 * @source src/Cms/LicenseStatus.php
 */
export interface PanelApiSystemPanel {
  /** ASCII character replacements for slugs. */
  ascii: Record<string, string>;
  /** Code of the default Panel interface language. */
  defaultLanguage: string;
  isInstalled: boolean;
  /** Whether the Panel runs in a local development environment. */
  isLocal: boolean;
  /** Whether every folder in `requirements` is writable. */
  isOk: boolean;
  /** The `panel.kirbytext` option. */
  kirbytext: boolean;
  /** Languages of a multi-language site, empty otherwise. */
  languages: PanelApiLanguage[];
  /** License data; each key is `null` without access to the system area. */
  license: {
    /**
     * License code, masked for a non-admin; `null` for a free license or
     * without a license file.
     */
    code: string | null;
    status:
      | "active"
      | "acknowledged"
      | "demo"
      | "inactive"
      | "legacy"
      | "missing"
      | "unknown"
      | null;
    /** Label of the license type. */
    type: string | null;
  };
  /**
   * Locale of each interface translation, keyed by translation code
   * (e.g. `{ de: "de_DE" }`).
   */
  locales: Record<string, string>;
  multilang: boolean;
  /** Whether each of these folders is writable. */
  requirements: {
    accounts: boolean;
    content: boolean;
    media: boolean;
    sessions: boolean;
  };
  /** Site title, or the site blueprint's title when the site has none. */
  site: string;
  /** Slug character replacements of the current language. */
  slugs: Record<string, string>;
  /** Site title as stored, `null` when unset. */
  title: string | null;
  translation: PanelApiTranslation;
  /** Current user, `null` for a guest. */
  user: Record<string, any> | null;
  /** Kirby version, `null` without access to the system area. */
  version: string | null;
}

/**
 * @source panel/src/api/system.ts
 * @source config/api/routes/system.php
 * @source src/Api/Api.php
 * @source src/Cms/License.php
 */
export interface PanelApiSystem {
  /**
   * Gets the system data in the `panel` view, or in the view or selection a
   * query names.
   */
  get: {
    (): Promise<PanelApiSystemPanel>;
    (query?: Record<string, any>): Promise<any>;
  };

  /**
   * Creates the first user and logs them in. Rejects once the Panel is
   * installed or when it cannot be installed.
   *
   * @returns Created user
   */
  install: (data: PanelApiSystemInstallData) => Promise<any>;

  /**
   * Registers a license. Rejects without access to the system area, or for
   * an invalid license code or email.
   */
  register: (data: PanelApiSystemRegisterData) => Promise<PanelApiOkResponse>;
}
// #endregion

// #region Translations API

/**
 * @source config/api/models/Translation.php
 * @source src/Cms/Translation.php
 */
export interface PanelApiTranslation {
  author: string;
  /** Translation strings by key, the English strings filling the gaps. */
  data: Record<string, string>;
  direction: "ltr" | "rtl";
  /** Translation code. */
  id: string;
  name: string;
}

/**
 * @source panel/src/api/translations.ts
 * @source config/api/routes/translations.php
 * @source src/Api/Api.php
 * @source config/api/collections.php
 */
export interface PanelApiTranslations {
  /**
   * Gets a translation. Rejects when no translation has the code.
   *
   * @param locale - Translation code, e.g. `de` or `pt_BR`
   */
  get: (locale: string) => Promise<PanelApiTranslation>;

  list: () => Promise<
    PanelApiCollectionResponse<
      Pick<PanelApiTranslation, "direction" | "id" | "name">
    >
  >;
}
// #endregion

// #region Users API

/**
 * @source config/api/models/User.php
 * @source config/api/models/File.php
 * @source config/api/models/FileVersion.php
 * @source src/Cms/User.php
 * @source src/Cms/FileModifications.php
 * @source src/Uuid/Uuids.php
 */
export interface PanelApiUserCompact {
  /**
   * Cropped to a 512px square, or the original file when it cannot be
   * resized.
   */
  avatar: {
    filename: string;
    id: string;
    type: string | null;
    url: string;
  } | null;
  email: string | null;
  id: string;
  /** Panel language code. */
  language: string;
  name: string | null;
  /** `null` when the logged-in user may not access the role. */
  role: PanelApiRoleCompact | null;
  /** The name, or the email when the user has no name. */
  username: string | null;
  /** `null` when the `content.uuid` option is `false`. */
  uuid: string | null;
}

/**
 * @source src/Cms/UserActions.php
 * @source src/Cms/User.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Guards/UserValidators.php
 * @source src/Auth/Passwords.php
 */
export interface PanelApiUserCreateData {
  /** User ID, generated when omitted. */
  id?: string;
  email: string;
  /**
   * Password, checked against the `auth.passwords` policy; a user created
   * without one has no password.
   */
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
   */
  translations?: {
    /** Language code, the default language when omitted. */
    code?: string;
    content?: Record<string, any>;
  }[];
}

/**
 * @source panel/src/api/users.ts
 * @source config/api/routes/users.php
 * @source config/api/collections.php
 * @source src/Cms/ModelWithContent.php
 * @source src/Form/Field/PageListField.php
 * @source src/Cms/User.php
 * @source src/Cms/UserActions.php
 */
export interface PanelApiUsers {
  /**
   * @param id - User ID
   */
  blueprint: (id: string) => Promise<PanelApiBlueprint>;

  /**
   * Gets the page blueprints a user's `pagelist` fields accept.
   *
   * @param id - User ID
   * @param field - Field name to narrow the blueprints to (default: all
   *   fields)
   */
  blueprints: (
    id: string,
    field?: string,
  ) => Promise<{ name: string; title: string }[]>;

  /**
   * @param id - User ID
   * @returns Updated user
   */
  changeEmail: (id: string, email: string) => Promise<any>;

  /**
   * @param id - User ID
   * @param language - Panel interface language code, e.g. `de` or `pt_BR`
   * @returns Updated user
   */
  changeLanguage: (id: string, language: string) => Promise<any>;

  /**
   * @param id - User ID
   * @returns Updated user
   */
  changeName: (id: string, name: string) => Promise<any>;

  /**
   * @param id - User ID
   * @param currentPassword - Password of the acting user, required unless they reset their own password after a password-reset login
   * @returns Updated user
   */
  changePassword: (
    id: string,
    password: string,
    currentPassword?: string,
  ) => Promise<any>;

  /**
   * @param id - User ID
   * @returns Updated user
   */
  changeRole: (id: string, role: string) => Promise<any>;

  /**
   * @returns Created user
   */
  create: (data: PanelApiUserCreateData) => Promise<any>;

  /**
   * @param id - User ID
   */
  delete: (id: string) => Promise<PanelApiOkResponse>;

  /**
   * @param id - User ID
   */
  deleteAvatar: (id: string) => Promise<PanelApiOkResponse>;

  /**
   * @param id - User ID
   */
  get: (id: string, query?: Record<string, any>) => Promise<any>;

  /**
   * Gets Panel link for a user.
   *
   * @param id - User ID
   * @param path - Additional path
   */
  link: (id: string, path?: string) => string;

  list: (
    query?: PanelApiSearchQuery,
  ) => Promise<PanelApiCollectionResponse<PanelApiUserCompact>>;

  /**
   * Returns the roles the user can be switched to, as select options – only
   * their current role when the current user may not change it, and none
   * when that role is not accessible to them.
   *
   * @param id - User ID
   */
  roles: (
    id: string,
  ) => Promise<{ info: string; text: string; value: string }[]>;

  search: (
    query?: PanelApiSearchQuery,
  ) => Promise<PanelApiCollectionResponse<PanelApiUserCompact>>;

  /**
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
 * @source panel/src/api/index.ts
 * @source panel/src/panel/request.ts
 * @source src/Panel/State.php
 */
export interface PanelApi {
  /** CSRF token for requests, read live from the system. */
  readonly csrf: string;

  /** API URL, without a trailing slash. */
  endpoint: string;
  /**
   * Whether requests other than `GET` and `POST` go out as `POST` with an
   * `x-http-method-override` header.
   */
  methodOverride: boolean;

  /** Panel instance the client belongs to, the same object as `window.panel`. */
  panel: Panel;

  /** Interval ID of the auth heartbeat that `ping()` schedules. */
  pingId: ReturnType<typeof setInterval>;

  /** Restarts the auth heartbeat, which pings while the Panel is online. */
  ping: () => void;

  /** Number of API requests in flight. The loading indicator stops once it drops to `0`. */
  requests: number;

  /** Code of the current content language; `null` without one. */
  language: string | null;

  /**
   * Sends a request to the API. A model response resolves to its `data`, any
   * other response to the full JSON.
   *
   * @param path - API path
   * @param silent - Skip loading indicator
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
   * @param silent - Skip loading indicator
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
   * @param method - HTTP method (default: `POST`)
   * @param silent - Skip loading indicator
   */
  post: <T = any>(
    path: string,
    data?: Record<string, any>,
    options?: PanelApiRequestOptions,
    method?: string,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a `PATCH` request.
   *
   * @param path - API path
   * @param data - Request body
   * @param silent - Skip loading indicator
   */
  patch: <T = any>(
    path: string,
    data?: Record<string, any>,
    options?: PanelApiRequestOptions,
    silent?: boolean,
  ) => Promise<T>;

  /**
   * Makes a `DELETE` request.
   *
   * @param path - API path
   * @param data - Request body
   * @param silent - Skip loading indicator
   */
  delete: <T = any>(
    path: string,
    data?: Record<string, any>,
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
