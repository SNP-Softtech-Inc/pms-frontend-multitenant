// import React, { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   TextField,
//   Menu,
//   Chip,
//   Typography,
//   IconButton,
// } from "@mui/material";
// import { FaCaretUp, FaCaretDown, FaTimes } from "react-icons/fa";

// // ✅ IMPORT YOUR API
// import { templateAPI } from "../services/api"; // adjust path if needed

// const TagsMultiSelectDropDown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select tags",
// }) => {
//   const containerRef = useRef(null);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [internalOptions, setInternalOptions] = useState([]);

//   // Use prop options if passed, otherwise internal
//   const options = propOptions || internalOptions;

//   // ✅ FETCH TAGS USING templateAPI
//   useEffect(() => {
//     if (!propOptions) {
//       const fetchTags = async () => {
//         try {
//           const res = await templateAPI.getAllTags();

//           // ✅ API RESPONSE FORMAT
//           const tags = res?.data?.tags || [];

//           setInternalOptions(
//             tags.map((tag) => ({
//               value: tag._id,
//               label: tag.tagName,
//               colour: tag.tagColour,
//             }))
//           );
//         } catch (error) {
//           console.error("Error fetching tags:", error);
//         }
//       };

//       fetchTags();
//     }
//   }, [propOptions]);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//     if (containerRef.current) {
//       setMenuWidth(containerRef.current.offsetWidth);
//     }
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleSelect = (selectedValue) => {
//     const newValue = value.some((item) => item.value === selectedValue)
//       ? value.filter((item) => item.value !== selectedValue)
//       : [...value, options.find((option) => option.value === selectedValue)];

//     onChange && onChange(newValue);
//   };

//   const handleSearchChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   const clearSelection = () => {
//     onChange && onChange([]);
//   };

//   // ✅ FILTER (search + remove selected)
//   const filteredOptions = options
//     .filter((option) =>
//       option.label.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//     .filter(
//       (option) => !value.some((selected) => selected.value === option.value)
//     );

//   return (
//     <Box>
//       <Box
//         ref={containerRef}
//         sx={{
//            display: "flex",
//           justifyContent: "space-between",
//           border: "1px solid #ccc",
//           p: 1,
//           cursor: "pointer",
//           bgcolor: "#fff",
//           minHeight: "40px",
//           flexWrap: "wrap",
//           borderRadius: "6px"
//         }}
//         onClick={handleClick}
//       >
//         <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//           {value.length > 0 ? (
//             value.map((item) => {
//               const selectedOption = options.find(
//                 (option) => option.value === item.value
//               );

//               return (
//                 <Chip
//                   key={item.value}
//                   label={item.label}
//                   onDelete={() => handleSelect(item.value)}
//                   size="small"
//                   sx={{
//                     backgroundColor: selectedOption?.colour,
//                     color: "#fff",
//                     fontWeight: 550,
//                     fontSize: "10px",
//                     borderRadius: "16px",
//                     height: "20px",
//                   }}
//                 />
//               );
//             })
//           ) : (
//             <Typography variant="body2" color="textSecondary">
//               {placeholder}
//             </Typography>
//           )}
//         </Box>

//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {value.length > 0 && (
//             <IconButton onClick={clearSelection} size="small">
//               <FaTimes />
//             </IconButton>
//           )}
//           <IconButton size="small">
//             {anchorEl ? <FaCaretUp /> : <FaCaretDown />}
//           </IconButton>
//         </Box>
//       </Box>

//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//         PaperProps={{
//           style: {
//             width: menuWidth || "auto",
//             maxHeight: "250px",
//           },
//         }}
//       >
//         <Box sx={{ p: 1 }}>
//           <TextField
//             fullWidth
//             size="small"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={handleSearchChange}
//             autoFocus
//           />
//         </Box>

//         {filteredOptions.length > 0 ? (
//           filteredOptions.map((option) => (
//             <Box
//               key={option.value}
//               sx={{
//                 color: "#fff",
//                 fontSize: "10px",
//                 borderRadius: "10px",
//                 margin: "5px 10px",
//                 display: "flex",
//                 width: "fit-content",
//                 backgroundColor: option.colour,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "4px 8px",
//                 cursor: "pointer",
//                 whiteSpace: "nowrap",
//               }}
//               onClick={() => handleSelect(option.value)}
//             >
//               <Typography sx={{ fontSize: "inherit" }}>
//                 {option.label}
//               </Typography>
//             </Box>
//           ))
//         ) : (
//           <Typography sx={{ p: 2, color: "gray" }}>
//             No results found
//           </Typography>
//         )}
//       </Menu>
//     </Box>
//   );
// };

// export default TagsMultiSelectDropDown;


import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";

import { templateAPI } from "../services/api";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
}) => {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [menuWidth, setMenuWidth] = useState(null);
  const [internalOptions, setInternalOptions] = useState([]);

  const options = propOptions || internalOptions;

  useEffect(() => {
    if (!propOptions) {
      const fetchTags = async () => {
        try {
          const res = await templateAPI.getAllTags();
          const tags = res?.data?.tags || [];

          setInternalOptions(
            tags.map((tag) => ({
              value: tag._id,
              label: tag.tagName,
              colour: tag.tagColour,
            }))
          );
        } catch (err) {
          console.error(err);
        }
      };

      fetchTags();
    }
  }, [propOptions]);

  const toggleSelect = (val) => {
    const exists = value.some((v) => v.value === val);

    const newValue = exists
      ? value.filter((v) => v.value !== val)
      : [...value, options.find((o) => o.value === val)];

    onChange?.(newValue);
  };

  const clearAll = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };

  const filtered = options
    .filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => !value.some((v) => v.value === o.value));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={containerRef}
          className="flex min-h-10 w-full cursor-pointer items-center justify-between rounded-md border  p-2"
          onClick={() => {
            setMenuWidth(containerRef.current?.offsetWidth);
          }}
        >
          <div className="flex flex-wrap gap-1">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge
                  key={item.value}
                  style={{ backgroundColor: item.colour }}
                  className="text-white text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.value);
                  }}
                >
                  {item.label}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {value.length > 0 && (
              <X className="h-4 w-4" onClick={clearAll} />
            )}
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="p-2"
        style={{ width: menuWidth || "auto" }}
      >
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-2"
        />

     <div className="max-h-60 overflow-auto space-y-1">
  {filtered.length > 0 ? (
    filtered.map((option) => (
      <div
        key={option.value}
        onClick={() => toggleSelect(option.value)}
        className="flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100"
      >
        <span
          className="text-xs text-white rounded px-2 py-1"
          style={{ backgroundColor: option.colour }}
        >
          {option.label}
        </span>
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-400">No results found</p>
  )}
</div>
      </PopoverContent>
    </Popover>
  );
};

export default TagsMultiSelectDropDown;