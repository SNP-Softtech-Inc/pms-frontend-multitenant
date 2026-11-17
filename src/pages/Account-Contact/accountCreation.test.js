// Creating a client account with its contacts (v1.87.0).
import {
  friendlyError,
  duplicatePrompt,
  partialFailureMessage,
  contactKey,
} from "./accountCreation";

const serverError = (status, data) => ({ response: { status, data } });

describe("friendlyError", () => {
  it("never shows a database regex message", () => {
    const err = serverError(500, { error: "Regular expression is invalid: unmatched closing parenthesis" });
    expect(friendlyError(err)).toBe(
      "A name contains characters that could not be processed. Please try again; if it keeps happening, contact support."
    );
  });

  it("never shows a raw duplicate-key message", () => {
    const err = serverError(500, { error: "E11000 duplicate key error collection: clientaccounts index: accountName_1_tenantId_1" });
    expect(friendlyError(err)).toBe("That name is already in use. Please choose a different one.");
  });

  it("turns a validation error object into the fields to check", () => {
    const err = serverError(400, {
      name: "ValidationError",
      errors: { email: { path: "email" }, clientType: { path: "clientType" } },
    });
    expect(friendlyError(err)).toBe("Please check: email, client type.");
  });

  it("explains a lost connection", () => {
    expect(friendlyError({ message: "Network Error" })).toBe(
      "Could not reach the server. Check your connection and try again."
    );
    expect(friendlyError({ code: "ECONNABORTED", message: "timeout of 30000ms exceeded" })).toBe(
      "The server took too long to answer. Please try again."
    );
  });

  it("passes a plain server message through", () => {
    expect(friendlyError(serverError(409, { error: 'An account named "Basha" already exists.' }))).toBe(
      'An account named "Basha" already exists.'
    );
    expect(friendlyError(serverError(400, { message: "Contact name is required" }))).toBe("Contact name is required");
  });

  it("falls back when there is nothing usable", () => {
    expect(friendlyError(serverError(500, {}), "Could not save the account.")).toBe("Could not save the account.");
    expect(friendlyError(null)).toBe("Something went wrong. Please try again.");
  });
});

describe("duplicatePrompt", () => {
  it("lists every possible duplicate and asks what to do", () => {
    const prompt = duplicatePrompt([
      { contactName: "Basha (Mystery)", email: "b@x.test", reasons: ['A contact named "Basha (Mystery)" already exists. This one would be saved as "Basha (Mystery) (2)".'] },
      { contactName: "Asha", email: "a@x.test", reasons: ["A contact with the email a@x.test already exists (Asha Rao)."] },
    ]);

    expect(prompt.title).toBe("Possible duplicate contacts");
    expect(prompt.description).toBe(
      [
        "• Basha (Mystery): A contact named \"Basha (Mystery)\" already exists. This one would be saved as \"Basha (Mystery) (2)\".",
        "• Asha: A contact with the email a@x.test already exists (Asha Rao).",
        "",
        "Create them anyway, or cancel to change them?",
      ].join("\n")
    );
    expect(prompt.confirmText).toBe("Create anyway");
  });

  it("speaks of one contact in the singular", () => {
    const prompt = duplicatePrompt([{ contactName: "Asha", reasons: ["r"] }]);
    expect(prompt.title).toBe("Possible duplicate contact");
    expect(prompt.description).toMatch(/Create it anyway, or cancel to change it\?$/);
  });
});

describe("partialFailureMessage", () => {
  it("says plainly that the contact exists but the account does not", () => {
    expect(partialFailureMessage(["Basha (Mystery)"], "That name is already in use.")).toEqual({
      title: "Contact created, but the account was not",
      description:
        "Basha (Mystery) was created. The account was not: That name is already in use. Fix it and save again - the contact will not be created a second time.",
    });
  });

  it("names several contacts", () => {
    expect(partialFailureMessage(["A", "B"], "reason").title).toBe("Contacts created, but the account was not");
    expect(partialFailureMessage(["A", "B"], "reason").description).toMatch(/^A, B were created\./);
  });
});

describe("contactKey", () => {
  it("recognises the same contact across attempts by email", () => {
    expect(contactKey({ email: " Basha@Client.Test " })).toBe("basha@client.test");
    expect(contactKey({})).toBe("");
  });
});
