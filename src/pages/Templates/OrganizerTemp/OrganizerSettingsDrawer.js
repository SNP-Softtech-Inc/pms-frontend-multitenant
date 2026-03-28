import React from "react";
import {
  Box,
  Typography,
  Drawer,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  InputLabel,
} from "@mui/material";
import { IoClose } from "react-icons/io5";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        id: "tag-drawer",
        sx: {
          borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
          width: isSmallScreen ? "100%" : 500,
          maxWidth: "100%",
          [theme.breakpoints.down("sm")]: {
            width: "100%",
          },
        },
      }}
    >
      <Box
        sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
        role="presentation"
      >
        <Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px",
              background: "#EEEEEE",
            }}
          >
            <Typography variant="h6">Organizer settings</Typography>
            <IoClose
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <Box sx={{ pr: 2, pl: 2, pt: 2 }}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={loginChecked}
                    onChange={(event) => onLoginToggle(event.target.checked)}
                  />
                }
                label="Notify about document upload"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={notifyChecked}
                    onChange={(event) => onNotifyToggle(event.target.checked)}
                  />
                }
                label="Organizer self service"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={emailSyncChecked}
                    onChange={(event) => onEmailSyncToggle(event.target.checked)}
                  />
                }
                label="Automatically seal after submission"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={autoSaveChecked}
                    onChange={(event) => onAutoSaveToggle(event.target.checked)}
                  />
                }
                label="Send reminders to clients"
              />

              {autoSaveChecked && (
                <Box mb={3}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mt: 2,
                    }}
                  >
                    <Box>
                      <InputLabel sx={{ color: "black" }}>
                        Days until next reminder
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="Daysuntilnextreminder"
                        value={daysUntilNextReminder}
                        onChange={(e) => onDaysUntilNextReminderChange(e.target.value)}
                        placeholder="Days until next reminder"
                        size="small"
                        sx={{ mt: 2 }}
                      />
                    </Box>

                    <Box>
                      <InputLabel sx={{ color: "black" }}>
                        No Of reminders
                      </InputLabel>
                      <TextField
                        fullWidth
                        name="No Of reminders"
                        value={noOfReminder}
                        onChange={(e) => onNoOfReminderChange(e.target.value)}
                        placeholder="NoOfreminders"
                        size="small"
                        sx={{ mt: 2 }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </FormGroup>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default OrganizerSettingsDrawer;