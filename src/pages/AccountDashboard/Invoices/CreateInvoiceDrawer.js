import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
  Grid,
  FormLabel,
  FormControl,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { accountsAPI, invoiceAPI, templateAPI ,authAPI} from "../../../services/api"; // adjust path
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import LineItemsAndSummary from "../../../components/LineItemsAndSummary";
import ServiceDrawer from "../../Templates/InvoiceTemp/ServiceDrawer";
import EditItemDrawer from "../../Templates/InvoiceTemp/EditItemDrawer";
import CategoryDrawer from "../../Templates/InvoiceTemp/CategoryDrawer";
import Editor from "../../../components/Editor";
import { useAuth } from "../../../context/AuthContext"; 
const CreateInvoiceDrawer = ({ open, onClose,fetchInvoices }) => {
    const { user } = useAuth(); // 👈 logged-in user
  const [options, setOptions] = useState([]);
  // 🔹 States
  const [accountOptions, setAccountOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountError, setAccountError] = useState("");
  const [invoicenumber, setinvoicenumber] = useState("");
  const [clientNote, setClientNote] = useState("");
  const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(true);
  const [paymentMode, setPaymentMode] = useState({
    value: "Bank Debits",
    label: "Bank Debits",
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [description, setDescription] = useState("");
  const [showDropdownDescription, setShowDropdownDescription] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [combinedValues, setCombinedValues] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [startDate, setStartDate] = useState(dayjs());
  const [charCount, setCharCount] = useState(0);
  const [payInvoice, setIsPayInvoice] = useState(false);
  const [emailInvoice, setIsEmailInvoice] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  // Drawer states
  const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);
  const [isEditItemDrawerOpen, setIsEditItemDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  // Line items state
  const [rows, setRows] = useState([
    {
      productName: "",
      description: "",
      rate: "$0.00",
      qty: "1",
      amount: "$0.00",
      tax: false,
      isDiscount: false,
    },
  ]);

  // Summary state
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [servicedata, setServiceData] = useState([]);

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authAPI.getAllUsers({
          page: 1,
          limit: 50,
          status: "active",
        });

        const users = res?.data?.users || [];

        const formatted = users.map((u) => ({
          value: u._id,
          label: u.username,
        }));

        setOptions(formatted);

        // ✅ SET DEFAULT LOGGED-IN USER
        if (user) {
          const loggedUserOption = {
            value: user._id,
            label: user.username,
          };

          setSelectedUser([loggedUserOption]); // MultiSelect expects array
        }
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
      }
    };

    fetchUsers();
  }, [user]);
  // ==================== SERVICE HANDLERS ====================
  const fetchServiceData = useCallback(async () => {
    setLoadingServices(true);
    try {
      const response = await templateAPI.getAllServiceTemplates();
      setServiceData(response.data.serviceTemplate || []);
    } catch (error) {
      console.error("Error fetching service data:", error);
      toast.error("Failed to fetch services");
    } finally {
      setLoadingServices(false);
    }
  }, []);
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await templateAPI.getAllCategories();
      setCategoryData(response.data.category || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  }, []);
  const createCategory = useCallback(
    async (categoryName) => {
      if (!categoryName?.trim()) {
        toast.error("Category name is required");
        return false;
      }

      try {
        const response = await templateAPI.createCategory({ categoryName });
        if (response.data.message === "Category created successfully") {
          toast.success("Category created successfully");
          await fetchCategories();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating category:", error);
        toast.error(
          error.response?.data?.message || "Failed to create category",
        );
        return false;
      }
    },
    [fetchCategories],
  );
  const fetchservicebyid = useCallback(
    async (id, rowIndex, setRowsCallback) => {
      try {
        const response = await templateAPI.getServiceTemplateById(id);
        const service = Array.isArray(response.data.serviceTemplate)
          ? response.data.serviceTemplate[0]
          : response.data.serviceTemplate;

        const rate = service.rate
          ? parseFloat(service.rate.replace("$", ""))
          : 0;

        const updatedRow = {
          productName: service.serviceName || "",
          description: service.description || "",
          rate: `$${rate.toFixed(2)}`,
          qty: "1",
          amount: `$${rate.toFixed(2)}`,
          tax: service.tax || false,
          isDiscount: false,
        };

        setRowsCallback((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
          return updatedRows;
        });
      } catch (error) {
        console.error("Error fetching service by ID:", error);
        toast.error("Failed to fetch service details");
      }
    },
    [],
  );
  const createServiceTemplate = useCallback(
    async (data) => {
      try {
        const response = await templateAPI.createServiceTemplate(data);
        if (response.data.message === "ServiceTemplate created successfully") {
          toast.success("Service created successfully");
          await fetchServiceData();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating service:", error);
        toast.error(
          error.response?.data?.message || "Failed to create service",
        );
        return false;
      }
    },
    [fetchServiceData],
  );
  // ==================== DERIVED DATA ====================

  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));
  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));
  useEffect(() => {
    // fetchInvoiceTemplates();
    fetchCategories();
    fetchServiceData();
  }, [fetchServiceData, fetchCategories]);

  // Refs
  const descriptionFieldRef = useRef(null);

  // Update shortcuts based on selected option
  useEffect(() => {
    if (selectedOption === "contacts" || selectedOption === "account") {
      const accountShortcuts = [
        { title: "Account Shortcodes", isBold: true },
        { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
        { title: "Date Shortcodes", isBold: true },
        {
          title: "Current day full date",
          isBold: false,
          value: "CURRENT_DAY_FULL_DATE",
        },
        {
          title: "Current day number",
          isBold: false,
          value: "CURRENT_DAY_NUMBER",
        },
        { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
        { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
        {
          title: "Current month number",
          isBold: false,
          value: "CURRENT_MONTH_NUMBER",
        },
        {
          title: "Current month name",
          isBold: false,
          value: "CURRENT_MONTH_NAME",
        },
        { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
        { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
        {
          title: "Last day full date",
          isBold: false,
          value: "LAST_DAY_FULL_DATE",
        },
        { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
        { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
        { title: "Last week", isBold: false, value: "LAST_WEEK" },
        {
          title: "Last month number",
          isBold: false,
          value: "LAST_MONTH_NUMBER",
        },
        { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
        { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
        { title: "Last_year", isBold: false, value: "LAST_YEAR" },
        {
          title: "Next day full date",
          isBold: false,
          value: "NEXT_DAY_FULL_DATE",
        },
        { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
        { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
        { title: "Next week", isBold: false, value: "NEXT_WEEK" },
        {
          title: "Next month number",
          isBold: false,
          value: "NEXT_MONTH_NUMBER",
        },
        { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
        { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
        { title: "Next year", isBold: false, value: "NEXT_YEAR" },
      ];
      // setShortcuts(accountShortcuts);
      setFilteredShortcuts(accountShortcuts);
    }
  }, [selectedOption]);

  const handleDescriptionAddShortcut = (shortcut) => {
    setDescription((prevText) => {
      const newText =
        prevText.slice(0, cursorPosition) +
        `[${shortcut}]` +
        prevText.slice(cursorPosition);
      return newText.length <= 4000 ? newText : prevText;
    });

    setTimeout(() => {
      if (descriptionFieldRef.current) {
        descriptionFieldRef.current.focus();
        descriptionFieldRef.current.setSelectionRange(
          cursorPosition + shortcut.length + 2,
          cursorPosition + shortcut.length + 2,
        );
      }
    }, 0);

    setShowDropdownDescription(false);
  };

  const toggleDescriptionDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setShowDropdownDescription(!showDropdownDescription);
  };

  const handleCloseDropdown = () => {
    // setShowDropdown(false);

    setShowDropdownDescription(false);
    setAnchorEl(null);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handlePayInvoiceChange = (event) => {
    setIsPayInvoice(event.target.checked);
  };
  const handleEmailInvoiceChange = (event) => {
    setIsEmailInvoice(event.target.checked);
  };
  const handleRemindersChange = (event) => {
    setReminders(event.target.checked);
  };
  // 🔹 Fetch Accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const res = await accountsAPI.getAccountNamesByStatus(true);

        const formatted = res.data.accountlist.map((acc) => ({
          label: acc.accountName,
          value: acc._id,
        }));

        setAccountOptions(formatted);

        // ✅ Get from cookies
        const cookieAccountId = Cookies.get("accountId");
        const cookieAccountName = Cookies.get("accountName");

        if (cookieAccountId && cookieAccountName) {
          // Try to find in fetched list
          const matched = formatted.find(
            (acc) => acc.value === cookieAccountId,
          );

          if (matched) {
            setSelectedAccount(matched);
          } else {
            // fallback (if not in list)
            setSelectedAccount({
              label: cookieAccountName,
              value: cookieAccountId,
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch accounts", err);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchAccounts();
  }, [open]);

  const fetchInvoiceTemplates = async () => {
    try {
      const res = await templateAPI.getAllInvoiceTemplates();

      // console.log("Invoice Templates:", res);

      // ✅ adjust based on your backend response
      const data = res.data.invoiceTemplate;

      setInvoiceTemplates(data);
    } catch (error) {
      console.error("Error fetching Invoice Templates:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceTemplates();
    fetchNextInvoiceNumber();
  }, []);
  const invoiceoptions = invoiceTemplates.map((invoice) => ({
    value: invoice._id,
    label: invoice.templatename,
  }));
  const fetchInvoiceTemplateById = useCallback(async (templateId) => {
    // setLoadingTemplate(true);

    try {
      const response = await templateAPI.getInvoiceTemplateById(templateId);
      const template = response.data.invoiceTemplate;

      if (template) {
        // ✅ Payment Mode
        if (template.paymentMethod) {
          setPaymentMode({
            value: template.paymentMethod,
            label: template.paymentMethod,
          });
        }

        // ✅ Switches
        setIsEmailInvoice(template.sendEmailWhenInvCreated || false);
        setIsPayInvoice(template.payInvoicewithcredits || false);
        setReminders(template.sendReminderstoClients || false);

        // ✅ Description + Message
        setDescription(template.description || "");
        // setClientmsg(template.messageForClient || "");
        setClientNote(template.clientNote || "");

        // ✅ Line Items
        if (template.lineItems?.length > 0) {
          const lineItemsData = template.lineItems.map((item) => ({
            productName: item.productorService || "",
            description: item.description || "",
            rate: item.rate ? `$${item.rate}` : "$0.00",
            qty: item.quantity || "1",
            amount: item.amount ? `$${item.amount}` : "$0.00",
            tax: item.tax === "true" || item.tax === true,
            isDiscount: false,
          }));

          setRows(lineItemsData);
        }

        // ✅ Summary
        if (template.summary) {
          setSubtotal(template.summary.subtotal || 0);
          setTaxRate(template.summary.taxRate || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching invoice template:", error);
      toast.error("Failed to load template data");
    }
  }, []);
  const resetTemplateData = () => {
    setPaymentMode(null);
    setIsEmailInvoice(false);
    setIsPayInvoice(false);
    setReminders(false);
    setDescription("");
    // setClientmsg("");
    setClientNote("");
    setRows([]);
    setSubtotal(0);
    setTaxRate(0);
  };
  const fetchNextInvoiceNumber = async () => {
    try {
      setIsLoadingInvoiceNumber(true);

      const res = await invoiceAPI.getNextInvoiceNumber();

      console.log("Invoice Number Response:", res);

      const nextNumber = res.data?.nextInvoiceNumber;

      setinvoicenumber(nextNumber ? nextNumber.toString() : "Auto-generated");
    } catch (error) {
      console.error("Error fetching next invoice number:", error);

      setinvoicenumber("Auto-generated");
      toast.error("Failed to load invoice number");
    } finally {
      setIsLoadingInvoiceNumber(false);
    }
  };
  const paymentsOptions = [
    { value: "Bank Debits", label: "Bank Debits" },
    { value: "Credit Card", label: "Credit Card" },
    {
      value: "Credit Card or Bank Debits",
      label: "Credit Card or Bank Debits",
    },
  ];
  const handlePaymentOptionChange = (event, selectedOption) => {
    setPaymentMode(selectedOption);
  };
  // 🔹 Handlers
  const handleAccountChange = (value) => {
    setSelectedAccount(value);
    setAccountError("");
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    const selectedValues = newSelectedUsers.map((option) => option.value);
    setCombinedValues(selectedValues);
  };

  const handleSave = async () => {
  if (!selectedAccount) {
    setAccountError("Account is required");
    return;
  }

  try {
    const payload = {
      account: selectedAccount?.value,
      invoicenumber: invoicenumber,
      invoicedate: startDate,
      description: description,
      invoicetemplate: selectedTemplate?.value,
      paymentMethod: paymentMode?.value,

      // ✅ MULTI USER FIX
      teammember: selectedUser.value,

      emailinvoicetoclient: emailInvoice,
      scheduleinvoicedate: new Date(),
      scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
        hour12: false,
      }),

      payInvoicewithcredits: payInvoice,
      reminders: reminders,

      // 🔹 if you have these states
      scheduleinvoice: false,
      daysuntilnextreminder: 0,
      numberOfreminder: 0,

      // ✅ LINE ITEMS FORMAT FIX
      lineItems: rows.map((row) => ({
        productorService: row.productName,
        description: row.description,
        rate: parseFloat(row.rate.replace("$", "")) || 0,
        quantity: parseInt(row.qty) || 1,
        amount: parseFloat(row.amount.replace("$", "")) || 0,
        tax: row.tax,
      })),

      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },

      active: "true",
      paidAmount: 0,
      invoiceStatus: "Pending",
      balanceDueAmount: totalAmount,
    };

    const res = await invoiceAPI.createInvoice(payload);

    if (res?.data?.message === "Invoice created successfully") {
      toast.success("Invoice created successfully");
      onClose();
      fetchInvoices();
      
    } else {
      toast.error(res?.data?.message || "Failed to create invoice");
    }
  } catch (error) {
    console.error("Create invoice error:", error);
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  }
};

  // ==================== LINE ITEMS HANDLERS ====================
  const handleInputChange = useCallback((index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setRows((prevRows) => {
      const newRows = [...prevRows];

      if (name === "rate" || name === "qty") {
        newRows[index][name] = newValue;
        const rate = parseFloat(newRows[index].rate.replace("$", "")) || 0;
        const qty = parseInt(newRows[index].qty) || 0;
        const amount = (rate * qty).toFixed(2);
        newRows[index].amount = `$${amount}`;
      } else {
        newRows[index][name] = newValue;
      }

      return newRows;
    });
  }, []);

  const addRow = useCallback((isDiscountRow = false) => {
    const newRow = isDiscountRow
      ? {
          productName: "",
          description: "",
          rate: "$-10.00",
          qty: "1",
          amount: "$-10.00",
          tax: false,
          isDiscount: true,
        }
      : {
          productName: "",
          description: "",
          rate: "$0.00",
          qty: "1",
          amount: "$0.00",
          tax: false,
          isDiscount: false,
        };
    setRows((prev) => [...prev, newRow]);
  }, []);

  const deleteRow = useCallback((index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ==================== SUMMARY CALCULATION ====================
  const calculateSummary = useCallback(() => {
    let subtotalSum = 0;
    let taxableAmount = 0;

    rows.forEach((row) => {
      const amount = parseFloat(row.amount.replace("$", "")) || 0;
      subtotalSum += amount;
      if (row.tax) {
        taxableAmount += amount;
      }
    });

    const tax = taxableAmount * (taxRate / 100);
    setSubtotal(subtotalSum);
    setTaxTotal(tax);
    setTotalAmount((subtotalSum + tax).toFixed(2));
  }, [rows, taxRate]);

  useEffect(() => {
    calculateSummary();
  }, [calculateSummary]);
  // ==================== SERVICE DRAWER HANDLERS ====================
  const handleSaveAsNewService = useCallback((row) => {
    setSelectedRowData(row);
    setIsNewServiceDrawerOpen(true);
  }, []);

  const handleEditService = useCallback((row, index) => {
    setSelectedRowData(row);
    setSelectedRowIndex(index);
    setIsEditItemDrawerOpen(true);
  }, []);

  const handleSaveChanges = useCallback(() => {
    if (selectedRowIndex !== null) {
      const updatedRows = [...rows];
      const rateValue =
        parseFloat(selectedRowData.rate?.replace(/[^0-9.-]+/g, "")) || 0;
      const qtyValue = parseInt(selectedRowData.qty) || 0;
      const amount = (rateValue * qtyValue).toFixed(2);

      updatedRows[selectedRowIndex] = {
        ...selectedRowData,
        amount: `$${amount}`,
      };
      setRows(updatedRows);
    }
    setIsEditItemDrawerOpen(false);
  }, [selectedRowIndex, selectedRowData, rows]);

  const handleDeleteService = useCallback(() => {
    if (selectedRowIndex !== null) {
      deleteRow(selectedRowIndex);
    }
  }, [selectedRowIndex, deleteRow]);

  const handleDuplicate = useCallback(
    (index) => {
      const duplicatedRow = {
        ...rows[index],
        productName: rows[index].productName
          ? `${rows[index].productName} Copy`
          : "Copy",
      };
      setRows([...rows, duplicatedRow]);
    },
    [rows],
  );

  const handleServiceChangeWrapper = useCallback(
    (index, selectedOption) => {
      if (selectedOption) {
        fetchservicebyid(selectedOption.value, index, setRows);
      }
    },
    [fetchservicebyid],
  );

  const handleServiceInputChangeWrapper = useCallback(
    (inputValue, actionMeta, index) => {
      if (actionMeta.action === "input-change") {
        setRows((prevRows) => {
          const newRows = [...prevRows];
          newRows[index].productName = inputValue;
          return newRows;
        });
      }
    },
    [],
  );
  const handleCreateService = useCallback(async () => {
    const payload = {
      serviceName: selectedRowData?.productName,
      description: selectedRowData?.description,
      rate: selectedRowData?.rate,
      ratetype: selectedRowData?.ratetype?.value,
      tax: selectedRowData?.tax,
      category: selectedRowData?.category?.value,
      active: "true",
    };

    const success = await createServiceTemplate(payload);
    if (success) {
      setIsNewServiceDrawerOpen(false);
      setSelectedRowData(null);
    }
  }, [selectedRowData, createServiceTemplate]);
  const handleCreateCategory = useCallback(
    async (categoryName) => {
      const success = await createCategory(categoryName);
      if (success) {
        setIsCategoryDrawerOpen(false);
      }
    },
    [createCategory],
  );
  return (
    <Box>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 700, p: 2 }}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Create new Invoice</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Form */}
          <Box>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Account */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Account name, ID or email
                </Typography>

                <Autocomplete
                  options={accountOptions}
                  value={selectedAccount}
                  onChange={(e, value) => handleAccountChange(value)}
                  isOptionEqualToValue={(option, value) =>
                    option?.value === value?.value
                  }
                  getOptionLabel={(option) => option?.label || ""}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search for an account..."
                      error={!!accountError}
                      helperText={accountError}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading && <CircularProgress size={20} />}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Invoice Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" mb={1}>
                  Invoice Template
                </Typography>
                <Autocomplete
                  options={invoiceoptions}
                  value={selectedTemplate}
                  onChange={(e, value) => {
                    setSelectedTemplate(value);

                    if (value?.value) {
                      fetchInvoiceTemplateById(value.value);
                    } else {
                      resetTemplateData(); // optional reset
                    }
                  }}
                  getOptionLabel={(option) => option?.label || ""}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Invoice Template" />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={2}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Account */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">Invoice Number</Typography>

                <TextField
                  fullWidth
                  value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
                  placeholder="Invoice Number"
                  size="small"
                  sx={{ mt: 1 }}
                  InputProps={{
                    readOnly: true, // Make it read-only since it's auto-generated
                  }}
                  helperText="Auto-generated invoice number"
                  disabled={isLoadingInvoiceNumber}
                />
              </Grid>

              {/* Invoice Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1">
                  Choose payment method
                </Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  options={paymentsOptions}
                  getOptionLabel={(option) => option?.label || ""}
                  onChange={handlePaymentOptionChange}
                  value={paymentMode}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Payment Mode"
                      variant="outlined"
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value?.value
                  }
                  clearOnEscape
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={2}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {/* Account */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <FormLabel sx={{ marginBottom: "8px", color: "black" }}>
                    Date
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="MM/DD/YYYY"
                      // sx={{ width: "100%", backgroundColor: "#fff" }}
                      value={startDate} // Default to today's date
                      onChange={handleStartDateChange}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>

              {/* Invoice Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" mb={1}>
                  Team Member
                </Typography>
                <MultiSelectDropdown
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="Team Member"
                   options={options}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={2}>
            <ShortcodeTextField
              label="Description"
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 4000) {
                  setDescription(value);
                  setCharCount(value.length);
                }
              }}
              placeholder="Description"
              multiline
              rows={4}
              maxLength={4000}
              inputRef={descriptionFieldRef}
              onClick={(e) => setCursorPosition(e.target.selectionStart)}
              helperText={`${description.length}/4000 characters`}
              // shortcuts
              shortcuts={filteredShortcuts}
              showShortcutDropdown={showDropdownDescription}
              anchorElShortcut={anchorEl}
              onToggleShortcutDropdown={toggleDescriptionDropdown}
              onCloseShortcutDropdown={handleCloseDropdown}
              onAddShortcut={handleDescriptionAddShortcut}
            />
          </Box>
          <Box mt={2}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Additioal
            </Typography>
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={payInvoice}
                    onChange={handlePayInvoiceChange}
                    color="primary"
                  />
                }
                label={"Pay invoice using client credits"}
              />
            </Box>
            <Box mt={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailInvoice}
                    onChange={handleEmailInvoiceChange}
                    color="primary"
                  />
                }
                label={"Email invoice to client"}
              />
            </Box>
            <Box mt={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={reminders}
                    onChange={handleRemindersChange}
                    color="primary"
                  />
                }
                label={"Reminders"}
              />
            </Box>

            <Box>
              {/* Replace the entire line items and summary section with the reusable component */}
              <LineItemsAndSummary
                rows={rows}
                serviceoptions={serviceoptions}
                onInputChange={handleInputChange}
                onServiceChange={handleServiceChangeWrapper}
                onServiceInputChange={handleServiceInputChangeWrapper}
                onAddRow={addRow}
                onDeleteRow={deleteRow}
                onEditService={handleEditService}
                onDeleteService={handleDeleteService}
                onSaveAsNewService={handleSaveAsNewService}
                onDuplicate={handleDuplicate}
                subtotal={subtotal}
                onSubtotalChange={setSubtotal}
                taxRate={taxRate}
                onTaxRateChange={setTaxRate}
                taxTotal={taxTotal}
                totalAmount={totalAmount}
                lineItemsTitle="Line items"
                lineItemsSubtitle="Client-facing itemized list of products and services"
                summaryTitle="Summary"
              />

              <Box sx={{ mb: 10, mt: 2 }}>
                <Typography variant="h6" mb={1}>
                  Note to client
                </Typography>
                <Editor onChange={setClientNote} value={clientNote} />
              </Box>
            </Box>
          </Box>
          {/* Actions */}
          <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
      <ServiceDrawer
        open={isNewServiceDrawerOpen}
        onClose={() => setIsNewServiceDrawerOpen(false)}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        categoryoptions={categoryoptions}
        onCreateCategory={() => setIsCategoryDrawerOpen(true)}
        onSave={handleCreateService}
      />

      <CategoryDrawer
        open={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        onCreateCategory={handleCreateCategory}
      />

      <EditItemDrawer
        open={isEditItemDrawerOpen}
        onClose={() => setIsEditItemDrawerOpen(false)}
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        onSave={handleSaveChanges}
      />
    </Box>
  );
};

export default CreateInvoiceDrawer;
