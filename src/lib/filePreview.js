// src/lib/filePreview.js
//
// Where to send a document so it previews rather than downloads (v1.88.0).
//
// Browsers cannot display Excel or Word files; opening one's raw URL - in a
// new tab, or an <iframe> - downloads it. The Documents tree already sent
// those files through Microsoft's Office viewer (497df49); the other places a
// document opens (the viewer's own "Open in new tab", Approvals, Signatures,
// Trash) linked the raw file. They now all use previewUrl.
//
// The Office viewer fetches the file from Microsoft's servers, so it only
// works for a URL reachable from the internet - true today, because
// /uploads/accounts is served without sign-in. See decisions.md.

const OFFICE_EXTS = ["xls", "xlsx", "xlsm", "xlsb", "doc", "docx"];

const extOf = (name) => {
  const clean = String(name || "").split(/[?#]/)[0];
  const dot = clean.lastIndexOf(".");
  return dot > 0 ? clean.slice(dot + 1).toLowerCase() : "";
};

export const isOfficeFile = (name) => OFFICE_EXTS.includes(extOf(name));

export const officeViewerUrl = (fileUrl) =>
  `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;

/** The URL to open: Office files through the viewer, others as they are. */
export const previewUrl = (fileUrl, name) => {
  if (!fileUrl) return "";
  return isOfficeFile(name || fileUrl) ? officeViewerUrl(fileUrl) : fileUrl;
};
