// Connecting a mailbox by signing in with Google, Microsoft or Zoho leaves
// the app for the provider's own page. The page used to jump there with no
// word of warning; now a notice says where the user is going and why, then
// goes on by itself.
import { redirectCopy, scheduleRedirect, REDIRECT_DELAY_MS } from "./providerRedirect";

describe("redirectCopy", () => {
  it.each([
    ["google", "Google"],
    ["microsoft", "Microsoft"],
    ["zoho", "Zoho"],
  ])("names %s", (provider, name) => {
    const copy = redirectCopy(provider);

    expect(copy.name).toBe(name);
    expect(copy.title).toBe(`Taking you to ${name} to sign in`);
    expect(copy.body).toContain(`${name}'s own page`);
    expect(copy.body).toMatch(/never sees your password/);
    expect(copy.body).toMatch(/come back here/);
  });

  it("still says something sensible for a provider it does not know", () => {
    expect(redirectCopy("other").title).toBe("Taking you to your email provider to sign in");
    expect(redirectCopy(undefined).name).toBe("your email provider");
  });
});

describe("scheduleRedirect", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  // CRA's resetMocks strips jest.fn implementations, so a plain recorder.
  const recorder = () => {
    const go = (url) => go.calls.push(url);
    go.calls = [];
    return go;
  };

  it("goes after the notice has been seen, not before", () => {
    const go = recorder();
    scheduleRedirect("https://login.example/start", { go });

    jest.advanceTimersByTime(REDIRECT_DELAY_MS - 1);
    expect(go.calls).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(go.calls).toEqual(["https://login.example/start"]);
  });

  it("is short enough not to feel like a wait", () => {
    expect(REDIRECT_DELAY_MS).toBeGreaterThanOrEqual(800);
    expect(REDIRECT_DELAY_MS).toBeLessThanOrEqual(2500);
  });

  it("can be cancelled - Cancel stays on the page", () => {
    const go = recorder();
    const { cancel } = scheduleRedirect("https://login.example/start", { go });

    cancel();
    jest.advanceTimersByTime(60000);

    expect(go.calls).toEqual([]);
  });

  it("can go at once - Continue now", () => {
    const go = recorder();
    const { goNow } = scheduleRedirect("https://login.example/start", { go });

    goNow();
    jest.advanceTimersByTime(60000);

    // Once, not again when the timer would have fired.
    expect(go.calls).toEqual(["https://login.example/start"]);
  });

  it("goes only once however it is triggered", () => {
    const go = recorder();
    const { goNow } = scheduleRedirect("https://login.example/start", { go });

    goNow();
    goNow();

    expect(go.calls).toHaveLength(1);
  });
});
