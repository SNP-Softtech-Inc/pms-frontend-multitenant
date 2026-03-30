

import React, { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  CircularProgress,
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";

import { folderManagementAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
const FolderTemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");

  

  // 🔹 Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const confirm = useConfirm();

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await folderManagementAPI.getFolderTemplates();
        setTemplates(res.data.folderTemplates || []);
      } catch (err) {
        setError("Failed to fetch templates");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // 🔹 Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 🔹 Menu
  const handleMenuClick = (e, template) => {
    setAnchorEl(e.currentTarget);
    setSelectedTemplate(template);
  };

  const handleMenuClose = () => setAnchorEl(null);

  // 🔹 Rename
  const handleRenameOpen = () => {
    setRenameValue(selectedTemplate?.templatename || "");
    setRenameDialogOpen(true);
    handleMenuClose();
  };

  const handleRenameSubmit = async () => {
    try {
      await folderManagementAPI.renameFolderTemplate(
        selectedTemplate._id,
        { newName: renameValue }
      );

      setTemplates((prev) =>
        prev.map((t) =>
          t._id === selectedTemplate._id
            ? { ...t, templatename: renameValue }
            : t
        )
      );

      toast.success("Renamed");
      setRenameDialogOpen(false);
    } catch {
      toast.error("Rename failed");
    }
  };

  // 🔹 Delete
   // 🔹 Delete using confirm context
  const handleDelete = () => {
    confirm({
      title: "Delete Template",
      description: `Are you sure you want to delete "${selectedTemplate?.templatename}"?`,
      onConfirm: async () => {
        try {
          await folderManagementAPI.deleteFolderTemplate(selectedTemplate._id);
          setTemplates((prev) =>
            prev.filter((t) => t._id !== selectedTemplate._id)
          );
          toast.success("Deleted");
        } catch {
          toast.error("Delete failed");
        }
      },
    });
    handleMenuClose();
  };

  // 🔹 Paginated data
  const paginatedData = templates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box p={2}>
      <Button
        variant="contained"
        onClick={() => navigate("/firmtemp/templates/createfolder")}
        sx={{ mb: 2 }}
      >
        Create Template
      </Button>

      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow >
                  <TableCell>
                    Template Name
                  </TableCell>
                  <TableCell >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.map((template) => (
                  <TableRow key={template._id} hover>
                    <TableCell>
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(
                            `/firmtemp/templates/tree/${template._id}`,
                            {
                              state: {
                                templateId: template._id,
                                templateName:
                                  template.templatename,
                              },
                            }
                          )
                        }
                      >
                        {template.templatename ||
                          "Unnamed Template"}
                      </Typography>
                    </TableCell>

                    <TableCell >
                      <IconButton
                        onClick={(e) =>
                          handleMenuClick(e, template)
                        }
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
                {/* 🔹 Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() =>
            navigate(
              `/firmtemp/templates/tree/${selectedTemplate?._id}`
            )
          }
        >
       <RiEdit2Line style={{ marginRight: 8 }} />   Edit
        </MenuItem>
        <MenuItem onClick={handleRenameOpen}>
         <RiEdit2Line style={{ marginRight: 8 }} />  Rename
        </MenuItem>
        <MenuItem
          onClick={handleDelete}
        >
        <RiDeleteBin6Line style={{ marginRight: 8 }} />   Delete
        </MenuItem>
      </Menu>
            </Table>
             {/* 🔹 Pagination */}
          <TablePagination
            component="div"
            count={templates.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
          </TableContainer>

         
        </>
      )}

    

      {/* 🔹 Rename Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => setRenameDialogOpen(false)}
      >
        <DialogTitle>Rename Template</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={renameValue}
            onChange={(e) =>
              setRenameValue(e.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleRenameSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

     
    </Box>
  );
};

export default FolderTemplateList;