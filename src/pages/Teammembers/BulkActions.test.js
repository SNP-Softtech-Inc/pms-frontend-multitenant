// Teams & Plans bulk actions through the buttons (v1.89.0), API faked.
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ConfirmProvider } from "../../components/ConfirmDialogContext";

const mockShowToast = jest.fn();
const mockApi = {
  deactivateTeamMember: jest.fn(),
  reactivateTeamMember: jest.fn(),
  resendActivation: jest.fn(),
  deleteTeamMember: jest.fn(),
  deleteGroup: jest.fn(),
  getGroups: jest.fn(),
  addMembersToGroup: jest.fn(),
};

jest.mock("../../services/api", () => ({
  authAPI: new Proxy({}, { get: (_t, k) => (...a) => mockApi[k](...a) }),
}));
jest.mock("../../context/ToastContext", () => ({ useToastContext: () => ({ showToast: mockShowToast }) }));

// eslint-disable-next-line import/first
import BulkActions from "./BulkActions";

const members = [
  { id: "m1", name: "Asha Rao", raw: { userId: "u1" } },
  { id: "m2", name: "Ben Li", raw: { userId: "u2" } },
];

const renderBulk = (kind, rows = members) => {
  const onDone = jest.fn();
  render(
    <ConfirmProvider>
      <BulkActions kind={kind} rows={rows} onDone={onDone} />
    </ConfirmProvider>
  );
  return { onDone };
};

const click = (name) => fireEvent.click(screen.getByRole("button", { name }));

beforeEach(() => {
  Object.values(mockApi).forEach((f) => f.mockReset().mockResolvedValue({ data: {} }));
  mockShowToast.mockReset();
});

describe("BulkActions", () => {
  it("deactivates every selected member after asking", async () => {
    const { onDone } = renderBulk("active");

    click(/deactivate/i);
    expect(await screen.findByText("Deactivate 2 team members?")).toBeInTheDocument();
    click("Deactivate");

    await waitFor(() => expect(onDone).toHaveBeenCalled());
    expect(mockApi.deactivateTeamMember.mock.calls).toEqual([["m1"], ["m2"]]);
    expect(mockShowToast).toHaveBeenCalledWith({ title: "Deactivated 2 team members", type: "success" });
  });

  it("does nothing when the question is cancelled", async () => {
    const { onDone } = renderBulk("active");

    click(/deactivate/i);
    click(await screen.findByRole("button", { name: "Cancel" }).then((b) => b.textContent));

    await waitFor(() => expect(screen.queryByText("Deactivate 2 team members?")).not.toBeInTheDocument());
    expect(mockApi.deactivateTeamMember).not.toHaveBeenCalled();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("reactivates, and names any member who could not be", async () => {
    mockApi.reactivateTeamMember
      .mockResolvedValueOnce({ data: {} })
      .mockRejectedValueOnce({ response: { data: { message: "Ben has not accepted the invitation yet." } } });
    renderBulk("inactive");

    click(/reactivate/i);
    click(await screen.findByRole("button", { name: "Reactivate" }).then((b) => b.textContent));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Reactivated 1 team member; 1 could not be",
          description: "Ben Li: Ben has not accepted the invitation yet.",
          type: "warning",
        })
      )
    );
  });

  it("says deleting cannot be undone, and deletes members", async () => {
    renderBulk("inactive");

    click(/delete/i);
    expect(await screen.findByText(/This cannot be undone/)).toBeInTheDocument();
    click("Delete permanently");

    await waitFor(() => expect(mockApi.deleteTeamMember.mock.calls).toEqual([["m1"], ["m2"]]));
  });

  it("deletes groups through the group route", async () => {
    renderBulk("groups", [{ id: "g1", name: "Ops" }]);

    click(/delete/i);
    expect(await screen.findByText(/Their members are not deleted/)).toBeInTheDocument();
    click("Delete permanently");

    await waitFor(() => expect(mockApi.deleteGroup).toHaveBeenCalledWith("g1"));
    expect(mockApi.deleteTeamMember).not.toHaveBeenCalled();
  });

  it("adds the selected members' sign-ins to the chosen group in one request", async () => {
    mockApi.getGroups.mockResolvedValue({ data: [{ _id: "g1", name: "Ops" }] });
    const { onDone } = renderBulk("active", [...members, { id: "m3", name: "Invitee", raw: {} }]);

    click(/add to group/i);
    fireEvent.change(await screen.findByLabelText("Group"), { target: { value: "g1" } });
    click("Add");

    await waitFor(() => expect(mockApi.addMembersToGroup).toHaveBeenCalledWith("g1", ["u1", "u2"]));
    expect(onDone).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Added 2 team members to the group", type: "warning" })
    );
  });

  it("offers each tab only its own actions", () => {
    renderBulk("groups", [{ id: "g1", name: "Ops" }]);
    expect(screen.queryByRole("button", { name: /deactivate/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /reactivate/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
