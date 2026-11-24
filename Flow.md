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

The page shell is `public/index.html`: tab title "SNP Taxes & Financials
PMS" and `favicon.ico`, the SNP mark (same in both apps; `manifest.json`
names the installed app the same way).

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

## Migration import (Import → Upload folder to account)

```
AccountTable.js  Select ZIP → Upload
  └─ readZipEntries(file)                      readZip.js (zip.js, no workers)
       entries read lazily from the File - the ZIP is never sent whole
  └─ runImport({ entries, accountId, api })    zipImport.js
       ├─ buildPlan: drop __MACOSX / OS clutter, report duplicates and
       │             password-protected entries
       ├─ importPrepare (5,000 files per call)   POST /accounts/docs/import/prepare
       │    new → queue · exists → skipped · conflict/tooLarge/invalid → reported
       ├─ 4 at a time: entry.read() → importFile POST /accounts/docs/import/file
       │    network / 408 / 429 / 5xx → retry 1s, 3s, 9s
       │    409 / 413 / 403 / 400 → reported · 507 / 401 → stop everything
       └─ nothing missing → importFinish        POST /accounts/docs/import/finish
                                                (removes "Incomplete Data")
  progress dialog: files, bytes, Cancel · summary: uploaded, skipped, problems
```

Running the same ZIP again resumes: what is already there is skipped. The
server side is folder-management v1.9.0 (its Flow.md).

---

## Auto refresh

```
screen ──► useAutoRefresh(quietLoad, { enabled: !formOpen })   src/hooks/useAutoRefresh.js
             └─ startAutoRefresh                                 src/lib/autoRefresh.js
                  every 30s while visible · at once on return/focus
                  documents tree: every 5s (QUICK_INTERVAL_MS)
                  never overlapping · failure logged, next tick runs
                  quietLoad → setRows(keepIfSame(next))   unchanged = same object
React Query screens ──► useQuery({ ..., refetchInterval: AUTO_REFRESH_MS })
```

A new data screen should call `useAutoRefresh` with a silent loader - no
spinner, no toast, `keepIfSame` on the list - and pause it while anything
editable is open. Forms are not refreshed. See decisions.md v1.63.0 for the
screens deliberately left out.

`QUICK_INTERVAL_MS` (5s, the minimum) is for screens where someone else's
change should appear at once - only the documents tree uses it. Each tick
there is a full folder walk on folder-management; see decisions.md v1.71.0
before adding more.

---

## Account page: the Contacts card

```
AccountDashboard/Info.js
  └─ account details (account-contact GET /api/clientaccounts/:id)
       contacts[].contact populated - everything but password and live tokens
  per contact:
    name                      contact.contactName       click → edit drawer
    email                     contact.email
    phone                     contactPhonesText(contact) contactPhones.js
                              each number via formatPhone (libphonenumber-js):
                              "919175981613" → "+91 91759 81613";
                              unrecognised → shown as stored; comma separated,
                              blanks dropped; none → "No phone number"
    activation badge          activationStatusOf(contact) activationStatus.js
```

The same `contactPhones.js` formats every contact phone shown on screen:
the Contacts list's Phones column (`contactPhonesText`) and the "To" block of
the invoice preview (`formatPhone`, `Invoices/PreviewDrawer.js`). Phone
*inputs* (react-phone-input-2) format themselves and are not touched.

```
stored "919175981613" ──► formatPhone ──► "+91 91759 81613"
                          valid with a "+"?  no → shown exactly as stored
```

---

## Account page: Email tab (Inbox / Sent)

```
Email/EmailViewer.js (type "inbox" | "sent")
  └─ authAPI.getSingleUser            gmailEmail (fallback only)
  └─ accountsAPI.getAccountContacts   contacts with Sync on
  └─ no accountId in the URL → no request (v1.81.0)
  └─ authAPI.getEmailCommunications(accountId)
       GET /api/emailsync/communications?accountId=
       signup-login v1.33.0: this account's emails, of every mailbox the
       user is connected to; no notifications, no attachment bytes;
       latest = summary (no body)
       → { threads, mailboxes }
  └─ withLatestBody(threads)          latest.body ← same email in messages
  └─ messagesForTab(threads, { type, contactEmails, mailboxes })
                                      Email/emailTabs.js
       Inbox = a contact writing to one of mailboxes
       Sent  = one of mailboxes writing to a contact
  opening an unread thread → markReadLocally (on screen at once) +
       PUT /mark-read/:threadId; no toast, no re-fetch
  Reply (last message) → replyRequest(email, text)      Email/reply.js
       POST /api/emailsync/reply { messageId, body }    signup-login
       recipient, subject, mailbox, threading: decided by the server
       composer stays open until 202; a failure shows the server's reason
       Reply all, Forward, attachments: disabled (REPLY_ACTIONS_AVAILABLE)
```

---

## Invoice documents (PMS-116, v1.90.0)

With `REACT_APP_INVOICE_RENDERER=new` invoice-backend draws every invoice:

```
InvoiceList  Download ─► invoiceAPI.getInvoicePdf(id)  (blob) ─► downloadBlob
             Print    ─► invoiceAPI.getInvoicePdf(id)  (blob) ─► printPdfBlob
                                                              (hidden iframe, print the PDF)
CreateInvoiceDrawer ─► PreviewDrawer(serverPreview = save payload)
                         └─► ServerInvoicePreview
                               └─► invoiceAPI.previewInvoiceHtml(form)
                                     └─► InvoiceDocumentFrame  <iframe sandbox="" srcdoc>
```

Unset: the older jsPDF / HTML builders in `invoiceDocuments.js`, unchanged.
Helpers: `src/lib/invoiceDocument.js` (tested in `invoiceDocument.test.js`).

---

## Teams & Plans bulk actions (v1.89.0)

```
ActiveTeammembers / Deactivatemember / ActiveGroups  (Teammembers/)
  DataTable onRowSelectionChange → selection {id: true}; key={tableKey}
  DataTableToolbar selectedCount + bulkActions=<BulkActions kind rows onDone>
BulkActions.jsx
  active:   Add to group (AddToGroupDialog → addMembersToGroup(groupId, userIds))
            Deactivate → deactivateTeamMember(id)
  inactive: Reactivate → reactivateTeamMember(id)  (409: invite never accepted)
            Resend activation → resendActivation(id)
  all:      Delete → deleteTeamMember(id) | deleteGroup(id)
  each: confirm(...) → runBulk(rows, request) one at a time  (bulk.js)
        → bulkResultToast: "Deactivated 3 team members" | names the failures
  onDone → clear selection, remount table, reload list
```

---

## Previewing Excel and Word (v1.88.0)

```
lib/filePreview.js
  isOfficeFile(name)     xls xlsx xlsm xlsb doc docx
  officeViewerUrl(url)   https://view.officeapps.live.com/op/embed.aspx?src=<url>
  previewUrl(url, name)  office → viewer, else the url itself
Documents tree     click xlsx → Excel dialog (viewer); new tab → viewer (497df49)
DocumentViewer     OfficeViewer: <iframe src={officeViewerUrl(fileUrl)}>
                   "Open in new tab" (fallback) → previewUrl
Approvals / Signatures   href = previewUrl(fileUrl, filename)
Trash              href = previewUrl(...); plain click: office → viewer tab
The viewer fetches the file itself: needs a public URL (uploads are public).
```

---

## Creating an account with contacts (v1.87.0)

```
AccountContactForm.handleSubmit  (Account-Contact/)
  submittingRef set → a second click returns at once
  required fields; same email twice in the form → stop
  accountsAPI.checkAccountName(name)        GET /api/clientaccounts/name-check
    available:false → inline error + toast, step 1, nothing created
  new contacts not created by an earlier attempt (createdContactsRef, by email)
    contactsAPI.checkDuplicateContacts      POST /api/contacts/duplicate-check
      duplicates → confirm(duplicatePrompt)   Create anyway | Cancel (nothing created)
  create each new contact (or reuse the one an earlier attempt made)
    failure → "Could not create the contact" | "Contacts created, but ..."
  accountsAPI.createAccount({ ..., contacts })
    failure → friendlyError(err); 409 also inline on the name field;
              contacts exist → partialFailureMessage (12 s); kept for retry
  success → link contacts, folder template, toast, reset, close
accountCreation.js: friendlyError, duplicatePrompt, partialFailureMessage, contactKey
Toaster: portaled to <body> (index.js), above drawers
```

---

## Team member Access Rights (v1.86.0)

```
Teammembers/AddEditTeamMemberDrawer.js  (role = employee)
  permissionList (stored keys, unchanged)
    → <PermissionToggle label={permissionLabel(key)} checked unavailable onToggle>
         on: primary track, highlighted card, "On"
         off: grey track, grey label, "Off"
         unavailable (disabledPermissions): dashed, "Not available", locked
```

---

## Opening records in a new tab (v1.85.0)

```
<RecordLink to|href [newTab] onOpen>          components/RecordLink.jsx
  plain left click → onOpen() (drawer / expand / viewer), no navigation
  Ctrl/Cmd/Shift/middle/right-click → the browser (new tab / window);
                                      the row's own click does not run
Contacts list    /clients/contacts?contact=<id>
                 ContactTable: list loaded → open that contact's drawer
                 drawer closed → ?contact removed
Documents tree   folder: <path>?folder=<fullPath>
                 FolderTreeView: tree loaded → expand ancestorPaths(),
                 scroll [data-folder-path] into view       lib/recordLinks.js
                 file: already a link (viewer on plain click)
Approvals / Signatures   <a href=fileUrl target=_blank>
Trash            RecordLink href=fileUrl; plain click = openTrashedFile
Account header   ↗ → same account and tab, new browser tab
```

