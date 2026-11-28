// The password-reset link's id and token (v1.92.0).
//
// New links (signup-login v1.54.0): /admin/reset-password#id=<id>&token=<token>.
// What follows '#' is never sent to the server, so nginx never logs it.
// Old links: /admin/reset-password/<id>/<token>, read from the route - they
// keep working.

/** { id, token } from the route params, else from the hash. Empty strings if neither. */
export const resetCredentialsFrom = (params, hash) => {
  if (params?.id && params?.token) return { id: params.id, token: params.token };
  const values = new URLSearchParams(String(hash || "").replace(/^#/, ""));
  return { id: values.get("id") || "", token: values.get("token") || "" };
};

/** The hash with id and token removed - "" when nothing else was in it. */
export const hashWithoutCredentials = (hash) => {
  const values = new URLSearchParams(String(hash || "").replace(/^#/, ""));
  values.delete("id");
  values.delete("token");
  const rest = values.toString();
  return rest ? `#${rest}` : "";
};
