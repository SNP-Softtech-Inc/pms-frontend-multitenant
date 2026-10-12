import React from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";

const Email = () => {
  const { accountId } = useParams();
  const location = useLocation();

  // ✅ Tab routes (unchanged)
  const tabRoutes = [
    `/clients/accounts/accountsdash/email/${accountId}/inbox`,
    `/clients/accounts/accountsdash/email/${accountId}/sent`,
   
  ];

  // ✅ Keep this (used for default fallback)
  const currentTab = tabRoutes.findIndex((route) =>
    location.pathname.startsWith(route)
  );

  const tabs = [
    { label: "Inbox", path: tabRoutes[0] },
    { label: "Sent", path: tabRoutes[1] },
   
  ];

  return (
    // EmailViewer is h-full with its own scrolling panes, so it needs a parent
    // with a real height - without one the panes grow to fit their content and
    // the conversation never scrolls, it just makes the page longer. The
    // account header publishes its measured height as --acct-header-h; the
    // remainder covers the shell's own padding and this tab strip.
    <div className="flex h-[calc(100vh-var(--acct-header-h,46px)-6.5rem)] min-h-[540px] flex-col">
      {/* ✅ Tabs
          The active tab used bg-card, which is all but the same colour as the
          surface behind it, so neither Inbox nor Sent read as selected. It
          carries a filled pill now. The separate divider below is gone too -
          the strip already has a bottom border, so there were two rules a few
          pixels apart. */}
      <div className="shrink-0 overflow-x-auto border-b">
        {/* pt-3 is the fix for the reported overlap: the row had bottom
            padding only, so the pills sat flush under the sticky account
            header and their background ran straight into it. px-1 keeps them
            off the left edge as well. */}
        <div className="flex gap-1 px-1 pb-2.5 pt-3">
          {tabs.map((tab, index) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              end={index === 0} // optional: makes first tab exact match
              className={({ isActive }) =>
                `no-underline px-4 py-1.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive ||
                  (currentTab === -1 && index === 0) // fallback like MUI default
                    ? "bg-primary/10 font-semibold text-primary ring-1 ring-primary/20"
                    : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content - min-h-0 is what lets this shrink inside the flex column so
          the panes below can own the scrolling. */}
      <div className="min-h-0 flex-1 pt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Email;