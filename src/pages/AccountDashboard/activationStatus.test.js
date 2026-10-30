// The account page's activation badge, decided from the contact record.
import { activationStatusOf } from "./activationStatus";

const NOW = new Date("2026-10-30T12:00:00Z").getTime();

describe("activationStatusOf", () => {
  it("shows an activated client as active", () => {
    expect(activationStatusOf({ isActivated: true }, NOW)).toBe("activated");
  });

  it("shows active even when an old link expiry is still stored", () => {
    expect(activationStatusOf({ isActivated: true, activationTokenExpires: "2026-10-01T00:00:00Z" }, NOW)).toBe("activated");
  });

  it("shows pending while the link is still valid", () => {
    expect(activationStatusOf({ isActivated: false, activationTokenExpires: "2026-11-05T00:00:00Z" }, NOW)).toBe("pending");
  });

  it("shows expired once the link has run out", () => {
    expect(activationStatusOf({ isActivated: false, activationTokenExpires: "2026-10-24T06:57:01.703Z" }, NOW)).toBe("expired");
  });

  it("shows not activated when no link was ever sent", () => {
    expect(activationStatusOf({ isActivated: false }, NOW)).toBe("not_sent");
    expect(activationStatusOf({}, NOW)).toBe("not_sent");
  });

  it("does not guess from a missing contact", () => {
    expect(activationStatusOf(undefined, NOW)).toBe("not_sent");
    expect(activationStatusOf(null, NOW)).toBe("not_sent");
  });

  it("treats an unreadable expiry as no link", () => {
    expect(activationStatusOf({ isActivated: false, activationTokenExpires: "not a date" }, NOW)).toBe("not_sent");
  });
});
