


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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Existing Contacts</DialogTitle>
        </DialogHeader>

        {/* Search + Selected Chips */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedContacts.map((contact) => (
              <Badge
                key={contact._id}
                className="flex items-center gap-1 px-2 py-1"
              >
                {contact.contactName ||
                  `${contact.firstName} ${contact.lastName}`}
                <button
                  onClick={() => handleRemoveChip(contact._id)}
                  className="ml-1"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>

          <Input
            autoFocus
            placeholder="Search by email or name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List */}
        <ScrollArea className="h-[300px] mt-4 border rounded-md p-2">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground">
              Loading contacts...
            </p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {searchTerm ? "No contacts found" : "No contacts available"}
            </p>
          ) : (
            <div className="space-y-1">
              {filteredContacts.map((contact) => {
                const isSelected = selectedContacts.some(
                  (c) => c._id === contact._id
                );

                return (
                  <div
                    key={contact._id}
                    onClick={() => handleToggleContact(contact)}
                    className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted"
                  >
                    <Checkbox checked={isSelected} />

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {contact.contactName ||
                          `${contact.firstName} ${contact.lastName}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {contact.email}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedContacts.length === 0}
          >
            Add Selected Contacts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}