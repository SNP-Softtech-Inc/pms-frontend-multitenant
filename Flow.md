# Flow

How execution moves through this app. Reasoning behind changes belongs in
[decisions.md](./decisions.md).

The **admin** application — the view firm staff use. The client portal is a
separate app (`pms-client-multitenant`), served at `/client`.

Package name is `new-pms-frontend`; it is served under `/admin`
(`"homepage": "/admin"`).

---

## Entry point

**`src/index.js`** → `src/App.js`.

The provider stack in `index.js`, outermost first. Order matters: anything
inside can consume what wraps it.

```
ReactDOM.createRoot(#root)
  QueryClientProvider          @tanstack/react-query
    Provider                   react-redux, src/redux/store.js
      ThemeProvider            MUI, src/theme.js   + CssBaseline
        BrowserRouter          basename={process.env.REACT_APP_BASE_PATH}
          ToastProvider        src/context/ToastContext.js
            AuthProvider       src/context/AuthContext.js
              ConfirmProvider  src/components/ConfirmDialogContext.js
                <App />
```

`basename` comes from `REACT_APP_BASE_PATH`. Get it wrong and every route
404s while the bundle still loads — the app appears blank rather than broken.

---

## State: three systems at once

| system | where | used for |
|---|---|---|
| Redux Toolkit | `src/redux/` — `store.js`, `accountContactSlice.js`, `accountContactDraft.js` | account/contact editing and drafts |
| React Query | `QueryClientProvider` in `index.js` | server state, caching |
| React Context | `src/context/` — Auth, Toast, Theme; plus ConfirmDialog | cross-cutting concerns |

Check which one already owns a piece of state before adding to another.

---

## The API layer

```
component
  └─► src/services/api.js             one module, every backend
        └─► src/services/apiInterceptor.js    auth header, refresh, errors
              └─► src/services/tokenService.js
                    └─► HTTP → nginx → the service
```

`api.js` fans out to **15 backend services**, each behind its own
environment variable:

```
REACT_APP_AUTH_USER          signup-login-backend
REACT_APP_ACCOUNT_CONTACT    account-contact-backend
REACT_APP_ACCOUNT_NOTE       account-note-backend
REACT_APP_ACCOUNT_TASKS      account-task-backend
REACT_APP_CHAT               chat-backend
REACT_APP_TEAMMATES_CHAT     internal-communication
REACT_APP_EMAIL_SYNC         signup-login-backend  (/api/emailsync)
REACT_APP_ESIGNATURE_API     esignature-backend
REACT_APP_FOLDER_MANAGEMENT  folder-mangement
REACT_APP_INVOICE            invoice-backend
REACT_APP_JOBS               jobs-backend
REACT_APP_ORGANIZER          organizer-backend
REACT_APP_PROPOSAL           proposal-backend
REACT_APP_SIDEBAR            sidebar-backend
REACT_APP_TEMPLATE           templates-backend
```

Two consequences worth holding on to:

- A missing or wrong variable fails **only the feature that uses it**. The
  app loads fine and one screen is broken, which makes it look like a code
  bug rather than configuration.
- nginx has a `location` block **per endpoint**, not a blanket `/api/` rule.
  A new backend path needs proxying before the browser can reach it — an
  unproxied path returns nginx's default page, a 200 with `text/html`, not a
  404.

**No secret may be referenced here.** Anything in a `REACT_APP_*` variable is
compiled into the bundle and readable by anyone. `DOCUSEAL_API_KEY` in
particular stays server-side in esignature-backend.

---

## Connecting a mailbox (Settings → Email Sync)

```
"Add a mailbox" box: address → Continue
  └─ authAPI.discoverImapHost(email)        GET /api/emailsync/imap/discover
       └─ routeForDiscovery(answer, mailProviders, address)   connectRoute.js
            ├─ oauthProvider "google"     → handleConnectGmail     (Google sign-in)
            ├─ oauthProvider "microsoft"  → handleConnectMicrosoft (Microsoft sign-in)
            ├─ Zoho address or host, and
            │  mailProviders.zoho.available → handleConnectZoho    (Zoho sign-in)
            ├─ provider not available     → notice under the box, no redirect
            └─ anything else              → IMAP form, address + server filled in,
                                            app-password note via imapProviderIdFor
```

The provider buttons are still there, behind "Choose your provider
instead". The Zoho button signs in with Zoho when the server reports it
available, and opens the password form otherwise. A Zoho mailbox connected
by sign-in shows "Zoho · signed in with Zoho" and has its own Disconnect
(`authAPI.disconnectZohoMailbox`, `GET /api/emailsync/zoho/disconnect`).

---

## Build

```bash
DISABLE_ESLINT_PLUGIN=true NODE_OPTIONS=--max-old-space-size=8192 \
  CI=false npx react-scripts build
```

The 8 GB heap is required — the default limit is not enough for 292 source
files plus CKEditor and MUI. `DISABLE_ESLINT_PLUGIN=true` is a hazard, not a
convenience: see decisions.md.

When checking a build, **capture the real exit code**. Piping through `tail`
reports the exit status of `tail`, which is always 0, so a failed build looks
like a successful one.

---

## Directory map

```
src/
  index.js            provider stack, router
  App.js              routes
  theme.js            MUI theme
  pages/              feature screens — the bulk of the app
  components/         shared components, incl. ConfirmDialogContext
  layouts/            page shells
  context/            AuthContext, ToastContext, useTheme, LogoutButton
  redux/              store, accountContactSlice, accountContactDraft
  hooks/
  services/           api.js, apiInterceptor.js, tokenService.js
  login-signup/       auth screens
  TextEditor/         CKEditor wrappers
  lib/  Images/
```

---

## Before editing: the dead-code hazard

Two files contain large commented-out copies of **themselves**:

| file | total | commented |
|---|---|---|
| `src/pages/AccountDashboard/Documents/FolderTreeView.js` | 5,984 | 2,258 |
| `src/pages/Settings/MyAccount.js` | 2,860 | 930 |

A text search matches the dead copy as readily as the live one. Editing by
textual anchor in these files has already caused a production blank screen —
two `useState` calls landed at module scope and every route died on import.

**Use line-targeted edits in these two files.** Verify the line number first,
and check whether your anchor is unique:

```bash
grep -n "<anchor>" src/pages/.../File.js    # how many matches, and where?
```
