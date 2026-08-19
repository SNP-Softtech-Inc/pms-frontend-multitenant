# Dependency Audit — `package.json`

Usage was verified with real import/reference searches across the whole repo (`src/**`, config files, HTML — not just guessed from names).

**Update (2026-08-18):** The 9 confirmed-dead packages listed below have been removed via `npm uninstall` (`package.json` + `package-lock.json` updated, `node_modules` pruned). Everything else in this report (duplicates that ARE in use, devDependency placement) is still open and untouched.

---

## 1. Duplicate / overlapping libraries

### Drag-and-drop (4 different libraries doing the same job)

| Package | Used in | Recommendation |
|---|---|---|
| `@hello-pangea/dnd` | 3 files — `TasksTemplate.js`, `KanbanBoard.js`, `Pipeline.js` | **Keep** — most-used, actively maintained fork of react-beautiful-dnd |
| `react-beautiful-dnd` | 1 file — `ChatTemplate.js` | Migrate this file to `@hello-pangea/dnd` (drop-in API-compatible fork), then remove. Original package is deprecated/unmaintained. |
| `react-dnd` + `react-dnd-html5-backend` | 2 files — `organizertempSection.js`, `OrgaizerTemplate.js` | Migrate to `@hello-pangea/dnd` for consistency, then remove both. |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | **0 files — not imported anywhere** | ✅ Removed |

### Rich text editors (up to 4 ecosystems installed, 2 dead)

| Package | Used in | Recommendation |
|---|---|---|
| `@ckeditor/ckeditor5-build-classic`, `@ckeditor/ckeditor5-react`, `ckeditor5`, `@ckbox/core`, `ckbox` | 9+ files — `src/TextEditor/*`, `src/components/textEditor/*` | **Keep** — this is the primary/active editor stack |
| `quill`, `react-quill`, `quill-emoji` | 3 files, but `src/components/Editor.js` has ~250 lines of dead commented-out quill/tiptap code above the one active quill block | Clean up dead commented code in `Editor.js`; decide if this second editor stack should be replaced by CKEditor for consistency |
| `quill-better-table` | **0 files — not imported anywhere** | ✅ Removed |
| `react-draft-wysiwyg`, `draftjs-to-html` | **0 files — not imported anywhere** | ✅ Removed |
| `@tiptap/extension-image` | **0 files — not imported anywhere** (only a stray code comment mentions "mui-tiptap") | ✅ Removed |

### Icon libraries (3 installed)

| Package | Used in | Recommendation |
|---|---|---|
| `lucide-react` | 172 files — dominant, used throughout `src/components/ui/*` (shadcn primitives) | **Keep** — primary icon set |
| `@mui/icons-material` | 79 files | **Keep** — tied to MUI usage; removing means re-icon-ing 79 files |
| `react-icons` | 35 files | Redundant third icon set. Consolidate into `lucide-react` over time; not urgent given 35-file footprint |

### Date libraries (2 installed)

| Package | Used in | Recommendation |
|---|---|---|
| `dayjs` | 10 files | Pick one. `dayjs` is smaller and mimics moment's API; `date-fns` is more tree-shakeable/functional. Either is fine — the issue is having both. |
| `date-fns` | 8 files | See above — usage is nearly even, so this needs a team decision rather than an obvious winner. |

### Toast/notification libraries (2 installed)

| Package | Used in | Recommendation |
|---|---|---|
| `react-toastify` | 66 files — dominant | **Keep** |
| `sonner` | 3 files — `src/index.js`, `src/context/ToastContext.js`, `src/components/ui/sonner.jsx` | Sonner was pulled in as part of the shadcn `ui/` kit. Migrate the 3 usages to `react-toastify` and drop `sonner`, or vice versa — but not both. |

### Switch component (2 installed)

| Package | Used in | Recommendation |
|---|---|---|
| `@radix-ui/react-switch` | 1 file — `src/components/ui/switch.jsx` (shadcn wrapper) | **Keep** — part of the Radix/shadcn primitive layer |
| `react-switch` | **0 files — not imported anywhere** | ✅ Removed |

### Unused/dead package

| Package | Used in | Recommendation |
|---|---|---|
| `redux` | **0 files** — only `react-redux` (79 files) and `@reduxjs/toolkit` are imported directly | ✅ Removed (still resolved in `node_modules` transitively via `@reduxjs/toolkit`) |

