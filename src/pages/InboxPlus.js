import React, { useEffect, useState } from "react";
import axios from "axios";

// UI (adjust based on your setup)
import { Input } from "../components/ui/input";
import { Button as ShadButton } from "../components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";

// Icons (example)
import {
  Mail,
  Search,
  SlidersHorizontal,
  X,
  CheckCheck,
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronUp,
  Reply,
  Send,
  Paperclip,
} from "lucide-react";

const InboxPlus = () => {
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedThreadId, setExpandedThreadId] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [replyText, setReplyText] = useState("");
  const [replyingToMessageId, setReplyingToMessageId] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const [checkedItems, setCheckedItems] = useState({
    invoice: false,
    proposal: false,
    document: false,
    documentSigned: false,
    message: false,
    organizer: false,
  });

  /* ================= FILTER CONFIG ================= */

  const FILTER_KEYWORDS = {
    invoice: ["invoice"],
    proposal: ["proposal"],
    document: ["document"],
    documentSigned: ["signed", "document signed"],
    message: ["message"],
    organizer: ["organizer"],
  };

  const matchesSelectedFilters = (subject = "") => {
    const activeFilters = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );

    if (activeFilters.length === 0) return true;

    const lower = subject.toLowerCase();

    return activeFilters.some((filterKey) =>
      FILTER_KEYWORDS[filterKey]?.some((k) => lower.includes(k))
    );
  };

  /* ================= API ================= */

  const fetchEmails = async () => {
    try {
      const res = await axios.get(
        "https://www.snptaxes.com/emailsync/messagesList/messagesnotification"
      );
      setThreads(res.data.threads || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  /* ================= HELPERS ================= */

  const getPreview = (html = "") =>
    html.replace(/<[^>]*>?/gm, "");

  const extractEmail = (from = "") => {
    const match = from.match(/<(.+?)>/);
    return match ? match[1] : from;
  };

  const hasMongoIdTag = (subject = "") =>
    /#[a-f0-9]{24}\b/i.test(subject);

  const extractMongoId = (subject = "") => {
    const match = subject.match(/#([a-f0-9]{24})\b/i);
    return match ? match[1] : null;
  };

  const cleanSubjectText = (subject = "") =>
    subject.replace(/#[a-f0-9]{24}\b/i, "").trim();

  const buildAccountLink = (id) =>
    `/clients/accounts/accountsdash/overview/${id}`;

  /* ================= ACTIONS ================= */

  const markThreadAsRead = async (threadId) => {
    await axios.patch(
      "https://www.snptaxes.com/emailsync/messagesList/threads/mark-read",
      { threadId }
    );
    fetchEmails();
  };

  const archiveThread = async (threadId, archived) => {
    await axios.patch(
      "https://www.snptaxes.com/emailsync/messagesList/threads/archive",
      { threadId, archived }
    );
    fetchEmails();
  };

  const sendReply = async (selectedThread) => {
    if (!replyText.trim() || !selectedThread) return;

    await axios.post(
      "https://www.snptaxes.com/emailsync/user/reply",
      {
        to: extractEmail(selectedThread.latest?.from),
        subject: selectedThread.latest?.subject,
        message: replyText,
      }
    );

    setReplyText("");
  };

  /* ================= FILTER ================= */

  const filteredThreads = threads
    .filter((t) => {
      const isArchived = t.latest?.archived;
      const isUnread = !t.latest?.read;

      if (tab === 0) return !isArchived;
      if (tab === 1) return !isArchived && isUnread;

      return true;
    })
    .filter((t) => {
      if (matchesSelectedFilters(t.latest?.subject)) return true;

      return t.messages?.some((m) =>
        matchesSelectedFilters(m.subject)
      );
    })
    .filter((t) => {
      if (!searchQuery) return true;

      const q = searchQuery.toLowerCase();
      const latest = t.latest;

      return (
        latest?.from?.toLowerCase().includes(q) ||
        cleanSubjectText(latest?.subject).toLowerCase().includes(q) ||
        getPreview(latest?.body).toLowerCase().includes(q)
      );
    });

  const selectedThread = threads.find(
    (t) => t._id === expandedThreadId
  );

  /* ================= UI ================= */

  return (
    <div className="flex h-full">
      {/* LEFT PANEL */}
      <div className="w-[300px] border-r">
        <div className="p-3">
          <h2 className="font-semibold">Inbox</h2>

          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>

        {filteredThreads.map((t) => (
          <div
            key={t._id}
            onClick={() => setExpandedThreadId(t._id)}
            className="p-2 cursor-pointer hover:bg-muted"
          >
            {cleanSubjectText(t.latest?.subject)}
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 p-4">
        {selectedThread ? (
          <>
            <h2 className="font-semibold mb-3">
              {cleanSubjectText(
                selectedThread.latest?.subject
              )}
            </h2>

            {selectedThread.messages.map((m) => (
              <div key={m.messageId} className="mb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: m.body,
                  }}
                />
              </div>
            ))}

            <textarea
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
              className="w-full border p-2 mt-3"
            />

            <ShadButton
              onClick={() => sendReply(selectedThread)}
            >
              Send
            </ShadButton>
          </>
        ) : (
          <p>Select email</p>
        )}
      </div>
    </div>
  );
};

export default InboxPlus;