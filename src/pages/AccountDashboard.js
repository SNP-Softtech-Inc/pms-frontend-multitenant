// import React, { useState, useEffect } from "react";
// import { Link, Outlet, useLocation, useParams } from "react-router-dom";
// import { IoArrowBackSharp } from "react-icons/io5";
// import { FaRegEye } from "react-icons/fa";
// import Cookies from "js-cookie";
// import { Box, Typography, Tabs, Tab ,Divider} from "@mui/material";

// import { accountsAPI } from "../services/api";

// const AccountsDash = () => {
//   const { accountId } = useParams();
//   const location = useLocation();

//   const [accName, setAccName] = useState();

//   // ✅ Store accountId in cookie
//   useEffect(() => {
//     if (accountId) {
//       Cookies.set("accountId", accountId);
//     }
//   }, [accountId]);

//   // ✅ Cleanup cookies
//   useEffect(() => {
//     return () => {
//       Cookies.remove("accountId");
//       Cookies.remove("accountName");
//     };
//   }, []);

//   // ✅ Fetch account details
// const fetchAccountDetails = async () => {
//   try {
//     const res = await accountsAPI.getAccountById(accountId);

//     setAccName(res.data.accountName);
//     Cookies.set("accountName", res.data.accountName);

//     console.log("result", res.data);
//   } catch (error) {
//     console.error("Error fetching account details:", error);
//   }
// };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);

//   // ✅ Tab routes
//   const tabRoutes = [
//     `/clients/accounts/accountsdash/overview/${accountId}`,
//     `/clients/accounts/accountsdash/info/${accountId}`,
//     `/clients/accounts/accountsdash/docs/${accountId}`,
//     `/clients/accounts/accountsdash/communication/${accountId}`,
//     `/clients/accounts/accountsdash/organizers/${accountId}`,
//     `/clients/accounts/accountsdash/invoices/${accountId}`,
//     `/clients/accounts/accountsdash/email/${accountId}`,
//     `/clients/accounts/accountsdash/proposals/${accountId}`,
//     `/clients/accounts/accountsdash/notes/${accountId}`,
//     `/clients/accounts/accountsdash/workflow/${accountId}`,
//   ];

//   // ✅ Detect active tab
//   const currentTab = tabRoutes.findIndex((route) =>
//     location.pathname.startsWith(route)
//   );

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Link to="/clients/accounts/activeaccounts">
//           <IoArrowBackSharp style={{ fontSize: "25px" }} />
//         </Link>
//         <FaRegEye style={{ cursor: "pointer", color: "#007bff" }} />
//         <Typography sx={{ fontWeight: "bold" }}>{accName}</Typography>
//       </Box>

//       {/* ✅ MUI Tabs */}
//       <Box sx={{ mt: 4 }}>
//         <Tabs
//           value={currentTab === -1 ? 0 : currentTab}
//           variant="scrollable"
//           scrollButtons="auto"
//           allowScrollButtonsMobile
          
//         sx={{
//     "& .MuiTab-root": {
//       textTransform: "none", // ✅ removes uppercase
//     },
//   }}
//         >
//           <Tab label="Overview" component={Link} to={tabRoutes[0]} />
//           <Tab label="Info" component={Link} to={tabRoutes[1]} />
//           <Tab label="Docs" component={Link} to={tabRoutes[2]} />
//           <Tab label="Communication" component={Link} to={tabRoutes[3]} />
//           <Tab label="Organizers" component={Link} to={tabRoutes[4]} />
//           <Tab label="Invoices" component={Link} to={tabRoutes[5]} />
//           <Tab label="Email" component={Link} to={tabRoutes[6]} />
//           <Tab label="Proposals & ELs" component={Link} to={tabRoutes[7]} />
//           <Tab label="Notes" component={Link} to={tabRoutes[8]} />
//           <Tab label="Workflow" component={Link} to={tabRoutes[9]} />
//         </Tabs>
//       </Box>

// <Divider sx={{ my: 2 }} />
//       {/* Content */}
//       <Box pl={3} pr={3} mt={2}>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default AccountsDash;


import React, { useState, useEffect } from "react";
import { NavLink, Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Cookies from 'js-cookie';
import { accountsAPI } from "../services/api";

// const AccountsDash = () => {
//   const { accountId } = useParams();
//   const location = useLocation();
//   const [accName, setAccName] = useState();

//   // ✅ Store accountId in cookie
//   useEffect(() => {
//     if (accountId) {
//       Cookies.set("accountId", accountId);
//     }
//   }, [accountId]);

//   // ✅ Cleanup cookies
//   useEffect(() => {
//     return () => {
//       Cookies.remove("accountId");
//       Cookies.remove("accountName");
//     };
//   }, []);

//   // ✅ Fetch account details
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccName(res.data.accountName);
//       Cookies.set("accountName", res.data.accountName);
//       console.log("result", res.data);
//     } catch (error) {
//       console.error("Error fetching account details:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);

//   // ✅ Tab routes
//   const tabRoutes = [
//     `/clients/accounts/accountsdash/overview/${accountId}`,
//     `/clients/accounts/accountsdash/info/${accountId}`,
//     `/clients/accounts/accountsdash/docs/${accountId}`,
//     `/clients/accounts/accountsdash/communication/${accountId}`,
//     `/clients/accounts/accountsdash/organizers/${accountId}`,
//     `/clients/accounts/accountsdash/invoices/${accountId}`,
//     `/clients/accounts/accountsdash/email/${accountId}`,
//     `/clients/accounts/accountsdash/proposals/${accountId}`,
//     `/clients/accounts/accountsdash/notes/${accountId}`,
//     `/clients/accounts/accountsdash/workflow/${accountId}`,
//   ];

//   // Tab labels
//   const tabLabels = [
//     "Overview",
//     "Info",
//     "Docs",
//     "Communication",
//     "Organizers",
//     "Invoices",
//     "Email",
//     "Proposals & ELs",
//     "Notes",
//     "Workflow"
//   ];

//   // Combine routes with labels
//   const navItems = tabRoutes.map((route, index) => [route, tabLabels[index]]);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top header bar */}
//       <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3 shadow-sm">
//         <Link
//           to="/clients/accounts/activeaccounts"
//           className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors no-underline"
//         >
//           <ArrowLeft size={16} />
//         </Link>
//         <div className="flex items-center gap-2">
         
//           <span className="font-semibold text-foreground text-base leading-none">{accName}</span>
//         </div>
//       </div>

//       {/* Sub-navigation - mt-4 matches original mt={4} */}
//       <div className="bg-card border-b border-border px-4 py-0 mt-4">
//         <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
//           {navItems.map(([to, label]) => (
//             <NavLink
//               key={to}
//               to={to}
//               className={({ isActive }) =>
//                 `no-underline whitespace-nowrap px-4 py-3 text-sm font-medium transition-all duration-150 border-b-2 ${
//                   isActive
//                     ? "border-primary text-primary"
//                     : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
//                 }`
//               }
//             >
//               {label}
//             </NavLink>
//           ))}
//         </div>
//       </div>

//       {/* Divider - matches Divider sx={{ my: 2 }} */}
//       <div className="border-t border-border my-2"></div>

//       {/* Page content - matches Box pl={3} pr={3} mt={2} */}
//       <div className="px-3 py-2 mt-2">
//         <Outlet />
//       </div>
//     </div>
//   );
// };



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
