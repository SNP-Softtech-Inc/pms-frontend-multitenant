// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Paper,
//   Divider,
//   Chip,
//   Button,
//   Switch,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Grid,
//   Tooltip,
//   Drawer,
// } from "@mui/material";

// import {
//   accountsAPI,
//   contactsAPI,
//   templateAPI,
//   authAPI,
// } from "../../services/api"; // update path
// import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";

// import MenuDropdown from "./MenuDropdown";
// import UploadProfilePicture from "./ProfilePictureUpload";
// import NewContactDrawer from "../Account-Contact/NewContactDrawer";
// import { Autocomplete, TextField } from "@mui/material";
// import { useAuth } from "../../context/AuthContext";

// const AccountDetails = () => {
//   const { accountId } = useParams();
// const {user}=useAuth
//   const [account, setAccount] = useState(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedContact, setSelectedContact] = useState(null);
//   const [newCanLoginValue, setNewCanLoginValue] = useState(false);
//   const [mode, setMode] = useState("edit");
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

//   const [availableContacts, setAvailableContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);

//   const [tagList, setTagList] = useState([]);
//   const [teamMemberList, setTeamMemberList] = useState([]);

//   const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
//   const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);

//   // ================= FETCH ACCOUNT DETAILS =================
//   const fetchAccountDetails = async () => {
//     try {
//       const res = await accountsAPI.getAccountById(accountId);
//       setAccount(res.data);
//     } catch (err) {
//       console.error("Error fetching account details:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAccountDetails();
//   }, [accountId]);

//   // ================= FETCH AVAILABLE CONTACTS =================
//   const fetchAvailableContacts = async () => {
//     try {
//       const res = await contactsAPI.getContacts();
//       const currentContactIds =
//         account?.contacts?.map((c) => c.contact._id) || [];
//       const filteredContacts = res.data.filter(
//         (contact) => !currentContactIds.includes(contact._id),
//       );
//       setAvailableContacts(filteredContacts);
//     } catch (err) {
//       console.error("Error fetching contacts:", err);
//     }
//   };

//   useEffect(() => {
//     if (addContactDrawerOpen && account) fetchAvailableContacts();
//   }, [addContactDrawerOpen, account]);

//   // ================= FETCH TAGS =================
//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const res = await templateAPI.getAllTags();

//         const tags = res?.data?.tags || [];

//         const formattedTags = tags.map((tag) => ({
//           value: tag._id,
//           label: tag.tagName,
//           colour: tag.tagColour,
//         }));

//         setTagList(formattedTags);
//       } catch (err) {
//         console.error("Error fetching tags:", err?.response || err);
//       }
//     };

//     fetchTags();
//   }, []);

//   // ================= FETCH TEAM MEMBERS =================
//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });

//         const users = res?.data?.users || [];

//         const formattedUsers = users.map((user) => ({
//           value: user._id,
//           label: user.username,
//         }));

//         setTeamMemberList(formattedUsers);
//       } catch (err) {
//         console.error("Error fetching team members:", err?.response || err);
//       }
//     };

//     fetchTeam();
//   }, []);

//   // ================= FILTERED TAGS & MEMBERS =================

//   const accountTags = tagList.length
//     ? tagList.filter((tag) => account?.tags?.includes(tag.value))
//     : [];

//   const assignedMembers = teamMemberList.length
//     ? teamMemberList.filter((member) =>
//         account?.teamMember?.includes(member.value),
//       )
//     : [];

//   // ================= HANDLE SWITCHES =================
//   const handleSwitchClick = (contact) => {
//     setSelectedContact(contact);
//     setNewCanLoginValue(!contact.canLogin);
//     setDialogOpen(true);
//   };

//   const handleNotifyToggle = async (contact) => {
//     try {
//       await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
//         canNotify: !contact.canNotify,
//       });
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canNotify:", err);
//     }
//   };

//   const handleEmailSyncToggle = async (contact) => {
//     try {
//       await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
//         canEmailSync: !contact.canEmailSync,
//       });
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canEmailSync:", err);
//     }
//   };

//   const handleConfirmToggle = async () => {
//     if (!selectedContact) return;
//     try {
//       await accountsAPI.toggleContactLogin(
//         account._id,
//         selectedContact.contact._id,
//         {
//           canLogin: newCanLoginValue,
//         },
//       );
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error updating canLogin:", err);
//     } finally {
//       setDialogOpen(false);
//       setSelectedContact(null);
//     }
//   };

//   const handleCancelToggle = () => {
//     setDialogOpen(false);
//     setSelectedContact(null);
//   };

