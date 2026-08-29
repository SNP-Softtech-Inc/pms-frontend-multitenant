


import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";


import { accountsAPI ,authAPI} from "../services/api";
import { useAuth } from "../context/AuthContext";


import Select from "react-select";
const MultiSelectDropdown = ({
  value = [],
  onChange,
  options: propOptions,
  placeholder = "Select from list",
  width = "100%",
    selectedIds = [],

}) => {
  // console.log("MultiSelectDropdown value:", value);
  const { user } = useAuth();
  console.log("MultiSelectDropdown user:", user);
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);
  // Fetch user permissions
 // ================= FETCH PERMISSIONS =================
  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        setPermissionsLoading(true);

        if (user?.role === "team_member") {
          console.log("Fetching permissions for:", user.id);

          const res = await authAPI.getSingleUser(user.id);

          console.log("getSingleUser response:", res.data);

          const userPermissions = res?.data?.user?.permissions;

          console.log("User permissions:", userPermissions);

          setPermissions(userPermissions || {});
        } else {
          // Admin / other roles
          setPermissions({
            manageAccounts: true,
            manageTags: true,
            manageOrganizers: true,
            managePipelines: true,
            assignTeamMates: true,
            viewallAccounts: true,
          });
        }
      } catch (error) {
        console.error("Error fetching user permissions:", error);
        setPermissions({});
      } finally {
        setPermissionsLoading(false);
      }
    };

    if (user) {
      fetchUserPermissions();
    }
  }, [user]);
  const options = propOptions || internalOptions;

  // ================= LOGIC (UNCHANGED) =================
//   useEffect(() => {
//     if (!propOptions && !initialized && user) {
//       const fetchAccounts = async () => {
//         try {
//           setLoading(true);
//           let res;

//           if (user?.role === "team_member"  &&
//       !permissions?.viewallAccounts) {
//             res = await accountsAPI.getAccountsByTeamMember(true);
//           } else {
//             res = await accountsAPI.getAccountsList(true);
//           }

//           const list = res.data.accountlist || [];
//           const formatted = list.map((acc) => ({
//             value: acc._id,
//             label: acc.accountName,
//           }));

//           setInternalOptions(formatted);

//           // if (value.length === 0) {
//           //   const accountIdFromCookie = Cookies.get("accountId");
//           //   if (accountIdFromCookie) {
//           //     const matched = formatted.find(
//           //       (acc) => acc.value === accountIdFromCookie
//           //     );
//           //     if (matched && onChange) {
//           //       onChange([matched]);
//           //     }
//           //   }
//           // }
//           if (selectedIds.length > 0) {
//   const matchedAccounts = formatted.filter((account) =>
//     selectedIds.includes(account.value)
//   );

//   if (matchedAccounts.length > 0) {
//     onChange?.(matchedAccounts);
//   }
// } else if (value.length === 0) {
//   const accountIdFromCookie = Cookies.get("accountId");

//   if (accountIdFromCookie) {
//     const matched = formatted.find(
//       (acc) => acc.value === accountIdFromCookie
//     );

//     if (matched) {
//       onChange?.([matched]);
//     }
//   }
// }
//           setInitialized(true);
//         } catch (error) {
//           console.error("Error fetching accounts:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchAccounts();
//     }
//   }, [propOptions, initialized, onChange, value, user,selectedIds]);
  // ================= FETCH ACCOUNTS =================
  useEffect(() => {
    // Don't fetch until permissions are available
    if (!user || propOptions || initialized || permissionsLoading) {
      return;
    }

    const fetchAccounts = async () => {
      try {
        setLoading(true);

        let res;

        console.log("Role:", user.role);
        console.log("Permissions:", permissions);
        console.log("viewallAccounts:", permissions?.viewallAccounts);

        if (
          user.role === "team_member" &&
          permissions?.viewallAccounts !== true
        ) {
          console.log("Fetching TEAM MEMBER accounts");

          res = await accountsAPI.getAccountsByTeamMember(true);
        } else {
          console.log("Fetching ALL accounts");

          res = await accountsAPI.getAccountsList(true);
        }

        const list = res.data.accountlist || [];

        const formatted = list.map((acc) => ({
          value: acc._id,
          label: acc.accountName,
        }));

        setInternalOptions(formatted);

        // ================= SELECTED IDS =================
        if (selectedIds.length > 0) {
          const matchedAccounts = formatted.filter((account) =>
            selectedIds.includes(account.value)
          );

          if (matchedAccounts.length > 0) {
            onChange?.(matchedAccounts);
          }
        } else if (value.length === 0) {
          const accountIdFromCookie = Cookies.get("accountId");

          if (accountIdFromCookie) {
            const matched = formatted.find(
              (acc) => acc.value === accountIdFromCookie
            );

            if (matched) {
              onChange?.([matched]);
            }
          }
        }

        setInitialized(true);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [
    user,
    permissions,
    permissionsLoading,
    propOptions,
    initialized,
    selectedIds,
    onChange,
    value,
  ]);
  // ================= HANDLERS (UNCHANGED) =================
  const handleSelect = (selectedValue) => {
    const isSelected = value.some((item) => item.value === selectedValue);
    const newValue = isSelected
      ? value.filter((item) => item.value !== selectedValue)
      : [...value, options.find((opt) => opt.value === selectedValue)];

    onChange?.(newValue);
  };

  const handleUnselect = (e, itemValue) => {
    e.stopPropagation(); // Prevent dropdown from opening/closing
    const newValue = value.filter((item) => item.value !== itemValue);
    onChange?.(newValue);
  };
const filteredOptions = options.filter(
  (option) => !value.some((v) => v.value === option.value)
);
  const clearSelection = () => onChange?.([]);

return (
  <div style={{ width }} className="mt-2">
    <Select
      isMulti
      isLoading={loading}
      options={filteredOptions}
      value={value}
      onChange={(selected) => onChange?.(selected || [])}
      placeholder={placeholder}
      closeMenuOnSelect={false}
      hideSelectedOptions
      isClearable
      noOptionsMessage={() => "No results found"}
      loadingMessage={() => "Loading..."}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 40,
          borderRadius: 12,
          backgroundColor: "hsl(var(--background))",
          borderColor: state.isFocused
            ? "hsl(var(--ring))"
            : "hsl(var(--border))",
          color: "hsl(var(--foreground))",
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

        multiValue: (base) => ({
          ...base,
          backgroundColor: "hsl(var(--primary) / .12)",
          borderRadius: 8,
        }),

        multiValueLabel: (base) => ({
          ...base,
          color: "hsl(var(--primary))",
          fontWeight: 500,
        }),

        multiValueRemove: (base) => ({
          ...base,
          color: "hsl(var(--primary))",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
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
  </div>
);
};

export default MultiSelectDropdown;