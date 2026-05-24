// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useConfirm } from "../../../components/ConfirmDialogContext";
// // ✅ use centralized API
// import { accountDocsAPI } from "../../../services/api"; // adjust path

// const Approvals = () => {
//   const { accountId } = useParams();
//   const [approvals, setApprovals] = useState([]);
// const confirm = useConfirm();
//   // ✅ Fetch approvals
//   useEffect(() => {
//     const fetchApprovals = async () => {
//       try {
//         const res = await accountDocsAPI.getApprovalsByAccount(accountId);
//         setApprovals(res?.data?.approvals || []);
//       } catch (err) {
//         console.error("Error fetching approvals:", err);

//         const errorMsg =
//           err?.response?.data?.message || "Failed to fetch approvals";

//         toast.error(errorMsg);
//       }
//     };

//     fetchApprovals();
//   }, [accountId]);

//   // ✅ Delete approval
//   const handleDelete = (id) => {
//   confirm({
//     title: "Delete Approval",
//     description: "Are you sure you want to delete this approval?",
//     onConfirm: async () => {
//       try {
//         await accountDocsAPI.deleteApproval(id);

//         // instant UI update
//         setApprovals((prev) => prev.filter((a) => a._id !== id));

//         toast.success("Approval deleted successfully");
//       } catch (err) {
//         console.error("Error deleting approval:", err);

//         const errorMsg =
//           err?.response?.data?.message || "Failed to delete approval";

//         toast.error(errorMsg);
//       }
//     },
//   });
// };

//   return (
//     <Box p={2}>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell><strong>Document Name</strong></TableCell>
//               <TableCell><strong>Status</strong></TableCell>
//               <TableCell><strong>Description</strong></TableCell>
//               <TableCell><strong>Created At</strong></TableCell>
//               <TableCell align="center"><strong>Action</strong></TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {approvals.length > 0 ? (
//               approvals.map((approval, index) => (
//                 <TableRow key={approval._id || index}>
//                   <TableCell>{approval.filename || "—"}</TableCell>

//                   {/* 🔥 status color */}
//                   <TableCell>
//                     <span
//                       style={{
//                         color:
//                           approval.status === "approved"
//                             ? "green"
//                             : approval.status === "rejected"
//                             ? "red"
//                             : "orange",
//                         fontWeight: 500,
//                       }}
//                     >
//                       {approval.status}
//                     </span>
//                   </TableCell>

//                   <TableCell>{approval.description || "—"}</TableCell>

//                   <TableCell>
//                     {approval.updatedAt
//                       ? new Date(approval.updatedAt).toLocaleString("en-US", {
//                           month: "2-digit",
//                           day: "2-digit",
//                           year: "numeric",
//                         })
//                       : "—"}
//                   </TableCell>

//                   <TableCell align="center">
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete(approval._id)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No approvals found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default Approvals;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { useConfirm } from "../../../components/ConfirmDialogContext";
// ✅ use centralized API
import { accountDocsAPI } from "../../../services/api"; // adjust path

// shadcn/ui components (you'll need to install these)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";


const Approvals = () => {
  const { accountId } = useParams();
  const [approvals, setApprovals] = useState([]);
  const confirm = useConfirm();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);

  // ✅ Fetch approvals
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const res = await accountDocsAPI.getApprovalsByAccount(accountId);
        setApprovals(res?.data?.approvals || []);
      } catch (err) {
        console.error("Error fetching approvals:", err);

        const errorMsg =
          err?.response?.data?.message || "Failed to fetch approvals";

        toast.error(errorMsg);
      }
    };

    fetchApprovals();
  }, [accountId]);

  // ✅ Delete approval
  const handleDelete = (id) => {
    confirm({
      title: "Delete Approval",
      description: "Are you sure you want to delete this approval?",
      onConfirm: async () => {
        try {
          await accountDocsAPI.deleteApproval(id);

          // instant UI update
          setApprovals((prev) => prev.filter((a) => a._id !== id));

          toast.success("Approval deleted successfully");
        } catch (err) {
          console.error("Error deleting approval:", err);

          const errorMsg =
            err?.response?.data?.message || "Failed to delete approval";

          toast.error(errorMsg);
        }
      },
    });
  };

  const statusStyles = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") return "bg-green-50 text-green-700 border border-green-200";
    if (s === "rejected") return "bg-red-50 text-red-700 border border-red-200";
    if (s === "pending") return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-gray-600 border border-gray-200";
  };

  return (
  <div className="p-4 md:p-6 bg-background min-h-full">
    {/* Header */}
    <div className="mb-5">
      <h2
        className="text-base font-semibold text-foreground"
        style={{
          fontFamily: "var(--font-family)",
          fontSize:
            "calc(1rem * parseFloat(var(--font-scale)) / 100)",
        }}
      >
        Approvals
      </h2>

      <p
        className="mt-1 text-muted-foreground"
        style={{
          fontFamily: "var(--font-family)",
          fontSize:
            "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
        }}
      >
        Document approval requests for this account
      </p>
    </div>

    {/* Table Wrapper */}
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              {[
                "Document Name",
                "Status",
                "Description",
                "Created At",
              ].map((heading) => (
                <TableHead
                  key={heading}
                  className="
                    px-4 py-3
                    text-left
                    uppercase
                    tracking-wide
                    text-muted-foreground
                    font-semibold
                    whitespace-nowrap
                  "
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.72rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  {heading}
                </TableHead>
              ))}

              <TableHead
                className="
                  px-4 py-3
                  text-center
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  font-semibold
                  whitespace-nowrap
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.72rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Body */}
          <TableBody className="divide-y divide-border">
            {approvals.length > 0 ? (
              approvals.map((approval, index) => (
                <TableRow
                  key={approval._id || index}
                  className="
                    transition-colors
                    hover:bg-muted/30
                  "
                >
                  {/* File Name */}
                  <TableCell
                    className="px-4 py-3 font-medium text-foreground"
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.88rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    {approval.filename || "—"}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-4 py-3">
                    <span
                      className={`
                        inline-flex items-center
                        rounded-full
                        px-2.5 py-1
                        text-[11px]
                        font-semibold
                        ring-1 ring-inset
                        ${statusStyles(approval.status)}
                      `}
                      style={{
                        fontFamily: "var(--font-family)",
                      }}
                    >
                      {approval.status || "—"}
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell
                    className="
                      max-w-[220px]
                      truncate
                      px-4 py-3
                      text-muted-foreground
                    "
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    {approval.description || "—"}
                  </TableCell>

                  {/* Date */}
                  <TableCell
                    className="
                      whitespace-nowrap
                      px-4 py-3
                      text-muted-foreground
                    "
                    style={{
                      fontFamily: "var(--font-family)",
                      fontSize:
                        "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                    }}
                  >
                    {approval.updatedAt
                      ? new Date(approval.updatedAt).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-4 py-3 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(approval._id)}
                      title="Delete approval"
                      className="
                        h-8 w-8 rounded-lg
                        text-destructive/70
                        transition-all duration-200
                        hover:bg-destructive/10
                        hover:text-destructive
                      "
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-4 py-14 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full
                        border border-border
                        bg-muted/40
                      "
                    >
                      <Trash2
                        size={18}
                        className="text-muted-foreground/50"
                      />
                    </div>

                    <div className="space-y-1">
                      <p
                        className="font-medium text-foreground"
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.9rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
                        No approvals found
                      </p>

                      <p
                        className="text-muted-foreground"
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.78rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
                        Approval requests will appear here.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
);

  // return (
  //   <div className="p-4 md:p-6">
  //     <div className="mb-4">
  //       <h2 className="text-base font-semibold text-gray-800">Approvals</h2>
  //       <p className="text-xs text-gray-400 mt-0.5">
  //         Document approval requests for this account
  //       </p>
  //     </div>

  //     <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
  //       <div className="overflow-x-auto">
  //         <Table>
  //           <TableHeader>
  //             <TableRow className="bg-gray-50 border-b border-gray-200">
  //               <TableHead className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                 Document Name
  //               </TableHead>
  //               <TableHead className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                 Status
  //               </TableHead>
  //               <TableHead className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                 Description
  //               </TableHead>
  //               <TableHead className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                 Created At
  //               </TableHead>
  //               <TableHead className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
  //                 Action
  //               </TableHead>
  //             </TableRow>
  //           </TableHeader>

  //           <TableBody className="divide-y divide-gray-100">
  //             {approvals.length > 0 ? (
  //               approvals.map((approval, index) => (
  //                 <TableRow
  //                   key={approval._id || index}
  //                   className="hover:bg-gray-50 transition-colors"
  //                 >
  //                   <TableCell className="px-4 py-3 font-medium text-gray-800">
  //                     {approval.filename || "—"}
  //                   </TableCell>

  //                   <TableCell className="px-4 py-3">
  //                     <span
  //                       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusStyles(
  //                         approval.status
  //                       )}`}
  //                     >
  //                       {approval.status || "—"}
  //                     </span>
  //                   </TableCell>

  //                   <TableCell className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
  //                     {approval.description || "—"}
  //                   </TableCell>

  //                   <TableCell className="px-4 py-3 text-gray-500 whitespace-nowrap">
  //                     {approval.updatedAt
  //                       ? new Date(approval.updatedAt).toLocaleString("en-US", {
  //                           month: "2-digit",
  //                           day: "2-digit",
  //                           year: "numeric",
  //                         })
  //                       : "—"}
  //                   </TableCell>

  //                   <TableCell className="px-4 py-3 text-center">
  //                     <Button
  //                       type="button"
  //                       variant="ghost"
  //                       size="sm"
  //                       onClick={() => handleDelete(approval._id)}
  //                       className="inline-flex items-center justify-center w-8 h-8 p-0 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
  //                       title="Delete approval"
  //                     >
  //                       <Trash2 size={15} />
  //                     </Button>
  //                   </TableCell>
  //                 </TableRow>
  //               ))
  //             ) : (
  //               <TableRow>
  //                 <TableCell
  //                   colSpan={5}
  //                   className="px-4 py-12 text-center"
  //                 >
  //                   <div className="flex flex-col items-center gap-2">
  //                     <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
  //                       <Trash2 size={18} className="text-gray-300" />
  //                     </div>
  //                     <p className="text-sm text-gray-400">No approvals found.</p>
  //                   </div>
  //                 </TableCell>
  //               </TableRow>
  //             )}
  //           </TableBody>
  //         </Table>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Approvals;