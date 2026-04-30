import React from "react";
import {
  Box, Typography, Card, CardContent,
  IconButton, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function SelectedContactsDisplay({ contacts, onRemove, onUpdateField, isEditing = false }) {
  if (!contacts.length) return null;
  console.log("contacts",contacts)
  return (
    // <Box sx={{ mb: 3 }}>
    //   <Typography variant="h6" gutterBottom>Selected Existing Contacts</Typography>
    //   {contacts.map((contact, index) => (
    //     <Card key={index} sx={{ mb: 2 }}>
    //       <CardContent>
    //         <Box display="flex" justifyContent="space-between" alignItems="flex-start">
    //           <Box flexGrow={1}>
    //             <Typography variant="h6">
    //               {contact.contactName || `${contact.firstName} ${contact.lastName}`}
    //             </Typography>
    //             <Typography color="textSecondary">{contact.email}</Typography>
    //             <FormGroup row sx={{ mt: 1 }}>
    //               <FormControlLabel
    //                 control={
    //                   <Checkbox
    //                     checked={contact.login || false}
    //                     disabled
    //                     onChange={e => onUpdateField(index, "login", e.target.checked)}
    //                   />
    //                 }
    //                 label="Login"
    //               />
    //               <FormControlLabel
    //                 control={
    //                   <Checkbox
    //                     checked={contact.notify || false}
    //                     onChange={e => onUpdateField(index, "notify", e.target.checked)}
    //                     disabled
    //                   />
    //                 }
    //                 label="Notify"
    //               />
    //               <FormControlLabel
    //                 control={
    //                   <Checkbox
    //                     checked={contact.emailSync || false}
    //                     // checked={true}
    //                     // disabled
    //                     onChange={e => onUpdateField(index, "emailSync", e.target.checked)}
    //                   />
    //                 }
    //                 label="Email Sync"
    //               />
    //             </FormGroup>
    //           </Box>
    //           <IconButton onClick={() => onRemove(index)} color="error">
    //             <CloseIcon />
    //           </IconButton>
    //         </Box>
    //       </CardContent>
    //     </Card>
    //   ))}
    // </Box>
     <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2">Selected Existing Contacts</h3>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">
                {contact.contactName || `${contact.firstName} ${contact.lastName}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{contact.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.login || false} disabled onChange={e => onUpdateField(index, "login", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Login</span>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.notify || false} disabled onChange={e => onUpdateField(index, "notify", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Notify</span>}
                />
                <FormControlLabel
                  control={<Checkbox size="small" checked={contact.emailSync || false} disabled onChange={e => onUpdateField(index, "emailSync", e.target.checked)} sx={{ padding: '2px' }} />}
                  label={<span className="text-xs text-slate-600">Email Sync</span>}
                />
              </div>
            </div>
            <button onClick={() => onRemove(index)} className="p-1 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <CloseIcon fontSize="small" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