//   // ================= LINK / UNLINK CONTACTS =================
//   const handleLinkContacts = async () => {
//     if (selectedContacts.length === 0) return;
//     try {
//       const contactsToAdd = selectedContacts.map((contact) => ({
//         contact: contact._id,
//         canLogin: false,
//         canNotify: false,
//         canEmailSync: false,
//       }));
//       await accountsAPI.addContactsToAccount(account._id, {
//         contacts: contactsToAdd,
//       });
//       await fetchAccountDetails();
//       setAddContactDrawerOpen(false);
//       setSelectedContacts([]);
//     } catch (err) {
//       console.error("Error linking contacts:", err);
//     }
//   };

//   const handleUnlinkContact = async (contact) => {
//     if (!window.confirm(`Unlink ${contact.contact.contactName}?`)) return;
//     try {
//       await accountsAPI.removeContactFromAccount(
//         account._id,
//         contact.contact._id,
//       );
//       await fetchAccountDetails();
//     } catch (err) {
//       console.error("Error unlinking contact:", err);
//     }
//   };

//   // ================= RESET PASSWORD =================
//   const handleResetPassword = async (contact) => {
//     if (!contact.canLogin) {
//       alert("Enable login access first.");
//       return;
//     }
//     if (!window.confirm(`Reset password for ${contact.contact.contactName}?`))
//       return;

//     try {
//       await fetch(`${process.env.REACT_APP_USER_LOGIN}/auth/forgot-password`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: contact.contact.email }),
//       });
//       alert("Password reset email sent!");
//     } catch (err) {
//       console.error("Error resetting password:", err);
//     }
//   };

//   // ================= CONTACT EDIT =================
//   const handleOpenContactEditDrawer = (contactData) => {
//     console.log("Opening edit drawer for contact:", contactData);
//     setSelectedContactForEdit(contactData.contact);
//     setContactEditDrawerOpen(true);
//     setMode("edit");
//     // setSelectedContact(contactData.contact);
//   };

//   if (!account) return <Typography>Loading...</Typography>;

//   return (
//     <Box sx={{ p: 3 }}>
//       <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         {/* LEFT SIDE - ACCOUNT DETAILS */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3 }}>
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography variant="h5" fontWeight="bold">
//                 Account Details
//               </Typography>
//               <Tooltip
//                 title={
//                   user?.role === 'team_member' && user?.manageAccounts === false
//                     ? "You don't have permission to edit accounts"
//                     : ""
//                 }
//               >
//                 <span>
//                   <Button
//                     variant="contained"
//                     onClick={() => setDrawerOpen(true)}
//                     disabled={user?.role === 'team_member' && user?.manageAccounts === false}
//                   >
//                     Edit
//                   </Button>
//                 </span>
//               </Tooltip>
//             </Box>

//             <Divider sx={{ my: 2 }} />

//             {/* Avatar + Name */}
//             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//               <UploadProfilePicture
//                 accountId={account._id}
//                 currentImage={account.profilePicture}
//                 onUploadSuccess={fetchAccountDetails}
//               />
//               <Box>
//                 <Typography variant="h6" fontWeight="bold">
//                   {account.accountName}
//                 </Typography>
//                 <Typography color="text.secondary">
//                   {account.clientType}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* TAGS */}
//             <Box
//               sx={{
//                 mt: 3,
//                 p: 2,
//                 borderRadius: 3,
//                 background: "#f9fafb",
//                 border: "1px solid #eee",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontWeight: 600, mb: 1, color: "#333" }}
//               >
//                 Tags
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                 {accountTags?.length > 0 ? (
//                   accountTags.map((tag) => (
//                     <Chip
//                       key={tag.value}
//                       label={tag.label}
//                       sx={{
//                         backgroundColor: tag.colour,
//                         color: "#fff",
//                         fontWeight: 500,
//                         borderRadius: "8px",
//                         px: 0.5,
//                         boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//                         "&:hover": {
//                           transform: "scale(1.05)",
//                           boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
//                         },
//                       }}
//                     />
//                   ))
//                 ) : (
//                   <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
//                     No tags assigned
//                   </Typography>
//                 )}
//               </Box>
//             </Box>

//             {/* TEAM MEMBERS */}
//             <Box
//               sx={{
//                 mt: 3,
//                 p: 2,
//                 borderRadius: 3,
//                 background: "#f9fafb",
//                 border: "1px solid #eee",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontWeight: 600, mb: 1, color: "#333" }}
//               >
//                 Team Members
//               </Typography>

//               <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
//                 {assignedMembers?.length > 0 ? (
//                   assignedMembers.map((m) => (
//                     <Chip
//                       key={m.value}
//                       label={m.label}
//                       variant="outlined"
//                       sx={{
//                         borderRadius: "8px",
//                         fontWeight: 500,
//                         backgroundColor: "#fff",
//                         border: "1px solid #d0d5dd",
//                         "&:hover": {
//                           backgroundColor: "#f1f5f9",
//                           borderColor: "#1976d2",
//                         },
//                       }}
//                     />
//                   ))
//                 ) : (
//                   <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
//                     No team members assigned
//                   </Typography>
//                 )}
//               </Box>
//             </Box>
//           </Paper>
//         </Grid>

//         {/* RIGHT SIDE - CONTACTS */}
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Paper sx={{ p: 3 }}>
//             <Box
//               display="flex"
//               justifyContent="space-between"
//               alignItems="center"
//             >
//               <Typography variant="h5" fontWeight="bold">
//                 Contacts
//               </Typography>
//               <Button
//                 variant="text"
//                 color="primary"
//                 onClick={() => setAddContactDrawerOpen(true)}
//               >
//                 ADD CONTACT
//               </Button>
//             </Box>
//             <Divider sx={{ my: 2 }} />

//             {/* CONTACT LIST */}
//             {account.contacts?.length > 0 ? (
//               account.contacts.map((c) => (
//                 <Box key={c.contact._id}>
//                   <Box
//                     display="flex"
//                     justifyContent="space-between"
//                     alignItems="center"
//                     sx={{ px: 2, py: 2 }}
//                   >
//                     <Box flex={1}>
//                       <Tooltip
//                         title={
//                           storedData?.teammember?.manageContacts === false
//                             ? "No permission to edit contacts"
//                             : ""
//                         }
//                       >
//                         <span>
//                           <Typography
//                             fontWeight="bold"
//                             sx={{
//                               cursor:
//                                 storedData?.teammember?.manageContacts === false
//                                   ? "not-allowed"
//                                   : "pointer",
//                               color:
//                                 storedData?.teammember?.manageContacts === false
//                                   ? "gray"
//                                   : "inherit",
//                               opacity:
//                                 storedData?.teammember?.manageContacts === false
//                                   ? 0.6
//                                   : 1,
//                             }}
//                             onClick={() => {
//                               if (
//                                 storedData?.teammember?.manageContacts === false
//                               )
//                                 return;
//                               handleOpenContactEditDrawer(c);
//                             }}
//                           >
//                             {c.contact.contactName}
//                           </Typography>
//                         </span>
//                       </Tooltip>
//                       <Typography color="text.secondary" fontSize={14}>
//                         {c.contact.email || "-"}
//                       </Typography>
//                     </Box>

//                     {/* Switches */}
//                     <Box
//                       width={260}
//                       display="flex"
//                       justifyContent="space-between"
//                     >
//                       <Switch
//                         checked={c.canLogin}
//                         onChange={() => handleSwitchClick(c)}
//                         color="primary"
//                         disabled
//                       />
//                       <Switch
//                         checked={c.canNotify}
//                         onChange={() => handleNotifyToggle(c)}
//                         color="primary"
//                         disabled
//                       />
//                       <Switch
//                         checked={c.canEmailSync}
//                         onChange={() => handleEmailSyncToggle(c)}
//                         color="primary"
//                       />
//                       <MenuDropdown
//                         contact={c}
//                         onUnlink={handleUnlinkContact}
//                         onResetPassword={handleResetPassword}
//                       />
//                     </Box>
//                   </Box>
//                   <Divider />
//                 </Box>
//               ))
//             ) : (
//               <Typography sx={{ p: 2 }}>No contacts found</Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* Account Edit Drawer */}
//       <AccountContactDrawer
//         open={drawerOpen}
//         onClose={() => {
//           setDrawerOpen(false);
//           fetchAccountDetails();
//         }}
//         accountId={account._id}
//       />

//       {/* Login Confirm Dialog */}
//       <Dialog open={dialogOpen} onClose={handleCancelToggle}>
//         <DialogTitle>Confirm Access Change</DialogTitle>
//         <DialogContent>
//           <Typography>
//             {newCanLoginValue
//               ? `Give portal access to ${selectedContact?.contact.email}?`
//               : `Remove portal access from ${selectedContact?.contact.email}?`}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCancelToggle} variant="outlined">
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirmToggle}
//             variant="contained"
//             color="primary"
//           >
//             Confirm
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Contact Drawer */}
//       <Drawer
//         anchor="right"
//         open={addContactDrawerOpen}
//         onClose={() => {
//           setAddContactDrawerOpen(false);
//           setSelectedContacts([]);
//         }}
//         PaperProps={{ sx: { width: 500, p: 5 } }}
//       >
//         <Box>
//           <Typography variant="h6" gutterBottom>
//             Add Contacts to Account
//           </Typography>
//           <Autocomplete
//             multiple
//             options={availableContacts}
//             getOptionLabel={(option) =>
//               `${option.contactName} (${option.email})`
//             }
//             value={selectedContacts}
//             onChange={(event, newValue) => setSelectedContacts(newValue)}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Search contacts..."
//                 variant="outlined"
//                 fullWidth
//               />
//             )}
//             sx={{ mb: 2 }}
//           />
//           <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
//             <Button
//               onClick={() => {
//                 setAddContactDrawerOpen(false);
//                 setSelectedContacts([]);
//               }}
//               variant="outlined"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleLinkContacts}
//               variant="contained"
//               disabled={selectedContacts.length === 0}
//             >
//               Link Contacts ({selectedContacts.length})
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Contact Edit Drawer */}
//       <NewContactDrawer
//         open={contactEditDrawerOpen}
//         onClose={() => setContactEditDrawerOpen(false)}
//         selectedContact={selectedContactForEdit}
//         mode={mode}
//       />
//     </Box>
//   );
// };

