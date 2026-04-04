import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TableContainer,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  TablePagination,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
} from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DeleteOutlineRounded } from "@mui/icons-material";

import OrganizerUpdate from "./Organizer/OrganizerUpdate";
import OrganizerDialog from "./Organizer/OrganizerDialog";
import { organizerAPI } from "../../services/api"; // ✅ IMPORTANT
import { useConfirm } from "../../components/ConfirmDialogContext";
const Organizers = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
const confirm = useConfirm();
  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [activeButton, setActiveButton] = useState("active");
  const [isActiveTrue, setIsActiveTrue] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedOrganizer, setSelectedOrganizer] = useState({});
  const [showForm, setShowForm] = useState(false);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameRowId, setRenameRowId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  // ================= FETCH =================
  const fetchOrganizerTemplates = async () => {
    try {
      const res = await organizerAPI.getActiveOrganizerByAccountId(
        accountId,
        isActiveTrue,
      );
      setOrganizerTemplatesData(res.data.organizerAccountWise);
      console.log(res.data.organizerAccountWise);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch organizers");
    }
  };

  useEffect(() => {
    fetchOrganizerTemplates();
  }, [isActiveTrue]);

  // ================= ACTIVE / ARCHIVE =================
  const handleActiveClick = () => {
    setIsActiveTrue(true);
    setActiveButton("active");
  };

  const handleArchivedClick = () => {
    setIsActiveTrue(false);
    setActiveButton("archived");
  };

  const handleArchive = async (_id, isActive) => {
    try {
      await organizerAPI.updateOrganizerStatus(_id, {
        active: !isActive,
      });
      toast.success("Updated successfully");
      fetchOrganizerTemplates();
    } catch {
      toast.error("Failed to update");
    }
  };

  // ================= SEAL =================
  const handleSealed = async (_id, issealed) => {
    try {
      await organizerAPI.updateOrganizerAccountWise(_id, {
        issealed,
        ...(issealed === false && { status: "In Progress" }),
      });
      toast.success("Updated successfully");
      fetchOrganizerTemplates();
    } catch {
      toast.error("Failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = (_id) => {
  confirm({
    title: "Delete Organizer",
    description: "Are you sure you want to delete this organizer?",
    onConfirm: async () => {
      try {
        await organizerAPI.deleteOrganizerAccountWise(_id);
        toast.success("Deleted");
        fetchOrganizerTemplates();
      } catch {
        toast.error("Delete failed");
      }
    },
  });
};

 const handleBulkDelete = () => {
  if (selectedIds.length === 0) {
    toast.warning("Select items first");
    return;
  }

  confirm({
    title: "Delete Selected Items",
    description: `Are you sure you want to delete ${selectedIds.length} selected items?`,
    onConfirm: async () => {
      try {
        await Promise.all(
          selectedIds.map((id) =>
            organizerAPI.deleteOrganizerAccountWise(id)
          )
        );
        toast.success("Deleted");
        setSelectedIds([]);
        fetchOrganizerTemplates();
      } catch {
        toast.error("Bulk delete failed");
      }
    },
  });
};

  // ================= RENAME =================
  const handleRenameConfirm = async () => {
    try {
      await organizerAPI.renameOrganizerAccountWise(renameRowId, {
        organizerName: renameValue,
      });

      setOrganizerTemplatesData((prev) =>
        prev.map((row) =>
          row._id === renameRowId
            ? { ...row, organizerName: renameValue }
            : row,
        ),
      );

      toast.success("Renamed");
    } catch {
      toast.error("Rename failed");
    }
  };

  // ================= TABLE =================
  const paginatedRows = organizerTemplatesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const isSelected = (id) => selectedIds.includes(id);

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSelectAllPage = (e) => {
    if (e.target.checked) {
      setSelectedIds(paginatedRows.map((row) => row._id));
    } else {
      setSelectedIds([]);
    }
  };

  // ================= MENU =================
  const toggleMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenuId(null);
  };

  // ================= NAVIGATION =================
  const handleCreate = () => {
    navigate(
      `/clients/accounts/accountsdash/organizers/${accountId}/accountorganizer`,
    );
  };

  const handleEdit = (id) => {
    setSelectedOrganizer(id);
    setShowForm(true);
  };
  const handleClosePreview = () => {
    setShowForm(false);
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Button variant="contained" onClick={handleCreate}>
        New Organizer
      </Button>

      {/* ACTIVE / ARCHIVED */}

      <ToggleButtonGroup
        value={isActiveTrue}
        exclusive
        size="small"
        
        onChange={(e, val) => {
          if (val !== null) {
            setIsActiveTrue(val);
            setActiveButton(val ? "active" : "archived"); // optional (if still used)
          }
        }}
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "20px",
          p: 0.5,
           ml: 2
        }}
      >
        <ToggleButton
          value={true}
          sx={{
            border: "none",
            borderRadius: "20px !important",
            px: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Active
        </ToggleButton>

        <ToggleButton
          value={false}
          sx={{
            border: "none",
            borderRadius: "20px !important",
            px: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Archived
        </ToggleButton>
      </ToggleButtonGroup>
      {!showForm ? (
        <>
          {/* BULK DELETE */}
          {selectedIds.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
              <DeleteOutlineRounded
                sx={{ color: "red", cursor: "pointer" }}
                onClick={handleBulkDelete}
              />
              <Typography>{selectedIds.length} selected</Typography>
            </Box>
          )}

          {/* TABLE */}
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox onChange={handleSelectAllPage} />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Seal</TableCell>
                  <TableCell>Settings</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                      />
                    </TableCell>

                    <TableCell
                      onClick={() => handleEdit(row._id)}
                      sx={{ cursor: "pointer", color: "#3f51b5" }}
                    >
                      {row.organizerName}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.status || "Pending"}
                        color={
                          row.status === "Completed" ? "success" : "default"
                        }
                        size="small"
                        sx={{ border: "none" }}
                      />
                    </TableCell>

                    <TableCell>
                      {row.issealed ? (
                        <Chip
                          label="Sealed"
                          color="primary"
                          sx={{
                            color: "#fff",

                            fontSize: "11px",
                          }}
                        />
                      ) : null}
                    </TableCell>

                    <TableCell>
                      <IconButton onClick={(e) => toggleMenu(e, row._id)}>
                        <CiMenuKebab />
                      </IconButton>
                    </TableCell>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenuId === row._id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleSealed(row._id, !row.issealed);
                          handleMenuClose();
                        }}
                      >
                        {row.issealed ? "Unseal" : "Seal"}
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          handleArchive(row._id, row.active);
                          handleMenuClose();
                        }}
                      >
                        {row.active ? "Archive" : "Restore"}
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          setRenameRowId(row._id);
                          setRenameValue(row.organizerName);
                          setRenameDialogOpen(true);
                          handleMenuClose();
                        }}
                      >
                        Rename
                      </MenuItem>

                      <MenuItem
                        sx={{ color: "red" }}
                        onClick={() => {
                          handleDelete(row._id);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Menu>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* PAGINATION */}
            <TablePagination
              component="div"
              count={organizerTemplatesData.length}
              page={page}
              onPageChange={(e, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) =>
                setRowsPerPage(parseInt(e.target.value, 10))
              }
            />
          </TableContainer>

          {/* RENAME DIALOG */}
          <Dialog
            open={renameDialogOpen}
            onClose={() => setRenameDialogOpen(false)}
          >
            <DialogTitle>Rename</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  handleRenameConfirm();
                  setRenameDialogOpen(false);
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <OrganizerUpdate
          OrganizerData={selectedOrganizer}
          onClose={handleClosePreview}
        />
      )}

      {/* CHANGE ANSWERS */}
      <OrganizerDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        organizer={selectedOrganizer}
        accountid={accountId}
      />
    </Box>
  );
};

export default Organizers;
