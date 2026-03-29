import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Drawer,
  Grid,

  Autocomplete,
  FormControlLabel,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,

} from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { useConfirm } from "../../../components/ConfirmDialogContext";
import { templateAPI } from "../../../services/api"; // centralized API

const Service = () => {
const confirm = useConfirm();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // ================= STATE =================
  const [serviceDrawerOpen, setServiceDrawerOpen] = useState(false);
  const [serviceId, setServiceId] = useState(null); // null → create, otherwise edit
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

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    try {
      const res = await templateAPI.getAllCategories();
      setCategoryData(res.data.category || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // ================= FETCH SERVICES =================
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await templateAPI.getAllServiceTemplates();
      setServiceTemplates(res.data.serviceTemplate || []);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN SERVICE DRAWER =================

  // In your Service component, modify the openServiceDrawer function:
  const openServiceDrawer = (service = null) => {
    if (service) {
      // Editing existing service → pre-fill fields
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
      // Creating new service → empty fields
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
  const closeServiceDrawer = () => setServiceDrawerOpen(false);

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
  const closeCategoryDrawer = () => setCategoryDrawerOpen(false);

  // ================= SAVE SERVICE =================

  // In your saveService function:
  const saveService = async () => {
    if (!servicename) return toast.error("Service name is required");

    const data = {
      serviceName: servicename,
      description,
      rate,
      ratetype: selectedOption.value,
      tax,
      category: selectedCategory?.value || null,
      active: true,
    };

    try {
      if (serviceId) {
        // Update existing service
        await templateAPI.updateServiceTemplate(serviceId, data);
        toast.success("Service updated successfully");
      } else {
        // Create new service
        await templateAPI.createServiceTemplate(data);
        toast.success("Service created successfully");
      }
      fetchServices(); // Refresh service list
      setServiceDrawerOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save service");
    }
  };

  // ================= SAVE CATEGORY =================
  const saveCategory = async () => {
    if (!categoryName) return toast.error("Category name is required");

    const data = { categoryName };

    try {
      if (categoryId) {
        await templateAPI.updateCategory(categoryId, data);
        toast.success("Category updated successfully");
      } else {
        await templateAPI.createCategory(data);
        toast.success("Category created successfully");
      }
      fetchCategories();
      closeCategoryDrawer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  // ================= DELETE SERVICE =================
const deleteService = async (id) => {
  confirm({
    title: "Delete Service",
    description: "Are you sure you want to delete this service?",
    onConfirm: async () => {
      try {
        await templateAPI.deleteServiceTemplate(id);
        toast.success("Service deleted successfully");
        fetchServices();
      
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete service");
      }
    },
  });
};




  // ================= PAGINATION =================
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedServices = ServiceTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const categoryOptions = categoryData.map((cat) => ({
    value: cat._id,
    label: cat.categoryName,
  }));
  const updatedCategoryOptions = [
  ...categoryOptions,
  { label: "+ Add Category", isAddNew: true },
];

  return (
    <Box>
      <Button
        onClick={() => openServiceDrawer()}
        variant="contained"
        sx={{ mr: 2 }}
      >
        Create Service
      </Button>
      <Button onClick={() => openCategoryDrawer()} variant="outlined">
        Create Category
      </Button>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Rate Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Settings</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedServices.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.serviceName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.rate}</TableCell>
                  <TableCell>{row.ratetype}</TableCell>
                  <TableCell>{row.category?.categoryName || ""}</TableCell>
                  <TableCell sx={{display:'flex',alignItems:'center', gap:2}}>
                    <Button
                      onClick={() => openServiceDrawer(row)}
                      size="small"
                      variant="outlined"
                    >
                      Edit
                    </Button>
                     <Button
    onClick={() => deleteService(row._id)}
    size="small"
    variant="outlined"
    color="error"
  >
    Delete
  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={ServiceTemplates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* ================= SERVICE DRAWER ================= */}
      <Drawer
        anchor="right"
        open={serviceDrawerOpen}
        onClose={closeServiceDrawer}
        PaperProps={{ sx: { width: isSmallScreen ? "100%" : 650 } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              {serviceId ? "Edit Service" : "Create Service"}
            </Typography>
            <RxCross2
              style={{ cursor: "pointer" }}
              onClick={closeServiceDrawer}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" mb={1}>
              Service Name
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Service Name"
              value={servicename}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="subtitle1" mb={1}>
              Description
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={description}
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box mt={2}>
            {" "}
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" mb={1}>
                  Rate
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={rate}
                  onChange={(e) =>
                    setRate(`$ ${e.target.value.replace(/[^0-9.]/g, "")}`)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" mb={1}>
                  Rate Type
                </Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  options={options}
                  getOptionLabel={(opt) => opt?.label || ""}
                  // getOptionLabel={(opt) => opt.label}
                  value={selectedOption}
                  onChange={(e, val) => setSelectedOption(val)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Rate Type" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={tax}
                  onChange={(e) => setTax(e.target.checked)}
                />
              }
              label="Tax"
            />
          </Box>

          <Box mt={2}>
            {" "}
            <Typography variant="subtitle1" mb={1}>
              Category
            </Typography>
            {/* <Autocomplete
              size="small"
              fullWidth
              options={categoryOptions}
              getOptionLabel={(opt) => opt.label}
              value={selectedCategory}
              onChange={(e, val) => setSelectedCategory(val)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Category" />
              )}
            /> */}
            <Autocomplete
  size="small"
  fullWidth
  options={updatedCategoryOptions}
  getOptionLabel={(opt) => opt.label}
  value={selectedCategory}
  onChange={(e, val) => {
    if (val?.isAddNew) {
      openCategoryDrawer(); // 👈 open drawer
      return;
    }
    setSelectedCategory(val);
  }}
  renderOption={(props, option) => (
    <li
      {...props}
      style={{
        fontWeight: option.isAddNew ? 600 : 400,
        color: option.isAddNew ? "#1976d2" : "inherit",
      }}
    >
      {option.label}
    </li>
  )}
  renderInput={(params) => (
    <TextField {...params} placeholder="Select Category" />
  )}
/>
          </Box>

          <Button sx={{ mt: 2 }} variant="contained" onClick={saveService}>
            {serviceId ? "Update Service" : "Save Service"}
          </Button>
        </Box>
      </Drawer>

      {/* ================= CATEGORY DRAWER ================= */}
      <Drawer
        anchor="right"
        open={categoryDrawerOpen}
        onClose={closeCategoryDrawer}
        PaperProps={{ sx: { width: isSmallScreen ? "100%" : 450 } }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">
              {categoryId ? "Edit Category" : "Create Category"}
            </Typography>
            <RxCross2
              style={{ cursor: "pointer" }}
              onClick={closeCategoryDrawer}
            />
          </Box>
          <Box mt={2}>
            {" "}
            <Typography variant="subtitle1" mb={1}>
              Category Name
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={categoryName}
              placeholder="Category Name"
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Box>

          <Button sx={{ mt: 2 }} variant="contained" onClick={saveCategory}>
            {categoryId ? "Update Category" : "Save Category"}
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Service;
