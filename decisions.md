# Decisions

Why things were done the way they were. A diff shows *what* changed; this
records *why*, and what was rejected.

Newest first. Add an entry when a reader would otherwise ask "why was it done
this way?" — not for routine edits. Update it in the same commit as the code.

---

## 2026-11-12 · v1.74.0 · staging only

### The signature builder offers only fields named for a signer

**Asked for:** each signature field on the page should show whose it is -
the signer's name and email on the box.

**What was happening.** Each signer already had their own fields in the
builder ("Signature - Name (email)", from `signerFields`), and a field
dragged from that list shows its name on the box (`withFieldPlaceholder`).
But the generic Default grid was also offered, and a field dragged from it
is named "Signature Field 1", with no signer on it.

**Decision (the user's choice):** `onlyDefinedFields={true}` and
`withCustomFieldsTab={false}`, so the only fields on offer are each
signer's own. Every field type stays available per signer: Text, Signature,
Initials, Date, Date signed, Number, Image, Checkbox, File and Phone.

The box shows the field's name as one line, "Signature - Name (email)".
DocuSeal draws that name itself; its layout on the box is not ours to set.

**Also found, not changed:**
- The "Send for signature" refusal behind the builder ("No recipient has a
  field...") was a fault in esignature-backend v1.10.0, fixed in v1.11.0. A
  contact name stored with two spaces did not match the role DocuSeal saved
  with one.
- **"Sign yourself" stays (the user's choice).** It creates a real request
  addressed to the logged-in admin, so the document shows "Waiting for
  Signature" until the admin signs it, even though no client was emailed.

**Rejected:** keeping the generic grid alongside. Admins would keep placing
unnamed fields.

Tests: `builderOptions.test.js` checks the builder's props in the source.

---

## 2026-11-12 · v1.73.0 · staging only

### Send for Sign says why it cannot open

**Reported:** on the vardhankulkarni account, Send for Sign did nothing.
The browser console showed a 400 from `GET /api/generate-token`.

**Cause:** not a fault in the signing changes. Before the builder opens,
the server lists who can sign: the account's activated contacts with an
email. That account's only contact, created on 23 Sep, has never been
activated, so the server answered 400 "No activated contacts found for this
account" (read-only check of the staging log and database).
`toggleSignStatus` only wrote errors to the console, so the click looked
dead.

**Decision:** show the reason as a toast (`Documents/signStartError.js`).
- No activated contact: "No one on this account can sign yet", with
  "Activate at least one contact on this account, then send for signature
  again."
- Any other reason from the server is shown as given, under "Could not open
  the signature screen". With no reason (network down, an HTML page),
  "Please try again."

The no-contact case is recognised by its message, not by the 400 alone: the
server also uses 400 for a missing file URL. If the wording ever changes,
the admin still sees the server's message, under the general title.

**Rejected:**
- Hiding Send for Sign on accounts without an activated contact. That costs
  a request per menu open, and the admin would not learn why it is missing.
- Changing the backend. Its message was already clear; only the screen
  dropped it.

Tests: `signStartError.test.js` covers the three cases, odd error shapes
and the wiring in `FolderTreeView.js`. Mutation-checked.

---

## 2026-11-12 · v1.72.0 · staging only

### A "Date signed" field that always prints MM/DD/YYYY

Asked for: DocuSeal dates should read mm/dd/yy, not dd/mm/yy.

**What was actually happening.** The signed document was already
MM/DD/YYYY: every date field placed on staging over the past week stored
`preferences.format: "MM/DD/YYYY"` (read-only check through DocuSeal's
API), because the builder offers only that format (`dateFormats`). The
day-first date is the date picker in DocuSeal's signing form. That form uses
the browser's own `<input type="date">` (DocuSeal's date_step.vue), which
always shows the date in the order of the signer's computer region: day
first on an Indian-region computer, month first on a US one. Neither this
app nor DocuSeal can change that.

**Decision (the user's choice of four):** add DocuSeal's "Date signed"
field (`datenow`) to each recipient's field list, next to Date. It fills
itself with the day the person signs, in MM/DD/YYYY, and shows no picker,
so every signer sees month first. The pickable Date field stays, for dates
the signer must choose.

- The per-recipient field list moved, unchanged, from `FolderTreeView.js`
  into `Documents/signerFields.js` so it can be tested. Its one addition is
  "Date signed". Both date fields now state `format: "MM/DD/YYYY"`
  themselves (`DATE_FORMAT`); the builder's `dateFormats` uses the same
  constant. The value is unchanged.
- DocuSeal hides `datenow` from its own field grid but accepts it as a
  predefined field, which is how this list is offered.
- Already-sent documents are not touched.

**Rejected:**
- Replacing Date with Date signed: signers could no longer enter a date of
  their choosing.
- A text box that only accepts MM/DD/YYYY: no calendar, and the value is
  stored as text.
- Leaving it: PDFs and US clients were already fine, but staff testing on
  Indian-region computers kept seeing day first.

Tests: `signerFields.test.js` (the old fields unchanged, Date signed added,
both date fields MM/DD/YYYY).

---

## 2026-11-12 · v1.71.0 · staging only

### The documents tree refreshes every 5 seconds

Asked for: when a document is uploaded, the other side should see it very
quickly. The tree already refreshed itself (v1.63.0), but every 30 seconds,
so a client's upload could take half a minute to appear. On staging today
the 30-second ticks were visible in the server log, so the mechanism worked;
it was the wait that read as "no auto refresh".

- **`QUICK_INTERVAL_MS` = 5 seconds**, added to `lib/autoRefresh.js` for
  screens where someone else's change should show up almost at once. Only
  the documents tree uses it (`FolderTreeView.js`). 5 seconds is the
  shortest interval the shared rules allow.
- **Everything else about refreshing is unchanged.** It runs only while the
  tab is visible, at once on return to the tab, never two requests at once,
  and it pauses while a menu, drawer, viewer, dialog or the signature
  builder is open. An unchanged tree is not re-rendered (`keepIfSame`), so
  a tick that finds nothing new does nothing visible.
- **What it costs the server.** Measured on staging, read-only:
  `GET /accounts/docs/files/list` walks the account's folder from disk
  synchronously, about 80 ms for the largest account (2,403 files, 550 kB,
  710 ms cold) and much less for a typical one. So a poll on a very large
  account blocks folder-management for ~80 ms, now up to 12 times a minute
  per open documents tab. Fine at the firm's size; if many staff keep huge
  accounts open, the server should send a cheap "changed since" answer
  first or push changes instead (below).
- The client portal's tree does the same (client v1.17.0), so the firm's
  uploads reach the client just as quickly.

**Rejected:**
- Below 5 seconds. Each tick is a full folder walk on the server, and 5 seconds
  already feels immediate next to the instant refresh on returning to the tab.
- Pushing changes (WebSocket or server-sent events) from folder-management.
  That would be near-instant, but it needs a new endpoint, a new nginx
  location on both servers, and a production nginx change. Worth it only if
  polling cost becomes a problem.
- Speeding up every screen. Most screens change only when the same person
  acts, and they already reload after their own actions.

Tests: `lib/autoRefresh.test.js` (the 5-second tick), and
`Documents/documentsRefresh.test.js` (the tree uses it and still keeps an
unchanged tree).

---

## 2026-11-12 · v1.70.0 · staging only

### Send for signature reports who was actually sent to

Reported: with two recipients, placing a signature field for the first only
still emailed both. The fix is on the server (esignature-backend v1.10.0):
only recipients with a field on the page are invited, and the rest come
back as `skipped`.

- **The success message now counts from the server's answer.** It used to
  say "Sent to 2 recipient(s)" from the builder's list, which is everyone
  on the account. Now it says, for example, "Sent to 1 recipient(s)" with
  "Not sent to Nithish TEst - no field was placed for them."
  (`sendResultToast`, `Documents/sendResult.js`).
- **If nobody has a field**, the server refuses and its message is shown
  as an error by the existing handler. Nothing is sent.
- **Unchanged:** the "sign in order" checkbox and what it sends
  (`signInOrder`), the builder, and its recipient list.
- An older server answer without `skipped` still gives the old message,
  so the two deploys can land in either order.

Tests: `sendResult.test.js`.

---

## 2026-11-10 · v1.69.0 · staging only

### Account page phone numbers in international format

Reported on v1.68.0: "919175981613" is hard to read; it should be properly
formatted, with a space between the country code and the number. It now
shows as "+91 91759 81613" (`formatPhone`, `contactPhones.js`). Display
only - nothing stored changes. This reverses v1.68.0's "shown as stored".

- **`libphonenumber-js` 1.13.15, pinned exactly.** It knows each country's
  code and grouping. The contact form's react-phone-input-2 has the same
  data, but bundled inside its code and not exported. Hand-written rules
  would mis-split codes of 1 to 3 digits. MIT, no dependencies, released
  October 2026. Default metadata (~80 kB).
- **Unrecognised numbers are left exactly as stored.** A number is
  formatted only if, read with a "+" in front, it is a valid number. A
  10-digit US number imported without its country code ("2025550143")
  would otherwise read as Egypt "+20 2 5550143" - a wrong number shown
  confidently - so it stays as typed. Free text such as "ext. 42" is left
  alone too.
- **The Contacts list is unchanged** and still shows the raw digits; it
  was not part of the request. Using `formatPhone` there would make them
  match.

Tests: `contactPhones.test.js` now 11. Mutation checks - no validity check,
no spacing, no "+" added, blanks kept - each fail a test.

---

## 2026-11-09 · v1.68.0 · staging only

### The account page's contacts show their phone number

Asked for: the account's contact information in the admin portal should
show the registered phone number with the contact's name and email. It now
appears as a third line under the email on the account page's Contacts
card.

- **Frontend only.** The account details already return each contact's
  `phoneNumbers` - the populate leaves out only the password and live
  tokens - so no backend change was needed.
- **Shown as stored, comma separated** (`contactPhonesText`,
  `src/pages/AccountDashboard/contactPhones.js`), the same as the Contacts
  list. The contact form saves digits with the country code and no "+".
  Formatting them here alone would make one number look different on two
  screens, and adding a "+" would be wrong for imported numbers saved
  without a country code.
- **Blank entries dropped.** Imports with an empty "Phone" column store
  `[""]`; on staging 40 of the 44 stored entries are blank. With no
  number the line reads "No phone number", so every card has the same
  three lines.
- The "add existing contact" pickers on the same page are unchanged.

Tests first: `contactPhones.test.js` (7). Mutation checks - blanks kept,
no trim, a single string ignored - each fail a test.

---

## 2026-11-05 · v1.67.0 · staging only

### The migration import reads the ZIP in the browser and sends its files one by one

**Why:** Import → "Upload folder to account" sent each ZIP whole to
folder-management.
- nginx refuses anything over 200 MB, so large clients could not be
  migrated.
- The service held the ZIP in memory, so one big upload could stop document
  handling for every firm.
- A network drop meant starting again.
- After any error the page said only "Upload failed".

**What:** `AccountTable.js` now reads the ZIP with zip.js (`readZip.js`) and
hands its entries to `runImport` (`zipImport.js`). That module asks
folder-management which files are already there, uploads the rest four at a
time, and then marks the account complete. The new routes are folder-management
v1.9.0; there is no nginx change.

**Decisions:**
- **zip.js 2.7.57, not JSZip** (which the folder upload drawer already
  uses). JSZip loads the whole ZIP into memory first. zip.js reads the ZIP's
  directory and then each entry through Blob slices, so a multi-GB ZIP is
  fine. It is pinned exactly, released January 2025, and has no
  dependencies. Web workers are off (`configure({ useWebWorkers: false })`)
  because their script would need serving separately under Create React
  App. Decompression uses the browser's own `DecompressionStream`.
- **Resume by re-running.** Files already in the account with the same size
  are skipped, so after a drop, a Cancel or a closed tab, the same ZIP is
  simply uploaded again. Nothing is stored in the browser.
- **Retries:** a network error or `408/429/5xx` is retried after 1 s, 3 s
  and 9 s. A refusal (`409` conflict, `413` too large, `403` read-only,
  `400` invalid) is reported, not retried. `507` (server nearly out of disk)
  and `401` (signed out) stop the whole import with a plain message.
- **The account is marked complete** (its "Incomplete Data" tag removed)
  only when every file arrived and nothing was reported. Anything less
  leaves the tag, so the account still shows as unfinished.
- **What is skipped:** `__MACOSX/`, `.DS_Store`, `Thumbs.db` and
  `desktop.ini`. These are OS clutter; the old route skipped only
  `__MACOSX`. A path that appears twice in a ZIP is imported once and
  reported. Password-protected entries are reported, not sent.
- **No size check on the ZIP itself.** Only a file inside it over the
  server's limit (190 MB) is reported.
- **Leaving the page asks first** (`beforeunload`) while an import runs,
  because closing the tab stops it.
- `accountDocsAPI.uploadAccountFolderZip` and its route are kept but no
  longer used by this page.

**Tests first:**
- `src/pages/Import/zipImport.test.js` (30 tests) uses a fake API and
  covers resume, retries, give-up, refusals, the disk and sign-out stops,
  Cancel, damaged entries, the concurrency cap, chunked prepare (5,000 per
  request), progress totals, an empty ZIP and finish failing.
- `api.test.js` checks the three calls: account and path go in the query,
  so the server can check them before reading the file. Its axios mock now
  also records the request options.
- Mutation checks: never retrying, finishing despite problems, re-sending
  existing files, no concurrency cap, low disk not stopping, `__MACOSX` kept,
  Cancel ignored, conflicts uploaded anyway, and an empty ZIP marked complete
  were each caught.
- Suite: 424/424. The build includes zip.js.

---

## 2026-11-02 · v1.66.0 · staging only

### Say where the browser is going before leaving for a sign-in page

The user: when connecting a mailbox redirects to the provider, show a
message or page saying so. Connect with Google, Microsoft or Zoho used to
set `window.location.href` at once - the app vanished into another site
with no word.

Now `ProviderRedirectNotice` (Settings) covers the page with "Taking you to
Microsoft to sign in", says the user signs in on the provider's own page so
ClientGage never sees the password, and that they come back here once the
mailbox is connected. It goes on by itself after 1.5 s
(`REDIRECT_DELAY_MS`); **Continue now** goes at once, **Cancel** stays.

- Same URLs as before, opened with `location.assign` - nothing about the
  sign-in itself changed, nor the server side.
- Coming back with the browser's Back button can restore the page from
  the cache with the notice still up; `pageshow` (persisted) clears it.
- Wording and timing live in `providerRedirect.js`, tested (render tests
  are blocked here); it goes at most once however it is triggered.
- The address-box route ("Connect your email" → Google/Microsoft/Zoho) calls
  the same three handlers, so it gets the notice too.

---

## 2026-11-01 · v1.65.0 · staging only

### The Compose drawer reports what actually happened

It showed "Email Sent" whenever the request returned, whatever the server
said. Since account-contact v1.13.0, Compose sends from the firm's own
mailbox, so a firm with none connected has every email refused - and staff
were still told it was sent. (Before, it went out from a hard-coded
personal Gmail, which is why this never surfaced.)

`composeOutcome` (`src/pages/AccountDashboard/Email/composeOutcome.js`)
reads `{ emailsSent, failed, failures }` (failures since account-contact
v1.13.1):

- all sent → "Email Sent", drawer closes, as before
- none sent → "Email not sent" with the reason (e.g. "No mailbox is
  connected that can send. An admin can connect one in Account Settings
  under Email Sync."), and the drawer **stays open** so the draft is not
  lost
- some sent → "Sent to N of M", naming who was missed and why
- an older server without `failures`: names the failed addresses; an
  unreadable answer is never reported as success

---

## 2026-10-30 · v1.64.0 · staging only

### The activation badge reads the contact, not the account entry

Reported: "Pending Activation" on contacts already using the client portal.
The badge added in `e7b0645` read `activationStatus` / `isActivated` from
the account's contact entry - fields only a per-account activation backend
would send, and that backend was never merged (account-contact `1d7682f`,
reverted). Both were always undefined, so every login-enabled contact fell
through to "Pending". On staging 26 of 32 such contacts were activated.

Now `activationStatusOf(c.contact)` (`src/pages/AccountDashboard/
activationStatus.js`) decides it from the contact record, where
account-contact keeps the truth: activated → Active; otherwise the link's
`activationTokenExpires` gives Pending or Link Expired; no link → Not
Activated. Janavi's four badge styles are kept.

Paired with account-contact v1.12.0, which stops Login off/on and Resend
de-activating a client (the other half of the report) and keeps
`activationTokenExpires` in account details while dropping the password
hash and tokens.

If per-account activation is merged later, this one function is where the
badge changes.

---

## 2026-10-29 · v1.63.0 · staging only

### Auto refresh on every data screen, through one shared hook

The user: auto refresh "works for some screens and for some it doesn't" -
fix it, in both the admin app and the client portal.

**One shared mechanism.** `src/lib/autoRefresh.js` (`startAutoRefresh`,
`keepIfSame`) and `src/hooks/useAutoRefresh.js`. Every 30 seconds while the
tab is visible, and at once on return to the tab or window; nothing while
hidden; never two requests at once; a failed refresh is logged and the next
one still runs; nothing below 5 seconds is accepted. Before this, each screen
that refreshed had its own copy of a setInterval block, with no overlap guard
- and most screens had none, which is why it "worked on some screens".

**Quiet, or not at all.** A screen's normal load usually shows a spinner,
toasts on failure, or clears the list on error. Called every 30 seconds that
would blink the page, stack error toasts, or - where the spinner replaces the
page - unmount an open dialog. So each screen refreshes through a silent path:
no spinner, no toast, a failure keeps what is shown.

**`keepIfSame`.** A quiet refresh hands back the current object when the
server's answer is identical, so React does not re-render. Without it the
shared table jumps back to page 1 every 30 seconds, and chat views scroll to
the bottom.

**Paused while the user is working.** Each screen passes `enabled: false`
while a form, drawer, dialog, signature, upload or save is open or running.

**React Query screens** (accounts, contacts, jobs, tasks, invoices, account
pipelines, payments) take `refetchInterval` instead - React Query already
pauses in a hidden tab, refetches on focus and keeps unchanged data
identical. The two drag-and-drop boards pause while a card is dragged or any
change is saving (`useIsMutating`), so a refetch cannot pull a card back.

**Not refreshed, on purpose:**
- forms - organizer and proposal editors, new proposal, pipeline and
  proposal templates, the import screens, firm settings, My Account
- the account invoice queries (InvoiceList, and Payment's invoice query):
  their queryFn PUTs an "Overdue" status, a write that must not run on a
  timer. They still refresh on return to the tab, as before
- the header badge polls and Communication's chat polls: they already
  refreshed correctly and are left as they were

**Changed polls:** Inbox+ polled every 20s even in a hidden tab and never on
focus; it now uses the hook (still 20s). Internal communication had none; it
now refreshes the list and the open chat every 15s, dropping an answer for a
chat the user has since left.

**Checked by:** a Babel script over every call - inside a component, a
top-level statement, before any early return, and nothing read during render
used before it is declared - proven on deliberately broken input; ESLint
`no-undef` and `rules-of-hooks` on every changed file against the previous
commit (three pre-existing undefined names, none new); the core's 14 unit
tests; the full suite (363) and a production build.

**Pre-existing, found on the way, not changed:** Payment.js calls an
undefined `isInvoiceOverdue`; several `invalidateQueries([...])` calls use
the v4 array form, which in v5 matches every query.

---

## 2026-10-28 · v1.62.0 · staging only

### Zoho mailboxes sign in with Zoho where the server supports it

**Decision:** a Zoho address in the "Connect your email" box, or the Zoho
provider button, goes to Zoho sign-in (signup-login v1.22.0) when
`mailProviders.zoho.available` is true, and to the password form otherwise.
A mailbox connected this way shows "Zoho · signed in with Zoho" and has its
own Disconnect.

**Why:** the user asked to remove app passwords provider by provider. Zoho
with two-factor sign-in required one; signing in with Zoho does not.

**Recognising Zoho:** by the address's domain or the discovered IMAP host
(`imapProviderIdFor`), so a firm's own domain on Zoho - found through its MX
record as imappro.zoho.* - signs in too, and a personal zohomail address is
recognised even if the lookup fails.

**Nothing changes where Zoho sign-in is not set up:** `zoho` is unavailable
by default and in any environment without the ZOHO_* settings, so the box and
the button behave exactly as in v1.61.0 - the password form.

---

## 2026-10-27 · v1.61.0 · staging only

### One "Connect your email" box instead of a row of provider buttons

**Decision:** the Email Sync tab's "Add a mailbox" leads with one address
box. Continue asks signup-login's `/imap/discover` who runs the address, and
`routeForDiscovery` (`src/pages/Settings/connectRoute.js`) sends it to Google
sign-in, Microsoft sign-in, or the password form with the server filled in.
The seven provider buttons stay, behind "Choose your provider instead".

**Why:** the user compared this with TaxDome, where connecting a mailbox
feels like typing an email and a password. For Gmail and Outlook that is
the provider's own sign-in page (OAuth), which we already had - but people
had to know to pick the right button, and a firm on Google Workspace or
Microsoft 365 with its own domain had no way to tell which one was theirs.
The server already knew; it now says so (signup-login v1.21.0).

**When the right door is not open:** if the server cannot connect that
provider yet (Microsoft before the Azure registration, IMAP without
`MAIL_SECRET_KEY`), the box says so instead of redirecting to a 503.

**If the lookup fails:** the password form opens with its manual server
fields, which is what the old form did on the same failure.

**Rejected:** detecting the provider in the browser. Workspace and 365
domains can only be recognised from their MX records, which needs the server.

**Not changed:** the tab bar, the connected-mailbox list, the IMAP form, and
the Gmail/Microsoft redirects themselves.

---

## 2026-10-24 · Test harness (staging only)

### A static guard against module-scope hooks, and why not a render test

The only test here was Create React App boilerplate asserting the app
renders a "learn react" link. It does not, and has not for a long time —
it had been failing silently because nobody ran it. Removed.

**What replaced it: `src/__tests__/noModuleScopeHooks.test.js`.** It parses
every source file with `@babel/parser` and fails any `use*` call that has
no function parent.

**Why this one test, before any other:** it encodes the v1.48.0 outage. A
hook at module scope throws on *import*, so it does not break one screen —
it kills every route, as a white page, in production, while the build still
succeeds. Nothing in the normal pipeline catches it.

**Why static rather than a render test:** no provider tree to construct, so
it cannot go stale when the stack changes; it covers all 292 files rather
than the few a render test would reach; and it runs in about 4 seconds
warm. A render test would check one component and break for unrelated
reasons.

**It proves itself.** Five self-tests assert the detector flags a
module-scope hook, flags the exact v1.48.0 shape, and does *not* flag hooks
inside components, custom hooks or arrow components. A guard that cannot
fail is worth nothing.

### Render and component tests are currently blocked

An import smoke test on `App.js` was attempted and abandoned. The chain:

1. `react-router-dom@7.15.1` declares `main: ./dist/main.js`, **which does
   not exist**. Only its `exports` map is correct, and CRA 5 ships jest 27,
   which cannot read exports maps.
2. Mapping that exposed `react-router/dom`, another exports subpath.
3. Then jsdom under jest 27 has no `TextEncoder`, which react-router 7
   needs at import.
4. Then an untransformed ESM dependency — `Unexpected token 'export'` —
   and the single test took **384 seconds**.

**Decision: stop there.** Steps 1–3 are fixed and kept (`moduleNameMapper`
in `package.json`, a `TextEncoder`/`TextDecoder` polyfill in
`setupTests.js`) because they are correct and are prerequisites for any
future component test. Step 4 needs `transformIgnorePatterns` work, or
migrating off `react-scripts` to Vite — a real project, not a test fix.

**What that means in practice:** unit tests of pure modules work today,
component and render tests do not. Do not plan on a render test here until
step 4 is resolved.

### Mocking axios: CRA sets `resetMocks: true`

It strips the implementation from every `jest.fn` before each test, so a
mock built from `jest.fn()` loses its body and silently records nothing —
the failure looks like wiring, not configuration, and took a diagnostic run
to find. `src/services/api.test.js` uses plain functions and counts calls by
hand for that reason.

---

## v1.59.0 · `91be04a`

### Encode the attachment id before putting it in the URL

**Decision:** `encodeURIComponent(attachmentId)` in
`services/api.js#getAttachmentData`.

**Reasoning:** Gmail attachment ids are opaque and can contain characters
that change the meaning of a URL path. Unencoded, the request reached a
different path than intended and returned 404 or 500 — which looked like a
missing document rather than a malformed request.

---

## v1.58.0 · `4832b84`

### An audit call must not block opening a document, and opening must not download

Two fixes in `FolderTreeView.js`.

**The audit call** was awaited before the document opened, so a failing or
slow `viewDocument` call stopped the open entirely. Now wrapped:

```js
try {
  await accountDocsAPI.viewDocument({ filePath: fullPath });
} catch (auditErr) {
  console.error("VIEW audit failed (document still opens):", ...);
}
```

**Reasoning:** the audit row records that someone looked at a document. It is
a record *about* the action, not part of it. Letting it block means an audit
problem presents as a broken document. The same reasoning produced
folder-mangement v1.5.0 on the server side.

**Opens were downloading** because the fallback path rendered a bare iframe,
and `express.static` serves `docx`, `xlsx`, `heic`, `msg`, `eml`, `rtf` and
`zip` with content types browsers download rather than render. The fallback
now routes through the same viewer as the normal path, which offers an
explicit download rather than forcing one.

---

## v1.57.0 · `c1e3d15`

### Offer sequential signing without making it the default

**Decision:** a `signInOrder` checkbox, defaulting to off.

**Reasoning:** DocuSeal's `order` parameter defaults to `"preserved"`
(sequential), which is why only the first recipient was being notified. Most
of this firm's requests want both parties notified at once. Sequential is
genuinely wanted sometimes, so it is offered rather than removed.

---

## v1.48.0 · `065a50f`

### The blank-screen incident — read this before editing the large files

**What happened:** two `useState` calls landed at **module scope** in
`FolderTreeView.js`, so the file threw
`TypeError: Cannot read properties of null (reading 'useState')` on import.
That killed not one screen but **every route in the app** — a white page in
production.

**Root cause:** the edit was anchored on the text
`const [showBuilderFor...]`, which matched the **commented-out copy** of the
component rather than the live one. The new lines were inserted relative to
dead code, outside the component body.

| file | total lines | commented |
|---|---|---|
| `src/pages/AccountDashboard/Documents/FolderTreeView.js` | 5,984 | 2,258 |
| `src/pages/Settings/MyAccount.js` | 2,860 | 930 |

**Decision:** in these two files, use **line-targeted edits**, never textual
anchors. Confirm the anchor is unique first:

```bash
grep -n "<anchor>" src/pages/.../File.js
```

**Rejected — deleting the commented-out code.** It is the obvious fix and the
right one eventually, but it is a ~3,200-line deletion across two files that
are under active change, and nobody has confirmed none of it is still wanted
as reference. Recorded here so the cost of keeping it stays visible.

**How it was found:** a jsdom harness that imports the built bundle and
reports `root children: N`. `0` means the app did not mount. Worth
rebuilding if it happens again — nothing in the normal build output catches
this, because the build succeeds.

---

## v1.46.0 / v1.45.0 · `30eb44b`, `a863975`

### Reviewer notes are a heading with an append-only log; Notes stays the default tab

**Decision:** reviewer notes render as a heading with entries appended
beneath, with no edit control. The default tab on the account page remains
**Notes**.

**Reasoning:** a reviewer note records what was observed at a point in time;
an editable entry stops being a record. The server-side constraint lives in
account-note-backend v1.2.0 and v1.3.0.

The default tab was briefly changed to Reviewer Notes and reverted — ordinary
notes are what people reach for most often.

**Rejected — an edit control and a plus icon on reviewer note entries.** An
earlier implementation added both and defeated the guarantee the feature
exists to provide.

---

## v1.44.0 · `6e74ec8`

### Trash must not hide items the server could not attribute

**Decision:** show items the server returned without attribution rather than
filtering them out.

**Reasoning:** filtering made documents vanish from Trash entirely — the user
could neither see nor restore them, and nothing said why. An item shown
without an attributed actor is still recoverable; an item hidden is not.

---

## Standing constraints

### `DISABLE_ESLINT_PLUGIN=true` in the build is a hazard

It is set in `package.json`'s `build` script because the build otherwise
fails on pre-existing lint errors. The cost is that **`no-undef` is also
suppressed**, so an undefined identifier compiles cleanly and reaches
production as a runtime error.

Removing it means fixing the accumulated lint debt first. Until then, do not
rely on the build to catch a typo'd identifier.

### Capture the real exit code when building

Piping the build through `tail` reports `tail`'s exit status, which is always
0. A build that died partway then looks successful. This has produced a
"successful" build with no JS emitted at all.

### No secret may appear in a `REACT_APP_*` variable

Everything prefixed `REACT_APP_` is compiled into the bundle and readable by
anyone who loads the page. `DOCUSEAL_API_KEY` in particular stays server-side
in esignature-backend. This applies to any new key, without exception.

### One missing env var breaks one feature, silently

`services/api.js` fans out to 15 backends, each behind its own
`REACT_APP_*` variable. A missing one fails only the screen that uses it, so
it presents as a code bug rather than as configuration.

---

## Known issues, not yet fixed

| issue | detail |
|---|---|
| ~3,200 lines of commented-out duplicate code | In `FolderTreeView.js` and `MyAccount.js`. Has already caused one production outage. |
| `DISABLE_ESLINT_PLUGIN=true` | Suppresses `no-undef`; undefined identifiers reach production. |
| Three state systems | Redux Toolkit, React Query and Context are all in use. Nothing documents which owns what. |
| Hardcoded production URL fallbacks | Around a dozen across the repos, of the form `process.env.X \|\| "https://www.snptaxes.com/..."`. A missing variable silently targets production instead of failing. |
