// import React from "react";
// import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
// import { Box, Tabs, Tab, Divider } from "@mui/material";

// const Docs = () => {
//   const { accountId } = useParams();
//   const location = useLocation();

//   // ✅ Tab routes
//   const tabRoutes = [
//     `/clients/accounts/accountsdash/docs/${accountId}/documents`,
//     `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
//     `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
   
//     `/clients/accounts/accountsdash/docs/${accountId}/trash`,
   
//   ];

//   // ✅ Active tab detection
//   const currentTab = tabRoutes.findIndex((route) =>
//     location.pathname.startsWith(route)
//   );

//   return (
//     <Box>
//       {/* ✅ Tabs */}
//       <Box sx={{ mt: 3 }}>
//         <Tabs
//           value={currentTab === -1 ? 0 : currentTab}
//           variant="scrollable"
//           scrollButtons="auto"
//           allowScrollButtonsMobile
//           sx={{
//     "& .MuiTab-root": {
//       textTransform: "none", // ✅ removes uppercase
//     },
//     }}
//         >
//           <Tab label="Documents" component={NavLink} to={tabRoutes[0]} />
//           <Tab label="Approvals" component={NavLink} to={tabRoutes[1]} />
//           <Tab label="Signatures" component={NavLink} to={tabRoutes[2]} />
         
//           <Tab label="Trash" component={NavLink} to={tabRoutes[3]} />
         
//         </Tabs>
//       </Box>

//       {/* Divider */}
//       <Divider sx={{ my: 2 }} />

//       {/* Content */}
//       <Box mt={2}>
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Docs;

import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";

const Docs = () => {
  const { accountId } = useParams();

  const navLinks = [
    {
      to: `/clients/accounts/accountsdash/docs/${accountId}/documents`,
      label: "Documents",
    },
    {
      to: `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
      label: "Approvals",
    },
    {
      to: `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
      label: "Signatures",
    },
    {
      to: `/clients/accounts/accountsdash/docs/${accountId}/trash`,
      label: "Trash",
    },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="px-1 pt-4 pb-0">
        <div className="inline-flex items-center gap-1 bg-muted rounded-xl p-1 flex-wrap">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={label === "Documents"} // ✅ important for index route
              className={({ isActive }) =>
                `no-underline px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mt-3" />

      {/* Content */}
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Docs;