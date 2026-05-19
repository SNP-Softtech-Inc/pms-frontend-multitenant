// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   IconButton,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   TableContainer,
//   Menu,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Checkbox,
//   TablePagination,
//   ToggleButtonGroup,
//   ToggleButton,
//   MenuItem,
// } from "@mui/material";
// import { CiMenuKebab } from "react-icons/ci";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { DeleteOutlineRounded } from "@mui/icons-material";

// import OrganizerUpdate from "./Organizer/OrganizerUpdate";
// import OrganizerDialog from "./Organizer/OrganizerDialog";
// import { organizerAPI } from "../../services/api"; // ✅ IMPORTANT
// import { useConfirm } from "../../components/ConfirmDialogContext";
// const Organizers = () => {
//   const { accountId } = useParams();
//   const navigate = useNavigate();
// const confirm = useConfirm();
//   const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
//   const [openMenuId, setOpenMenuId] = useState(null);
//   const [anchorEl, setAnchorEl] = useState(null);

//   const [activeButton, setActiveButton] = useState("active");
//   const [isActiveTrue, setIsActiveTrue] = useState(true);

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedIds, setSelectedIds] = useState([]);

//   const [selectedOrganizer, setSelectedOrganizer] = useState({});
//   const [showForm, setShowForm] = useState(false);

//   const [renameDialogOpen, setRenameDialogOpen] = useState(false);
//   const [renameRowId, setRenameRowId] = useState(null);
//   const [renameValue, setRenameValue] = useState("");

//   const [openDialog, setOpenDialog] = useState(false);

//   // ================= FETCH =================
//   const fetchOrganizerTemplates = async () => {
//     try {
//       const res = await organizerAPI.getActiveOrganizerByAccountId(
//         accountId,
//         isActiveTrue,
//       );
//       setOrganizerTemplatesData(res.data.organizerAccountWise);
//       console.log("organizer list by accountid",res.data.organizerAccountWise);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to fetch organizers");
//     }
//   };

//   useEffect(() => {
//     fetchOrganizerTemplates();
//   }, [isActiveTrue]);

//   // ================= ACTIVE / ARCHIVE =================
//   const handleActiveClick = () => {
//     setIsActiveTrue(true);
//     setActiveButton("active");
//   };

//   const handleArchivedClick = () => {
//     setIsActiveTrue(false);
//     setActiveButton("archived");
//   };

//   const handleArchive = async (_id, isActive) => {
//     try {
//       await organizerAPI.updateOrganizerStatus(_id, {
//         active: !isActive,
//       });
//       toast.success("Updated successfully");
//       fetchOrganizerTemplates();
//     } catch {
//       toast.error("Failed to update");
//     }
//   };

//   // ================= SEAL =================
//   const handleSealed = async (_id, issealed) => {
//     try {
//       await organizerAPI.updateOrganizerAccountWise(_id, {
//         issealed,
//         ...(issealed === false && { status: "In Progress" }),
//       });
//       toast.success("Updated successfully");
//       fetchOrganizerTemplates();
//     } catch {
//       toast.error("Failed");
//     }
//   };

//   // ================= DELETE =================
//   const handleDelete = (_id) => {
//   confirm({
//     title: "Delete Organizer",
//     description: "Are you sure you want to delete this organizer?",
//     onConfirm: async () => {
//       try {
//         await organizerAPI.deleteOrganizerAccountWise(_id);
//         toast.success("Deleted");
//         fetchOrganizerTemplates();
//       } catch {
//         toast.error("Delete failed");
//       }
//     },
//   });
// };

//  const handleBulkDelete = () => {
//   if (selectedIds.length === 0) {
//     toast.warning("Select items first");
//     return;
//   }

//   confirm({
//     title: "Delete Selected Items",
//     description: `Are you sure you want to delete ${selectedIds.length} selected items?`,
//     onConfirm: async () => {
//       try {
//         await Promise.all(
//           selectedIds.map((id) =>
//             organizerAPI.deleteOrganizerAccountWise(id)
//           )
//         );
//         toast.success("Deleted");
//         setSelectedIds([]);
//         fetchOrganizerTemplates();
//       } catch {
//         toast.error("Bulk delete failed");
//       }
//     },
//   });
// };

//   // ================= RENAME =================
//   const handleRenameConfirm = async () => {
//     try {
//       await organizerAPI.renameOrganizerAccountWise(renameRowId, {
//         organizerName: renameValue,
//       });

//       setOrganizerTemplatesData((prev) =>
//         prev.map((row) =>
//           row._id === renameRowId
//             ? { ...row, organizerName: renameValue }
//             : row,
//         ),
//       );

//       toast.success("Renamed");
//     } catch {
//       toast.error("Rename failed");
//     }
//   };

//   // ================= TABLE =================
//   const paginatedRows = organizerTemplatesData.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage,
//   );

//   const isSelected = (id) => selectedIds.includes(id);

//   const handleSelectRow = (id) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
//     );
//   };

//   const handleSelectAllPage = (e) => {
//     if (e.target.checked) {
//       setSelectedIds(paginatedRows.map((row) => row._id));
//     } else {
//       setSelectedIds([]);
//     }
//   };

//   // ================= MENU =================
//   const toggleMenu = (event, id) => {
//     setAnchorEl(event.currentTarget);
//     setOpenMenuId(id);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     setOpenMenuId(null);
//   };

//   // ================= NAVIGATION =================
//   const handleCreate = () => {
//     navigate(
//       `/clients/accounts/accountsdash/organizers/${accountId}/accountorganizer`,
//     );
//   };

//   const handleEdit = (id) => {
//     setSelectedOrganizer(id);
//     setShowForm(true);
//   };
//   const handleClosePreview = () => {
//     setShowForm(false);
//   };
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Button variant="contained" onClick={handleCreate}>
//         New Organizer
//       </Button>

//       {/* ACTIVE / ARCHIVED */}

//       <ToggleButtonGroup
//         value={isActiveTrue}
//         exclusive
//         size="small"
        
//         onChange={(e, val) => {
//           if (val !== null) {
//             setIsActiveTrue(val);
//             setActiveButton(val ? "active" : "archived"); // optional (if still used)
//           }
//         }}
//         sx={{
//           backgroundColor: "#f5f5f5",
//           borderRadius: "20px",
//           p: 0.5,
//            ml: 2
//         }}
//       >
//         <ToggleButton
//           value={true}
//           sx={{
//             border: "none",
//             borderRadius: "20px !important",
//             px: 2,
//             textTransform: "none",
//             fontWeight: 500,
//           }}
//         >
//           Active
//         </ToggleButton>

//         <ToggleButton
//           value={false}
//           sx={{
//             border: "none",
//             borderRadius: "20px !important",
//             px: 2,
//             textTransform: "none",
//             fontWeight: 500,
//           }}
//         >
//           Archived
//         </ToggleButton>
//       </ToggleButtonGroup>
//       {!showForm ? (
//         <>
//           {/* BULK DELETE */}
//           {selectedIds.length > 0 && (
//             <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
//               <DeleteOutlineRounded
//                 sx={{ color: "red", cursor: "pointer" }}
//                 onClick={handleBulkDelete}
//               />
//               <Typography>{selectedIds.length} selected</Typography>
//             </Box>
//           )}

//           {/* TABLE */}
//           <TableContainer component={Paper} sx={{ mt: 3 }}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell padding="checkbox">
//                     <Checkbox onChange={handleSelectAllPage} />
//                   </TableCell>
//                   <TableCell>Name</TableCell>
//                   <TableCell>Status</TableCell>
//                   <TableCell>Seal</TableCell>
//                   <TableCell>Settings</TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {paginatedRows.map((row) => (
//                   <TableRow key={row._id}>
//                     <TableCell padding="checkbox">
//                       <Checkbox
//                         checked={isSelected(row._id)}
//                         onChange={() => handleSelectRow(row._id)}
//                       />
//                     </TableCell>

//                     <TableCell
//                       onClick={() => handleEdit(row._id)}
//                       sx={{ cursor: "pointer", color: "#3f51b5" }}
//                     >
//                       {row.organizerName}
//                     </TableCell>

//                     <TableCell>
//                       <Chip
//                         label={row.status || "Pending"}
//                         color={
//                           row.status === "Completed" ? "success" : "default"
//                         }
//                         size="small"
//                         sx={{ border: "none" }}
//                       />
//                     </TableCell>

//                     <TableCell>
//                       {row.issealed ? (
//                         <Chip
//                           label="Sealed"
//                           color="primary"
//                           sx={{
//                             color: "#fff",

//                             fontSize: "11px",
//                           }}
//                         />
//                       ) : null}
//                     </TableCell>

//                     <TableCell>
//                       <IconButton onClick={(e) => toggleMenu(e, row._id)}>
//                         <CiMenuKebab />
//                       </IconButton>
//                     </TableCell>
//                     <Menu
//                       anchorEl={anchorEl}
//                       open={openMenuId === row._id}
//                       onClose={handleMenuClose}
//                     >
//                       <MenuItem
//                         onClick={() => {
//                           handleSealed(row._id, !row.issealed);
//                           handleMenuClose();
//                         }}
//                       >
//                         {row.issealed ? "Unseal" : "Seal"}
//                       </MenuItem>

//                       <MenuItem
//                         onClick={() => {
//                           handleArchive(row._id, row.active);
//                           handleMenuClose();
//                         }}
//                       >
//                         {row.active ? "Archive" : "Restore"}
//                       </MenuItem>

//                       <MenuItem
//                         onClick={() => {
//                           setRenameRowId(row._id);
//                           setRenameValue(row.organizerName);
//                           setRenameDialogOpen(true);
//                           handleMenuClose();
//                         }}
//                       >
//                         Rename
//                       </MenuItem>

//                       <MenuItem
//                         sx={{ color: "red" }}
//                         onClick={() => {
//                           handleDelete(row._id);
//                           handleMenuClose();
//                         }}
//                       >
//                         Delete
//                       </MenuItem>
//                     </Menu>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//             {/* PAGINATION */}
//             <TablePagination
//               component="div"
//               count={organizerTemplatesData.length}
//               page={page}
//               onPageChange={(e, p) => setPage(p)}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={(e) =>
//                 setRowsPerPage(parseInt(e.target.value, 10))
//               }
//             />
//           </TableContainer>

//           {/* RENAME DIALOG */}
//           <Dialog
//             open={renameDialogOpen}
//             onClose={() => setRenameDialogOpen(false)}
//           >
//             <DialogTitle>Rename</DialogTitle>
//             <DialogContent>
//               <TextField
//                 fullWidth
//                 value={renameValue}
//                 onChange={(e) => setRenameValue(e.target.value)}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
//               <Button
//                 onClick={() => {
//                   handleRenameConfirm();
//                   setRenameDialogOpen(false);
//                 }}
//               >
//                 Save
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </>
//       ) : (
//         <OrganizerUpdate
//           OrganizerData={selectedOrganizer}
//           onClose={handleClosePreview}
//         />
//       )}

//       {/* CHANGE ANSWERS */}
//       <OrganizerDialog
//         open={openDialog}
//         handleClose={() => setOpenDialog(false)}
//         organizer={selectedOrganizer}
//         accountid={accountId}
//       />
//     </Box>
//   );
// };

// export default Organizers;


import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MoreHorizontal, Trash2, CheckSquare, Square } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import OrganizerUpdate from "./Organizer/OrganizerUpdate";
import OrganizerDialog from "./Organizer/OrganizerDialog";
import { organizerAPI } from "../../services/api";
import { useConfirm } from "../../components/ConfirmDialogContext";

const Organizers = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [organizerTemplatesData, setOrganizerTemplatesData] = useState([]);
  const [activeButton, setActiveButton] = useState("active");
  const [isActiveTrue, setIsActiveTrue] = useState(true);

  const [rowSelection, setRowSelection] = useState({});

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
        isActiveTrue
      );
      setOrganizerTemplatesData(res.data.organizerAccountWise);
      console.log("organizer list by accountid", res.data.organizerAccountWise);
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
  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const selectedIds = selectedRows.map((row) => row._id);

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

        setRowSelection({});
        fetchOrganizerTemplates();
      } catch (error) {
        console.log(error);
        toast.error("Bulk delete failed");
      }
    },
  });
};
  // const handleBulkDelete = () => {
  //   const selectedIds = Object.keys(rowSelection);
  //   if (selectedIds.length === 0) {
  //     toast.warning("Select items first");
  //     return;
  //   }

  //   confirm({
  //     title: "Delete Selected Items",
  //     description: `Are you sure you want to delete ${selectedIds.length} selected items?`,
  //     onConfirm: async () => {
  //       try {
  //         await Promise.all(
  //           selectedIds.map((id) => organizerAPI.deleteOrganizerAccountWise(id))
  //         );
  //         toast.success("Deleted");
  //         setRowSelection({});
  //         fetchOrganizerTemplates();
  //       } catch {
  //         toast.error("Bulk delete failed");
  //       }
  //     },
  //   });
  // };

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
            : row
        )
      );

      toast.success("Renamed");
    } catch {
      toast.error("Rename failed");
    }
  };

  // ================= NAVIGATION =================
  const handleCreate = () => {
    navigate(
      `/clients/accounts/accountsdash/organizers/${accountId}/accountorganizer`
    );
  };

  const handleEdit = (id) => {
    setSelectedOrganizer(id);
    setShowForm(true);
  };

  const handleClosePreview = () => {
    setShowForm(false);
  };
  const handleDownload = async (organizer) => {
  if (!organizer) return;

  console.log("download organizer", organizer);

  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // =====================================================
  // COLORS
  // =====================================================
  const dark = [25, 32, 56];
  const gray = [225, 230, 235];
  const textGray = [70, 70, 70];

  let y = 40;
  let pageNo = 1;

  // =====================================================
  // CLEAN HTML
  // =====================================================
  const stripHtml = (html) => {
    if (!html) return "";

    let text = html;

    text = text.replace(/<[^>]+>/g, " ");

    const textarea = document.createElement("textarea");

    textarea.innerHTML = text;

    text = textarea.value;

    text = text.replace(/\s+/g, " ").trim();

    return text;
  };

  // =====================================================
  // FOOTER
  // =====================================================
  const addFooter = () => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(120);

    pdf.text(
      `Page ${pageNo}`,
      pageWidth / 2,
      pageHeight - 20,
      {
        align: "center",
      }
    );
  };

  // =====================================================
  // HEADER
  // =====================================================
  const drawHeader = () => {
    // Organizer Name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(...dark);

    const organizerTitle =
      organizer?.organizerName ||
      "Individual Tax Organizer";

    const titleLines =
      pdf.splitTextToSize(
        organizerTitle,
        pageWidth - 160
      );

    pdf.text(titleLines, 40, y);

    // Progress Count
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);

    pdf.text(
      `${organizer?.sections?.length || 0} / ${
        organizer?.sections?.length || 0
      }`,
      pageWidth - 80,
      y
    );

    y += titleLines.length * 24;

    // Client Name
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);

    pdf.text(
      organizer?.accountid?.accountName?.toUpperCase() ||
        "CLIENT NAME",
      40,
      y
    );

    y += 18;

    // Divider
    pdf.setDrawColor(...dark);
    pdf.setLineWidth(1);

    pdf.line(
      40,
      y,
      pageWidth - 40,
      y
    );

    y += 35;
  };

  // =====================================================
  // PAGE BREAK
  // =====================================================
  const checkPageBreak = (
    spaceNeeded = 80
  ) => {
    if (
      y + spaceNeeded >
      pageHeight - 60
    ) {
      addFooter();

      pdf.addPage();

      pageNo++;

      y = 40;

      drawHeader();
    }
  };

  // =====================================================
  // FIRST HEADER
  // =====================================================
  drawHeader();

  // =====================================================
  // LOOP SECTIONS
  // =====================================================
  for (const section of organizer?.sections ||
    []) {
    if (!section) continue;

    // avoid section title at bottom
    checkPageBreak(120);

    // =====================================================
    // SECTION TITLE
    // =====================================================
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(...dark);

    const sectionName =
      section?.name || "Section";

    const sectionCount = `${
      section?.formElements?.length || 0
    } / ${
      section?.formElements?.length || 0
    }`;

    // available width for title
    const titleWidth =
      pageWidth - 170;

    // split long titles
    const titleLines =
      pdf.splitTextToSize(
        sectionName,
        titleWidth
      );

    // draw title
    pdf.text(titleLines, 40, y);

    // draw count
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      sectionCount,
      pageWidth - 70,
      y
    );

    // dynamic section height
    const sectionHeight =
      titleLines.length * 20;

    y += sectionHeight;

    // divider
    pdf.setDrawColor(...gray);

    pdf.line(
      40,
      y,
      pageWidth - 40,
      y
    );

    y += 20;

    // =====================================================
    // LOOP ELEMENTS
    // =====================================================
    for (const el of section?.formElements ||
      []) {
      if (!el) continue;

      // =====================================================
      // SKIP TEXT EDITOR
      // =====================================================
      if (
        el.type === "Text Editor" ||
        el.type === "texteditor" ||
        el.type === "textEditor"
      ) {
        continue;
      }

      const question =
        stripHtml(el.text || "");

      let answer = "-";

      // =====================================================
      // ANSWER TYPES
      // =====================================================
      if (el.textvalue) {
        answer = stripHtml(
          el.textvalue
        );
      } else if (
        el.files?.length
      ) {
        answer = el.files
          .map(
            (f) =>
              f?.name || "File"
          )
          .join(", ");
      } else if (
        el.imageUrl ||
        el.images?.length
      ) {
        answer = "Image Attached";
      }

      // skip empty rows
      if (
        !question &&
        !answer &&
        !el.files?.length &&
        !el.images?.length &&
        !el.imageUrl
      ) {
        continue;
      }

      // =====================================================
      // SPLIT TEXT
      // =====================================================
      const qLines =
        pdf.splitTextToSize(
          question,
          260
        );

      const aLines =
        pdf.splitTextToSize(
          answer,
          220
        );

      // =====================================================
      // ROW HEIGHT
      // =====================================================
      const rowHeight =
        Math.max(
          qLines.length,
          aLines.length
        ) *
          18 +
        22;

      checkPageBreak(
        rowHeight + 20
      );

      // =====================================================
      // ROW DIVIDER
      // =====================================================
      pdf.setDrawColor(...gray);

      pdf.setLineWidth(0.8);

      pdf.line(
        40,
        y + rowHeight,
        pageWidth - 40,
        y + rowHeight
      );

      // =====================================================
      // QUESTION
      // =====================================================
      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(11);

      pdf.setTextColor(...textGray);

      pdf.text(
        qLines,
        40,
        y + 16
      );

      // =====================================================
      // ANSWER
      // =====================================================
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setTextColor(...dark);

      pdf.text(
        aLines,
        330,
        y + 16
      );

      y += rowHeight;

      // =====================================================
      // FILES
      // =====================================================
      if (el.files?.length) {
        y += 10;

        for (const file of el.files) {
          checkPageBreak(40);

          const fileName =
            file?.name || "File";

          const fileLines =
            pdf.splitTextToSize(
              `• ${fileName}`,
              220
            );

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(10);

          pdf.setTextColor(
            ...textGray
          );

          pdf.text(
            fileLines,
            330,
            y
          );

          y +=
            fileLines.length *
              14 +
            6;
        }
      }

      // =====================================================
      // IMAGES
      // =====================================================
      const images = [];

      if (el.imageUrl) {
        images.push(el.imageUrl);
      }

      if (el.images?.length) {
        images.push(...el.images);
      }

      for (const img of images) {
        try {
          checkPageBreak(170);

          const res =
            await fetch(img, {
              mode: "cors",
            });

          const blob =
            await res.blob();

          const reader =
            new FileReader();

          await new Promise(
            (resolve) => {
              reader.onloadend =
                resolve;

              reader.readAsDataURL(
                blob
              );
            }
          );

          const imgWidth = 150;
          const imgHeight = 100;

          pdf.addImage(
            reader.result,
            "JPEG",
            330,
            y + 10,
            imgWidth,
            imgHeight
          );

          y += imgHeight + 20;
        } catch (err) {
          console.log(
            "Image load failed"
          );
        }
      }
    }

    y += 30;
  }

  // =====================================================
  // FINAL FOOTER
  // =====================================================
  addFooter();

  // =====================================================
  // SAVE PDF
  // =====================================================
  pdf.save(
    `${
      organizer?.organizerName ||
      "Organizer"
    }_Report.pdf`
  );
};
//   const handleDownload = async (organizer) => {
//   if (!organizer) return;
// console.log("doenload oragnizer",organizer)
//   const pdf = new jsPDF("p", "pt", "a4");

//   const pageWidth = pdf.internal.pageSize.getWidth();
//   const pageHeight = pdf.internal.pageSize.getHeight();

//   // ---------------- COLORS ----------------
//   const dark = [25, 32, 56];
//   const gray = [225, 230, 235];
//   const textGray = [70, 70, 70];

//   let y = 40;
//   let pageNo = 1;

//   // ---------------- CLEAN HTML ----------------
//   const stripHtml = (html) => {
//     if (!html) return "";

//     let text = html;

//     text = text.replace(/<[^>]+>/g, " ");

//     const textarea = document.createElement("textarea");
//     textarea.innerHTML = text;
//     text = textarea.value;

//     text = text.replace(/\s+/g, " ").trim();

//     return text;
//   };

//   // ---------------- FOOTER ----------------
//   const addFooter = () => {
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(9);
//     pdf.setTextColor(120);

//     pdf.text(
//       `Page ${pageNo}`,
//       pageWidth / 2,
//       pageHeight - 20,
//       {
//         align: "center",
//       }
//     );
//   };

//   // ---------------- HEADER ----------------
//   const drawHeader = () => {
//     // Organizer Title
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(22);
//     pdf.setTextColor(...dark);

//     pdf.text(
//       organizer?.organizerName || "Individual Tax Organizer",
//       40,
//       y
//     );

//     // Progress
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(14);

//     pdf.text(
//       `${organizer?.sections?.length || 0} / ${
//         organizer?.sections?.length || 0
//       }`,
//       pageWidth - 90,
//       y
//     );

//     y += 28;

//     // Client Name
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(13);

//     pdf.text(
//   organizer?.accountid?.accountName?.toUpperCase() ||
//     "CLIENT NAME",
//   40,
//   y
// );

//     y += 18;

//     // Divider
//     pdf.setDrawColor(...dark);
//     pdf.setLineWidth(1);

//     pdf.line(
//       40,
//       y,
//       pageWidth - 40,
//       y
//     );

//     y += 35;
//   };

//   // ---------------- PAGE BREAK ----------------
//   const checkPageBreak = (spaceNeeded = 80) => {
//     if (y + spaceNeeded > pageHeight - 60) {
//       addFooter();

//       pdf.addPage();

//       pageNo++;
//       y = 40;

//       drawHeader();
//     }
//   };

//   // ---------------- FIRST PAGE HEADER ----------------
//   drawHeader();

//   // ====================================================
//   // LOOP SECTIONS
//   // ====================================================
//   for (const section of organizer?.sections || []) {
//     if (!section) continue;

//     // avoid section title at page bottom
//     checkPageBreak(120);

//     // ---------------- SECTION TITLE ----------------
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(18);
//     pdf.setTextColor(...dark);

//     pdf.text(
//       section?.name || "Section",
//       40,
//       y
//     );

//     // Section Count
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(11);

//     pdf.text(
//       `${section?.formElements?.length || 0} / ${
//         section?.formElements?.length || 0
//       }`,
//       220,
//       y
//     );

//     y += 18;

//     // Divider
//     pdf.setDrawColor(...gray);

//     pdf.line(
//       40,
//       y,
//       pageWidth - 40,
//       y
//     );

//     y += 18;

//     // ====================================================
//     // LOOP FORM ELEMENTS
//     // ====================================================
//     for (const el of section?.formElements || []) {
//       if (!el) continue;

//       // ====================================================
//       // SKIP TEXT EDITOR ELEMENTS
//       // ====================================================
//       if (
//         el.type === "Text Editor" ||
//         el.type === "texteditor" ||
//         el.type === "textEditor"
//       ) {
//         continue;
//       }

//       const question = stripHtml(
//         el.text || ""
//       );

//       let answer = "-";

//       // ====================================================
//       // ANSWER TYPES
//       // ====================================================
//       if (el.textvalue) {
//         answer = stripHtml(el.textvalue);
//       } else if (el.files?.length) {
//         answer = el.files
//           .map((f) => f.name)
//           .join(", ");
//       } else if (
//         el.imageUrl ||
//         el.images?.length
//       ) {
//         answer = "Image Attached";
//       }

//       // skip empty unanswered fields
//       if (
//         !question &&
//         !answer &&
//         !el.files?.length &&
//         !el.images?.length &&
//         !el.imageUrl
//       ) {
//         continue;
//       }

//       // ====================================================
//       // ROW HEIGHT
//       // ====================================================
//       const qLines = pdf.splitTextToSize(
//         question,
//         260
//       );

//       const aLines = pdf.splitTextToSize(
//         answer,
//         220
//       );

//       const rowHeight =
//         Math.max(
//           qLines.length,
//           aLines.length
//         ) *
//           18 +
//         22;

//       checkPageBreak(rowHeight + 20);

//       // ====================================================
//       // ROW DIVIDER
//       // ====================================================
//       pdf.setDrawColor(...gray);
//       pdf.setLineWidth(0.8);

//       pdf.line(
//         40,
//         y + rowHeight,
//         pageWidth - 40,
//         y + rowHeight
//       );

//       // ====================================================
//       // QUESTION
//       // ====================================================
//       pdf.setFont("helvetica", "normal");
//       pdf.setFontSize(11);
//       pdf.setTextColor(...textGray);

//       pdf.text(
//         qLines,
//         40,
//         y + 16
//       );

//       // ====================================================
//       // ANSWER
//       // ====================================================
//       pdf.setFont("helvetica", "bold");
//       pdf.setTextColor(...dark);

//       pdf.text(
//         aLines,
//         330,
//         y + 16
//       );

//       y += rowHeight;

//       // ====================================================
//       // FILES
//       // ====================================================
//       if (el.files?.length) {
//         y += 10;

//         for (const file of el.files) {
//           checkPageBreak(40);

//           const fileName =
//             file?.name || "File";

//           const fileLines =
//             pdf.splitTextToSize(
//               `• ${fileName}`,
//               220
//             );

//           pdf.setFont(
//             "helvetica",
//             "normal"
//           );

//           pdf.setFontSize(10);

//           pdf.setTextColor(...textGray);

//           pdf.text(
//             fileLines,
//             330,
//             y
//           );

//           y +=
//             fileLines.length * 14 +
//             6;
//         }
//       }

//       // ====================================================
//       // IMAGES
//       // ====================================================
//       const images = [];

//       if (el.imageUrl) {
//         images.push(el.imageUrl);
//       }

//       if (el.images?.length) {
//         images.push(...el.images);
//       }

//       for (const img of images) {
//         try {
//           checkPageBreak(170);

//           const res = await fetch(img, {
//             mode: "cors",
//           });

//           const blob =
//             await res.blob();

//           const reader =
//             new FileReader();

//           await new Promise(
//             (resolve) => {
//               reader.onloadend =
//                 resolve;

//               reader.readAsDataURL(
//                 blob
//               );
//             }
//           );

//           const imgWidth = 150;
//           const imgHeight = 100;

//           pdf.addImage(
//             reader.result,
//             "JPEG",
//             330,
//             y + 10,
//             imgWidth,
//             imgHeight
//           );

//           y += imgHeight + 20;
//         } catch (err) {
//           console.log(
//             "Image load failed"
//           );
//         }
//       }
//     }

//     y += 30;
//   }

//   // ---------------- FINAL FOOTER ----------------
//   addFooter();

//   // ---------------- SAVE PDF ----------------
//   pdf.save(
//     `${
//       organizer?.organizerName ||
//       "Organizer"
//     }_Report.pdf`
//   );
// };
//  const handleDownload = async (organizer) => {
//     if (!organizer) return;
// console.log("download oragnizer",organizer)
//     // ------------------ CLEAN TEXT FUNCTION ------------------
//     const stripHtml = (html) => {
//       if (!html) return "";

//       let text = html;

//       // remove spaced-out html tags:  < p > , < / b r >
//       text = text.replace(/<\s*\/?\s*[^>]*\s*>/g, " ");

//       // remove normal html tags
//       text = text.replace(/<[^>]+>/g, " ");

//       // decode html entities
//       const textarea = document.createElement("textarea");
//       textarea.innerHTML = text;
//       text = textarea.value;

//       // remove weird MS Word / non-ASCII garbage characters
//       text = text.replace(/[^\x00-\x7F]+/g, " ");

//       // remove control characters
//       text = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");

//       // fix letter separated text like: W e l c o m e
//       text = text.replace(/(\w)\s(?=\w)/g, "$1");

//       // collapse extra spaces and line breaks
//       text = text.replace(/\s+/g, " ").trim();

//       return text;
//     };

//     // ------------------ PDF INIT ------------------
//     const pdf = new jsPDF("p", "pt", "a4");
//     const pageWidth = pdf.internal.pageSize.getWidth();
//     const pageHeight = pdf.internal.pageSize.getHeight();

//     let y = 40;

//     // ------------------ TITLE ------------------
//     pdf.setFontSize(16);
//     pdf.text(organizer?.organizerName || "Organizer", 40, y);
//     y += 25;

//     // ------------------ LOOP SECTIONS ------------------
//     for (const section of organizer?.sections || []) {
//       if (!section) continue;

//       // add new page if needed
//       if (y > pageHeight - 80) {
//         pdf.addPage();
//         y = 40;
//       }

//       // section title
//       pdf.setFontSize(14);
//       pdf.text(section?.name || "Section", 40, y);
//       y += 20;

//       // ------------------ LOOP FORM ELEMENTS ------------------
//       for (const el of section?.formElements || []) {
//         if (!el) continue;

//         // skip unanswered elements
//         if (
//           !el.textvalue &&
//           !el.files?.length &&
//           !el.imageUrl &&
//           !el.images?.length
//         ) {
//           continue;
//         }

//         // page break protection
//         if (y > pageHeight - 120) {
//           pdf.addPage();
//           y = 40;
//         }

//         // question
//         pdf.setFontSize(12);
//         pdf.text(`Q: ${stripHtml(el.text || "")}`, 40, y);
//         y += 16;

//         // ------------------ TEXT ANSWER ------------------
//         if (el.textvalue) {
//           const cleanAnswer = stripHtml(el.textvalue);

//           const textLines = pdf.splitTextToSize(
//             `A: ${cleanAnswer}`,
//             pageWidth - 80,
//           );
//           pdf.text(textLines, 40, y);
//           y += textLines.length * 14;
//         }

//         // ------------------ IMAGES ------------------
//         if (el.imageUrl || el.images?.length) {
//           const images = el.images || [el.imageUrl];

//           for (const img of images) {
//             try {
//               const res = await fetch(img, { mode: "cors" });
//               const blob = await res.blob();

//               const reader = new FileReader();
//               await new Promise((resolve) => {
//                 reader.onloadend = resolve;
//                 reader.readAsDataURL(blob);
//               });

//               const imgWidth = 180;
//               const imgHeight = 130;

//               if (y > pageHeight - 180) {
//                 pdf.addPage();
//                 y = 40;
//               }

//               pdf.addImage(reader.result, "JPEG", 40, y, imgWidth, imgHeight);
//               y += imgHeight + 10;
//             } catch (e) {
//               pdf.text("Image could not be loaded", 40, y);
//               y += 14;
//             }
//           }
//         }

//         // ------------------ FILE LIST ------------------
//         if (el.files?.length) {
//           pdf.setFontSize(11);

//           for (const f of el.files) {
//             const fname = f?.name || "File";

//             const line = pdf.splitTextToSize(
//               `Attached File: ${fname}`,
//               pageWidth - 80,
//             );

//             pdf.text(line, 40, y);
//             y += line.length * 14;
//           }
//         }

//         y += 6;
//       }

//       y += 10;
//     }

//     // ------------------ SAVE PDF ------------------
//     pdf.save(`${organizer?.organizerName || "organizer"}_answers.pdf`);
//   };
  // ================= TABLE COLUMNS =================
  const columns = React.useMemo(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              if (Object.keys(rowSelection).length === table.getRowModel().rows.length) {
                setRowSelection({});
              } else {
                const selection = {};
                table.getRowModel().rows.forEach((row, index) => {
                  selection[row.id] = true;
                });
                setRowSelection(selection);
              }
            }}
          >
            {Object.keys(rowSelection).length === table.getRowModel().rows.length && 
             table.getRowModel().rows.length > 0 ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              const newSelection = { ...rowSelection };
              if (newSelection[row.id]) {
                delete newSelection[row.id];
              } else {
                newSelection[row.id] = true;
              }
              setRowSelection(newSelection);
            }}
          >
            {rowSelection[row.id] ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
        ),
      },
      {
        accessorKey: "organizerName",
        header: "Name",
        cell: ({ row }) => (
          <span
            onClick={() => handleEdit(row.original._id)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {row.original.organizerName}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={row.original.status === "Completed" ? "default" : "secondary"}
            className={
              row.original.status === "Completed"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : ""
            }
          >
            {row.original.status || "Pending"}
          </Badge>
        ),
      },
      {
        accessorKey: "issealed",
        header: "Seal",
        cell: ({ row }) =>
          row.original.issealed ? (
            <Badge variant="default" className="bg-blue-600 text-white">
              Sealed
            </Badge>
          ) : null,
      },
      {
        id: "actions",
        header: "Settings",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  handleSealed(row.original._id, !row.original.issealed);
                }}
              >
                {row.original.issealed ? "Unseal" : "Seal"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleArchive(row.original._id, row.original.active);
                }}
              >
                {row.original.active ? "Archive" : "Restore"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRenameRowId(row.original._id);
                  setRenameValue(row.original.organizerName);
                  setRenameDialogOpen(true);
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDownload(row.original);
                }}
              >
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  handleDelete(row.original._id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ];
  }, [rowSelection, organizerTemplatesData]);

  const table = useReactTable({
    data: organizerTemplatesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={handleCreate}>
          New Organizer
        </Button>

        <ToggleGroup
          type="single"
          value={isActiveTrue ? "active" : "archived"}
          onValueChange={(value) => {
            if (value === "active") {
              setIsActiveTrue(true);
              setActiveButton("active");
            } else if (value === "archived") {
              setIsActiveTrue(false);
              setActiveButton("archived");
            }
          }}
          className="bg-gray-100 rounded-full p-1"
        >
          <ToggleGroupItem
            value="active"
            className="rounded-full px-4 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            Active
          </ToggleGroupItem>
          <ToggleGroupItem
            value="archived"
            className="rounded-full px-4 data-[state=on]:bg-white data-[state=on]:shadow-sm"
          >
            Archived
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {!showForm ? (
        <>
          {selectedCount > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {selectedCount} of {organizerTemplatesData.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <select
                  className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  {">"}
                </Button>
              </div>
            </div>
          </div>

          {/* RENAME DIALOG */}
          <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rename Organizer</DialogTitle>
                <DialogDescription>
                  Enter a new name for the organizer.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rename">Organizer Name</Label>
                  <Input
                    id="rename"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    placeholder="Enter new name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRenameDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleRenameConfirm();
                    setRenameDialogOpen(false);
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
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
    </div>
  );
};

export default Organizers;