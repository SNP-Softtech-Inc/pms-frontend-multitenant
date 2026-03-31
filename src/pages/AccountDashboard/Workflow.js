import React from "react";
import { NavLink, Outlet, useParams, useLocation } from "react-router-dom";
import { Box, Tabs, Tab, Divider } from "@mui/material";

const Workflow = () => {
  const { accountId } = useParams();
  const location = useLocation();

  // ✅ Tab routes
  const tabRoutes = [
    `/clients/accounts/accountsdash/workflow/${accountId}/pipelines`,
    `/clients/accounts/accountsdash/workflow/${accountId}/activejobs`,
    `/clients/accounts/accountsdash/workflow/${accountId}/archivedjobs`,
    `/clients/accounts/accountsdash/workflow/${accountId}/pendingtasks`,
    `/clients/accounts/accountsdash/workflow/${accountId}/completetasks`,
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
          <Tab label="Pipelines" component={NavLink} to={tabRoutes[0]} />
          <Tab label="Active Jobs" component={NavLink} to={tabRoutes[1]} />
          <Tab label="Archived Jobs" component={NavLink} to={tabRoutes[2]} />
          <Tab label="Pending Tasks" component={NavLink} to={tabRoutes[3]} />
          <Tab label="Completed Tasks" component={NavLink} to={tabRoutes[4]} />
        </Tabs>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 2 }} />  

      {/* Content */}
      <Box mt={2}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Workflow;