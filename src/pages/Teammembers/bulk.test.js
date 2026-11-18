// Teams & Plans bulk actions (v1.89.0).
import { runBulk, bulkResultToast, countLabel } from "./bulk";

const rows = [
  { id: "1", name: "Asha Rao" },
  { id: "2", name: "Ben Li" },
  { id: "3", name: "Cara Doe" },
];

describe("runBulk", () => {
  it("runs the action for each one, in order, one at a time", async () => {
    const seen = [];
    let running = 0;
    let most = 0;
    const action = async (r) => {
      running += 1;
      most = Math.max(most, running);
      seen.push(r.id);
      await new Promise((res) => setTimeout(res, 1));
      running -= 1;
    };

    const result = await runBulk(rows, action);

    expect(seen).toEqual(["1", "2", "3"]);
    expect(most).toBe(1);
    expect(result.succeeded.map((r) => r.id)).toEqual(["1", "2", "3"]);
    expect(result.failed).toEqual([]);
  });

  it("carries on past a failure and says which and why", async () => {
    const action = async (r) => {
      if (r.id === "2") throw { response: { data: { message: "Ben has not accepted the invitation yet." } } };
    };

    const result = await runBulk(rows, action);

    expect(result.succeeded.map((r) => r.id)).toEqual(["1", "3"]);
    expect(result.failed).toEqual([{ item: rows[1], reason: "Ben has not accepted the invitation yet." }]);
  });

  it("gives a reason even when the error has none", async () => {
    const result = await runBulk([rows[0]], async () => {
      throw new Error("Network Error");
    });
    expect(result.failed[0].reason).toBe("Network Error");
  });
});

describe("countLabel", () => {
  it("counts in words", () => {
    expect(countLabel(1, "team member")).toBe("1 team member");
    expect(countLabel(3, "team member")).toBe("3 team members");
    expect(countLabel(2, "group")).toBe("2 groups");
  });
});

describe("bulkResultToast", () => {
  it("says everything worked", () => {
    expect(bulkResultToast({ verb: "deactivate", done: "Deactivated" }, "team member", { succeeded: rows, failed: [] })).toEqual({
      title: "Deactivated 3 team members",
      type: "success",
    });
  });

  it("names the ones that did not, with the reason", () => {
    expect(
      bulkResultToast({ verb: "reactivate", done: "Reactivated" }, "team member", {
        succeeded: [rows[0]],
        failed: [{ item: rows[1], reason: "has not accepted the invitation yet." }],
      })
    ).toEqual({
      title: "Reactivated 1 team member; 1 could not be",
      description: "Ben Li: has not accepted the invitation yet.",
      type: "warning",
      duration: 10000,
    });
  });

  it("says when nothing worked, with the plain verb", () => {
    expect(
      bulkResultToast({ verb: "add to the group", done: "Added to the group" }, "team member", {
        succeeded: [],
        failed: [{ item: { name: "Asha" }, reason: "x" }],
      }).title
    ).toBe("Could not add to the group any of the 1 team member");
  });

  it("says when nothing worked", () => {
    expect(
      bulkResultToast({ verb: "delete", done: "Deleted" }, "group", { succeeded: [], failed: [{ item: { name: "Ops" }, reason: "Not found" }] })
    ).toMatchObject({ title: "Could not delete any of the 1 group", type: "error" });
  });
});
