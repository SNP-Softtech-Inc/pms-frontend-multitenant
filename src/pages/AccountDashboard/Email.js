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
    <div>
      {/* ✅ Tabs
          The active tab used bg-card, which is all but the same colour as the
          surface behind it, so neither Inbox nor Sent read as selected. It
          carries a filled pill now. The separate divider below is gone too -
          the strip already has a bottom border, so there were two rules a few
          pixels apart. */}
      <div className="overflow-x-auto border-b">
        <div className="flex gap-1 pb-2">
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

      {/* Content */}
      <div className="mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Email;