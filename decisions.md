# Decisions

Why things were done the way they were. A diff shows *what* changed; this
records *why*, and what was rejected.

Newest first. Add an entry when a reader would otherwise ask "why was it done
this way?" — not for routine edits. Update it in the same commit as the code.

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
