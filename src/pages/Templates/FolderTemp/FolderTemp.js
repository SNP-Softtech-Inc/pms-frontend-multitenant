

// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   IconButton,
//   Menu,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   TablePagination,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

// import { folderManagementAPI } from "../../../services/api";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// const FolderTemplateList = () => {
//   const [templates, setTemplates] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedTemplate, setSelectedTemplate] = useState(null);

//   const [renameDialogOpen, setRenameDialogOpen] = useState(false);
//   const [renameValue, setRenameValue] = useState("");

  

//   // 🔹 Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const navigate = useNavigate();
//   const confirm = useConfirm();

//   useEffect(() => {
//     const fetchTemplates = async () => {
//       setLoading(true);
//       try {
//         const res = await folderManagementAPI.getFolderTemplates();
//         setTemplates(res.data.folderTemplates || []);
//       } catch (err) {
//         setError("Failed to fetch templates");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTemplates();
//   }, []);

//   // 🔹 Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // 🔹 Menu
//   const handleMenuClick = (e, template) => {
//     setAnchorEl(e.currentTarget);
//     setSelectedTemplate(template);
//   };

//   const handleMenuClose = () => setAnchorEl(null);

//   // 🔹 Rename
//   const handleRenameOpen = () => {
//     setRenameValue(selectedTemplate?.templatename || "");
//     setRenameDialogOpen(true);
//     handleMenuClose();
//   };

//   const handleRenameSubmit = async () => {
//     try {
//       await folderManagementAPI.renameFolderTemplate(
//         selectedTemplate._id,
//         { newName: renameValue }
//       );

//       setTemplates((prev) =>
//         prev.map((t) =>
//           t._id === selectedTemplate._id
//             ? { ...t, templatename: renameValue }
//             : t
//         )
//       );

//       toast.success("Renamed");
//       setRenameDialogOpen(false);
//     } catch {
//       toast.error("Rename failed");
//     }
//   };

//   // 🔹 Delete
//    // 🔹 Delete using confirm context
//   const handleDelete = () => {
//     confirm({
//       title: "Delete Template",
//       description: `Are you sure you want to delete "${selectedTemplate?.templatename}"?`,
//       onConfirm: async () => {
//         try {
//           await folderManagementAPI.deleteFolderTemplate(selectedTemplate._id);
//           setTemplates((prev) =>
//             prev.filter((t) => t._id !== selectedTemplate._id)
//           );
//           toast.success("Deleted");
//         } catch {
//           toast.error("Delete failed");
//         }
//       },
//     });
//     handleMenuClose();
//   };

//   // 🔹 Paginated data
//   const paginatedData = templates.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   return (
//     <Box p={2}>
//       <Button
//         variant="contained"
//         onClick={() => navigate("/firmtemp/templates/createfolder")}
//         sx={{ mb: 2 }}
//       >
//         Create Template
//       </Button>

//       {loading ? (
//         <Box textAlign="center">
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error">{error}</Typography>
//       ) : (
//         <>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow >
//                   <TableCell>
//                     Template Name
//                   </TableCell>
//                   <TableCell >
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {paginatedData.map((template) => (
//                   <TableRow key={template._id} hover>
//                     <TableCell>
//                       <Typography
//                         sx={{ cursor: "pointer" }}
//                         onClick={() =>
//                           navigate(
//                             `/firmtemp/templates/tree/${template._id}`,
//                             {
//                               state: {
//                                 templateId: template._id,
//                                 templateName:
//                                   template.templatename,
//                               },
//                             }
//                           )
//                         }
//                       >
//                         {template.templatename ||
//                           "Unnamed Template"}
//                       </Typography>
//                     </TableCell>

//                     <TableCell >
//                       <IconButton
//                         onClick={(e) =>
//                           handleMenuClick(e, template)
//                         }
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//                 {/* 🔹 Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem
//           onClick={() =>
//             navigate(
//               `/firmtemp/templates/tree/${selectedTemplate?._id}`
//             )
//           }
//         >
//        <RiEdit2Line style={{ marginRight: 8 }} />   Edit
//         </MenuItem>
//         <MenuItem onClick={handleRenameOpen}>
//          <RiEdit2Line style={{ marginRight: 8 }} />  Rename
//         </MenuItem>
//         <MenuItem
//           onClick={handleDelete}
//         >
//         <RiDeleteBin6Line style={{ marginRight: 8 }} />   Delete
//         </MenuItem>
//       </Menu>
//             </Table>
//              {/* 🔹 Pagination */}
//           <TablePagination
//             component="div"
//             count={templates.length}
//             page={page}
//             onPageChange={handleChangePage}
//             rowsPerPage={rowsPerPage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//             rowsPerPageOptions={[5, 10, 25]}
//           />
//           </TableContainer>

         
//         </>
//       )}

    

//       {/* 🔹 Rename Dialog */}
//       <Dialog
//         open={renameDialogOpen}
//         onClose={() => setRenameDialogOpen(false)}
//       >
//         <DialogTitle>Rename Template</DialogTitle>
//         <DialogContent>
//           <TextField
//             fullWidth
//             value={renameValue}
//             onChange={(e) =>
//               setRenameValue(e.target.value)
//             }
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setRenameDialogOpen(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleRenameSubmit}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

     
//     </Box>
//   );
// };

// export default FolderTemplateList;


import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {useToastContext} from "../../../context/ToastContext";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Pencil, PenLine, Trash2, FolderOpen, Plus } from "lucide-react";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import { folderManagementAPI } from "../../../services/api";

const renameSchema = z.object({
  templatename: z.string().min(1, "Template name is required"),
});

const FolderTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
const {showToast} = useToastContext();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const renameForm = useForm({
    resolver: zodResolver(renameSchema),
    defaultValues: { templatename: "" },
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await folderManagementAPI.getFolderTemplates();
        setTemplates(res.data.folderTemplates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCreateTemplate = () => {
    navigate("/firmtemp/templates/createfolder");
  };

  const handleRenameOpen = (template) => {
    setSelectedTemplate(template);
    renameForm.reset({ templatename: template.templatename || "" });
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async ({ templatename }) => {
    if (!selectedTemplate || !selectedTemplate._id) {
      console.error("No template selected for rename");
      return;
    }

    try {
      await folderManagementAPI.renameFolderTemplate(selectedTemplate._id, {
        newName: templatename,
      });

      showToast({
        title: "Template Renamed successfully",
        type: "success",
        description: "The template has been renamed."
      });
      setTemplates((prev) =>
        prev.map((t) =>
          t._id === selectedTemplate._id ? { ...t, templatename } : t
        )
      );

      setRenameDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error renaming template:", error);
      showToast({
        title: "Failed to rename template",
        type: "error",
        description: "An error occurred while renaming the template"
      });
    }
  };

  const handleDeleteOpen = (template) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate || !selectedTemplate._id) return;

    try {
      await folderManagementAPI.deleteFolderTemplate(selectedTemplate._id);

      showToast({
        title: "Template Deleted successfully",
        type: "success",
        description: "The template has been deleted."
      });
      setTemplates((prev) =>
        prev.filter((t) => t._id !== selectedTemplate._id)
      );

      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error deleting template:", error);
      showToast({
        title: "Failed to delete template",
        type: "error",
        description: "An error occurred while deleting the template"
      });
    }
  };

  const folderColumns = useMemo(
    () => [
      {
        accessorKey: "templatename",
        header: "Template Name",
        cell: ({ getValue, row }) => (
          <button
            onClick={() =>
              navigate(
                `/firmtemp/templates/tree/${encodeURIComponent(
                  row.original._id
                )}`,
                {
                  state: {
                    templateId: row.original._id,
                    templateName: row.original.templatename,
                  },
                }
              )
            }
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
          >
            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {getValue() || "Unnamed Template"}
          </button>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() =>
                navigate(
                  `/firmtemp/templates/tree/${encodeURIComponent(
                    row.original._id
                  )}`,
                  {
                    state: {
                      templateId: row.original._id,
                      templateName: row.original.templatename,
                    },
                  }
                )
              }
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleRenameOpen(row.original)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Rename"
            >
              <PenLine className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleDeleteOpen(row.original)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={handleCreateTemplate}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Template
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />
      <DataTable
        columns={folderColumns}
        data={templates}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No folder templates found"
        emptyDescription="Create your first folder template to get started"
        pageSize={5}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Rename Dialog */}
      {renameDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Rename Template</h3>
            <Form {...renameForm}>
              <form
                onSubmit={renameForm.handleSubmit(handleRenameSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={renameForm.control}
                  name="templatename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="New template name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRenameDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Delete Template</h3>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{selectedTemplate?.templatename}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderTemplateList;