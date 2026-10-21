


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