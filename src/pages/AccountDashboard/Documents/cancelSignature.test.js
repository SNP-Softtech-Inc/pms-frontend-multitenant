// Cancel Signature Request (v1.83.0). The screen sent the name stored in the
// file's meta, which for a file uploaded under a taken name ("X(2).pdf") is
// the original "X.pdf" - so the server cleared the wrong file. It now sends the
// file's real name, and says why a cancel failed instead of a bare
// "Failed to cancel signature".
import { cancelRequest, cancelResultToast } from "./cancelSignature";

describe("cancelRequest", () => {
  const item = {
    name: "1000109575(2).pdf",
    meta: {
      name: "1000109575.pdf",
      folder: "6ab9/Firm docs shared with client/E-File Authorization",
      esignRequestId: "6afc28c3c8214a07c92cc88f",
    },
  };

  it("sends the file's real name, not the name stored in its meta", () => {
    expect(cancelRequest(item)).toEqual({
      id: "6afc28c3c8214a07c92cc88f",
      body: {
        folder: "6ab9/Firm docs shared with client/E-File Authorization",
        name: "1000109575(2).pdf",
      },
    });
  });

  it("is nothing to send without a request id", () => {
    expect(cancelRequest({ name: "a.pdf", meta: { folder: "f" } })).toBeNull();
    expect(cancelRequest({ name: "a.pdf" })).toBeNull();
    expect(cancelRequest(null)).toBeNull();
  });
});

describe("cancelResultToast", () => {
  it("confirms a cancel, naming the file", () => {
    expect(cancelResultToast(null, { file: "1000109575(2).pdf" })).toEqual({
      title: "Signature request cancelled",
      description: "1000109575(2).pdf can be edited and sent again.",
      type: "success",
    });
  });

  it("confirms without a file name too", () => {
    expect(cancelResultToast(null, {})).toMatchObject({ title: "Signature request cancelled", type: "success" });
  });

  it("shows the server's reason when the cancel fails", () => {
    const err = { response: { data: { error: "This document has already been signed, so its request cannot be cancelled." } } };
    expect(cancelResultToast(err)).toEqual({
      title: "Could not cancel the signature request",
      description: "This document has already been signed, so its request cannot be cancelled.",
      type: "error",
    });
  });

  it("asks to try again when there is no reason", () => {
    expect(cancelResultToast(new Error("Network Error"))).toEqual({
      title: "Could not cancel the signature request",
      description: "Please try again.",
      type: "error",
    });
  });
});
