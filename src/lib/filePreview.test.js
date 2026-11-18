// Excel (and Word) open as a preview, never as a surprise download (v1.88.0).
import { isOfficeFile, officeViewerUrl, previewUrl } from "./filePreview";

const XLSX = "https://staging-admin.clientgage.com/uploads/accounts/a1/Client uploaded documents/2021/Checklist.xlsx";

describe("isOfficeFile", () => {
  it("knows Excel and Word files, whatever the case", () => {
    ["a.xls", "a.xlsx", "a.XLSX", "a.xlsm", "a.xlsb", "a.doc", "a.docx", "a.csv.xlsx"].forEach((n) =>
      expect(isOfficeFile(n)).toBe(true)
    );
  });

  it("leaves everything else alone", () => {
    ["a.pdf", "a.png", "a.txt", "a.csv", "xlsx", "", null, undefined].forEach((n) =>
      expect(isOfficeFile(n)).toBe(false)
    );
  });
});

describe("officeViewerUrl", () => {
  it("wraps the file in Microsoft's viewer, encoded once", () => {
    expect(officeViewerUrl(XLSX)).toBe(
      `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(XLSX)}`
    );
  });
});

describe("previewUrl", () => {
  it("sends an Excel file to the viewer instead of the raw file, which would download", () => {
    expect(previewUrl(XLSX, "Checklist.xlsx")).toBe(officeViewerUrl(XLSX));
  });

  it("reads the type from the URL when no name is given", () => {
    expect(previewUrl(XLSX)).toBe(officeViewerUrl(XLSX));
  });

  it("opens other files as they are", () => {
    const pdf = "https://x.test/uploads/a.pdf";
    expect(previewUrl(pdf, "a.pdf")).toBe(pdf);
  });

  it("copes with nothing", () => {
    expect(previewUrl("", "a.xlsx")).toBe("");
  });
});
