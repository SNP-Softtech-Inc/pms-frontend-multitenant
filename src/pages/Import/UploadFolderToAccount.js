import React, { useState } from "react";
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import AccountTable from "./AccountTable"; // your existing component
import CompletedAccountsTable from "./CompletedAccountsTable"; // you can create this later
const AccountUploadPage = () => {
  const [activeTab, setActiveTab] = useState("incomplete");

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔘 Button Group */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <ButtonGroup variant="contained">
          <Button
            variant={activeTab === "incomplete" ? "contained" : "outlined"}
            onClick={() => setActiveTab("incomplete")}
          >
            Incomplete Data Upload
          </Button>

          <Button
            variant={activeTab === "completed" ? "contained" : "outlined"}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </Button>
        </ButtonGroup>
      </Paper>

      {/* 🔄 Conditional Rendering */}
      {activeTab === "incomplete" && <AccountTable />}

      {activeTab === "completed" && (
        <Paper sx={{ p: 3 }}>
          {/* Later you can create CompletedAccountsTable component */}
          <CompletedAccountsTable />
        </Paper>
      )}
    </Box>
  );
};

export default AccountUploadPage;