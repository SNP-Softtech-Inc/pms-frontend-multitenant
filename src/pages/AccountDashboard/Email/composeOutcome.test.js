// What the Compose drawer tells staff after Send.
//
// It said "Email Sent" whatever the server answered. Compose now sends from
// the firm's own mailbox (account-contact v1.13.0), so a firm with none
// connected gets every email refused - and staff must be told, not shown
// a success.
import { composeOutcome } from "./composeOutcome";

const NO_MAILBOX = "No mailbox is connected that can send. An admin can connect one in Account Settings under Email Sync.";

describe("composeOutcome", () => {
  it("reports success when every email went", () => {
    expect(composeOutcome({ emailsSent: 2, failed: [], failures: [] })).toEqual({
      type: "success", title: "Email Sent", close: true,
    });
  });

  it("reports an error, with the reason, when none went - and keeps the draft open", () => {
    const outcome = composeOutcome({
      emailsSent: 0,
      failed: ["a@client.test", "b@client.test"],
      failures: [{ email: "a@client.test", reason: NO_MAILBOX }, { email: "b@client.test", reason: NO_MAILBOX }],
    });

    expect(outcome).toEqual({ type: "error", title: "Email not sent", description: NO_MAILBOX, close: false });
  });

  it("names who was missed when only some went", () => {
    const outcome = composeOutcome({
      emailsSent: 1,
      failed: ["b@client.test"],
      failures: [{ email: "b@client.test", reason: "Mailbox refused the message." }],
    });

    expect(outcome.type).toBe("warning");
    expect(outcome.title).toBe("Sent to 1 of 2");
    expect(outcome.description).toContain("b@client.test");
    expect(outcome.description).toContain("Mailbox refused the message.");
    expect(outcome.close).toBe(true);
  });

  it("lists different reasons once each", () => {
    const outcome = composeOutcome({
      emailsSent: 0,
      failed: ["a@x.test", "b@x.test", "c@x.test"],
      failures: [
        { email: "a@x.test", reason: "R1" },
        { email: "b@x.test", reason: "R2" },
        { email: "c@x.test", reason: "R1" },
      ],
    });

    expect(outcome.description).toBe("R1 R2");
  });

  it("still tells the truth from a server that sends only `failed`", () => {
    const outcome = composeOutcome({ emailsSent: 0, failed: ["a@client.test"] });

    expect(outcome.type).toBe("error");
    expect(outcome.close).toBe(false);
    expect(outcome.description).toMatch(/a@client\.test/);
  });

  it("does not claim success for an answer it cannot read", () => {
    expect(composeOutcome(undefined).type).toBe("error");
    expect(composeOutcome({}).type).toBe("error");
  });
});
