// src/pages/Settings/providerRedirect.js
//
// Connecting a mailbox by signing in with Google, Microsoft or Zoho is a
// full-page redirect to the provider's own page. It used to happen with no
// warning; ProviderRedirectNotice now says where the user is going and why,
// then goes on by itself. This is the wording and the timing, kept apart
// from the component so they can be tested (render tests are blocked in
// this repo - decisions.md, 2026-10-24).

// Long enough to read the title, short enough not to feel like a wait.
export const REDIRECT_DELAY_MS = 1500;

const NAMES = { google: "Google", microsoft: "Microsoft", zoho: "Zoho" };

export const redirectCopy = (provider) => {
  const name = NAMES[provider] || "your email provider";
  const page = NAMES[provider] ? `${name}'s own page` : "your provider's own page";

  return {
    name,
    title: `Taking you to ${name} to sign in`,
    body:
      `You'll sign in on ${page}, so ClientGage never sees your password. ` +
      "When you're done, you'll come back here and the mailbox will be connected.",
  };
};

/**
 * Go to `url` after the notice has been seen.
 *
 * @returns { cancel, goNow } - Cancel stays on the page; Continue now goes
 *          at once. Either way it goes at most once.
 */
export const scheduleRedirect = (
  url,
  { delayMs = REDIRECT_DELAY_MS, go = (u) => window.location.assign(u) } = {},
) => {
  let done = false;

  const goOnce = () => {
    if (done) return;
    done = true;
    clearTimeout(timer);
    go(url);
  };

  const timer = setTimeout(goOnce, delayMs);

  return {
    cancel: () => {
      done = true;
      clearTimeout(timer);
    },
    goNow: goOnce,
  };
};
