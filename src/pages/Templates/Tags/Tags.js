import React, { useState, useEffect,  } from "react";

import {
  TableContainer,
  Paper,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Box,
  Button,
  Typography,
  Drawer,
  Select,
  MenuItem,
  IconButton,
  TextField,
 
  CircularProgress,
  Menu,
} from "@mui/material";

import { CiMenuKebab } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { templateAPI } from "../../../services/api"; // adjust path

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [getId, setGetId] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDrawerClose =()=>{
    setIsDrawerOpen(false)
  }

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH =================
const fetchData = async () => {
  setLoading(true);
  try {
    const res = await templateAPI.getAccountCountOfTag();

    console.log("API:", res.data);

    setTags(res.data.tagCounts || []); // ✅ FIX
  } catch (err) {
    toast.error("Failed to fetch tags");
    setTags([]);
  } finally {
    setLoading(false);
  }
};

  // ================= OPTIONS =================
  const generateOptions = (value) => {
    return colors.map((color, index) => ({
      value: `${value}-${index}`,
      tagName: value,
      tagColour: color,
    }));
  };

  const handleInputChange = (value) => {
    setInputValue(value);
    setOptions(generateOptions(value));
  };

  const handleChange = (e) => {
    const selected = options.find((o) => o.tagColour === e.target.value);
    setSelectedOption(selected);
  };

  // ================= RESET =================
  const resetForm = () => {
    setInputValue("");
    setSelectedOption(null);
    setOptions([]);
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
      handleDrawerClose();
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    try {
      await templateAPI.updateTags(getId, {
        tagName: inputValue,
        tagColour: selectedOption.tagColour,
      });

      toast.success("Updated successfully");
      fetchData();
      handleDrawerClose();
      resetForm();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tag?")) return;

    try {
      await templateAPI.deleteTags(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTagById(id);
      const tag = res.data.tag;

      setGetId(id);
      setInputValue(tag.tagName);

      const opts = generateOptions(tag.tagName);
      setOptions(opts);

      const selected = opts.find((o) => o.tagColour === tag.tagColour);
      setSelectedOption(selected);

      setIsEdit(true);
      setIsDrawerOpen(true);
    } catch {
      toast.error("Failed to load tag");
    }
  };

  // ================= MENU =================
  const handleMenuOpen = (e, id) => {
    setAnchorEl(e.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  // ================= SEARCH =================
  const filteredTags = tags.filter((tag) =>
    tag.tagName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================= PAGINATION =================
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedTags = filteredTags.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="tag-container">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6">Tags</Typography>

        <Box display="flex" gap={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Button
            variant="contained"
            onClick={() => {
              setIsEdit(false);
              setIsDrawerOpen(true);
            }}
          >
            Add Tag
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tag</TableCell>
                <TableCell>Accounts</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedTags.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <Chip
                      label={row.tagName}
                      sx={{
                        backgroundColor: row.tagColour,
                        color: "#fff",
                      }}
                    />
                  </TableCell>

                  <TableCell>{row.count}</TableCell>

                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, row._id)}
                    >
                      <CiMenuKebab />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleEdit(menuId);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDelete(menuId);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      {/* PAGINATION */}
      <TablePagination
        component="div"
        count={filteredTags.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />

      {/* SINGLE DRAWER */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          resetForm();
        }}
      >
        <Box p={3} width={350}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              {isEdit ? "Edit Tag" : "Create Tag"}
            </Typography>
            <IoClose onClick={() => setIsDrawerOpen(false)} />
          </Box>

          <TextField
            label="Tag Name"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          />

          <Select
            value={selectedOption?.tagColour || ""}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={{ mt: 2 }}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.tagColour}>
                <Box
                  sx={{
                    backgroundColor: opt.tagColour,
                    color: "#fff",
                    px: 1,
                    borderRadius: 1,
                  }}
                >
                  {opt.tagName}
                </Box>
              </MenuItem>
            ))}
          </Select>

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={isEdit ? handleUpdate : handleSubmit}
            >
              {isEdit ? "Update" : "Create"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => {
                setIsDrawerOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Tags;