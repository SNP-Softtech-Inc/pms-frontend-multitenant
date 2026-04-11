import React, { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";

// ✅ Import your pages
import PendingTasks from "./PendingTasks";
import CompletedTasks from "./CompletedTasks";

const AccountTasksList = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box p={2}>
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Pending Tasks" />
          <Tab label="Completed Tasks" />
        </Tabs>

        {/* Tab Content */}
        <Box p={2}>
          {tabValue === 0 && <PendingTasks />}
          {tabValue === 1 && <CompletedTasks />}
        </Box>

      </Paper>
    </Box>
  );
};

export default AccountTasksList;