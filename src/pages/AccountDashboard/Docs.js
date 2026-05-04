// // import React from "react";
// // import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
// // import { Box, Tabs, Tab, Divider } from "@mui/material";

// // const Docs = () => {
// //   const { accountId } = useParams();
// //   const location = useLocation();

// //   // ✅ Tab routes
// //   const tabRoutes = [
// //     `/clients/accounts/accountsdash/docs/${accountId}/documents`,
// //     `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
// //     `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
   
// //     `/clients/accounts/accountsdash/docs/${accountId}/trash`,
   
// //   ];

// //   // ✅ Active tab detection
// //   const currentTab = tabRoutes.findIndex((route) =>
// //     location.pathname.startsWith(route)
// //   );

// //   return (
// //     <Box>
// //       {/* ✅ Tabs */}
// //       <Box sx={{ mt: 3 }}>
// //         <Tabs
// //           value={currentTab === -1 ? 0 : currentTab}
// //           variant="scrollable"
// //           scrollButtons="auto"
// //           allowScrollButtonsMobile
// //           sx={{
// //     "& .MuiTab-root": {
// //       textTransform: "none", // ✅ removes uppercase
// //     },
// //     }}
// //         >
// //           <Tab label="Documents" component={NavLink} to={tabRoutes[0]} />
// //           <Tab label="Approvals" component={NavLink} to={tabRoutes[1]} />
// //           <Tab label="Signatures" component={NavLink} to={tabRoutes[2]} />
         
// //           <Tab label="Trash" component={NavLink} to={tabRoutes[3]} />
         
// //         </Tabs>
// //       </Box>

// //       {/* Divider */}
// //       <Divider sx={{ my: 2 }} />

// //       {/* Content */}
// //       <Box mt={2}>
// //         <Outlet />
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Docs;

// // // import React from "react";
// // // import { NavLink, Outlet, useParams } from "react-router-dom";

// // // const Docs = () => {
// // //   const { accountId } = useParams();

// // //   const navLinks = [
// // //     {
// // //       to: `/clients/accounts/accountsdash/docs/${accountId}/documents`,
// // //       label: "Documents",
// // //     },
// // //     {
// // //       to: `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
// // //       label: "Approvals",
// // //     },
// // //     {
// // //       to: `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
// // //       label: "Signatures",
// // //     },
// // //     {
// // //       to: `/clients/accounts/accountsdash/docs/${accountId}/trash`,
// // //       label: "Trash",
// // //     },
// // //   ];

// // //   return (
// // //     <div>
// // //       {/* Tabs */}
// // //       <div className="px-1 pt-4 pb-0">
// // //         <div className="inline-flex items-center gap-1 bg-muted rounded-xl p-1 flex-wrap">
// // //           {navLinks.map(({ to, label }) => (
// // //             <NavLink
// // //               key={to}
// // //               to={to}
// // //               end={label === "Documents"} // ✅ important for index route
// // //               className={({ isActive }) =>
// // //                 `no-underline px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
// // //                   isActive
// // //                     ? "bg-card text-foreground shadow-sm"
// // //                     : "text-muted-foreground hover:text-foreground hover:bg-card/60"
// // //                 }`
// // //               }
// // //             >
// // //               {label}
// // //             </NavLink>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Divider */}
// // //       <div className="h-px bg-border mt-3" />

// // //       {/* Content */}
// // //       <div className="pt-4">
// // //         <Outlet />
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Docs;

// import React from "react";
// import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";

// const Docs = () => {
//   const { accountId } = useParams();
//   const location = useLocation();

//   // ✅ Tab routes (unchanged)
//   const tabRoutes = [
//     `/clients/accounts/accountsdash/docs/${accountId}/documents`,
//     `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
//     `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
//     `/clients/accounts/accountsdash/docs/${accountId}/trash`,
//   ];

//   // ✅ Active tab detection (unchanged)
//   const currentTab = tabRoutes.findIndex((route) =>
//     location.pathname.startsWith(route)
//   );

//   return (
//     <div>
//       {/* ✅ Tabs */}
//       <div className="mt-3 overflow-x-auto">
//         <div className="flex gap-2 border-b">
//           {[
//             { label: "Documents", path: tabRoutes[0] },
//             { label: "Approvals", path: tabRoutes[1] },
//             { label: "Signatures", path: tabRoutes[2] },
//             { label: "Trash", path: tabRoutes[3] },
//           ].map((tab, index) => {
//             const isActive = (currentTab === -1 ? 0 : currentTab) === index;

//             return (
//               <NavLink
//                 key={tab.label}
//                 to={tab.path}
//                 className={`px-4 py-2 text-sm whitespace-nowrap transition-colors
//                   ${
//                     isActive
//                       ? "border-b-2 border-primary text-primary font-medium"
//                       : "text-muted-foreground hover:text-foreground"
//                   }
//                 `}
//               >
//                 {tab.label}
//               </NavLink>
//             );
//           })}
//         </div>
//       </div>

//       {/* Divider */}
//       <div className="my-4 border-t" />

//       {/* Content */}
//       <div className="mt-2">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Docs;


import React from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";

const Docs = () => {
  const { accountId } = useParams();
  const location = useLocation();

  // ✅ Tab routes (unchanged)
  const tabRoutes = [
    `/clients/accounts/accountsdash/docs/${accountId}/documents`,
    `/clients/accounts/accountsdash/docs/${accountId}/approvals`,
    `/clients/accounts/accountsdash/docs/${accountId}/signatures`,
    `/clients/accounts/accountsdash/docs/${accountId}/trash`,
  ];

  // ✅ Keep this (used for default fallback)
  const currentTab = tabRoutes.findIndex((route) =>
    location.pathname.startsWith(route)
  );

  const tabs = [
    { label: "Documents", path: tabRoutes[0] },
    { label: "Approvals", path: tabRoutes[1] },
    { label: "Signatures", path: tabRoutes[2] },
    { label: "Trash", path: tabRoutes[3] },
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

export default Docs;