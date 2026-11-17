// src/components/RecordLink.jsx
//
// A record's name as a real link (v1.85.0), so right-click offers "Open link
// in new tab / new window" and Ctrl/Cmd/Shift/middle-click open one.
//
//   to      a route in this app (react-router, so the /admin base is added)
//   href    a URL outside it (a document), with newTab to open it in one
//   onOpen  what a plain left click does instead of navigating - opening a
//           drawer, expanding a folder, the in-app viewer. Without it a plain
//           click simply follows the link.
//
// A click the browser handles (modifier keys) never also runs the row's own
// click handler, so Ctrl-clicking a folder does not expand it here as well.
import React from "react";
import { Link } from "react-router-dom";
import { isPlainLeftClick } from "../lib/recordLinks";

const RecordLink = ({ to, href, newTab = false, onOpen, onClick, children, ...rest }) => {
  const handleClick = (e) => {
    if (onClick) onClick(e);

    if (!isPlainLeftClick(e)) {
      e.stopPropagation();
      return;
    }

    if (onOpen) {
      e.preventDefault();
      e.stopPropagation();
      onOpen(e);
    }
  };

  const tab = newTab ? { target: "_blank", rel: "noopener noreferrer" } : {};

  if (to !== undefined) {
    return (
      <Link to={to} onClick={handleClick} {...tab} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} {...tab} {...rest}>
      {children}
    </a>
  );
};

export default RecordLink;
