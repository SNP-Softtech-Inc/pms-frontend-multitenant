import React, { useState } from "react";
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
} from "@mui/material";

import { contactsAPI } from "../../services/api"; // ✅ use your API

const CSVImportContacts = () => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const tableHeaders = [
    "Contact Name",
    "First Name",
    "Middle Name",
    "Last Name",
    "Company Name",
    "Phone Numbers",
    "Email",
  ];

  // 📌 Read CSV
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

  // 📌 Save Contacts (UPDATED ✅)
  const handleSaveContacts = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one contact.");
      return;
    }

    setIsSaving(true);

    try {
      const contacts = selectedRows.map((index) => {
        const r = rows[index];

        return {
          firstName: r["First Name"] || "",
          middleName: r["Middle Name"] || "",
          lastName: r["Last Name"] || "",
          email: r["Email"] || r["Email Address"] || "",
          contactName:
            r["Contact Name"] ||
            `${r["First Name"] ?? ""} ${r["Last Name"] ?? ""}`,
          companyName: r["Company Name"] || "",
          phoneNumbers: r["Phone Numbers"] || r["Phone"] || "",
          login: false, // 🔒 no activation email
        };
      });

      // ✅ USING contactsAPI
      const response = await contactsAPI.createBulkContacts({ contacts });

      console.log("Bulk save response:", response.data);

      // 🔥 Remove saved rows
      const remainingRows = rows.filter(
        (_, idx) => !selectedRows.includes(idx)
      );

      setRows(remainingRows);
      setSelectedRows([]);

      alert(
        `Contacts processed successfully!\nSaved: ${response.data.savedCount}\nSkipped: ${response.data.skippedCount}`
      );
    } catch (error) {
      console.error(
        "Error saving contacts:",
        error.response?.data || error.message
      );
      alert("Error saving contacts");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Import Contacts (CSV)
      </Typography>

      {/* Upload */}
      <Button variant="contained" component="label">
        Upload CSV
        <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
      </Button>

      {/* Save */}
      {selectedRows.length > 0 && (
        <Button
          variant="contained"
          color="success"
          sx={{ ml: 2 }}
          onClick={handleSaveContacts}
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : `Save Contacts (${selectedRows.length})`}
        </Button>
      )}

      {/* Table */}
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

                {tableHeaders.map((header, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: "bold" }}>
                    {header}
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

                  <TableCell>
                    {row["Contact Name"] ||
                      `${row["First Name"] ?? ""} ${row["Last Name"] ?? ""}`}
                  </TableCell>

                  <TableCell>{row["First Name"] || ""}</TableCell>
                  <TableCell>{row["Middle Name"] || ""}</TableCell>
                  <TableCell>{row["Last Name"] || ""}</TableCell>
                  <TableCell>{row["Company Name"] || ""}</TableCell>
                  <TableCell>
                    {row["Phone Numbers"] || row["Phone"] || ""}
                  </TableCell>
                  <TableCell>
                    {row["Email"] || row["Email Address"] || ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CSVImportContacts;