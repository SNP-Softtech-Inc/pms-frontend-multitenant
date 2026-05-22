// import  { useState, useEffect } from "react";
// import {
//   Grid,
//   Paper,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Switch,
//   Checkbox,
//    Select,
//   MenuItem,
 
//   FormControl,
//   InputAdornment,
//   InputLabel,
// } from "@mui/material";
// import axios from "axios";
// import {
//   Facebook as FacebookIcon,
//   LinkedIn as LinkedInIcon,
//   Instagram as InstagramIcon,
//   AddCircleOutline as AddCircleOutlineIcon,
 
// } from "@mui/icons-material";
// import TwitterIcon from "@mui/icons-material/Twitter";


// const FirmSetting = () => {
//   // ------------------ States ------------------
//   // Contact details
//   const [firmName, setFirmName] = useState("");
//   const [firmEmail, setFirmEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [zipCode, setZipCode] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [website, setWebsite] = useState("");
//   const [receiveCopies, setReceiveCopies] = useState(false);

//   // Social media
//   const [facebookLink, setFacebookLink] = useState("");
//   const [linkedInLink, setLinkedInLink] = useState("");
//   const [xLink, setXLink] = useState("");
//   const [instagramLink, setInstagramLink] = useState("");

//   // About Us
//   const [description, setDescription] = useState("");
//   const [showFirmOwnerPhoto, setShowFirmOwnerPhoto] = useState(false);

//   // Logo Upload
//   const [selectedFile, setSelectedFile] = useState(null);

//   // International Settings
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [timeZone, setTimeZone] = useState("");
//   const languages = ["English", "Spanish", "French"];

//   // Firm portal & domain
//   const [portalURL, setPortalURL] = useState("");
//   const [customDomain, setCustomDomain] = useState("");

//   // Contact name formatting
//   const contactNameOptions = ["First Name Last Name", "Last Name First Name"];
//   const [contactNameFormat, setContactNameFormat] = useState(
//     contactNameOptions[0],
//   );

//   // Signatures
//   const signatureOptions = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"];
//   const [signatureFormat, setSignatureFormat] = useState(signatureOptions[0]);

//   // Two-Factor Authentication
//   const [enable2FA, setEnable2FA] = useState(false);

//   // Default account access
//   const [defaultAccountAccess, setDefaultAccountAccess] = useState("");

//   // Chats
//   const [chatSettings, setChatSettings] = useState("");
//   const [allowClientCreateChat, setAllowClientCreateChat] = useState(false);

//   // Editor access
//   const [editorAccess, setEditorAccess] = useState("");

//   // Default folder template
//   const [defaultFolderTemplate, setDefaultFolderTemplate] = useState("");

//   // System-generated emails
//   const [systemGeneratedEmails, setSystemGeneratedEmails] = useState({
//     showFirmContactDetails: false,
//     showSocialNetworkLinks: false,
//     showFirmLogo: false,
//     showInternalNotifications: false,
//     showClientNotifications: false,
//   });

//   // Sending limit
//   const [sendingLimit, setSendingLimit] = useState("");

//   // Client portal
//   const [clientPortalSettings, setClientPortalSettings] = useState("");
//   const [clientPortalAnnouncement, setClientPortalAnnouncement] = useState("");
//   const [showDoneUploadingButton, setShowDoneUploadingButton] = useState(false);
//   const [showDoneUploadingCheckbox, setShowDoneUploadingCheckbox] =
//     useState(false);

//   // States list for dropdown
//   const [states, setStates] = useState([]);
//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const res = await axios.get(
//           "https://countriesnow.space/api/v0.1/countries/states",
//         );
//         const country = res.data.data.find((c) => c.name === "United States");
//         if (country) setStates(country.states);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchStates();
//   }, []);

//   // ------------------ Handlers ------------------
//   const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
//   const handleDragOver = (e) => e.preventDefault();
//   const handleDrop = (e) => {
//     e.preventDefault();
//     setSelectedFile(e.dataTransfer.files[0]);
//   };

