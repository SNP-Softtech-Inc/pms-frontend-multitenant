


// import React, { useState, useEffect } from "react";
// import {
//   Box, TextField, Chip, List, ListItem, ListItemText, Dialog,
//   DialogActions, DialogContent, DialogTitle, Button, Checkbox,
//   Typography, ListItemButton
// } from "@mui/material";
// import { contactsAPI } from "../../services/api"; // ✅ import API

// export default function ContactSelectionDialog({ open, onClose, onSelectContacts }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [availableContacts, setAvailableContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (open) fetchContacts();
//   }, [open]);

//   // ================= FETCH CONTACTS =================
//   const fetchContacts = async () => {
//     setLoading(true);
//     try {
//       // ✅ use centralized API
//       const response = await contactsAPI.getContacts();

//       // adjust if your backend wraps data
//       setAvailableContacts(response.data || []);
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//       setAvailableContacts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);

//   const handleToggleContact = (contact) => {
//     const currentIndex = selectedContacts.findIndex(c => c._id === contact._id);
//     const newSelected = [...selectedContacts];

//     if (currentIndex === -1) newSelected.push(contact);
//     else newSelected.splice(currentIndex, 1);

//     setSelectedContacts(newSelected);
//     setSearchTerm("");
//   };

//   const handleRemoveChip = (contactId) =>
//     setSelectedContacts(selectedContacts.filter(c => c._id !== contactId));

//   const handleSubmit = () => {
//     onSelectContacts(selectedContacts);
//     setSelectedContacts([]);
//     setSearchTerm("");
//     onClose();
//   };

//   const handleCancel = () => {
//     setSelectedContacts([]);
//     setSearchTerm("");
//     onClose();
//   };

//   const filteredContacts = availableContacts.filter(contact =>
//     contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
//       <DialogTitle>Select Existing Contacts</DialogTitle>

//       <DialogContent>
//         <Box sx={{ mt: 1 }}>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Search by email or name"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={searchTerm}
//             onChange={handleSearchChange}
//             InputProps={{
//               startAdornment: (
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mr: 1 }}>
//                   {selectedContacts.map(contact => (
//                     <Chip
//                       key={contact._id}
//                       size="small"
//                       label={
//                         contact.contactName ||
//                         `${contact.firstName} ${contact.lastName}`
//                       }
//                       onDelete={() => handleRemoveChip(contact._id)}
//                     />
//                   ))}
//                 </Box>
//               ),
//             }}
//           />
//         </Box>

//         <Box sx={{ mt: 2, height: 300, overflow: "auto" }}>
//           {loading ? (
//             <Typography>Loading contacts...</Typography>
//           ) : filteredContacts.length === 0 ? (
//             <Typography sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
//               {searchTerm ? "No contacts found" : "No contacts available"}
//             </Typography>
//           ) : (
//             <List>
//               {filteredContacts.map((contact) => {
//                 const isSelected = selectedContacts.some(
//                   c => c._id === contact._id
//                 );

//                 return (
//                   <ListItem key={contact._id} disablePadding>
//                     <ListItemButton onClick={() => handleToggleContact(contact)}>
//                       <Checkbox
//                         edge="start"
//                         checked={isSelected}
//                         tabIndex={-1}
//                         disableRipple
//                       />
//                       <ListItemText
//                         primary={
//                           contact.contactName ||
//                           `${contact.firstName} ${contact.lastName}`
//                         }
//                         secondary={contact.email}
//                       />
//                     </ListItemButton>
//                   </ListItem>
//                 );
//               })}
//             </List>
//           )}
//         </Box>
//       </DialogContent>

//       <DialogActions>
//         <Button onClick={handleCancel}>Cancel</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           disabled={selectedContacts.length === 0}
//         >
//           Add Selected Contacts
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }



import React, { useState, useEffect } from "react";
import { contactsAPI } from "../../services/api";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Badge } from "../../components/ui/badge";
import { X } from "lucide-react";
import { Label } from "../../components/ui/label";
export default function ContactSelectionDialog({
  open,
  onClose,
  onSelectContacts,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [availableContacts, setAvailableContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchContacts();
  }, [open]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await contactsAPI.getContacts();
      setAvailableContacts(response.data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setAvailableContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleContact = (contact) => {
    const exists = selectedContacts.find((c) => c._id === contact._id);
    if (exists) {
      setSelectedContacts(selectedContacts.filter((c) => c._id !== contact._id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
    setSearchTerm("");
  };

  const handleRemoveChip = (contactId) => {
    setSelectedContacts(selectedContacts.filter((c) => c._id !== contactId));
  };

  const handleSubmit = () => {
    onSelectContacts(selectedContacts);
    setSelectedContacts([]);
    setSearchTerm("");
    onClose();
  };

  const handleCancel = () => {
    setSelectedContacts([]);
    setSearchTerm("");
    onClose();
  };

  const filteredContacts = availableContacts.filter(
    (contact) =>
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
return (
  <Dialog open={open} onOpenChange={handleCancel}>
    <DialogContent
      className="
        max-w-2xl overflow-hidden
        rounded-3xl
        border border-border/60
        bg-background/95
        backdrop-blur-xl
        shadow-2xl
        p-0
      "
      style={{
        fontFamily: "var(--font-family)",
      }}
    >
      {/* Header */}
      <DialogHeader
        className="
          border-b border-border/50
          px-6 py-5
          bg-muted/20
          space-y-1
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <DialogTitle
              className="
                text-lg font-semibold
                tracking-tight
                text-foreground
              "
              style={{
                fontSize:
                  "calc(1.05rem * var(--font-scale, 100) / 100)",
              }}
            >
              Select Existing Contacts
            </DialogTitle>

            <p className="text-sm text-muted-foreground">
              Search and link existing contacts to this account.
            </p>
          </div>

          <div
            className="
              inline-flex items-center rounded-full
              border border-primary/20
              bg-primary/10
              px-3 py-1
              text-[11px] font-medium text-primary
            "
          >
            {selectedContacts.length} Selected
          </div>
        </div>
      </DialogHeader>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Selected Chips */}
        {selectedContacts.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Selected Contacts
            </Label>

            <div className="flex flex-wrap gap-2">
              {selectedContacts.map((contact) => (
                <Badge
                  key={contact._id}
                  variant="secondary"
                  className="
                    flex items-center gap-1.5
                    rounded-xl
                    border border-primary/20
                    bg-primary/10
                    px-3 py-1.5
                    text-xs font-medium text-primary
                    hover:bg-primary/15
                    transition-colors
                  "
                >
                  <span className="max-w-[180px] truncate">
                    {contact.contactName ||
                      `${contact.firstName} ${contact.lastName}`}
                  </span>

                  <button
                    onClick={() =>
                      handleRemoveChip(contact._id)
                    }
                    className="
                      inline-flex h-4 w-4 items-center justify-center
                      rounded-full
                      hover:bg-primary/20
                      transition-colors
                    "
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Search Contacts
          </Label>
<div className="relative">
  <Input
    autoFocus
    placeholder="Search by contact name or email..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="
      h-11 rounded-2xl
      border border-border/60
      bg-background/80
      text-foreground
      placeholder:text-muted-foreground

      backdrop-blur-sm
      shadow-sm

      pl-4 pr-4

      transition-all duration-200 ease-in-out

      hover:border-border
      hover:bg-background

      focus-visible:ring-4
      focus-visible:ring-primary/15
      focus-visible:border-primary/40
      focus-visible:bg-background

      dark:bg-muted/20
      dark:hover:bg-muted/30
      dark:border-border/50
      dark:focus-visible:ring-primary/20
    "
    style={{
      fontFamily: "var(--font-family)",
      fontSize:
        "calc(0.92rem * var(--font-scale, 100) / 100)",
    }}
  />

  {/* Optional subtle glow for modern theme */}
  <div
    className="
      pointer-events-none
      absolute inset-0 rounded-2xl
      ring-1 ring-inset ring-white/5
      dark:ring-white/10
    "
  />
</div>
          {/* <div className="relative">
            <Input
              autoFocus
              placeholder="Search by contact name or email..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="
                h-11 rounded-2xl
                border-border/60
                bg-background/80
                pl-4 pr-4
                shadow-sm
                transition-all duration-200

                focus-visible:ring-2
                focus-visible:ring-primary/20
                focus-visible:border-primary/40
              "
              style={{
                fontFamily: "var(--font-family)",
                fontSize:
                  "calc(0.92rem * var(--font-scale, 100) / 100)",
              }}
            />
          </div> */}
        </div>

        {/* Contact List */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Available Contacts
          </Label>

          <ScrollArea
            className="
              h-[340px]
              rounded-2xl
              border border-border/50
              bg-muted/10
              p-2
            "
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading contacts...
                </p>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "No contacts found"
                    : "No contacts available"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => {
                  const isSelected =
                    selectedContacts.some(
                      (c) => c._id === contact._id
                    );

                  return (
                    <div
                      key={contact._id}
                      onClick={() =>
                        handleToggleContact(contact)
                      }
                      className={`
                        group flex cursor-pointer items-center gap-4
                        rounded-2xl border
                        p-3
                        transition-all duration-200

                        ${
                          isSelected
                            ? `
                              border-primary/30
                              bg-primary/10
                              shadow-sm
                            `
                            : `
                              border-border/40
                              bg-background/70
                              hover:border-primary/20
                              hover:bg-muted/30
                            `
                        }
                      `}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="pointer-events-none"
                      />

                      {/* Avatar */}
                      <div
                        className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-full
                          bg-primary/10
                          text-sm font-semibold text-primary
                        "
                      >
                        {(
                          contact.contactName ||
                          `${contact.firstName || ""} ${
                            contact.lastName || ""
                          }`
                        )
                          ?.trim()
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p
                          className="
                            truncate text-sm font-medium
                            text-foreground
                          "
                        >
                          {contact.contactName ||
                            `${contact.firstName} ${contact.lastName}`}
                        </p>

                        <p className="truncate text-xs text-muted-foreground mt-0.5">
                          {contact.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <DialogFooter
        className="
          border-t border-border/50
          bg-muted/10
          px-6 py-4
          flex-row items-center justify-end gap-3
        "
      >
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="
            rounded-xl px-4
            hover:bg-muted
          "
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={selectedContacts.length === 0}
          className="
            rounded-xl px-5
            shadow-sm transition-all duration-200
            hover:shadow-md
          "
        >
          Add Selected Contacts
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
  // return (
  //   <Dialog open={open} onOpenChange={handleCancel}>
  //     <DialogContent className="max-w-2xl">
  //       <DialogHeader>
  //         <DialogTitle>Select Existing Contacts</DialogTitle>
  //       </DialogHeader>

  //       {/* Search + Selected Chips */}
  //       <div className="space-y-2">
  //         <div className="flex flex-wrap gap-2 mb-2">
  //           {selectedContacts.map((contact) => (
  //             <Badge
  //               key={contact._id}
  //               className="flex items-center gap-1 px-2 py-1"
  //             >
  //               {contact.contactName ||
  //                 `${contact.firstName} ${contact.lastName}`}
  //               <button
  //                 onClick={() => handleRemoveChip(contact._id)}
  //                 className="ml-1"
  //               >
  //                 <X size={14} />
  //               </button>
  //             </Badge>
  //           ))}
  //         </div>

  //         <Input
  //           autoFocus
  //           placeholder="Search by email or name"
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //         />
  //       </div>

  //       {/* List */}
  //       <ScrollArea className="h-[300px] mt-4 border rounded-md p-2">
  //         {loading ? (
  //           <p className="text-center text-sm text-muted-foreground">
  //             Loading contacts...
  //           </p>
  //         ) : filteredContacts.length === 0 ? (
  //           <p className="text-center text-sm text-muted-foreground">
  //             {searchTerm ? "No contacts found" : "No contacts available"}
  //           </p>
  //         ) : (
  //           <div className="space-y-1">
  //             {filteredContacts.map((contact) => {
  //               const isSelected = selectedContacts.some(
  //                 (c) => c._id === contact._id
  //               );

  //               return (
  //                 <div
  //                   key={contact._id}
  //                   onClick={() => handleToggleContact(contact)}
  //                   className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted"
  //                 >
  //                   <Checkbox checked={isSelected} />

  //                   <div className="flex flex-col">
  //                     <span className="text-sm font-medium">
  //                       {contact.contactName ||
  //                         `${contact.firstName} ${contact.lastName}`}
  //                     </span>
  //                     <span className="text-xs text-muted-foreground">
  //                       {contact.email}
  //                     </span>
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         )}
  //       </ScrollArea>

  //       <DialogFooter className="mt-4">
  //         <Button variant="outline" onClick={handleCancel}>
  //           Cancel
  //         </Button>
  //         <Button
  //           onClick={handleSubmit}
  //           disabled={selectedContacts.length === 0}
  //         >
  //           Add Selected Contacts
  //         </Button>
  //       </DialogFooter>
  //     </DialogContent>
  //   </Dialog>
  // );
}