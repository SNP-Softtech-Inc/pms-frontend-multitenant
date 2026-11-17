// src/pages/AccountDashboard/reviewerLog.js
//
// Reviewer notes (v1.82.0): who wrote each log entry is shown in bold, and
// "Copy log" puts the whole log - heading and every entry, oldest first, as
// numbered on screen - on the clipboard as plain text, so it pastes cleanly
// into an email, a ticket or a document.
import React from "react";

const BLOCKS = new Set([
  "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "PRE",
  "UL", "OL", "TABLE", "TR", "FIGURE", "FIGCAPTION", "HR",
]);

// "1. " in a numbered list, "- " in a bulleted one.
const listPrefix = (li) => {
  const list = li.parentElement;
  if (list?.tagName !== "OL") return "- ";
  let n = 1;
  for (let el = li.previousElementSibling; el; el = el.previousElementSibling) {
    if (el.tagName === "LI") n += 1;
  }
  return `${n}. `;
};

const walk = (node, out) => {
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      // Source whitespace collapses as the browser shows it.
      out.push(child.nodeValue.replace(/[ \t\r\n]+/g, " "));
      return;
    }
    if (child.nodeType !== 1) return;

    const tag = child.tagName;
    if (tag === "BR") {
      out.push("\n");
    } else if (tag === "LI") {
      out.push(`\n${listPrefix(child)}`);
      walk(child, out);
      out.push("\n");
    } else if (tag === "TD" || tag === "TH") {
      walk(child, out);
      out.push(" ");
    } else if (BLOCKS.has(tag)) {
      out.push("\n");
      walk(child, out);
      out.push("\n");
    } else {
      walk(child, out);
    }
  });
};

/**
 * A log entry's text editor HTML as plain text: one line per paragraph or
 * list item, formatting dropped, entities decoded. DOMParser builds an inert
 * document, so nothing in the text runs or loads while it is read.
 */
export const htmlToText = (html) => {
  if (html === null || html === undefined || html === "") return "";

  const doc = new DOMParser().parseFromString(String(html), "text/html");
  const out = [];
  walk(doc.body, out);

  return out
    .join("")
    .replace(/ /g, " ")
    .split("\n")
    .map((line) => line.replace(/ {2,}/g, " ").trim())
    .filter(Boolean)
    .join("\n");
};

const authorOf = (log) => {
  const name = log?.createdBy || "Unknown";
  return log?.createdByEmail ? `${name} (${log.createdByEmail})` : name;
};

/**
 * The whole reviewer note as plain text:
 *
 *   June Tax return
 *
 *   Log 1 - Asha Rao (asha@firm.test) - 17/11/2026, 10:00:00
 *   Documents received.
 *
 *   Log 2 - ...
 */
export const reviewerLogText = (note) => {
  if (!note) return "";

  const parts = [note.title || ""];
  (note.logs || []).forEach((log, index) => {
    const header = [`Log ${index + 1}`, authorOf(log), log.time]
      .filter(Boolean)
      .join(" - ");
    parts.push("", header, htmlToText(log.text) || "(no text)");
  });

  return parts.join("\n").trim();
};

/**
 * Puts text on the clipboard. The clipboard API needs a secure page and the
 * user's permission; when it is missing or refused, a hidden text box is
 * selected and copied instead. Resolves true when either way worked.
 */
export const copyText = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the text box.
  }

  const box = document.createElement("textarea");
  try {
    box.value = text;
    box.setAttribute("readonly", "");
    box.style.position = "fixed";
    box.style.top = "0";
    box.style.left = "0";
    box.style.opacity = "0";
    document.body.appendChild(box);
    box.focus();
    box.select();
    return document.execCommand("copy") === true;
  } catch {
    return false;
  } finally {
    box.remove();
  }
};

/** Who wrote a log entry: the name in bold, the email after it as before. */
export const LogAuthor = ({ name, email }) => (
  <span>
    <strong className="font-semibold text-foreground">
      {name || "Unknown"}
    </strong>
    {email ? ` (${email})` : null}
  </span>
);
