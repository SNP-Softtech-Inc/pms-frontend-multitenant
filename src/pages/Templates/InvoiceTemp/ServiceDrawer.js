// import React, { useState } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   InputLabel,
//   Switch,
//   FormControlLabel,
//   Autocomplete,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { RxCross2 } from "react-icons/rx";

// const ServiceDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   setSelectedRowData,
//   categoryoptions,
//   onCreateCategory,
//   onSave,
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedRateOption, setSelectedRateOption] = useState(null);

//   const options = [
//     { label: "Item", value: "item" },
//     { label: "Hour", value: "hour" },
//   ];

//   const handleRateTypeChange = (event, newValue) => {
//     setSelectedRateOption(newValue);
//     setSelectedRowData({
//       ...selectedRowData,
//       ratetype: newValue,
//     });
//   };

//   const handleCategoryChange = (event, newValue) => {
//     setSelectedCategory(newValue);
//     setSelectedRowData({
//       ...selectedRowData,
//       category: newValue,
//     });
//   };

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
//             <Typography variant="h6">Create Service</Typography>
//             <RxCross2
//               onClick={onClose}
//               style={{ cursor: "pointer" }}
//             />
//           </Box>
//         </Box>
//         <form style={{ margin: "15px" }}>
//           <Box>
//             <Box>
//               <InputLabel sx={{ color: "black" }}>Service Name</InputLabel>
//               <TextField
//                 fullWidth
//                 name="ServiceName"
//                 placeholder="Service Name"
//                 size="small"
//                 margin="normal"
//                 value={selectedRowData?.productName || ""}
//                 onChange={(e) =>
//                   setSelectedRowData({
//                     ...selectedRowData,
//                     productName: e.target.value,
//                   })
//                 }
//               />
//             </Box>

//             <Box sx={{ mt: 1 }}>
//               <InputLabel sx={{ color: "black" }}>Description</InputLabel>
//               <TextField
//                 fullWidth
//                 name="Description"
//                 placeholder="Description"
//                 size="small"
//                 margin="normal"
//                 multiline
//                 rows={3}
//                 value={selectedRowData?.description || ""}
//                 onChange={(e) =>
//                   setSelectedRowData({
//                     ...selectedRowData,
//                     description: e.target.value,
//                   })
//                 }
//               />
//             </Box>

//             <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
//               <Box width="50%">
//                 <Typography sx={{ color: "black" }}>Rate</Typography>
//                 <TextField
//                   fullWidth
//                   name="Rate"
//                   placeholder="Rate"
//                   size="small"
//                   sx={{ mt: 1 }}
//                   value={selectedRowData?.rate || ""}
//                   onChange={(e) =>
//                     setSelectedRowData({
//                       ...selectedRowData,
//                       rate: e.target.value,
//                     })
//                   }
//                 />
//               </Box>

//               <Box width="50%">
//                 <Typography sx={{ color: "black" }}>Rate Type</Typography>
//                 <Autocomplete
//                   size="small"
//                   fullWidth
//                   sx={{ mt: 1 }}
//                   options={options}
//                   getOptionLabel={(option) => option?.label || ""}
//                   value={selectedRateOption}
//                   onChange={handleRateTypeChange}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       variant="outlined"
//                       placeholder="Select Rate Type"
//                     />
//                   )}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value?.value
//                   }
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

//             <Box>
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
//                 Category
//               </Typography>
//               <InputLabel sx={{ color: "black", mt: 1 }}>
//                 Category Name
//               </InputLabel>
//               <Autocomplete
//                 size="small"
//                 fullWidth
//                 sx={{ mt: 1 }}
//                 options={categoryoptions}
//                 getOptionLabel={(option) => option.label}
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//                 renderInput={(params) => (
//                   <TextField
//                     {...params}
//                     placeholder="Category Name"
//                     variant="outlined"
//                   />
//                 )}
//                 clearOnEscape
//                 isOptionEqualToValue={(option, value) =>
//                   option.value === value?.value
//                 }
//               />
//             </Box>

//             <Box>
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={onCreateCategory}
//                 sx={{
//                   borderRadius: "15px",
//                   mt: 2,
//                 }}
//               >
//                 + Create new category
//               </Button>
//             </Box>

