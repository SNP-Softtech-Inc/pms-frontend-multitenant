// The document viewer's Excel/Word pane (v1.88.0). Its iframe src was set
// from an effect through a ref that was still null on the first render, so
// it never loaded: a blank pane.
import React from "react";
import { render } from "@testing-library/react";
import { OfficeViewer } from "./DocumentViewer";

const XLSX = "https://staging-admin.clientgage.com/uploads/accounts/a1/Docs/Checklist 2021.xlsx";

it("loads the file in Microsoft's viewer straight away", () => {
  const { container } = render(
    <OfficeViewer fileUrl={XLSX} fileName="Checklist 2021.xlsx" fileType="Excel" />
  );

  const frame = container.querySelector("iframe");
  expect(frame).not.toBeNull();
  expect(frame.getAttribute("src")).toBe(
    `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(XLSX)}`
  );
  expect(frame.getAttribute("title")).toBe("Excel Document: Checklist 2021.xlsx");
});

it("follows the file when the viewer moves to another one", () => {
  const { container, rerender } = render(
    <OfficeViewer fileUrl={XLSX} fileName="a.xlsx" fileType="Excel" />
  );
  const other = XLSX.replace("Checklist 2021", "Other");
  rerender(<OfficeViewer fileUrl={other} fileName="Other.xlsx" fileType="Excel" />);

  expect(container.querySelector("iframe").getAttribute("src")).toContain(encodeURIComponent(other));
});