//   // ------------------ Section Components ------------------
//   const ContactDetailsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Contact Details
//       </Typography>
//       <TextField
//         fullWidth
//         label="Firm Name"
//         size="small"
//         sx={{ mb: 2 }}
//         value={firmName}
//         onChange={(e) => setFirmName(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         label="Firm Email"
//         size="small"
//         sx={{ mb: 2 }}
//         value={firmEmail}
//         onChange={(e) => setFirmEmail(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         label="Street Address"
//         size="small"
//         sx={{ mb: 2 }}
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//       />
//       <Grid container spacing={2} mb={2}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <TextField
//             fullWidth
//             label="City"
//             size="small"
//             value={city}
//             onChange={(e) => setCity(e.target.value)}
//           />
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <FormControl fullWidth size="small">
//             <InputLabel>State</InputLabel>
//             <Select
//               value={selectedState}
//               label="State"
//               onChange={(e) => setSelectedState(e.target.value)}
//             >
//               {states.map((state) => (
//                 <MenuItem key={state.name} value={state.name}>
//                   {state.name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//       </Grid>
//       <TextField
//         fullWidth
//         label="Zip/Postal Code"
//         size="small"
//         sx={{ mb: 2 }}
//         value={zipCode}
//         onChange={(e) => setZipCode(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         label="Phone Number"
//         size="small"
//         sx={{ mb: 2 }}
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         label="Website"
//         size="small"
//         sx={{ mb: 2 }}
//         value={website}
//         onChange={(e) => setWebsite(e.target.value)}
//       />
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography>Receive BCC of system emails?</Typography>
//         <Switch
//           checked={receiveCopies}
//           onChange={(e) => setReceiveCopies(e.target.checked)}
//         />
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const SocialMediaLinksSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Social Media Links
//       </Typography>
//       <TextField
//         fullWidth
//         label="Facebook"
//         size="small"
//         sx={{ mb: 2 }}
//         value={facebookLink}
//         onChange={(e) => setFacebookLink(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <FacebookIcon color="primary" />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <TextField
//         fullWidth
//         label="LinkedIn"
//         size="small"
//         sx={{ mb: 2 }}
//         value={linkedInLink}
//         onChange={(e) => setLinkedInLink(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <LinkedInIcon color="primary" />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <TextField
//         fullWidth
//         label="X"
//         size="small"
//         sx={{ mb: 2 }}
//         value={xLink}
//         onChange={(e) => setXLink(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <TwitterIcon color="primary" />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <TextField
//         fullWidth
//         label="Instagram"
//         size="small"
//         sx={{ mb: 2 }}
//         value={instagramLink}
//         onChange={(e) => setInstagramLink(e.target.value)}
//         InputProps={{
//           startAdornment: (
//             <InputAdornment position="start">
//               <InstagramIcon color="error" />
//             </InputAdornment>
//           ),
//         }}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const AboutUsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         About Us
//       </Typography>
//       <TextField
//         fullWidth
//         label="Description"
//         multiline
//         rows={3}
//         sx={{ mb: 2 }}
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />
//       <Box display="flex" alignItems="center" mb={2}>
//         <Checkbox
//           checked={showFirmOwnerPhoto}
//           onChange={(e) => setShowFirmOwnerPhoto(e.target.checked)}
//         />
//         <Typography ml={1}>Show firm owner photo on login page</Typography>
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const LogoUploadSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Logo Upload
//       </Typography>
//       <Box
//         sx={{ border: "2px dashed gray", p: 3, textAlign: "center", mb: 2 }}
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//       >
//         <Typography>Drag & drop logo here</Typography>
//         <Button
//           variant="contained"
//           sx={{ mt: 1 }}
//           onClick={() => document.getElementById("logoInput").click()}
//         >
//           Browse Files
//         </Button>
//         <input
//           type="file"
//           id="logoInput"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const InternationalSettingsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         International Settings
//       </Typography>
//       <TextField
//         fullWidth
//         label="Default Language"
//         size="small"
//         sx={{ mb: 2 }}
//         value={selectedLanguage}
//         onChange={(e) => setSelectedLanguage(e.target.value)}
//       />
//       <TextField
//         fullWidth
//         label="Time Zone"
//         size="small"
//         sx={{ mb: 2 }}
//         value={timeZone}
//         onChange={(e) => setTimeZone(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const FirmPortalURLSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Firm Portal URL
//       </Typography>
//       <TextField
//         fullWidth
//         label="Portal URL"
//         size="small"
//         sx={{ mb: 2 }}
//         value={portalURL}
//         onChange={(e) => setPortalURL(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const ContactNameFormattingSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Contact Name Formatting
//       </Typography>
//       <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//         <Select
//           value={contactNameFormat}
//           onChange={(e) => setContactNameFormat(e.target.value)}
//         >
//           {contactNameOptions.map((opt) => (
//             <MenuItem key={opt} value={opt}>
//               {opt}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const CustomDomainSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Custom Domain
//       </Typography>
//       <TextField
//         fullWidth
//         label="Custom Domain URL"
//         size="small"
//         sx={{ mb: 2 }}
//         value={customDomain}
//         onChange={(e) => setCustomDomain(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const SignaturesSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Signatures
//       </Typography>
//       <FormControl fullWidth size="small" sx={{ mb: 2 }}>
//         <Select
//           value={signatureFormat}
//           onChange={(e) => setSignatureFormat(e.target.value)}
//         >
//           {signatureOptions.map((opt) => (
//             <MenuItem key={opt} value={opt}>
//               {opt}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const TwoFactorSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Two-Factor Authentication (2FA)
//       </Typography>
//       <Box
//         display="flex"
//         justifyContent="space-between"
//         alignItems="center"
//         mb={2}
//       >
//         <Typography>Enable 2FA for login?</Typography>
//         <Switch
//           checked={enable2FA}
//           onChange={(e) => setEnable2FA(e.target.checked)}
//         />
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const DefaultAccountAccessSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Default Account Access
//       </Typography>
//       <TextField
//         fullWidth
//         label="Default access settings"
//         size="small"
//         sx={{ mb: 2 }}
//         value={defaultAccountAccess}
//         onChange={(e) => setDefaultAccountAccess(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const ChatsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Chats
//       </Typography>
//       <TextField
//         fullWidth
//         label="Chat Settings"
//         size="small"
//         sx={{ mb: 2 }}
//         value={chatSettings}
//         onChange={(e) => setChatSettings(e.target.value)}
//       />
//       <Box display="flex" alignItems="center" mb={2}>
//         <Checkbox
//           checked={allowClientCreateChat}
//           onChange={(e) => setAllowClientCreateChat(e.target.checked)}
//         />
//         <Typography ml={1}>Allow client to create new chat</Typography>
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const EditorAccessSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Editor Access
//       </Typography>
//       <TextField
//         fullWidth
//         label="Editor Access Permissions"
//         size="small"
//         sx={{ mb: 2 }}
//         value={editorAccess}
//         onChange={(e) => setEditorAccess(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const DefaultFolderTemplateSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Default Folder Template
//       </Typography>
//       <TextField
//         fullWidth
//         label="Template Name"
//         size="small"
//         sx={{ mb: 2 }}
//         value={defaultFolderTemplate}
//         onChange={(e) => setDefaultFolderTemplate(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const SystemGeneratedEmailsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         System-Generated Emails
//       </Typography>
//       <Box display="flex" flexDirection="column" gap={1} mb={2}>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={systemGeneratedEmails.showFirmContactDetails}
//             onChange={(e) =>
//               setSystemGeneratedEmails((prev) => ({
//                 ...prev,
//                 showFirmContactDetails: e.target.checked,
//               }))
//             }
//           />
//           <Typography ml={1}>Show firm contact details</Typography>
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={systemGeneratedEmails.showSocialNetworkLinks}
//             onChange={(e) =>
//               setSystemGeneratedEmails((prev) => ({
//                 ...prev,
//                 showSocialNetworkLinks: e.target.checked,
//               }))
//             }
//           />
//           <Typography ml={1}>Show social network links</Typography>
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={systemGeneratedEmails.showFirmLogo}
//             onChange={(e) =>
//               setSystemGeneratedEmails((prev) => ({
//                 ...prev,
//                 showFirmLogo: e.target.checked,
//               }))
//             }
//           />
//           <Typography ml={1}>Show firm logo</Typography>
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={systemGeneratedEmails.showInternalNotifications}
//             onChange={(e) =>
//               setSystemGeneratedEmails((prev) => ({
//                 ...prev,
//                 showInternalNotifications: e.target.checked,
//               }))
//             }
//           />
//           <Typography ml={1}>Internal notifications</Typography>
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={systemGeneratedEmails.showClientNotifications}
//             onChange={(e) =>
//               setSystemGeneratedEmails((prev) => ({
//                 ...prev,
//                 showClientNotifications: e.target.checked,
//               }))
//             }
//           />
//           <Typography ml={1}>Client-facing notifications</Typography>
//         </Box>
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const SendingLimitSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Sending Limit
//       </Typography>
//       <TextField
//         fullWidth
//         label="Daily Sending Limit"
//         size="small"
//         sx={{ mb: 2 }}
//         value={sendingLimit}
//         onChange={(e) => setSendingLimit(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const ClientPortalSettingsSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3 }}>
//       <Typography variant="h6" mb={2}>
//         Client Portal Settings
//       </Typography>
//       <TextField
//         fullWidth
//         label="Portal Options"
//         size="small"
//         sx={{ mb: 2 }}
//         value={clientPortalSettings}
//         onChange={(e) => setClientPortalSettings(e.target.value)}
//       />
//       <Box display="flex" flexDirection="column" gap={1} mb={2}>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={showDoneUploadingButton}
//             onChange={(e) => setShowDoneUploadingButton(e.target.checked)}
//           />
//           <Typography ml={1}>Show "Done Uploading" button</Typography>
//         </Box>
//         <Box display="flex" alignItems="center">
//           <Checkbox
//             checked={showDoneUploadingCheckbox}
//             onChange={(e) => setShowDoneUploadingCheckbox(e.target.checked)}
//           />
//           <Typography ml={1}>Show "Done Uploading" checkbox</Typography>
//         </Box>
//       </Box>
//       <TextField
//         fullWidth
//         label="Client Portal Announcement"
//         size="small"
//         sx={{ mb: 2 }}
//         value={clientPortalAnnouncement}
//         onChange={(e) => setClientPortalAnnouncement(e.target.value)}
//       />
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   const ClientPortalAnnouncementSection = () => (
//     <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
//       <Typography variant="h6" mb={2}>
//         Client Portal Announcement
//       </Typography>
//       <Typography variant="body1">
//         {" "}
//         Announcement is visible in the client portal and mobile app upon login.
//       </Typography>
//       <Box
//         mt={2}
//         display="flex"
//         alignItems="center"
//         color="#135ea9"
//         // marginLeft={2}
//         mb={2}
//       >
//         <AddCircleOutlineIcon />
//         <Typography variant="body1">create announcement</Typography>
//       </Box>
//       <Button variant="contained">Save</Button>
//     </Paper>
//   );

//   return (
//     <Box sx={{ p: 3, width: "100%" }}>
//       {/* Header */}
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         textAlign="center"
//         mb={3}
//       >
//         <Typography variant="h4" component="h1" fontWeight="bold">
//           Firm Settings
//         </Typography>
//         <Typography variant="body1" color="textSecondary">
//           Manage your firm's details, preferences, and account configurations
//         </Typography>
//       </Box>

//       {/* Grid Container */}
//       <Box sx={{ flexGrow: 1 }}>
//         <Grid
//           container
//           rowSpacing={3}
//           columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//           sx={{ mb: 5 }}
//         >
//           {/* Left Column */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box display="flex" flexDirection="column" gap={3}>
//               <ContactDetailsSection />
//               <AboutUsSection />
//               <FirmPortalURLSection />
//               <CustomDomainSection />
//               <TwoFactorSection />
//               <ChatsSection />
//             </Box>
//           </Grid>

//           {/* Right Column */}
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box display="flex" flexDirection="column" gap={3}>
//               <SocialMediaLinksSection />
//               <LogoUploadSection />
//               <InternationalSettingsSection />
//               <ContactNameFormattingSection />
//               <SignaturesSection />
//               <DefaultAccountAccessSection />
//               <EditorAccessSection />
//               <DefaultFolderTemplateSection />
//               <SystemGeneratedEmailsSection />
//               <SendingLimitSection />
//               <ClientPortalSettingsSection />
//               <ClientPortalAnnouncementSection />
//             </Box>
//           </Grid>
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default FirmSetting;

import React, { useState, useEffect } from "react";
import {
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import axios from "axios";
import ThemeSettings from "./ThemeSettings";
// Custom Switch component to match the shadcn/ui style
const Switch = ({ checked, onCheckedChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked || false}
    onClick={() => onCheckedChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
      checked ? "bg-primary" : "bg-muted-foreground/30"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

// Custom Tabs components
const Tabs = ({ defaultValue, children, className = "" }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);

const TabsTrigger = ({ value, activeTab, setActiveTab, children, className = "" }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`${className} ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-foreground"
    } transition-all`}
  >
    {children}
  </button>
);

const TabsContent = ({ value, activeTab, children, className = "" }) => {
  if (activeTab !== value) return null;
  return <div className={className}>{children}</div>;
};



// Reusable card wrapper
const SettingsCard = ({ title, children }) => (
  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
    <div className="border-b border-border px-5 py-3.5">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
    <div className="p-5 space-y-4">{children}</div>
  </div>
);

const SaveBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
  >
    Save
  </button>
);

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
  const handleButtonClick = () => {
    document.getElementById("logoInput").click();
  };

  // Helper: reusable switch component for settings
  const SettingsSwitch = ({ checked, onChange, disabled }) => (
    <Switch
      checked={checked || false}
      onCheckedChange={onChange}
      disabled={disabled}
    />
  );

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    endAdornment,
    icon: Icon,
    iconColor,
  }) => (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Icon
              className="h-4 w-4"
              style={{ color: iconColor || "currentColor" }}
            />
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`flex h-10 w-full rounded-lg border border-input bg-background text-foreground ${
            Icon ? "pl-10" : "px-3"
          } ${endAdornment ? "pr-12" : "px-3"} py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow`}
        />
        {endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {endAdornment}
          </span>
        )}
      </div>
    </div>
  );

  const SwitchRow = ({ checked, onChange, label, disabled }) => (
    <div className="flex items-center gap-3 py-1.5">
      <SettingsSwitch
        checked={checked || false}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );

  const CheckboxRow = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2.5 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border text-primary focus:ring-ring transition"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="text-xl font-semibold text-foreground mb-5">
        Firm Settings
      </h1>

      <Tabs defaultValue="firm" className="w-full">
        {/* Tab Bar */}
        <TabsList className="mb-6 h-10 w-fit gap-1 bg-muted/60 border border-border rounded-lg p-1">
          <TabsTrigger
            value="firm"
            className="text-sm px-5 rounded-md py-1.5 transition-all"
          >
            Firm
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-sm px-5 rounded-md py-1.5 transition-all"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="text-sm px-5 rounded-md py-1.5 transition-all"
          >
            Preferences
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-sm px-5 rounded-md py-1.5 transition-all"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="text-sm px-5 rounded-md py-1.5 transition-all"
          >
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* FIRM TAB */}
        <TabsContent value="firm" className="space-y-6">
          {/* Contact Details */}
          <SettingsCard title="Contact details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Firm Name"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                placeholder="Enter Your Firm Name"
              />
              <InputField
                label="Firm Email"
                value={firmEmail}
                onChange={(e) => setFirmEmail(e.target.value)}
                placeholder="Enter Your Firm Email"
              />
            </div>
            <InputField
              label="Street address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <InputField
                label="Zip/Postal code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Zip/Postal code"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Firm phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Firm phone number"
              />
              <InputField
                label="Firm Website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Firm Website"
              />
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
              <span className="text-xs text-muted-foreground flex-1">
                Receive copies (BCC) of system emails sent to clients.
              </span>
              <SettingsSwitch
                checked={receiveCopies}
                onChange={setReceiveCopies}
              />
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* About Us */}
          <SettingsCard title="About us">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description
              </label>
              <textarea
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-none"
                placeholder="Tell us about your firm..."
              />
            </div>
            <CheckboxRow
              checked={showFirmOwnerPhoto}
              onChange={setShowFirmOwnerPhoto}
              label="Show firm owner photo on the login page"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Firm Portal URL */}
          <SettingsCard title="Firm portal URL">
            <p className="text-sm text-muted-foreground">
              Your firm's portal URL:
            </p>
            <p className="text-sm font-medium text-primary">
              https://anuja.taxdome.com/
            </p>
            <p className="text-xs text-muted-foreground">
              To modify this address, please contact support.
            </p>
          </SettingsCard>

          {/* Custom Domain */}
          <SettingsCard title="Custom domain">
            <p className="text-sm text-muted-foreground">
              White-label your portal with your own domain. Before adding your
              domain, see{" "}
              <span className="text-primary cursor-pointer hover:underline">
                how to configure DNS
              </span>
              .
            </p>
            <InputField
              label="Domain name"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="Domain name"
            />
            <button className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-primary shadow-sm hover:bg-muted transition-colors">
              Link Custom Domain
            </button>
          </SettingsCard>

          {/* Social Media Links */}
          <SettingsCard title="Social media links">
            <InputField
              label="Facebook"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
              placeholder="Facebook URL"
              icon={FacebookIcon}
              iconColor="#1877f2"
            />
            <InputField
              label="LinkedIn"
              value={linkedInLink}
              onChange={(e) => setLinkedInLink(e.target.value)}
              placeholder="LinkedIn URL"
              icon={LinkedInIcon}
              iconColor="#0077b5"
            />
            <InputField
              label="X"
              value={xLink}
              onChange={(e) => setXLink(e.target.value)}
              placeholder="X URL"
              icon={TwitterIcon}
              iconColor="#000"
            />
            <InputField
              label="Instagram"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="Instagram URL"
              icon={InstagramIcon}
              iconColor="#da2b79"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Logo Upload */}
          <SettingsCard title="Logo upload">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 gap-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              <UploadIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & Drop file here
              </p>
              <button
                onClick={handleButtonClick}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
              >
                Browse Files
              </button>
              <input
                id="logoInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="mt-2 text-xs text-muted-foreground break-all">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </SettingsCard>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="space-y-6">
          {/* Two-factor Authentication */}
          <SettingsCard title="Two-factor authentication (2FA)">
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Require 2FA for all team members
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2FA will be turned on for team members at next login.
                </p>
              </div>
              <SettingsSwitch checked={enable2FA} onChange={setEnable2FA} />
            </div>
            <InputField
              label="Email address to receive manual 2FA disable requests"
              value={firmEmail}
              onChange={(e) => setFirmEmail(e.target.value)}
              placeholder="Email address"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Editor Access */}
          <SettingsCard title="Editor access">
            <InputField
              label="Editor Access Permissions"
              value={editorAccess}
              onChange={(e) => setEditorAccess(e.target.value)}
              placeholder="Editor Access Permissions"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-6">
          {/* International Settings */}
          <SettingsCard title="International settings">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Default language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              >
                <option value="">Select Language</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              label="Time Zone"
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              placeholder="Time Zone"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Contact Name Formatting */}
          <SettingsCard title="Contact name formatting">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Contact name format
              </label>
              <select
                value={contactNameFormat}
                onChange={(e) => setContactNameFormat(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              >
                {contactNameOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Signatures */}
          <SettingsCard title="Signatures">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Default date format for e-signature
              </label>
              <select
                value={signatureFormat}
                onChange={(e) => setSignatureFormat(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
              >
                {signatureOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Default Account Access */}
          <SettingsCard title="Default account access">
            <InputField
              label="Default access settings"
              value={defaultAccountAccess}
              onChange={(e) => setDefaultAccountAccess(e.target.value)}
              placeholder="Default access settings"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Default Folder Template */}
          <SettingsCard title="Default folder template">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Folder Templates
              </label>
              <select className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow">
                <option value="">Select a template</option>
              </select>
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-6">
          {/* System-generated Emails */}
          <SettingsCard title="System-generated emails">
            <div className="space-y-1 divide-y divide-border/40">
              {[
                {
                  checked: systemGeneratedEmails.showFirmContactDetails,
                  onChange: (checked) =>
                    setSystemGeneratedEmails((prev) => ({
                      ...prev,
                      showFirmContactDetails: checked,
                    })),
                  label: "Show firm contact details",
                },
                {
                  checked: systemGeneratedEmails.showSocialNetworkLinks,
                  onChange: (checked) =>
                    setSystemGeneratedEmails((prev) => ({
                      ...prev,
                      showSocialNetworkLinks: checked,
                    })),
                  label: "Show social network links",
                },
                {
                  checked: systemGeneratedEmails.showFirmLogo,
                  onChange: (checked) =>
                    setSystemGeneratedEmails((prev) => ({
                      ...prev,
                      showFirmLogo: checked,
                    })),
                  label: "Show firm logo",
                },
                {
                  checked: systemGeneratedEmails.showInternalNotifications,
                  onChange: (checked) =>
                    setSystemGeneratedEmails((prev) => ({
                      ...prev,
                      showInternalNotifications: checked,
                    })),
                  label: "Internal notifications",
                },
                {
                  checked: systemGeneratedEmails.showClientNotifications,
                  onChange: (checked) =>
                    setSystemGeneratedEmails((prev) => ({
                      ...prev,
                      showClientNotifications: checked,
                    })),
                  label: "Client-facing notifications",
                },
              ].map(({ checked, onChange, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-foreground">{label}</span>
                  <SettingsSwitch checked={checked} onChange={onChange} />
                </div>
              ))}
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Sending Limit */}
          <SettingsCard title="Sending limit">
            <InputField
              label="Emails each firm member can send (max 10,000)"
              value={sendingLimit}
              onChange={(e) => setSendingLimit(e.target.value)}
              placeholder="400"
              endAdornment="per day"
            />
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Client Portal Settings */}
          <SettingsCard title="Client portal settings">
            <div className="space-y-1 divide-y divide-border/40">
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm text-foreground">
                  Show 'Done uploading' button in interface
                </span>
                <SettingsSwitch
                  checked={showDoneUploadingButton}
                  onChange={setShowDoneUploadingButton}
                />
              </div>
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm text-foreground">
                  Show 'Done uploading' checkbox in document upload menu
                </span>
                <SettingsSwitch
                  checked={showDoneUploadingCheckbox}
                  onChange={setShowDoneUploadingCheckbox}
                />
              </div>
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Client Portal Announcement */}
          <SettingsCard title="Client portal announcement">
            <p className="text-sm text-muted-foreground">
              Announcement is visible in the client portal and mobile app upon
              login.
            </p>
            <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              <AddCircleOutlineIcon className="h-4 w-4" />
              Create announcement
            </button>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>

          {/* Chats */}
          <SettingsCard title="Chats">
            <p className="text-sm text-muted-foreground">
              You can allow clients to start new chats, or have them only
              respond to messages sent by your firm.
            </p>
            <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
              <p className="text-sm text-foreground">
                Allow clients to create new chat threads
              </p>
              <SettingsSwitch
                checked={allowClientCreateChat}
                onChange={setAllowClientCreateChat}
              />
            </div>
            <SaveBtn onClick={() => {}} />
          </SettingsCard>
        </TabsContent>

        {/* APPEARANCE TAB */}
        <TabsContent value="appearance" className="space-y-6">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FirmSetting;