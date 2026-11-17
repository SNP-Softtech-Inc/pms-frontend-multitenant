// The warning before a sign-in runs out (v1.84.0).
import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

let mockAuth;
const mockShowToast = jest.fn();

jest.mock("../context/AuthContext", () => ({ useAuth: () => mockAuth }));
jest.mock("../context/ToastContext", () => ({ useToastContext: () => ({ showToast: mockShowToast }) }));

// eslint-disable-next-line import/first
import SessionExpiryWarning from "./SessionExpiryWarning";

const sessionEndingIn = (ms, durationMs = 8 * HOUR) => ({ expiresAt: Date.now() + ms, durationMs });

beforeEach(() => {
  jest.useFakeTimers();
  mockShowToast.mockReset();
  mockAuth = { isAuthenticated: true, session: null, renewSession: jest.fn() };
});
afterEach(() => jest.useRealTimers());

describe("SessionExpiryWarning", () => {
  it("stays out of the way while plenty of time is left", () => {
    mockAuth.session = sessionEndingIn(2 * HOUR);
    render(<SessionExpiryWarning />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("appears 10 minutes before the end, saying how long is left", () => {
    mockAuth.session = sessionEndingIn(10 * MIN);
    render(<SessionExpiryWarning />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/your session will expire in 10 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/save your work/i)).toBeInTheDocument();
  });

  it("appears on its own when the time comes, and counts down", () => {
    mockAuth.session = sessionEndingIn(10 * MIN + 2000);
    render(<SessionExpiryWarning />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByText(/expire in 10 minutes/i)).toBeInTheDocument();

    act(() => jest.advanceTimersByTime(5 * MIN));
    expect(screen.getByText(/expire in 5 minutes/i)).toBeInTheDocument();
  });

  it("renews the session and says for how long", async () => {
    mockAuth.session = sessionEndingIn(5 * MIN);
    mockAuth.renewSession.mockResolvedValue({
      session: { expiresAt: new Date(Date.now() + 8 * HOUR).toISOString(), durationMs: 8 * HOUR },
    });
    render(<SessionExpiryWarning />);

    fireEvent.click(screen.getByRole("button", { name: /renew session/i }));

    await waitFor(() => expect(mockAuth.renewSession).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Session renewed", type: "success", description: expect.stringMatching(/8 hours/) })
      )
    );
  });

  it("says why when renewing fails", async () => {
    mockAuth.session = sessionEndingIn(5 * MIN);
    mockAuth.renewSession.mockRejectedValue({ response: { data: { message: "Your session has already expired. Please sign in again." } } });
    render(<SessionExpiryWarning />);

    fireEvent.click(screen.getByRole("button", { name: /renew session/i }));

    await waitFor(() =>
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: "error", description: "Your session has already expired. Please sign in again." })
      )
    );
  });

  it("can be dismissed, and stays dismissed for that session", () => {
    mockAuth.session = sessionEndingIn(5 * MIN);
    render(<SessionExpiryWarning />);

    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    act(() => jest.advanceTimersByTime(MIN));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("never shows when signed out", () => {
    mockAuth.isAuthenticated = false;
    mockAuth.session = sessionEndingIn(5 * MIN);
    render(<SessionExpiryWarning />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
