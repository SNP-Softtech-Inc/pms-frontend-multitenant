// The phone line under a contact on the account page.
import { contactPhonesText } from "./contactPhones";

describe("contactPhonesText", () => {
  it("shows a contact's phone number as stored, like the Contacts list", () => {
    expect(contactPhonesText({ phoneNumbers: ["919876543210"] })).toBe("919876543210");
  });

  it("shows every number, comma separated", () => {
    expect(contactPhonesText({ phoneNumbers: ["15551234567", "919876543210"] })).toBe(
      "15551234567, 919876543210",
    );
  });

  it("leaves out blank entries - most stored contacts have one", () => {
    expect(contactPhonesText({ phoneNumbers: ["", "  ", "15551234567"] })).toBe("15551234567");
  });

  it("trims spaces around a number", () => {
    expect(contactPhonesText({ phoneNumbers: [" 15551234567 "] })).toBe("15551234567");
  });

  it("returns empty text when there is no number", () => {
    expect(contactPhonesText({ phoneNumbers: [""] })).toBe("");
    expect(contactPhonesText({ phoneNumbers: [] })).toBe("");
    expect(contactPhonesText({})).toBe("");
  });

  it("copes with a single string instead of a list", () => {
    expect(contactPhonesText({ phoneNumbers: "15551234567" })).toBe("15551234567");
  });

  it("does not throw for a missing contact or non-text entries", () => {
    expect(contactPhonesText(undefined)).toBe("");
    expect(contactPhonesText(null)).toBe("");
    expect(contactPhonesText({ phoneNumbers: [null, undefined, 15551234567] })).toBe("15551234567");
  });
});
