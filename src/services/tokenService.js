// Access token is stored in sessionStorage so it is scoped to a single tab:
// it survives reloads but is cleared when the tab is closed (auto-logout on close).
const TOKEN_KEY = "accessToken";
const EXPIRES_KEY = "sessionExpiresAt";

export const setAccessToken = (token) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
};

export const getAccessToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const clearAccessToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
};
