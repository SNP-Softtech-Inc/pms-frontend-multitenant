// The fields offered in the signature builder, one set per recipient, so the
// admin can drag "Signature - Basha (basha@…)" straight onto the page.
//
// Moved here from FolderTreeView.js unchanged, except for "Date signed"
// (v1.72.0).

// How dates print on the signed document. Also the only format the builder
// offers (FolderTreeView's dateFormats).
export const DATE_FORMAT = "MM/DD/YYYY";

const FIELD_TYPES = [
  { type: "text", label: "Text" },
  { type: "signature", label: "Signature" },
  { type: "initials", label: "Initials" },
  { type: "date", label: "Date" },
  // DocuSeal's "Date Signed": filled in with the day the person signs, in
  // DATE_FORMAT, with no date picker. The picker in DocuSeal's signing form
  // is the browser's own and shows the date in the order of the signer's
  // computer region (day first on an Indian-region computer), which nobody
  // can change; this field shows no picker at all.
  { type: "datenow", label: "Date signed" },
  { type: "number", label: "Number" },
  { type: "image", label: "Image" },
  { type: "checkbox", label: "Checkbox" },
  { type: "file", label: "File" },
  { type: "phone", label: "Phone" },
  // add more from the supported list: select, radio, multiple, cells,
  // stamp, payment, verification, kba, strikethrough
];

const DATE_TYPES = new Set(["date", "datenow"]);

export const signerFields = (submitters) =>
  (submitters || []).flatMap((signer, index) => {
    const who = signer?.name || `Signer ${index + 1}`;
    const label = signer?.email ? `${who} (${signer.email})` : who;
    const role = signer?.role || label;

    return FIELD_TYPES.map(({ type, label: typeLabel }) => ({
      name: `${typeLabel} - ${label}`,
      title: label,
      type,
      role,
      ...(DATE_TYPES.has(type) ? { preferences: { format: DATE_FORMAT } } : {}),
    }));
  });
