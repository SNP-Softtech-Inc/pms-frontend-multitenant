import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Stack,
  Box,
  TextField,
  TablePagination,
} from "@mui/material";
import { toast } from "react-toastify";

// ✅ IMPORT APIs
import { accountsAPI, accountDocsAPI } from "../../services/api"; // adjust path

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedZip, setSelectedZip] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [folderName, setFolderName] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  // ✅ FETCH USING API FILE
  const fetchAccounts = async () => {
    try {
      const res = await accountsAPI.getAccountsWithImportedAndIncompleteTags();
      setAccounts(res.data?.accountlist || res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((account) =>
    account.accountName?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedAccounts = filteredAccounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // 👉 Select ZIP
  const handleSelectZip = (account) => {
    setSelectedAccount(account);
    setSelectedZip(null);
    setFolderName("");
    fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  // 👉 Handle ZIP selection
  const handleZipChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Only ZIP files are allowed");
      return;
    }

    const nameWithoutExt = file.name.replace(/\.zip$/i, "");

    setSelectedZip(file);
    setFolderName(nameWithoutExt);

    toast.success(`Selected ZIP: ${file.name}`);
  };

  const [isUploading, setIsUploading] = useState(false);

  // ✅ UPLOAD USING API FILE
  const handleUpload = async () => {
    if (!selectedZip || !selectedAccount) {
      toast.error("Please select a ZIP file first");
      return;
    }

    setIsUploading(true);

    const targetFolderPath = `${selectedAccount._id}/${folderName}`;

    const formData = new FormData();
    formData.append("folderZip", selectedZip);
    formData.append("folderName", folderName);
    formData.append("folderPath", targetFolderPath);
    formData.append("accountId", selectedAccount._id);

    try {
      await accountDocsAPI.uploadAccountFolderZip(formData);

      toast.success("ZIP uploaded successfully");

      setSelectedZip(null);
      setFolderName("");
      setSelectedAccount(null);

      fetchAccounts();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading)
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Paper>
    );

  if (error)
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );

  return (
    <>
      <Box sx={{ p: 2 }}>
        <TextField
          size="small"
          placeholder="Search by account name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Account Name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Upload ZIP</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedAccounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.accountName}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleSelectZip(account)}
                    >
                      Select ZIP
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleUpload}
                      disabled={
                        isUploading ||
                        !selectedZip ||
                        selectedAccount?._id !== account._id
                      }
                    >
                      {isUploading ? "Processing..." : "Upload"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredAccounts.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      {/* Hidden ZIP input */}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept=".zip"
        onChange={handleZipChange}
      />
    </>
  );
};

export default AccountTable;