




import React, { useState, useEffect, useMemo } from "react";
import { useToastContext } from "../../../context/ToastContext";
import { X, Pencil, Trash2, Plus, Loader2 } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";

import { templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";

const Tags = () => {
  const confirm = useConfirm();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [getId, setGetId] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [globalFilter, setGlobalFilter] = useState("");

  // const colors = [
  //   "#0d6efd",
  //   "#6c757d",
  //   "#198754",
  //   "#dc3545",
  //   "#ffc107",
  //   "#0dcaf0",
  //   "#FF5722",
  //   "#212529",
  // ];
 const colors = ["#fd3241", "#f9b5ac", "#ac6400", "#ff7e39", "#ffea00", "#94ecbe", "#2e8b57", "#76ac1e", "#3cbb50", "#9ed8db", "#0299bb", "#0af4b8", "#466efb", "#0496ff", "#b9c1ff",
    "#e1b1ff", "#9d33d0", "#d834f5", "#ff54b6", "#1d3354", "#767b91", "#8f8f8f", "#c7c7c7", "#9a657e", "#616468", "#511dff", "#85c7db", "#8cd1ff", "#0aefff", "#d4ff00", "#a1ff0a", "#00f43d", "#ffc100",
    "#cdc6a5", "#fed6b1", "#e5dfdf", "#ffeaa7"
  ];
  // ================= FETCH =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getAccountCountOfTag();
      setTags(res.data.tagCounts || []);
    } catch {
      showToast({
        title: "Error",
        description: "Failed to fetch tags",
        type: "error"
      });
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= RESET =================
  const resetForm = () => {
    setInputValue("");
    setSelectedOption(null);
    setGetId("");
    setIsEdit(false);
  };
// ================= CREATE =================
const handleSubmit = async () => {
  if (!inputValue || !selectedOption) {
    showToast({
      title: "All fields required",
      type: "error",
    });
    return;
  }

  try {
    setLoading(true);

    await templateAPI.createTags({
      tagName: inputValue,
      tagColour: selectedOption.tagColour,
    });

    showToast({
      title: "Tag created",
      type: "success",
    });

    fetchData();
    resetForm();
    setIsDrawerOpen(false);
  } catch (err) {
    showToast({
      title: err.response?.data?.message || "Error",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};

// ================= UPDATE =================
const handleUpdate = async () => {
  if (!inputValue || !selectedOption) {
    showToast({
      title: "All fields required",
      type: "error",
    });
    return;
  }

  try {
    setLoading(true);

    await templateAPI.updateTags(getId, {
      tagName: inputValue,
      tagColour: selectedOption.tagColour,
    });

    showToast({
      title: "Updated successfully",
      type: "success",
    });

    fetchData();
    resetForm();
    setIsDrawerOpen(false);
  } catch (err) {
    showToast({
      title: err.response?.data?.message || "Update failed",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};
  // // ================= CREATE =================
  // const handleSubmit = async () => {
  //   if (!inputValue || !selectedOption) {
  //     toast.error("All fields required");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     await templateAPI.createTags({
  //       tagName: inputValue,
  //       tagColour: selectedOption.tagColour,
  //     });

  //     toast.success("Tag created");
  //     fetchData();
  //     resetForm();
  //     setIsDrawerOpen(false);
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // ================= UPDATE =================
  // const handleUpdate = async () => {
  //   if (!inputValue || !selectedOption) {
  //     toast.error("All fields required");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     await templateAPI.updateTags(getId, {
  //       tagName: inputValue,
  //       tagColour: selectedOption.tagColour,
  //     });

  //     toast.success("Updated successfully");
  //     fetchData();
  //     resetForm();
  //     setIsDrawerOpen(false);
  //   } catch {
  //     toast.error("Update failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ================= DELETE =================
  // const handleDelete = (id) => {
  //   confirm({
  //     title: "Delete Tag",
  //     description: "Are you sure you want to delete this tag?",
  //     onConfirm: async () => {
  //       try {
  //         await templateAPI.deleteTags(id);
  //         toast.success("Deleted");
  //         fetchData();
  //       } catch {
  //         toast.error("Delete failed");
  //       }
  //     },
  //   });
  // };
  const handleDelete = (id) => {
  confirm({
    title: "Delete Tag",
    description: "Are you sure you want to delete this tag?",
    onConfirm: async () => {
      try {
        await templateAPI.deleteTags(id);

        showToast({
          title: "Deleted",
          description: "Tag deleted successfully",
          type: "success",
        });

        fetchData();
      } catch (err) {
        showToast({
          title: "Delete failed",
          description: err.response?.data?.message,
          type: "error",
        });
      }
    },
  });
};

  // ================= EDIT =================
  const handleEdit = async (id) => {
    try {
      const res = await templateAPI.getTagById(id);
      const tag = res.data.tag;

      setGetId(id);
      setInputValue(tag.tagName);

      const selected = colors.find((color) => color === tag.tagColour);
      setSelectedOption({
        tagName: tag.tagName,
        tagColour: selected || colors[0],
      });

      setIsEdit(true);
      setIsDrawerOpen(true);
    } catch (err) {
      showToast({
        title: "Failed to load tag",
        type: "error",
      });
    }
  };

  // ================= CLOSE DRAWER =================
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    resetForm();
  };

  // ================= TABLE =================
  const columns = useMemo(() => [
    {
      accessorKey: "tagName",
      header: "Tag",
      cell: ({ row }) => (
        <span
          className="inline-flex px-2 py-1 text-xs font-semibold text-white rounded-full"
          style={{ backgroundColor: row.original.tagColour }}
        >
          {row.original.tagName}
        </span>
      ),
    },
    {
      accessorKey: "count",
      header: "Accounts",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row.original._id)}
            className="p-1 hover:bg-muted rounded"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDelete(row.original._id)}
            className="p-1 hover:bg-destructive/10 rounded text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Tag
        </Button>
      </div>

      {/* SEARCH */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={tags}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        getRowId={(row) => row._id}
      />

      {/* CUSTOM DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden ">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
              <h2 className="text-base font-semibold">
                {isEdit ? "Edit Tag" : "Create Tag"}
              </h2>
              <button
                onClick={handleDrawerClose}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Tag Name */}
                <div className="space-y-2">
                  <Label>Tag Name *</Label>
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter tag name"
                  />
                </div>

                {/* Color Selection */}
                <div className="space-y-2">
                  <Label>Color *</Label>
                  
                  {/* Preview */}
                  {selectedOption && inputValue && (
                    <div className="mb-2">
                      <span
                        className="inline-flex px-3 py-1 rounded-full text-white text-xs"
                        style={{ backgroundColor: selectedOption.tagColour }}
                      >
                        {inputValue}
                      </span>
                    </div>
                  )}

                  {/* Color Picker */}
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() =>
                          setSelectedOption({
                            tagName: inputValue,
                            tagColour: color,
                          })
                        }
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedOption?.tagColour === color
                            ? "border-black scale-110"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t shrink-0">
              <Button
                variant="outline"
                onClick={handleDrawerClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={isEdit ? handleUpdate : handleSubmit}
                disabled={loading || !inputValue || !selectedOption}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEdit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEdit ? "Update" : "Create"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;