// export default AccountDetails;

import { useEffect, useState,useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  accountsAPI,
  contactsAPI,
  templateAPI,
  authAPI,
} from "../../services/api";
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer";
import MenuDropdown from "./MenuDropdown";
import UploadProfilePicture from "./ProfilePictureUpload";
import NewContactDrawer from "../Account-Contact/NewContactDrawer";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";
import { Loader, X, Users } from "lucide-react";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { ShieldCheck } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const AccountDetails = () => {
  const { accountId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const confirm = useConfirm();
  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [mode, setMode] = useState("edit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

  // const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");

  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);

  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);
const { data: allContacts = [], refetch: refetchContacts } = useQuery({
  queryKey: ["contacts"],
  queryFn: async () => {
    const res = await contactsAPI.getContacts();
    return res.data;
  },
  enabled: addContactDrawerOpen,
});
const availableContacts = useMemo(() => {
  const currentContactIds =
    account?.contacts?.map((c) => c.contact._id) || [];

  return allContacts.filter(
    (contact) => !currentContactIds.includes(contact._id)
  );
}, [allContacts, account]);
  // Filter available contacts for search
  const filteredAvailableContacts = availableContacts.filter(
    (contact) =>
      contact.contactName
        ?.toLowerCase()
        .includes(contactSearch.toLowerCase()) ||
      contact.email?.toLowerCase().includes(contactSearch.toLowerCase()),
  );

  // ================= FETCH ACCOUNT DETAILS =================
  const fetchAccountDetails = async () => {
    try {
      const res = await accountsAPI.getAccountById(accountId);
      setAccount(res.data);
    } catch (err) {
      console.error("Error fetching account details:", err);
    }
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // ================= FETCH AVAILABLE CONTACTS =================
  // const fetchAvailableContacts = async () => {
  //   try {
  //     const res = await contactsAPI.getContacts();
  //     const currentContactIds =
  //       account?.contacts?.map((c) => c.contact._id) || [];
  //     const filteredContacts = res.data.filter(
  //       (contact) => !currentContactIds.includes(contact._id),
  //     );
  //     setAvailableContacts(filteredContacts);
  //   } catch (err) {
  //     console.error("Error fetching contacts:", err);
  //   }
  // };

  // useEffect(() => {
  //   if (addContactDrawerOpen && account) fetchAvailableContacts();
  // }, [addContactDrawerOpen, account]);

  // ================= FETCH TAGS =================
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await templateAPI.getAllTags();
        const tags = res?.data?.tags || [];
        const formattedTags = tags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));
        setTagList(formattedTags);
      } catch (err) {
        console.error("Error fetching tags:", err?.response || err);
      }
    };
    fetchTags();
  }, []);

  // ================= FETCH TEAM MEMBERS =================
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });
        const users = res?.data?.users || [];
        const formattedUsers = users.map((user) => ({
          value: user._id,
          label: user.username,
        }));
        setTeamMemberList(formattedUsers);
      } catch (err) {
        console.error("Error fetching team members:", err?.response || err);
      }
    };
    fetchTeam();
  }, []);

  // ================= FILTERED TAGS & MEMBERS =================
  const accountTags = tagList.length
    ? tagList.filter((tag) => account?.tags?.includes(tag.value))
    : [];

  const assignedMembers = teamMemberList.length
    ? teamMemberList.filter((member) =>
        account?.teamMember?.includes(member.value),
      )
    : [];

  // ================= HANDLE SWITCHES =================
  const handleSwitchClick = (contact) => {
    setSelectedContact(contact);
    setNewCanLoginValue(!contact.canLogin);
    setDialogOpen(true);
  };

  const handleNotifyToggle = async (contact) => {
    try {
      await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
        canNotify: !contact.canNotify,
      });
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canNotify:", err);
    }
  };

  const handleEmailSyncToggle = async (contact) => {
    try {
      await accountsAPI.toggleContactLogin(account._id, contact.contact._id, {
        canEmailSync: !contact.canEmailSync,
      });
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canEmailSync:", err);
    }
  };

  const handleConfirmToggle = async () => {
    if (!selectedContact) return;
    try {
      await accountsAPI.toggleContactLogin(
        account._id,
        selectedContact.contact._id,
        {
          canLogin: newCanLoginValue,
        },
      );
      await fetchAccountDetails();
    } catch (err) {
      console.error("Error updating canLogin:", err);
    } finally {
      setDialogOpen(false);
      setSelectedContact(null);
    }
  };

  const handleCancelToggle = () => {
    setDialogOpen(false);
    setSelectedContact(null);
  };

  // ================= LINK / UNLINK CONTACTS =================
  const handleLinkContacts = async () => {
    if (selectedContacts.length === 0) return;
    try {
      const contactsToAdd = selectedContacts.map((contact) => ({
        contact: contact._id,
        canLogin: false,
        canNotify: false,
        canEmailSync: false,
      }));
      await accountsAPI.addContactsToAccount(account._id, {
        contacts: contactsToAdd,
      });
      await fetchAccountDetails();
      setAddContactDrawerOpen(false);
      setSelectedContacts([]);
      setContactSearch("");
    } catch (err) {
      console.error("Error linking contacts:", err);
    }
  };

  const handleUnlinkContact = async (contact) => {
    confirm({
      title: "Unlink Contact",
      description: `Are you sure you want to unlink ${contact.contact.contactName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await accountsAPI.removeContactFromAccount(
            account._id,
            contact.contact._id,
          );
          await fetchAccountDetails();
        } catch (err) {
          console.error("Error unlinking contact:", err);
        }
      },
    });
  };
  // const handleUnlinkContact = async (contact) => {
  //   if (!window.confirm(`Unlink ${contact.contact.contactName}?`)) return;
  //   try {
  //     await accountsAPI.removeContactFromAccount(
  //       account._id,
  //       contact.contact._id,
  //     );
  //     await fetchAccountDetails();
  //   } catch (err) {
  //     console.error("Error unlinking contact:", err);
  //   }
  // };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (contact) => {
    if (!contact.canLogin) {
      alert("Enable login access first.");
      return;
    }
    if (!window.confirm(`Reset password for ${contact.contact.contactName}?`))
      return;
    try {
      await fetch(`${process.env.REACT_APP_USER_LOGIN}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contact.contact.email }),
      });
      alert("Password reset email sent!");
    } catch (err) {
      console.error("Error resetting password:", err);
    }
  };

  // ================= CONTACT EDIT =================
  const handleOpenContactEditDrawer = (contactData) => {
    console.log("Opening edit drawer for contact:", contactData);
    setSelectedContactForEdit(contactData.contact);
    setContactEditDrawerOpen(true);
    setMode("edit");
  };

  // const handleContactUpdated = () => {
  //   fetchAccountDetails(accountId);
  //   setContactEditDrawerOpen(false);
  // };
  // const handleContactUpdated = async () => {
  //   await fetchAccountDetails();
  //   setContactEditDrawerOpen(false);
  // };


const handleContactUpdated = async () => {
  await fetchAccountDetails();

  await queryClient.invalidateQueries({
    queryKey: ["contacts"],
  });

  setContactEditDrawerOpen(false);
};
  const toggleCls =
    "w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600";
  const cancelBtnCls =
    "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  if (!account)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">
          <Loader />
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT — Account Details */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Account Details
            </h2>
            <span
              title={
                user?.role === "team_member" && user?.manageAccounts === false
                  ? "You don't have permission to edit accounts"
                  : ""
              }
            >
              <Button
                type="button"
                onClick={() => setDrawerOpen(true)}
                disabled={
                  user?.role === "team_member" && user?.manageAccounts === false
                }
                size="sm"
              >
                Edit
              </Button>
            </span>
          </div>

          <div className="px-5 py-4 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <UploadProfilePicture
                accountId={account._id}
                currentImage={account.profilePicture}
                onUploadSuccess={fetchAccountDetails}
              />
              <div>
                <p className="font-semibold text-foreground">
                  {account.accountName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {account.clientType}
                </p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Tags */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {accountTags?.length > 0 ? (
                  accountTags.map((tag) => (
                    <span
                      key={tag.value}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ backgroundColor: tag.colour }}
                    >
                      {tag.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No tags assigned
                  </span>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Team Members
              </p>
              <div className="flex flex-wrap gap-1.5">
                {assignedMembers?.length > 0 ? (
                  assignedMembers.map((m) => (
                    <span
                      key={m.value}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border border-border bg-muted text-muted-foreground"
                    >
                      {m.label}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No members assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Contacts */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Contacts</h2>
            <Button
              type="button"
              size="sm"
              onClick={() => setAddContactDrawerOpen(true)}
            >
              + Add Contact
            </Button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto] items-center px-5 py-2 bg-muted border-b border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Contact
            </span>
            <div className="flex items-center gap-5 mr-8">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">
                Login
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">
                Notify
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-center">
                Email Sync
              </span>
              <span className="w-8"></span>
            </div>
          </div>

          {/* Contact rows */}

          <div className="space-y-2">
            {account.contacts?.length > 0 ? (
              account.contacts.map((c) => (
                <div
                  key={c.contact._id}
                  className="
        
          group
          rounded-2xl
          border border-border/50
          bg-background/70
          backdrop-blur-sm

          transition-all duration-200

          hover:border-border
          hover:bg-muted/30
          hover:shadow-sm
        "
                >
                  <div
                    className="
            grid grid-cols-[1fr_auto]
            items-center gap-4
            px-5 py-4
          "
                  >
                    {/* Contact Info */}
                    <div className="min-w-0">
                      <span
                        title={
                          user?.role === "team_member" &&
                          user?.manageContacts === false
                            ? "You don't have permission to edit contacts"
                            : ""
                        }
                        className={`
                block truncate
                font-medium
                transition-colors duration-200

                ${
                  user?.role === "team_member" && user?.manageContacts === false
                    ? "text-muted-foreground cursor-not-allowed opacity-60"
                    : "text-foreground cursor-pointer hover:text-primary"
                }
              `}
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.92rem * var(--font-scale, 100) / 100)",
                        }}
                        onClick={() => {
                          if (
                            user?.role === "team_member" &&
                            user?.manageContacts === false
                          )
                            return;

                          handleOpenContactEditDrawer(c);
                        }}
                      >
                        {c.contact.contactName}
                      </span>

                      <span
                        className="
                mt-1 block truncate
                text-muted-foreground
              "
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.76rem * var(--font-scale, 100) / 100)",
                        }}
                      >
                        {c.contact.email || "—"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      {c.canLogin && c.contact.isActivated === false && (
                        <Badge
                          className="
        bg-amber-100
        text-amber-700
        border border-amber-200
        hover:bg-amber-100
        text-[10px]
        font-medium
      "
                        >
                          Pending Activation
                        </Badge>
                      )}
                      <div className="flex items-center gap-4 sm:gap-5">
                        {/* Login */}
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className="text-[10px] text-muted-foreground"
                            style={{
                              fontSize:
                                "calc(0.62rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            Login
                          </span>

                          <Switch
                            checked={c.canLogin}
                            onCheckedChange={() => handleSwitchClick(c)}
                            className="
                  data-[state=checked]:bg-primary
                  data-[state=unchecked]:bg-muted-foreground/30
                "
                          />
                        </div>

                        {/* Notify */}
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className="text-[10px] text-muted-foreground"
                            style={{
                              fontSize:
                                "calc(0.62rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            Notify
                          </span>

                          <Switch
                            checked={c.canNotify}
                            onCheckedChange={() => handleNotifyToggle(c)}
                            className="
                  data-[state=checked]:bg-primary
                  data-[state=unchecked]:bg-muted-foreground/30
                "
                          />
                        </div>

                        {/* Email Sync */}
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className="text-[10px] text-muted-foreground"
                            style={{
                              fontSize:
                                "calc(0.62rem * var(--font-scale, 100) / 100)",
                            }}
                          >
                            Sync
                          </span>

                          <Switch
                            checked={c.canEmailSync}
                            onCheckedChange={() => handleEmailSyncToggle(c)}
                            className="
                  data-[state=checked]:bg-primary
                  data-[state=unchecked]:bg-muted-foreground/30
                "
                          />
                        </div>

                        {/* Menu */}
                        <div className="ml-1">
                          <MenuDropdown
                            contact={c}
                            onUnlink={handleUnlinkContact}
                            onResetPassword={handleResetPassword}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="
        flex flex-col items-center justify-center
        rounded-2xl
        border border-dashed border-border/60
        bg-muted/10
        py-14 px-6
        text-center
      "
              >
                <div
                  className="
          mb-4 flex h-12 w-12 items-center justify-center
          rounded-full bg-muted
        "
                >
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <p
                  className="font-medium text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(0.92rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  No contacts linked
                </p>

                <p
                  className="mt-1 text-muted-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize: "calc(0.76rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Add or link contacts to this account.
                </p>

                <Button
                  type="button"
                  onClick={() => setAddContactDrawerOpen(true)}
                  variant="outline"
                  size="sm"
                  className="
          mt-5
          rounded-xl
          border-border/60
          hover:bg-muted/50
        "
                  style={{
                    fontSize: "calc(0.82rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Add Contact
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account edit drawer */}
      <AccountContactDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          fetchAccountDetails();
        }}
        accountId={account._id}
      />

      {/* Confirm access change modal */}

      <Dialog open={dialogOpen} onOpenChange={handleCancelToggle}>
        <DialogContent
          className="
      sm:max-w-md
      rounded-3xl
      border border-border/50
      bg-background/95
      backdrop-blur-xl
      shadow-2xl
      p-0 overflow-hidden
    "
          style={{
            fontFamily: "var(--font-family)",
          }}
        >
          {/* Header */}
          <DialogHeader
            className="
        px-6 pt-6 pb-4
        border-b border-border/40
        space-y-2
      "
          >
            <div className="flex items-start gap-3">
              <div
                className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-2xl
            bg-primary/10
            border border-primary/20
          "
              >
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <div className="space-y-1">
                <DialogTitle
                  className="
              text-base font-semibold tracking-tight
              text-foreground
            "
                  style={{
                    fontSize: "calc(1rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Confirm Access Change
                </DialogTitle>

                <DialogDescription
                  className="
              text-sm leading-relaxed
              text-muted-foreground
            "
                  style={{
                    fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  {newCanLoginValue
                    ? `Grant portal login access to ${selectedContact?.contact.email}?`
                    : `Remove portal login access from ${selectedContact?.contact.email}?`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Body */}
          <div className="px-6 py-5">
            <div
              className="
          rounded-2xl
          border border-border/50
          bg-muted/30
          px-4 py-3
        "
            >
              <p
                className="text-xs font-medium text-muted-foreground mb-1"
                style={{
                  fontSize: "calc(0.72rem * var(--font-scale, 100) / 100)",
                }}
              >
                CONTACT EMAIL
              </p>

              <p
                className="text-sm font-medium text-foreground break-all"
                style={{
                  fontSize: "calc(0.88rem * var(--font-scale, 100) / 100)",
                }}
              >
                {selectedContact?.contact.email}
              </p>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter
            className="
        px-6 py-4
        border-t border-border/40
        bg-muted/10
        flex-row justify-end gap-2
      "
          >
            <Button
              variant="outline"
              onClick={handleCancelToggle}
              className="
    rounded-xl
    border-border/60
    bg-background
    text-foreground

    hover:bg-muted/60
    hover:text-foreground

    dark:bg-background/80
    dark:border-border/70
    dark:text-foreground
    dark:hover:bg-muted/50

    transition-all duration-200
  "
              style={{
                fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={handleConfirmToggle}
              className="
          rounded-xl
          shadow-sm
          transition-all duration-200
        "
              style={{
                fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Contact drawer */}

      {/* <Drawer
        open={addContactDrawerOpen}
        onOpenChange={setAddContactDrawerOpen}
        direction="right"
      >
        <DrawerContent
          className="
      w-full sm:max-w-[500px]
      right-0 top-0 left-auto mt-0 rounded-none
      border-l border-border/50
      bg-background/95 backdrop-blur-xl
      shadow-2xl
      flex flex-col
    "
          style={{
            fontFamily: "var(--font-family)",
          }}
        >
          
          <DrawerHeader
            className="
        border-b border-border/50
        px-6 py-5
        bg-background/80
        backdrop-blur-md
      "
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <DrawerTitle
                  className="
              text-base font-semibold tracking-tight
              text-foreground
            "
                  style={{
                    fontSize: "calc(1rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Add Contacts to Account
                </DrawerTitle>

                <p
                  className="text-xs text-muted-foreground"
                  style={{
                    fontSize: "calc(0.78rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Search and link existing contacts to this account.
                </p>
              </div>

            
              <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => {
          setSelectedContactForEdit(null);
          setMode("create");
          setContactEditDrawerOpen(true);
        }}
      >
        + Create Contact
      </Button>

      <DrawerClose asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
        >
          <X className="h-4 w-4" />
        </Button>
      </DrawerClose>
    </div>
            </div>
          </DrawerHeader>

         
          <div
            className="
        px-6 py-4
        border-b border-border/40
        bg-muted/20
      "
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="
            h-11 rounded-2xl
            border-border/60
            bg-background/80
            shadow-sm
            px-4

            transition-all duration-200

            focus-visible:ring-2
            focus-visible:ring-primary/20
            focus-visible:border-primary/40

            dark:bg-background/60
            dark:border-border/50
          "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize: "calc(0.92rem * var(--font-scale, 100) / 100)",
                }}
              />
            </div>
          </div>

          
          <ScrollArea className="flex-1 h-[calc(100vh-220px)]">
            <div className="px-3 py-3 space-y-2">
              {filteredAvailableContacts.map((c) => {
                const isSelected = selectedContacts.some(
                  (s) => s._id === c._id,
                );

                return (
                  <label
                    key={c._id}
                    className={`
                group flex items-start gap-3
                rounded-2xl border
                px-4 py-3
                cursor-pointer
                transition-all duration-200

                ${
                  isSelected
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-border/50 bg-background/70 hover:bg-muted/40 hover:border-border"
                }
              `}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContacts((prev) => [...prev, c]);
                        } else {
                          setSelectedContacts((prev) =>
                            prev.filter((s) => s._id !== c._id),
                          );
                        }
                      }}
                      className="mt-0.5"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p
                          className="
                      text-sm font-medium
                      text-foreground truncate
                    "
                          style={{
                            fontSize:
                              "calc(0.9rem * var(--font-scale, 100) / 100)",
                          }}
                        >
                          {c.contactName}
                        </p>

                        {isSelected && (
                          <span
                            className="
                        inline-flex items-center
                        rounded-full
                        border border-primary/20
                        bg-primary/10
                        px-2 py-0.5
                        text-[10px] font-medium
                        text-primary
                      "
                          >
                            Selected
                          </span>
                        )}
                      </div>

                      <p
                        className="
                    mt-1 text-xs
                    text-muted-foreground truncate
                  "
                        style={{
                          fontSize:
                            "calc(0.75rem * var(--font-scale, 100) / 100)",
                        }}
                      >
                        {c.email}
                      </p>
                    </div>
                  </label>
                );
              })}

              {filteredAvailableContacts.length === 0 && (
                <div
                  className="
              flex flex-col items-center justify-center
              py-14 text-center
            "
                >
                  <div
                    className="
                mb-3 flex h-12 w-12 items-center justify-center
                rounded-full bg-muted
              "
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p
                    className="text-sm font-medium text-foreground"
                    style={{
                      fontSize: "calc(0.9rem * var(--font-scale, 100) / 100)",
                    }}
                  >
                    No contacts found
                  </p>

                  <p
                    className="mt-1 text-xs text-muted-foreground"
                    style={{
                      fontSize: "calc(0.75rem * var(--font-scale, 100) / 100)",
                    }}
                  >
                    Try searching with another name or email.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          
          <DrawerFooter
            className="
        border-t border-border/50
        bg-background/80 backdrop-blur-md
        px-6 py-4
      "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                {selectedContacts.length > 0 ? (
                  <span>
                    {selectedContacts.length} contact
                    {selectedContacts.length !== 1 ? "s" : ""} selected
                  </span>
                ) : (
                  <span>Select contacts to continue</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddContactDrawerOpen(false);
                    setSelectedContacts([]);
                    setContactSearch("");
                  }}
                  className="
              rounded-xl
              border-border/60
              hover:bg-muted/50
            "
                  style={{
                    fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleLinkContacts}
                  disabled={selectedContacts.length === 0}
                  className="
              rounded-xl
              shadow-sm
              transition-all duration-200
            "
                  style={{
                    fontSize: "calc(0.84rem * var(--font-scale, 100) / 100)",
                  }}
                >
                  Link{" "}
                  {selectedContacts.length > 0
                    ? `${selectedContacts.length} `
                    : ""}
                  Contact
                  {selectedContacts.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer> */}
{addContactDrawerOpen && (
  <div className="fixed inset-0 z-50 overflow-hidden">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={() => {
        setAddContactDrawerOpen(false);
        setSelectedContacts([]);
        setContactSearch("");
      }}
    />

    {/* Drawer */}
    <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background text-foreground border-l border-border shadow-2xl flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0 bg-background">
        <div className="space-y-0.5">
          <h2 className="text-base font-semibold tracking-tight">
            Add Contacts to Account
          </h2>

          <p className="text-xs text-muted-foreground">
            Search and link existing contacts to this account.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setSelectedContactForEdit(null);
              setMode("create");
              setContactEditDrawerOpen(true);
            }}
          >
            + Create Contact
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setAddContactDrawerOpen(false);
              setSelectedContacts([]);
              setContactSearch("");
            }}
            className="h-9 w-9"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 py-4 border-b border-border shrink-0">
        <Input
          placeholder="Search by name or email..."
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-3">
          {filteredAvailableContacts.map((c) => {
            const isSelected = selectedContacts.some(
              (s) => s._id === c._id
            );

            return (
              <label
                key={c._id}
                className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors
                  ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedContacts((prev) => [...prev, c]);
                    } else {
                      setSelectedContacts((prev) =>
                        prev.filter((s) => s._id !== c._id)
                      );
                    }
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">
                      {c.contactName}
                    </p>

                    {isSelected && (
                      <span className="rounded-full bg-primary/10 text-primary text-[10px] px-2 py-0.5">
                        Selected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {c.email}
                  </p>
                </div>
              </label>
            );
          })}

          {filteredAvailableContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <X className="h-8 w-8 text-muted-foreground mb-3" />

              <p className="font-medium">
                No contacts found
              </p>

              <p className="text-sm text-muted-foreground">
                Try another search.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-border shrink-0 bg-background">
        <span className="text-sm text-muted-foreground">
          {selectedContacts.length > 0
            ? `${selectedContacts.length} contact${
                selectedContacts.length > 1 ? "s" : ""
              } selected`
            : "Select contacts to continue"}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setAddContactDrawerOpen(false);
              setSelectedContacts([]);
              setContactSearch("");
            }}
          >
            Cancel
          </Button>

          <Button
            disabled={selectedContacts.length === 0}
            onClick={handleLinkContacts}
          >
            Link
            {selectedContacts.length > 0 &&
              ` ${selectedContacts.length}`}
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Contact Edit Drawer */}
      <NewContactDrawer
        open={contactEditDrawerOpen}
        onClose={() => setContactEditDrawerOpen(false)}
        selectedContact={selectedContactForEdit}
        mode={mode}
        onContactUpdated={handleContactUpdated}
      />
    </div>
  );
};

export default AccountDetails;
