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


  // ================= TABLE COLUMNS =================
  


  const columns = React.useMemo(() => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Button
          variant="ghost"
          size="sm"
          className="
            h-8 w-8 p-0
            rounded-lg
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
            transition-colors
          "
          onClick={() => {
            if (
              Object.keys(rowSelection).length ===
              table.getRowModel().rows.length
            ) {
              setRowSelection({});
            } else {
              const selection = {};
              table.getRowModel().rows.forEach((row) => {
                selection[row.id] = true;
              });
              setRowSelection(selection);
            }
          }}
        >
          {Object.keys(rowSelection).length ===
            table.getRowModel().rows.length &&
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
          className="
            h-8 w-8 p-0
            rounded-lg
            text-muted-foreground
            hover:bg-muted
            hover:text-foreground
            transition-colors
          "
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
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : (
            <Square className="h-4 w-4" />
          )}
        </Button>
      ),
    },

    {
      accessorKey: "organizerName",
      header: () => (
        <span
          className="
            font-semibold
            text-muted-foreground
          "
          style={{
            fontFamily: "var(--font-family)",
            fontSize:
              "calc(0.85rem * parseFloat(var(--font-scale)) / 100)",
          }}
        >
          Name
        </span>
      ),
      cell: ({ row }) => (
        <span
          onClick={() => handleEdit(row.original._id)}
          className="
            cursor-pointer
            font-medium
            text-primary
            hover:underline
            transition-colors
          "
          style={{
            fontFamily: "var(--font-family)",
          }}
        >
          {row.original.organizerName}
        </span>
      ),
    },

    {
      accessorKey: "status",
      header: () => (
        <span className="font-semibold text-muted-foreground">
          Status
        </span>
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "Completed"
              ? "default"
              : "secondary"
          }
          className={`
            rounded-full px-3 py-1
            text-xs font-medium

            ${
              row.original.status === "Completed"
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }
          `}
        >
          {row.original.status || "Pending"}
        </Badge>
      ),
    },

    {
      accessorKey: "issealed",
      header: () => (
        <span className="font-semibold text-muted-foreground">
          Seal
        </span>
      ),
      cell: ({ row }) =>
        row.original.issealed ? (
          <Badge
            className="
              rounded-full px-3 py-1
              bg-blue-500/10 text-blue-600
              dark:text-blue-400
            "
          >
            Sealed
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },

    {
      id: "actions",
      header: () => (
        <span className="font-semibold text-muted-foreground">
          Settings
        </span>
      ),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="
                h-8 w-8 p-0
                rounded-lg
                text-muted-foreground
                hover:bg-muted
                hover:text-foreground
                transition-colors
              "
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="
              rounded-xl
              border border-border
              bg-popover
              shadow-lg
            "
          >
            <DropdownMenuItem
              onClick={() => {
                handleSealed(
                  row.original._id,
                  !row.original.issealed
                );
              }}
              className="rounded-lg"
            >
              {row.original.issealed ? "Unseal" : "Seal"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                handleArchive(
                  row.original._id,
                  row.original.active
                );
              }}
              className="rounded-lg"
            >
              {row.original.active ? "Archive" : "Restore"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setRenameRowId(row.original._id);
                setRenameValue(row.original.organizerName);
                setRenameDialogOpen(true);
              }}
              className="rounded-lg"
            >
              Rename
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                handleDownload(row.original);
              }}
              className="rounded-lg"
            >
              Download
            </DropdownMenuItem>

            <DropdownMenuItem
              className="
                rounded-lg
                text-destructive
                focus:text-destructive
              "
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
  <div className="mt-4 space-y-5 bg-background text-foreground">
    {/* TOP ACTION BAR */}
    <div
      className="
        flex flex-col gap-4
        rounded-2xl
        border border-border
        bg-card
        p-4 shadow-sm

        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleCreate}
          className="
            rounded-xl
            px-5
            shadow-sm
          "
          style={{
            fontFamily: "var(--font-family)",
          }}
        >
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
          className="
            rounded-2xl
            border border-border
            bg-muted/30
            p-1
          "
        >
          <ToggleGroupItem
            value="active"
            className="
              rounded-xl px-5

              text-muted-foreground
              transition-all

              data-[state=on]:bg-background
              data-[state=on]:text-foreground
              data-[state=on]:shadow-sm
            "
            style={{
              fontFamily: "var(--font-family)",
            }}
          >
            Active
          </ToggleGroupItem>

          <ToggleGroupItem
            value="archived"
            className="
              rounded-xl px-5

              text-muted-foreground
              transition-all

              data-[state=on]:bg-background
              data-[state=on]:text-foreground
              data-[state=on]:shadow-sm
            "
            style={{
              fontFamily: "var(--font-family)",
            }}
          >
            Archived
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {selectedCount > 0 && (
        <div
          className="
            flex items-center gap-3
            rounded-xl
            border border-border
            bg-muted/20
            px-4 py-2
          "
        >
          <Button
            variant="ghost"
            size="sm"
            className="
              rounded-lg
              text-destructive
              hover:bg-destructive/10
              hover:text-destructive
            "
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete Selected
          </Button>

          <span
            className="text-muted-foreground"
            style={{
              fontFamily: "var(--font-family)",
              fontSize:
                "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
            }}
          >
            {selectedCount} selected
          </span>
        </div>
      )}
    </div>

    {!showForm ? (
      <>
        {/* TABLE */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-border
            bg-card
            shadow-sm
          "
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="
                      border-border
                      bg-muted/30
                      hover:bg-muted/30
                    "
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="
                          h-12
                          whitespace-nowrap
                          px-4
                          font-semibold
                          text-muted-foreground
                        "
                        style={{
                          fontFamily: "var(--font-family)",
                          fontSize:
                            "calc(0.8rem * parseFloat(var(--font-scale)) / 100)",
                        }}
                      >
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
                      className="
                        border-border
                        transition-colors

                        hover:bg-muted/20
                        data-[state=selected]:bg-primary/5
                      "
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-3"
                          style={{
                            fontFamily: "var(--font-family)",
                            fontSize:
                              "calc(0.84rem * parseFloat(var(--font-scale)) / 100)",
                          }}
                        >
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
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="
                            flex h-12 w-12 items-center justify-center
                            rounded-2xl
                            bg-muted
                          "
                        >
                          <Square className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <p
                          className="text-muted-foreground"
                          style={{
                            fontFamily: "var(--font-family)",
                            fontSize:
                              "calc(0.86rem * parseFloat(var(--font-scale)) / 100)",
                          }}
                        >
                          No results found.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div
            className="
              flex flex-col gap-4
              border-t border-border
              bg-muted/10
              px-4 py-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="text-muted-foreground"
              style={{
                fontFamily: "var(--font-family)",
                fontSize:
                  "calc(0.8rem * parseFloat(var(--font-scale)) / 100)",
              }}
            >
              {selectedCount} of {organizerTemplatesData.length} row(s)
              selected.
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {/* Rows per page */}
              <div className="flex items-center gap-2">
                <p
                  className="font-medium text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Rows per page
                </p>

                <select
                  className="
                    h-9 w-20
                    rounded-xl
                    border border-border
                    bg-background
                    px-3
                    text-sm
                    text-foreground
                    outline-none

                    focus:ring-2
                    focus:ring-primary/20
                  "
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  style={{
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Count */}
              <div
                className="
                  flex items-center justify-center
                  rounded-xl
                  border border-border
                  bg-background
                  px-4 py-2
                  font-medium
                "
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="
                    h-9 w-9 rounded-xl
                    border-border
                    p-0
                    hover:bg-muted
                  "
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">
                    Go to previous page
                  </span>
                  {"<"}
                </Button>

                <Button
                  variant="outline"
                  className="
                    h-9 w-9 rounded-xl
                    border-border
                    p-0
                    hover:bg-muted
                  "
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">
                    Go to next page
                  </span>
                  {">"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RENAME DIALOG */}
        <Dialog
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
        >
          <DialogContent
            className="
              rounded-2xl
              border border-border
              bg-background
              shadow-2xl
            "
          >
            <DialogHeader>
              <DialogTitle
                className="text-foreground"
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(1rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Rename Organizer
              </DialogTitle>

              <DialogDescription
                className="text-muted-foreground"
                style={{
                  fontFamily: "var(--font-family)",
                  fontSize:
                    "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                }}
              >
                Enter a new name for the organizer.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="rename"
                  className="text-foreground"
                  style={{
                    fontFamily: "var(--font-family)",
                    fontSize:
                      "calc(0.82rem * parseFloat(var(--font-scale)) / 100)",
                  }}
                >
                  Organizer Name
                </Label>

                <Input
                  id="rename"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  placeholder="Enter new name"
                  className="
                    h-11 rounded-xl
                    border-border
                    bg-background
                    text-foreground

                    focus-visible:ring-2
                    focus-visible:ring-primary/20
                  "
                  style={{
                    fontFamily: "var(--font-family)",
                  }}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setRenameDialogOpen(false)}
                className="
                  rounded-xl border-border
                  hover:bg-muted
                "
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  handleRenameConfirm();
                  setRenameDialogOpen(false);
                }}
                className="rounded-xl"
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
  // return (
  //   <div className="mt-4 space-y-4">
  //     <div className="flex items-center gap-2">
  //       <Button onClick={handleCreate}>
  //         New Organizer
  //       </Button>

  //       <ToggleGroup
  //         type="single"
  //         value={isActiveTrue ? "active" : "archived"}
  //         onValueChange={(value) => {
  //           if (value === "active") {
  //             setIsActiveTrue(true);
  //             setActiveButton("active");
  //           } else if (value === "archived") {
  //             setIsActiveTrue(false);
  //             setActiveButton("archived");
  //           }
  //         }}
  //         className="bg-gray-100 rounded-full p-1"
  //       >
  //         <ToggleGroupItem
  //           value="active"
  //           className="rounded-full px-4 data-[state=on]:bg-white data-[state=on]:shadow-sm"
  //         >
  //           Active
  //         </ToggleGroupItem>
  //         <ToggleGroupItem
  //           value="archived"
  //           className="rounded-full px-4 data-[state=on]:bg-white data-[state=on]:shadow-sm"
  //         >
  //           Archived
  //         </ToggleGroupItem>
  //       </ToggleGroup>
  //     </div>

  //     {!showForm ? (
  //       <>
  //         {selectedCount > 0 && (
  //           <div className="flex items-center gap-2">
  //             <Button
  //               variant="ghost"
  //               size="sm"
  //               className="text-red-600 hover:text-red-700"
  //               onClick={handleBulkDelete}
  //             >
  //               <Trash2 className="h-4 w-4 mr-1" />
  //               Delete Selected
  //             </Button>
  //             <span className="text-sm text-muted-foreground">
  //               {selectedCount} selected
  //             </span>
  //           </div>
  //         )}

  //         <div className="rounded-md border">
  //           <Table>
  //             <TableHeader>
  //               {table.getHeaderGroups().map((headerGroup) => (
  //                 <TableRow key={headerGroup.id}>
  //                   {headerGroup.headers.map((header) => (
  //                     <TableHead key={header.id}>
  //                       {header.isPlaceholder
  //                         ? null
  //                         : flexRender(
  //                             header.column.columnDef.header,
  //                             header.getContext()
  //                           )}
  //                     </TableHead>
  //                   ))}
  //                 </TableRow>
  //               ))}
  //             </TableHeader>
  //             <TableBody>
  //               {table.getRowModel().rows?.length ? (
  //                 table.getRowModel().rows.map((row) => (
  //                   <TableRow
  //                     key={row.id}
  //                     data-state={row.getIsSelected() && "selected"}
  //                   >
  //                     {row.getVisibleCells().map((cell) => (
  //                       <TableCell key={cell.id}>
  //                         {flexRender(
  //                           cell.column.columnDef.cell,
  //                           cell.getContext()
  //                         )}
  //                       </TableCell>
  //                     ))}
  //                   </TableRow>
  //                 ))
  //               ) : (
  //                 <TableRow>
  //                   <TableCell
  //                     colSpan={columns.length}
  //                     className="h-24 text-center"
  //                   >
  //                     No results found.
  //                   </TableCell>
  //                 </TableRow>
  //               )}
  //             </TableBody>
  //           </Table>
  //         </div>

  //         <div className="flex items-center justify-between px-2">
  //           <div className="flex-1 text-sm text-muted-foreground">
  //             {selectedCount} of {organizerTemplatesData.length} row(s) selected.
  //           </div>
  //           <div className="flex items-center space-x-6 lg:space-x-8">
  //             <div className="flex items-center space-x-2">
  //               <p className="text-sm font-medium">Rows per page</p>
  //               <select
  //                 className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
  //                 value={table.getState().pagination.pageSize}
  //                 onChange={(e) => {
  //                   table.setPageSize(Number(e.target.value));
  //                 }}
  //               >
  //                 {[10, 20, 30, 40, 50].map((pageSize) => (
  //                   <option key={pageSize} value={pageSize}>
  //                     {pageSize}
  //                   </option>
  //                 ))}
  //               </select>
  //             </div>
  //             <div className="flex w-[100px] items-center justify-center text-sm font-medium">
  //               Page {table.getState().pagination.pageIndex + 1} of{" "}
  //               {table.getPageCount()}
  //             </div>
  //             <div className="flex items-center space-x-2">
  //               <Button
  //                 variant="outline"
  //                 className="h-8 w-8 p-0"
  //                 onClick={() => table.previousPage()}
  //                 disabled={!table.getCanPreviousPage()}
  //               >
  //                 <span className="sr-only">Go to previous page</span>
  //                 {"<"}
  //               </Button>
  //               <Button
  //                 variant="outline"
  //                 className="h-8 w-8 p-0"
  //                 onClick={() => table.nextPage()}
  //                 disabled={!table.getCanNextPage()}
  //               >
  //                 <span className="sr-only">Go to next page</span>
  //                 {">"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>

  //         {/* RENAME DIALOG */}
  //         <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
  //           <DialogContent>
  //             <DialogHeader>
  //               <DialogTitle>Rename Organizer</DialogTitle>
  //               <DialogDescription>
  //                 Enter a new name for the organizer.
  //               </DialogDescription>
  //             </DialogHeader>
  //             <div className="space-y-4 py-4">
  //               <div className="space-y-2">
  //                 <Label htmlFor="rename">Organizer Name</Label>
  //                 <Input
  //                   id="rename"
  //                   value={renameValue}
  //                   onChange={(e) => setRenameValue(e.target.value)}
  //                   placeholder="Enter new name"
  //                 />
  //               </div>
  //             </div>
  //             <DialogFooter>
  //               <Button
  //                 variant="outline"
  //                 onClick={() => setRenameDialogOpen(false)}
  //               >
  //                 Cancel
  //               </Button>
  //               <Button
  //                 onClick={() => {
  //                   handleRenameConfirm();
  //                   setRenameDialogOpen(false);
  //                 }}
  //               >
  //                 Save Changes
  //               </Button>
  //             </DialogFooter>
  //           </DialogContent>
  //         </Dialog>
  //       </>
  //     ) : (
  //       <OrganizerUpdate
  //         OrganizerData={selectedOrganizer}
  //         onClose={handleClosePreview}
  //       />
  //     )}

  //     {/* CHANGE ANSWERS */}
  //     <OrganizerDialog
  //       open={openDialog}
  //       handleClose={() => setOpenDialog(false)}
  //       organizer={selectedOrganizer}
  //       accountid={accountId}
  //     />
  //   </div>
  // );
};

export default Organizers;