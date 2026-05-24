// import React, { useState, useEffect } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControlLabel,
//   Switch,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { RxCross2 } from "react-icons/rx";

// const EditItemDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   setSelectedRowData,
//   onSave,
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [totalAmount, setTotalAmount] = useState("");

//   useEffect(() => {
//     const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
//     const qty = selectedRowData?.qty || 0;
//     const calculatedAmount = rate * qty;
//     setTotalAmount(`$${calculatedAmount.toFixed(2)}`);
//   }, [selectedRowData?.rate, selectedRowData?.qty]);

//   const handleServiceSwitch = (checked) => {
//     setSelectedRowData({
//       ...selectedRowData,
//       tax: checked,
//     });
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: {
//           borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//           width: isSmallScreen ? "100%" : "650px",
//           zIndex: 1000,
//         },
//       }}
//     >
//       <Box
//         role="presentation"
//         sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
//       >
//         <Box>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               p: 2,
//               borderBottom: "1px solid grey",
//             }}
//           >
//             <Typography variant="h6">Edit Item</Typography>
//             <RxCross2
//               onClick={onClose}
//               style={{ cursor: "pointer" }}
//             />
//           </Box>
//           <Box p={2}>
//             <Typography variant="subtitle1" fontWeight="bold">
//               Product or service
//             </Typography>
//             <TextField
//               size="small"
//               margin="normal"
//               value={selectedRowData?.productName || ""}
//               fullWidth
//               onChange={(e) =>
//                 setSelectedRowData({
//                   ...selectedRowData,
//                   productName: e.target.value,
//                 })
//               }
//             />

//             <Box sx={{ mt: 2 }}>
//               <Typography>Description</Typography>
//               <TextField
//                 size="small"
//                 margin="normal"
//                 value={selectedRowData?.description || ""}
//                 fullWidth
//                 multiline
//                 rows={3}
//                 onChange={(e) =>
//                   setSelectedRowData({
//                     ...selectedRowData,
//                     description: e.target.value,
//                   })
//                 }
//               />
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "10px",
//                 mt: 2,
//               }}
//             >
//               <Box flex={1}>
//                 <Typography>Rate</Typography>
//                 <TextField
//                   size="small"
//                   margin="normal"
//                   value={selectedRowData?.rate || ""}
//                   fullWidth
//                   onChange={(e) =>
//                     setSelectedRowData({
//                       ...selectedRowData,
//                       rate: e.target.value,
//                     })
//                   }
//                 />
//               </Box>
//               <Box flex={1}>
//                 <Typography>QTY</Typography>
//                 <TextField
//                   size="small"
//                   margin="normal"
//                   value={selectedRowData?.qty || ""}
//                   fullWidth
//                   onChange={(e) =>
//                     setSelectedRowData({
//                       ...selectedRowData,
//                       qty: e.target.value,
//                     })
//                   }
//                 />
//               </Box>
//               <Box flex={1}>
//                 <Typography>Amount</Typography>
//                 <TextField
//                   size="small"
//                   margin="normal"
//                   fullWidth
//                   disabled
//                   value={totalAmount}
//                 />
//               </Box>
//             </Box>

//             <Box mt={2}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={selectedRowData?.tax || false}
//                     onChange={(event) => handleServiceSwitch(event.target.checked)}
//                     color="primary"
//                   />
//                 }
//                 label={"Tax"}
//               />
//             </Box>

//             <Box
//               sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}
//             >
//               <Button
//                 variant="contained"
//                 onClick={onSave}
                
//               >
//                 Save
//               </Button>
//               <Button
//                 variant="outlined"
//                 onClick={onClose}
                
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default EditItemDrawer;

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";

const EditItemDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  onSave,
}) => {
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    const calculatedAmount = rate * qty;
    setTotalAmount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

  const handleServiceSwitch = (checked) => {
    setSelectedRowData({
      ...selectedRowData,
      tax: checked,
    });
  };

  if (!open) return null;

  return (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Drawer */}
    <div
      className="
        absolute right-0 top-0
        h-full w-full sm:w-[650px]
        bg-background
        text-foreground
        border-l border-border
        shadow-xl
        flex flex-col
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between
          px-5 py-4
          border-b border-border
          bg-background/95 backdrop-blur
          shrink-0
        "
      >
        <h2 className="text-base font-semibold text-foreground">
          Edit Item
        </h2>

        <button
          onClick={onClose}
          className="
            p-1 rounded-md
            text-muted-foreground
            hover:text-foreground
            hover:bg-accent
            transition-colors
          "
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-muted/30">
        <div className="space-y-4">
          
          {/* Product or Service */}
          <div>
            <Label
              htmlFor="productName"
              className="text-sm font-semibold text-foreground mb-2 block"
            >
              Product or service
            </Label>

            <Input
              id="productName"
              placeholder="Product or service name"
              value={selectedRowData?.productName || ""}
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  productName: e.target.value,
                })
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Description
            </Label>

            <Textarea
              id="description"
              placeholder="Description"
              rows={3}
              value={selectedRowData?.description || ""}
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Rate / Qty / Amount */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Rate */}
            <div>
              <Label
                htmlFor="rate"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Rate
              </Label>

              <Input
                id="rate"
                placeholder="Rate"
                value={selectedRowData?.rate || ""}
                onChange={(e) =>
                  setSelectedRowData({
                    ...selectedRowData,
                    rate: e.target.value,
                  })
                }
              />
            </div>

            {/* Qty */}
            <div>
              <Label
                htmlFor="qty"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                QTY
              </Label>

              <Input
                id="qty"
                type="number"
                placeholder="Quantity"
                value={selectedRowData?.qty || ""}
                onChange={(e) =>
                  setSelectedRowData({
                    ...selectedRowData,
                    qty: e.target.value,
                  })
                }
              />
            </div>

            {/* Amount */}
            <div>
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Amount
              </Label>

              <Input
                id="amount"
                disabled
                value={totalAmount}
                className="bg-muted text-foreground border-border"
              />
            </div>
          </div>

          {/* Tax Switch */}
          <div
            className="
              flex items-center justify-between
              p-3
              border border-border
              rounded-lg
              bg-background
            "
          >
            <Label
              htmlFor="tax"
              className="text-foreground cursor-pointer"
            >
              Tax
            </Label>

            <Switch
              id="tax"
              checked={selectedRowData?.tax || false}
              onCheckedChange={handleServiceSwitch}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          flex items-center justify-end gap-3
          px-5 py-4
          border-t border-border
          bg-background
          shrink-0
        "
      >
        <button
          onClick={onClose}
          className="
            h-9 px-4
            text-sm font-medium
            border border-border
            rounded-lg
            text-foreground
            hover:bg-accent
            transition-colors
          "
        >
          Cancel
        </button>

        <button
          onClick={onSave}
          className="
            h-9 px-4
            text-sm font-medium
            bg-primary
            text-primary-foreground
            rounded-lg
            hover:bg-primary/90
            transition-colors
          "
        >
          Save
        </button>
      </div>
    </div>
  </div>
);
  // return (
  //   <div className="fixed inset-0 z-50 overflow-hidden">
  //     <div 
  //       className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
  //       onClick={onClose} 
  //     />
  //     <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
  //       <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
  //         <h2 className="text-base font-semibold text-foreground">
  //           Edit Item
  //         </h2>
  //         <button 
  //           onClick={onClose} 
  //           className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       </div>

  //       <div className="flex-1 overflow-y-auto p-4">
  //         <div className="space-y-4">
  //           {/* Product or Service */}
  //           <div>
  //             <Label htmlFor="productName" className="text-foreground mb-2 block font-semibold">
  //               Product or service
  //             </Label>
  //             <Input
  //               id="productName"
  //               placeholder="Product or service name"
  //               value={selectedRowData?.productName || ""}
  //               onChange={(e) =>
  //                 setSelectedRowData({
  //                   ...selectedRowData,
  //                   productName: e.target.value,
  //                 })
  //               }
  //             />
  //           </div>

  //           {/* Description */}
  //           <div>
  //             <Label htmlFor="description" className="text-foreground mb-2 block">
  //               Description
  //             </Label>
  //             <Textarea
  //               id="description"
  //               placeholder="Description"
  //               rows={3}
  //               value={selectedRowData?.description || ""}
  //               onChange={(e) =>
  //                 setSelectedRowData({
  //                   ...selectedRowData,
  //                   description: e.target.value,
  //                 })
  //               }
  //             />
  //           </div>

  //           {/* Rate, QTY, Amount */}
  //           <div className="grid grid-cols-3 gap-3">
  //             <div>
  //               <Label htmlFor="rate" className="text-foreground mb-2 block">
  //                 Rate
  //               </Label>
  //               <Input
  //                 id="rate"
  //                 placeholder="Rate"
  //                 value={selectedRowData?.rate || ""}
  //                 onChange={(e) =>
  //                   setSelectedRowData({
  //                     ...selectedRowData,
  //                     rate: e.target.value,
  //                   })
  //                 }
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="qty" className="text-foreground mb-2 block">
  //                 QTY
  //               </Label>
  //               <Input
  //                 id="qty"
  //                 type="number"
  //                 placeholder="Quantity"
  //                 value={selectedRowData?.qty || ""}
  //                 onChange={(e) =>
  //                   setSelectedRowData({
  //                     ...selectedRowData,
  //                     qty: e.target.value,
  //                   })
  //                 }
  //               />
  //             </div>
  //             <div>
  //               <Label htmlFor="amount" className="text-foreground mb-2 block">
  //                 Amount
  //               </Label>
  //               <Input
  //                 id="amount"
  //                 disabled
  //                 value={totalAmount}
  //                 className="bg-muted"
  //               />
  //             </div>
  //           </div>

  //           {/* Tax Switch */}
  //           <div className="flex items-center justify-between p-3 border border-border rounded-lg">
  //             <Label htmlFor="tax" className="text-foreground cursor-pointer">
  //               Tax
  //             </Label>
  //             <Switch
  //               id="tax"
  //               checked={selectedRowData?.tax || false}
  //               onCheckedChange={handleServiceSwitch}
  //             />
  //           </div>
  //         </div>
  //       </div>

  //       <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
  //         <button
  //           onClick={onClose}
  //           className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={onSave}
  //           className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
  //         >
  //           Save
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default EditItemDrawer;