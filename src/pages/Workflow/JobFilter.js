// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Menu,
//   MenuItem,
//   TextField,
//   Select,
//   ListItemText,
//   FormControl,
//   InputLabel,
//   Checkbox,
//   Typography,
//   IconButton,
//   Box,
//   Popover,
// } from "@mui/material";
// import { templateAPI } from "../../services/api";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import CloseIcon from "@mui/icons-material/Close";
// import MultiSelectDropdown from "../../components/MultiSelectDropdown";
// const FilterDropdown = ({ onFilterChange }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedFilters, setSelectedFilters] = useState([]);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleOptionSelect = (option) => {
//     if (!selectedFilters.includes(option)) {
//       setSelectedFilters((prev) => [...prev, option]);
//     }
//     handleClose();
//   };

//   const removeFilter = (option) => {
//     setSelectedFilters((prev) => prev.filter((item) => item !== option));
//     setClientStatus([]);
//     setAccountNameValue("");
//     setPriorityValue("");
//     setCombinedValues([]);
//     setSelectedStages({});
//     setActivePipeline(null);
//   };

//   const options = [
//     "Job assignees",
//     "Pipeline and stage",
//     "Client-facing status",
//     "Account name",
//     "Priority",
//   ];

//   const [selectedUser, setSelectedUser] = useState([]);

//   const [combinedValues, setCombinedValues] = useState([]);
//   const handleUserChange = (newSelectedUsers) => {
//     setSelectedUser(newSelectedUsers);
//     console.log(newSelectedUsers);
//     const selectedValues = newSelectedUsers.map((option) => option.label);
//     setCombinedValues(selectedValues);
//     console.log(selectedValues);
//   };
//   const [clientStatus, setClientStatus] = useState([]);
//   const [clientStatusOptions, setClientStatusOptions] = useState([]);
//  useEffect(() => {
//   const fetchClientFacingStatus = async () => {
//     try {
//       const res = await templateAPI.getAllJobStatus();
//       if (res?.data) {
//         setClientStatusOptions(res.data.clientFacingJobStatues);
//       }
//     } catch (error) {
//       console.error("Failed to fetch client-facing statuses", error);
//     }
//   };

//   fetchClientFacingStatus();
// }, []);

//   const [pipelines, setPipelines] = useState([]);
//   const [selectedStages, setSelectedStages] = useState({});
//   const [stageAnchorEl, setStageAnchorEl] = useState(null);
//   const [activePipeline, setActivePipeline] = useState(null);
//   useEffect(() => {
//   const fetchPipelines = async () => {
//     try {
//       const res = await templateAPI.getAllPipelines();
//       if (res?.data?.pipeline) {
//         setPipelines(res.data.pipeline);
//       }
//     } catch (error) {
//       console.error("Error fetching pipelines:", error);
//     }
//   };

//   fetchPipelines();
// }, []);

//   const handlePipelineClick = (event, pipeline) => {
//     setActivePipeline(pipeline);
//     setStageAnchorEl(event.currentTarget);
//   };


//   const handlePipelineCheckboxToggle = (pipeline) => {
//   const stageNames = pipeline.stages.map((stage) => stage.name);
//   const currentSelected = selectedStages[pipeline.pipelineName] || [];

//   if (currentSelected.length === stageNames.length) {
//     // If all stages are selected, remove the pipeline entirely
//     const newSelectedStages = { ...selectedStages };
//     delete newSelectedStages[pipeline.pipelineName];
//     setSelectedStages(newSelectedStages);
//   } else {
//     // Otherwise select all stages
//     setSelectedStages(prev => ({
//       ...prev,
//       [pipeline.pipelineName]: stageNames
//     }));
//   }
// };
 
//   const handleStageToggle = (pipelineName, stageName) => {
//   setSelectedStages((prev) => {
//     const current = prev[pipelineName] || [];
//     let updated;
    
//     if (current.includes(stageName)) {
//       // Remove the stage
//       updated = current.filter(name => name !== stageName);
//     } else {
//       // Add the stage
//       updated = [...current, stageName];
//     }

//     // If no stages left for this pipeline, remove the pipeline entirely
//     if (updated.length === 0) {
//       const newState = { ...prev };
//       delete newState[pipelineName];
//       return newState;
//     }

//     return { ...prev, [pipelineName]: updated };
//   });
// };

//   const [accountNameValue, setAccountNameValue] = useState("");
//   const [priorityValue, setPriorityValue] = useState("");
//   // Add this useEffect to notify parent component when filters change
//   useEffect(() => {
//     if (onFilterChange) {
//       const filters = {
//         jobAssignees: combinedValues,
//         clientStatus,
//         pipelineStages: selectedStages,
//         accountName: accountNameValue, // You'll need to add this state
//         priority: priorityValue, // You'll need to add this state
//       };
//       onFilterChange(filters);
//     }
//   }, [
//     combinedValues,
//     clientStatus,
//     selectedStages,
//     accountNameValue,
//     priorityValue,
//   ]);

//   // Add these new states

//   return (
//     <Box>
//       <Box sx={{ display: "flex" }}>
//         <Button
//   onClick={handleClick}
//   variant="outlined"
//   sx={{
//     textTransform: "none",
//     fontWeight: 500,
//     borderRadius: "10px",
//     px: 2,
//     py: 0.8,
//     backgroundColor: "#fff",
//     borderColor: "#d0d5dd",
//     color: "#344054",
//     "&:hover": {
//       backgroundColor: "#f9fafb",
//     },
//   }}
//   endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
// >
//   Filters
// </Button>

//         <Menu
//           anchorEl={anchorEl}
//           open={open}
//           onClose={handleClose}
//           PaperProps={{
//             style: {
//               width: 250,
//               maxHeight: 300,
//             },
//           }}
//         >
//           {options.map((option) => (
//             <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
//               {option}
//             </MenuItem>
//           ))}
//         </Menu>

//         {/* Render selected filters */}

//         {selectedFilters.length > 0 && (
//           <Box
//             sx={{
//               mt: 2,
//               display: "flex",
             
//               gap: 2,
//               maxHeight: "260px",
//               overflowY: "auto",
//             }}
//           >
//             {selectedFilters.map((filter) => (
//               <Box
//                 key={filter}
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   p: 2,
//                   minWidth: 240,
//                   borderRadius: 2,
//                   backgroundColor: "#ffffff",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                   position: "relative",
//                 }}
//               >
//                 {/* Filter title */}
//                 <Typography
//                   variant="subtitle2"
//                   fontWeight={600}
//                   color="text.primary"
//                   sx={{ mb: 1 }}
//                 >
//                   {filter}
//                 </Typography>

//                 {/* Filter Inputs */}
//                 {filter === "Job assignees" && (
//                   <MultiSelectDropdown
//                     value={selectedUser}
//                     onChange={handleUserChange}
//                     placeholder="Select assignees"
//                   />
//                 )}

//                 {filter === "Account name" && (
//                   <TextField
//                     size="small"
//                     placeholder="Enter account name"
//                     value={accountNameValue}
//                     onChange={(e) => setAccountNameValue(e.target.value)}
//                   />
//                 )}

//                 {filter === "Client-facing status" && (
//                   <FormControl size="small" fullWidth>
//                     <Select
//                       multiple
//                       value={clientStatus}
//                       onChange={(e) => setClientStatus(e.target.value)}
//                       renderValue={(selected) => selected.join(", ")}
//                     >
//                       {clientStatusOptions.map((status) => (
//                         <MenuItem
//                           key={status._id}
//                           value={status.clientfacingName}
//                         >
//                           <Checkbox
//                             checked={clientStatus.includes(
//                               status.clientfacingName
//                             )}
//                           />
//                           <ListItemText primary={status.clientfacingName} />
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}


//                 {filter === "Pipeline and stage" && (
//                   <Box sx={{ mt: 2 }}>
//                     {pipelines.map((pipeline) => (
//                       <Box
//                         key={pipeline._id}
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           cursor: "pointer",
//                           justifyContent: "space-between",
//                           width: "220px",
//                           p: 1,
//                           mt: 1,
//                           bgcolor: "#fff",
//                         }}
//                         onClick={(e) => handlePipelineClick(e, pipeline)}
//                       >
//                         <Checkbox
//                           checked={
//                             pipeline.stages?.length &&
//                             selectedStages[pipeline.pipelineName]?.length ===
//                               pipeline.stages.length
//                           }
//                           onClick={(e) => {
//                             e.stopPropagation(); // prevent triggering the popover
//                             handlePipelineCheckboxToggle(pipeline);
//                           }}
//                           size="small"
//                         />

//                         <Typography sx={{ fontSize: "12px" }}>
//                           {pipeline.pipelineName}
//                         </Typography>
//                         <Typography variant="caption">
//                           ({selectedStages[pipeline.pipelineName]?.length || 0}/
//                           {pipeline.stages?.length || 0})
//                         </Typography>
//                       </Box>
//                     ))}

//                     <Popover
//                       open={Boolean(stageAnchorEl)}
//                       anchorEl={stageAnchorEl}
//                       onClose={() => setStageAnchorEl(null)}
//                       anchorOrigin={{
//                         vertical: "bottom",
//                         horizontal: "right",
//                       }}
//                     >
//                       <Box sx={{ p: 2, minWidth: 200 }}>
//                         <Typography variant="subtitle2" gutterBottom>
//                           Pipeline stages
//                         </Typography>
//                         {activePipeline?.stages?.map((stage) => (
//                           <MenuItem
//                             key={stage._id}
//                             onClick={() =>
//                               handleStageToggle(
//                                 activePipeline.pipelineName,
//                                 stage.name
//                               )
//                             }
//                           >
//                             <Checkbox
//                               checked={
//                                 selectedStages[
//                                   activePipeline.pipelineName
//                                 ]?.includes(stage.name) || false
//                               }
//                               size="small"
//                             />
//                             <ListItemText
//                               primary={stage.name}
//                               sx={{ fontSize: "12px" }}
//                             />
//                           </MenuItem>
//                         ))}
//                       </Box>
//                     </Popover>
//                   </Box>
//                 )}
//                 {filter === "Priority" && (
//                   <FormControl size="small" fullWidth>
//                     <Select
//                       value={priorityValue}
//                       onChange={(e) => setPriorityValue(e.target.value)}
//                     >
//                       <MenuItem value="">All</MenuItem>
//                       <MenuItem value="High">High</MenuItem>
//                       <MenuItem value="Medium">Medium</MenuItem>
//                       <MenuItem value="Low">Low</MenuItem>
//                     </Select>
//                   </FormControl>
//                 )}

//                 {/* Remove Button */}
//                 <IconButton
//                   onClick={() => removeFilter(filter)}
//                   size="small"
//                   sx={{ position: "absolute", top: 4, right: 4 }}
//                 >
//                   <CloseIcon fontSize="small" />
//                 </IconButton>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default FilterDropdown;

import React, { useState, useEffect } from "react";
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Select,
  ListItemText,
  FormControl,
  Checkbox,
  Typography,
  IconButton,
  Box,
  Popover,
} from "@mui/material";
import { templateAPI } from "../../services/api";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CloseIcon from "@mui/icons-material/Close";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

const FilterDropdown = ({ onFilterChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const options = [
    "Job assignees",
    "Pipeline and stage",
    "Client-facing status",
    "Account name",
    "Priority",
  ];

  const handleOptionSelect = (option) => {
    if (!selectedFilters.includes(option)) {
      setSelectedFilters((prev) => [...prev, option]);
    }
    handleClose();
  };

  const removeFilter = (option) => {
    setSelectedFilters((prev) => prev.filter((item) => item !== option));
    setClientStatus([]);
    setAccountNameValue("");
    setPriorityValue("");
    setCombinedValues([]);
    setSelectedStages({});
    setActivePipeline(null);
  };

  // ===================== JOB ASSIGNEES =====================
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.label);
    setCombinedValues(selectedValues);
  };

  // ===================== CLIENT STATUS =====================
  const [clientStatus, setClientStatus] = useState([]);
  const [clientStatusOptions, setClientStatusOptions] = useState([]);

  useEffect(() => {
    const fetchClientFacingStatus = async () => {
      try {
        const res = await templateAPI.getAllJobStatus();
        if (res?.data) {
          setClientStatusOptions(res.data.clientFacingJobStatues);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchClientFacingStatus();
  }, []);

  // ===================== PIPELINES =====================
  const [pipelines, setPipelines] = useState([]);
  const [selectedStages, setSelectedStages] = useState({});
  const [stageAnchorEl, setStageAnchorEl] = useState(null);
  const [activePipeline, setActivePipeline] = useState(null);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const res = await templateAPI.getAllPipelines();
        if (res?.data?.pipeline) {
          setPipelines(res.data.pipeline);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPipelines();
  }, []);

  const handlePipelineClick = (event, pipeline) => {
    setActivePipeline(pipeline);
    setStageAnchorEl(event.currentTarget);
  };

  const handlePipelineCheckboxToggle = (pipeline) => {
    const stageNames = pipeline.stages.map((stage) => stage.name);
    const currentSelected = selectedStages[pipeline.pipelineName] || [];

    if (currentSelected.length === stageNames.length) {
      const newSelected = { ...selectedStages };
      delete newSelected[pipeline.pipelineName];
      setSelectedStages(newSelected);
    } else {
      setSelectedStages((prev) => ({
        ...prev,
        [pipeline.pipelineName]: stageNames,
      }));
    }
  };

  const handleStageToggle = (pipelineName, stageName) => {
    setSelectedStages((prev) => {
      const current = prev[pipelineName] || [];
      let updated;

      if (current.includes(stageName)) {
        updated = current.filter((s) => s !== stageName);
      } else {
        updated = [...current, stageName];
      }

      if (updated.length === 0) {
        const newState = { ...prev };
        delete newState[pipelineName];
        return newState;
      }

      return { ...prev, [pipelineName]: updated };
    });
  };

  // ===================== OTHER FILTERS =====================
  const [accountNameValue, setAccountNameValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");

  // ===================== SEND FILTER DATA =====================
  useEffect(() => {
    onFilterChange?.({
      jobAssignees: combinedValues,
      clientStatus,
      pipelineStages: selectedStages,
      accountName: accountNameValue,
      priority: priorityValue,
    });
  }, [
    combinedValues,
    clientStatus,
    selectedStages,
    accountNameValue,
    priorityValue,
  ]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={handleClick}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            px: 2.5,
            py: 1,
            backgroundColor: "#fff",
            borderColor: "#E5E7EB",
            color: "#344054",
            boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
          }}
          endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          Filters ({selectedFilters.length})
        </Button>

        {selectedFilters.length > 0 && (
          <Button
            size="small"
            onClick={() => {
              setSelectedFilters([]);
              setClientStatus([]);
              setAccountNameValue("");
              setPriorityValue("");
              setCombinedValues([]);
              setSelectedStages({});
            }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 260,
            borderRadius: "12px",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
            mt: 1,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>

      {/* Filters UI */}
      {selectedFilters.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            gap: 2,
            overflowX: "auto",
            pb: 1,
          }}
        >
          {selectedFilters.map((filter) => (
            <Box
              key={filter}
              sx={{
                p: 2,
                minWidth: 260,
                borderRadius: "16px",
                border: "1px solid #EAECF0",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 12px rgba(16,24,40,0.05)",
                position: "relative",
              }}
            >
              <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
                {filter}
              </Typography>

              {/* Job Assignees */}
              {filter === "Job assignees" && (
                <MultiSelectDropdown
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="Select assignees"
                />
              )}

              {/* Account */}
              {filter === "Account name" && (
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Enter account name"
                  value={accountNameValue}
                  onChange={(e) => setAccountNameValue(e.target.value)}
                />
              )}

              {/* Status */}
              {filter === "Client-facing status" && (
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={clientStatus}
                    onChange={(e) => setClientStatus(e.target.value)}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {clientStatusOptions.map((status) => (
                      <MenuItem
                        key={status._id}
                        value={status.clientfacingName}
                      >
                        <Checkbox
                          checked={clientStatus.includes(
                            status.clientfacingName
                          )}
                        />
                        <ListItemText primary={status.clientfacingName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Pipeline */}
              {filter === "Pipeline and stage" && (
                <Box>
                  {pipelines.map((pipeline) => (
                    <Box
                      key={pipeline._id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1,
                        borderRadius: "8px",
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#F9FAFB" },
                      }}
                      onClick={(e) => handlePipelineClick(e, pipeline)}
                    >
                      <Checkbox
                        size="small"
                        checked={
                          selectedStages[pipeline.pipelineName]?.length ===
                          pipeline.stages.length
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePipelineCheckboxToggle(pipeline);
                        }}
                      />
                      <Typography sx={{ fontSize: 13 }}>
                        {pipeline.pipelineName}
                      </Typography>
                      <Typography variant="caption">
                        ({selectedStages[pipeline.pipelineName]?.length || 0}/
                        {pipeline.stages.length})
                      </Typography>
                    </Box>
                  ))}

                  <Popover
                    open={Boolean(stageAnchorEl)}
                    anchorEl={stageAnchorEl}
                    onClose={() => setStageAnchorEl(null)}
                    PaperProps={{
                      sx: {
                        borderRadius: "12px",
                        p: 1,
                        boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box sx={{ minWidth: 200 }}>
                      {activePipeline?.stages?.map((stage) => (
                        <MenuItem
                          key={stage._id}
                          onClick={() =>
                            handleStageToggle(
                              activePipeline.pipelineName,
                              stage.name
                            )
                          }
                        >
                          <Checkbox
                            size="small"
                            checked={
                              selectedStages[
                                activePipeline.pipelineName
                              ]?.includes(stage.name) || false
                            }
                          />
                          <ListItemText primary={stage.name} />
                        </MenuItem>
                      ))}
                    </Box>
                  </Popover>
                </Box>
              )}

              {/* Priority */}
              {filter === "Priority" && (
                <FormControl fullWidth size="small">
                  <Select
                    value={priorityValue}
                    onChange={(e) => setPriorityValue(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Remove */}
              <IconButton
                onClick={() => removeFilter(filter)}
                size="small"
                sx={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  backgroundColor: "#F2F4F7",
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default FilterDropdown;
