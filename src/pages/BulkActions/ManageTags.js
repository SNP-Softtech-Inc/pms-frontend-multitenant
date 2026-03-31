// import React, { useEffect, useState, useMemo } from "react";
import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Select, MenuItem,
  Button, Typography, Box, Paper, Chip, CircularProgress
} from "@mui/material";
import { toast } from "react-toastify";

import { accountsAPI, templateAPI } from "../../services/api"; // ✅ adjust path
const ManageTags = forwardRef(({ selectedAccounts, onClose, fetchData }, ref) => {
// const ManageTags = ({ selectedAccounts, onClose, fetchData }) => {
  const [tags, setTags] = useState([]);
  const [tagActions, setTagActions] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= FETCH TAGS =================
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await templateAPI.getAllTags();
      const data = res.data;

      setTags(data.tags || []);

      // Initialize actions
      const initial = {};
      data.tags.forEach((tag) => {
        initial[tag._id] = "Do nothing";
      });

      setTagActions(initial);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleActionChange = (tagId, value) => {
    setTagActions((prev) => ({
      ...prev,
      [tagId]: value,
    }));
  };

  // ================= FILTER TAGS =================
  const assignTags = useMemo(
    () =>
      Object.keys(tagActions).filter(
        (id) => tagActions[id] === "Assign to all"
      ),
    [tagActions]
  );

  const removeTags = useMemo(
    () =>
      Object.keys(tagActions).filter(
        (id) => tagActions[id] === "Remove from all"
      ),
    [tagActions]
  );

  // ================= API CALL =================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (assignTags.length > 0) {
        await accountsAPI.assignBulkTags({
          accounts: selectedAccounts,
          tags: assignTags,
        });
      }

      if (removeTags.length > 0) {
        await accountsAPI.removeBulkTags({
          accounts: selectedAccounts,
          tags: removeTags,
        });
      }

      toast.success("Tags updated successfully");
      fetchData();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
useImperativeHandle(ref, () => ({
  submit: handleSubmit,
}));
  // ================= UI =================
  return (
    <Box sx={{ p: 2 }}>
     

      {/* TABLE */}
      <TableContainer
        component={Paper}
        
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Tag</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : (
              tags.map((tag) => (
                <TableRow key={tag._id} hover>
                  {/* TAG */}
                  <TableCell>
                    <Chip
                      label={tag.tagName}
                      size="small"
                      sx={{
                        backgroundColor: tag.tagColour,
                        color: "#fff",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>

                  {/* ACTION */}
                  <TableCell align="right">
                    <Select
                      value={tagActions[tag._id] || "Do nothing"}
                      onChange={(e) =>
                        handleActionChange(tag._id, e.target.value)
                      }
                      size="small"
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="Assign to all">
                        Assign
                      </MenuItem>
                      <MenuItem value="Remove from all">
                        Remove
                      </MenuItem>
                      <MenuItem value="Do nothing">
                        Do nothing
                      </MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

     
    </Box>
  );
});

export default ManageTags;