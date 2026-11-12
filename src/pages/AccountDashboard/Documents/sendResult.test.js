// What the admin is told after Send for signature.
import { sendResultToast } from "./sendResult";

describe("sendResultToast", () => {
  it("counts who was actually sent to, not everyone on the account", () => {
    const toast = sendResultToast(
      { submitters: [{ email: "basha@client.test" }], skipped: [{ name: "Nithish TEst", email: "nithish@client.test" }] },
      2,
    );

    expect(toast.type).toBe("success");
    expect(toast.title).toBe("Sent to 1 recipient(s)");
    expect(toast.description).toBe("Not sent to Nithish TEst - no field was placed for them.");
  });

  it("names everyone left out, by email when there is no name", () => {
    const toast = sendResultToast(
      { submitters: [{}], skipped: [{ name: "A", email: "a@x.test" }, { name: null, email: "b@x.test" }] },
      3,
    );

    expect(toast.description).toBe("Not sent to A, b@x.test - no field was placed for them.");
  });

  it("says nothing extra when everyone was sent to", () => {
    const toast = sendResultToast({ submitters: [{}, {}], skipped: [] }, 2);

    expect(toast).toEqual({ title: "Sent to 2 recipient(s)", type: "success" });
  });

  it("falls back to the requested count for an older server answer", () => {
    expect(sendResultToast({ success: true }, 2)).toEqual({ title: "Sent to 2 recipient(s)", type: "success" });
    expect(sendResultToast(undefined, 1)).toEqual({ title: "Sent to 1 recipient(s)", type: "success" });
  });
});