//             <Box
//               sx={{
//                 pt: 5,
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 5,
//                 ml: 1,
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
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
//         </form>
//       </Box>
//     </Drawer>
//   );
// };

// export default ServiceDrawer;

import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const ServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  categoryoptions,
  onCreateCategory,
  onSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRateOption, setSelectedRateOption] = useState(null);

  const rateTypeOptions = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  const handleRateTypeChange = (value) => {
    const selected = rateTypeOptions.find(option => option.value === value);
    setSelectedRateOption(selected);
    setSelectedRowData({
      ...selectedRowData,
      ratetype: selected,
    });
  };

  const handleCategoryChange = (value) => {
    const selected = categoryoptions.find(option => option.value === value);
    setSelectedCategory(selected);
    setSelectedRowData({
      ...selectedRowData,
      category: selected,
    });
  };

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
          Create Service
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
        <form className="space-y-4">

          {/* Service Name */}
          <div>
            <Label
              htmlFor="serviceName"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Service Name
            </Label>

            <Input
              id="serviceName"
              placeholder="Service Name"
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

          {/* Rate + Rate Type */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label
                htmlFor="rate"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Rate
              </Label>

              <Input
                id="rate"
                type="number"
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

            <div>
              <Label
                htmlFor="rateType"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Rate Type
              </Label>

              <Select
                value={selectedRateOption?.value || ""}
                onValueChange={handleRateTypeChange}
              >
                <SelectTrigger className="border-border bg-background text-foreground">
                  <SelectValue placeholder="Select Rate Type" />
                </SelectTrigger>

                <SelectContent className="bg-popover text-popover-foreground">
                  {rateTypeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tax */}
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

          {/* Category */}
          <div className="pt-2">
            <h3 className="text-base font-semibold text-foreground mb-3">
              Category
            </h3>

            <div>
              <Label
                htmlFor="category"
                className="text-sm font-medium text-foreground mb-2 block"
              >
                Category Name
              </Label>

              <Select
                value={selectedCategory?.value || ""}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="border-border bg-background text-foreground">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>

                <SelectContent className="bg-popover text-popover-foreground">
                  {categoryoptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onCreateCategory}
              className="mt-3 border-border hover:bg-accent"
            >
              + Create new category
            </Button>
          </div>
        </form>
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
  //           Create Service
  //         </h2>
  //         <button 
  //           onClick={onClose} 
  //           className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
  //         >
  //           <X className="h-4 w-4" />
  //         </button>
  //       </div>

  //       <div className="flex-1 overflow-y-auto p-4">
  //         <form className="space-y-4">
  //           {/* Service Name */}
  //           <div>
  //             <Label htmlFor="serviceName" className="text-foreground mb-2 block">
  //               Service Name
  //             </Label>
  //             <Input
  //               id="serviceName"
  //               placeholder="Service Name"
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

  //           {/* Rate and Rate Type */}
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <Label htmlFor="rate" className="text-foreground mb-2 block">
  //                 Rate
  //               </Label>
  //               <Input
  //                 id="rate"
  //                 type="number"
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
  //               <Label htmlFor="rateType" className="text-foreground mb-2 block">
  //                 Rate Type
  //               </Label>
  //               <Select
  //                 value={selectedRateOption?.value || ""}
  //                 onValueChange={handleRateTypeChange}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Select Rate Type" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {rateTypeOptions.map((option) => (
  //                     <SelectItem key={option.value} value={option.value}>
  //                       {option.label}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
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

  //           {/* Category Section */}
  //           <div className="pt-2">
  //             <h3 className="text-base font-semibold text-foreground mb-3">
  //               Category
  //             </h3>
  //             <div>
  //               <Label htmlFor="category" className="text-foreground mb-2 block">
  //                 Category Name
  //               </Label>
  //               <Select
  //                 value={selectedCategory?.value || ""}
  //                 onValueChange={handleCategoryChange}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue placeholder="Select Category" />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {categoryoptions.map((option) => (
  //                     <SelectItem key={option.value} value={option.value}>
  //                       {option.label}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //             </div>

  //             <Button
  //               type="button"
  //               variant="outline"
  //               onClick={onCreateCategory}
  //               className="mt-3"
  //             >
  //               + Create new category
  //             </Button>
  //           </div>
  //         </form>
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

export default ServiceDrawer;