---

## Sign-in session: countdown, warning, renew, expiry (v1.84.0)

```
login / refresh-token / renew-session  (signup-login v1.35.0)
  → session { startedAt, expiresAt, durationMs }   ends with the refresh cookie
AuthContext.js
  session = parseSession(...)                     lib/sessionTime.js
    set on login, on every refresh (page load + every 5 min), on renew;
    cleared on logout or when refresh says the session is over
  renewSession()   POST /api/auth/renew-session (cookie) → new token + session
  at session.expiresAt: refreshToken() once (another tab may have renewed)
    → still valid: new session, timer re-armed
    → over: toast "Session expired" + navigate /login
  renders <SessionExpiryWarning />                components/SessionExpiryWarning.jsx
    open when shouldWarn(): ≤ 10 min left (≤ half for sign-ins < 20 min)
    "Your session will expire in N minutes ..."  live
    Renew session → renewSession()   Dismiss → hidden for this session

My Account → Security (pages/Settings/MyAccount.js)
  Stay signed in for   sessionRemainingText(session, now), ticks every second
                       "7 hours 30 minutes remaining of 8 hours" | "Expired"
  Login Details → Save → PasswordConfirmDialog    components/PasswordConfirmDialog.jsx
       → authAPI.updateLoginDetails({ ..., currentPassword })
       401 "Invalid password" → stays open, "That password is not correct"
```

---

## Account page: Reviewer notes (Notes tab → Reviewer Notes)

```
AccountDashboard/Notes.js
  └─ accountNoteAPI.getNotesByAccountId(accountId)   account-note-backend
       note.logs[] (oldest first); a reviewer note from before the log
       existed has none → its body is shown as Log 1 (display only)
  per reviewer note:
    heading                   note.title
      Copy log  (active and archived)  → handleCopyLog(note)
          reviewerLogText(note)        reviewerLog.js
            "<title>" / blank / "Log n - <name> (<email>) - <time>" / text
            entry HTML → plain text via htmlToText (inert DOMParser:
            paragraphs and <br> → lines, lists → "- " / "1. ")
          copyText(text)               clipboard API, else hidden <textarea>
          toast "Log copied" / "Could not copy the log"; button ticks 2 s
      +  (active only)        → composer → confirm →
                                accountNoteAPI.appendReviewerLog(id, text)
                                author and time stamped by the server
    per entry: "Log n"  <LogAuthor> name in bold, (email) normal  time
```

No edit or delete control on a reviewer note or its entries (see
decisions.md, v1.45.0).

---

## Documents: Send for signature

```
FolderTreeView.js  sign → esignAPI.generateToken   GET /api/generate-token
                   builder opens with every activated contact as a recipient
                   none activated → 400 → showToast(signStartErrorToast(err))
                                          Documents/signStartError.js
  Send → handleSendForSignature
    └─ esignAPI.sendSubmission({ templateId, submitters, signInOrder })
         POST /api/submissions/send   (esignature-backend routes/sendSubmission.js)
         server invites only recipients with a field placed; rest → skipped
    └─ showToast(sendResultToast(data, submitters.length))   Documents/sendResult.js
         "Sent to N recipient(s)" + "Not sent to … - no field was placed for them."
```

The builder's field list comes from `signerFields(submitters)`
(`Documents/signerFields.js`): one set per recipient, including "Date signed"
(`datenow`). Both date fields print `DATE_FORMAT`, MM/DD/YYYY.
Only these signer-named fields are offered (`onlyDefinedFields`), so every
field on the page shows whose it is.
The name inside a placed box is DocuSeal's placeholder, drawn readable by
`docuseal-dark-theme.css` (global CSS; the builder has no shadow DOM).

### Cancel Signature Request (v1.83.0)

```
FolderTreeView.js  ⋮ on a "pendingSignature" file → cancelSignature(item)
  └─ cancelRequest(item)                       Documents/cancelSignature.js
       { id: meta.esignRequestId, body: { folder: meta.folder, name: item.name } }
       item.name, the file's real name: a "X(2).pdf" keeps meta.name "X.pdf"
  └─ esignAPI.cancelSignature(id, body)
       DELETE /signature/cancel/:id   (esignature-backend routes/cancelSignature.js)
       server finds the file from the request, archives the DocuSeal
       submission, keeps the record as "cancelled"
  └─ showToast(cancelResultToast(err, data))   success, or the server's reason
  └─ fetchFolderTree()                         either way, so the status is current
```

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
