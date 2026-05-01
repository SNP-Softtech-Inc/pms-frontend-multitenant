// import React from "react";
// import {
//   Box,
//   Typography,
//   Drawer,
//   FormGroup,
//   FormControlLabel,
//   Switch,
//   TextField,
//   InputLabel,
// } from "@mui/material";
// import { IoClose } from "react-icons/io5";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { useTheme } from "@mui/material/styles";

// const OrganizerSettingsDrawer = ({
//   open,
//   onClose,
//   loginChecked,
//   onLoginToggle,
//   notifyChecked,
//   onNotifyToggle,
//   emailSyncChecked,
//   onEmailSyncToggle,
//   autoSaveChecked,
//   onAutoSaveToggle,
//   daysUntilNextReminder,
//   onDaysUntilNextReminderChange,
//   noOfReminder,
//   onNoOfReminderChange,
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         id: "tag-drawer",
//         sx: {
//           borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
//           width: isSmallScreen ? "100%" : 500,
//           maxWidth: "100%",
//           [theme.breakpoints.down("sm")]: {
//             width: "100%",
//           },
//         },
//       }}
//     >
//       <Box
//         sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
//         role="presentation"
//       >
//         <Box>
//           <Box
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "15px",
//               background: "#EEEEEE",
//             }}
//           >
//             <Typography variant="h6">Organizer settings</Typography>
//             <IoClose
//               onClick={onClose}
//               style={{ cursor: "pointer" }}
//             />
//           </Box>
//           <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
//             <FormGroup>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={loginChecked}
//                     onChange={(event) => onLoginToggle(event.target.checked)}
//                   />
//                 }
//                 label="Notify about document upload"
//               />
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={notifyChecked}
//                     onChange={(event) => onNotifyToggle(event.target.checked)}
//                   />
//                 }
//                 label="Organizer self service"
//               />
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={emailSyncChecked}
//                     onChange={(event) => onEmailSyncToggle(event.target.checked)}
//                   />
//                 }
//                 label="Automatically seal after submission"
//               />
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={autoSaveChecked}
//                     onChange={(event) => onAutoSaveToggle(event.target.checked)}
//                   />
//                 }
//                 label="Send reminders to clients"
//               />

//               {autoSaveChecked && (
//                 <Box mb={3}>
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 3,
//                       mt: 2,
//                     }}
//                   >
//                     <Box>
//                       <InputLabel sx={{ color: "black" }}>
//                         Days until next reminder
//                       </InputLabel>
//                       <TextField
//                         fullWidth
//                         name="Daysuntilnextreminder"
//                         value={daysUntilNextReminder}
//                         onChange={(e) => onDaysUntilNextReminderChange(e.target.value)}
//                         placeholder="Days until next reminder"
//                         size="small"
//                         sx={{ mt: 2 }}
//                       />
//                     </Box>

//                     <Box>
//                       <InputLabel sx={{ color: "black" }}>
//                         No Of reminders
//                       </InputLabel>
//                       <TextField
//                         fullWidth
//                         name="No Of reminders"
//                         value={noOfReminder}
//                         onChange={(e) => onNoOfReminderChange(e.target.value)}
//                         placeholder="NoOfreminders"
//                         size="small"
//                         sx={{ mt: 2 }}
//                       />
//                     </Box>
//                   </Box>
//                 </Box>
//               )}
//             </FormGroup>
//           </Box>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default OrganizerSettingsDrawer;


import React from "react";
import { X } from "lucide-react";
import { Switch } from "../../../components/ui/switch";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

const OrganizerSettingsDrawer = ({
  open,
  onClose,
  loginChecked,
  onLoginToggle,
  notifyChecked,
  onNotifyToggle,
  emailSyncChecked,
  onEmailSyncToggle,
  autoSaveChecked,
  onAutoSaveToggle,
  daysUntilNextReminder,
  onDaysUntilNextReminderChange,
  noOfReminder,
  onNoOfReminderChange,
}) => {
  const handleSave = () => {
    // Handle save logic if needed
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-background shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            Organizer settings
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Notify about document upload */}
            <div className="flex items-center justify-between">
              <Label htmlFor="document-upload" className="text-sm font-normal cursor-pointer">
                Notify about document upload
              </Label>
              <Switch
                id="document-upload"
                checked={loginChecked}
                onCheckedChange={onLoginToggle}
              />
            </div>

            {/* Organizer self service */}
            <div className="flex items-center justify-between">
              <Label htmlFor="self-service" className="text-sm font-normal cursor-pointer">
                Organizer self service
              </Label>
              <Switch
                id="self-service"
                checked={notifyChecked}
                onCheckedChange={onNotifyToggle}
              />
            </div>

            {/* Automatically seal after submission */}
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-seal" className="text-sm font-normal cursor-pointer">
                Automatically seal after submission
              </Label>
              <Switch
                id="auto-seal"
                checked={emailSyncChecked}
                onCheckedChange={onEmailSyncToggle}
              />
            </div>

            {/* Send reminders to clients */}
            <div className="flex items-center justify-between">
              <Label htmlFor="send-reminders" className="text-sm font-normal cursor-pointer">
                Send reminders to clients
              </Label>
              <Switch
                id="send-reminders"
                checked={autoSaveChecked}
                onCheckedChange={onAutoSaveToggle}
              />
            </div>

            {/* Conditional fields for reminders */}
            {autoSaveChecked && (
              <div className="pl-4 pt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="days-until-reminder" className="text-sm font-medium">
                      Days until next reminder
                    </Label>
                    <Input
                      id="days-until-reminder"
                      type="text"
                      value={daysUntilNextReminder}
                      onChange={(e) => onDaysUntilNextReminderChange(e.target.value)}
                      placeholder="Days until next reminder"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="no-of-reminders" className="text-sm font-medium">
                      No of reminders
                    </Label>
                    <Input
                      id="no-of-reminders"
                      type="text"
                      value={noOfReminder}
                      onChange={(e) => onNoOfReminderChange(e.target.value)}
                      placeholder="No of reminders"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSettingsDrawer;