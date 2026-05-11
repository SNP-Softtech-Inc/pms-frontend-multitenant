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
      {/* ✅ Tabs */}
      <div className="mt-3 overflow-x-auto">
        <div className="flex gap-2 border-b pb-2">
          {tabs.map((tab, index) => (
            <NavLink
              key={tab.label}
              to={tab.path}
              end={index === 0} // optional: makes first tab exact match
              className={({ isActive }) =>
                `no-underline px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ||
                  (currentTab === -1 && index === 0) // fallback like MUI default
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 border-t" />

      {/* Content */}
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Email;