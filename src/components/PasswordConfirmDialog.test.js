// My Account → Security → Login Details (v1.84.0). Saving asked for the
// password through window.prompt - a browser box headed with the site's
// address, showing the password as plain text. This is the PMS dialog that
// replaces it.
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PasswordConfirmDialog from "./PasswordConfirmDialog";

const setup = (props = {}) => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();
  render(
    <PasswordConfirmDialog
      open
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />
  );
  return { onConfirm, onCancel, input: screen.getByLabelText(/current password/i) };
};

describe("PasswordConfirmDialog", () => {
  it("asks for the current password in a masked field, inside the app", () => {
    const { input } = setup();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/confirm it's you/i)).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
  });

  it("confirms with the password typed", () => {
    const { onConfirm, input } = setup();

    fireEvent.change(input, { target: { value: "CorrectHorse1!" } });
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    expect(onConfirm).toHaveBeenCalledWith("CorrectHorse1!");
  });

  it("confirms on Enter", () => {
    const { onConfirm, input } = setup();

    fireEvent.change(input, { target: { value: "pw" } });
    fireEvent.submit(input.closest("form"));

    expect(onConfirm).toHaveBeenCalledWith("pw");
  });

  it("cannot confirm with nothing typed", () => {
    const { onConfirm } = setup();

    const button = screen.getByRole("button", { name: /confirm/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("shows why the password was refused, and stays open to try again", () => {
    setup({ error: "Invalid password" });

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid password");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("cancels without confirming", () => {
    const { onConfirm, onCancel } = setup();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("disables both buttons while saving", () => {
    const { input } = setup({ submitting: true });
    fireEvent.change(input, { target: { value: "pw" } });

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });

  it("starts empty each time it opens", () => {
    const { rerender } = render(<PasswordConfirmDialog open={false} onConfirm={() => {}} onCancel={() => {}} />);
    rerender(<PasswordConfirmDialog open onConfirm={() => {}} onCancel={() => {}} />);
    const input = screen.getByLabelText(/current password/i);
    fireEvent.change(input, { target: { value: "typed" } });

    rerender(<PasswordConfirmDialog open={false} onConfirm={() => {}} onCancel={() => {}} />);
    rerender(<PasswordConfirmDialog open onConfirm={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText(/current password/i)).toHaveValue("");
  });
});
