# Decisions

Why things were done the way they were. A diff shows *what* changed; this
records *why*, and what was rejected.

Newest first. Add an entry when a reader would otherwise ask "why was it done
this way?" — not for routine edits. Update it in the same commit as the code.

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
