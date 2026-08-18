


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


import React, { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        {/* Top */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-5">
            <Link
              to="/clients/accounts/activeaccounts"
              className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background transition hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {accName || "Account"}
                  </h1>

                  <ExternalLink className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>

                <p className="text-sm text-muted-foreground mt-1">
                  Client Account Management
                </p>
              </div>
            </div>
          </div>

          {/* Optional Actions */}
          <div className="flex items-center gap-3">
            {/* Add Buttons here */}
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t bg-background">
          <div className="px-8">
            <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative flex items-center whitespace-nowrap rounded-none border-b-2 px-4 py-3 text-sm font-medium transition-all ${
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
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AccountsDash;