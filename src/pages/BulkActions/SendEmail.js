import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import ShortcodePopover from "../../components/ShortcodePopover";
import Editor from "../../components/Editor";
import {
  Box,
  Typography,
  Autocomplete,
  Chip,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import { accountsAPI, templateAPI, authAPI } from "../../services/api";

const SendEmail = forwardRef(
  ({ selectedAccounts, onClose, fetchData }, ref) => {
    console.log("selected account",selectedAccounts)
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [accountsList, setAccountsList] = useState([]);
    const [userData, setUserData] = useState([]);
    
    const [selectedOption, setSelectedOption] = useState("contacts");
    const [inputText, setInputText] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selecteduser, setSelectedUser] = useState(null);
    const [selectedAccountList, setSelectedAccountList] = useState([]);
    // Shortcode related states
    const [shortcuts, setShortcuts] = useState([]);
    const [filteredShortcuts, setFilteredShortcuts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const textFieldRef = useRef(null);
    useEffect(() => {
      fetchTemplates();
      fetchAccounts();
    }, []);
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await templateAPI.getEmailTemplates();
        setTemplates(res.data.emailTemplate || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };
    const fetchAccounts = async () => {
      try {
        const res = await accountsAPI.getAccountNamesByStatus(true);
        const accounts =
          res.data.accounts ||
          res.data.accountlist ||
          res.data.teamAccounts ||
          [];

        setAccountsList(accounts);

        // preselect accounts (like ManageTags selectedAccounts)
        const selected = accounts
          .filter((acc) => selectedAccounts.includes(acc._id))
          .map((acc) => ({
            label: acc.accountName,
            value: acc._id,
          }));

        setSelectedAccountList(selected);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch accounts");
      }
    };
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await authAPI.getAllUsers({
            page: 1,
            limit: 50,
            status: "active",
          });

          console.log("API RESPONSE:", res.data);

          const users = res?.data?.users || [];

          if (!users.length) {
            console.warn("No users found");
          }

          const formatted = users.map((user) => ({
            value: user._id,
            label: user.username,
          }));

          console.log("FORMATTED USERS:", formatted);

          setUserData(formatted);
        } catch (err) {
          console.error("User fetch error:", err?.response || err);
        }
      };

      fetchUsers();
    }, []);
    const accountOptions = accountsList.map((acc) => ({
      label: acc.accountName,
      value: acc._id,
    }));
    const emailoptions = templates.map((temp) => ({
      label: temp.templatename,
      value: temp._id,
    }));
    // ================= SHORTCUTES HANDLERS =================
    useEffect(() => {
      if (selectedOption === "contacts") {
        const contactShortcuts = [
          { title: "Account Shortcodes", isBold: true },
          { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
          { title: "Contact Shortcodes", isBold: true },
          { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
          { title: "First Name", isBold: false, value: "FIRST_NAME" },
          { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
          { title: "Last Name", isBold: false, value: "LAST_NAME" },
          { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
          { title: "Country", isBold: false, value: "COUNTRY" },
          { title: "Company name", isBold: false, value: "COMPANY_NAME " },
          { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
          { title: "City", isBold: false, value: "CITY" },
          { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
          {
            title: "Zip/Postal code",
            isBold: false,
            value: "ZIP / POSTAL CODE",
          },
          {
            title: "Custom field:Email",
            isBold: false,
            value: "CONTACT_CUSTOM_FIELD:Email",
          },
          { title: "Date Shortcodes", isBold: true },
          {
            title: "Current day full date",
            isBold: false,
            value: "CURRENT_DAY_FULL_DATE",
          },
          {
            title: "Current day number",
            isBold: false,
            value: "CURRENT_DAY_NUMBER",
          },
          {
            title: "Current day name",
            isBold: false,
            value: "CURRENT_DAY_NAME",
          },
          { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
          {
            title: "Current month number",
            isBold: false,
            value: "CURRENT_MONTH_NUMBER",
          },
          {
            title: "Current month name",
            isBold: false,
            value: "CURRENT_MONTH_NAME",
          },
          { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
          { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
          {
            title: "Last day full date",
            isBold: false,
            value: "LAST_DAY_FULL_DATE",
          },
          { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
          { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
          { title: "Last week", isBold: false, value: "LAST_WEEK" },
          {
            title: "Last month number",
            isBold: false,
            value: "LAST_MONTH_NUMBER",
          },
          { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
          { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
          { title: "Last_year", isBold: false, value: "LAST_YEAR" },
          {
            title: "Next day full date",
            isBold: false,
            value: "NEXT_DAY_FULL_DATE",
          },
          { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
          { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
          { title: "Next week", isBold: false, value: "NEXT_WEEK" },
          {
            title: "Next month number",
            isBold: false,
            value: "NEXT_MONTH_NUMBER",
          },
          { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
          { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
          { title: "Next year", isBold: false, value: "NEXT_YEAR" },
        ];
        setShortcuts(contactShortcuts);
      } else if (selectedOption === "account") {
        const accountShortcuts = [
          { title: "Account Shortcodes", isBold: true },
          { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
          { title: "Date Shortcodes", isBold: true },
          {
            title: "Current day full date",
            isBold: false,
            value: "CURRENT_DAY_FULL_DATE",
          },
          {
            title: "Current day number",
            isBold: false,
            value: "CURRENT_DAY_NUMBER",
          },
          {
            title: "Current day name",
            isBold: false,
            value: "CURRENT_DAY_NAME",
          },
          { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
          {
            title: "Current month number",
            isBold: false,
            value: "CURRENT_MONTH_NUMBER",
          },
          {
            title: "Current month name",
            isBold: false,
            value: "CURRENT_MONTH_NAME",
          },
          { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
          { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
          {
            title: "Last day full date",
            isBold: false,
            value: "LAST_DAY_FULL_DATE",
          },
          { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
          { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
          { title: "Last week", isBold: false, value: "LAST_WEEK" },
          {
            title: "Last month number",
            isBold: false,
            value: "LAST_MONTH_NUMBER",
          },
          { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
          { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
          { title: "Last_year", isBold: false, value: "LAST_YEAR" },
          {
            title: "Next day full date",
            isBold: false,
            value: "NEXT_DAY_FULL_DATE",
          },
          { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
          { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
          { title: "Next week", isBold: false, value: "NEXT_WEEK" },
          {
            title: "Next month number",
            isBold: false,
            value: "NEXT_MONTH_NUMBER",
          },
          { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
          { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
          { title: "Next year", isBold: false, value: "NEXT_YEAR" },
        ];
        setShortcuts(accountShortcuts);
      }
    }, [selectedOption]);

    useEffect(() => {
      setFilteredShortcuts(
        shortcuts.filter((shortcut) =>
          shortcut.title.toLowerCase().includes(""),
        ),
      );
    }, [shortcuts]);
    const handleUserChange = (event, selectedOptions) => {
      setSelectedUser(selectedOptions);
    };
    const handleSubjectChange = (e) => {
      const { value, selectionStart } = e.target;
      setInputText(value);
      setCursorPosition(selectionStart);
    };
    const handleEditorChange = (content) => {
      setEmailBody(content);
    };
    const handleAddShortcut = (shortcut) => {
      setInputText((prevText) => {
        const newText =
          prevText.slice(0, cursorPosition) +
          `[${shortcut}]` +
          prevText.slice(cursorPosition);
        return newText;
      });

      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.focus();
          textFieldRef.current.setSelectionRange(
            cursorPosition + shortcut.length + 2,
            cursorPosition + shortcut.length + 2,
          );
        }
      }, 0);

      setShowDropdown(false);
    };
    const handleEmailtemp = async (event, selectedOption) => {
  try {
    setSelectedTemplate(selectedOption);

    if (!selectedOption) return;

    const id = selectedOption.value;

    const res = await templateAPI.getEmailTemplateById(id);
    const data = res.data.emailTemplate;

    console.log("TEMPLATE DATA:", data);

    // ✅ Set subject
    setInputText(data.emailsubject || "");

    // ✅ Set editor body
    setEmailBody(data.emailbody || "");
if (data.from) {
        // <-- adjust this according to your backend field
        // Find user object from userData
        const userOption = userData.find(
          (u) => u.value === data.from._id || u.value === data.from,
        );
        if (userOption) setSelectedUser(userOption);
      }
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch template details");
  }
};
const handleSubmit = async () => {
  try {
    

    if (!inputText) {
      return toast.error("Subject is required");
    }

    if (!emailBody) {
      return toast.error("Email body is empty");
    }

    if (!selecteduser) {
      return toast.error("Please select sender");
    }

    setLoading(true);

    const payload = {
      selectedAccounts: selectedAccounts, // ✅ multiple accounts
    emailtemplateid : selectedTemplate.value,
      emailsubject: inputText,
      emailbody: emailBody,
      
    };

    console.log("EMAIL PAYLOAD:", payload);

    await accountsAPI.sendBulkEmails(payload);

    toast.success("Emails sent successfully");

    // fetchData();
    onClose();
  } catch (error) {
    console.error("Email send error:", error);
    toast.error("Failed to send emails");
  } finally {
    setLoading(false);
  }
};
// expose submit like ManageTags
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));
   return (
  <Box
    p={2}
  
  >
    <Box
      
    >
    

      {/* ACCOUNTS */}
      <Box mb={2}>
        <Typography variant="body2" mb={0.5} fontWeight={500}>
          Accounts
        </Typography>
        <Autocomplete
          multiple
          options={accountOptions}
          value={selectedAccountList}
          getOptionLabel={(option) => option.label}
          onChange={(e, newValue) => setSelectedAccountList(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.label}
                size="small"
                sx={{
                  backgroundColor: "#e3f2fd",
                  fontWeight: 500,
                }}
                {...getTagProps({ index })}
                key={option.value}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder="Select Accounts"
            />
          )}
        />
      </Box>

      {/* TEMPLATE */}
      <Box mb={2}>
        <Typography variant="body2" mb={0.5} fontWeight={500}>
          Email Template
        </Typography>
        <Autocomplete
          options={emailoptions}
          size="small"
          value={selectedTemplate}
          onChange={handleEmailtemp}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value
          }
          getOptionLabel={(option) => option.label || ""}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select Template" />
          )}
        />
      </Box>

      {/* FROM */}
      <Box mb={2}>
        <Typography variant="body2" mb={0.5} fontWeight={500}>
          From
        </Typography>
        <Autocomplete
          options={userData}
          value={selecteduser}
          onChange={handleUserChange}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value
          }
          getOptionLabel={(option) => option.label || ""}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select Sender" />
          )}
        />
      </Box>

      {/* SUBJECT */}
      <Box mb={2}>
        <Typography variant="body2" mb={0.5} fontWeight={500}>
          Subject
        </Typography>
        <TextField
          fullWidth
          name="subject"
          size="small"
          onChange={handleSubjectChange}
          inputRef={textFieldRef}
          value={inputText}
          onClick={(e) => setCursorPosition(e.target.selectionStart)}
          onKeyUp={(e) => setCursorPosition(e.target.selectionStart)}
          placeholder="Enter subject"
        />
      </Box>

      {/* SHORTCODE */}
      <Box mb={2}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2,
          }}
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
            setShowDropdown(true);
          }}
        >
          + Add Shortcode
        </Button>

        <ShortcodePopover
          open={showDropdown}
          anchorEl={anchorEl}
          onClose={() => setShowDropdown(false)}
          shortcuts={filteredShortcuts}
          onSelectShortcut={(value) => handleAddShortcut(value)}
        />
      </Box>

      {/* EDITOR */}
      <Box>       
          <Editor onChange={handleEditorChange} value={emailBody} />
        
      </Box>

      
    </Box>
  </Box>
);
  },
);

export default SendEmail;
