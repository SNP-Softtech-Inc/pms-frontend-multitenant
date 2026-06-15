// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   forwardRef,
//   useImperativeHandle,
// } from "react";

// import {
//   Box,
//   Typography,
//   Select,
//   MenuItem,
//   FormControl,
//   Chip,
//   CircularProgress,
//   Autocomplete,
//   TextField,
//   Button,
// } from "@mui/material";

// import { toast } from "react-toastify";
// import { organizerAPI, accountsAPI } from "../../services/api";

// const SendOrganizer = forwardRef(
//   ({ selectedAccounts, onClose, fetchData }, ref) => {
//     const [loading, setLoading] = useState(false);
//     const [templates, setTemplates] = useState([]);
//     const [selectedTemplate, setSelectedTemplate] = useState("");
//     const [accountsList, setAccountsList] = useState([]);
//     const [selectedAccountList, setSelectedAccountList] = useState([]);
//   const [selectedOrganizerTempData, setSelectedOrganizerTempData] = useState();
//  const [sections, setSections] = useState([]);
//   const [organizerName, setOrganizerName] = useState("");
//     // ================= FETCH DATA =================
//     useEffect(() => {
//       fetchTemplates();
//       fetchAccounts();
//     }, []);

//     const fetchTemplates = async () => {
//       try {
//         setLoading(true);
//         const res = await organizerAPI.getOrganizerTemplates();
//         setTemplates(res.data.OrganizerTemplates || []);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch templates");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchAccounts = async () => {
//       try {
//         const res = await accountsAPI.getAccountNamesByStatus(true);
//         const accounts =
//           res.data.accounts ||
//           res.data.accountlist ||
//           res.data.teamAccounts ||
//           [];

//         setAccountsList(accounts);

//         // preselect accounts (like ManageTags selectedAccounts)
//         const selected = accounts
//           .filter((acc) => selectedAccounts.includes(acc._id))
//           .map((acc) => ({
//             label: acc.accountName,
//             value: acc._id,
//           }));

//         setSelectedAccountList(selected);
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch accounts");
//       }
//     };

//     console.log("selected oragnizer template",selectedTemplate)

//     // ================= OPTIONS =================
//     const templateOptions = templates.map((t) => ({
//       label: t.templatename,
//       value: t._id,
//     }));

//     const accountOptions = accountsList.map((acc) => ({
//       label: acc.accountName,
//       value: acc._id,
//     }));

//       const handleOrganizerTemplateChange = async (event) => {
//     const selectedValue = event.target.value;
//     setSelectedTemplate(selectedValue);
//     await fetchOrganizerTemplateDataByTempId(selectedValue);
//   };
//    const fetchOrganizerTemplateDataByTempId = async (
//       selectedOrganizerTempid,
//     ) => {
//       try {
//         const result = await organizerAPI.getOrganizerTemplateById(
//           selectedOrganizerTempid,
//         );
//         console.log("Organizer Template Details:", result);
//         // console.log(result.organizerTemplate.sections);
//         setSelectedOrganizerTempData(result.data.organizerTemplate);
//         setSections(result.data.organizerTemplate.sections);
//         setOrganizerName(result.data.organizerTemplate.organizerName);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to fetch organizer template details");
//       }
//     };
//     // ================= SUBMIT =================
//  const handleSubmit = async () => {
//   try {
//     if (!selectedTemplate) {
//       return toast.error("Please select organizer template");
//     }

//     if (!selectedAccountList.length) {
//       return toast.error("No accounts selected");
//     }

//     if (!selectedOrganizerTempData) {
//       return toast.error("Template data not loaded");
//     }

//     setLoading(true);

//     // 🔁 loop through all selected accounts
//     const promises = selectedAccountList.map((acc) => {
//       const requestData = {
//         accountid: acc.value,
//         organizertemplateid: selectedTemplate,
//         organizerName: selectedOrganizerTempData?.organizerName || "",
//         reminders: false,
//         noofreminders: 1,
//         daysuntilnextreminder: "3",
//         fileUploadPath: "",

//         sections:
//           selectedOrganizerTempData?.sections?.map((section) => ({
//             name: section?.text || "",
//             id: section?.id?.toString() || "",
//             text: section?.text || "",

//             sectionsettings: {
//               sectionRepeatingMode:
//                 section?.sectionsettings?.sectionRepeatingMode || false,
//               buttonName:
//                 section?.sectionsettings?.buttonName || "Repeat Section",
//               conditional: section?.sectionsettings?.conditional || false,
//               conditions: section?.sectionsettings?.conditions || [],
//               mode: section?.sectionsettings?.mode || "Any",
//             },

//             formElements:
//               section?.formElements?.map((question) => ({
//                 type: question?.type || "",
//                 id: question?.id || "",
//                 sectionid: question?.sectionid || "",

//                 options:
//                   question?.options?.map((option) => ({
//                     id: option?.id || "",
//                     text: option?.text || "",
//                     selected: option?.selected || false,
//                   })) || [],

//                 text: question?.text || "",
//                 textvalue: question?.textvalue || "",

//                 questionsectionsettings: {
//                   required:
//                     question?.questionsectionsettings?.required || false,
//                   prefilled:
//                     question?.questionsectionsettings?.prefilled || false,
//                   conditional:
//                     question?.questionsectionsettings?.conditional || false,
//                   conditions:
//                     question?.questionsectionsettings?.conditions || [],
//                   descriptionEnabled:
//                     question?.questionsectionsettings
//                       ?.descriptionEnabled || false,
//                   description:
//                     question?.questionsectionsettings?.description || "",
//                   mode: question?.questionsectionsettings?.mode || "Any",
//                 },
//               })) || [],
//           })) || [],

//         status: "Pending",
//         active: true,
//       };

//       return organizerAPI.createOrganizerAccountWise(requestData);
//     });

//     // ✅ run all API calls
//     await Promise.all(promises);

//     toast.success("Organizers sent successfully");

//     fetchData();
//     onClose();
//   } catch (error) {
//     console.error("Error creating organizers:", error);
//     toast.error("Failed to send organizers");
//   } finally {
//     setLoading(false);
//   }
// };

//     // expose submit like ManageTags
//     useImperativeHandle(ref, () => ({
//       submit: handleSubmit,
//     }));

//     // ================= UI =================
//     return (
//       <Box p={2}>
//         {/* ACCOUNTS */}
//         <Typography mb={1}>Accounts</Typography>
//         <Autocomplete
//           multiple
//           options={accountOptions}
//           value={selectedAccountList}
//           getOptionLabel={(option) => option.label}
//           onChange={(e, newValue) => setSelectedAccountList(newValue)}
//           renderTags={(value, getTagProps) =>
//             value.map((option, index) => (
//               <Chip
//                 label={option.label}
//                 {...getTagProps({ index })}
//                 key={option.value}
//               />
//             ))
//           }
//           renderInput={(params) => (
//             <TextField {...params} size="small" placeholder="Select Accounts" />
//           )}
//         />

//         {/* TEMPLATE */}
//         <Box mt={3}>
//           <Typography mb={1}>Organizer Template</Typography>

//           <FormControl fullWidth size="small">
//             <Select
//             value={selectedTemplate}
//             size="small"
//             sx={{ mt: 2 }}
//             onChange={handleOrganizerTemplateChange}
//             renderValue={(selected) => {
//               const option = templateOptions.find(
//                 (opt) => opt.value === selected,
//               );
//               return option ? option.label : "";
//             }}
//           >
//             <MenuItem value="">
//               <em>None</em>
//             </MenuItem>
//             {templateOptions.map((option) => (
//               <MenuItem key={option.value} value={option.value}>
//                 {option.label}
//               </MenuItem>
//             ))}
//           </Select>
//           </FormControl>
//         </Box>

//         {/* LOADING */}
//         {loading && (
//           <Box mt={2} textAlign="center">
//             <CircularProgress size={26} />
//           </Box>
//         )}

//         {/* ACTION BUTTON */}
//         {/* <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
//           <Button variant="outlined" onClick={onClose}>
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             Send Organizer
//           </Button>
//         </Box> */}
//       </Box>
//     );
//   }
// );

// export default SendOrganizer;


import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

import { useToastContext } from "../../context/ToastContext";
import { organizerAPI, accountsAPI } from "../../services/api";

import AccountMultiSelectDropdown from "../../components/AccountMultiSelectDropdown";

// ✅ shadcn UI
import { Label } from "../../components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";

import { Loader2 } from "lucide-react";

const SendOrganizer = forwardRef(
  ({ selectedAccounts, onClose, fetchData }, ref) => {
    const [loading, setLoading] = useState(false);
const { showToast } = useToastContext();
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState("");

    const [selectedaccount, setSelectedaccount] = useState([]);

    const [selectedOrganizerTempData, setSelectedOrganizerTempData] =
      useState(null);

    const [sections, setSections] = useState([]);
    const [organizerName, setOrganizerName] = useState("");

    // ================= FETCH =================
    useEffect(() => {
      fetchTemplates();
    
    }, []);

    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await organizerAPI.getOrganizerTemplates();
        setTemplates(res.data.OrganizerTemplates || []);
      } catch (err) {
        showToast({
          title: "Failed to fetch templates",
          description: "An error occurred while fetching templates.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

   

    // ================= TEMPLATE =================
    const handleOrganizerTemplateChange = async (value) => {
      setSelectedTemplate(value);
      await fetchOrganizerTemplateDataByTempId(value);
    };

    const fetchOrganizerTemplateDataByTempId = async (id) => {
      try {
        const result = await organizerAPI.getOrganizerTemplateById(id);

        const data = result.data.organizerTemplate;

        setSelectedOrganizerTempData(data);
        setSections(data.sections);
        setOrganizerName(data.organizerName);
      } catch (error) {
        showToast({
          title: "Failed to fetch organizer template details",
          description: "An error occurred while fetching the organizer template details.",
          type: "error",
        });
      }
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
      try {
        if (!selectedTemplate)
          return showToast({
            title: "Select organizer template",
            description: "Please select an organizer template.",
            type: "error",
          });

        if (!selectedaccount.length)
          return showToast({
            title: "No accounts selected",
            description: "Please select at least one account.",
            type: "error",
          });

        if (!selectedOrganizerTempData)
          return showToast({
            title: "Template data not loaded",
            description: "An error occurred while loading the template data.",
            type: "error",
          });

        setLoading(true);

        const promises = selectedaccount.map((account) => {
          const requestData = {
            // accountid: accountId,
            accountid: account?.value || account, 
            organizertemplateid: selectedTemplate,
            organizerName:
              selectedOrganizerTempData?.organizerName || "",
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
                    section?.sectionsettings?.buttonName ||
                    "Repeat Section",
                  conditional:
                    section?.sectionsettings?.conditional || false,
                  conditions:
                    section?.sectionsettings?.conditions || [],
                  mode: section?.sectionsettings?.mode || "Any",
                },

                formElements:
                  section?.formElements?.map((q) => ({
                    type: q?.type || "",
                    id: q?.id || "",
                    sectionid: q?.sectionid || "",

                    options:
                      q?.options?.map((opt) => ({
                        id: opt?.id || "",
                        text: opt?.text || "",
                        selected: opt?.selected || false,
                      })) || [],

                    text: q?.text || "",
                    textvalue: q?.textvalue || "",

                    questionsectionsettings: {
                      required:
                        q?.questionsectionsettings?.required || false,
                      prefilled:
                        q?.questionsectionsettings?.prefilled || false,
                      conditional:
                        q?.questionsectionsettings?.conditional || false,
                      conditions:
                        q?.questionsectionsettings?.conditions || [],
                      descriptionEnabled:
                        q?.questionsectionsettings?.descriptionEnabled ||
                        false,
                      description:
                        q?.questionsectionsettings?.description || "",
                      mode:
                        q?.questionsectionsettings?.mode || "Any",
                    },
                  })) || [],
              })) || [],

            status: "Pending",
            active: true,
          };

          return organizerAPI.createOrganizerAccountWise(requestData);
        });

        await Promise.all(promises);

        showToast({
          title: "Organizers sent successfully",
          description: "The selected organizers have been sent successfully.",
          type: "success",
        });

        fetchData();
        onClose();
      } catch (error) {
        showToast({
          title: "Failed to send organizers",
          description: "An error occurred while sending the organizers.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: handleSubmit,
    }));

    // ================= UI =================
    // return (
    //   <div className="space-y-4 p-4">

    //     {/* ACCOUNTS */}
    //     <div className="space-y-1">
    //       <Label>Accounts</Label>
    //       <AccountMultiSelectDropdown
    //         value={selectedaccount}
    //         onChange={setSelectedaccount}
    //       />
    //     </div>

    //     {/* TEMPLATE */}
    //     <div className="space-y-1">
    //       <Label>Organizer Template</Label>

    //       <Select
    //         value={selectedTemplate}
    //         onValueChange={handleOrganizerTemplateChange}
    //       >
    //         <SelectTrigger>
    //           <SelectValue placeholder="Select Template" />
    //         </SelectTrigger>

    //         <SelectContent>
    //           {templates.map((t) => (
    //             <SelectItem key={t._id} value={t._id}>
    //               {t.templatename}
    //             </SelectItem>
    //           ))}
    //         </SelectContent>
    //       </Select>
    //     </div>

    //     {/* LOADING */}
    //     {loading && (
    //       <div className="flex justify-center">
    //         <Loader2 className="h-5 w-5 animate-spin" />
    //       </div>
    //     )}

    //   </div>
    // );
    return (
  <div className="space-y-5 p-5 bg-background text-foreground">
    
    {/* ACCOUNTS */}
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        Accounts
      </Label>

      <div className="rounded-xl border border-border bg-card p-1 transition-colors">
        <AccountMultiSelectDropdown
          value={selectedaccount}
          onChange={setSelectedaccount}
        />
      </div>
    </div>

    {/* TEMPLATE */}
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">
        Organizer Template
      </Label>

      <Select
        value={selectedTemplate}
        onValueChange={
          handleOrganizerTemplateChange
        }
      >
        <SelectTrigger
          className="
            w-full
            border-border
            bg-card
            text-foreground
            hover:bg-accent/40
            focus:ring-2
            focus:ring-ring
            focus:ring-offset-0
            transition-colors
          "
        >
          <SelectValue placeholder="Select Template" />
        </SelectTrigger>

        <SelectContent
          className="
            border-border
            bg-popover
            text-popover-foreground
          "
        >
          {templates.map((t) => (
            <SelectItem
              key={t._id}
              value={t._id}
              className="
                focus:bg-accent
                focus:text-accent-foreground
              "
            >
              {t.templatename}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    {/* LOADING */}
    {loading && (
      <div className="flex items-center justify-center py-4">
        <div
          className="
            flex items-center gap-2
            rounded-lg
            border border-border
            bg-card
            px-4 py-2
            text-sm text-muted-foreground
            shadow-sm
          "
        >
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading templates...
        </div>
      </div>
    )}
  </div>
);
  }
);

export default SendOrganizer;