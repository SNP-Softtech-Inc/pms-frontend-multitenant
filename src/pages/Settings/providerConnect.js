// src/pages/Settings/providerConnect.js
//
// Starting a Google, Microsoft or Zoho mailbox sign-in (v1.91.0).
//
// The Connect buttons used to send the browser to
// /api/googleauth/google?token=<login token> (and the same for Microsoft and
// Zoho). The token sat in a URL: nginx's access log kept it, and so did the
// browser's history. Now the page POSTs to the server with the token in the
// Authorization header (authAPI.connectMailProvider), the server prepares the
// sign-in exactly as before and answers with the provider's URL, and the page
// sends the browser there.
//
// The URL is checked before the browser goes: only that provider's own sign-in
// host, over https. Whatever the server answers, the browser is never sent
// anywhere else. Kept out of MyAccount.js so it can be tested.

export const CONNECT_PROVIDERS = ["google", "microsoft", "zoho"];

// Where each provider's sign-in starts. Zoho's begins at accounts.zoho.com for
// every region (the server's zohoOAuth.authorizeUrl); the region only matters
// on the way back.
const SIGN_IN_ORIGINS = {
  google: "https://accounts.google.com",
  microsoft: "https://login.microsoftonline.com",
  zoho: "https://accounts.zoho.com",
};

export const isProviderSignInUrl = (provider, url) => {
  const origin = SIGN_IN_ORIGINS[provider];
  if (!origin || typeof url !== "string" || !url) return false;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.origin !== origin) return false;

  // Belt and braces: a sign-in URL never needs our login token.
  if (parsed.searchParams.has("token")) return false;

  return true;
};

/**
 * Ask the server to start a sign-in, and return the URL to send the browser to.
 *
 * @param provider  "google" | "microsoft" | "zoho"
 * @param connect   authAPI.connectMailProvider (passed in so it can be tested)
 * @returns the provider's sign-in URL; rejects with the server's error as is,
 *          or with an Error if the answer is not that provider's page.
 */
export const startProviderConnect = async (provider, connect) => {
  if (!CONNECT_PROVIDERS.includes(provider)) {
    throw new Error(`Unknown mail provider: ${provider}`);
  }

  const res = await connect(provider);
  const url = res?.data?.url;

  if (!isProviderSignInUrl(provider, url)) {
    throw new Error("The server did not return the provider's sign-in page.");
  }

  return url;
};
