import type { Panel, PanelConfig, PanelPermissions } from "../src/panel";
import type { PanelApi, PanelModelData } from "../src/panel/api";
import type {
  PanelEventListenerMap,
  PanelFeature,
  PanelFeatureDefaults,
  PanelHistory,
  PanelHistoryMilestone,
  PanelModal,
  PanelModalListeners,
  PanelSuccessResponse,
} from "../src/panel/base";
import type {
  PanelContent,
  PanelDialog,
  PanelDialogDefaults,
  PanelDrawer,
  PanelNotification,
  PanelNotificationDefaults,
  PanelSearchResult,
  PanelUploadFile,
  PanelUser,
  PanelUserDefaults,
} from "../src/panel/features";
import { expectAssignable, expectType } from "tsd";

// -----------------------------------------------------------------------------
// 1. CONFIGURATION
// -----------------------------------------------------------------------------

expectAssignable<PanelConfig>({
  api: { methodOverride: false },
  debug: true,
  kirbytext: true,
  theme: "light",
  translation: "en",
  upload: 10485760,
});

expectType<boolean>({} as PanelPermissions["access"]["panel"]);
expectType<boolean>({} as PanelPermissions["files"]["create"]);
expectType<boolean>({} as PanelPermissions["languages"]["update"]);
expectType<boolean>({} as PanelPermissions["pages"]["changeSlug"]);
expectType<boolean>({} as PanelPermissions["site"]["update"]);
expectType<boolean>({} as PanelPermissions["users"]["changeRole"]);
expectType<boolean>({} as PanelPermissions["user"]["delete"]);

// -----------------------------------------------------------------------------
// 2. STATE DEFAULTS
// -----------------------------------------------------------------------------

expectAssignable<PanelUserDefaults>({
  email: "test@example.com",
  id: "user-123",
  language: "en",
  role: "admin",
  username: "testuser",
});

expectAssignable<PanelUserDefaults>({
  email: null,
  id: null,
  language: null,
  role: null,
  username: null,
});

expectAssignable<PanelNotificationDefaults>({
  context: null,
  details: null,
  icon: null,
  isOpen: false,
  message: null,
  theme: null,
  timeout: null,
  type: null,
});

expectAssignable<PanelNotificationDefaults>({
  context: "view",
  details: { error: "Something went wrong" },
  icon: "alert",
  isOpen: true,
  message: "Error occurred",
  theme: "negative",
  timeout: 5000,
  type: "error",
});

expectAssignable<PanelUploadFile>({
  id: "upload-1",
  src: {} as File,
  name: "document",
  extension: "pdf",
  filename: "document.pdf",
  size: 1024,
  niceSize: "1 KB",
  type: "application/pdf",
  url: "blob:http://localhost/abc123",
  progress: 50,
  completed: false,
  error: null,
  model: null,
});

// -----------------------------------------------------------------------------
// 3. PANEL STATE (base)
// -----------------------------------------------------------------------------

declare const userState: PanelUser;

// Generic contract
expectType<PanelUserDefaults>(userState.defaults());
expectType<PanelUserDefaults>(userState.reset());
expectType<PanelUserDefaults>(userState.set({ email: "new@test.com" }));
expectType<PanelUserDefaults>(userState.state());
expectType<string>(userState.key());
expectType<boolean>(userState.validateState({}));

// Property types
expectType<string | null>({} as PanelUser["email"]);
expectType<string | null>({} as PanelUser["id"]);
expectType<string | null>({} as PanelUser["language"]);
expectType<string | null>({} as PanelUser["role"]);
expectType<string | null>({} as PanelUser["username"]);

// -----------------------------------------------------------------------------
// 4. PANEL FEATURE (extends State)
// -----------------------------------------------------------------------------

declare const feature: PanelFeature<PanelFeatureDefaults>;

// HTTP methods with union returns
expectType<Promise<any | false>>(feature.get("/api/test"));
expectType<Promise<any | false>>(feature.post({}));
expectType<Promise<PanelFeatureDefaults>>(feature.load("/pages/home"));
expectType<Promise<PanelFeatureDefaults>>(feature.open("/pages/home"));
expectType<Promise<void | false>>(feature.reload());
expectType<Promise<PanelFeatureDefaults | undefined>>(feature.refresh());
expectType<URL>(feature.url());

