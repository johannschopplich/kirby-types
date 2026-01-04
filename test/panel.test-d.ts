import type {
  PanelConfig,
  PanelNotification,
  PanelNotificationDefaults,
  PanelPermissions,
  PanelUploadFile,
  PanelUser,
  PanelUserDefaults,
} from "../src/panel";
import { expectAssignable, expectType } from "tsd";

// =============================================================================
// PANEL TYPE TESTS
// =============================================================================

// --- 1. PanelUserDefaults ---

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

// --- 2. PanelNotificationDefaults ---

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

// --- 3. PanelConfig ---

expectAssignable<PanelConfig>({
  api: { methodOverride: false },
  debug: true,
  kirbytext: true,
  theme: "light",
  translation: "en",
  upload: 10485760,
});

// --- 4. PanelPermissions (partial check) ---

expectAssignable<PanelPermissions>({
  access: {
    account: true,
    languages: true,
    panel: true,
    site: true,
    system: false,
    users: true,
  },
  files: {
    access: true,
    changeName: true,
    changeTemplate: true,
    create: true,
    delete: true,
    list: true,
    read: true,
    replace: true,
    sort: true,
    update: true,
  },
  languages: {
    create: false,
    delete: false,
    update: false,
  },
  pages: {
    access: true,
    changeSlug: true,
    changeStatus: true,
    changeTemplate: true,
    changeTitle: true,
    create: true,
    delete: true,
    duplicate: true,
    list: true,
    move: true,
    preview: true,
    read: true,
    sort: true,
    update: true,
  },
  site: {
    changeTitle: true,
    update: true,
  },
  users: {
    changeEmail: true,
    changeLanguage: true,
    changeName: true,
    changePassword: true,
    changeRole: false,
    create: false,
    delete: false,
    update: true,
  },
  user: {
    changeEmail: true,
    changeLanguage: true,
    changeName: true,
    changePassword: true,
    changeRole: false,
    delete: false,
    update: true,
  },
});

// --- 5. PanelUploadFile ---

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

// --- 6. Type inference checks ---

// PanelUser extends PanelState
expectType<string | null>({} as PanelUser["email"]);
expectType<string | null>({} as PanelUser["id"]);
expectType<string | null>({} as PanelUser["language"]);
expectType<string | null>({} as PanelUser["role"]);
expectType<string | null>({} as PanelUser["username"]);

// PanelNotification has required methods
expectType<() => PanelNotificationDefaults>({} as PanelNotification["close"]);
