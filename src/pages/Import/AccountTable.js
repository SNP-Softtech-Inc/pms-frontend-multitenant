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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";

// ✅ IMPORT APIs
import { accountsAPI, accountDocsAPI } from "../../services/api"; // adjust path
import { readZipEntries } from "./readZip";
import { runImport } from "./zipImport";

const formatBytes = (bytes = 0) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
  if (bytes >= 1024 ** 2) return `${Math.round(bytes / 1024 ** 2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const formatCount = (n = 0) => n.toLocaleString("en-US");

// How many problems the summary lists before "and N more".
const PROBLEMS_SHOWN = 100;

const AccountTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedZip, setSelectedZip] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
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

    setSelectedZip(file);

    toast.success(`Selected ZIP: ${file.name}`);
  };

  const [isUploading, setIsUploading] = useState(false);
  // Running totals while an import runs; the outcome once it ends.
  const [progress, setProgress] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const cancelRef = useRef(false);

  // Leaving the page stops the import, so ask first.
  useEffect(() => {
    if (!isUploading) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isUploading]);

  // The browser reads the ZIP and sends its files one at a time
  // (zipImport.js), so the ZIP itself has no size limit and an interrupted
  // import carries on from where it stopped when run again.
  const handleUpload = async () => {
    if (!selectedZip || !selectedAccount) {
      toast.error("Please select a ZIP file first");
      return;
    }

    const account = selectedAccount;
    const zipFile = selectedZip;

    setIsUploading(true);
    setOutcome(null);
    setCancelling(false);
    cancelRef.current = false;
    setProgress({ phase: "reading", zipName: zipFile.name, accountName: account.accountName });

    let zip;
    try {
      zip = await readZipEntries(zipFile);
    } catch (err) {
      console.error(err);
      toast.error("This ZIP could not be read. It may be damaged, or not a ZIP file.");
      setProgress(null);
      setIsUploading(false);
      return;
    }

    try {
      const result = await runImport({
        entries: zip.entries,
        accountId: account._id,
        api: {
          prepare: accountDocsAPI.importPrepare,
          uploadFile: accountDocsAPI.importFile,
          finish: accountDocsAPI.importFinish,
        },
        onProgress: (p) =>
          setProgress({ phase: "uploading", zipName: zipFile.name, accountName: account.accountName, ...p }),
        shouldStop: () => cancelRef.current,
      });

      setOutcome({ ...result, zipName: zipFile.name, accountName: account.accountName });

      if (result.finished) {
        toast.success(`${account.accountName}: all files imported`);
        // Done with this one. After a partial import the ZIP stays
        // selected, so Upload again carries on where it stopped.
        setSelectedZip(null);
        setSelectedAccount(null);
        fetchAccounts();
      } else {
        toast.warning(`${account.accountName}: import incomplete - see the summary`);
      }
    } catch (err) {
      console.error(err);
      toast.error("The import stopped unexpectedly. Run it again - it carries on where it stopped.");
    } finally {
      zip.close();
      setProgress(null);
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setCancelling(true);
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

      {/* Import progress, then its outcome */}
      <Dialog open={Boolean(progress || outcome)} maxWidth="sm" fullWidth>
        {progress && (
          <>
            <DialogTitle>Importing into {progress.accountName}</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {progress.zipName}
              </Typography>

              {progress.phase === "reading" ? (
                <>
                  <LinearProgress sx={{ my: 2 }} />
                  <Typography variant="body2">Reading the ZIP…</Typography>
                </>
              ) : (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={progress.bytesTotal ? (progress.bytesDone / progress.bytesTotal) * 100 : 100}
                    sx={{ my: 2 }}
                  />
                  <Typography variant="body2">
                    {formatCount(progress.done)} of {formatCount(progress.totalFiles)} files ·{" "}
                    {formatBytes(progress.bytesDone)} of {formatBytes(progress.bytesTotal)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCount(progress.uploaded)} uploaded · {formatCount(progress.skipped)} already there ·{" "}
                    {formatCount(progress.problems)} not imported
                  </Typography>
                </>
              )}

              <Alert severity="info" sx={{ mt: 2 }}>
                Keep this tab open until the import ends. If it is interrupted, run it again with the
                same ZIP - files already uploaded are skipped.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancel} disabled={cancelling || progress.phase === "reading"}>
                {cancelling ? "Stopping after the files in progress…" : "Cancel"}
              </Button>
            </DialogActions>
          </>
        )}

        {!progress && outcome && (
          <>
            <DialogTitle>
              {outcome.finished ? "Import complete" : "Import incomplete"} - {outcome.accountName}
            </DialogTitle>
            <DialogContent>
              {outcome.finished ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  All {formatCount(outcome.totalFiles)} files are in the account, and it is no longer
                  marked Incomplete Data.
                </Alert>
              ) : (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {outcome.stopped ||
                    "Some files were not imported, so the account is still marked Incomplete Data."}{" "}
                  Files already uploaded are skipped if you run the import again.
                </Alert>
              )}

              <Typography variant="body2">
                {formatCount(outcome.uploaded)} uploaded · {formatCount(outcome.skipped)} were already
                there
                {outcome.notSent ? ` · ${formatCount(outcome.notSent)} not sent` : ""}
              </Typography>

              {outcome.problems.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: 280, overflowY: "auto" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Not imported ({formatCount(outcome.problems.length)})
                  </Typography>
                  {outcome.problems.slice(0, PROBLEMS_SHOWN).map((p, i) => (
                    <Typography key={`${p.path}-${i}`} variant="body2" sx={{ wordBreak: "break-all" }}>
                      {p.path ? <strong>{p.path}</strong> : null} {p.reason}
                    </Typography>
                  ))}
                  {outcome.problems.length > PROBLEMS_SHOWN && (
                    <Typography variant="body2" color="text.secondary">
                      …and {formatCount(outcome.problems.length - PROBLEMS_SHOWN)} more
                    </Typography>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOutcome(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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