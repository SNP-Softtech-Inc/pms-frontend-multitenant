// import React, { useState } from "react";
// import { Box, Tabs, Tab, Paper } from "@mui/material";

// // ✅ Import your pages
// import PendingTasks from "./PendingTasks";
// import CompletedTasks from "./CompletedTasks";

// const AccountTasksList = () => {
//   const [tabValue, setTabValue] = useState(0);

//   const handleChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   return (
//     <Box p={2}>
//       <Paper elevation={3} sx={{ borderRadius: 2 }}>
        
//         {/* Tabs */}
//         <Tabs
//           value={tabValue}
//           onChange={handleChange}
//           indicatorColor="primary"
//           textColor="primary"
//           centered
//         >
//           <Tab label="Pending Tasks" />
//           <Tab label="Completed Tasks" />
//         </Tabs>

//         {/* Tab Content */}
//         <Box p={2}>
//           {tabValue === 0 && <PendingTasks />}
//           {tabValue === 1 && <CompletedTasks />}
//         </Box>

//       </Paper>
//     </Box>
//   );
// };

// export default AccountTasksList;


import React, { useState } from "react";

// ✅ shadcn/ui imports
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";

import { Card, CardContent } from "../../components/ui/card";

// ✅ Import your pages
import PendingTasks from "./PendingTasks";
import CompletedTasks from "./CompletedTasks";

const AccountTasksList = () => {
  const [tabValue, setTabValue] = useState("pending");

  return (
    <div className="p-2">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-4">
          <Tabs
            value={tabValue}
            onValueChange={setTabValue}
            className="w-full"
          >
            {/* Tabs Header */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending Tasks
              </TabsTrigger>

              <TabsTrigger value="completed">
                Completed Tasks
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <div className="mt-4">
              <TabsContent value="pending">
                <PendingTasks />
              </TabsContent>

              <TabsContent value="completed">
                <CompletedTasks />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountTasksList;