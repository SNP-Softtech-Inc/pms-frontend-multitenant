import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Loader2, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { accountsAPI, contactsAPI } from "../services/api";
import NewContactDrawer from "../pages/Account-Contact/NewContactDrawer";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
// ---------------- Debounce Hook ----------------
const useDebounce = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const FILTER_TYPES = ["All", "Accounts", "Contacts"];

const SearchComponent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);

  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [isFocused, setIsFocused] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mode, setMode] = useState("create");

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  // ---------------- Outside Click ----------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Search API ----------------
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedQuery) {
        setOptions([]);
        return;
      }

      setLoading(true);

      try {
        const isTeamMember = user?.role === "team_member";

        const accountPromise = isTeamMember
          ? accountsAPI.getAccountsByTeamMemberName({
              active: true,
              search: debouncedQuery,
            })
          : accountsAPI.getAccountNamesByStatus({
              active: true,
              search: debouncedQuery,
            });

        let combined = [];

        if (isEmail(debouncedQuery)) {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
            contactsAPI.getContactsByEmail(debouncedQuery),
          ]);

          const accounts = accountsRes.data.accountlist || [];
          const contacts = contactsRes.data.data || [];

          combined = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel: a.emails?.join(", ") || "No Email",
              type: "Accounts",
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email,
              type: "Contacts",
            })),
          ];
        } else {
          const [accountsRes, contactsRes] = await Promise.all([
            accountPromise,
            contactsAPI.getContactNames({ search: debouncedQuery }),
          ]);

          const accounts = accountsRes.data.accountlist || [];
          const contacts = contactsRes.data.data || [];
          console.log("Accounts:", accounts);
          combined = [
            ...accounts.map((a) => ({
              id: a._id,
              label: a.accountName,
              subLabel: a.emails?.join(", ") || "No Email",
              type: "Accounts",
            })),
            ...contacts.map((c) => ({
              id: c._id,
              label: c.contactName,
              subLabel: c.email || "No Email",
              type: "Contacts",
            })),
          ];
        }

        setOptions(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery]);

  // ---------------- Filter ----------------
  const filteredOptions = useMemo(() => {
    return options.filter((o) => filterType === "All" || o.type === filterType);
  }, [options, filterType]);

  const typeCount = (type) =>
    options.filter((o) => type === "All" || o.type === type).length;

  // ---------------- Click ----------------
  const handleClick = async (option) => {
    console.log("Clicked option:", option);
    if (option.type === "Accounts") {
      navigate(`/clients/accounts/accountsdash/overview/${option.id}`);
      setSearchQuery("");
      return;
    }

    const res = await contactsAPI.getContactById(option.id);
    setSelectedContact(res.data.data);
    setDrawerOpen(true);
    setMode("edit");

    setSearchQuery("");
    setOptions([]);
    setIsFocused(false);
  };

  const showDropdown = isFocused && searchQuery;

  return (
    <>
      <div ref={containerRef} className="relative w-80">
        <div
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-background shadow-sm transition ${
            isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search accounts & contacts..."
            className="flex-1 bg-transparent text-sm outline-none"
          />

          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="absolute top-full mt-2 w-full rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">
            <div className="flex gap-2 p-2 border-b">
              {FILTER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1 rounded-md text-xs ${
                    filterType === type
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {type} ({typeCount(type)})
                </button>
              ))}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-6">
                  No results found
                </p>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleClick(opt)}
                    className="flex w-full items-center gap-3 px-3 py-2 hover:bg-accent"
                  >
                    <div
                      className={`h-8 w-8 flex items-center justify-center rounded-lg text-white ${
                        opt.type === "Accounts" ? "bg-primary" : "bg-green-500"
                      }`}
                    >
                      {opt.type === "Accounts" ? (
                        <Building2 size={16} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {opt.subLabel}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${opt.type === "Accounts" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {opt.type === "Accounts" ? "Account" : "Contact"}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drawer */}
      <NewContactDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedContact={selectedContact}
        mode={mode}
      />
    </>
  );
};

export default SearchComponent;
// return (
//     <>
//       <div ref={containerRef} className="relative w-80">

//         <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-background shadow-sm transition ${
//           isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"
//         }`}>
//           {loading ? (
//             <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//           ) : (
//             <Search className="h-4 w-4 text-muted-foreground" />
//           )}

//           <input
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onFocus={() => setIsFocused(true)}
//             placeholder="Search accounts & contacts..."
//             className="flex-1 bg-transparent text-sm outline-none"
//           />

//           {searchQuery && (
//             <button onClick={() => setSearchQuery("")}>
//               <X className="h-4 w-4 text-muted-foreground" />
//             </button>
//           )}
//         </div>

//         {showDropdown && (
//           <div className="absolute top-full mt-2 w-full rounded-xl border bg-popover shadow-xl z-50 overflow-hidden">

//             <div className="flex gap-2 p-2 border-b">
//               {FILTER_TYPES.map((type) => (
//                 <button
//                   key={type}
//                   onClick={() => setFilterType(type)}
//                   className={`px-3 py-1 rounded-md text-xs ${
//                     filterType === type
//                       ? "bg-primary text-white"
//                       : "text-muted-foreground hover:bg-accent"
//                   }`}
//                 >
//                   {type} ({typeCount(type)})
//                 </button>
//               ))}
//             </div>

//             <div className="max-h-80 overflow-y-auto">
//               {filteredOptions.length === 0 ? (
//                 <p className="text-center text-sm text-muted-foreground py-6">
//                   No results found
//                 </p>
//               ) : (
//                 filteredOptions.map((opt) => (
//                   <button
//                     key={opt.id}
//                     onClick={() => handleClick(opt)}
//                     className="flex w-full items-center gap-3 px-3 py-2 hover:bg-accent"
//                   >
//                     <div className={`h-8 w-8 flex items-center justify-center rounded-lg text-white ${
//                       opt.type === "Accounts" ? "bg-primary" : "bg-green-500"
//                     }`}>
//                       {opt.type === "Accounts" ? (
//                         <Building2 size={16} />
//                       ) : (
//                         <User size={16} />
//                       )}
//                     </div>

//                     <div className="flex-1 text-left">
//                       <p className="text-sm font-medium">{opt.label}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {opt.subLabel}
//                       </p>
//                     </div>

//                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${opt.type === "Accounts" ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"}`}>
//                           {opt.type === "Accounts" ? "Account" : "Contact"}
//                         </span>
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         )}

//       </div>

//       {/* Drawer */}
//       <NewContactDrawer
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         selectedContact={selectedContact}
//         mode={mode}
//       />
//     </>
//   );