// Event listeners (mixin)
expectType<void>(feature.addEventListener("load", () => {}));
expectType<boolean>(feature.hasEventListener("load"));
expectType<PanelEventListenerMap<string>>(feature.listeners());

// -----------------------------------------------------------------------------
// 5. PANEL HISTORY
// -----------------------------------------------------------------------------

declare const history: PanelHistory;

expectType<PanelHistoryMilestone | undefined>(history.at(-1));
expectType<PanelHistoryMilestone | undefined>(history.last());
expectType<boolean>(history.has("id"));
expectType<boolean>(history.isEmpty());
expectType<number>(history.index("id"));
expectType<PanelHistoryMilestone | undefined>(history.goto("id"));

// -----------------------------------------------------------------------------
// 6. PANEL MODAL (extends Feature)
// -----------------------------------------------------------------------------

declare const modal: PanelModal<PanelDialogDefaults>;

// Lifecycle methods
expectType<Promise<void>>(modal.cancel());
expectType<Promise<PanelDialogDefaults | void>>(modal.close());
expectType<Promise<any>>(modal.submit({}));
expectType<void>(modal.goTo("milestone-id"));
expectType<void>(modal.input({ field: "value" }));
expectType<PanelModalListeners>(modal.listeners());

// Success handling
expectType<PanelSuccessResponse>(modal.success("Done"));
expectType<PanelSuccessResponse>(
  modal.success({ message: "Success", redirect: "/home" }),
);
expectType<false | void | Promise<void>>(
  modal.successRedirect({ redirect: "/" }),
);

// -----------------------------------------------------------------------------
// 7. DIALOG & DRAWER
// -----------------------------------------------------------------------------

declare const dialog: PanelDialog;
expectType<Promise<PanelDialogDefaults>>(
  dialog.open({ component: "k-remove-dialog", props: { text: "Delete?" } }),
);

expectType<void | false>({} as ReturnType<PanelDrawer["tab"]>);

// -----------------------------------------------------------------------------
// 8. PANEL NOTIFICATION & PANEL CONTENT
// -----------------------------------------------------------------------------

// Notifications
expectType<() => PanelNotificationDefaults>({} as PanelNotification["close"]);
expectType<PanelNotificationDefaults | void>(
  {} as ReturnType<PanelNotification["error"]>,
);

// Content
declare const content: PanelContent;
expectType<boolean>(content.hasDiff());
expectType<boolean>(content.isCurrent());
expectType<boolean>(content.isLocked());
expectType<Promise<void>>(content.save());
expectType<Promise<void>>(content.publish());
expectType<Promise<void>>(content.discard());

// -----------------------------------------------------------------------------
// 9. PANEL (top-level)
// -----------------------------------------------------------------------------

declare const panel: Panel;

// Search overloads
expectType<void>(panel.search("pages"));
expectType<Promise<PanelSearchResult>>(panel.search("pages", "test"));

// Error handling
expectType<void | PanelNotificationDefaults>({} as ReturnType<Panel["error"]>);

// API structure
expectType<string>({} as PanelApi["csrf"]);
expectType<string>({} as PanelApi["endpoint"]);
expectAssignable<PanelApi["auth"]>({
  login: async () => ({}),
  logout: async () => {},
  ping: async () => {},
  user: async () => ({}),
  verifyCode: async () => ({}),
});

// -----------------------------------------------------------------------------
// 10. PANEL MODEL DATA
// -----------------------------------------------------------------------------

// Basic usage
declare const model: PanelModelData;
expectType<string | undefined>(model.id);
expectType<string>(model.title);
expectType<Record<string, any>>(model.content);

// Generic content typing
interface ArticleContent {
  text: string;
  author: string;
}
declare const article: PanelModelData<ArticleContent>;
expectType<string>(article.content.text);
expectType<string>(article.content.author);

// Extendability - page-specific
interface PageModelData extends PanelModelData {
  status: "draft" | "unlisted" | "listed";
  slug: string;
}
declare const page: PageModelData;
expectType<string>(page.title);
expectType<"draft" | "unlisted" | "listed">(page.status);

// Assignability - model data can be used where broader types are expected
declare const modelData: PanelModelData;
expectAssignable<Record<string, any>>(modelData);
expectAssignable<{ content: Record<string, any> }>(modelData);
