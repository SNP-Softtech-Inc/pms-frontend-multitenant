

// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Menu,
//   MenuItem,
//   TextField,
//   Select,
//   ListItemText,
//   FormControl,
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

//   const options = [
//     "Job assignees",
//     "Pipeline and stage",
//     "Client-facing status",
//     "Account name",
//     "Priority",
//   ];

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

//   // ===================== JOB ASSIGNEES =====================
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);

//   const handleUserChange = (newSelectedUsers) => {
//     setSelectedUser(newSelectedUsers);
//     const selectedValues = newSelectedUsers.map((option) => option.label);
//     setCombinedValues(selectedValues);
//   };

//   // ===================== CLIENT STATUS =====================
//   const [clientStatus, setClientStatus] = useState([]);
//   const [clientStatusOptions, setClientStatusOptions] = useState([]);

//   useEffect(() => {
//     const fetchClientFacingStatus = async () => {
//       try {
//         const res = await templateAPI.getAllJobStatus();
//         if (res?.data) {
//           setClientStatusOptions(res.data.clientFacingJobStatues);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchClientFacingStatus();
//   }, []);

//   // ===================== PIPELINES =====================
//   const [pipelines, setPipelines] = useState([]);
//   const [selectedStages, setSelectedStages] = useState({});
//   const [stageAnchorEl, setStageAnchorEl] = useState(null);
//   const [activePipeline, setActivePipeline] = useState(null);

//   useEffect(() => {
//     const fetchPipelines = async () => {
//       try {
//         const res = await templateAPI.getAllPipelines();
//         if (res?.data?.pipeline) {
//           setPipelines(res.data.pipeline);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchPipelines();
//   }, []);

//   const handlePipelineClick = (event, pipeline) => {
//     setActivePipeline(pipeline);
//     setStageAnchorEl(event.currentTarget);
//   };

//   const handlePipelineCheckboxToggle = (pipeline) => {
//     const stageNames = pipeline.stages.map((stage) => stage.name);
//     const currentSelected = selectedStages[pipeline.pipelineName] || [];

//     if (currentSelected.length === stageNames.length) {
//       const newSelected = { ...selectedStages };
//       delete newSelected[pipeline.pipelineName];
//       setSelectedStages(newSelected);
//     } else {
//       setSelectedStages((prev) => ({
//         ...prev,
//         [pipeline.pipelineName]: stageNames,
//       }));
//     }
//   };

//   const handleStageToggle = (pipelineName, stageName) => {
//     setSelectedStages((prev) => {
//       const current = prev[pipelineName] || [];
//       let updated;

//       if (current.includes(stageName)) {
//         updated = current.filter((s) => s !== stageName);
//       } else {
//         updated = [...current, stageName];
//       }

//       if (updated.length === 0) {
//         const newState = { ...prev };
//         delete newState[pipelineName];
//         return newState;
//       }

//       return { ...prev, [pipelineName]: updated };
//     });
//   };

//   // ===================== OTHER FILTERS =====================
//   const [accountNameValue, setAccountNameValue] = useState("");
//   const [priorityValue, setPriorityValue] = useState("");

//   // ===================== SEND FILTER DATA =====================

//   useEffect(() => {
//   onFilterChange?.({
//     jobAssignees: combinedValues,
//     clientStatus,
//     pipelineStages: selectedStages,
//     accountName: accountNameValue,
//     priority: priorityValue,
//   });
// }, [
//   combinedValues,
//   clientStatus,
//   selectedStages,
//   accountNameValue,
//   priorityValue,
//   onFilterChange, // ✅ FIX
// ]);

//   return (
//     <Box>
//       {/* Header */}
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <Button
//           onClick={handleClick}
//           variant="outlined"
//           sx={{
//             textTransform: "none",
//             borderRadius: "12px",
//             px: 2.5,
//             py: 1,
//             backgroundColor: "#fff",
//             borderColor: "#E5E7EB",
//             color: "#344054",
//             boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
//           }}
//           endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//         >
//           Filters ({selectedFilters.length})
//         </Button>

//         {selectedFilters.length > 0 && (
//           <Button
//             size="small"
//             onClick={() => {
//               setSelectedFilters([]);
//               setClientStatus([]);
//               setAccountNameValue("");
//               setPriorityValue("");
//               setCombinedValues([]);
//               setSelectedStages({});
//             }}
//           >
//             Clear All
//           </Button>
//         )}
//       </Box>

//       {/* Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           sx: {
//             width: 260,
//             borderRadius: "12px",
//             boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
//             mt: 1,
//           },
//         }}
//       >
//         {options.map((option) => (
//           <MenuItem key={option} onClick={() => handleOptionSelect(option)}>
//             {option}
//           </MenuItem>
//         ))}
//       </Menu>

//       {/* Filters UI */}
//       {selectedFilters.length > 0 && (
//         <Box
//           sx={{
//             mt: 2,
//             display: "flex",
//             gap: 2,
//             overflowX: "auto",
//             pb: 1,
//           }}
//         >
//           {selectedFilters.map((filter) => (
//             <Box
//               key={filter}
//               sx={{
//                 p: 2,
//                 minWidth: 260,
//                 borderRadius: "16px",
//                 border: "1px solid #EAECF0",
//                 backgroundColor: "#fff",
//                 boxShadow: "0px 4px 12px rgba(16,24,40,0.05)",
//                 position: "relative",
//               }}
//             >
//               <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
//                 {filter}
//               </Typography>

//               {/* Job Assignees */}
//               {filter === "Job assignees" && (
//                 <MultiSelectDropdown
//                   value={selectedUser}
//                   onChange={handleUserChange}
//                   placeholder="Select assignees"
//                 />
//               )}

//               {/* Account */}
//               {filter === "Account name" && (
//                 <TextField
//                   size="small"
//                   fullWidth
//                   placeholder="Enter account name"
//                   value={accountNameValue}
//                   onChange={(e) => setAccountNameValue(e.target.value)}
//                 />
//               )}

//               {/* Status */}
//               {filter === "Client-facing status" && (
//                 <FormControl fullWidth size="small">
//                   <Select
//                     multiple
//                     value={clientStatus}
//                     onChange={(e) => setClientStatus(e.target.value)}
//                     renderValue={(selected) => selected.join(", ")}
//                   >
//                     {clientStatusOptions.map((status) => (
//                       <MenuItem
//                         key={status._id}
//                         value={status.clientfacingName}
//                       >
//                         <Checkbox
//                           checked={clientStatus.includes(
//                             status.clientfacingName
//                           )}
//                         />
//                         <ListItemText primary={status.clientfacingName} />
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               )}

//               {/* Pipeline */}
//               {filter === "Pipeline and stage" && (
//                 <Box>
//                   {pipelines.map((pipeline) => (
//                     <Box
//                       key={pipeline._id}
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         p: 1,
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         "&:hover": { backgroundColor: "#F9FAFB" },
//                       }}
//                       onClick={(e) => handlePipelineClick(e, pipeline)}
//                     >
//                       <Checkbox
//                         size="small"
//                         checked={
//                           selectedStages[pipeline.pipelineName]?.length ===
//                           pipeline.stages.length
//                         }
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handlePipelineCheckboxToggle(pipeline);
//                         }}
//                       />
//                       <Typography sx={{ fontSize: 13 }}>
//                         {pipeline.pipelineName}
//                       </Typography>
//                       <Typography variant="caption">
//                         ({selectedStages[pipeline.pipelineName]?.length || 0}/
//                         {pipeline.stages.length})
//                       </Typography>
//                     </Box>
//                   ))}

//                   <Popover
//                     open={Boolean(stageAnchorEl)}
//                     anchorEl={stageAnchorEl}
//                     onClose={() => setStageAnchorEl(null)}
//                     PaperProps={{
//                       sx: {
//                         borderRadius: "12px",
//                         p: 1,
//                         boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
//                       },
//                     }}
//                   >
//                     <Box sx={{ minWidth: 200 }}>
//                       {activePipeline?.stages?.map((stage) => (
//                         <MenuItem
//                           key={stage._id}
//                           onClick={() =>
//                             handleStageToggle(
//                               activePipeline.pipelineName,
//                               stage.name
//                             )
//                           }
//                         >
//                           <Checkbox
//                             size="small"
//                             checked={
//                               selectedStages[
//                                 activePipeline.pipelineName
//                               ]?.includes(stage.name) || false
//                             }
//                           />
//                           <ListItemText primary={stage.name} />
//                         </MenuItem>
//                       ))}
//                     </Box>
//                   </Popover>
//                 </Box>
//               )}

//               {/* Priority */}
//               {filter === "Priority" && (
//                 <FormControl fullWidth size="small">
//                   <Select
//                     value={priorityValue}
//                     onChange={(e) => setPriorityValue(e.target.value)}
//                   >
//                     <MenuItem value="">All</MenuItem>
//                     <MenuItem value="High">High</MenuItem>
//                     <MenuItem value="Medium">Medium</MenuItem>
//                     <MenuItem value="Low">Low</MenuItem>
//                   </Select>
//                 </FormControl>
//               )}

//               {/* Remove */}
//               <IconButton
//                 onClick={() => removeFilter(filter)}
//                 size="small"
//                 sx={{
//                   position: "absolute",
//                   top: 6,
//                   right: 6,
//                   backgroundColor: "#F2F4F7",
//                 }}
//               >
//                 <CloseIcon sx={{ fontSize: 16 }} />
//               </IconButton>
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default FilterDropdown;


import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  X, 
  Check 
} from "lucide-react";
import { templateAPI } from "../../services/api";

// Shadcn UI Components
import { Button } from "../../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";

const FilterDropdown = ({ onFilterChange }) => {
  const [filterAnchorOpen, setFilterAnchorOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

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
    setFilterAnchorOpen(false);
  };

  const removeFilter = (option) => {
    setSelectedFilters((prev) => prev.filter((item) => item !== option));
    // Resetting specific states as per original logic
    if (option === "Client-facing status") setClientStatus([]);
    if (option === "Account name") setAccountNameValue("");
    if (option === "Priority") setPriorityValue("");
    if (option === "Job assignees") {
      setCombinedValues([]);
      setSelectedUser([]);
    }
    if (option === "Pipeline and stage") {
      setSelectedStages({});
      setActivePipeline(null);
    }
  };

  const clearAll = () => {
    setSelectedFilters([]);
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
  }, [combinedValues, clientStatus, selectedStages, accountNameValue, priorityValue, onFilterChange]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Popover open={filterAnchorOpen} onOpenChange={setFilterAnchorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="rounded-xl border-gray-200 px-5 py-2 text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2"
            >
              Filters ({selectedFilters.length})
              {filterAnchorOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0 rounded-xl overflow-hidden" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option}
                      onSelect={() => handleOptionSelect(option)}
                      className="cursor-pointer py-2"
                    >
                      {option}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-blue-600 hover:text-blue-700">
            Clear All
          </Button>
        )}
      </div>

      {/* Filters Horizontal UI */}
      {selectedFilters.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {selectedFilters.map((filter) => (
            <div
              key={filter}
              className="relative min-w-[280px] p-4 rounded-2xl border border-gray-100 bg-white shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-sm text-gray-900">{filter}</span>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => removeFilter(filter)}
                  className="h-6 w-6 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>

              {/* Content by Filter Type */}
              <div className="mt-2">
                {/* Job Assignees */}
                {filter === "Job assignees" && (
                  <MultiSelectDropdown
                    value={selectedUser}
                    onChange={handleUserChange}
                    placeholder="Select assignees"
                  />
                )}

                {/* Account Name */}
                {filter === "Account name" && (
                  <Input
                    placeholder="Enter account name"
                    value={accountNameValue}
                    onChange={(e) => setAccountNameValue(e.target.value)}
                    className="h-9"
                  />
                )}

                {/* Client Status */}
                {filter === "Client-facing status" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-9 text-xs font-normal">
                        {clientStatus.length > 0 ? clientStatus.join(", ") : "Select status"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0">
                      <div className="max-h-60 overflow-y-auto p-1">
                        {clientStatusOptions.map((status) => (
                          <div
                            key={status._id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                            onClick={() => {
                              const val = status.clientfacingName;
                              setClientStatus((prev) =>
                                prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
                              );
                            }}
                          >
                            <Checkbox checked={clientStatus.includes(status.clientfacingName)} />
                            <span className="text-sm">{status.clientfacingName}</span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}

                {/* Pipeline and Stage */}
                {filter === "Pipeline and stage" && (
                  <div className="space-y-1">
                    {pipelines.map((pipeline) => (
                      <Popover key={pipeline._id}>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 group transition-colors">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={
                                selectedStages[pipeline.pipelineName]?.length === pipeline.stages.length
                              }
                              onCheckedChange={() => handlePipelineCheckboxToggle(pipeline)}
                            />
                            <PopoverTrigger asChild>
                              <span className="text-[13px] cursor-pointer hover:underline">
                                {pipeline.pipelineName}
                              </span>
                            </PopoverTrigger>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            ({selectedStages[pipeline.pipelineName]?.length || 0}/{pipeline.stages.length})
                          </span>
                        </div>
                        <PopoverContent side="right" className="w-52 p-1">
                          {pipeline.stages.map((stage) => (
                            <div
                              key={stage._id}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                              onClick={() => handleStageToggle(pipeline.pipelineName, stage.name)}
                            >
                              <Checkbox
                                checked={selectedStages[pipeline.pipelineName]?.includes(stage.name) || false}
                              />
                              <span className="text-xs">{stage.name}</span>
                            </div>
                          ))}
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                )}

                {/* Priority */}
                {filter === "Priority" && (
                  <Select value={priorityValue} onValueChange={(val) => setPriorityValue(val)}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;