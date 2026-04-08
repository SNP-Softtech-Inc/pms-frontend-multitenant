// import React, { useEffect, useState, useMemo } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   TextField,
//   InputLabel,
//   Button,
//   Switch,
//   FormControlLabel,
//   Autocomplete,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import { toast } from "react-toastify";
// import { jobAPI } from "../../services/api";
// import Priority from "../../components/Priority";
// import Editor from "../../components/Editor";
// import MultiSelectDropdown from "../../components/MultiSelectDropdown";
// import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown"
// const EditJobDrawer = ({ open, onClose, jobId }) => {
//   const queryClient = useQueryClient();

//   // ================= STATE =================
//   const [jobName, setJobName] = useState("");
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [selectedPipeline, setSelectedPipeline] = useState(null);
//   const [selectedStage, setSelectedStage] = useState(null);
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [priority, setPriority] = useState("");
//   const [description, setDescription] = useState("");
// const [tagsList, setTagsList]=useState([]);
// const [accountTags, setAccountTags]=useState([])
//   const [startDate, setStartDate] = useState(null);
//   const [dueDate, setDueDate] = useState(null);

//   const [clientFacingStatus, setClientFacingStatus] = useState(false);
//   const [clientJobName, setClientJobName] = useState("");
//   const [clientDescription, setClientDescription] = useState("");

//   // ================= FETCH =================
//   const { data } = useQuery({
//     queryKey: ["job-detail", jobId],
//     queryFn: () => jobAPI.getJobDetail(jobId),
//     enabled: !!jobId && open,
//   });



//   // ================= PREFILL =================
//   useEffect(() => {
//     if (data) {
//    const job = data?.data?.job 
// console.log("job list for thr drawer",data)
//       // Job Name
//       setJobName(job?.jobname || "");

//       // Account
//       setSelectedAccount(job?.accounts?.[0]?.accountName || "");

//       // Pipeline
//       setSelectedPipeline({
//         label: job?.pipeline?.pipelineName,
//         value: job?.pipeline?._id,
//       });

//       // Stage (from stageid)
//       const stageObj = job?.pipeline?.stages?.find(
//         (s) => s._id === job.stageid
//       );

//       setSelectedStage(
//         stageObj
//           ? { label: stageObj.name, value: stageObj._id }
//           : null
//       );

//       // Assignees
//       setSelectedUser(
//         job?.jobassignees?.map((u) => ({
//           label: u.username,
//           value: u._id,
//         })) || []
//       );

//       // Priority
//       setPriority(job?.priority || "");

//       // Description
//       setDescription(job?.description || "");

//       // Dates
//       setStartDate(job?.startdate ? dayjs(job.startdate) : null);
//       setDueDate(job?.enddate ? dayjs(job.enddate) : null);

//       // Client Facing
//       setClientFacingStatus(job?.showinclientportal || false);
//       setClientJobName(job?.jobnameforclient || "");
//       setClientDescription(job?.clientfacingDescription || "");

//         // TAGS (FIXED)
// if (job?.accounts?.[0]?.tags?.length) {
//   // remove duplicates
//   const uniqueTags = [
//     ...new Map(
//       job.accounts[0].tags.map((tag) => [tag._id, tag])
//     ).values(),
//   ];

//   const tagsData = uniqueTags.map((tag) => ({
//     value: tag._id,
//     label: tag.tagName,
//     colour: tag.tagColour,
//   }));

//   setTagsList(tagsData);
//   setAccountTags(tagsData.map((t) => t.value));
// }
//     }
//   }, [data]);
//   const handleTagsChange = (tags) => {
//     setTagsList(tags); // UI (chips)
//     setAccountTags(tags.map((t) => t.value)); // payload (ids)
//   };
//   // ================= UPDATE =================
//   const updateMutation = useMutation({
//     mutationFn: (payload) => jobAPI.updateJob(jobId, payload),
//     onSuccess: () => {
//       toast.success("Job updated successfully");
//       queryClient.invalidateQueries(["jobs-all"]);
//       onClose();
//     },
//   });

//   const handleSave = () => {
//     const payload = {
//       jobname: jobName,
//       jobassignees: selectedUser.map((u) => u.value),
//       priority,
//       description,
//       stageid: selectedStage?.value,
//       startdate: startDate,
//       enddate: dueDate,
//       showinclientportal: clientFacingStatus,
//       jobnameforclient: clientJobName,
//       clientfacingDescription: clientDescription,
//     };

//     updateMutation.mutate(payload);
//   };

//   // ================= UI =================
//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={onClose}
//         PaperProps={{
//           sx: {
//             width: 500,
//             maxWidth: "100%",
//             borderRadius: "10px 0 0 10px",
//           },
//         }}
//       >
//         {/* HEADER */}
//         <Box p={2} display="flex" justifyContent="space-between">
//           <Typography fontWeight="bold">Edit Job</Typography>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <Divider />

//         {/* BODY */}
//         <Box p={2} sx={{ overflowY: "auto", height: "85vh" }}>
//           {/* Account */}
//           <InputLabel>Account</InputLabel>
//           <TextField value={selectedAccount} fullWidth size="small" disabled />

//           {/* Job Name */}
//           <InputLabel sx={{ mt: 2 }}>Job Name</InputLabel>
//           <TextField
//             value={jobName}
//             onChange={(e) => setJobName(e.target.value)}
//             fullWidth
//             size="small"
//           />

//           {/* Pipeline */}
//           <InputLabel sx={{ mt: 2 }}>Pipeline</InputLabel>
//           <TextField
//             value={selectedPipeline?.label || ""}
//             fullWidth
//             size="small"
//             disabled
//           />

//           {/* Stage */}
//           <InputLabel sx={{ mt: 2 }}>Stage</InputLabel>
//           <TextField
//           value={selectedStage?.label || ""}
//           fullWidth
//           size="small"
//           disabled
//           />

//  <TagsMultiSelectDropDown
//                           value={tagsList}
//                           onChange={handleTagsChange}
//                           placeholder="Select Tags"
//                         />
//           {/* Assignees */}
//           <Box mt={2}>
//             <MultiSelectDropdown
//               value={selectedUser}
//               onChange={setSelectedUser}
//             />
//           </Box>

//           {/* Priority */}
//           <Box mt={2}>
//             <Priority
//               selectedPriority={priority}
//               onPriorityChange={setPriority}
//             />
//           </Box>

//           {/* Dates */}
//           <Box mt={2}>
//             <InputLabel>Start Date</InputLabel>
//             <DatePicker
//               value={startDate}
//               onChange={setStartDate}
//               slotProps={{ textField: { size: "small", fullWidth: true } }}
//             />
//           </Box>

//           <Box mt={2}>
//             <InputLabel>Due Date</InputLabel>
//             <DatePicker
//               value={dueDate}
//               onChange={setDueDate}
//               slotProps={{ textField: { size: "small", fullWidth: true } }}
//             />
//           </Box>

//           {/* Description */}
//           <Box mt={2}>
//             <Editor value={description} onChange={setDescription} />
//           </Box>

//           {/* CLIENT FACING */}
//           <Box mt={3}>
//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={clientFacingStatus}
//                   onChange={(e) =>
//                     setClientFacingStatus(e.target.checked)
//                   }
//                 />
//               }
//               label="Client Facing"
//             />

//             {clientFacingStatus && (
//               <>
//                 <TextField
//                   label="Client Job Name"
//                   value={clientJobName}
//                   onChange={(e) => setClientJobName(e.target.value)}
//                   fullWidth
//                   size="small"
//                   sx={{ mt: 2 }}
//                 />

//                 <TextField
//                   label="Client Description"
//                   value={clientDescription}
//                   onChange={(e) =>
//                     setClientDescription(e.target.value)
//                   }
//                   fullWidth
//                   multiline
//                   rows={3}
//                   size="small"
//                   sx={{ mt: 2 }}
//                 />
//               </>
//             )}
//           </Box>

//           {/* ACTIONS */}
//           <Box mt={4} display="flex" gap={2}>
//             <Button variant="contained" onClick={handleSave}>
//               Save
//             </Button>
//             <Button variant="outlined" onClick={onClose}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </LocalizationProvider>
//   );
// };

// export default EditJobDrawer;


import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputLabel,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { jobAPI, accountsAPI } from "../../services/api"; // ✅ UPDATED
import Priority from "../../components/Priority";
import Editor from "../../components/Editor";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import TagsMultiSelectDropDown from "../../components/TagsMultiSelectDropDown";

const EditJobDrawer = ({ open, onClose, jobId }) => {
  const queryClient = useQueryClient();

  // ================= STATE =================
  const [jobName, setJobName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");

  const [tagsList, setTagsList] = useState([]);
  const [accountTags, setAccountTags] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);

  const [clientFacingStatus, setClientFacingStatus] = useState(false);
  const [clientJobName, setClientJobName] = useState("");
  const [clientDescription, setClientDescription] = useState("");

  // ================= FETCH =================
  const { data } = useQuery({
    queryKey: ["job-detail", jobId],
    queryFn: () => jobAPI.getJobDetail(jobId),
    enabled: !!jobId && open,
  });

  // ================= PREFILL =================
  useEffect(() => {
    if (data) {
      const job = data?.data?.job;

      // Job Name
      setJobName(job?.jobname || "");

      // Account
      setSelectedAccount(job?.accounts?.[0]?.accountName || "");

      // Pipeline
      setSelectedPipeline({
        label: job?.pipeline?.pipelineName,
        value: job?.pipeline?._id,
      });

      // Stage
      const stageObj = job?.pipeline?.stages?.find(
        (s) => s._id === job.stageid
      );

      setSelectedStage(
        stageObj
          ? { label: stageObj.name, value: stageObj._id }
          : null
      );

      // Assignees
      setSelectedUser(
        job?.jobassignees?.map((u) => ({
          label: u.username,
          value: u._id,
        })) || []
      );

      // Priority
      setPriority(job?.priority || "");

      // Description
      setDescription(job?.description || "");

      // Dates
      setStartDate(job?.startdate ? dayjs(job.startdate) : null);
      setDueDate(job?.enddate ? dayjs(job.enddate) : null);

      // Client Facing
      setClientFacingStatus(job?.showinclientportal || false);
      setClientJobName(job?.jobnameforclient || "");
      setClientDescription(job?.clientfacingDescription || "");

      // TAGS
      if (job?.accounts?.[0]?.tags?.length) {
        const uniqueTags = [
          ...new Map(
            job.accounts[0].tags.map((tag) => [tag._id, tag])
          ).values(),
        ];

        const tagsData = uniqueTags.map((tag) => ({
          value: tag._id,
          label: tag.tagName,
          colour: tag.tagColour,
        }));

        setTagsList(tagsData);
        setAccountTags(tagsData.map((t) => t.value));
      }
    }
  }, [data]);

  const handleTagsChange = (tags) => {
    setTagsList(tags);
    setAccountTags(tags.map((t) => t.value));
  };

  // ================= UPDATE =================
  const updateMutation = useMutation({
    mutationFn: (payload) => jobAPI.updateJob(jobId, payload),
  });

  // ✅ NEW: Tags update mutation
  const updateTagsMutation = useMutation({
    mutationFn: (payload) => accountsAPI.assignBulkTags(payload),
  });

  const handleSave = async () => {
    try {
      const payload = {
        jobname: jobName,
        jobassignees: selectedUser.map((u) => u.value),
        priority,
        description,
        stageid: selectedStage?.value,
        startdate: startDate,
        enddate: dueDate,
        showinclientportal: clientFacingStatus,
        jobnameforclient: clientJobName,
        clientfacingDescription: clientDescription,
      };

      // 1️⃣ Update Job
      await updateMutation.mutateAsync(payload);

      // 2️⃣ Update Account Tags
      if (accountTags?.length && data?.data?.job?.accounts?.length) {
        const selectedAccounts = data.data.job.accounts.map(
          (a) => a._id
        );

        await updateTagsMutation.mutateAsync({
          accounts: selectedAccounts,
          tags: accountTags,
        });
      }

      toast.success("Job updated successfully");
      queryClient.invalidateQueries(["jobs-all"]);
      queryClient.invalidateQueries(["accounts-all"]);

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // ================= UI =================
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: 500,
            maxWidth: "100%",
            borderRadius: "10px 0 0 10px",
          },
        }}
      >
        {/* HEADER */}
        <Box p={2} display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Edit Job</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* BODY */}
        <Box p={2} sx={{ overflowY: "auto", height: "85vh" }}>
          <InputLabel>Account</InputLabel>
          <TextField value={selectedAccount} fullWidth size="small" disabled />

          <InputLabel sx={{ mt: 2 }}>Job Name</InputLabel>
          <TextField
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            fullWidth
            size="small"
          />

          <InputLabel sx={{ mt: 2 }}>Pipeline</InputLabel>
          <TextField
            value={selectedPipeline?.label || ""}
            fullWidth
            size="small"
            disabled
          />

          <InputLabel sx={{ mt: 2 }}>Stage</InputLabel>
          <TextField
            value={selectedStage?.label || ""}
            fullWidth
            size="small"
            disabled
          />

          <TagsMultiSelectDropDown
            value={tagsList}
            onChange={handleTagsChange}
            placeholder="Select Tags"
          />

          <Box mt={2}>
            <MultiSelectDropdown
              value={selectedUser}
              onChange={setSelectedUser}
            />
          </Box>

          <Box mt={2}>
            <Priority
              selectedPriority={priority}
              onPriorityChange={setPriority}
            />
          </Box>

          <Box mt={2}>
            <InputLabel>Start Date</InputLabel>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>

          <Box mt={2}>
            <InputLabel>Due Date</InputLabel>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </Box>

          <Box mt={2}>
            <Editor value={description} onChange={setDescription} />
          </Box>

          <Box mt={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={clientFacingStatus}
                  onChange={(e) =>
                    setClientFacingStatus(e.target.checked)
                  }
                />
              }
              label="Client Facing"
            />

            {clientFacingStatus && (
              <>
                <TextField
                  label="Client Job Name"
                  value={clientJobName}
                  onChange={(e) => setClientJobName(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mt: 2 }}
                />

                <TextField
                  label="Client Description"
                  value={clientDescription}
                  onChange={(e) =>
                    setClientDescription(e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </Box>

          <Box mt={4} display="flex" gap={2}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </LocalizationProvider>
  );
};

export default EditJobDrawer;