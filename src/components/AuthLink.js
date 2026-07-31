import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HANDOFF_PARAM } from "../utils/authHandoff";

// The app is served under this router basename, so raw <a href> values (which are
// real browser navigations, not react-router links) must include it.
const BASENAME = "/admin";

// Build a full href for `routerPath` (a react-router path without the basename)
// carrying a fresh handoff marker, e.g. "/clients/..." -> "/admin/clients/...?handoff=uuid".
export const withHandoff = (routerPath) => {
  const id = crypto.randomUUID();
  const [path, existingQuery = ""] = routerPath.split("?");
  const params = new URLSearchParams(existingQuery);
  params.set(HANDOFF_PARAM, id);
  return `${BASENAME}${path}?${params.toString()}`;
};

// A link to an app record. A plain left-click navigates in the SAME tab (SPA),
// like a normal <Link>. The href carries `?handoff=<uuid>` so right-click ->
// "Open in new tab" (and Ctrl/Cmd/middle click) opens it already-authenticated.
const AuthLink = ({ to, children, onClick, ...rest }) => {
  const navigate = useNavigate();
  const href = useMemo(() => withHandoff(to), [to]);

  const handleClick = (e) => {
    if (typeof onClick === "function") onClick(e);
    if (e.defaultPrevented) return;

    // Let the browser open a new tab (with the handoff href) natively.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    // Plain left-click: navigate in the current tab (no handoff needed here).
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};

export default AuthLink;
