// The fields offered in the signature builder, one set per recipient.
import { signerFields, DATE_FORMAT } from "./signerFields";

const basha = { name: "Basha Test", email: "basha@client.test", role: "Basha Test (basha@client.test)" };

describe("signerFields", () => {
  it("offers each recipient the same fields as before, plus Date signed", () => {
    const fields = signerFields([basha]);

    expect(fields.map((f) => f.name)).toEqual([
      "Text - Basha Test (basha@client.test)",
      "Signature - Basha Test (basha@client.test)",
      "Initials - Basha Test (basha@client.test)",
      "Date - Basha Test (basha@client.test)",
      "Date signed - Basha Test (basha@client.test)",
      "Number - Basha Test (basha@client.test)",
      "Image - Basha Test (basha@client.test)",
      "Checkbox - Basha Test (basha@client.test)",
      "File - Basha Test (basha@client.test)",
      "Phone - Basha Test (basha@client.test)",
    ]);
    expect(fields.map((f) => f.type)).toEqual([
      "text", "signature", "initials", "date", "datenow", "number", "image", "checkbox", "file", "phone",
    ]);
  });

  it("fills Date signed with the signing day as MM/DD/YYYY", () => {
    expect(DATE_FORMAT).toBe("MM/DD/YYYY");
    const dateSigned = signerFields([basha]).find((f) => f.type === "datenow");

    expect(dateSigned).toEqual({
      name: "Date signed - Basha Test (basha@client.test)",
      title: "Basha Test (basha@client.test)",
      type: "datenow",
      role: basha.role,
      preferences: { format: "MM/DD/YYYY" },
    });
  });

  it("states MM/DD/YYYY on the pickable Date field too", () => {
    expect(signerFields([basha]).find((f) => f.type === "date").preferences).toEqual({ format: "MM/DD/YYYY" });
  });

  it("leaves every other field exactly as it was - no preferences", () => {
    const others = signerFields([basha]).filter((f) => !["date", "datenow"].includes(f.type));

    others.forEach((f) => expect(Object.keys(f).sort()).toEqual(["name", "role", "title", "type"]));
    expect(others[0]).toEqual({
      name: "Text - Basha Test (basha@client.test)",
      title: "Basha Test (basha@client.test)",
      type: "text",
      role: basha.role,
    });
  });

  it("gives every recipient their own set, keyed to their role", () => {
    const nithish = { name: "Nithish", email: "n@client.test", role: "Nithish (n@client.test)" };
    const fields = signerFields([basha, nithish]);

    expect(fields).toHaveLength(20);
    expect(fields.slice(10).every((f) => f.role === nithish.role)).toBe(true);
  });

  it("names a recipient without a name or role as before", () => {
    const [first] = signerFields([{ email: "x@client.test" }, {}]);
    const second = signerFields([{ email: "x@client.test" }, {}])[10];

    expect(first.title).toBe("Signer 1 (x@client.test)");
    expect(first.role).toBe("Signer 1 (x@client.test)");
    expect(second.title).toBe("Signer 2");
  });

  it("returns nothing without recipients", () => {
    expect(signerFields(undefined)).toEqual([]);
    expect(signerFields([])).toEqual([]);
  });
});
