


import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Cookies from 'js-cookie';
import { accountsAPI } from "../services/api";
const AccountsDash = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const [accName, setAccName] = useState("");

  // Store accountId in cookie
  useEffect(() => {
    if (accountId) {
      Cookies.set("accountId", accountId);
    }
  }, [accountId]);

  // Cleanup cookies
  useEffect(() => {
    return () => {
      Cookies.remove("accountId");
      Cookies.remove("accountName");
    };
  }, []);

  // Fetch account details
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccName(res.data.accountName);
      Cookies.set("accountName", res.data.accountName);
    } catch (error) {
      console.error("Error fetching account details:", error);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountDetails();
    }
  }, [accountId]);

  const navItems = [
    {
      label: "Overview",
      to: `/clients/accounts/accountsdash/overview/${accountId}`,
    },
    {
      label: "Info",
      to: `/clients/accounts/accountsdash/info/${accountId}`,
    },
    {
      label: "Docs",
      to: `/clients/accounts/accountsdash/docs/${accountId}`,
    },
    {
      label: "Communication",
      to: `/clients/accounts/accountsdash/communication/${accountId}`,
    },
    {
      label: "Organizers",
      to: `/clients/accounts/accountsdash/organizers/${accountId}`,
    },
    {
      label: "Invoices",
      to: `/clients/accounts/accountsdash/invoices/${accountId}`,
    },
    {
      label: "Email",
      to: `/clients/accounts/accountsdash/email/${accountId}`,
    },
    {
      label: "Proposals & ELs",
      to: `/clients/accounts/accountsdash/proposals/${accountId}`,
    },
    {
      label: "Notes",
      to: `/clients/accounts/accountsdash/notes/${accountId}`,
    },
    {
      label: "Workflow",
      to: `/clients/accounts/accountsdash/workflow/${accountId}`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky Header */}
      <header
        className="
          sticky top-0 z-30
          border-b border-border
          bg-background/95
          backdrop-blur
          supports-[backdrop-filter]:bg-background/80
        "
      >
        {/* Account Header */}
        <div
          className="
            flex items-center gap-4
            px-6 py-4
            border-b border-border/60
          "
        >
          <Link
            to="/clients/accounts/activeaccounts"
            className="
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-xl border border-border
              text-muted-foreground
              hover:bg-accent
              hover:text-foreground
              transition-colors
              no-underline
            "
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {accName || "Account"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage account information and activities
            </p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {navItems.map(({ label, to }) => {
              const isActive = location.pathname === to;

              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`
                    relative whitespace-nowrap
                    px-4 py-3
                    text-sm font-medium
                    transition-all duration-200
                    border-b-2
                    no-underline
                    ${
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }
                  `}
                >
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main>
        {/* <div
          className="
            rounded-2xl
            border border-border
            bg-card
            text-card-foreground
            shadow-sm
           
          "
        > */}
          <Outlet />
        {/* </div> */}
      </main>
    </div>
  );
};

export default AccountsDash;
