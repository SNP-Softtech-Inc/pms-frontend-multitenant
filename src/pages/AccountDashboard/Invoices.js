// import React from 'react'
// import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
// import { Box, Tabs, Tab, Divider } from "@mui/material";
// const Invoices = () => {
//   const { accountId } = useParams();
//   const location = useLocation();

//   const tabRoutes = [
//     `/clients/accounts/accountsdash/invoices/${accountId}/invoices`,
//     `/clients/accounts/accountsdash/invoices/${accountId}/payment`,

//   ];
//   // ✅ Find active tab
//   const currentTab = tabRoutes.findIndex((route) =>
//     location.pathname.startsWith(route)
//   );
//   return (
//     <Box>
//          {/* ✅ Tabs */}
//          <Box sx={{ mt: 3 }}>
//            <Tabs
//              value={currentTab === -1 ? 0 : currentTab}
//              variant="scrollable"
//              scrollButtons="auto"
//              allowScrollButtonsMobile
//              sx={{
//        "& .MuiTab-root": {
//          textTransform: "none", // ✅ removes uppercase
//        },
//      }}
//            >
//              <Tab label="Invoice" component={NavLink} to={tabRoutes[0]} />
//              <Tab label="Payments" component={NavLink} to={tabRoutes[1]} />

//            </Tabs>
//          </Box>
   
//          {/* Divider */}
//          <Divider sx={{ my: 2 }} />  
   
//          {/* Content */}
//          <Box mt={2}>
//            <Outlet />
//          </Box>
//        </Box>
//   )
// }

// export default Invoices

import React from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";

const Invoices = () => {
  const { accountId } = useParams();
  const location = useLocation();

  const tabRoutes = [
    `/clients/accounts/accountsdash/invoices/${accountId}/invoices`,
    `/clients/accounts/accountsdash/invoices/${accountId}/payment`,
  ];

  const tabs = [
    {
      label: "Invoice",
      path: tabRoutes[0],
    },
    {
      label: "Payments",
      path: tabRoutes[1],
    },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mt-3 border-b">
        <div className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive: navActive }) =>
                `whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  navActive || isActive(tab.path)
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Invoices;