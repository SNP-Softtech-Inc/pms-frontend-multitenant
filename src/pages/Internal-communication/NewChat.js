// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Drawer,
//   Typography,
//   Divider,
//   Button,
//   Autocomplete,
//   TextField,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { toast } from "react-toastify";

// import Editor from "../../components/Editor";

// // ✅ AUTH
// import { useAuth } from "../../context/AuthContext";
// import { authAPI } from "../../services/api";
// // ✅ API
// import { internalChatAPI } from "../../services/api";

// const NewChat = ({ open, handleClose, getsChatlist }) => {
//   const { user } = useAuth();
//   const loginUserId = user?._id || user?.id;

//   const [description, setDescription] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [userData, setUserData] = useState([]);
// const [loading, setLoading] = useState(false);
 
//   // ================= FETCH USERS (UPDATED) =================
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });

//         const users = res?.data?.users || [];

//         console.log("Raw users:", users);

//         if (!users.length) {
//           console.warn("No users found");
//         }

//         // ✅ remove logged-in user
//         const filteredUsers = users.filter((u) => u._id !== loginUserId);

//         // ✅ format for Autocomplete
//         const formatted = filteredUsers.map((u) => ({
//           value: u._id,
//           label: u.username,
//         }));

//         setUserData(formatted); // use existing state
//         console.log("Fetched users:", formatted);
//       } catch (err) {
//         console.error("User fetch error:", err?.response || err);
//         toast.error("Failed to load users");
//       }
//     };

//     if (loginUserId) {
//       fetchUsers();
//     }
//   }, [loginUserId]);

//   // ================= OPTIONS =================
//   const options = userData.map((u) => ({
//     value: u._id,
//     label: u.username,
//   }));

//   // ================= CREATE CHAT =================
//   const saveChat = async () => {
//     try {
//       if (!selectedUser) {
//         return toast.error("Please select a user");
//       }

//       if (!description?.trim()) {
//         return toast.error("Message is required");
//       }
//  setLoading(true); // ✅ start loading
//       const payload = {
//         participants: [loginUserId, selectedUser.value],
//         description: [
//           {
//             message: description,
//             fromwhome: user?.role,
//             senderid: loginUserId,
//             isRead: false,
//           },
//         ],
//         active: "true",
//       };

//       await internalChatAPI.sendMessage(payload);

//       toast.success("Chat created");

//       handleClose();
//       clearFields();
//       getsChatlist();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to create chat");
//     }
//     finally {
//     setLoading(false); // ✅ stop loading
//   }
//   };

//   // ================= CLEAR =================
//   const clearFields = () => {
//     setSelectedUser(null);
//     setDescription("");
//   };

//   const handleCloseDrawer = () => {
//     handleClose();
//     clearFields();
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={handleCloseDrawer}
//       PaperProps={{ sx: { width: 600 } }}
//     >
//       {/* HEADER */}
//       <Box display="flex" justifyContent="space-between" p={2}>
//         <Typography variant="h6">New Chat</Typography>
//         <CloseIcon onClick={handleCloseDrawer} sx={{ cursor: "pointer" }} />
//       </Box>

//       <Divider />

//       {/* BODY */}
//       <Box p={3}>
//         <Typography>To</Typography>

//         <Autocomplete
//           options={userData}
//           value={selectedUser}
//           onChange={(e, val) => setSelectedUser(val)}
//           getOptionLabel={(opt) => opt.label || ""}
//           isOptionEqualToValue={(o, v) => o.value === v.value}
//           renderInput={(params) => (
//             <TextField {...params} placeholder="Select user" />
//           )}
//           sx={{ mt: 2, mb: 2 }}
//         />

//         <Editor initialContent={description} onChange={setDescription} />
//       </Box>

//       {/* FOOTER */}
//       <Box p={2} display="flex" gap={2}>
//         <Button
//   variant="contained"
//   onClick={saveChat}
//   disabled={loading}
// >
//   {loading ? "Creating..." : "Create Chat"}
// </Button>

//         <Button variant="outlined" onClick={handleCloseDrawer}>
//           Cancel
//         </Button>
//       </Box>
//     </Drawer>
//   );
// };

// export default NewChat;



import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { toast } from "react-toastify";

import Editor from "../../components/TextEditor";

// ✅ AUTH & API
import { useAuth } from "../../context/AuthContext";
import { authAPI, internalChatAPI } from "../../services/api";

// ✅ SHADCN UI COMPONENTS (Keeping only the Combobox elements)
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { cn } from "../../lib/utils";

const NewChat = ({ open, handleClose, getsChatlist }) => {
  const { user } = useAuth();
  const loginUserId = user?._id || user?.id;

  const [description, setDescription] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });

        const users = res?.data?.users || [];
        console.log("Raw users:", users);

        if (!users.length) {
          console.warn("No users found");
        }

        // ✅ remove logged-in user
        const filteredUsers = users.filter((u) => u._id !== loginUserId);

        // ✅ format for Dropdown selection
        const formatted = filteredUsers.map((u) => ({
          value: u._id,
          label: u.username,
        }));

        setUserData(formatted);
        console.log("Fetched users:", formatted);
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
        toast.error("Failed to load users");
      }
    };

    if (loginUserId) {
      fetchUsers();
    }
  }, [loginUserId]);

  // ================= CREATE CHAT =================
  const saveChat = async () => {
    try {
      if (!selectedUser) {
        return toast.error("Please select a user");
      }

      if (!description?.trim()) {
        return toast.error("Message is required");
      }

      setLoading(true);
      const payload = {
        participants: [loginUserId, selectedUser.value],
        description: [
          {
            message: description,
            fromwhome: user?.role,
            senderid: loginUserId,
            isRead: false,
          },
        ],
        active: "true",
      };

      await internalChatAPI.sendMessage(payload);

      toast.success("Chat created");

      handleClose();
      clearFields();
      getsChatlist();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create chat");
    } finally {
      setLoading(false);
    }
  };

  // ================= CLEAR =================
  const clearFields = () => {
    setSelectedUser(null);
    setDescription("");
  };

  const handleCloseDrawer = () => {
    handleClose();
    clearFields();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* BACKDROP */}
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
            onClick={handleCloseDrawer} 
          />
          
          {/* DRAWER PANEL */}
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            
            {/* HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                New Chat
              </h2>
              <button 
                onClick={handleCloseDrawer} 
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  To
                </label>
                
                <div className="mt-2 mb-4">
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCombobox}
                        className="w-full justify-between font-normal text-muted-foreground"
                      >
                        {selectedUser ? selectedUser.label : "Select user..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[610px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search user..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {userData.map((userOpt) => (
                              <CommandItem
                                key={userOpt.value}
                                value={userOpt.label}
                                onSelect={() => {
                                  setSelectedUser(userOpt);
                                  setOpenCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedUser?.value === userOpt.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {userOpt.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="min-h-[200px]">
                <Editor initialContent={description} onChange={setDescription} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={handleCloseDrawer}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={saveChat}
                disabled={loading}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center justify-center min-w-[110px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Chat"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default NewChat;
