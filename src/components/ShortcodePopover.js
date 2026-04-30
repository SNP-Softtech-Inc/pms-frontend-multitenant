

// // // ShortcodePopover.jsx (updated selection handling)
// // import React, { useState, useMemo } from "react";
// // import {
// //   Popover,
// //   Box,
// //   List,
// //   ListItem,
// //   ListItemText,
// //   Divider,
// //   Typography,
// //   TextField,
// //   InputAdornment,
// // } from "@mui/material";
// // import SearchIcon from "@mui/icons-material/Search";

// // const ShortcodePopover = ({
// //   open,
// //   anchorEl,
// //   onClose,
// //   shortcuts,
// //   onSelectShortcut,
// //   title = "Add Shortcode",
// //   showSearch = true,
// // }) => {
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const filteredShortcuts = useMemo(() => {
// //     if (!searchTerm.trim()) return shortcuts;
    
// //     return shortcuts.filter(shortcut => 
// //       shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       (shortcut.value && shortcut.value.toLowerCase().includes(searchTerm.toLowerCase()))
// //     );
// //   }, [shortcuts, searchTerm]);

// //   const handleSelectShortcut = (shortcutValue) => {
// //     if (shortcutValue && onSelectShortcut) {
// //       onSelectShortcut(shortcutValue);
// //     }
// //     setSearchTerm("");
// //     onClose();
// //   };

// //   const renderShortcuts = () => {
// //     const items = [];
// //     let currentCategory = null;
// //     let hasVisibleItems = false;

// //     filteredShortcuts.forEach((shortcut, index) => {
// //       if (shortcut.isBold) {
// //         if (hasVisibleItems) {
// //           items.push(
// //             <Divider key={`divider-${index}`} sx={{ my: 1 }} />
// //           );
// //         }
// //         items.push(
// //           <ListItem key={`header-${index}`} sx={{ py: 0.5, bgcolor: '#f8f9fa' }}>
// //             <ListItemText
// //               primary={shortcut.title}
// //               primaryTypographyProps={{
// //                 style: {
// //                   fontWeight: "bold",
// //                   fontSize: "12px",
// //                   color: "#666",
// //                   textTransform: "uppercase",
// //                   letterSpacing: "0.5px",
// //                 },
// //               }}
// //             />
// //           </ListItem>
// //         );
// //         currentCategory = shortcut.title;
// //         hasVisibleItems = false;
// //       } else {
// //         items.push(
// //           <ListItem
// //             key={`item-${index}`}
// //             onClick={() => handleSelectShortcut(shortcut.value)}
// //             sx={{
// //               py: 0.75,
// //               pl: 3,
// //               "&:hover": {
// //                 backgroundColor: "#f5f5f5",
// //                 cursor: "pointer",
// //               },
// //               transition: "background-color 0.2s",
// //             }}
// //           >
// //             <ListItemText
// //               primary={shortcut.title}
// //               secondary={shortcut.value && `[${shortcut.value}]`}
// //               primaryTypographyProps={{
// //                 style: {
// //                   fontWeight: "normal",
// //                   fontSize: "13px",
// //                   color: "#333",
// //                 },
// //               }}
// //               secondaryTypographyProps={{
// //                 style: {
// //                   fontSize: "10px",
// //                   color: "#999",
// //                   fontFamily: "monospace",
// //                 },
// //               }}
// //             />
// //           </ListItem>
// //         );
// //         hasVisibleItems = true;
// //       }
// //     });

// //     if (items.length === 0) {
// //       items.push(
// //         <ListItem key="empty" sx={{ py: 3, justifyContent: "center" }}>
// //           <Typography variant="body2" color="textSecondary">
// //             No shortcuts found
// //           </Typography>
// //         </ListItem>
// //       );
// //     }

// //     return items;
// //   };

// //   return (
// //     <Popover
// //       open={open}
// //       anchorEl={anchorEl}
// //       onClose={onClose}
// //       anchorOrigin={{
// //         vertical: "bottom",
// //         horizontal: "left",
// //       }}
// //       transformOrigin={{
// //         vertical: "top",
// //         horizontal: "left",
// //       }}
// //       PaperProps={{
// //         sx: {
// //           maxHeight: 500,
// //           overflow: "auto",
// //           minWidth: 300,
// //           maxWidth: 360,
// //           borderRadius: 2,
// //           boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
// //         },
// //       }}
// //     >
// //       <Box>
// //         <Box
// //           sx={{
// //             px: 2,
// //             py: 1.5,
// //             borderBottom: "1px solid #e0e0e0",
// //             bgcolor: "#fafafa",
// //           }}
// //         >
// //           <Typography
// //             variant="subtitle2"
// //             sx={{
// //               fontWeight: 600,
// //               color: "#1976d2",
// //               fontSize: "13px",
// //             }}
// //           >
// //             {title}
// //           </Typography>
// //         </Box>

// //         {showSearch && (
// //           <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e0e0e0" }}>
// //             <TextField
// //               size="small"
// //               fullWidth
// //               placeholder="Search shortcuts..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <SearchIcon sx={{ fontSize: 18, color: "#999" }} />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //               sx={{
// //                 "& .MuiOutlinedInput-root": {
// //                   fontSize: "13px",
// //                 },
// //               }}
// //               autoFocus
// //             />
// //           </Box>
// //         )}

// //         <List
// //           className="shortcode-list"
// //           sx={{
// //             width: "100%",
// //             py: 0.5,
// //           }}
// //         >
// //           {renderShortcuts()}
// //         </List>

// //         <Box
// //           sx={{
// //             px: 2,
// //             py: 1,
// //             borderTop: "1px solid #e0e0e0",
// //             bgcolor: "#fafafa",
// //           }}
// //         >
// //           <Typography
// //             variant="caption"
// //             sx={{
// //               color: "#666",
// //               fontSize: "11px",
// //               display: "block",
// //               textAlign: "center",
// //             }}
// //           >
// //             Click on any shortcode to insert at cursor position
// //           </Typography>
// //         </Box>
// //       </Box>
// //     </Popover>
// //   );
// // };

// // export default ShortcodePopover;







// import React, { useState, useMemo, useEffect } from "react";
// import { Search, X } from "lucide-react";

// const ShortcodePopover = ({
//   open,
//   anchorEl,
//   onClose,
//   shortcuts,
//   onSelectShortcut,
//   title = "Add Shortcode",
//   showSearch = true,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   // Reset search when popover closes
//   useEffect(() => {
//     if (!open) {
//       setSearchTerm("");
//     }
//   }, [open]);

//   const filteredShortcuts = useMemo(() => {
//     if (!searchTerm.trim()) return shortcuts;
    
//     return shortcuts.filter(shortcut => 
//       shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (shortcut.value && shortcut.value.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [shortcuts, searchTerm]);

//   const handleSelectShortcut = (shortcutValue) => {
//     if (shortcutValue && onSelectShortcut) {
//       onSelectShortcut(shortcutValue);
//     }
//     setSearchTerm("");
//     onClose();
//   };

//   const renderShortcuts = () => {
//     const items = [];
//     let hasVisibleItems = false;

//     filteredShortcuts.forEach((shortcut, index) => {
//       if (shortcut.isBold) {
//         if (hasVisibleItems) {
//           items.push(
//             <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
//           );
//         }
//         items.push(
//           <div key={`header-${index}`} className="px-3 py-1.5 bg-gray-50">
//             <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//               {shortcut.title}
//             </span>
//           </div>
//         );
//         hasVisibleItems = false;
//       } else {
//         items.push(
//           <button
//             key={`item-${index}`}
//             onClick={() => handleSelectShortcut(shortcut.value)}
//             className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors group focus:outline-none focus:bg-gray-100"
//           >
//             <div className="flex flex-col">
//               <span className="text-sm text-gray-900 font-normal">
//                 {shortcut.title}
//               </span>
//               {shortcut.value && (
//                 <span className="text-xs font-mono text-gray-400 group-hover:text-gray-500">
//                   [{shortcut.value}]
//                 </span>
//               )}
//             </div>
//           </button>
//         );
//         hasVisibleItems = true;
//       }
//     });

//     if (items.length === 0) {
//       items.push(
//         <div key="empty" className="py-8 text-center">
//           <p className="text-sm text-gray-500">No shortcuts found</p>
//         </div>
//       );
//     }

//     return items;
//   };

//   // Get anchor position
//   const getAnchorPosition = () => {
//     if (!anchorEl) return { top: 0, left: 0 };
//     const rect = anchorEl.getBoundingClientRect();
//     return {
//       top: rect.bottom + window.scrollY,
//       left: rect.left + window.scrollX,
//     };
//   };

//   const position = getAnchorPosition();

//   if (!open) return null;

//   return (
//     <div
//       className="fixed z-50"
//       style={{
//         top: position.top + 4,
//         left: position.left,
//       }}
//     >
//       <div className="w-80 max-w-[360px] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
//         {/* Header */}
//         <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
//           <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
//             {title}
//           </h4>
//         </div>

//         {/* Search */}
//         {showSearch && (
//           <div className="px-3 py-2 border-b border-gray-100">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search shortcuts..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//               />
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="absolute right-2 top-1/2 -translate-y-1/2"
//                 >
//                   <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Shortcuts List */}
//         <div className="max-h-[400px] overflow-y-auto">
//           <div className="py-1">
//             {renderShortcuts()}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
//           <p className="text-xs text-gray-500 text-center">
//             Click on any shortcode to insert at cursor position
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShortcodePopover;

import React, { useState, useMemo, useEffect } from "react";
import { Search, X } from "lucide-react";

const ShortcodePopover = ({
  open,
  anchorEl,
  onClose,
  shortcuts,
  onSelectShortcut,
  title = "Add Shortcode",
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Reset search when popover closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Calculate position when popover opens or anchor changes
  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [open, anchorEl]);

  const filteredShortcuts = useMemo(() => {
    if (!searchTerm.trim()) return shortcuts;
    
    return shortcuts.filter(shortcut => 
      shortcut.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shortcut.value && shortcut.value.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [shortcuts, searchTerm]);

  const handleSelectShortcut = (shortcutValue) => {
    if (shortcutValue && onSelectShortcut) {
      onSelectShortcut(shortcutValue);
    }
    setSearchTerm("");
    onClose();
  };

  const renderShortcuts = () => {
    const items = [];
    let hasVisibleItems = false;

    filteredShortcuts.forEach((shortcut, index) => {
      if (shortcut.isBold) {
        if (hasVisibleItems) {
          items.push(
            <div key={`divider-${index}`} className="border-t border-gray-100 my-1" />
          );
        }
        items.push(
          <div key={`header-${index}`} className="px-3 py-1.5 bg-gray-50">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {shortcut.title}
            </span>
          </div>
        );
        hasVisibleItems = false;
      } else {
        items.push(
          <button
            key={`item-${index}`}
            onClick={() => handleSelectShortcut(shortcut.value)}
            className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors group focus:outline-none focus:bg-gray-100"
          >
            <div className="flex flex-col">
              <span className="text-sm text-gray-900 font-normal">
                {shortcut.title}
              </span>
              {shortcut.value && (
                <span className="text-xs font-mono text-gray-400 group-hover:text-gray-500">
                  [{shortcut.value}]
                </span>
              )}
            </div>
          </button>
        );
        hasVisibleItems = true;
      }
    });

    if (items.length === 0) {
      items.push(
        <div key="empty" className="py-8 text-center">
          <p className="text-sm text-gray-500">No shortcuts found</p>
        </div>
      );
    }

    return items;
  };

  if (!open || !anchorEl) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="w-80 max-w-[360px] bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
          <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {title}
          </h4>
        </div>

        {/* Search */}
        {showSearch && (
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Shortcuts List */}
        <div className="max-h-[400px] overflow-y-auto">
          <div className="py-1">
            {renderShortcuts()}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Click on any shortcode to insert at cursor position
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShortcodePopover;