// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Drawer,
//   Select,
//   MenuItem,
//   TextField,
//   FormControl,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import CloseIcon from "@mui/icons-material/Close";
// import { GoDotFill } from "react-icons/go";
// import { toast } from "react-toastify";
// import { templateAPI } from "../../../services/api";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import { useConfirm } from "../../../components/ConfirmDialogContext";

// const Clientfacing = () => {
//     const confirm = useConfirm();
//   const [clientFacingJobs, setClientFacingJobs] = useState([]);
//   const [clientFacingName, setClientFacingName] = useState("");
//   const [clientFacingDescription, setClientFacingDescription] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [jobId, setJobId] = useState(null);

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isNewDrawerOpen, setIsNewDrawerOpen] = useState(false);

//   const [loading, setLoading] = useState(true);

//   const [errors, setErrors] = useState({
//     name: "",
//     description: "",
//     color: "",
//   });

//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

//   const colors = [
//     "#0d6efd",
//     "#6c757d",
//     "#198754",
//     "#dc3545",
//     "#ffc107",
//     "#0dcaf0",
//     "#FF5722",
//     "#212529",
//   ];

//   // ✅ LOAD DATA
//   const loadJobStatus = async () => {
//     try {
//       setLoading(true);
//       const res = await templateAPI.getAllJobStatus();
//       setClientFacingJobs(res.data.clientFacingJobStatues || []);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadJobStatus();
//   }, []);

//   // ✅ VALIDATION
//   const validateForm = () => {
//     let valid = true;
//     let newErrors = { name: "", description: "", color: "" };

//     if (!selectedColor) {
//       newErrors.color = "Please select a color";
//       valid = false;
//     }
//     if (!clientFacingName.trim()) {
//       newErrors.name = "Name is required";
//       valid = false;
//     }
//     if (!clientFacingDescription.trim()) {
//       newErrors.description = "Description is required";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   // ✅ CREATE
//   const createJobFacing = async () => {
//     if (!validateForm()) return;

//     try {
//       await templateAPI.createJobStatus({
//         clientfacingName: clientFacingName.trim(),
//         clientfacingColour: selectedColor,
//         clientfacingdescription: clientFacingDescription.trim(),
//       });

//       toast.success("Created successfully");
//       handleDrawerClose();
//       loadJobStatus();
//     } catch (error) {
//       console.error(error);
//       toast.error("Create failed");
//     }
//   };

//   // ✅ UPDATE
//   const updateJobFacing = async () => {
//     try {
//       await templateAPI.updateJobStatus(jobId, {
//         clientfacingName: clientFacingName,
//         clientfacingColour: selectedColor,
//         clientfacingdescription: clientFacingDescription,
//       });

//       toast.success("Updated successfully");
//       handleNewDrawerClose();
//       loadJobStatus();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ DELETE
  
// const deleteJobFacing = (id) => {

//   confirm({
//     title: "Delete Job Status",
//     description: "Are you sure you want to delete this job status?",
//     onConfirm: async () => {
//       try {
//         await templateAPI.deleteJobStatus(id);
//         toast.success("Deleted successfully");
//         loadJobStatus();
//       } catch (error) {
//         console.error(error);
//         toast.error("Delete failed");
//       }
//     },
//   });
// };
//   // ✅ EDIT
//   const handleEdit = async (id) => {
//     setIsNewDrawerOpen(true);

//     try {
//       const res = await templateAPI.getJobStatusById(id);
//       const data = res.data.clientfacingjobstatuses;

//       setJobId(data._id);
//       setSelectedColor(data.clientfacingColour);
//       setClientFacingName(data.clientfacingName);
//       setClientFacingDescription(data.clientfacingdescription);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // ✅ RESET
//   const resetForm = () => {
//     setClientFacingName("");
//     setClientFacingDescription("");
//     setSelectedColor("");
//     setErrors({ name: "", description: "", color: "" });
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//     resetForm();
//   };

//   const handleNewDrawerClose = () => {
//     setIsNewDrawerOpen(false);
//     setJobId(null);
//     resetForm();
//   };

//   return (
//     <Box>
//       <Button variant="contained" onClick={() => setIsDrawerOpen(true)}>
//         Create Status
//       </Button>

//       {loading ? (
//         <Box display="flex" justifyContent="center">
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box m={2}>
//           {clientFacingJobs.map((job) => (
//             <Box
//               key={job._id}
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 p: 2,
//                 mb: 2,
//                 border: "1px solid #e2e8f0",
//                 borderRadius: "12px",
//                 backgroundColor: "#ffffff",
//                 boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "flex-start",
//                   flex: 1,
//                   minWidth: 0, // allows the box to shrink and wrap text
//                 }}
//               >
//                 <GoDotFill
//                   style={{
//                     color: job.clientfacingColour,
//                     fontSize: "28px",
//                     flexShrink: 0,
//                     marginRight: "12px",
//                     marginTop: "4px", // aligns dot with multiline text
//                   }}
//                 />
//                 <Box sx={{ minWidth: 0 }}>
//                   <Typography variant="body1" fontWeight="600">
//                     {job.clientfacingName}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {job.clientfacingdescription}
//                   </Typography>
//                 </Box>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 1,
//                   marginLeft: 2,
//                 }}
//               >
//                 <IconButton
//                   onClick={() => handleEdit(job._id)}
//                   sx={{ color: "#1168bf" }}
//                 >
//                   <RiEdit2Line />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => deleteJobFacing(job._id)}
//                   sx={{ color: "#f52d2d" }}
//                 >
//                   <RiDeleteBin6Line />
//                 </IconButton>
//               </Box>
//             </Box>
//           ))}
//         </Box>
//       )}

//       {/* SINGLE DRAWER FOR CREATE & EDIT */}
//       <Drawer
//         anchor="right"
//         open={isDrawerOpen || isNewDrawerOpen}
//         onClose={() => {
//           setIsDrawerOpen(false);
//           setIsNewDrawerOpen(false);
//           resetForm();
//         }}
//       >
//         <Box p={3} width={isSmallScreen ? "100%" : 500}>
//           <Box
//             display="flex"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             <Typography variant="h6">
//               {jobId ? "Edit Status" : "Create Status"}
//             </Typography>

//             <IconButton
//               onClick={() => {
//                 setIsDrawerOpen(false);
//                 setIsNewDrawerOpen(false);
//                 resetForm();
//               }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Box mb={2}>
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <Typography variant="subtitle1" mb={1}>
//                 Color
//               </Typography>

//               <Select
//                 value={selectedColor}
//                 onChange={(e) => setSelectedColor(e.target.value)}
//                 renderValue={(value) => (
//                   <Box
//                     sx={{
//                       width: 20,
//                       height: 20,
//                       bgcolor: value,
//                       borderRadius: "50%",
//                       border: "1px solid #ccc",
//                     }}
//                   />
//                 )}
//               >
//                 {colors.map((c) => (
//                   <MenuItem key={c} value={c}>
//                     <Box
//                       sx={{
//                         width: 20,
//                         height: 20,
//                         bgcolor: c,
//                         borderRadius: "50%", // 👈 makes it circle
//                         border: "1px solid #ccc", // optional (better visibility for light colors)
//                       }}
//                     />
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//           <Box mb={2}>
//             <Typography variant="subtitle1" mb={1}>
//               Name
//             </Typography>
//             <TextField
//               fullWidth
//               placeholder="Name"
//               value={clientFacingName}
//               onChange={(e) => setClientFacingName(e.target.value)}
//             />
//           </Box>
//           <Box>
//             {" "}
//             <Typography variant="subtitle1" mb={1}>
//               Description
//             </Typography>
//             <TextField
//               fullWidth
//               multiline
//               placeholder="Description"
//               rows={5}
//               value={clientFacingDescription}
//               onChange={(e) => {
//                 setClientFacingDescription(e.target.value);
//                 if (e.target.value.trim() && e.target.value.length <= 200) {
//                   setErrors((prev) => ({ ...prev, description: "" })); // clear error
//                 }
//               }}
//               inputProps={{ maxLength: 200 }}
//               helperText={`${clientFacingDescription.length}/200 characters`}
//             />
//           </Box>

//           <Button
//             onClick={jobId ? updateJobFacing : createJobFacing}
//             sx={{ mt: 2 }}
//             variant="contained"
//           >
//             {jobId ? "Update" : "Submit"}
//           </Button>
//         </Box>
//       </Drawer>
//     </Box>
//   );
// };

// export default Clientfacing;


import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { X, Pencil, Trash2, Plus, Loader2, ChevronDown, Check } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { FormSection } from "../../../components/ui/form-layout";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import { cn } from "../../../lib/utils";
import { templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../components/ui/command";

const clientFacingSchema = z.object({
  clientfacingName: z.string().min(1, "Name is required"),
  clientfacingdescription: z.string().min(1, "Description is required").max(200, "Description must be 200 characters or less"),
  clientfacingColour: z.string().min(1, "Please select a color"),
});

const Clientfacing = () => {
  const confirm = useConfirm();
  const [clientFacingJobs, setClientFacingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const form = useForm({
    resolver: zodResolver(clientFacingSchema),
    defaultValues: {
      clientfacingName: "",
      clientfacingdescription: "",
      clientfacingColour: "",
    },
  });

  const colors = [
    "#0d6efd",
    "#6c757d",
    "#198754",
    "#dc3545",
    "#ffc107",
    "#0dcaf0",
    "#FF5722",
    "#212529",
  ];

  // ================= FETCH DATA =================
  const loadJobStatus = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllJobStatus();
      setClientFacingJobs(res.data.clientFacingJobStatues || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job statuses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobStatus();
  }, []);

  // ================= RESET FORM =================
  const resetForm = () => {
    form.reset({
      clientfacingName: "",
      clientfacingdescription: "",
      clientfacingColour: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  // ================= CREATE =================
  const createJobFacing = async (data) => {
    try {
      await templateAPI.createJobStatus({
        clientfacingName: data.clientfacingName.trim(),
        clientfacingColour: data.clientfacingColour,
        clientfacingdescription: data.clientfacingdescription.trim(),
      });

      toast.success("Created successfully");
      handleDrawerClose();
      loadJobStatus();
    } catch (error) {
      console.error(error);
      toast.error("Create failed");
    }
  };

  // ================= UPDATE =================
  const updateJobFacing = async (data) => {
    try {
      await templateAPI.updateJobStatus(editId, {
        clientfacingName: data.clientfacingName,
        clientfacingColour: data.clientfacingColour,
        clientfacingdescription: data.clientfacingdescription,
      });

      toast.success("Updated successfully");
      handleDrawerClose();
      loadJobStatus();
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  // ================= DELETE =================
  const deleteJobFacing = (id) => {
    confirm({
      title: "Delete Job Status",
      description: "Are you sure you want to delete this job status?",
      onConfirm: async () => {
        try {
          await templateAPI.deleteJobStatus(id);
          toast.success("Deleted successfully");
          loadJobStatus();
        } catch (error) {
          console.error(error);
          toast.error("Delete failed");
        }
      },
    });
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getJobStatusById(id);
      const data = res.data.clientfacingjobstatuses;

      setEditId(data._id);
      form.reset({
        clientfacingName: data.clientfacingName,
        clientfacingColour: data.clientfacingColour,
        clientfacingdescription: data.clientfacingdescription,
      });
      setIsEdit(true);
      setIsDrawerOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load job status");
    }
  };

  // ================= DRAWER HANDLERS =================
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  // ================= TABLE COLUMNS =================
  const columns = useMemo(() => [
    {
      id: "color",
      header: "Color",
      size: 60,
      enableSorting: false,
      cell: ({ row }) => (
        <span
          className="inline-block h-4 w-4 rounded-full border border-border/50 shrink-0"
          style={{ backgroundColor: row.original.clientfacingColour }}
        />
      ),
    },
    {
      accessorKey: "clientfacingName",
      header: "Name",
      cell: ({ getValue, row }) => (
        <button
          onClick={() => handleEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
        >
          {getValue()}
        </button>
      ),
    },
    {
      accessorKey: "clientfacingdescription",
      header: "Description",
      cell: ({ getValue }) => (
        <span className="text-xs text-muted-foreground truncate block max-w-[300px]">
          {getValue() || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 80,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => deleteJobFacing(row.original._id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create New Status
        </Button>
      </div>

      {/* TOOLBAR */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={clientFacingJobs}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No client-facing statuses found"
        emptyDescription="Create your first status to get started"
        pageSize={25}
      />

      {/* CUSTOM DRAWER WITH BLUR */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" 
            onClick={handleDrawerClose} 
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold">
                {isEdit ? "Edit Status" : "Create Status"}
              </h2>
              <button
                onClick={handleDrawerClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Form {...form}>
                  <form id="clientfacing-form" onSubmit={form.handleSubmit(isEdit ? updateJobFacing : createJobFacing)} className="space-y-6">
                    <FormSection title="Status Details">
                      <div className="flex items-start gap-4">
                        {/* <FormField
                          control={form.control}
                          name="clientfacingColour"
                          render={({ field }) => (
                            <FormItem className="w-1/3">
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <select
                                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    {...field}
                                    style={{ color: field.value || undefined }}
                                  >
                                    <option value="">Select</option>
                                    {colors.map((color) => (
                                      <option key={color} value={color} style={{ color, fontWeight: "bold" }}>
                                        ● 
                                      </option>
                                    ))}
                                  </select>
                                  {field.value && (
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-border" style={{ backgroundColor: field.value }} />
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        /> */}
                        <FormField
  control={form.control}
  name="clientfacingColour"
  render={({ field }) => (
    <FormItem className="w-1/3">
      <FormLabel>Color</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-full border border-border" 
                    style={{ backgroundColor: field.value }}
                  />
                  {/* <span>{field.value}</span> */}
                </div>
              ) : (
                "Select a color"
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search color..." />
            <CommandList>
              <CommandEmpty>No color found.</CommandEmpty>
              <CommandGroup>
                {colors.map((color) => (
                  <CommandItem
                    key={color}
                    value={color}
                    onSelect={() => {
                      field.onChange(color);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="h-4 w-4 rounded-full border border-border" 
                        style={{ backgroundColor: color }}
                      />
                      {/* <span>{color}</span> */}
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value === color ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
                        <FormField
                          control={form.control}
                          name="clientfacingName"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter a name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="clientfacingdescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Status description for client" 
                                maxLength={200} 
                                rows={5} 
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <div className="flex justify-between items-center mt-1">
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">
                                {(field.value || "").length}/200 characters
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </FormSection>
                  </form>
                </Form>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleDrawerClose}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="clientfacing-form"
                disabled={form.formState.isSubmitting || !form.formState.isValid}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Save Changes" : "Create"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientfacing;