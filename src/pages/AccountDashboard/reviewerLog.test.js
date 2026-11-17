// Reviewer notes (v1.82.0): the author's name is shown in bold, and Copy log
// puts the whole log on the clipboard as plain text.
import React from "react";
import { render } from "@testing-library/react";
import {
  htmlToText,
  reviewerLogText,
  copyText,
  LogAuthor,
} from "./reviewerLog";

describe("htmlToText", () => {
  it("puts each paragraph on its own line", () => {
    expect(htmlToText("<p>First</p><p>Second</p>")).toBe("First\nSecond");
  });

  it("keeps line breaks inside a paragraph", () => {
    expect(htmlToText("<p>One<br>Two</p>")).toBe("One\nTwo");
  });

  it("drops formatting but keeps the words", () => {
    expect(htmlToText("<p><strong>Bold</strong> and <i>italic</i></p>")).toBe(
      "Bold and italic"
    );
  });

  it("writes bullet lists with dashes and numbered lists with numbers", () => {
    expect(htmlToText("<ul><li>Apples</li><li>Pears</li></ul>")).toBe(
      "- Apples\n- Pears"
    );
    expect(htmlToText("<ol><li>First</li><li>Second</li></ol>")).toBe(
      "1. First\n2. Second"
    );
  });

  it("decodes entities and turns non-breaking spaces into spaces", () => {
    expect(htmlToText("<p>Tom &amp; Jerry&nbsp;&lt;3</p>")).toBe(
      "Tom & Jerry <3"
    );
  });

  it("never runs script or loads anything from the text", () => {
    window.__reviewerLogRan = false;
    expect(
      htmlToText('<p>ok</p><img src="x" onerror="window.__reviewerLogRan=true">')
    ).toBe("ok");
    expect(window.__reviewerLogRan).toBe(false);
  });

  it("returns empty text for nothing", () => {
    expect(htmlToText("")).toBe("");
    expect(htmlToText(null)).toBe("");
    expect(htmlToText(undefined)).toBe("");
    expect(htmlToText("<p></p><p>&nbsp;</p>")).toBe("");
  });
});

describe("reviewerLogText", () => {
  const note = {
    title: "June Tax return",
    logs: [
      {
        id: "a",
        text: "<p>Documents received.</p>",
        createdBy: "Asha Rao",
        createdByEmail: "asha@firm.test",
        time: "17/11/2026, 10:00:00",
      },
      {
        id: "b",
        text: "<p>Reviewed.</p><ul><li>W-2 ok</li></ul>",
        createdBy: "Ben Li",
        createdByEmail: "",
        time: "17/11/2026, 11:30:00",
      },
    ],
  };

  it("copies the heading and every entry, oldest first, numbered as shown", () => {
    expect(reviewerLogText(note)).toBe(
      [
        "June Tax return",
        "",
        "Log 1 - Asha Rao (asha@firm.test) - 17/11/2026, 10:00:00",
        "Documents received.",
        "",
        "Log 2 - Ben Li - 17/11/2026, 11:30:00",
        "Reviewed.",
        "- W-2 ok",
      ].join("\n")
    );
  });

  it("copies an entry with no text as having no text, not as HTML", () => {
    const text = reviewerLogText({
      title: "T",
      logs: [{ id: "x", text: "", createdBy: "A", time: "t" }],
    });
    expect(text).toBe("T\n\nLog 1 - A - t\n(no text)");
  });

  it("copies just the heading when there are no entries", () => {
    expect(reviewerLogText({ title: "T", logs: [] })).toBe("T");
    expect(reviewerLogText({ title: "T" })).toBe("T");
  });

  it("does not throw for a missing note", () => {
    expect(reviewerLogText(null)).toBe("");
  });
});

describe("copyText", () => {
  const realClipboard = navigator.clipboard;
  const realExec = document.execCommand;

  afterEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: realClipboard,
      configurable: true,
    });
    document.execCommand = realExec;
  });

  it("uses the clipboard API when the browser has it", async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    await expect(copyText("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to a hidden text box when the clipboard API fails", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: jest.fn().mockRejectedValue(new Error("denied")) },
      configurable: true,
    });
    let copied = null;
    document.execCommand = jest.fn(() => {
      copied = document.activeElement?.value;
      return true;
    });

    await expect(copyText("hello")).resolves.toBe(true);
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(copied).toBe("hello");
    expect(document.querySelectorAll("textarea")).toHaveLength(0);
  });

  it("reports failure when neither way works", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    document.execCommand = jest.fn(() => false);

    await expect(copyText("hello")).resolves.toBe(false);
  });
});

describe("LogAuthor", () => {
  it("shows the author's name in bold and the email in normal weight", () => {
    const { container } = render(
      <LogAuthor name="Asha Rao" email="asha@firm.test" />
    );
    const bold = container.querySelector("strong");
    expect(bold).not.toBeNull();
    expect(bold.textContent).toBe("Asha Rao");
    expect(container.textContent).toBe("Asha Rao (asha@firm.test)");
    expect(bold.textContent).not.toContain("asha@firm.test");
  });

  it("shows just the bold name when there is no email", () => {
    const { container } = render(<LogAuthor name="Ben Li" email="" />);
    expect(container.querySelector("strong").textContent).toBe("Ben Li");
    expect(container.textContent).toBe("Ben Li");
  });

  it("shows a placeholder when the author is unknown", () => {
    const { container } = render(<LogAuthor name="" email="" />);
    expect(container.querySelector("strong").textContent).toBe("Unknown");
  });
});
