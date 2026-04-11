import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";

import { toast } from "react-toastify";
import { organizerAPI, accountsAPI } from "../../services/api";

const SendOrganizer = forwardRef(
  ({ selectedAccounts, onClose, fetchData }, ref) => {
    const [loading, setLoading] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const [accountsList, setAccountsList] = useState([]);
    const [selectedAccountList, setSelectedAccountList] = useState([]);
  const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();
 const [sections, setSections] = useState([]);
  const [organizerName, setOrganizerName] = useState("");
    // ================= FETCH DATA =================
    useEffect(() => {
      fetchTemplates();
      fetchAccounts();
    }, []);

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await organizerAPI.getOrganizerTemplates();
        setTemplates(res.data.OrganizerTemplates || []);
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

    console.log("selected oragnizer template",selectedTemplate)

    // ================= OPTIONS =================
    const templateOptions = templates.map((t) => ({
      label: t.templatename,
      value: t._id,
    }));

    const accountOptions = accountsList.map((acc) => ({
      label: acc.accountName,
      value: acc._id,
    }));

      const handleOrganizerTemplateChange = async (event) => {
    const selectedValue = event.target.value;
    setSelectedTemplate(selectedValue);
    await fetchOrganizerTemplateDataByTempId(selectedValue);
  };
   const fetchOrganizerTemplateDataByTempId = async (
      selectedOrganizerTempid,
    ) => {
      try {
        const result = await organizerAPI.getOrganizerTemplateById(
          selectedOrganizerTempid,
        );
        console.log("Organizer Template Details:", result);
        // console.log(result.organizerTemplate.sections);
        setSelectedOrganizerTempData(result.data.organizerTemplate);
        setSections(result.data.organizerTemplate.sections);
        setOrganizerName(result.data.organizerTemplate.organizerName);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch organizer template details");
      }
    };
    // ================= SUBMIT =================
 const handleSubmit = async () => {
  try {
    if (!selectedTemplate) {
      return toast.error("Please select organizer template");
    }

    if (!selectedAccountList.length) {
      return toast.error("No accounts selected");
    }

    if (!selectedOrganizerTempData) {
      return toast.error("Template data not loaded");
    }

    setLoading(true);

    // 🔁 loop through all selected accounts
    const promises = selectedAccountList.map((acc) => {
      const requestData = {
        accountid: acc.value,
        organizertemplateid: selectedTemplate,
        organizerName: selectedOrganizerTempData?.organizerName || "",
        reminders: false,
        noofreminders: 1,
        daysuntilnextreminder: "3",
        fileUploadPath: "",

        sections:
          selectedOrganizerTempData?.sections?.map((section) => ({
            name: section?.text || "",
            id: section?.id?.toString() || "",
            text: section?.text || "",

            sectionsettings: {
              sectionRepeatingMode:
                section?.sectionsettings?.sectionRepeatingMode || false,
              buttonName:
                section?.sectionsettings?.buttonName || "Repeat Section",
              conditional: section?.sectionsettings?.conditional || false,
              conditions: section?.sectionsettings?.conditions || [],
              mode: section?.sectionsettings?.mode || "Any",
            },

            formElements:
              section?.formElements?.map((question) => ({
                type: question?.type || "",
                id: question?.id || "",
                sectionid: question?.sectionid || "",

                options:
                  question?.options?.map((option) => ({
                    id: option?.id || "",
                    text: option?.text || "",
                    selected: option?.selected || false,
                  })) || [],

                text: question?.text || "",
                textvalue: question?.textvalue || "",

                questionsectionsettings: {
                  required:
                    question?.questionsectionsettings?.required || false,
                  prefilled:
                    question?.questionsectionsettings?.prefilled || false,
                  conditional:
                    question?.questionsectionsettings?.conditional || false,
                  conditions:
                    question?.questionsectionsettings?.conditions || [],
                  descriptionEnabled:
                    question?.questionsectionsettings
                      ?.descriptionEnabled || false,
                  description:
                    question?.questionsectionsettings?.description || "",
                  mode: question?.questionsectionsettings?.mode || "Any",
                },
              })) || [],
          })) || [],

        status: "Pending",
        active: true,
      };

      return organizerAPI.createOrganizerAccountWise(requestData);
    });

    // ✅ run all API calls
    await Promise.all(promises);

    toast.success("Organizers sent successfully");

    fetchData();
    onClose();
  } catch (error) {
    console.error("Error creating organizers:", error);
    toast.error("Failed to send organizers");
  } finally {
    setLoading(false);
  }
};

    // expose submit like ManageTags
    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    // ================= UI =================
    return (
      <Box p={2}>
        {/* ACCOUNTS */}
        <Typography mb={1}>Accounts</Typography>
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
                {...getTagProps({ index })}
                key={option.value}
              />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} size="small" placeholder="Select Accounts" />
          )}
        />

        {/* TEMPLATE */}
        <Box mt={3}>
          <Typography mb={1}>Organizer Template</Typography>

          <FormControl fullWidth size="small">
            <Select
            value={selectedTemplate}
            size="small"
            sx={{ mt: 2 }}
            onChange={handleOrganizerTemplateChange}
            renderValue={(selected) => {
              const option = templateOptions.find(
                (opt) => opt.value === selected,
              );
              return option ? option.label : "";
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {templateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
        </Box>

        {/* LOADING */}
        {loading && (
          <Box mt={2} textAlign="center">
            <CircularProgress size={26} />
          </Box>
        )}

        {/* ACTION BUTTON */}
        {/* <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            Send Organizer
          </Button>
        </Box> */}
      </Box>
    );
  }
);

export default SendOrganizer;