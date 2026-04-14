import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";

import { accountsAPI, templateAPI } from "../../services/api"; // ✅ adjust path
import { useAuth } from "../../context/AuthContext"; // adjust path
const AccountCSVImport = () => {
    const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [defaultTags, setDefaultTags] = useState([]);

  const tableHeaders = [
    "id",
    "Account Name",
    "Account Type",
    "Tags",
    "Assigned Tags", // ✅ NEW COLUMN
    "Linked Contact #1",
    "Linked Contact #2",
    "Linked Contact #3",
    "Linked Contact #4",
  ];

  // 📌 Fetch Default Tags
  const fetchDefaultTags = async () => {
    try {
     const res = await templateAPI.getDefaultTags();
      setDefaultTags(res.data.tags || []);
    //   console.log("res.data",res)
    } catch (err) {
      console.error("Error fetching default tags", err);
    }
  };

  useEffect(() => {
    fetchDefaultTags();
  }, []);

  // 📌 Get Tag IDs by Name
  const getTagIds = (row) => {
    const importedTag = defaultTags.find(
      (t) => t.tagName === "Imported Account"
    );

    // const isIncomplete =
    //   !row["Account Name"] ||
    //   !row["Account Type"] ||
    //   !row["Linked Contact #1"];

    const incompleteTag = defaultTags.find(
      (t) => t.tagName === "Incomplete Data"
    );

    let tags = [];

    if (importedTag) tags.push(importedTag._id);
    if (incompleteTag) tags.push(incompleteTag._id);
// console.log("defaulttags",tags)
    return tags;
  };

  // 📌 CSV Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRows(result.data);
      },
    });
  };

  // 📌 Select Row
  const handleSelectRow = (index) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // 📌 Select All
  const handleSelectAll = () => {
    if (selectedRows.length === rows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(rows.map((_, index) => index));
    }
  };


// 📌 Save Selected Accounts
const handleSaveAccounts = async () => {
  if (selectedRows.length === 0) {
    alert("Please select at least one account");
    return;
  }

  setIsSaving(true);

  try {
    for (let index of selectedRows) {
      const r = rows[index];

      const payload = {
        id: r["id"] || "",
        accountName: r["Account Name"] || "",
        accountType: r["Account Type"] || "",
        linkedContacts: [
          r["Linked Contact #1"],
          r["Linked Contact #2"],
          r["Linked Contact #3"],
          r["Linked Contact #4"],
        ].filter(Boolean), // ✅ remove empty values
        tags: getTagIds(r), // ✅ dynamic tags
        adminUserId: user?.id, // ✅ from auth context
      };

      await accountsAPI.createAccountFromCSV(payload);
      // OR if using axios directly:
      // await axios.post("/api/accounts/csv-import", payload);
    }

    // 🔥 Remove saved rows from table
    setRows((prev) =>
      prev.filter((_, idx) => !selectedRows.includes(idx))
    );

    setSelectedRows([]);

    alert("Accounts saved successfully!");
  } catch (error) {
    console.error("Account Save Error:", error);
    alert("Error saving accounts");
  } finally {
    setIsSaving(false); // ✅ re-enable button
  }
};

  // 📌 Render Tag Chips
  const renderTags = (row) => {
    const tagIds = getTagIds(row);

    return defaultTags
      .filter((t) => tagIds.includes(t._id))
      .map((t) => (
        <Chip
          key={t._id}
          label={t.tagName}
          size="small"
          sx={{ mr: 0.5 }}
        />
      ));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Import Accounts (CSV)
      </Typography>

      <Button variant="contained" component="label">
        Upload CSV
        <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
      </Button>

      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
          onClick={handleSaveAccounts}
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : `Save Accounts (${selectedRows.length})`}
        </Button>
      )}

      {rows.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selectedRows.length === rows.length && rows.length > 0
                    }
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < rows.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>

                {tableHeaders.map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: "bold" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onChange={() => handleSelectRow(rowIndex)}
                    />
                  </TableCell>

                  <TableCell>{row["id"]}</TableCell>
                  <TableCell>{row["Account Name"]}</TableCell>
                  <TableCell>{row["Account Type"]}</TableCell>
                  <TableCell>{row["Tags"]}</TableCell>

                  {/* ✅ NEW TAG COLUMN */}
                  <TableCell>{renderTags(row)}</TableCell>

                  <TableCell>{row["Linked Contact #1"]}</TableCell>
                  <TableCell>{row["Linked Contact #2"]}</TableCell>
                  <TableCell>{row["Linked Contact #3"]}</TableCell>
                  <TableCell>{row["Linked Contact #4"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AccountCSVImport;