### Architectural note (not a simple "remove," flagging for awareness)

Two full component/design systems are installed side-by-side:
- **MUI** (`@mui/material`, `@mui/x-data-grid`, `@mui/x-date-pickers`, `@mui/icons-material`) — 125 files
- **Radix + shadcn-style primitives** (`@radix-ui/react-*`, `class-variance-authority`, `cmdk`, `vaul`, `tailwind-merge`, `next-themes`) — confined to `src/components/ui/*.jsx`

This isn't a redundant/accidental duplicate the way the DnD or toast libraries are — it looks like a deliberate newer shadcn-based design system layered on top of an older MUI-based one. Worth a conscious decision on long-term direction, but not a quick dependency removal.

---

## 2. Dependencies that belong in `devDependencies`

These are build-time or test-only packages currently listed under `dependencies`, so they get pulled into production install/audit surfaces unnecessarily:

| Package | Why it's dev-only | Confirmed via |
|---|---|---|
| `@testing-library/react` | Only used in `src/App.test.js` | grep |
| `@testing-library/jest-dom` | Only used in `src/setupTests.js` | grep |
| `@testing-library/user-event` | Not imported anywhere directly (transitive test helper) | grep |
| `@testing-library/dom` | Not imported anywhere directly (transitive dep of `@testing-library/react`) | grep |
| `web-vitals` | Only dynamically imported inside `src/reportWebVitals.js`, a build-support file | grep |
| `tailwind-scrollbar-hide` | Only referenced in `tailwind.config.js` (`require("tailwind-scrollbar-hide")`), a build-time Tailwind plugin — not shipped in the app bundle | grep |

Note: CRA's default template historically places `@testing-library/*` and `web-vitals` under `dependencies` rather than `devDependencies` — so this repo isn't unusual, but it is still technically incorrect since none of these ship in the production bundle.

---

## 3. Summary table — all flagged packages

| Package | Issue | Suggested action |
|---|---|---|
| `@dnd-kit/core` | Unused | ✅ Removed |
| `@dnd-kit/sortable` | Unused | ✅ Removed |
| `@dnd-kit/utilities` | Unused | ✅ Removed |
| `react-beautiful-dnd` | Duplicate of `@hello-pangea/dnd`, deprecated upstream | Still installed — used in 1 file (`ChatTemplate.js`), needs code migration first |
| `react-dnd` | Duplicate DnD library | Still installed — used in 2 files, needs code migration first |
| `react-dnd-html5-backend` | Duplicate DnD library | Still installed — used alongside `react-dnd`, needs code migration first |
| `quill-better-table` | Unused | ✅ Removed |
| `react-draft-wysiwyg` | Unused | ✅ Removed |
| `draftjs-to-html` | Unused | ✅ Removed |
| `@tiptap/extension-image` | Unused | ✅ Removed |
| `react-switch` | Unused (Radix version is used instead) | ✅ Removed |
| `redux` | Unused directly (transitive via RTK) | ✅ Removed |
| `sonner` | Duplicate of `react-toastify` | Migrate 3 files, then remove (or migrate the other way) |
| `react-icons` | Duplicate of `lucide-react` / `@mui/icons-material` | Consolidate opportunistically, low priority |
| `dayjs` / `date-fns` | Two date libraries, near-even usage | Team decision, then migrate the loser |
| `@testing-library/react` | Wrong dependency type | Move to `devDependencies` |
| `@testing-library/jest-dom` | Wrong dependency type | Move to `devDependencies` |
| `@testing-library/user-event` | Wrong dependency type | Move to `devDependencies` |
| `@testing-library/dom` | Wrong dependency type | Move to `devDependencies` |
| `web-vitals` | Wrong dependency type | Move to `devDependencies` |
| `tailwind-scrollbar-hide` | Wrong dependency type | Move to `devDependencies` |

---

## Code changes required?

Only if you decide to act on the **duplicate-library** rows above (drag-and-drop, sonner→toastify, date-fns/dayjs). Those require touching the specific files listed in each section to swap the import/API before the losing package can be safely removed.

The **unused packages** (marked "Remove", 0 files importing them) and the **devDependencies move** rows require **zero code changes** — they're pure `package.json` edits.

No changes have been made per your instructions — this file is analysis only.
