// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { templateAPI } from "../services/api";

// const TagsMultiSelectDropDown = ({
//   value = [],
//   onChange,
//   options: propOptions,
//   placeholder = "Select tags",
// }) => {
//    const [internalOptions, setInternalOptions] = useState([]);
//   const options = propOptions || internalOptions;
//   console.log("value", value);
// console.log("options", options);
// console.log(
//   "Invalid selected",
//   value.filter(v => !v?.value || !v?.label)
// );

//   useEffect(() => {
//     if (!propOptions) {
//       const fetchTags = async () => {
//         try {
//           const res = await templateAPI.getAllTags();

//           const tags = res?.data?.tags || [];

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

//   const filteredOptions = options.filter(
//     (option) => !value.some((v) => v.value === option.value)
//   );

//   return (
//     <Select
//       isMulti
//       options={filteredOptions}
//       value={value}
//       onChange={(selected) => onChange?.(selected || [])}
//       placeholder={placeholder}
//       closeMenuOnSelect={false}
//       hideSelectedOptions
//       isClearable
//       getOptionLabel={(option) => option.label}
//       getOptionValue={(option) => option.value}
//       formatOptionLabel={(option) => (
//         <div className="flex items-center gap-3">
//           <span
//             className="rounded-md px-2 py-1 text-xs font-medium text-white"
//             style={{
//               backgroundColor: option.colour,
//             }}
//           >
//             {option.label}
//           </span>
//         </div>
//       )}
//       styles={{
//         control: (base, state) => ({
//           ...base,
//           minHeight: 40,
//           borderRadius: 12,
//           backgroundColor: "hsl(var(--background))",
//           borderColor: state.isFocused
//             ? "hsl(var(--ring))"
//             : "hsl(var(--border))",
//           boxShadow: state.isFocused
//             ? "0 0 0 2px hsl(var(--ring) / .2)"
//             : "none",
//           "&:hover": {
//             borderColor: "hsl(var(--ring))",
//           },
//         }),

//         valueContainer: (base) => ({
//           ...base,
//           padding: "2px 8px",
//         }),

//         input: (base) => ({
//           ...base,
//           color: "hsl(var(--foreground))",
//         }),

//         placeholder: (base) => ({
//           ...base,
//           color: "hsl(var(--muted-foreground))",
//         }),

//         menu: (base) => ({
//           ...base,
//           backgroundColor: "hsl(var(--popover))",
//           border: "1px solid hsl(var(--border))",
//           borderRadius: 12,
//           overflow: "hidden",
//           zIndex: 9999,
//         }),

//         menuList: (base) => ({
//           ...base,
//           padding: 6,
//           backgroundColor: "hsl(var(--popover))",
//         }),

//         option: (base, state) => ({
//           ...base,
//           backgroundColor: state.isFocused
//             ? "hsl(var(--accent))"
//             : "transparent",
//           color: "hsl(var(--foreground))",
//           cursor: "pointer",
//           borderRadius: 8,
//           marginBottom: 2,
//         }),

//         multiValue: (base, { data }) => ({
//           ...base,
//           backgroundColor: data.colour,
//           borderRadius: 8,
//         }),

//         multiValueLabel: (base) => ({
//           ...base,
//           color: "#fff",
//           fontWeight: 500,
//         }),

//         multiValueRemove: (base) => ({
//           ...base,
//           color: "#fff",
//           cursor: "pointer",
//           ":hover": {
//             backgroundColor: "rgba(0,0,0,.2)",
//             color: "#fff",
//           },
//         }),

//         clearIndicator: (base) => ({
//           ...base,
//           color: "hsl(var(--muted-foreground))",
//           ":hover": {
//             color: "hsl(var(--foreground))",
//           },
//         }),

//         dropdownIndicator: (base) => ({
//           ...base,
//           color: "hsl(var(--muted-foreground))",
//           ":hover": {
//             color: "hsl(var(--foreground))",
//           },
//         }),

//         indicatorSeparator: (base) => ({
//           ...base,
//           backgroundColor: "hsl(var(--border))",
//         }),
//       }}
//     />
//   );
// };

// export default TagsMultiSelectDropDown;

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
  const [loading, setLoading] = useState(false);
  // const options = propOptions || internalOptions;
  // console.log("value", value);
  // console.log("options", options);
  // console.log(
  //   "Invalid selected",
  //   value.filter((v) => !v?.value || !v?.label),
  // );
  const options = propOptions || internalOptions;

const selectedValues = Array.isArray(value) ? value : [];

const normalizedValue = selectedValues
  .map((item) => {
    // Already a complete option object
    if (typeof item === "object" && item?.value) {
      return item;
    }

    // ID → find corresponding option
    if (typeof item === "string") {
      return options.find(
        (option) => String(option.value) === String(item)
      );
    }

    return null;
  })
  .filter(Boolean);
  // ================= FETCH TAGS =================
  useEffect(() => {
    if (propOptions) return;
    const fetchTags = async () => {
      try {
        setLoading(true);
        const res = await templateAPI.getAllTags();
        const tags = res?.data?.tags || [];
        const formattedTags = tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setInternalOptions(formattedTags);
      } catch (error) {
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [propOptions]);
  // ================= REMOVE SELECTED TAGS =================
  const filteredOptions = options.filter(
    (option) => !value.some((selected) => selected?.value === option.value),
  );
  return (
    <Select
      isMulti
      options={filteredOptions}
      value={normalizedValue}
      onChange={(selected) => onChange?.(selected || [])}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      hideSelectedOptions
      isClearable
      isLoading={loading}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      formatOptionLabel={(option) => (
        <span
          className="rounded-md px-2 py-1 text-xs font-medium text-white"
          style={{ backgroundColor: option.colour || "#64748b" }}
        >
          {" "}
          {option.label}{" "}
        </span>
      )}
      styles={{
        // ================= CONTROL =================
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
          "&:hover": { borderColor: "hsl(var(--ring))" },
        }),
        // ================= VALUE CONTAINER =================
        valueContainer: (base) => ({ ...base, padding: "2px 8px" }),
        // ================= INPUT =================
        input: (base) => ({ ...base, color: "hsl(var(--foreground))" }),
        // ================= PLACEHOLDER =================
        placeholder: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
        }),
        // ================= MENU =================
        menu: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--popover))",
          border: "1px solid hsl(var(--border))",
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 9999,
        }),
        // ================= MENU LIST =================
        menuList: (base) => ({
          ...base,
          padding: 6,
          backgroundColor: "hsl(var(--popover))",
        }),
        // ================= OPTIONS =================
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
        // ================= SELECTED TAG =================
        multiValue: (base, { data }) => ({
          ...base,
          backgroundColor: data.colour || "#64748b",
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
          borderRadius: "0 8px 8px 0",
          ":hover": { backgroundColor: "rgba(0, 0, 0, .2)", color: "#fff" },
        }), // ================= CLEAR =================
        clearIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": { color: "hsl(var(--foreground))" },
        }),
        // ================= DROPDOWN =================
        dropdownIndicator: (base) => ({
          ...base,
          color: "hsl(var(--muted-foreground))",
          ":hover": { color: "hsl(var(--foreground))" },
        }),
        // ================= SEPARATOR =================
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--border))",
        }),
      }}
    />
  );
};
export default TagsMultiSelectDropDown;
