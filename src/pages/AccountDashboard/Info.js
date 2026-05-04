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


import { useEffect, useState } from "react";
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
import { Loader, X } from "lucide-react";
import { useConfirm } from "../../components/ConfirmDialogContext";

const AccountDetails = () => {
  const { accountId } = useParams();
  const { user } = useAuth();
  const confirm = useConfirm();
  const [account, setAccount] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newCanLoginValue, setNewCanLoginValue] = useState(false);
  const [mode, setMode] = useState("edit");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addContactDrawerOpen, setAddContactDrawerOpen] = useState(false);

  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState("");

  const [tagList, setTagList] = useState([]);
  const [teamMemberList, setTeamMemberList] = useState([]);

  const [contactEditDrawerOpen, setContactEditDrawerOpen] = useState(false);
  const [selectedContactForEdit, setSelectedContactForEdit] = useState(null);

  // Filter available contacts for search
  const filteredAvailableContacts = availableContacts.filter(contact =>
    contact.contactName?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    contact.email?.toLowerCase().includes(contactSearch.toLowerCase())
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
  const fetchAvailableContacts = async () => {
    try {
      const res = await contactsAPI.getContacts();
      const currentContactIds =
        account?.contacts?.map((c) => c.contact._id) || [];
      const filteredContacts = res.data.filter(
        (contact) => !currentContactIds.includes(contact._id),
      );
      setAvailableContacts(filteredContacts);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  useEffect(() => {
    if (addContactDrawerOpen && account) fetchAvailableContacts();
  }, [addContactDrawerOpen, account]);

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
      }
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

  const handleContactUpdated = () => {
    fetchAccountDetails();
    setContactEditDrawerOpen(false);
  };

  const toggleCls = "w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600";
  const cancelBtnCls = "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  if (!account) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground"><Loader/></p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* LEFT — Account Details */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Account Details</h2>
            <span title={user?.role === 'team_member' && user?.manageAccounts === false ? "You don't have permission to edit accounts" : ""}>
              <Button
                type="button"
                onClick={() => setDrawerOpen(true)}
                disabled={user?.role === 'team_member' && user?.manageAccounts === false}
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
                <p className="font-semibold text-foreground">{account.accountName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{account.clientType}</p>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Tags */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tags</p>
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
                  <span className="text-xs text-muted-foreground">No tags assigned</span>
                )}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Team Members</p>
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
                  <span className="text-xs text-muted-foreground">No members assigned</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Contacts */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Contacts</h2>
            <Button type="button" size="sm" onClick={() => setAddContactDrawerOpen(true)}>
              + Add Contact
            </Button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto] items-center px-5 py-2 bg-muted border-b border-border">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Contact</span>
            <div className="flex items-center gap-5 mr-8">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">Login</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-10 text-center">Notify</span>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide w-14 text-center">Email Sync</span>
              <span className="w-8"></span>
            </div>
          </div>

          {/* Contact rows */}
          <div className="divide-y divide-border">
            {account.contacts?.length > 0 ? (
              account.contacts.map((c) => (
                <div key={c.contact._id} className="grid grid-cols-[1fr_auto] items-center px-5 py-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <span
                      title={user?.role === 'team_member' && user?.manageContacts === false ? "You don't have permission to edit contacts" : ""}
                      className={`text-sm font-medium block ${
                        user?.role === 'team_member' && user?.manageContacts === false
                          ? 'text-muted-foreground cursor-not-allowed opacity-60'
                          : 'text-foreground cursor-pointer hover:text-primary'
                      }`}
                      onClick={() => {
                        if (user?.role === 'team_member' && user?.manageContacts === false) return;
                        handleOpenContactEditDrawer(c);
                      }}
                    >
                      {c.contact.contactName}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 block">{c.contact.email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-5 mr-2">
                    <Switch
                      checked={c.canLogin}
                      onCheckedChange={() => handleSwitchClick(c)}
                      // disabled
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Switch
                      checked={c.canNotify}
                      onCheckedChange={() => handleNotifyToggle(c)}
                      // disabled
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <Switch
                      checked={c.canEmailSync}
                      onCheckedChange={() => handleEmailSyncToggle(c)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                    <MenuDropdown
                      contact={c}
                      onUnlink={handleUnlinkContact}
                      onResetPassword={handleResetPassword}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-sm text-muted-foreground">No contacts linked</p>
                <Button
                  type="button"
                  onClick={() => setAddContactDrawerOpen(true)}
                  variant="link"
                  size="sm"
                  className="text-xs"
                >
                  Add a contact
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Access Change</DialogTitle>
            <DialogDescription>
              {newCanLoginValue
                ? `Grant portal login access to ${selectedContact?.contact.email}?`
                : `Remove portal login access from ${selectedContact?.contact.email}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelToggle}>
              Cancel
            </Button>
            <Button onClick={handleConfirmToggle}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Contact drawer */}
      <Drawer open={addContactDrawerOpen} onOpenChange={setAddContactDrawerOpen} direction="right">
        <DrawerContent className="w-full sm:max-w-[480px] right-0 top-0 left-auto mt-0 rounded-none">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <DrawerTitle>Add Contacts to Account</DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>
          <div className="px-5 py-3 border-b border-border">
            <Input
              type="text"
              placeholder="Search by name or email…"
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
            <div className="divide-y divide-border">
              {filteredAvailableContacts.map((c) => (
                <label key={c._id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={selectedContacts.some(s => s._id === c._id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedContacts(prev => [...prev, c]);
                      } else {
                        setSelectedContacts(prev => prev.filter(s => s._id !== c._id));
                      }
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.contactName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </div>
                </label>
              ))}
              {filteredAvailableContacts.length === 0 && (
                <p className="text-sm text-muted-foreground px-5 py-6 text-center">No contacts found</p>
              )}
            </div>
          </ScrollArea>
          <DrawerFooter className="border-t border-border">
            <div className="flex justify-end gap-2">
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
                onClick={handleLinkContacts}
                disabled={selectedContacts.length === 0}
              >
                Link {selectedContacts.length > 0 ? `${selectedContacts.length} ` : ""}Contact{selectedContacts.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

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