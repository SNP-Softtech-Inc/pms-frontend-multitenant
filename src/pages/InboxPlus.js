import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import {
  Archive,
  Check,
  Mail,
  Paperclip,
  Search,
  SlidersHorizontal,
  X,
  ExternalLink,
  Undo2,
} from "lucide-react";
import {
  FileText,
  // Archive,
  RefreshCw,
  ArrowUpDown,
  AtSign,
  Settings2,
  MailOpen,
  Copy,
  MessageSquare,
  Receipt,
  ListTodo,
  CalendarDays,
  PenLine,
  FileCheck,
  Bell,
  // ExternalLink,
  // Paperclip,
} from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useToastContext } from "../context/ToastContext";
import { Button as ShadButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

import { authAPI } from "../services/api";

const extractMongoId = (subject = "") => {
  const match = subject.match(/#([a-f0-9]{24})\b/i);
  return match ? match[1] : null;
};
const cleanSubjectText = (subject = "") =>
  subject.replace(/#[a-f0-9]{24}\b/i, "").trim();

const getPreview = (html = "") => html.replace(/<[^>]*>?/gm, "");

const escapeHtml = (str = "") =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Opens a blob URL inside a real HTML wrapper (with a proper <title> and
// the file embedded via <iframe>) instead of navigating the tab directly
// to the blob: URL. Direct navigation makes Chrome's standalone PDF
// viewer derive its displayed name from the URL itself - always a random
// UUID for blob: URLs - regardless of the underlying object's filename.
// The window must be opened synchronously inside the click handler and
// passed in here. Browsers only honour window.open while a user gesture is
// still active, and the attachment has to be fetched first - opening it
// after that await was silently blocked, which is why clicking a document
// appeared to do nothing at all.
const openNamedFileInViewer = (viewerWindow, blobUrl, filename) => {
  if (!viewerWindow) return false;

  viewerWindow.document.write(`
    <html>
      <head><title>${escapeHtml(filename)}</title></head>
      <body style="margin:0;">
        <iframe src="${blobUrl}" title="${escapeHtml(
          filename,
        )}" style="width:100%;height:100vh;border:none;"></iframe>
      </body>
    </html>
  `);
  viewerWindow.document.close();
  return true;
};

// Renders delimited text as a table in the claimed tab. A browser will not
// display a .csv inline - it downloads it - so previewing one means building
// the view ourselves. papaparse is already a dependency and handles quoted
// fields, embedded newlines and delimiter detection, which hand-splitting on
// commas does not.
const openDelimitedTextInViewer = (viewerWindow, text, filename) => {
  if (!viewerWindow) return false;

  const parsed = Papa.parse(text, {
    skipEmptyLines: true,
  });

  const rows = Array.isArray(parsed?.data) ? parsed.data : [];
  if (!rows.length) return false;

  const [headerRow, ...bodyRows] = rows;

  const headCells = headerRow
    .map((cell) => `<th>${escapeHtml(String(cell ?? ""))}</th>`)
    .join("");

  const bodyHtml = bodyRows
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${escapeHtml(String(cell ?? ""))}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  viewerWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(filename)}</title>
        <meta charset="utf-8" />
        <style>
          body { margin: 0; font-family: system-ui, -apple-system, Segoe UI, Arial, sans-serif; background: #fff; color: #202124; }
          header { padding: 12px 16px; border-bottom: 1px solid #e0e0e0; font-size: 14px; font-weight: 600; position: sticky; top: 0; background: #fff; }
          .meta { font-weight: 400; color: #5f6368; margin-left: 8px; }
          .wrap { overflow: auto; }
          table { border-collapse: collapse; font-size: 13px; width: max-content; min-width: 100%; }
          th, td { border: 1px solid #e0e0e0; padding: 6px 10px; text-align: left; white-space: pre-wrap; vertical-align: top; }
          th { background: #f1f3f4; position: sticky; top: 0; font-weight: 600; }
          tbody tr:nth-child(even) { background: #fafafa; }
        </style>
      </head>
      <body>
        <header>${escapeHtml(filename)}<span class="meta">${bodyRows.length} row(s)</span></header>
        <div class="wrap">
          <table>
            <thead><tr>${headCells}</tr></thead>
            <tbody>${bodyHtml}</tbody>
          </table>
        </div>
      </body>
    </html>
  `);
  viewerWindow.document.close();
  return true;
};

// Falls back to a normal download when the viewer tab could not be opened,
// so a blocked popup still gets the user their file instead of nothing.
const downloadBlobUrl = (blobUrl, filename) => {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const buildAccountLink = (mongoId) => {
  return `/admin/clients/accounts/accountsdash/overview/${mongoId}`;
};
// React Router's navigate() resolves paths relative to the router's
// basename (="/admin"), unlike a plain <a href>. Passing buildAccountLink's
// /admin-prefixed path into navigate() double-prefixes the URL
// (/admin/admin/...), so navigate() calls must use this basename-relative
// path instead.
const buildAccountPath = (mongoId) => {
  return `/clients/accounts/accountsdash/overview/${mongoId}`;
};

// const renderLinkedSubject = (subject) => {
//   const mongoId = extractMongoId(subject);

//   const text = cleanSubjectText(subject) || "(No Subject)";

//   if (!mongoId) {
//     return text;
//   }

//   return (
//     <a
//       href={buildAccountLink(mongoId)}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="text-primary hover:underline font-medium"
//     >
//       {text}
//     </a>
//   );
// };
// navigate is passed in from the component so clicking a linked subject
// stays inside the SPA (React Router navigation) instead of a hard
// target="_blank" navigation into a brand-new tab/window - a new tab has
// no in-memory auth state and has to cold-start a token refresh, which is
// what was causing "please log in again" even with an active session.
const renderLinkedSubject = (subject, navigate) => {
  const mongoId = extractMongoId(subject);
  const text = cleanSubjectText(subject) || "(No Subject)";

  if (!mongoId) {
    return text;
  }

  const goToAccount = (e) => {
    e.preventDefault();
    navigate(buildAccountPath(mongoId));
  };

  // Match "from", "for", "by", or "with" and everything after it
  const match = text.match(/^(.*?\b(from|for|by|with)\b\s+)(.+)$/i);

  if (!match) {
    return (
      <a
        href={buildAccountLink(mongoId)}
        onClick={goToAccount}
        className="text-primary hover:underline font-medium"
      >
        {text}
      </a>
    );
  }

  const prefix = match[1]; // e.g. "Message from "
  const linkedText = match[3]; // e.g. "John Doe"

  return (
    <>
      {prefix}
      <a
        href={buildAccountLink(mongoId)}
        onClick={goToAccount}
        className="text-primary hover:underline font-medium"
      >
        {linkedText}
      </a>
    </>
  );
};
export default function InboxPlus() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [archivedNotifications, setArchivedNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("inbox");
  // Newest first by default, matching the reference layout's sort control.
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastContext();

  useEffect(() => {
    fetchData();

    // The list previously only ever loaded once on mount - a new client
    // message/notification wouldn't show up until the admin manually
    // reloaded the page. Poll quietly in the background so new items
    // appear on their own while this page is open.
    const pollId = setInterval(() => fetchData(true), 20000);
    return () => clearInterval(pollId);
  }, []);

  const fetchData = async (silent = false) => {
    // Background polling refetches shouldn't flash the full-page loading
    // spinner or pop an error toast for a single transient failure - only
    // the initial load and manual actions do that.
    if (!silent) setLoading(true);
    try {
      // Fetch both inbox and archived in parallel using the query parameter
      const [inboxRes, archivedRes] = await Promise.all([
        authAPI.getEmailNotifications(false), // archived=false
        authAPI.getEmailNotifications(true), // archived=true
      ]);

      // Note: Your backend returns data in data.threads
      const inboxThreads = inboxRes?.data?.data?.threads || [];
      const archivedThreads = archivedRes?.data?.data?.threads || [];
      console.log("hgftcvhgb list", inboxThreads);
      setNotifications(inboxThreads);
      setArchivedNotifications(archivedThreads);

      console.log("Fetched threads:", {
        inbox: inboxThreads.length,
        archived: archivedThreads.length,
      });
    } catch (err) {
      console.error(err);
      if (!silent) {
        showToast({
          title: "Error",
          description: "Failed to fetch notifications",
          type: "error",
          duration: 4000,
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Get current view data
  const currentData =
    viewMode === "inbox" ? notifications : archivedNotifications;

  // Add this state near the other useState declarations
  const [activeFilters, setActiveFilters] = useState({
    all: true,
    invoices: false,
    documents: false,
    emails: false,
    tasks: false,
    organizers: false,
    chats: false,
    signatures: false,
    proposals: false,
    system: false,
    newAccounts: false,
    jobs: false,
    accountSettings: false,
    mentions: false,
    sms: false,
    clientRequests: false,
  });

  // A notification's symbol comes from what it is about, so a document, a
  // chat message and a signature are told apart at a glance rather than all
  // sharing one generic icon. Order matters: "Document ... signed by ..."
  // carries both "document" and "signed", and the signature reading is the
  // more specific one, so it is tested first.
  const NOTIFICATION_ICONS = [
    { match: ["signed", "signature", "esign"], Icon: PenLine, className: "text-violet-600" },
    { match: ["invoice", "payment", "bill", "receipt", "paid"], Icon: Receipt, className: "text-amber-600" },
    { match: ["task", "todo", "assignment", "assigned"], Icon: ListTodo, className: "text-indigo-600" },
    { match: ["organizer", "calendar", "meeting", "event"], Icon: CalendarDays, className: "text-rose-600" },
    { match: ["approval", "approved", "proposal", "quote", "estimate"], Icon: FileCheck, className: "text-teal-600" },
    { match: ["message", "chat", "conversation", "replied"], Icon: MessageSquare, className: "text-emerald-600" },
    { match: ["document", "file", "attachment", "pdf", "upload"], Icon: FileText, className: "text-blue-600" },
    { match: ["email", "mail"], Icon: Mail, className: "text-sky-600" },
  ];

  const getNotificationIcon = (subject = "") => {
    const text = String(subject).toLowerCase();
    const hit = NOTIFICATION_ICONS.find((entry) =>
      entry.match.some((keyword) => text.includes(keyword)),
    );
    return hit || { Icon: Bell, className: "text-gray-400" };
  };

  // Add filter categories with their search keywords
  const filterCategories = [
    { key: "all", label: "All", keywords: [] },
    {
      key: "invoices",
      label: "Invoices",
      keywords: ["invoice", "payment", "bill", "receipt"],
    },
    {
      key: "documents",
      label: "Documents",
      keywords: ["document", "file", "attachment", "pdf"],
    },
    { key: "emails", label: "Emails", keywords: ["email", "mail"] },
    {
      key: "tasks",
      label: "Tasks",
      keywords: ["task", "todo", "assignment", "assigned"],
    },
    {
      key: "organizers",
      label: "Organizers",
      keywords: ["organizer", "calendar", "meeting", "event"],
    },
    {
      key: "messages",
      label: "Chats",
      keywords: ["chat", "conversation", "message"],
    },
    {
      key: "signatures",
      label: "Signatures",
      keywords: ["signed", "sign", ],
    },
    {
      key: "proposals",
      label: "Proposals",
      keywords: ["proposal", "quote", "estimate", "bid"],
    },
    {
      key: "approvals",
      label: "Approvals",
      keywords: ["approved", "cancelled", "rejected", "approval"],
    },
     {
      key: "accounts",
      label: "Accounts",
      keywords: ["account", "user", "profile", "settings"],
    },
  ];

  // Update the filteredThreads useMemo to include filters
  // Badge on "All notifications" in the left nav.
  // Number of category filters actually applied. "all" is the absence of a
  // filter, so it is not counted - the button previously gave no indication
  // at all of how many were active.
  const activeFilterCount = useMemo(
    () =>
      Object.keys(activeFilters).filter(
        (key) => key !== "all" && activeFilters[key],
      ).length,
    [activeFilters],
  );

  const unreadCount = useMemo(
    () => notifications.filter((t) => !t.latest?.isRead).length,
    [notifications],
  );

  const filteredThreads = useMemo(() => {
    const rows = currentData.filter((thread) => {
      const subject = thread.latest?.subject || "";
      const body = getPreview(thread.latest?.body || "");
      const from = thread.latest?.from || "";
      const combinedText = `${subject} `.toLowerCase();

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          subject.toLowerCase().includes(q) ||
          body.toLowerCase().includes(q) ||
          from.toLowerCase().includes(q);

        if (!matchesSearch) return false;
      }

      // Category filters - search for keywords in subject or body
      if (!activeFilters.all) {
        const activeFilterKeys = Object.keys(activeFilters).filter(
          (key) => key !== "all" && activeFilters[key],
        );

        // If no specific filters are active, show all
        if (activeFilterKeys.length === 0) return true;

        // Check if thread matches any active filter based on keywords
        return activeFilterKeys.some((filterKey) => {
          const filterConfig = filterCategories.find(
            (f) => f.key === filterKey,
          );
          if (!filterConfig) return false;

          // Check if any keyword from this filter appears in the combined text
          return filterConfig.keywords.some((keyword) =>
            combinedText.includes(keyword.toLowerCase()),
          );
        });
      }

      return true;
    });

    // The list had no ordering of its own - it rendered in whatever order the
    // API returned. Sorting here, newest first by default, matches the
    // reference layout's "Newest first" control.
    const byDate = (thread) => {
      const raw = thread.latest?.date || thread.latest?.createdAt;
      const t = raw ? new Date(raw).getTime() : 0;
      return Number.isNaN(t) ? 0 : t;
    };

    return [...rows].sort((a, b) =>
      sortNewestFirst ? byDate(b) - byDate(a) : byDate(a) - byDate(b),
    );
  }, [currentData, searchQuery, activeFilters, sortNewestFirst]);

  // Add this function to handle filter changes
  const handleFilterChange = (filterKey) => {
    if (filterKey === "all") {
      // If "All" is clicked, reset all filters
      const newFilters = {};
      Object.keys(activeFilters).forEach((key) => {
        newFilters[key] = key === "all";
      });
      setActiveFilters(newFilters);
    } else {
      // Toggle the specific filter
      setActiveFilters((prev) => ({
        ...prev,
        all: false, // Deselect "All" when any specific filter is selected
        [filterKey]: !prev[filterKey],
      }));
    }
  };

  const handleMarkAsRead = async (threadId) => {
    const toastId = showToast({
      title: "Processing...",
      description: "Marking thread as read",
      type: "loading",
      duration: Infinity,
    });

    try {
      await authAPI.markThreadAsRead(threadId);

      // Update in both states if needed
      setNotifications((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? {
                ...t,
                latest: { ...t.latest, isRead: true },
              }
            : t,
        ),
      );

      setArchivedNotifications((prev) =>
        prev.map((t) =>
          t._id === threadId
            ? {
                ...t,
                latest: { ...t.latest, isRead: true },
              }
            : t,
        ),
      );

      showToast({
        id: toastId,
        title: "Success",
        description: "Thread marked as read successfully",
        type: "success",
        duration: 3000,
      });
    } catch (e) {
      console.error(e);
      showToast({
        id: toastId,
        title: "Error",
        description: "Failed to mark thread as read",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleArchiveThread = async (threadId) => {
    try {
      await authAPI.archiveThread(threadId);

      // Find the thread being archived
      const threadToArchive = notifications.find((t) => t._id === threadId);

      // Remove from inbox
      setNotifications((prev) => prev.filter((t) => t._id !== threadId));

      // Add to archived
      if (threadToArchive) {
        setArchivedNotifications((prev) => [
          { ...threadToArchive, isArchived: true },
          ...prev,
        ]);
      }

      setSelectedThread(null);

      showToast({
        title: "Success",
        description: "Thread archived successfully",
        type: "success",
        duration: 3000,
      });
    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to archive thread. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleUnarchiveThread = async (threadId) => {
    try {
      await authAPI.unarchiveThread(threadId);

      // Find the thread being unarchived
      const threadToUnarchive = archivedNotifications.find(
        (t) => t._id === threadId,
      );

      // Remove from archived
      setArchivedNotifications((prev) =>
        prev.filter((t) => t._id !== threadId),
      );

      // Add to inbox
      if (threadToUnarchive) {
        setNotifications((prev) => [
          { ...threadToUnarchive, isArchived: false },
          ...prev,
        ]);
      }

      setSelectedThread(null);

      showToast({
        title: "Success",
        description: "Thread restored to inbox",
        type: "success",
        duration: 3000,
      });
    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to unarchive thread. Please try again.",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleBulkArchive = async () => {
    if (selectedRows.length === 0) {
      showToast({
        title: "No Selection",
        description: "Please select at least one thread to archive",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      // Promise.all rejects on the first failure, so one bad id reported the
      // whole batch as failed and moved nothing - even the threads that had
      // archived fine. allSettled lets each one stand or fall on its own and
      // the list reflect what actually happened.
      const results = await Promise.allSettled(
        selectedRows.map((id) => authAPI.archiveThread(id)),
      );

      const archivedIds = selectedRows.filter(
        (_, i) => results[i].status === "fulfilled",
      );
      const failedIds = selectedRows.filter(
        (_, i) => results[i].status === "rejected",
      );

      const threadsToArchive = notifications.filter((t) =>
        archivedIds.includes(t._id),
      );

      setNotifications((prev) =>
        prev.filter((t) => !archivedIds.includes(t._id)),
      );
      setArchivedNotifications((prev) => [
        ...threadsToArchive.map((t) => ({ ...t, isArchived: true })),
        ...prev,
      ]);

      // Keep whatever failed selected so it can be retried.
      setSelectedRows(failedIds);

      if (archivedIds.length > 0) {
        showToast({
          title: "Archived",
          description: `${archivedIds.length} thread(s) archived`,
          type: "success",
          duration: 3000,
        });
      }

      if (failedIds.length > 0) {
        showToast({
          title: "Some could not be archived",
          description: `${failedIds.length} thread(s) failed and are still selected`,
          type: archivedIds.length > 0 ? "warning" : "error",
          duration: 4000,
        });
      }
    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to archive selected threads",
        type: "error",
        duration: 4000,
      });
    }
  };

  const handleBulkUnarchive = async () => {
    if (selectedRows.length === 0) {
      showToast({
        title: "No Selection",
        description: "Please select at least one thread to restore",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const threadsToUnarchive = archivedNotifications.filter((t) =>
        selectedRows.includes(t._id),
      );

      // Unarchive all selected threads
      await Promise.all(selectedRows.map((id) => authAPI.unarchiveThread(id)));

      // Update state
      setArchivedNotifications((prev) =>
        prev.filter((t) => !selectedRows.includes(t._id)),
      );
      setNotifications((prev) => [
        ...threadsToUnarchive.map((t) => ({ ...t, isArchived: false })),
        ...prev,
      ]);

      setSelectedRows([]);

      showToast({
        title: "Success",
        description: `${selectedRows.length} thread(s) restored successfully`,
        type: "success",
        duration: 3000,
      });
    } catch (e) {
      console.error(e);
      showToast({
        title: "Error",
        description: "Failed to restore selected threads",
        type: "error",
        duration: 4000,
      });
    }
  };

  const openAttachment = async (attachment) => {
     console.log("=== OPEN ATTACHMENT ===");
    console.log("Full attachment object:", attachment);
    console.log("Attachment ID being sent:", attachment?.attachmentId);
    console.log("Filename:", attachment?.filename);

    // Claim the tab now, while the click's user gesture is still active.
    // Doing this after the fetch below gets blocked by the popup blocker,
    // which is what made clicking a document do nothing. Files that turn
    // out to be downloads rather than previews close it again.
    let viewerWindow = null;
    try {
      viewerWindow = window.open("", "_blank");
    } catch {
      viewerWindow = null;
    }

    const closeViewer = () => {
      try {
        if (viewerWindow && !viewerWindow.closed) viewerWindow.close();
      } catch {
        // Nothing to do - the tab is the user's to close at that point.
      }
    };

    // Hand the claimed tab the file. Calling window.open() again at this
    // point would be blocked, because the click's user gesture is long gone
    // by the time the fetch resolves.
    const previewInClaimedTab = (blobUrl, name) => {
      if (openNamedFileInViewer(viewerWindow, blobUrl, name)) return;
      downloadBlobUrl(blobUrl, name);
      showToast({
        title: "Opened as a download",
        description:
          "Allow pop-ups for this site to preview documents in a tab instead.",
        type: "info",
        duration: 5000,
      });
    };

    try {
      if (!attachment) {
        closeViewer();
        showToast({
          title: "Error",
          description: "No attachment found",
          type: "error",
          duration: 3000,
        });
        return;
      }

      const toastId = showToast({
        title: "Loading...",
        description: `Downloading ${attachment.filename || "attachment"}`,
        type: "loading",
        duration: Infinity,
      });

      // Fetch attachment data from backend
      const response = await authAPI.getAttachmentData(attachment.attachmentId);

      if (!response?.data?.success) {
        throw new Error(
          response?.data?.message || "Failed to fetch attachment",
        );
      }

      const attachmentData = response.data.data;
      const mimeType = response.data.mimeType || attachment.mimeType;
      const filename =
        response.data.filename || attachment.filename || "download";

      // Decode base64
      let base64Data = attachmentData;
      if (base64Data.includes("base64,")) {
        base64Data = base64Data.split("base64,")[1];
      }

      base64Data = base64Data.replace(/\s/g, "");

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Build a named File (not an anonymous Blob) so the browser tab /
      // downloaded file shows the real filename instead of a generated
      // blob UUID.
      const blob = new File([byteNumbers], filename, {
        type: mimeType || "application/octet-stream",
      });

      const url = URL.createObjectURL(blob);

      // Update toast
      showToast({
        id: toastId,
        title: "Success",
        description: `${filename} loaded successfully`,
        type: "success",
        duration: 2000,
      });

      // Handle based on file type
      const fileExtension = filename.split(".").pop()?.toLowerCase() || "";
      const fileType = mimeType?.split("/")[0] || "";

      // ============ PDF FILES ============
      if (mimeType === "application/pdf" || fileExtension === "pdf") {
        // window.open(url, "_blank") navigates the tab directly to the
        // blob: URL, and Chrome's standalone PDF viewer then derives its
        // displayed title from that URL - which is always a random UUID
        // for a blob: URL no matter what name the underlying object was
        // given. Wrapping it in a page with a real <title> and embedding
        // the PDF via <iframe> (instead of top-level navigation) is what
        // actually makes the browser tab show the real filename.
        if (!openNamedFileInViewer(viewerWindow, url, filename)) {
          // Popup blocked - download it rather than leaving the user with
          // nothing and no explanation.
          downloadBlobUrl(url, filename);
          showToast({
            title: "Opened as a download",
            description:
              "Allow pop-ups for this site to preview documents in a tab instead.",
            type: "info",
            duration: 5000,
          });
        }
      }

      // ============ HEIC IMAGES ============
      // Only Safari can decode HEIC natively, so everywhere else the browser
      // offered a download rather than showing the photo. heic2any decodes it
      // to PNG in the browser; the result then goes through the ordinary
      // image viewer below.
      else if (
        mimeType === "image/heic" ||
        mimeType === "image/heif" ||
        ["heic", "heif"].includes(fileExtension)
      ) {
        try {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob, toType: "image/png" });
          const pngBlob = Array.isArray(converted) ? converted[0] : converted;
          const pngUrl = URL.createObjectURL(pngBlob);

          if (!openNamedFileInViewer(viewerWindow, pngUrl, filename)) {
            downloadBlobUrl(url, filename);
            showToast({
              title: "Opened as a download",
              description:
                "Allow pop-ups for this site to preview documents in a tab instead.",
              type: "info",
              duration: 5000,
            });
          }
        } catch (heicError) {
          // A corrupt or unusual HEIC should still reach the user as a file
          // rather than as nothing at all.
          console.error("HEIC conversion failed:", heicError);
          closeViewer();
          downloadBlobUrl(url, filename);
          showToast({
            title: "Preview unavailable",
            description:
              "This HEIC image could not be converted, so it was downloaded instead.",
            type: "warning",
            duration: 4000,
          });
        }
      }

      // ============ IMAGE FILES ============
      else if (
        mimeType?.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "ico"].includes(
          fileExtension,
        )
      ) {
        // Open image in new tab with preview
        setPreviewFile({
          ...attachment,
          url: url,
          blob: blob,
          filename: filename,
          mimeType: mimeType,
        });
        if (!openNamedFileInViewer(viewerWindow, url, filename)) {
          downloadBlobUrl(url, filename);
          showToast({
            title: "Opened as a download",
            description:
              "Allow pop-ups for this site to preview documents in a tab instead.",
            type: "info",
            duration: 5000,
          });
        }
      }

      // ============ CSV / TSV FILES ============
      // Delimited text used to fall into the spreadsheet branch below and
      // download. A browser will not render a .csv inline, so previewing one
      // means building the table ourselves - which is what the viewer helper
      // does. Binary spreadsheets (.xls/.xlsx) still download: they are not
      // text and would need a full sheet renderer.
      else if (["csv", "tsv"].includes(fileExtension)) {
        try {
          const text = await blob.text();
          if (!openDelimitedTextInViewer(viewerWindow, text, filename)) {
            downloadBlobUrl(url, filename);
            showToast({
              title: "Opened as a download",
              description:
                "The file could not be previewed, so it was downloaded instead.",
              type: "info",
              duration: 4000,
            });
          }
        } catch (previewError) {
          console.error("CSV preview failed:", previewError);
          closeViewer();
          downloadBlobUrl(url, filename);
        }
      }

      // ============ EXCEL FILES ============
      else if (
        mimeType === "application/vnd.ms-excel" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        mimeType === "application/vnd.oasis.opendocument.spreadsheet" ||
        ["xls", "xlsx", "xlsm", "xlsb", "csv", "tsv"].includes(fileExtension)
      ) {
        // For Excel files, download directly
        // This type downloads rather than previews, so release the tab
        // that was claimed on click.
        closeViewer();
        downloadBlobUrl(url, filename);

        showToast({
          title: "Download Started",
          description: `${filename} is being downloaded`,
          type: "info",
          duration: 3000,
        });

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      // ============ WORD FILES ============
      else if (
        mimeType === "application/msword" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        ["doc", "docx"].includes(fileExtension)
      ) {
        // For Word files, download directly
        // This type downloads rather than previews, so release the tab
        // that was claimed on click.
        closeViewer();
        downloadBlobUrl(url, filename);

        showToast({
          title: "Download Started",
          description: `${filename} is being downloaded`,
          type: "info",
          duration: 3000,
        });

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      // ============ POWERPOINT FILES ============
      else if (
        mimeType === "application/vnd.ms-powerpoint" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        ["ppt", "pptx", "pps", "ppsx"].includes(fileExtension)
      ) {
        // For PowerPoint files, download directly
        // This type downloads rather than previews, so release the tab
        // that was claimed on click.
        closeViewer();
        downloadBlobUrl(url, filename);

        showToast({
          title: "Download Started",
          description: `${filename} is being downloaded`,
          type: "info",
          duration: 3000,
        });

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      // ============ TEXT FILES ============
      else if (
        mimeType?.startsWith("text/") ||
        ["txt", "log", "md", "rtf"].includes(fileExtension)
      ) {
        // Text opens in the tab claimed on click; if that was blocked,
        // fall back to downloading it.
        if (!openNamedFileInViewer(viewerWindow, url, filename)) {
          downloadBlobUrl(url, filename);
        }
      }

      // ============ ZIP/ARCHIVE FILES ============
      else if (
        mimeType === "application/zip" ||
        mimeType === "application/x-zip-compressed" ||
        mimeType === "application/x-rar-compressed" ||
        mimeType === "application/x-7z-compressed" ||
        ["zip", "rar", "7z", "tar", "gz"].includes(fileExtension)
      ) {
        // For archive files, download directly
        // This type downloads rather than previews, so release the tab
        // that was claimed on click.
        closeViewer();
        downloadBlobUrl(url, filename);

        showToast({
          title: "Download Started",
          description: `${filename} is being downloaded`,
          type: "info",
          duration: 3000,
        });

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      // ============ VIDEO FILES ============
      else if (
        mimeType?.startsWith("video/") ||
        ["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(
          fileExtension,
        )
      ) {
        // For video files, open in the tab claimed on click
        previewInClaimedTab(url, filename);
      }

      // ============ AUDIO FILES ============
      else if (
        mimeType?.startsWith("audio/") ||
        ["mp3", "wav", "ogg", "flac", "aac"].includes(fileExtension)
      ) {
        // For audio files, open in the tab claimed on click
        previewInClaimedTab(url, filename);
      }

      // ============ JSON/XML FILES ============
      else if (["json", "xml", "yaml", "yml"].includes(fileExtension)) {
        // For JSON/XML files, open in the tab claimed on click
        previewInClaimedTab(url, filename);
      }

      // ============ DEFAULT - Download ============
      else {
        // For unknown file types, download directly
        // This type downloads rather than previews, so release the tab
        // that was claimed on click.
        closeViewer();
        downloadBlobUrl(url, filename);

        showToast({
          title: "Download Started",
          description: `${filename} is being downloaded`,
          type: "info",
          duration: 3000,
        });

        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error("Error opening attachment:", error);
      // Don't strand the blank tab that was claimed on click.
      closeViewer();
      showToast({
        title: "Error",
        description: `Failed to open attachment: ${error.message}`,
        type: "error",
        duration: 4000,
      });
    }
  };

  // Add this helper function near the top of your component
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    // Get month abbreviation
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];

    // Get day with leading zero
    const day = String(date.getDate()).padStart(2, "0");

    // Get year
    const year = date.getFullYear();

    // Get time (12-hour format)
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    // Padded so a single-digit hour does not make the string a character
    // shorter than the rest: "1:25 PM" against "12:50 PM" was enough to
    // shift the whole date in the column. Every value is now the same
    // length, matching the day, which was already padded.
    const time = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    return `${month}-${day}-${year}, ${time}`;
  };

  // Alternative simpler version using built-in Intl.DateTimeFormat
  const formatDateSimple = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const options = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options)
      .format(date)
      .replace(/(\d+), (\d+)/, "$1-$2") // Replace comma with hyphen for date format
      .replace(/(\w{3}) (\d{2}), (\d{4})/, "$1-$2-$3"); // Format as Nov-02-2025
  };

  // Helper function to format file sizes
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (threadId) => {
    setExpandedRows((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId],
    );
  };
  // Add this helper function at the top of your component
const parseEmailBody = (body) => {
  if (!body) return "";
  
  // If body is already HTML, return as is
  if (body.includes('<')) {
    return body;
  }
  
  // Convert plain text to HTML with line breaks
  return body.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
};

// Add this function to extract the original message from the body
const extractOriginalMessage = (body) => {
  if (!body) return null;
  
  // Look for the "On [date], [name] wrote:" pattern
  const originalMessageMatch = body.match(/On\s+.*?,\s+.*?\s+wrote:/);
  if (originalMessageMatch) {
    const index = body.indexOf(originalMessageMatch[0]);
    if (index > 0) {
      return {
        original: body.substring(index),
        previous: body.substring(0, index).trim()
      };
    }
  }
  
  // Look for email quoting pattern (lines starting with >)
  const lines = body.split('\n');
  const quotedLines = lines.filter(line => line.trim().startsWith('>'));
  if (quotedLines.length > 0) {
    const quotedIndex = lines.findIndex(line => line.trim().startsWith('>'));
    return {
      original: lines.slice(quotedIndex).join('\n'),
      previous: lines.slice(0, quotedIndex).join('\n').trim()
    };
  }
  
  return null;
};

// Add this function to render the email thread with proper structure
const renderEmailThread = (messages) => {
  if (!messages || messages.length === 0) return null;
  
  // Sort messages by date (oldest first for proper thread view)
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.messageDate) - new Date(b.messageDate)
  );
  
  return sortedMessages.map((msg, index) => {
    const isLast = index === sortedMessages.length - 1;
    const emailContent = extractOriginalMessage(msg.body);
    
    return (
      <div key={msg.messageId || index} className="email-message">
        {/* Message Header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
              {msg.from ? msg.from.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <div className="font-medium text-sm text-gray-900">
                {msg.from || 'Unknown Sender'}
              </div>
              <div className="text-xs text-gray-500">
                to: {msg.to?.join(', ') || 'Unknown Recipient'}
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatDate(msg.messageDate)}
          </div>
        </div>
        
        {/* Message Body */}
        <div className="py-3 email-body">
          {emailContent ? (
            <>
              {/* Previous content (the new message part) */}
              {emailContent.previous && (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: parseEmailBody(emailContent.previous) 
                  }}
                  className="prose prose-sm max-w-none"
                />
              )}
              
              {/* Original message (quoted/forwarded part) */}
              {emailContent.original && (
                <div className="mt-4 pl-4 border-l-4 border-gray-200 bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500 mb-2">
                    On {formatDate(msg.messageDate)}, {msg.from} wrote:
                  </div>
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: parseEmailBody(emailContent.original) 
                    }}
                    className="prose prose-sm max-w-none text-gray-700"
                  />
                </div>
              )}
            </>
          ) : (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: parseEmailBody(msg.body) 
              }}
              className="prose prose-sm max-w-none"
            />
          )}
        </div>
        
        {/* Attachments */}
        {msg.attachments && msg.attachments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {msg.attachments.map((attachment, idx) => (
                <button
                  key={idx}
                  onClick={() => openAttachment(attachment)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-md text-sm text-gray-700 transition-colors border border-gray-200"
                >
                  <Paperclip size={14} />
                  <span>{attachment.filename || `Attachment ${idx + 1}`}</span>
                  {attachment.size && (
                    <span className="text-xs text-gray-400">
                      ({formatFileSize(attachment.size)})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Separator between messages */}
        {!isLast && <div className="my-4 border-t border-gray-200"></div>}
      </div>
    );
  });
};
  return (
    <div className="h-full flex flex-col bg-white">
      {/* ================= TOP NAV =================
          Was a 248px left column. Moved to a single row across the top so the
          notification list gets the full width - the column was costing more
          horizontal space than its four links needed. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b px-4 py-2.5">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          Inbox+
        </h1>

        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
          Shared
        </span>

        <nav className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setViewMode("inbox");
              setSelectedRows([]);
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
              viewMode === "inbox"
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            <Mail className="h-4 w-4 shrink-0" />
            All notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* No mention data in the app yet, so this is shown disabled rather
              than as a link that goes nowhere. */}
          <button
            type="button"
            disabled
            title="Mentions are not available yet"
            className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-gray-400"
          >
            <AtSign className="h-4 w-4 shrink-0" />
            Mentions
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("archived");
              setSelectedRows([]);
            }}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
              viewMode === "archived"
                ? "bg-blue-50 font-medium text-blue-700"
                : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            <Archive className="h-4 w-4 shrink-0" />
            Archived
            {archivedNotifications.length > 0 && (
              <span className="text-[11px] text-gray-400">
                {archivedNotifications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setFilterDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-50"
          >
            <Settings2 className="h-4 w-4 shrink-0" />
            Manage notifications
          </button>
        </nav>
      </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center p-2 bg-gray-50 border-b">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading...</span>
          </div>
        )}

        {/* ================= TOOLBAR ================= */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-2.5">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={
              filteredThreads.length > 0 &&
              selectedRows.length === filteredThreads.length
            }
            onChange={(e) =>
              setSelectedRows(
                e.target.checked ? filteredThreads.map((t) => t._id) : [],
              )
            }
          />

          {viewMode === "inbox" ? (
            <button
              type="button"
              onClick={handleBulkArchive}
              disabled={selectedRows.length === 0}
              className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <Check className="h-4 w-4" />
              Archive for me
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBulkUnarchive}
              disabled={selectedRows.length === 0}
              className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-gray-900 disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <Undo2 className="h-4 w-4" />
              Restore to Inbox
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedRows(filteredThreads.map((t) => t._id))}
            className="text-sm text-blue-600 hover:underline"
          >
            Select all {filteredThreads.length} notifications
          </button>

          <span className="text-sm text-gray-500">
            {selectedRows.length} selected
          </span>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                className="h-9 pl-9"
                placeholder={`Search ${viewMode === "inbox" ? "notifications" : "archived"}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setSortNewestFirst((v) => !v)}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-slate-100 hover:text-gray-900"
              title="Change sort order"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {sortNewestFirst ? "Newest first" : "Oldest first"}
            </button>

            <ShadButton
              variant="outline"
              size="sm"
              onClick={() => setFilterDrawerOpen(true)}
            >
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-1.5 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                  {activeFilterCount}
                </span>
              )}
            </ShadButton>
          </div>
        </div>

        {/* ================= LIST ================= */}
        <div className="flex-1 overflow-auto">
          {filteredThreads.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              {viewMode === "inbox"
                ? "No notifications found"
                : "No archived notifications"}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredThreads.map((thread) => (
                <li
                  key={thread._id}
                  className="group bg-white transition-colors hover:bg-slate-50"
                >
                  {/* Clicking anywhere on the row expands it, so the separate
                      chevron is gone. The interactive controls below stop
                      propagation so they do not expand the row on their way. */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleRow(thread._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRow(thread._id);
                      }
                    }}
                    className="flex cursor-pointer items-center gap-4 px-5 py-4"
                  >
                    {/* ICON - becomes the checkbox on hover, as in the
                        reference. A selected row keeps the checkbox visible
                        so the selection is still obvious once the pointer
                        moves away. */}
                    {(() => {
                      const { Icon, className } = getNotificationIcon(
                        thread.latest?.subject,
                      );
                      const isSelected = selectedRows.includes(thread._id);
                      return (
                        <span
                          className="relative flex h-8 w-8 shrink-0 items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Icon
                            className={`h-[22px] w-[22px] transition-opacity ${className} ${
                              isSelected ? "opacity-0" : "group-hover:opacity-0"
                            }`}
                          />
                          <input
                            type="checkbox"
                            aria-label="Select notification"
                            className={`absolute h-4 w-4 cursor-pointer transition-opacity ${
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRows((prev) => [...prev, thread._id]);
                              } else {
                                setSelectedRows((prev) =>
                                  prev.filter((id) => id !== thread._id),
                                );
                              }
                            }}
                          />
                        </span>
                      );
                    })()}

                    {/* Separator between the symbol and the subject. */}
                    <span className="h-9 w-px shrink-0 bg-gray-200" />

                    {/* NOTIFICATION - min-w-0 is what lets this truncate
                        instead of pushing the columns off the right edge. */}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-gray-900">
                        {renderLinkedSubject(thread.latest?.subject, navigate)}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {(() => {
                          const preview = getPreview(thread.latest?.body || "");
                          return preview.length > 120
                            ? `${preview.slice(0, 120).trimEnd()}...`
                            : preview;
                        })()}
                      </div>
                    </div>

                    {/* DATE */}
                    {/* tabular-nums keeps every digit the same width, so the
                        column cannot shift with the value; left-aligned in a
                        fixed cell means the date always starts at the same
                        x down the whole list. */}
                    <div className="w-[170px] shrink-0 whitespace-nowrap text-left text-xs tabular-nums text-gray-500">
                      {formatDate(thread.latest?.messageDate)}
                    </div>

                    {/* ATTACHMENT */}
                    <div className="w-[150px] shrink-0 text-right">
                      {thread.latest?.attachments?.[0] ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAttachment(thread.latest.attachments[0]);
                          }}
                          className="inline-flex max-w-full items-center gap-1 text-xs text-blue-600 hover:underline"
                          title={thread.latest.attachments[0].filename}
                        >
                          <Paperclip className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">
                            {thread.latest.attachments[0].filename}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-gray-300">&mdash;</span>
                      )}
                    </div>

                    {/* MARK AS READ */}
                    <div className="w-9 shrink-0 text-center">
                      {thread.latest?.isRead ? (
                        <span
                          title="Already read"
                          className="inline-flex h-8 w-8 items-center justify-center text-gray-300"
                        >
                          <MailOpen className="h-[18px] w-[18px]" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(thread._id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-slate-200 hover:text-gray-800"
                          title="Mark as read"
                          aria-label="Mark as read"
                        >
                          <MailOpen className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </div>

                    {/* ARCHIVE - a bare tick used to sit here, which said
                        nothing about what it would do. */}
                    <div className="w-9 shrink-0 text-center">
                      {viewMode === "inbox" ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleArchiveThread(thread._id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-slate-200 hover:text-gray-800"
                          title="Archive - move out of Inbox"
                          aria-label="Archive notification"
                        >
                          <Archive className="h-[18px] w-[18px]" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnarchiveThread(thread._id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-600 transition-colors hover:bg-emerald-50"
                          title="Restore to Inbox"
                          aria-label="Restore to Inbox"
                        >
                          <Undo2 className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </div>

                    {/* OPEN - kept, but placed after Archive so the requested
                        column order holds and the shortcut is not lost. */}
                    <div className="w-9 shrink-0 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const mongoId = extractMongoId(thread.latest?.subject);
                          if (!mongoId) {
                            showToast({
                              title: "Not Available",
                              description:
                                "No account link found for this notification",
                              type: "warning",
                              duration: 3000,
                            });
                            return;
                          }
                          navigate(buildAccountPath(mongoId));
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50"
                        title="Open the related account"
                        aria-label="Open the related account"
                      >
                        <ExternalLink className="h-[18px] w-[18px]" />
                      </button>
                    </div>
                  </div>

                  {expandedRows.includes(thread._id) && (
                        <div className="border-t bg-white">
                          {thread.messages?.map((msg, index) => (
                            <div key={index} className="p-5">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                  {/* <FileText
                                    size={18}
                                    className="text-gray-500 mt-1"
                                  /> */}

                                  <div>
                                    {/* <div className="text-sm font-medium text-gray-800">
                                      {renderLinkedSubject(
                                        thread.latest?.subject,
                                      )}
                                    </div> */}

                                    {/* <div className="text-xs text-gray-500 mt-1">
                                      {msg.from}
                                    </div> */}
                                  </div>
                                </div>

                                <div className="text-xs text-gray-500">
                                  {formatDate(msg.messageDate)}
                                </div>
                              </div>

                              {/* Body */}
                              <div className="mt-4 pl-8">
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: msg.body || "",
                                  }}
                                  className="email-body"
                                />
                              </div>

                              {/* Attachments */}
                              {msg.attachments?.length > 0 && (
                                <div className="mt-5 pl-8">
                                  <div className="text-xs text-gray-500 mb-2">
                                    {msg.attachments.length} attachment
                                    {msg.attachments.length > 1 ? "s" : ""}
                                  </div>

                                  <div className="space-y-2">
                                    {msg.attachments.map((attachment, idx) => (
                                      <button
                                        key={idx}
                                        onClick={() =>
                                          openAttachment(attachment)
                                        }
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                      >
                                        <Paperclip size={14} />
                                        <span className="text-sm">
                                          {attachment.filename}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Action Bar */}
                              <div className="mt-6 flex items-center gap-8 border-t pt-4 text-sm">
                                <button
                                  onClick={() =>
                                    handleArchiveThread(thread._id)
                                  }
                                  className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                                >
                                  <Archive size={15} />
                                  Archive for me
                                </button>

                                {/* <button className="flex items-center gap-2 text-teal-600 hover:text-teal-700">
                                  <RefreshCw size={15} />
                                  Archive for everyone
                                </button> */}

                               <button
  onClick={() => {
    const mongoId = extractMongoId(thread.latest?.subject);

    if (!mongoId) {
      showToast({
        title: "Not Available",
        description: "No account link found for this notification",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    navigate(buildAccountPath(mongoId));
  }}
  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
>
  <ExternalLink size={15} />
  Go to...
</button>

{/* Same destination, but in its own window, so the record can be worked
    on alongside the inbox - or alongside another copy of itself. Opening
    it more than once simply gives another window. */}
<button
  onClick={() => {
    const mongoId = extractMongoId(thread.latest?.subject);

    if (!mongoId) {
      showToast({
        title: "Not Available",
        description: "No account link found for this notification",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    const win = window.open(buildAccountPath(mongoId), "_blank");
    if (win) {
      // Severed directly rather than via the "noopener" feature, which
      // makes window.open return null even on success and would cost us
      // the blocked-popup check below.
      try {
        win.opener = null;
      } catch {
        // Cross-origin; nothing to do.
      }
    } else {
      showToast({
        title: "Pop-up blocked",
        description:
          "Allow pop-ups for this site to open it in a separate window.",
        type: "warning",
        duration: 4000,
      });
    }
  }}
  className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
>
  <Copy size={15} />
  Open in new window
</button>
                              </div>
                            </div>
                          ))}
                        </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      {selectedThread && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="w-[700px] bg-white h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-lg">
                {renderLinkedSubject(selectedThread.latest?.subject, navigate)}
              </h2>
              <div className="flex gap-2">
                {viewMode === "inbox" ? (
                  <ShadButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleArchiveThread(selectedThread._id)}
                  >
                    <Archive size={14} />
                  </ShadButton>
                ) : (
                  <ShadButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnarchiveThread(selectedThread._id)}
                    className="text-green-600"
                  >
                    <Undo2 size={14} />
                  </ShadButton>
                )}

                <ShadButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedThread(null)}
                >
                  <X size={16} />
                </ShadButton>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedThread.messages?.map((msg, index) => (
                <div
                  key={msg.messageId || index}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  {/* Message Body */}
                  <div className="prose max-w-none mb-4">
                    {msg.body ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: msg.body }}
                        className="email-body"
                      />
                    ) : (
                      <p className="text-gray-500 italic">
                        No content available
                      </p>
                    )}
                  </div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-4 pt-3 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Attachments ({msg.attachments.length}):
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.attachments.map((attachment, idx) => (
                          <button
                            key={idx}
                            onClick={() => openAttachment(attachment)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-md text-sm text-blue-700 transition-colors border border-blue-200"
                          >
                            <Paperclip size={14} />
                            <span>
                              {attachment.filename || `Attachment ${idx + 1}`}
                            </span>
                            {attachment.size && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({formatFileSize(attachment.size)})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* <Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
           
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Categories
              </h4>
              <div className="space-y-2">
                {filterCategories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => handleFilterChange(category.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                      activeFilters[category.key]
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{category.label}</span>
                      {category.key !== "all" && (
                        <span className="text-xs text-gray-400">
                          ({category.keywords.length} keywords)
                        </span>
                      )}
                    </div>
                    {activeFilters[category.key] && (
                      <Check size={16} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            
            {!activeFilters.all &&
              Object.keys(activeFilters).some(
                (key) => key !== "all" && activeFilters[key],
              ) && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    <span className="font-medium">Active filters:</span>{" "}
                    {Object.keys(activeFilters)
                      .filter((key) => key !== "all" && activeFilters[key])
                      .map(
                        (key) =>
                          filterCategories.find((f) => f.key === key)?.label,
                      )
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Searching in subject, body, and sender
                  </p>
                </div>
              )}

            
            <div className="pt-4 border-t">
              <ShadButton
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newFilters = {};
                  Object.keys(activeFilters).forEach((key) => {
                    newFilters[key] = key === "all";
                  });
                  setActiveFilters(newFilters);
                }}
              >
                Clear All Filters
              </ShadButton>
            </div>

            
            <ShadButton
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => setFilterDrawerOpen(false)}
            >
              Apply Filters
            </ShadButton>
          </div>
        </SheetContent>
      </Sheet> */}
<Sheet open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
  <SheetContent side="right" className="flex flex-col p-0">
    <SheetHeader className="px-6 pt-6">
      <SheetTitle>Filters</SheetTitle>
    </SheetHeader>

    {/* Scrollable middle section */}
    <div className="flex-1 overflow-y-auto px-6 mt-6 space-y-6">
      {/* Filter Categories */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-3">
          Categories
        </h4>
        <div className="space-y-2">
          {filterCategories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleFilterChange(category.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                activeFilters[category.key]
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{category.label}</span>
                {category.key !== "all" && (
                  <span className="text-xs text-gray-400">
                    ({category.keywords.length} keywords)
                  </span>
                )}
              </div>
              {activeFilters[category.key] && (
                <Check size={16} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {!activeFilters.all &&
        Object.keys(activeFilters).some(
          (key) => key !== "all" && activeFilters[key],
        ) && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Active filters:</span>{" "}
              {Object.keys(activeFilters)
                .filter((key) => key !== "all" && activeFilters[key])
                .map(
                  (key) =>
                    filterCategories.find((f) => f.key === key)?.label,
                )
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Searching in subject, body, and sender
            </p>
          </div>
        )}
    </div>

    {/* Fixed footer with action buttons */}
    <div className="px-6 pb-6 pt-4 border-t space-y-3">
      <ShadButton
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => {
          const newFilters = {};
          Object.keys(activeFilters).forEach((key) => {
            newFilters[key] = key === "all";
          });
          setActiveFilters(newFilters);
        }}
      >
        Clear All Filters
      </ShadButton>

      <ShadButton
        className="w-full bg-blue-600 hover:bg-blue-700"
        onClick={() => setFilterDrawerOpen(false)}
      >
        Apply Filters
      </ShadButton>
    </div>
  </SheetContent>
</Sheet>
    </div>
  );
}

