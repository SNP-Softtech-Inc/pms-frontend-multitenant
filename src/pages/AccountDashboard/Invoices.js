import React from 'react'
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Divider } from "@mui/material";
const Invoices = () => {
  const { accountId } = useParams();
  const location = useLocation();

  const tabRoutes = [
    `/clients/accounts/accountsdash/invoices/${accountId}/invoices`,
    `/clients/accounts/accountsdash/invoices/${accountId}/payment`,

  ];
  // ✅ Find active tab
  const currentTab = tabRoutes.findIndex((route) =>
    location.pathname.startsWith(route)
  );
  return (
    <Box>
         {/* ✅ Tabs */}
         <Box sx={{ mt: 3 }}>
           <Tabs
             value={currentTab === -1 ? 0 : currentTab}
             variant="scrollable"
             scrollButtons="auto"
             allowScrollButtonsMobile
             sx={{
       "& .MuiTab-root": {
         textTransform: "none", // ✅ removes uppercase
       },
     }}
           >
             <Tab label="Invoice" component={NavLink} to={tabRoutes[0]} />
             <Tab label="Payments" component={NavLink} to={tabRoutes[1]} />

           </Tabs>
         </Box>
   
         {/* Divider */}
         <Divider sx={{ my: 2 }} />  
   
         {/* Content */}
         <Box mt={2}>
           <Outlet />
         </Box>
       </Box>
  )
}

export default Invoices