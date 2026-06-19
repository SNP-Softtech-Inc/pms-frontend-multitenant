import React, { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToastContext } from "../../../context/ToastContext";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Switch } from "../../../components/ui/switch";
import { DataTable } from "../../../components/data-table/data-table";
import { DataTableToolbar } from "../../../components/data-table/toolbar";
import { templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";
const Service = () => {
  const confirm = useConfirm();
  const { showToast } = useToastContext();
  // ================= STATE =================
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [servicename, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [rate, setRate] = useState("$ 0.00");
  const [tax, setTax] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [ServiceTemplates, setServiceTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    try {
      const res = await templateAPI.getAllCategories();
      setCategoryData(res.data.category || []);
    } catch (error) {
      showToast({
        title: "Failed to fetch categories",
        type: "error",
      });
    }
  };

  // ================= FETCH SERVICES =================
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getAllServiceTemplates();
      setServiceTemplates(res.data.serviceTemplate || []);
    } catch (error) {
      showToast({
        title: "Failed to fetch services",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN SERVICE DRAWER =================
  const openServiceDrawer = (service = null) => {
    if (service) {
      setServiceId(service._id);
      setServiceName(service.serviceName);
      setDescription(service.description);
      setRate(service.rate);
      setTax(service.tax);
      setSelectedOption({ label: service.ratetype, value: service.ratetype });
      setSelectedCategory(
        service.category
          ? {
              label: service.category.categoryName,
              value: service.category._id,
            }
          : null,
      );
    } else {
      setServiceId(null);
      setServiceName("");
      setDescription("");
      setRate("$ 0.00");
      setTax(false);
      setSelectedOption(null);
      setSelectedCategory(null);
    }
    setServiceDrawerOpen(true);
  };

  const closeServiceDrawer = () => {
    setServiceDrawerOpen(false);
    // Reset form on close
    setServiceId(null);
    setServiceName("");
    setDescription("");
    setRate("$ 0.00");
    setTax(false);
    setSelectedOption(null);
    setSelectedCategory(null);
  };

  // ================= OPEN CATEGORY DRAWER =================
  const openCategoryDrawer = (category = null) => {
    if (category) {
      setCategoryId(category._id);
      setCategoryName(category.categoryName);
    } else {
      setCategoryId(null);
      setCategoryName("");
    }
    setCategoryDrawerOpen(true);
  };

  const closeCategoryDrawer = () => {
    setCategoryDrawerOpen(false);
    setCategoryId(null);
    setCategoryName("");
  };

  // ================= SAVE SERVICE =================
  const saveService = async () => {
    if (!servicename) return toast.error("Service name is required");

    const data = {
      serviceName: servicename,
      description,
      rate,
      ratetype: selectedOption?.value,
      tax,
      category: selectedCategory?.value || null,
      active: true,
    };

    try {
      if (serviceId) {
        await templateAPI.updateServiceTemplate(serviceId, data);
        showToast({
          title: "Service updated successfully",
          type: "success",
        });
      } else {
        await templateAPI.createServiceTemplate(data);
        showToast({
          title: "Service created successfully",
          type: "success",
        });
      }
      fetchServices();
      closeServiceDrawer();
    } catch (error) {
      showToast({
        title: "Failed to save service",
        type: "error",
      });
    }
  };

  // ================= SAVE CATEGORY =================
  const saveCategory = async () => {
    if (!categoryName)
      return showToast({
        title: "Category name is required",
        type: "error",
      });

    const data = { categoryName };

    try {
      if (categoryId) {
        await templateAPI.updateCategory(categoryId, data);
        showToast({
          title: "Category updated successfully",
          type: "success",
        });
      } else {
        await templateAPI.createCategory(data);
        showToast({
          title: "Category created successfully",
          type: "success",
        });
      }
      fetchCategories();
      closeCategoryDrawer();
    } catch (error) {
      showToast({
        title: "Failed to save category",
        type: "error",
      });
    }
  };

  // ================= HANDLE RATE CHANGE =================
  // const handleRateChange = (e) => {
  //   const value = e.target.value.replace(/[^0-9.]/g, "");
  //   setRate(`$ ${value}`);
  // };

  const handleRateChange = (e) => {
  let value = e.target.value.replace(/[^0-9.]/g, "");

  // Allow only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Limit to 2 decimal places
  if (value.includes(".")) {
    const [whole, decimal] = value.split(".");
    value = `${whole}.${decimal.slice(0, 2)}`;
  }

  setRate(`$ ${value}`);
};
  // ================= TABLE COLUMNS =================
  const serviceColumns = useMemo(
    () => [
      {
        accessorKey: "serviceName",
        header: "Name",
        cell: ({ getValue, row }) => (
          <button
            onClick={() => openServiceDrawer(row.original)}
            className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left"
          >
            {getValue()}
          </button>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground max-w-[200px] truncate block">
            {getValue() || "-"}
          </span>
        ),
      },
      {
        accessorKey: "rate",
        header: "Rate",
        cell: ({ getValue }) => (
          <span className="text-sm font-medium text-foreground">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: "ratetype",
        header: "Rate Type",
        cell: ({ getValue }) => {
          const val = getValue();
          return val ? <Badge variant="secondary">{val}</Badge> : null;
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {getValue()?.categoryName || "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        size: 80,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => openServiceDrawer(row.original)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                confirm({
                  title: "Delete Service",
                  description: (
                    <>
                      Are you sure you want to delete this service{" "}
                      <span className="font-semibold text-red-600">
                        "{row.original.serviceName}"
                      </span>
                      ?
                    </>
                  ),
                  // description: "Are you sure you want to delete this service? This action cannot be undone.",
                  onConfirm: async () => {
                    try {
                      await templateAPI.deleteServiceTemplate(row.original._id);
                      showToast({
                        title: "Service deleted successfully",
                        type: "success",
                      });
                      fetchServices();
                    } catch (error) {
                      console.error(error);
                      showToast({
                        title: "Failed to delete service",
                        type: "error",
                      });
                    }
                  },
                });
              }}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive hover:bg-destructive/10"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  // ================= FETCH DATA ON MOUNT =================
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const categoryOptions = categoryData.map((cat) => ({
    value: cat._id,
    label: cat.categoryName,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={() => openServiceDrawer()}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Create Service
        </Button>
      </div>

      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      <DataTable
        columns={serviceColumns}
        data={ServiceTemplates}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No services found"
        emptyDescription="Create your first service to get started"
        pageSize={30}
      />

      {/* ================= SERVICE DRAWER ================= */}
      {serviceDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeServiceDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {serviceId ? "Edit Service" : "Create Service"}
              </h2>
              <button
                onClick={closeServiceDrawer}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Service Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter service name"
                    value={servicename}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="flex w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Rate
                    </label>
                    <input
                      type="text"
                      placeholder="$ 0.00"
                      value={rate}
                      onChange={handleRateChange}
                      className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Rate Type
                    </label>
                    <select
                      value={selectedOption?.value || ""}
                      onChange={(e) => {
                        const opt = options.find(
                          (o) => o.value === e.target.value,
                        );
                        setSelectedOption(opt || null);
                      }}
                      className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                    >
                      <option value="">Select Rate Type</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tax Toggle */}
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">
                    Tax
                  </span>
                  <Switch checked={tax} onCheckedChange={setTax} />
                </div>

                {/* Category Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-foreground mb-3">
                    Category
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Select Category
                    </label>
                    <select
                      value={selectedCategory?.value || ""}
                      onChange={(e) => {
                        const opt = categoryOptions.find(
                          (o) => o.value === e.target.value,
                        );
                        setSelectedCategory(opt || null);
                      }}
                      className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCategoryDrawer()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create new category
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={closeServiceDrawer}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {serviceId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY DRAWER ================= */}
      {categoryDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeCategoryDrawer}
          />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="text-base font-semibold text-foreground">
                {categoryId ? "Edit Category" : "Create Category"}
              </h2>
              <button
                onClick={closeCategoryDrawer}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Category Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
              <button
                onClick={closeCategoryDrawer}
                className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCategory}
                className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {categoryId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Service;
