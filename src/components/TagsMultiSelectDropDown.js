


// import React, { useEffect, useRef, useState } from "react";
// import { Check, ChevronDown, ChevronUp, X } from "lucide-react";

// import { Input } from "../components/ui/input";
// import { Badge } from "../components/ui/badge";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../components/ui/popover";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";

// import { templateAPI } from "../services/api";

// const TagsMultiSelectDropDown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select tags",
// }) => {
//   const containerRef = useRef(null);
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [menuWidth, setMenuWidth] = useState(null);
//   const [internalOptions, setInternalOptions] = useState([]);

//   const options = propOptions || internalOptions;

//   useEffect(() => {
//     if (!propOptions) {
//       const fetchTags = async () => {
//         try {
//           const res = await templateAPI.getAllTags();
//           const tags = res?.data?.tags || [];
// console.log("Fetched tags:", tags);
//           setInternalOptions(
//             tags.map((tag) => ({
//               value: tag._id,
//               label: tag.tagName,
//               colour: tag.tagColour,
//             }))
//           );
//         } catch (err) {
//           console.error(err);
//         }
//       };

//       fetchTags();
//     }
//   }, [propOptions]);

//   const toggleSelect = (val) => {
//     const exists = value.some((v) => v.value === val);

//     const newValue = exists
//       ? value.filter((v) => v.value !== val)
//       : [...value, options.find((o) => o.value === val)];

//     onChange?.(newValue);
//   };

//   // const clearAll = (e) => {
//   //   e.stopPropagation();
//   //   onChange?.([]);
//   // };
// const clearAll = () => {
//   onChange?.([]);
// };
//   const filtered = options
//     .filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
//     .filter((o) => !value.some((v) => v.value === o.value));

// return (
//   <DropdownMenu open={open} onOpenChange={setOpen}>
//     <DropdownMenuTrigger asChild>
//       <div
//         ref={containerRef}
//         className="
//           flex min-h-10 w-full cursor-pointer items-center justify-between
//           rounded-xl border border-border bg-background
//           px-3 py-2
//           transition-all duration-200
//           hover:border-primary/40
//           hover:bg-accent/40
//           focus-within:ring-2 focus-within:ring-ring
//         "
//         onClick={() => {
//           setMenuWidth(containerRef.current?.offsetWidth);
//         }}
//       >
//         {/* Selected Values */}
//         <div className="flex flex-wrap gap-1.5">
//           {value.length > 0 ? (
//             value.map((item) => (
//               <Badge
//                 key={item.value}
//                 style={{
//                   backgroundColor: item.colour,
//                 }}
//                 className="
//                   flex items-center gap-1
//                   rounded-md
//                   text-white
//                   border border-white/10
//                   hover:opacity-90
//                   transition-all duration-150
//                   text-xs font-medium
//                   shadow-sm
//                 "
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleSelect(item.value);
//                 }}
//               >
//                 {item.label}
//                 <X className="h-3 w-3 cursor-pointer" />
//               </Badge>
//             ))
//           ) : (
//             <span className="text-sm text-muted-foreground">
//               {placeholder}
//             </span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-muted-foreground">
//           {value.length > 0 && (
//             <button
//               type="button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 clearAll();
//               }}
//               className="
//                 rounded-sm p-0.5
//                 hover:bg-muted
//                 hover:text-foreground
//                 transition-colors
//               "
//             >
//               <X className="h-4 w-4" />
//             </button>
//           )}

//           {open ? (
//             <ChevronUp className="h-4 w-4 transition-transform" />
//           ) : (
//             <ChevronDown className="h-4 w-4 transition-transform" />
//           )}
//         </div>
//       </div>
//     </DropdownMenuTrigger>

//     <DropdownMenuContent
//       align="start"
//       className="
//         p-3
//         border border-border
//         bg-popover
//         text-popover-foreground
//         shadow-xl
//         rounded-xl
//       "
//       style={{ width: menuWidth || "auto" }}
//       onCloseAutoFocus={(e) => e.preventDefault()}
//     >
//       <Input
//         placeholder="Search..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         onClick={(e) => e.stopPropagation()}
//         className="
//           mb-3
//           bg-background
//           border-border
//           text-foreground
//           placeholder:text-muted-foreground
//           focus-visible:ring-ring
//         "
//       />

