import  { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  Checkbox,
   Select,
  MenuItem,
 
  FormControl,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import {
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  AddCircleOutline as AddCircleOutlineIcon,
 
} from "@mui/icons-material";
import TwitterIcon from "@mui/icons-material/Twitter";


const FirmSetting = () => {
  // ------------------ States ------------------
  // Contact details
  const [firmName, setFirmName] = useState("");
  const [firmEmail, setFirmEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [receiveCopies, setReceiveCopies] = useState(false);

  // Social media
  const [facebookLink, setFacebookLink] = useState("");
  const [linkedInLink, setLinkedInLink] = useState("");
  const [xLink, setXLink] = useState("");
  const [instagramLink, setInstagramLink] = useState("");

  // About Us
  const [description, setDescription] = useState("");
  const [showFirmOwnerPhoto, setShowFirmOwnerPhoto] = useState(false);

  // Logo Upload
  const [selectedFile, setSelectedFile] = useState(null);

  // International Settings
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const languages = ["English", "Spanish", "French"];

  // Firm portal & domain
  const [portalURL, setPortalURL] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  // Contact name formatting
  const contactNameOptions = ["First Name Last Name", "Last Name First Name"];
  const [contactNameFormat, setContactNameFormat] = useState(
    contactNameOptions[0],
  );

  // Signatures
  const signatureOptions = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"];
  const [signatureFormat, setSignatureFormat] = useState(signatureOptions[0]);

  // Two-Factor Authentication
  const [enable2FA, setEnable2FA] = useState(false);

  // Default account access
  const [defaultAccountAccess, setDefaultAccountAccess] = useState("");

  // Chats
  const [chatSettings, setChatSettings] = useState("");
  const [allowClientCreateChat, setAllowClientCreateChat] = useState(false);

  // Editor access
  const [editorAccess, setEditorAccess] = useState("");

  // Default folder template
  const [defaultFolderTemplate, setDefaultFolderTemplate] = useState("");

  // System-generated emails
  const [systemGeneratedEmails, setSystemGeneratedEmails] = useState({
    showFirmContactDetails: false,
    showSocialNetworkLinks: false,
    showFirmLogo: false,
    showInternalNotifications: false,
    showClientNotifications: false,
  });

  // Sending limit
  const [sendingLimit, setSendingLimit] = useState("");

  // Client portal
  const [clientPortalSettings, setClientPortalSettings] = useState("");
  const [clientPortalAnnouncement, setClientPortalAnnouncement] = useState("");
  const [showDoneUploadingButton, setShowDoneUploadingButton] = useState(false);
  const [showDoneUploadingCheckbox, setShowDoneUploadingCheckbox] =
    useState(false);

  // States list for dropdown
  const [states, setStates] = useState([]);
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.get(
          "https://countriesnow.space/api/v0.1/countries/states",
        );
        const country = res.data.data.find((c) => c.name === "United States");
        if (country) setStates(country.states);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStates();
  }, []);

  // ------------------ Handlers ------------------
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    setSelectedFile(e.dataTransfer.files[0]);
  };

  // ------------------ Section Components ------------------
  const ContactDetailsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Contact Details
      </Typography>
      <TextField
        fullWidth
        label="Firm Name"
        size="small"
        sx={{ mb: 2 }}
        value={firmName}
        onChange={(e) => setFirmName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Firm Email"
        size="small"
        sx={{ mb: 2 }}
        value={firmEmail}
        onChange={(e) => setFirmEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Street Address"
        size="small"
        sx={{ mb: 2 }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Grid container spacing={2} mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="City"
            size="small"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>State</InputLabel>
            <Select
              value={selectedState}
              label="State"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((state) => (
                <MenuItem key={state.name} value={state.name}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        label="Zip/Postal Code"
        size="small"
        sx={{ mb: 2 }}
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
      />
      <TextField
        fullWidth
        label="Phone Number"
        size="small"
        sx={{ mb: 2 }}
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <TextField
        fullWidth
        label="Website"
        size="small"
        sx={{ mb: 2 }}
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography>Receive BCC of system emails?</Typography>
        <Switch
          checked={receiveCopies}
          onChange={(e) => setReceiveCopies(e.target.checked)}
        />
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const SocialMediaLinksSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Social Media Links
      </Typography>
      <TextField
        fullWidth
        label="Facebook"
        size="small"
        sx={{ mb: 2 }}
        value={facebookLink}
        onChange={(e) => setFacebookLink(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FacebookIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="LinkedIn"
        size="small"
        sx={{ mb: 2 }}
        value={linkedInLink}
        onChange={(e) => setLinkedInLink(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LinkedInIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="X"
        size="small"
        sx={{ mb: 2 }}
        value={xLink}
        onChange={(e) => setXLink(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TwitterIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        fullWidth
        label="Instagram"
        size="small"
        sx={{ mb: 2 }}
        value={instagramLink}
        onChange={(e) => setInstagramLink(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <InstagramIcon color="error" />
            </InputAdornment>
          ),
        }}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const AboutUsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        About Us
      </Typography>
      <TextField
        fullWidth
        label="Description"
        multiline
        rows={3}
        sx={{ mb: 2 }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Box display="flex" alignItems="center" mb={2}>
        <Checkbox
          checked={showFirmOwnerPhoto}
          onChange={(e) => setShowFirmOwnerPhoto(e.target.checked)}
        />
        <Typography ml={1}>Show firm owner photo on login page</Typography>
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const LogoUploadSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Logo Upload
      </Typography>
      <Box
        sx={{ border: "2px dashed gray", p: 3, textAlign: "center", mb: 2 }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Typography>Drag & drop logo here</Typography>
        <Button
          variant="contained"
          sx={{ mt: 1 }}
          onClick={() => document.getElementById("logoInput").click()}
        >
          Browse Files
        </Button>
        <input
          type="file"
          id="logoInput"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const InternationalSettingsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        International Settings
      </Typography>
      <TextField
        fullWidth
        label="Default Language"
        size="small"
        sx={{ mb: 2 }}
        value={selectedLanguage}
        onChange={(e) => setSelectedLanguage(e.target.value)}
      />
      <TextField
        fullWidth
        label="Time Zone"
        size="small"
        sx={{ mb: 2 }}
        value={timeZone}
        onChange={(e) => setTimeZone(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const FirmPortalURLSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Firm Portal URL
      </Typography>
      <TextField
        fullWidth
        label="Portal URL"
        size="small"
        sx={{ mb: 2 }}
        value={portalURL}
        onChange={(e) => setPortalURL(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const ContactNameFormattingSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Contact Name Formatting
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          value={contactNameFormat}
          onChange={(e) => setContactNameFormat(e.target.value)}
        >
          {contactNameOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const CustomDomainSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Custom Domain
      </Typography>
      <TextField
        fullWidth
        label="Custom Domain URL"
        size="small"
        sx={{ mb: 2 }}
        value={customDomain}
        onChange={(e) => setCustomDomain(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const SignaturesSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Signatures
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select
          value={signatureFormat}
          onChange={(e) => setSignatureFormat(e.target.value)}
        >
          {signatureOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const TwoFactorSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Two-Factor Authentication (2FA)
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography>Enable 2FA for login?</Typography>
        <Switch
          checked={enable2FA}
          onChange={(e) => setEnable2FA(e.target.checked)}
        />
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const DefaultAccountAccessSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Default Account Access
      </Typography>
      <TextField
        fullWidth
        label="Default access settings"
        size="small"
        sx={{ mb: 2 }}
        value={defaultAccountAccess}
        onChange={(e) => setDefaultAccountAccess(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const ChatsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Chats
      </Typography>
      <TextField
        fullWidth
        label="Chat Settings"
        size="small"
        sx={{ mb: 2 }}
        value={chatSettings}
        onChange={(e) => setChatSettings(e.target.value)}
      />
      <Box display="flex" alignItems="center" mb={2}>
        <Checkbox
          checked={allowClientCreateChat}
          onChange={(e) => setAllowClientCreateChat(e.target.checked)}
        />
        <Typography ml={1}>Allow client to create new chat</Typography>
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const EditorAccessSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Editor Access
      </Typography>
      <TextField
        fullWidth
        label="Editor Access Permissions"
        size="small"
        sx={{ mb: 2 }}
        value={editorAccess}
        onChange={(e) => setEditorAccess(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const DefaultFolderTemplateSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Default Folder Template
      </Typography>
      <TextField
        fullWidth
        label="Template Name"
        size="small"
        sx={{ mb: 2 }}
        value={defaultFolderTemplate}
        onChange={(e) => setDefaultFolderTemplate(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const SystemGeneratedEmailsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        System-Generated Emails
      </Typography>
      <Box display="flex" flexDirection="column" gap={1} mb={2}>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={systemGeneratedEmails.showFirmContactDetails}
            onChange={(e) =>
              setSystemGeneratedEmails((prev) => ({
                ...prev,
                showFirmContactDetails: e.target.checked,
              }))
            }
          />
          <Typography ml={1}>Show firm contact details</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={systemGeneratedEmails.showSocialNetworkLinks}
            onChange={(e) =>
              setSystemGeneratedEmails((prev) => ({
                ...prev,
                showSocialNetworkLinks: e.target.checked,
              }))
            }
          />
          <Typography ml={1}>Show social network links</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={systemGeneratedEmails.showFirmLogo}
            onChange={(e) =>
              setSystemGeneratedEmails((prev) => ({
                ...prev,
                showFirmLogo: e.target.checked,
              }))
            }
          />
          <Typography ml={1}>Show firm logo</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={systemGeneratedEmails.showInternalNotifications}
            onChange={(e) =>
              setSystemGeneratedEmails((prev) => ({
                ...prev,
                showInternalNotifications: e.target.checked,
              }))
            }
          />
          <Typography ml={1}>Internal notifications</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={systemGeneratedEmails.showClientNotifications}
            onChange={(e) =>
              setSystemGeneratedEmails((prev) => ({
                ...prev,
                showClientNotifications: e.target.checked,
              }))
            }
          />
          <Typography ml={1}>Client-facing notifications</Typography>
        </Box>
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const SendingLimitSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Sending Limit
      </Typography>
      <TextField
        fullWidth
        label="Daily Sending Limit"
        size="small"
        sx={{ mb: 2 }}
        value={sendingLimit}
        onChange={(e) => setSendingLimit(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const ClientPortalSettingsSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" mb={2}>
        Client Portal Settings
      </Typography>
      <TextField
        fullWidth
        label="Portal Options"
        size="small"
        sx={{ mb: 2 }}
        value={clientPortalSettings}
        onChange={(e) => setClientPortalSettings(e.target.value)}
      />
      <Box display="flex" flexDirection="column" gap={1} mb={2}>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={showDoneUploadingButton}
            onChange={(e) => setShowDoneUploadingButton(e.target.checked)}
          />
          <Typography ml={1}>Show "Done Uploading" button</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Checkbox
            checked={showDoneUploadingCheckbox}
            onChange={(e) => setShowDoneUploadingCheckbox(e.target.checked)}
          />
          <Typography ml={1}>Show "Done Uploading" checkbox</Typography>
        </Box>
      </Box>
      <TextField
        fullWidth
        label="Client Portal Announcement"
        size="small"
        sx={{ mb: 2 }}
        value={clientPortalAnnouncement}
        onChange={(e) => setClientPortalAnnouncement(e.target.value)}
      />
      <Button variant="contained">Save</Button>
    </Paper>
  );

  const ClientPortalAnnouncementSection = () => (
    <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Typography variant="h6" mb={2}>
        Client Portal Announcement
      </Typography>
      <Typography variant="body1">
        {" "}
        Announcement is visible in the client portal and mobile app upon login.
      </Typography>
      <Box
        mt={2}
        display="flex"
        alignItems="center"
        color="#135ea9"
        // marginLeft={2}
        mb={2}
      >
        <AddCircleOutlineIcon />
        <Typography variant="body1">create announcement</Typography>
      </Box>
      <Button variant="contained">Save</Button>
    </Paper>
  );

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
        mb={3}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Firm Settings
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your firm's details, preferences, and account configurations
        </Typography>
      </Box>

      {/* Grid Container */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mb: 5 }}
        >
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <ContactDetailsSection />
              <AboutUsSection />
              <FirmPortalURLSection />
              <CustomDomainSection />
              <TwoFactorSection />
              <ChatsSection />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <SocialMediaLinksSection />
              <LogoUploadSection />
              <InternationalSettingsSection />
              <ContactNameFormattingSection />
              <SignaturesSection />
              <DefaultAccountAccessSection />
              <EditorAccessSection />
              <DefaultFolderTemplateSection />
              <SystemGeneratedEmailsSection />
              <SendingLimitSection />
              <ClientPortalSettingsSection />
              <ClientPortalAnnouncementSection />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FirmSetting;
