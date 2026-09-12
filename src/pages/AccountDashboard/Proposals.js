// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   CircularProgress,
//   Box,
//   Alert,
//   Chip,
//   Button,
//   IconButton,
//   MenuItem,
//   Menu,
//   Checkbox,
//   TablePagination,
// } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// // import ProposalPreviewDialog from "./ProposalDialog";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { DeleteOutlineRounded } from "@mui/icons-material";
// import { proposalAPI } from "../../services/api"; // ✅ adjust path
// import ProposalPreviewDialog from "./Proposals/ProposalDialog";
// import { useConfirm } from "../../components/ConfirmDialogContext";


// const AccountProposalTable = () => {
//   const { accountId } = useParams();
//   const navigate = useNavigate();
// const confirm = useConfirm();
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedProposal, setSelectedProposal] = useState(null);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedIds, setSelectedIds] = useState([]);

//   // ================= FETCH DATA =================
//  useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const res = await proposalAPI.getAccountProposalsByAccountIds([
//         accountId,
//       ]);

//       console.log("Fetched proposals:", res.data.proposallist);

//       setProposals(res.data.proposallist || []);
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, [accountId]);

//   // ================= PAGINATION =================
//   const paginatedProposals = proposals.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   const isSelected = (id) => selectedIds.includes(id);

//   const handleSelectRow = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );
//   };

//   const handleSelectAllPage = (event) => {
//     if (event.target.checked) {
//       const pageIds = paginatedProposals.map((p) => p._id);
//       setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
//     } else {
//       const pageIds = paginatedProposals.map((p) => p._id);
//       setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
//     }
//   };

//   const allPageSelected =
//     paginatedProposals.length > 0 &&
//     paginatedProposals.every((p) => selectedIds.includes(p._id));

  
//   const handleBulkDelete = async () => {
//   confirm({
//     title: "Delete Proposals",
//     description: "Are you sure you want to delete selected proposals?",
//     onConfirm: async () => {
//       try {
//         const res = await proposalAPI.deleteMultipleAccountProposals({
//           proposalIds: selectedIds,
//         });

//         toast.success(res.data.message || "Deleted successfully");

//         setProposals((prev) =>
//           prev.filter((p) => !selectedIds.includes(p._id))
//         );

//         setSelectedIds([]);
//       } catch (err) {
//         console.error(err);
//         toast.error(err.response?.data?.message || "Delete failed");
//       }
//     },
//   });
// };

// const handleDelete = async () => {
//   if (!selectedProposal) return;

//   confirm({
//     title: "Delete Proposal",
//     description: "Are you sure you want to delete this proposal?",
//     onConfirm: async () => {
//       try {
//         const res = await proposalAPI.deleteMultipleAccountProposals({
//           proposalIds: [selectedProposal._id],
//         });

//         toast.success(res.data.message || "Deleted successfully");

//         setProposals((prev) =>
//           prev.filter((p) => p._id !== selectedProposal._id)
//         );
//       } catch (err) {
//         console.error(err);
//         toast.error(err.response?.data?.message || "Delete failed");
//       } finally {
//         handleMenuClose();
//       }
//     },
//   });
// };
  

//   // ================= MENU =================
//   const handleMenuOpen = (event, proposal) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedProposal(proposal);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setSelectedProposal(null);
//   };

//   // ================= NAVIGATION =================
//   const handleCreateNew = () => {
//     navigate(
//       `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal`
//     );
//   };

//   const handleEdit = () => {
//     navigate(
//       `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${selectedProposal._id}`
//     );
//   };

//   // ================= DIALOG =================
//   const handleOpenDialog = (proposal) => {
//     setSelectedProposal(proposal);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedProposal(null);
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//         <Typography sx={{ ml: 2 }}>Loading proposals...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return <Alert severity="error">Error: {error}</Alert>;
//   }

//   // ================= UI =================
//   return (
//     <Box sx={{ p: 3 }}>
//       <Box display="flex" justifyContent="space-between" mb={3}>
//         <Typography variant="h4">Proposals List</Typography>
//         <Button variant="contained" onClick={handleCreateNew}>
//           Create New Proposal
//         </Button>
//       </Box>

//       {selectedIds.length > 0 && (
//         <DeleteOutlineRounded
//           sx={{ color: "red", cursor: "pointer", mb: 2 }}
//           onClick={handleBulkDelete}
//         />
//       )}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={allPageSelected}
//                   indeterminate={
//                     selectedIds.length > 0 && !allPageSelected
//                   }
//                   onChange={handleSelectAllPage}
//                 />
//               </TableCell>
//               <TableCell>Proposal Name</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {paginatedProposals.map((proposal) => (
//               <TableRow key={proposal._id}>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={isSelected(proposal._id)}
//                     onChange={() => handleSelectRow(proposal._id)}
//                   />
//                 </TableCell>

//                 <TableCell>
//                   <Typography
//                     color="primary"
//                     sx={{ cursor: "pointer" }}
//                     onClick={() => handleOpenDialog(proposal)}
//                   >
//                     {proposal.general?.proposalName}
//                   </Typography>
//                 </TableCell>

//                 <TableCell>
//                   <Chip
//                     label={proposal.status}
//                     color={
//                       proposal.status === "Signed" ? "success" : "default"
//                     }
//                   />
//                 </TableCell>

//                 <TableCell>
//                   <IconButton onClick={(e) => handleMenuOpen(e, proposal)}>
//                     <MoreVertIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         component="div"
//         count={proposals.length}
//         page={page}
//         onPageChange={(e, newPage) => setPage(newPage)}
//         rowsPerPage={rowsPerPage}
//         onRowsPerPageChange={(e) =>
//           setRowsPerPage(parseInt(e.target.value, 10))
//         }
//       />

//       {/* MENU */}
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//         {selectedProposal?.status === "Signed" ? (
//           <MenuItem onClick={handleMenuClose}>Download</MenuItem>
//         ) : (
//           <MenuItem
//             onClick={() => {
//               handleEdit();
//               handleMenuClose();
//             }}
//           >
//             Edit
//           </MenuItem>
//         )}

//         <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
//           Delete
//         </MenuItem>
//       </Menu>

//       {/* EMPTY STATE */}
//       {proposals.length === 0 && (
//         <Box textAlign="center" mt={4}>
//           <Typography>No proposals available</Typography>
//           <Button variant="contained" onClick={handleCreateNew} sx={{ mt: 2 }}>
//             Create First Proposal
//           </Button>
//         </Box>
//       )}

//       {/* DIALOG */}
//       <ProposalPreviewDialog
//         open={openDialog}
//         handleClose={handleCloseDialog}
//         proposal={selectedProposal}
//       />
//     </Box>
//   );
// };

// export default AccountProposalTable;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {useToastContext} from "../../context/ToastContext"; // ✅ adjust path
import { proposalAPI } from "../../services/api";
import ProposalPreviewDialog from "./Proposals/ProposalDialog";
import { useConfirm } from "../../components/ConfirmDialogContext";
import { DataTable } from "../../components/data-table/data-table";
import { DataTableToolbar } from "../../components/data-table/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AccountProposalTable = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const {showToast} = useToastContext();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await proposalAPI.getAccountProposalsByAccountIds([
          accountId,
        ]);

        console.log("Fetched proposals:", res.data.proposallist);

        setProposals(res.data.proposallist || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountId]);

  // ================= PAGINATION =================
  const paginatedProposals = proposals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    confirm({
      title: "Delete Proposals",
      description: "Are you sure you want to delete selected proposals?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: selectedIds,
          });

          showToast({
            title: res.data.message || "Deleted successfully",
            type: "success",
          });

          setProposals((prev) =>
            prev.filter((p) => !selectedIds.includes(p._id))
          );

          setSelectedIds([]);
          setRowSelection({});
        } catch (err) {
          console.error(err);
          showToast({
            title: err.response?.data?.message || "Delete failed",
            type: "error",
          });
        }
      },
    });
  };
const handleDownload = async (proposal) => {
  if (!proposal) return;

  const {
    general,
    introduction,
    terms,
    services,
    payments,
    status,
    signature,
    signedAt,
    _id,
  } = proposal;

  // Design tokens — matches the pdf-lib version's palette
  const COLORS = {
    accent: "#3359B2",       // rgb(0.2,0.35,0.7)
    accentLine: "#4D73CC",   // rgb(0.3,0.45,0.8)
    bannerBg: "#F2F3FC",     // rgb(0.95,0.96,0.99)
    bannerLine: "#BFCCEB",   // rgb(0.75,0.8,0.92)
    label: "#4D4D80",        // rgb(0.3,0.3,0.5)
    tableHeaderBg: "#E6EDF7",// rgb(0.9,0.93,0.97)
    rowAlt: "#F2F5FA",       // rgb(0.95,0.96,0.98)
    text: "#1A1A1A",
    muted: "#808080",
    border: "#D9D9E0",
    green: "#1A991A",
    amber: "#CC991A",
  };

  const statusLabel = (status || "Draft").toUpperCase();
  const statusColor = status === "Signed" ? COLORS.green : COLORS.amber;
  const proposalId = (_id || "").toString().slice(-8);
  const today = new Date().toLocaleDateString();

  // ---------- shared CSS ----------
  const styleBlock = `
    <style>
      * { box-sizing: border-box; }
      .doc {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12px;
        color: ${COLORS.text};
        padding: 0 0 30px 0;
      }
      .banner {
        background: ${COLORS.bannerBg};
        border-top: 3px solid ${COLORS.accentLine};
        border-bottom: 1px solid ${COLORS.bannerLine};
        padding: 22px 40px 18px;
        text-align: center;
      }
      .banner h1 {
        margin: 0;
        font-size: 26px;
        letter-spacing: 1px;
        color: ${COLORS.accent};
        text-transform: uppercase;
      }
      .banner .subtitle {
        margin: 4px 0 0;
        font-size: 12px;
        color: #8080B3;
      }
      .status-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 40px 0;
      }
      .pill {
        display: inline-block;
        padding: 6px 16px;
        border-radius: 999px;
        background: ${statusColor};
        color: #fff;
        font-weight: bold;
        font-size: 11px;
        letter-spacing: 0.5px;
      }
      .proposal-id {
        font-style: italic;
        color: ${COLORS.muted};
        font-size: 11px;
      }
      .body {
        padding: 20px 40px 0;
      }
      .section {
        margin-bottom: 22px;
      }
      .section-header {
        position: relative;
        padding-left: 12px;
        margin-bottom: 10px;
        border-bottom: 1.5px solid ${COLORS.accentLine};
        padding-bottom: 6px;
      }
      .section-header::before {
        content: "";
        position: absolute;
        left: 0;
        top: 1px;
        width: 4px;
        height: 15px;
        background: ${COLORS.accent};
      }
      .section-header h2 {
        margin: 0;
        font-size: 14px;
        color: ${COLORS.text};
      }
      .two-col {
        display: flex;
        justify-content: space-between;
        padding: 4px 0;
        max-width: 420px;
      }
      .two-col .label {
        font-weight: bold;
        color: ${COLORS.label};
      }
      .two-col .value {
        color: ${COLORS.text};
      }
      .team-members {
        margin-top: 6px;
      }
      .team-members div {
        padding: 2px 0 2px 10px;
      }
      table.items {
        width: 100%;
        border-collapse: collapse;
        margin-top: 6px;
      }
      table.items thead th {
        background: ${COLORS.tableHeaderBg};
        color: ${COLORS.label};
        font-size: 10px;
        text-align: left;
        padding: 8px 10px;
        border-bottom: 1px solid ${COLORS.border};
      }
      table.items thead th.num { text-align: right; }
      table.items tbody td {
        padding: 8px 10px;
        font-size: 10.5px;
        border-bottom: 1px solid ${COLORS.border};
        vertical-align: top;
      }
      table.items tbody td.num { text-align: right; white-space: nowrap; }
      table.items tbody tr:nth-child(even) {
        background: ${COLORS.rowAlt};
      }
      table.items small {
        color: #666;
        display: block;
        margin-top: 2px;
      }
      .summary {
        max-width: 260px;
        margin-left: auto;
        margin-top: 10px;
        border-top: 1px solid ${COLORS.border};
        padding-top: 8px;
      }
      .summary .row {
        display: flex;
        justify-content: space-between;
        padding: 2px 0;
        font-size: 11px;
      }
      .summary .total {
        font-weight: bold;
        font-size: 13px;
        border-top: 1px solid ${COLORS.border};
        margin-top: 4px;
        padding-top: 6px;
      }
      .invoice-block + .invoice-block {
        margin-top: 24px;
        border-top: 1px dashed ${COLORS.border};
        padding-top: 16px;
      }
      .not-signed {
        color: #B33A3A;
        font-weight: bold;
      }
      .sig-box {
        margin-top: 10px;
        border: 1px solid ${COLORS.border};
        border-radius: 4px;
        padding: 12px 16px;
        display: inline-block;
        min-width: 240px;
      }
      .sig-box img {
        max-width: 260px;
        display: block;
      }
      .sig-typed {
        font-family: "Brush Script MT", cursive;
        font-size: 26px;
        border-bottom: 1px solid #999;
        padding: 4px 6px 10px;
        min-width: 200px;
      }
      .footer {
        margin: 30px 40px 0;
        border-top: 1px solid ${COLORS.border};
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        color: ${COLORS.muted};
      }
    </style>
  `;

  // ---------- INTRODUCTION ----------
  const introHtml = general?.introductionEnabled
    ? `
    <div class="section">
      <div class="section-header"><h2>Introduction</h2></div>
      ${introduction?.description || ""}
    </div>
  `
    : "";

  // ---------- TERMS ----------
  const termsHtml = general?.termsEnabled
    ? `
    <div class="section">
      <div class="section-header"><h2>Terms & Conditions</h2></div>
      ${terms?.description || ""}
    </div>
  `
    : "";

  // ---------- table row helper ----------
  const lineItemRows = (items, taxRate) =>
    (items || [])
      .map((item) => {
        const rate = Number(item.rate || 0);
        const qty = Number(item.quantity || 1);
        const base = rate * qty;
        const tax = item.tax ? (base * (taxRate || 0)) / 100 : 0;
        const total = base + tax;

        return `
          <tr>
            <td>
              <b>${item.productorService || ""}</b>
              ${item.description ? `<small>${item.description}</small>` : ""}
            </td>
            <td class="num">$${rate.toFixed(2)}</td>
            <td class="num">${qty}</td>
            <td class="num">$${tax.toFixed(2)}</td>
            <td class="num">$${total.toFixed(2)}</td>
          </tr>
        `;
      })
      .join("");

  const itemsTable = (items, taxRate) => `
    <table class="items">
      <thead>
        <tr>
          <th>Item / Service</th>
          <th class="num">Rate</th>
          <th class="num">Qty</th>
          <th class="num">Tax</th>
          <th class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemRows(items, taxRate)}
      </tbody>
    </table>
  `;

  // ---------- SERVICES (ITEMIZED) ----------
  let servicesHtml = "";

  if (general?.servicesEnabled && services?.option === "services") {
    servicesHtml = `
      <div class="section">
        <div class="section-header"><h2>Services & Pricing</h2></div>
        ${itemsTable(
          services?.itemizedData?.lineItems,
          services?.itemizedData?.taxRate
        )}
        <div class="summary">
          <div class="row total">
            <span>Total</span>
            <span>$${(services?.itemizedData?.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- SERVICES (INVOICE MODE) ----------
  if (general?.servicesEnabled && services?.option === "invoice") {
    const invoicesHtml = (services?.invoices || [])
      .map(
        (invoice, i) => `
      <div class="invoice-block">
        <h3 style="margin:0 0 8px;font-size:12.5px;color:${COLORS.accent};">
          Invoice ${i + 1}
        </h3>
        <div class="two-col">
          <span class="label">Amount:</span>
          <span class="value">$${(invoice?.totalAmount || 0).toFixed(2)}</span>
        </div>
        <div class="two-col">
          <span class="label">Will be issued:</span>
          <span class="value">${invoice?.issueinvoice || "N/A"}</span>
        </div>
        ${
          invoice?.description
            ? `<p style="margin:8px 0;">${invoice.description}</p>`
            : ""
        }
        ${itemsTable(invoice?.lineItems, invoice?.taxRate)}
        <div class="summary">
          <div class="row total">
            <span>Total</span>
            <span>$${(invoice?.totalAmount || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    servicesHtml = `
      <div class="section">
        <div class="section-header"><h2>Invoices</h2></div>
        ${invoicesHtml}
      </div>
    `;
  }

  // ---------- PAYMENTS ----------
  const paymentsHtml = general?.paymentsEnabled
    ? `
    <div class="section">
      <div class="section-header"><h2>Payment Information</h2></div>
      <div class="two-col">
        <span class="label">Payment Method:</span>
        <span class="value">${payments?.method || "Not specified"}</span>
      </div>
      <div class="two-col">
        <span class="label">Amount:</span>
        <span class="value">$${payments?.amount || 0}</span>
      </div>
    </div>
  `
    : "";

  // ---------- SIGNATURE ----------
  let signatureHtml = `
    <div class="section">
      <div class="section-header"><h2>Sign & Accept</h2></div>
      <p class="not-signed">Proposal not signed yet.</p>
    </div>
  `;

  if (status === "Signed") {
    signatureHtml = `
      <div class="section">
        <div class="section-header"><h2>Sign & Accept</h2></div>
        <div class="two-col">
          <span class="label">Signed By:</span>
          <span class="value">${general?.account?.accountName || "N/A"}</span>
        </div>
        <div class="two-col">
          <span class="label">Signed Date:</span>
          <span class="value">${
            signedAt ? new Date(signedAt).toLocaleString() : "N/A"
          }</span>
        </div>
        <div class="sig-box">
          ${
            signature?.startsWith("data:image")
              ? `<img src="${signature}" />`
              : `<div class="sig-typed">${signature || ""}</div>`
          }
        </div>
      </div>
    `;
  }

  // ---------- FULL HTML ----------
  const fullHtml = `
    ${styleBlock}
    <div class="doc">
      <div class="banner">
        <h1>Proposal</h1>
        <p class="subtitle">${general?.proposalName || "Untitled Proposal"}</p>
      </div>

      <div class="status-row">
        <span class="pill">Status: ${statusLabel}</span>
        <span class="proposal-id">#${proposalId}</span>
      </div>

      <div class="body">
        <div class="section">
          <div class="section-header"><h2>General Information</h2></div>
          <div class="two-col">
            <span class="label">Proposal Name:</span>
            <span class="value">${general?.proposalName || "N/A"}</span>
          </div>
          <div class="two-col">
            <span class="label">Account:</span>
            <span class="value">${general?.account?.accountName || "N/A"}</span>
          </div>
          <div class="two-col">
            <span class="label">Date:</span>
            <span class="value">${today}</span>
          </div>
          ${
            general?.teamMembers?.length
              ? `<div class="team-members">
                  <div class="label" style="font-weight:bold;">Team Members:</div>
                  ${general.teamMembers
                    .map(
                      (m) =>
                        `<div>- ${m?.name || m?.email || "Team Member"}</div>`
                    )
                    .join("")}
                </div>`
              : ""
          }
        </div>

        ${introHtml}
        ${termsHtml}
        ${servicesHtml}
        ${paymentsHtml}
        ${signatureHtml}
      </div>

      <div class="footer">
        <span>Proposal #${proposalId} | Generated: ${new Date().toLocaleString()}</span>
        <span>This is a computer-generated document</span>
      </div>
    </div>
  `;

  // ---------- RENDER ----------
  const tempDiv = document.createElement("div");
  tempDiv.style.width = "794px"; // A4 width @ ~96dpi for crisp html2canvas capture
  tempDiv.innerHTML = fullHtml;
  document.body.appendChild(tempDiv);

  const canvas = await html2canvas(tempDiv, { scale: 2, useCORS: true });
  const imgData = canvas.toDataURL("image/png");

  document.body.removeChild(tempDiv);

  const pdf = new jsPDF("p", "pt", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  // Paginate across multiple A4 pages instead of squashing everything
  // onto one page image
  const pageHeight = pdf.internal.pageSize.getHeight();
  let heightLeft = pdfHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${general?.proposalName || "Proposal"}.pdf`);
};
  const handleDelete = async (proposal) => {
    confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: [proposal._id],
          });

          showToast({
            title: res.data.message || "Deleted successfully",
            type: "success",
          });

          setProposals((prev) =>
            prev.filter((p) => p._id !== proposal._id)
          );
        } catch (err) {
          console.error(err);
          showToast({
            title: err.response?.data?.message || "Delete failed",
            type: "error",
          });
        }
      },
    });
  };

  // ================= NAVIGATION =================
  const handleCreateNew = () => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal`
    );
  };

  const handleEdit = (proposal) => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${proposal._id}`
    );
  };

  // ================= DIALOG =================
  const handleOpenDialog = (proposal) => {
    setSelectedProposal(proposal);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProposal(null);
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      id: "select",
      // header: ({ table }) => (
      //   <Checkbox
      //     checked={table.getIsAllPageRowsSelected()}
      //     onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      //     aria-label="Select all"
      //   />
      // ),
      // cell: ({ row }) => (
      //   <Checkbox
      //     checked={row.getIsSelected()}
      //     onCheckedChange={(value) => {
      //       row.toggleSelected(!!value);
      //       handleSelectRow(row.original._id);
      //     }}
      //     aria-label="Select row"
      //   />
      // ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "general.proposalName",
      header: "Proposal Name",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-primary hover:underline cursor-pointer"
          onClick={() => handleOpenDialog(row.original)}
        >
          {row.original.general?.proposalName || "Untitled"}
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "Signed" ? "default" : "secondary"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const proposal = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {proposal.status === "Signed" ? (
                <DropdownMenuItem onClick={() => {
              handleDownload(proposal);
          
            }}>Download</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handleEdit(proposal)}>
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => handleDelete(proposal)}
                className="text-red-600 focus:text-red-600"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // ================= TOOLBAR FILTERS =================
  const filters = [
    {
      id: "status",
      label: "Status",
      options: [
        { value: "Draft", label: "Draft" },
        { value: "Sent", label: "Sent" },
        { value: "Signed", label: "Signed" },
        { value: "Expired", label: "Expired" },
      ],
    },
  ];

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>Error: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Proposals List</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Proposal
        </Button>
      </div>

      {/* Bulk Delete Button */}
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleBulkDelete}
          className="mb-4"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selectedIds.length})
        </Button>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedProposals}
        toolbar={
          <DataTableToolbar
            filters={filters}
            onFilterChange={(filters) => {
              // Handle filter changes here
              console.log("Filters changed:", filters);
            }}
          />
        }
        onRowSelectionChange={(selection) => {
          const selected = Object.keys(selection).map(
            (index) => paginatedProposals[parseInt(index)]?._id
          ).filter(Boolean);
          setSelectedIds(selected);
        }}
      />



      {/* Dialog */}
      <ProposalPreviewDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        proposal={selectedProposal}
      />
    </div>
  );
};

export default AccountProposalTable;