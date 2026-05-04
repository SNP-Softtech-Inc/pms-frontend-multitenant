// import React, { useState, useEffect } from "react";
// import {
//   Paper,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   IconButton,
//   Typography,
//   Box,
//   TableContainer,
//   Button,
//   CircularProgress,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { CiMenuKebab } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { useConfirm } from "../components/ConfirmDialogContext";
// import { TablePagination } from "@mui/material";
// // ✅ IMPORT APIs
// import { accountsAPI, proposalAPI } from "../services/api"; // adjust path if needed

// const ProposalsEls = () => {
//   const [proposallist, setProposalList] = useState([]);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("active");
//   const [loading, setLoading] = useState(false);
//   const confirm = useConfirm();
// const [page, setPage] = useState(0);
// const [rowsPerPage, setRowsPerPage] = useState(10);
//   const navigate = useNavigate();
// const handleChangePage = (event, newPage) => {
//   setPage(newPage);
// };

// const handleChangeRowsPerPage = (event) => {
//   setRowsPerPage(parseInt(event.target.value, 10));
//   setPage(0);
// };
//   // ================= FETCH DATA =================
//   const fetchPrprosalsAllData = async () => {
//     try {
//       setLoading(true);

//       // 1️⃣ Fetch accounts
//       const accountsResponse = await accountsAPI.getAccountsList(
//         filterStatus === "active",
//       );

//       const accountsData = accountsResponse.data.accountlist || [];

//       if (!accountsData.length) {
//         setProposalList([]);
//         setLoading(false);
//         return;
//       }

//       // 2️⃣ Extract account IDs
//       const accountIds = accountsData.map((acc) => acc._id);

//       // 3️⃣ Fetch proposals
//       const response =
//         await proposalAPI.getAccountProposalsByAccountIds(accountIds);

//       setProposalList(response.data.proposallist || []);
//       console.log("Fetched Proposals:", response.data.proposallist);
//     } catch (error) {
//       console.error("Error fetching proposals:", error);
//       toast.error("Failed to fetch proposals");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPrprosalsAllData();
//   }, [filterStatus]);

//   // ================= HANDLERS =================
//   const handleEdit = (_id, accountId) => {
//     navigate(
//       `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${_id}`,
//     );
//   };

//   const handleAccountDash = (accountId) => {
//     navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
//   };

//   const toggleMenu = (_id) => {
//     setOpenMenuId(openMenuId === _id ? null : _id);
//   };

//   const handleDelete = (_id) => {
//     confirm({
//       title: "Delete Proposal",
//       description: "Are you sure you want to delete this proposal?",
//       onConfirm: async () => {
//         try {
//           const res = await proposalAPI.deleteMultipleAccountProposals({
//             proposalIds: [_id], // ✅ pass single id as array
//           });

//           toast.success(res.data.message || "Deleted successfully");

//           // ✅ Option 2 (if you prefer API refresh)
//           fetchPrprosalsAllData();
//         } catch (err) {
//           console.error(err);
//           toast.error(err.response?.data?.message || "Delete failed");
//         } finally {
//           setOpenMenuId(null); // safe call
//         }
//       },
//     });
//   };
//   const handleCreateProposal = () => {
//     navigate("/billing/proposalsandels/new");
//   };

//   // ================= UI =================
//   return (
//     <Box>
//       {/* HEADER */}
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           mb: 2,
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold">
//           Proposals & Els
//         </Typography>

//         <Button variant="contained" onClick={handleCreateProposal}>
//           New Proposals & Els
//         </Button>
//       </Box>

//       {/* LOADING */}
//       {loading ? (
//         <Box textAlign="center" mt={5}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <TableContainer component={Paper} sx={{ overflow: "visible" }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   "Client Name",
//                   "Proposal Name",
//                   "Status",
//                   "Payment",
//                   "Auth",
//                   "Invoicing",
//                   "Date",
//                   "Signed",
//                   "Settings",
//                 ].map((header, i) => (
//                   <TableCell
//                     key={i}
//                     sx={{
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       padding: "16px",
//                     }}
//                   >
//                     {header}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {proposallist.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={9} align="center">
//                     No proposals found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 // proposallist.map((row) => (
//                   proposallist
//   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//   .map((row) => (
//                   <TableRow key={row._id}>
//                     {/* CLIENT NAME */}
//                     <TableCell>
//                       <Typography
//                         sx={{
//                           fontSize: "12px",
//                           cursor: "pointer",
//                           color: "#3f51b5",
//                         }}
//                         onClick={() =>
//                           handleAccountDash(row.general.account?.[0]?._id)
//                         }
//                       >
//                         {row.general.account?.[0]?.accountName || "—"}
//                       </Typography>
//                     </TableCell>

//                     {/* PROPOSAL NAME */}
//                     <TableCell>
//                       <Typography
//                         sx={{
//                           fontSize: "12px",
//                           cursor: "pointer",
//                           color: "#3f51b5",
//                         }}
//                         onClick={() =>
//                           handleEdit(row._id, row.general.account?.[0]?._id)
//                         }
//                       >
//                         {row.general.proposalName || "Untitled"}
//                       </Typography>
//                     </TableCell>

//                     {/* STATUS */}
//                     <TableCell sx={{ fontSize: "12px" }}>
//                       {row.status}
//                     </TableCell>

//                     {/* PLACEHOLDERS */}
//                     <TableCell>—</TableCell>
//                     <TableCell>—</TableCell>
//                     <TableCell>—</TableCell>

//                     {/* DATE */}
//                     <TableCell sx={{ fontSize: "12px" }}>
//                       {row.createdAt
//                         ? new Intl.DateTimeFormat("en-US", {
//                             day: "2-digit",
//                             month: "2-digit",
//                             year: "numeric",
//                           }).format(new Date(row.createdAt))
//                         : "—"}
//                     </TableCell>

//                     <TableCell>—</TableCell>

//                     {/* SETTINGS */}
//                     <TableCell sx={{ position: "relative" }}>
//                       <IconButton
//                         onClick={() => toggleMenu(row._id)}
//                         sx={{ color: "#2c59fa" }}
//                       >
//                         <CiMenuKebab size={22} />
//                       </IconButton>

//                       {openMenuId === row._id && (
//                         <Box
//                           sx={{
//                             position: "absolute",
//                             zIndex: 10,
//                             backgroundColor: "#fff",
//                             boxShadow: 3,
//                             borderRadius: 1,
//                             p: 1,
//                             right: 0,
//                             mt: 1,
//                             minWidth: "100px",
//                           }}
//                         >
//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               fontWeight: "bold",
//                               cursor: "pointer",
//                               mb: 1,
//                             }}
//                             onClick={() =>
//                               handleEdit(row._id, row.general.account?.[0]?._id)
//                             }
//                           >
//                             Edit
//                           </Typography>

//                           <Typography
//                             sx={{
//                               fontSize: "12px",
//                               color: "red",
//                               fontWeight: "bold",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => handleDelete(row._id)}
//                           >
//                             Delete
//                           </Typography>
//                         </Box>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//           <TablePagination
//   component="div"
//   count={proposallist.length}
//   page={page}
//   onPageChange={handleChangePage}
//   rowsPerPage={rowsPerPage}
//   onRowsPerPageChange={handleChangeRowsPerPage}
//   rowsPerPageOptions={[5, 10, 25, 50]}
// />
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default ProposalsEls;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { toast } from "react-toastify";
import { useConfirm } from "../components/ConfirmDialogContext";
import { accountsAPI, proposalAPI } from "../services/api";
import { DataTable } from "../components/data-table/data-table";
import { DataTableToolbar } from "../components/data-table/toolbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// import { LoadingSpinner } from "../components/ui/loading-spinner";

const ProposalsEls = () => {
  const [proposallist, setProposalList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // ================= FETCH DATA =================
  const fetchPrprosalsAllData = async () => {
    try {
      setLoading(true);

      const accountsResponse = await accountsAPI.getAccountsList(
        filterStatus === "active",
      );

      const accountsData = accountsResponse.data.accountlist || [];

      if (!accountsData.length) {
        setProposalList([]);
        setLoading(false);
        return;
      }

      const accountIds = accountsData.map((acc) => acc._id);

      const response =
        await proposalAPI.getAccountProposalsByAccountIds(accountIds);

      setProposalList(response.data.proposallist || []);
      console.log("Fetched Proposals:", response.data.proposallist);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      toast.error("Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrprosalsAllData();
  }, [filterStatus]);

  // ================= HANDLERS =================
  const handleEdit = (_id, accountId) => {
    navigate(
      `/clients/accounts/accountsdash/proposals/${accountId}/account-proposal?edit=${_id}`,
    );
  };

  const handleAccountDash = (accountId) => {
    navigate(`/clients/accounts/accountsdash/overview/${accountId}`);
  };

  const handleDelete = (_id) => {
    confirm({
      title: "Delete Proposal",
      description: "Are you sure you want to delete this proposal?",
      onConfirm: async () => {
        try {
          const res = await proposalAPI.deleteMultipleAccountProposals({
            proposalIds: [_id],
          });

          toast.success(res.data.message || "Deleted successfully");
          fetchPrprosalsAllData();
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Delete failed");
        }
      },
    });
  };

  const handleCreateProposal = () => {
    navigate("/billing/proposalsandels/new");
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      accessorKey: "clientName",
      header: "Client Name",
      cell: ({ row }) => {
        const account = row.original.general?.account;
        const accountId = account?._id;
        const accountName = account?.accountName || "—";
        
        return (
          <span
            className="text-sm cursor-pointer text-blue-600 hover:text-blue-800"
            onClick={() => handleAccountDash(accountId)}
          >
            {accountName}
          </span>
        );
      },
    },
    {
      accessorKey: "proposalName",
      header: "Proposal Name",
      cell: ({ row }) => (
        <span
          className="text-sm cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={() =>
            handleEdit(row.original._id, row.original.general.account?._id)
          }
        >
          {row.original.general.proposalName || "Untitled"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.status}</span>
      ),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: () => <span className="text-sm">—</span>,
    },
    {
      accessorKey: "auth",
      header: "Auth",
      cell: () => <span className="text-sm">—</span>,
    },
    {
      accessorKey: "invoicing",
      header: "Invoicing",
      cell: () => <span className="text-sm">—</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.createdAt
            ? new Intl.DateTimeFormat("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(row.original.createdAt))
            : "—"}
        </span>
      ),
    },
    {
      accessorKey: "signed",
      header: "Signed",
      cell: () => <span className="text-sm">—</span>,
    },
    {
      accessorKey: "settings",
      header: "Settings",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <CiMenuKebab size={22} className="text-[#2c59fa]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[100px]">
            <DropdownMenuItem
              onClick={() =>
                handleEdit(row.original._id, row.original.general.account?.[0]?._id)
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original._id)}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // ================= UI =================
  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center mt-10">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">Proposals & Els</h2>
        <Button onClick={handleCreateProposal}>
          New Proposals & Els
        </Button>
      </div>

      {/* DATA TABLE */}
      <DataTable
        data={proposallist}
        columns={columns}
        toolbar={<DataTableToolbar />}
        pagination={{
          page,
          pageSize: rowsPerPage,
          totalCount: proposallist.length,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setRowsPerPage(size);
            setPage(0);
          },
          pageSizeOptions: [5, 10, 25, 50],
        }}
      />
    </div>
  );
};

export default ProposalsEls;