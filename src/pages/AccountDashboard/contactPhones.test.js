// The phone line under a contact on the account page.
import { contactPhonesText, formatPhone } from "./contactPhones";

describe("formatPhone", () => {
  it("shows the country code with a +, then a space, then the number", () => {
    // As the contact form saves it: digits, country code first, no "+".
    expect(formatPhone("919175981613")).toBe("+91 91759 81613");
  });

  it("formats a US number the same way", () => {
    expect(formatPhone("12025550143")).toBe("+1 202 555 0143");
  });

  it("accepts a number already written with + and spaces or dashes", () => {
    expect(formatPhone("+91 91759-81613")).toBe("+91 91759 81613");
    expect(formatPhone("+1 (202) 555-0143")).toBe("+1 202 555 0143");
  });

  it("leaves a number it cannot recognise exactly as stored", () => {
    // A 10-digit US number imported without its country code: guessing one
    // would show a wrong number, so it is not reformatted.
    expect(formatPhone("2025550143")).toBe("2025550143");
    expect(formatPhone("ext. 42")).toBe("ext. 42");
    expect(formatPhone("12345")).toBe("12345");
  });

  it("trims, and returns empty text for nothing", () => {
    expect(formatPhone(" 919175981613 ")).toBe("+91 91759 81613");
    expect(formatPhone("")).toBe("");
    expect(formatPhone("   ")).toBe("");
    expect(formatPhone(null)).toBe("");
    expect(formatPhone(undefined)).toBe("");
  });
});

describe("contactPhonesText", () => {
  it("shows a contact's phone number formatted", () => {
    expect(contactPhonesText({ phoneNumbers: ["919175981613"] })).toBe("+91 91759 81613");
  });

  it("shows every number, comma separated", () => {
    expect(contactPhonesText({ phoneNumbers: ["12025550143", "919175981613"] })).toBe(
      "+1 202 555 0143, +91 91759 81613",
    );
  });

  it("leaves out blank entries - most stored contacts have one", () => {
    expect(contactPhonesText({ phoneNumbers: ["", "  ", "12025550143"] })).toBe("+1 202 555 0143");
  });

  it("returns empty text when there is no number", () => {
    expect(contactPhonesText({ phoneNumbers: [""] })).toBe("");
    expect(contactPhonesText({ phoneNumbers: [] })).toBe("");
    expect(contactPhonesText({})).toBe("");
  });

  it("copes with a single string instead of a list", () => {
    expect(contactPhonesText({ phoneNumbers: "12025550143" })).toBe("+1 202 555 0143");
  });

  it("does not throw for a missing contact or non-text entries", () => {
    expect(contactPhonesText(undefined)).toBe("");
    expect(contactPhonesText(null)).toBe("");
    expect(contactPhonesText({ phoneNumbers: [null, undefined, 12025550143] })).toBe("+1 202 555 0143");
  });
});
