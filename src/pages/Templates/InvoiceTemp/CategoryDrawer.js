// import React, { useState } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   InputLabel,
//   Divider,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
// const CategoryDrawer = ({
//   open,
//   onClose,
//   onCreateCategory,
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
//   const [categoryName, setCategoryName] = useState("");

//   const handleCreate = () => {
//     if (categoryName.trim()) {
//       onCreateCategory(categoryName);
//       setCategoryName("");
//       onClose();
//     }
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
//           maxWidth: "100%",
//         },
//       }}
//     >
//       <Box>
//         <Box
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             padding: "20px",
//           }}
//         >
//           <ArrowBackRoundedIcon
//             onClick={onClose}
//             style={{ cursor: "pointer" }}
//           />
//           <Typography variant="h6">Create Category</Typography>
//           <Box sx={{ width: 24 }} />
//         </Box>
//         <Divider />
//       </Box>

//       <Box p={3}>
//         <InputLabel sx={{ color: "black", mb: 1 }}>
//           Category Name
//         </InputLabel>
//         <TextField
//           fullWidth
//           placeholder="Enter category name"
//           size="small"
//           value={categoryName}
//           onChange={(e) => setCategoryName(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter") {
//               handleCreate();
//             }
//           }}
//           autoFocus
//         />
//       </Box>

//       <Box
//         sx={{
//           pt: 2,
//           display: "flex",
//           alignItems: "center",
//           gap: 2,
//           margin: "8px",
//           ml: 3,
//         }}
//       >
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleCreate}
//           disabled={!categoryName.trim()}
         
//         >
//           Create
//         </Button>
//         <Button
//           variant="outlined"
//           onClick={onClose}
         
//         >
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default CategoryDrawer;

import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";

const CategoryDrawer = ({
  open,
  onClose,
  onCreateCategory,
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleCreate = () => {
    if (categoryName.trim()) {
      onCreateCategory(categoryName);
      setCategoryName("");
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
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
          Create Category
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
          <div>
            <Label
              htmlFor="categoryName"
              className="text-sm font-medium text-foreground mb-2 block"
            >
              Category Name
            </Label>

            <Input
              id="categoryName"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              className="w-full"
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
          onClick={handleCreate}
          disabled={!categoryName.trim()}
          className="
            h-9 px-4
            text-sm font-medium
            bg-primary
            text-primary-foreground
            rounded-lg
            hover:bg-primary/90
            transition-colors
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          Create
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
  //           Create Category
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
  //           <div>
  //             <Label htmlFor="categoryName" className="text-foreground mb-2 block">
  //               Category Name
  //             </Label>
  //             <Input
  //               id="categoryName"
  //               placeholder="Enter category name"
  //               value={categoryName}
  //               onChange={(e) => setCategoryName(e.target.value)}
  //               onKeyPress={handleKeyPress}
  //               autoFocus
  //               className="w-full"
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
  //           onClick={handleCreate}
  //           disabled={!categoryName.trim()}
  //           className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //         >
  //           Create
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default CategoryDrawer;