//       <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
//         {filtered.length > 0 ? (
//           filtered.map((option) => {
//             const isSelected = value.some(
//               (v) => v.value === option.value
//             );

//             return (
//               <div
//                 key={option.value}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   toggleSelect(option.value);
//                 }}
//                 className={`
//                   flex cursor-pointer items-center gap-3
//                   rounded-lg px-3 py-2
//                   transition-all duration-150
//                   ${
//                     isSelected
//                       ? "bg-primary/10 border border-primary/20"
//                       : "hover:bg-accent"
//                   }
//                 `}
//               >
//                 <div
//                   className="
//                     flex items-center justify-center
//                     rounded-md px-2 py-1
//                     text-xs font-medium text-white
//                     shadow-sm
//                   "
//                   style={{
//                     backgroundColor: option.colour,
//                   }}
//                 >
//                   {option.label}
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="py-6 text-center">
//             <p className="text-sm text-muted-foreground">
//               No results found
//             </p>
//           </div>
//         )}
//       </div>
//     </DropdownMenuContent>
//   </DropdownMenu>
// );


// };

// export default TagsMultiSelectDropDown;


// //     return (
// //   <Popover open={open} onOpenChange={setOpen}>
// //     <PopoverTrigger asChild>
// //       <div
// //         ref={containerRef}
// //         className="
// //           flex min-h-10 w-full cursor-pointer items-center justify-between
// //           rounded-xl border border-border bg-background
// //           px-3 py-2
// //           transition-all duration-200
// //           hover:border-primary/40
// //           hover:bg-accent/40
// //           focus-within:ring-2 focus-within:ring-ring
// //         "
// //         onClick={() => {
// //           setMenuWidth(containerRef.current?.offsetWidth);
// //         }}
// //       >
// //         {/* Selected Values */}
// //         <div className="flex flex-wrap gap-1.5">
// //           {value.length > 0 ? (
// //             value.map((item) => (
// //               <Badge
// //                 key={item.value}
// //                 style={{
// //                   backgroundColor: item.colour,
// //                 }}
// //                 className="
// //                   flex items-center gap-1
// //                   rounded-md
// //                   text-white
// //                   border border-white/10
// //                   hover:opacity-90
// //                   transition-all duration-150
// //                   text-xs font-medium
// //                   shadow-sm
// //                 "
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   toggleSelect(item.value);
// //                 }}
// //               >
// //                 {item.label}

// //                 <X className="h-3 w-3 cursor-pointer" />
// //               </Badge>
// //             ))
// //           ) : (
// //             <span className="text-sm text-muted-foreground">
// //               {placeholder}
// //             </span>
// //           )}
// //         </div>

// //         {/* Right Icons */}
// //         <div className="flex items-center gap-2 text-muted-foreground">
// //           {value.length > 0 && (
// //             <button
// //               type="button"
// //               onClick={(e) => {
// //                 e.stopPropagation();
// //                 clearAll();
// //               }}
// //               className="
// //                 rounded-sm p-0.5
// //                 hover:bg-muted
// //                 hover:text-foreground
// //                 transition-colors
// //               "
// //             >
// //               <X className="h-4 w-4" />
// //             </button>
// //           )}

// //           {open ? (
// //             <ChevronUp className="h-4 w-4 transition-transform" />
// //           ) : (
// //             <ChevronDown className="h-4 w-4 transition-transform" />
// //           )}
// //         </div>
// //       </div>
// //     </PopoverTrigger>

// //     <PopoverContent
// //       align="start"
// //       className="
// //         p-3
// //         border border-border
// //         bg-popover
// //         text-popover-foreground
// //         shadow-xl
// //         rounded-xl
// //       "
// //       style={{ width: menuWidth || "auto" }}
// //     >
// //       {/* Search */}
// //       <Input
// //         placeholder="Search..."
// //         value={search}
// //         onChange={(e) => setSearch(e.target.value)}
// //         className="
// //           mb-3
// //           bg-background
// //           border-border
// //           text-foreground
// //           placeholder:text-muted-foreground
// //           focus-visible:ring-ring
// //         "
// //       />

