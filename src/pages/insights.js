
// import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
// import Box from '@mui/material/Box';


// export default function RowAndColumnSpacing() {
//   return (
//     <Box sx={{ width: '100%' }}>
//       <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box>
//             <Paper> 1</Paper>
           
//           </Box>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//          <Box>
//           <Paper> 2</Paper>
//           </Box>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//          <Box>
// <Paper> 3</Paper>
//           </Box>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Box>
//          <Paper> 4</Paper>
//           </Box>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Insights = () => {
  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];
  
  // Static demo data
  const jobCount = 25;
  const activeJobCount = 18;
  const inactiveJobCount = 7;
  const invoiceCount = 45;
  
  const invoiceCounts = {
    Paid: 20,
    Pending: 15,
    Overdue: 10,
  };
  
  const invoiceSummary = {
    totalAmount: 5000,
    pendingAmount: 2000,
    paidAmount: 2500,
    overdueAmount: 500,
  };

  // Prepare data for pie chart
  const pieChartData = [
    { name: "Paid", value: invoiceSummary.paidAmount },
    { name: "Pending", value: invoiceSummary.pendingAmount },
    { name: "Overdue", value: invoiceSummary.overdueAmount },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Jobs Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Jobs Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{jobCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{activeJobCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{inactiveJobCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoices Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Invoices Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{invoiceCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{invoiceCounts.Paid}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{invoiceCounts.Pending}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{invoiceCounts.Overdue}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Amounts Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Invoice Amounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${invoiceSummary.totalAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${invoiceSummary.pendingAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${invoiceSummary.paidAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">${invoiceSummary.overdueAmount.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="flex justify-center">
        <ResponsiveContainer width={400} height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Insights;