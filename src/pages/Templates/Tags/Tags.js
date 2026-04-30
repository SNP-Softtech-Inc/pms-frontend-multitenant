// // import React, { useState, useEffect,  } from "react";

// // import {
// //   TableContainer,
// //   Paper,
// //   Chip,
// //   Table,
// //   TableHead,
// //   TableRow,
// //   TableCell,
// //   TableBody,
// //   TablePagination,
// //   Box,
// //   Button,
// //   Typography,
// //   Drawer,
// //   Select,
// //   MenuItem,
// //   IconButton,
// //   TextField,
 
// //   CircularProgress,
// //   Menu,
// // } from "@mui/material";

// // import { CiMenuKebab } from "react-icons/ci";
// // import { IoClose } from "react-icons/io5";
// // import { toast } from "react-toastify";
// // import { templateAPI } from "../../../services/api"; // adjust path

// // const Tags = () => {
// //   const [tags, setTags] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
// //   const [isEdit, setIsEdit] = useState(false);
// //   const [getId, setGetId] = useState("");

// //   const [inputValue, setInputValue] = useState("");
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [options, setOptions] = useState([]);

// //   const [anchorEl, setAnchorEl] = useState(null);
// //   const [menuId, setMenuId] = useState(null);

// //   const [searchTerm, setSearchTerm] = useState("");

// //   const colors = [
// //     "#0d6efd",
// //     "#6c757d",
// //     "#198754",
// //     "#dc3545",
// //     "#ffc107",
// //     "#0dcaf0",
// //     "#FF5722",
// //     "#212529",
// //   ];

// //   const handleDrawerClose =()=>{
// //     setIsDrawerOpen(false)
// //   }

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   // ================= FETCH =================
// // const fetchData = async () => {
// //   setLoading(true);
// //   try {
// //     const res = await templateAPI.getAccountCountOfTag();

// //     console.log("API:", res.data);

// //     setTags(res.data.tagCounts || []); // ✅ FIX
// //   } catch (err) {
// //     toast.error("Failed to fetch tags");
// //     setTags([]);
// //   } finally {
// //     setLoading(false);
// //   }
// // };

// //   // ================= OPTIONS =================
// //   const generateOptions = (value) => {
// //     return colors.map((color, index) => ({
// //       value: `${value}-${index}`,
// //       tagName: value,
// //       tagColour: color,
// //     }));
// //   };

// //   const handleInputChange = (value) => {
// //     setInputValue(value);
// //     setOptions(generateOptions(value));
// //   };

// //   const handleChange = (e) => {
// //     const selected = options.find((o) => o.tagColour === e.target.value);
// //     setSelectedOption(selected);
// //   };

// //   // ================= RESET =================
// //   const resetForm = () => {
// //     setInputValue("");
// //     setSelectedOption(null);
// //     setOptions([]);
// //     setGetId("");
// //     setIsEdit(false);
// //   };

// //   // ================= CREATE =================
// //   const handleSubmit = async () => {
// //     if (!inputValue || !selectedOption) {
// //       toast.error("All fields required");
// //       return;
// //     }

// //     try {
// //       setLoading(true);

// //       await templateAPI.createTags({
// //         tagName: inputValue,
// //         tagColour: selectedOption.tagColour,
// //       });

// //       toast.success("Tag created");
// //       fetchData();
// //       handleDrawerClose();
// //       resetForm();
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || "Error");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ================= UPDATE =================
// //   const handleUpdate = async () => {
// //     try {
// //       await templateAPI.updateTags(getId, {
// //         tagName: inputValue,
// //         tagColour: selectedOption.tagColour,
// //       });

// //       toast.success("Updated successfully");
// //       fetchData();
// //       handleDrawerClose();
// //       resetForm();
// //     } catch (err) {
// //       toast.error("Update failed");
// //     }
// //   };

// //   // ================= DELETE =================
// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Delete this tag?")) return;

// //     try {
// //       await templateAPI.deleteTags(id);
// //       toast.success("Deleted");
// //       fetchData();
// //     } catch {
// //       toast.error("Delete failed");
// //     }
// //   };

// //   // ================= EDIT =================
// //   const handleEdit = async (id) => {
// //     try {
// //       const res = await templateAPI.getTagById(id);
// //       const tag = res.data.tag;

// //       setGetId(id);
// //       setInputValue(tag.tagName);

// //       const opts = generateOptions(tag.tagName);
// //       setOptions(opts);

// //       const selected = opts.find((o) => o.tagColour === tag.tagColour);
// //       setSelectedOption(selected);

// //       setIsEdit(true);
// //       setIsDrawerOpen(true);
// //     } catch {
// //       toast.error("Failed to load tag");
// //     }
// //   };

// //   // ================= MENU =================
// //   const handleMenuOpen = (e, id) => {
// //     setAnchorEl(e.currentTarget);
// //     setMenuId(id);
// //   };

// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //     setMenuId(null);
// //   };

// //   // ================= SEARCH =================
// //   const filteredTags = tags.filter((tag) =>
// //     tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   // ================= PAGINATION =================
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);

// //   const paginatedTags = filteredTags.slice(
// //     page * rowsPerPage,
// //     page * rowsPerPage + rowsPerPage
// //   );

// //   return (
// //     <div className="tag-container">
// //       {/* HEADER */}
// //       <Box display="flex" justifyContent="space-between" mb={2}>
// //         <Typography variant="h6">Tags</Typography>

// //         <Box display="flex" gap={2}>
// //           <TextField
// //             size="small"
// //             placeholder="Search"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />

// //           <Button
// //             variant="contained"
// //             onClick={() => {
// //               setIsEdit(false);
// //               setIsDrawerOpen(true);
// //             }}
// //           >
// //             Add Tag
// //           </Button>
// //         </Box>
// //       </Box>

// //       {/* TABLE */}
// //       {loading ? (
// //         <Box textAlign="center">
// //           <CircularProgress />
// //         </Box>
// //       ) : (
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell>Tag</TableCell>
// //                 <TableCell>Accounts</TableCell>
// //                 <TableCell>Actions</TableCell>
// //               </TableRow>
// //             </TableHead>

// //             <TableBody>
// //               {paginatedTags.map((row) => (
// //                 <TableRow key={row._id}>
// //                   <TableCell>
// //                     <Chip
// //                       label={row.tagName}
// //                       sx={{
// //                         backgroundColor: row.tagColour,
// //                         color: "#fff",
// //                       }}
// //                     />
// //                   </TableCell>

// //                   <TableCell>{row.count}</TableCell>

// //                   <TableCell>
// //                     <IconButton
// //                       onClick={(e) => handleMenuOpen(e, row._id)}
// //                     >
// //                       <CiMenuKebab />
// //                     </IconButton>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}

// //       {/* MENU */}
// //       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
// //         <MenuItem
// //           onClick={() => {
// //             handleEdit(menuId);
// //             handleMenuClose();
// //           }}
// //         >
// //           Edit
// //         </MenuItem>
// //         <MenuItem
// //           onClick={() => {
// //             handleDelete(menuId);
// //             handleMenuClose();
// //           }}
// //         >
// //           Delete
// //         </MenuItem>
// //       </Menu>

// //       {/* PAGINATION */}
// //       <TablePagination
// //         component="div"
// //         count={filteredTags.length}
// //         page={page}
// //         onPageChange={(e, newPage) => setPage(newPage)}
// //         rowsPerPage={rowsPerPage}
// //         onRowsPerPageChange={(e) =>
// //           setRowsPerPage(parseInt(e.target.value, 10))
// //         }
// //       />

// //       {/* SINGLE DRAWER */}
// //       <Drawer
// //         anchor="right"
// //         open={isDrawerOpen}
// //         onClose={() => {
// //           setIsDrawerOpen(false);
// //           resetForm();
// //         }}
// //       >
// //         <Box p={3} width={350}>
// //           <Box display="flex" justifyContent="space-between">
// //             <Typography variant="h6">
// //               {isEdit ? "Edit Tag" : "Create Tag"}
// //             </Typography>
// //             <IoClose onClick={() => setIsDrawerOpen(false)} />
// //           </Box>

// //           <TextField
// //             label="Tag Name"
// //             value={inputValue}
// //             onChange={(e) => handleInputChange(e.target.value)}
// //             fullWidth
// //             size="small"
// //             sx={{ mt: 2 }}
// //           />

// //           <Select
// //             value={selectedOption?.tagColour || ""}
// //             onChange={handleChange}
// //             fullWidth
// //             size="small"
// //             sx={{ mt: 2 }}
// //           >
// //             {options.map((opt) => (
// //               <MenuItem key={opt.value} value={opt.tagColour}>
// //                 <Box
// //                   sx={{
// //                     backgroundColor: opt.tagColour,
// //                     color: "#fff",
// //                     px: 1,
// //                     borderRadius: 1,
// //                   }}
// //                 >
// //                   {opt.tagName}
// //                 </Box>
// //               </MenuItem>
// //             ))}
// //           </Select>

// //           <Box mt={3} display="flex" gap={2}>
// //             <Button
// //               variant="contained"
// //               onClick={isEdit ? handleUpdate : handleSubmit}
// //             >
// //               {isEdit ? "Update" : "Create"}
// //             </Button>

// //             <Button
// //               variant="outlined"
// //               onClick={() => {
// //                 setIsDrawerOpen(false);
// //                 resetForm();
// //               }}
// //             >
// //               Cancel
// //             </Button>
// //           </Box>
// //         </Box>
// //       </Drawer>
// //     </div>
// //   );
// // };

// // export default Tags;


// import React, { useState, useEffect, useMemo } from "react";
// import { toast } from "react-toastify";

// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { Label } from "../../../components/ui/label";
// import { SideSheet } from "../../../components/ui/side-sheet";

// import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";

// import { DataTable } from "../../../components/data-table/data-table";
// import { DataTableToolbar } from "../../../components/data-table/toolbar";

// import { templateAPI } from "../../../services/api";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// const Tags = () => {
//   const confirm = useConfirm();
//   const [tags, setTags] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [getId, setGetId] = useState("");

//   const [inputValue, setInputValue] = useState("");
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [options, setOptions] = useState([]);

//   const [globalFilter, setGlobalFilter] = useState("");

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

//   // ================= FETCH =================
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await templateAPI.getAccountCountOfTag();
//       setTags(res.data.tagCounts || []);
//     } catch {
//       toast.error("Failed to fetch tags");
//       setTags([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ================= OPTIONS =================
//   const generateOptions = (value) => {
//     return colors.map((color, index) => ({
//       value: `${value}-${index}`,
//       tagName: value,
//       tagColour: color,
//     }));
//   };

//   const handleInputChange = (value) => {
//     setInputValue(value);
//     setOptions(generateOptions(value));
//   };

//   // ================= RESET =================
//   const resetForm = () => {
//     setInputValue("");
//     setSelectedOption(null);
//     setOptions([]);
//     setGetId("");
//     setIsEdit(false);
//   };

//   // ================= CREATE =================
//   const handleSubmit = async () => {
//     if (!inputValue || !selectedOption) {
//       toast.error("All fields required");
//       return;
//     }

//     try {
//       setLoading(true);

//       await templateAPI.createTags({
//         tagName: inputValue,
//         tagColour: selectedOption.tagColour,
//       });

//       toast.success("Tag created");
//       fetchData();
//       resetForm();
//       setIsDrawerOpen(false);
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= UPDATE =================
//   const handleUpdate = async () => {
//     try {
//       await templateAPI.updateTags(getId, {
//         tagName: inputValue,
//         tagColour: selectedOption.tagColour,
//       });

//       toast.success("Updated successfully");
//       fetchData();
//       resetForm();
//       setIsDrawerOpen(false);
//     } catch {
//       toast.error("Update failed");
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = (id) => {
//   confirm({
//     title: "Delete Tag",
//     description: "Are you sure you want to delete this tag?",
//     onConfirm: async () => {
//       try {
//         await templateAPI.deleteTags(id);
//         toast.success("Deleted");
//         fetchData();
//       } catch {
//         toast.error("Delete failed");
//       }
//     },
//   });
// };

//   // ================= EDIT =================
//   const handleEdit = async (id) => {
//     try {
//       const res = await templateAPI.getTagById(id);
//       const tag = res.data.tag;

//       setGetId(id);
//       setInputValue(tag.tagName);

//       const opts = generateOptions(tag.tagName);
//       setOptions(opts);

//       const selected = opts.find((o) => o.tagColour === tag.tagColour);
//       setSelectedOption(selected);

//       setIsEdit(true);
//       setIsDrawerOpen(true);
//     } catch {
//       toast.error("Failed to load tag");
//     }
//   };

//   // ================= TABLE =================
//   const columns = useMemo(() => [
//     {
//       accessorKey: "tagName",
//       header: "Tag",
//       cell: ({ row }) => (
//         <span
//           className="inline-flex px-2 py-1 text-xs font-semibold text-white rounded-full"
//           style={{ backgroundColor: row.original.tagColour }}
//         >
//           {row.original.tagName}
//         </span>
//       ),
//     },
//     {
//       accessorKey: "count",
//       header: "Accounts",
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex gap-1">
//           <button
//             onClick={() => handleEdit(row.original._id)}
//             className="p-1 hover:bg-muted rounded"
//           >
//             <Pencil className="h-4 w-4" />
//           </button>

//           <button
//             onClick={() => handleDelete(row.original._id)}
//             className="p-1 hover:bg-destructive/10 rounded text-destructive"
//           >
//             <Trash2 className="h-4 w-4" />
//           </button>
//         </div>
//       ),
//     },
//   ], []);

//   return (
//     <div className="space-y-4">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <Button onClick={() => setIsDrawerOpen(true)}>
//           <Plus className="mr-2 h-4 w-4" /> Add Tag
//         </Button>
//       </div>

//       {/* SEARCH */}
//       <DataTableToolbar
//         globalFilter={globalFilter}
//         onGlobalFilterChange={setGlobalFilter}
//       />

//       {/* TABLE */}
//       <DataTable
//         columns={columns}
//         data={tags}
//         loading={loading}
//         globalFilter={globalFilter}
//         onGlobalFilterChange={setGlobalFilter}
//         getRowId={(row) => row._id}
//       />

//       {/* DRAWER */}
//       <SideSheet
//         open={isDrawerOpen}
//         onOpenChange={(v) => !v && setIsDrawerOpen(false)}
//         title={isEdit ? "Edit Tag" : "Create Tag"}
//         confirmLabel={isEdit ? "Update" : "Create"}
//         onConfirm={isEdit ? handleUpdate : handleSubmit}
//         isSubmitting={loading}
//       >
//         <div className="space-y-4">
//           <div>
//             <Label>Tag Name</Label>
//             <Input
//               value={inputValue}
//               onChange={(e) => handleInputChange(e.target.value)}
//             />
//           </div>

//           <div>
//             <Label>Color</Label>

//             {/* Preview */}
//             {selectedOption && (
//               <div className="mb-2">
//                 <span
//                   className="px-3 py-1 rounded-full text-white text-xs"
//                   style={{ backgroundColor: selectedOption.tagColour }}
//                 >
//                   {inputValue}
//                 </span>
//               </div>
//             )}

//             {/* Color Picker */}
//             <div className="flex flex-wrap gap-2">
//               {colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() =>
//                     setSelectedOption({
//                       tagName: inputValue,
//                       tagColour: color,
//                     })
//                   }
//                   className={`w-8 h-8 rounded-full border-2 ${
//                     selectedOption?.tagColour === color
//                       ? "border-black"
//                       : "border-transparent"
//                   }`}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </SideSheet>
//     </div>
//   );
// };

// export default Tags;





import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { X, Pencil, Trash2, Plus, Loader2 } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";

import { templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";

const Tags = () => {
  const confirm = useConfirm();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [getId, setGetId] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");

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

  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getAccountCountOfTag();
      setTags(res.data.tagCounts || []);
    } catch {
      toast.error("Failed to fetch tags");
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= RESET =================
  const resetForm = () => {
    setInputValue("");
    setSelectedOption(null);
    setGetId("");
    setIsEdit(false);
  };

  // ================= CREATE =================
  const handleSubmit = async () => {
    if (!inputValue || !selectedOption) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      await templateAPI.createTags({
        tagName: inputValue,
        tagColour: selectedOption.tagColour,
      });

      toast.success("Tag created");
      fetchData();
      resetForm();
      setIsDrawerOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    if (!inputValue || !selectedOption) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      await templateAPI.updateTags(getId, {
        tagName: inputValue,
        tagColour: selectedOption.tagColour,
      });

      toast.success("Updated successfully");
      fetchData();
      resetForm();
      setIsDrawerOpen(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = (id) => {
    confirm({
      title: "Delete Tag",
      description: "Are you sure you want to delete this tag?",
      onConfirm: async () => {
        try {
          await templateAPI.deleteTags(id);
          toast.success("Deleted");
          fetchData();
        } catch {
          toast.error("Delete failed");
        }
      },
    });
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTagById(id);
      const tag = res.data.tag;

      setGetId(id);
      setInputValue(tag.tagName);

      const selected = colors.find((color) => color === tag.tagColour);
      setSelectedOption({
        tagName: tag.tagName,
        tagColour: selected || colors[0],
      });

      setIsEdit(true);
      setIsDrawerOpen(true);
    } catch {
      toast.error("Failed to load tag");
    }
  };

  // ================= CLOSE DRAWER =================
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  // ================= TABLE =================
  const columns = useMemo(() => [
    {
      accessorKey: "tagName",
      header: "Tag",
      cell: ({ row }) => (
        <span
          className="inline-flex px-2 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: row.original.tagColour }}
        >
          {row.original.tagName}
        </span>
      ),
    },
    {
      accessorKey: "count",
      header: "Accounts",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="p-1 hover:bg-muted rounded"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(row.original._id)}
            className="p-1 hover:bg-destructive/10 rounded text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Tag
        </Button>
      </div>

      {/* SEARCH */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={tags}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        getRowId={(row) => row._id}
      />

      {/* CUSTOM DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden ">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold">
                {isEdit ? "Edit Tag" : "Create Tag"}
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
              <div className="p-4 space-y-4">
                {/* Tag Name */}
                <div className="space-y-2">
                  <Label>Tag Name *</Label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter tag name"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <Label>Color *</Label>
                  
                  {/* Preview */}
                  {selectedOption && inputValue && (
                    <div className="mb-2">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-white text-xs"
                        style={{ backgroundColor: selectedOption.tagColour }}
                      >
                        {inputValue}
                      </span>
                    </div>
                  )}

                  {/* Color Picker */}
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedOption({
                            tagName: inputValue,
                            tagColour: color,
                          })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedOption?.tagColour === color
                            ? "border-black scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
              <Button
                variant="outline"
                onClick={handleDrawerClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={isEdit ? handleUpdate : handleSubmit}
                disabled={loading || !inputValue || !selectedOption}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Update" : "Create"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;