


// import React, { useState, useEffect } from "react";
// import { NavLink, Link, Outlet, useLocation, useParams } from "react-router-dom";
// import { ArrowLeft, ExternalLink } from "lucide-react";
// import Cookies from 'js-cookie';
// import { accountsAPI } from "../services/api";
// const AccountsDash = () => {
//   const { accountId } = useParams();
//   const location = useLocation();
//   const [accName, setAccName] = useState("");

//   // Store accountId in cookie
//   useEffect(() => {
//     if (accountId) {
//       Cookies.set("accountId", accountId);
//     }
//   }, [accountId]);

//   // Cleanup cookies
//   useEffect(() => {
//     return () => {
//       Cookies.remove("accountId");
//       Cookies.remove("accountName");
//     };
//   }, []);

//   // Fetch account details
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccName(res.data.accountName);
//       Cookies.set("accountName", res.data.accountName);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };

//   useEffect(() => {
//     if (accountId) {
//       fetchAccountDetails();
//     }
//   }, [accountId]);

//   const navItems = [
//     {
//       label: "Overview",
//       to: `/clients/accounts/accountsdash/overview/${accountId}`,
//     },
//     {
//       label: "Info",
//       to: `/clients/accounts/accountsdash/info/${accountId}`,
//     },
//     {
//       label: "Docs",
//       to: `/clients/accounts/accountsdash/docs/${accountId}`,
//     },
//     {
//       label: "Communication",
//       to: `/clients/accounts/accountsdash/communication/${accountId}`,
//     },
//     {
//       label: "Organizers",
//       to: `/clients/accounts/accountsdash/organizers/${accountId}`,
//     },
//     {
//       label: "Invoices",
//       to: `/clients/accounts/accountsdash/invoices/${accountId}`,
//     },
//     {
//       label: "Email",
//       to: `/clients/accounts/accountsdash/email/${accountId}`,
//     },
//     {
//       label: "Proposals & ELs",
//       to: `/clients/accounts/accountsdash/proposals/${accountId}`,
//     },
//     {
//       label: "Notes",
//       to: `/clients/accounts/accountsdash/notes/${accountId}`,
//     },
//     {
//       label: "Workflow",
//       to: `/clients/accounts/accountsdash/workflow/${accountId}`,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Sticky Header */}
//       {/* z-30 */}
//       <header
//         className="
//           sticky top-0 
//           border-b border-border
//           bg-background/95
//           backdrop-blur
//           supports-[backdrop-filter]:bg-background/80
//         "
//       >
//         {/* Account Header */}
//         <div
//           className="
//             flex items-center gap-4
//             px-6 py-4
//             border-b border-border/60
//           "
//         >
//           <Link
//             to="/clients/accounts/activeaccounts"
//             className="
//               flex h-10 w-10 shrink-0 items-center justify-center
//               rounded-xl border border-border
//               text-muted-foreground
//               hover:bg-accent
//               hover:text-foreground
//               transition-colors
//               no-underline
//             "
//           >
//             <ArrowLeft size={18} />
//           </Link>

//           <div className="min-w-0 flex-1">
//             <h1 className="truncate text-lg font-semibold tracking-tight">
//               {accName || "Account"}
//             </h1>

//             <p className="mt-1 text-sm text-muted-foreground">
//               Manage account information and activities
//             </p>
//           </div>
//         </div>

//         {/* Tabs Navigation */}
//         <div className="px-6">
//           <div className="flex overflow-x-auto scrollbar-hide">
//             {navItems.map(({ label, to }) => {
//               const isActive = location.pathname === to;

//               return (
//                 <NavLink
//                   key={to}
//                   to={to}
//                   className={`
//                     relative whitespace-nowrap
//                     px-4 py-3
//                     text-sm font-medium
//                     transition-all duration-200
//                     border-b-2
//                     no-underline
//                     ${
//                       isActive
//                         ? "border-primary text-primary"
//                         : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
//                     }
//                   `}
//                 >
//                   {label}
//                 </NavLink>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       {/* Page Content */}
//       <main>
//         {/* <div
//           className="
//             rounded-2xl
//             border border-border
//             bg-card
//             text-card-foreground
//             shadow-sm
           
//           "
//         > */}
//           <Outlet />
//         {/* </div> */}
//       </main>
//     </div>
//   );
// };

// export default AccountsDash;


import React, { useState, useEffect, useRef } from "react";
import {
  NavLink,
  Link,
  Outlet,
  useLocation,
  useParams,
} from "react-router-dom";
import Cookies from "js-cookie";
import { ArrowLeft, Building2, ExternalLink } from "lucide-react";
import { accountsAPI } from "../services/api";

const AccountsDash = () => {
  const { accountId } = useParams();
  const location = useLocation();

  const [accName, setAccName] = useState("");

  useEffect(() => {
    if (accountId) Cookies.set("accountId", accountId);
  }, [accountId]);

  useEffect(() => {
    return () => {
      Cookies.remove("accountId");
      Cookies.remove("accountName");
    };
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await accountsAPI.getAccountById(accountId);
        setAccName(res.data.accountName);
        Cookies.set("accountName", res.data.accountName);
      } catch (err) {
        console.error(err);
      }
    };

    if (accountId) fetchAccount();
  }, [accountId]);

  // Sub-views (the Documents tab strip, the folder toolbar) pin themselves
  // directly below this header. Publishing its measured height keeps those
  // offsets honest instead of relying on hard-coded pixel guesses that drift
  // whenever the header's padding changes.
  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;

    const publish = () =>
      document.documentElement.style.setProperty(
        "--acct-header-h",
        `${el.offsetHeight}px`,
      );

    publish();

    // jsdom and older browsers have no ResizeObserver; the measurement taken
    // above still stands, it just stops tracking later size changes.
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(publish);
    if (observer) observer.observe(el);

    return () => {
      if (observer) observer.disconnect();
      document.documentElement.style.removeProperty("--acct-header-h");
    };
  }, []);

  const navItems = [
    { label: "Overview", to: `/clients/accounts/accountsdash/overview/${accountId}` },
    { label: "Info", to: `/clients/accounts/accountsdash/info/${accountId}` },
    { label: "Documents", to: `/clients/accounts/accountsdash/docs/${accountId}` },
    { label: "Communication", to: `/clients/accounts/accountsdash/communication/${accountId}` },
    { label: "Organizers", to: `/clients/accounts/accountsdash/organizers/${accountId}` },
    { label: "Invoices", to: `/clients/accounts/accountsdash/invoices/${accountId}` },
    { label: "Email", to: `/clients/accounts/accountsdash/email/${accountId}` },
    { label: "Proposals", to: `/clients/accounts/accountsdash/proposals/${accountId}` },
    { label: "Notes", to: `/clients/accounts/accountsdash/notes/${accountId}` },
    { label: "Workflow", to: `/clients/accounts/accountsdash/workflow/${accountId}` },
  ];

  return (
    // -mt-4 cancels the top padding of the dashboard shell's <main>, which was
    // leaving a band of empty background above the account name.
    <div className="-mt-4 min-h-screen bg-muted/20">
      {/* Header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        {/* The account name and the section tabs share a single row so the
            selected tab's content starts as high up the page as possible. */}
        <div className="flex items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-2.5 py-1.5">
            <Link
              to="/clients/accounts/activeaccounts"
              className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-4 w-4" />
            </div>

            <h1
              className="max-w-[220px] truncate text-base font-semibold tracking-tight"
              title={accName || "Account"}
            >
              {accName || "Account"}
            </h1>

            <ExternalLink className="h-3.5 w-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground" />
          </div>

          {/* Navigation */}
          <nav className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center whitespace-nowrap rounded-none border-b-2 px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountsDash;