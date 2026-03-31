import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import Cookies from "js-cookie";
import { Box, Typography, Tabs, Tab ,Divider} from "@mui/material";

import { accountsAPI } from "../services/api";

const AccountsDash = () => {
  const { accountId } = useParams();
  const location = useLocation();

  const [accName, setAccName] = useState();

  // ✅ Store accountId in cookie
  useEffect(() => {
    if (accountId) {
      Cookies.set("accountId", accountId);
    }
  }, [accountId]);

  // ✅ Cleanup cookies
  useEffect(() => {
    return () => {
      Cookies.remove("accountId");
      Cookies.remove("accountName");
    };
  }, []);

  // ✅ Fetch account details
const fetchAccountDetails = async () => {
  try {
    const res = await accountsAPI.getAccountById(accountId);

    setAccName(res.data.accountName);
    Cookies.set("accountName", res.data.accountName);

    console.log("result", res.data);
  } catch (error) {
    console.error("Error fetching account details:", error);
  }
};

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // ✅ Tab routes
  const tabRoutes = [
    `/clients/accounts/accountsdash/overview/${accountId}`,
    `/clients/accounts/accountsdash/info/${accountId}`,
    `/clients/accounts/accountsdash/docs/${accountId}`,
    `/clients/accounts/accountsdash/communication/${accountId}`,
    `/clients/accounts/accountsdash/organizers/${accountId}`,
    `/clients/accounts/accountsdash/invoices/${accountId}/invoice`,
    `/clients/accounts/accountsdash/email/${accountId}/inbox`,
    `/clients/accounts/accountsdash/proposals/${accountId}`,
    `/clients/accounts/accountsdash/notes/${accountId}`,
    `/clients/accounts/accountsdash/workflow/${accountId}`,
  ];

  // ✅ Detect active tab
  const currentTab = tabRoutes.findIndex((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link to="/clients/accounts/activeaccounts">
          <IoArrowBackSharp style={{ fontSize: "25px" }} />
        </Link>
        <FaRegEye style={{ cursor: "pointer", color: "#007bff" }} />
        <Typography sx={{ fontWeight: "bold" }}>{accName}</Typography>
      </Box>

      {/* ✅ MUI Tabs */}
      <Box sx={{ mt: 4 }}>
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
          <Tab label="Overview" component={Link} to={tabRoutes[0]} />
          <Tab label="Info" component={Link} to={tabRoutes[1]} />
          <Tab label="Docs" component={Link} to={tabRoutes[2]} />
          <Tab label="Communication" component={Link} to={tabRoutes[3]} />
          <Tab label="Organizers" component={Link} to={tabRoutes[4]} />
          <Tab label="Invoices" component={Link} to={tabRoutes[5]} />
          <Tab label="Email" component={Link} to={tabRoutes[6]} />
          <Tab label="Proposals & ELs" component={Link} to={tabRoutes[7]} />
          <Tab label="Notes" component={Link} to={tabRoutes[8]} />
          <Tab label="Workflow" component={Link} to={tabRoutes[9]} />
        </Tabs>
      </Box>

<Divider sx={{ my: 2 }} />
      {/* Content */}
      <Box pl={3} pr={3} mt={2}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AccountsDash;