// //       {/* Options */}
// //       <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
// //         {filtered.length > 0 ? (
// //           filtered.map((option) => {
// //             const isSelected = value.some(
// //               (v) => v.value === option.value
// //             );

// //             return (
// //               <div
// //                 key={option.value}
// //                 onClick={() => toggleSelect(option.value)}
// //                 className={`
// //                   flex cursor-pointer items-center gap-3
// //                   rounded-lg px-3 py-2
// //                   transition-all duration-150
// //                   ${
// //                     isSelected
// //                       ? "bg-primary/10 border border-primary/20"
// //                       : "hover:bg-accent"
// //                   }
// //                 `}
// //               >
// //                 <div
// //                   className="
// //                     flex items-center justify-center
// //                     rounded-md px-2 py-1
// //                     text-xs font-medium text-white
// //                     shadow-sm
// //                   "
// //                   style={{
// //                     backgroundColor: option.colour,
// //                   }}
// //                 >
// //                   {option.label}
// //                 </div>
// //               </div>
// //             );
// //           })
// //         ) : (
// //           <div className="py-6 text-center">
// //             <p className="text-sm text-muted-foreground">
// //               No results found
// //             </p>
// //           </div>
// //         )}
// //       </div>
// //     </PopoverContent>
// //   </Popover>
// // );

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { templateAPI } from "../services/api";

const TagsMultiSelectDropDown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select tags",
}) => {
   const [internalOptions, setInternalOptions] = useState([]);
  const options = propOptions || internalOptions;
  console.log("value", value);
console.log("options", options);
console.log(
  "Invalid selected",
  value.filter(v => !v?.value || !v?.label)
);
 



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

  const filteredOptions = options.filter(
    (option) => !value.some((v) => v.value === option.value)
  );

  return (
    <Select
      isMulti
      options={filteredOptions}
      value={value}
      onChange={(selected) => onChange?.(selected || [])}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      hideSelectedOptions
      isClearable
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      formatOptionLabel={(option) => (
        <div className="flex items-center gap-3">
          <span
            className="rounded-md px-2 py-1 text-xs font-medium text-white"
            style={{
              backgroundColor: option.colour,
            }}
          >
            {option.label}
          </span>
        </div>
      )}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 40,
          borderRadius: 12,
          backgroundColor: "hsl(var(--background))",
          borderColor: state.isFocused
            ? "hsl(var(--ring))"
            : "hsl(var(--border))",
          boxShadow: state.isFocused
            ? "0 0 0 2px hsl(var(--ring) / .2)"
            : "none",
          "&:hover": {
            borderColor: "hsl(var(--ring))",
          },
        }),

        valueContainer: (base) => ({
          ...base,
          padding: "2px 8px",
        }),

        input: (base) => ({
          ...base,
          color: "hsl(var(--foreground))",
        }),

        placeholder: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
        }),

        menu: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 9999,
        }),

        menuList: (base) => ({
          ...base,
          padding: 6,
          backgroundColor: "hsl(var(--popover))",
        }),

        option: (base, state) => ({
          ...base,
          backgroundColor: state.isFocused
            ? "hsl(var(--accent))"
            : "transparent",
          color: "hsl(var(--foreground))",
          cursor: "pointer",
          borderRadius: 8,
          marginBottom: 2,
        }),

        multiValue: (base, { data }) => ({
          ...base,
          backgroundColor: data.colour,
          borderRadius: 8,
        }),

        multiValueLabel: (base) => ({
          ...base,
          color: "#fff",
          fontWeight: 500,
        }),

        multiValueRemove: (base) => ({
          ...base,
          color: "#fff",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "rgba(0,0,0,.2)",
            color: "#fff",
          },
        }),

        clearIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": {
            color: "hsl(var(--foreground))",
          },
        }),

        dropdownIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": {
            color: "hsl(var(--foreground))",
          },
        }),

        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--border))",
        }),
      }}
    />
  );
};

export default TagsMultiSelectDropDown;