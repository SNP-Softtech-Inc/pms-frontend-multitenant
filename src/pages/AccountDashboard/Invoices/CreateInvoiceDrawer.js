// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   Drawer,
//   Box,
//   Typography,
//   IconButton,
//   Divider,
//   TextField,
//   Button,
//   Autocomplete,
//   CircularProgress,
//   Grid,
//   FormLabel,
//   FormControl,
//   FormControlLabel,
//   Switch,
// } from "@mui/material";
// import { toast } from "react-toastify";
// import CloseIcon from "@mui/icons-material/Close";
// import { accountsAPI, invoiceAPI, templateAPI ,authAPI} from "../../../services/api"; // adjust path
// import Cookies from "js-cookie";
// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
// import ShortcodeTextField from "../../../components/ShortcodeTextField";
// import LineItemsAndSummary from "../../../components/LineItemsAndSummary";
// import ServiceDrawer from "../../Templates/InvoiceTemp/ServiceDrawer";
// import EditItemDrawer from "../../Templates/InvoiceTemp/EditItemDrawer";
// import CategoryDrawer from "../../Templates/InvoiceTemp/CategoryDrawer";
// import Editor from "../../../components/Editor";
// import { useAuth } from "../../../context/AuthContext";
// const CreateInvoiceDrawer = ({ open, onClose,fetchInvoices }) => {
//     const { user } = useAuth(); // 👈 logged-in user
//   const [options, setOptions] = useState([]);
//   // 🔹 States
//   const [accountOptions, setAccountOptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [accountError, setAccountError] = useState("");
//   const [invoicenumber, setinvoicenumber] = useState("");
//   const [clientNote, setClientNote] = useState("");
//   const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(true);
//   const [paymentMode, setPaymentMode] = useState({
//     value: "Bank Debits",
//     label: "Bank Debits",
//   });
//   const [selectedTemplate, setSelectedTemplate] = useState(null);
//   const [description, setDescription] = useState("");
//   const [showDropdownDescription, setShowDropdownDescription] = useState(false);
//   const [selectedUser, setSelectedUser] = useState([]);
//   const [combinedValues, setCombinedValues] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [invoiceTemplates, setInvoiceTemplates] = useState([]);
//   const [cursorPosition, setCursorPosition] = useState(0);
//   const [filteredShortcuts, setFilteredShortcuts] = useState([]);
//   const [selectedOption, setSelectedOption] = useState("contacts");
//   const [startDate, setStartDate] = useState(dayjs());
//   const [charCount, setCharCount] = useState(0);
//   const [payInvoice, setIsPayInvoice] = useState(false);
//   const [emailInvoice, setIsEmailInvoice] = useState(false);
//   const [reminders, setReminders] = useState(false);
//   const [loadingServices, setLoadingServices] = useState(false);
//   const [categoryData, setCategoryData] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   // Drawer states
//   const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);
//   const [isEditItemDrawerOpen, setIsEditItemDrawerOpen] = useState(false);
//   const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
//   const [selectedRowData, setSelectedRowData] = useState(null);
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   // Line items state
//   const [rows, setRows] = useState([
//     {
//       productName: "",
//       description: "",
//       rate: "$0.00",
//       qty: "1",
//       amount: "$0.00",
//       tax: false,
//       isDiscount: false,
//     },
//   ]);

//   // Summary state
//   const [subtotal, setSubtotal] = useState(0);
//   const [taxRate, setTaxRate] = useState(0);
//   const [taxTotal, setTaxTotal] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [servicedata, setServiceData] = useState([]);

//   // ================= FETCH USERS =================
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await authAPI.getAllUsers({
//           page: 1,
//           limit: 50,
//           status: "active",
//         });

//         const users = res?.data?.users || [];

//         const formatted = users.map((u) => ({
//           value: u._id,
//           label: u.username,
//         }));

//         setOptions(formatted);

//         // ✅ SET DEFAULT LOGGED-IN USER
//         if (user) {
//           const loggedUserOption = {
//             value: user._id,
//             label: user.username,
//           };

//           setSelectedUser([loggedUserOption]); // MultiSelect expects array
//         }
//       } catch (err) {
//         console.error("User fetch error:", err?.response || err);
//       }
//     };

//     fetchUsers();
//   }, [user]);
//   // ==================== SERVICE HANDLERS ====================
//   const fetchServiceData = useCallback(async () => {
//     setLoadingServices(true);
//     try {
//       const response = await templateAPI.getAllServiceTemplates();
//       setServiceData(response.data.serviceTemplate || []);
//     } catch (error) {
//       console.error("Error fetching service data:", error);
//       toast.error("Failed to fetch services");
//     } finally {
//       setLoadingServices(false);
//     }
//   }, []);
//   const fetchCategories = useCallback(async () => {
//     setLoadingCategories(true);
//     try {
//       const response = await templateAPI.getAllCategories();
//       setCategoryData(response.data.category || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Failed to fetch categories");
//     } finally {
//       setLoadingCategories(false);
//     }
//   }, []);
//   const createCategory = useCallback(
//     async (categoryName) => {
//       if (!categoryName?.trim()) {
//         toast.error("Category name is required");
//         return false;
//       }

//       try {
//         const response = await templateAPI.createCategory({ categoryName });
//         if (response.data.message === "Category created successfully") {
//           toast.success("Category created successfully");
//           await fetchCategories();
//           return true;
//         }
//         return false;
//       } catch (error) {
//         console.error("Error creating category:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to create category",
//         );
//         return false;
//       }
//     },
//     [fetchCategories],
//   );
//   const fetchservicebyid = useCallback(
//     async (id, rowIndex, setRowsCallback) => {
//       try {
//         const response = await templateAPI.getServiceTemplateById(id);
//         const service = Array.isArray(response.data.serviceTemplate)
//           ? response.data.serviceTemplate[0]
//           : response.data.serviceTemplate;

//         const rate = service.rate
//           ? parseFloat(service.rate.replace("$", ""))
//           : 0;

//         const updatedRow = {
//           productName: service.serviceName || "",
//           description: service.description || "",
//           rate: `$${rate.toFixed(2)}`,
//           qty: "1",
//           amount: `$${rate.toFixed(2)}`,
//           tax: service.tax || false,
//           isDiscount: false,
//         };

//         setRowsCallback((prevRows) => {
//           const updatedRows = [...prevRows];
//           updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
//           return updatedRows;
//         });
//       } catch (error) {
//         console.error("Error fetching service by ID:", error);
//         toast.error("Failed to fetch service details");
//       }
//     },
//     [],
//   );
//   const createServiceTemplate = useCallback(
//     async (data) => {
//       try {
//         const response = await templateAPI.createServiceTemplate(data);
//         if (response.data.message === "ServiceTemplate created successfully") {
//           toast.success("Service created successfully");
//           await fetchServiceData();
//           return true;
//         }
//         return false;
//       } catch (error) {
//         console.error("Error creating service:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to create service",
//         );
//         return false;
//       }
//     },
//     [fetchServiceData],
//   );
//   // ==================== DERIVED DATA ====================

//   const serviceoptions = servicedata.map((service) => ({
//     value: service._id,
//     label: service.serviceName,
//   }));
//   const categoryoptions = categoryData.map((category) => ({
//     value: category._id,
//     label: category.categoryName,
//   }));
//   useEffect(() => {
//     // fetchInvoiceTemplates();
//     fetchCategories();
//     fetchServiceData();
//   }, [fetchServiceData, fetchCategories]);

//   // Refs
//   const descriptionFieldRef = useRef(null);

//   // Update shortcuts based on selected option
//   useEffect(() => {
//     if (selectedOption === "contacts" || selectedOption === "account") {
//       const accountShortcuts = [
//         { title: "Account Shortcodes", isBold: true },
//         { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
//         { title: "Date Shortcodes", isBold: true },
//         {
//           title: "Current day full date",
//           isBold: false,
//           value: "CURRENT_DAY_FULL_DATE",
//         },
//         {
//           title: "Current day number",
//           isBold: false,
//           value: "CURRENT_DAY_NUMBER",
//         },
//         { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
//         { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
//         {
//           title: "Current month number",
//           isBold: false,
//           value: "CURRENT_MONTH_NUMBER",
//         },
//         {
//           title: "Current month name",
//           isBold: false,
//           value: "CURRENT_MONTH_NAME",
//         },
//         { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
//         { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
//         {
//           title: "Last day full date",
//           isBold: false,
//           value: "LAST_DAY_FULL_DATE",
//         },
//         { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
//         { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
//         { title: "Last week", isBold: false, value: "LAST_WEEK" },
//         {
//           title: "Last month number",
//           isBold: false,
//           value: "LAST_MONTH_NUMBER",
//         },
//         { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
//         { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
//         { title: "Last_year", isBold: false, value: "LAST_YEAR" },
//         {
//           title: "Next day full date",
//           isBold: false,
//           value: "NEXT_DAY_FULL_DATE",
//         },
//         { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
//         { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
//         { title: "Next week", isBold: false, value: "NEXT_WEEK" },
//         {
//           title: "Next month number",
//           isBold: false,
//           value: "NEXT_MONTH_NUMBER",
//         },
//         { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
//         { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
//         { title: "Next year", isBold: false, value: "NEXT_YEAR" },
//       ];
//       // setShortcuts(accountShortcuts);
//       setFilteredShortcuts(accountShortcuts);
//     }
//   }, [selectedOption]);

//   const handleDescriptionAddShortcut = (shortcut) => {
//     setDescription((prevText) => {
//       const newText =
//         prevText.slice(0, cursorPosition) +
//         `[${shortcut}]` +
//         prevText.slice(cursorPosition);
//       return newText.length <= 4000 ? newText : prevText;
//     });

//     setTimeout(() => {
//       if (descriptionFieldRef.current) {
//         descriptionFieldRef.current.focus();
//         descriptionFieldRef.current.setSelectionRange(
//           cursorPosition + shortcut.length + 2,
//           cursorPosition + shortcut.length + 2,
//         );
//       }
//     }, 0);

//     setShowDropdownDescription(false);
//   };

//   const toggleDescriptionDropdown = (event) => {
//     setAnchorEl(event.currentTarget);
//     setShowDropdownDescription(!showDropdownDescription);
//   };

//   const handleCloseDropdown = () => {
//     // setShowDropdown(false);

//     setShowDropdownDescription(false);
//     setAnchorEl(null);
//   };
//   const handleStartDateChange = (date) => {
//     setStartDate(date);
//   };
//   const handlePayInvoiceChange = (event) => {
//     setIsPayInvoice(event.target.checked);
//   };
//   const handleEmailInvoiceChange = (event) => {
//     setIsEmailInvoice(event.target.checked);
//   };
//   const handleRemindersChange = (event) => {
//     setReminders(event.target.checked);
//   };

// useEffect(() => {
//   const fetchAccounts = async () => {
//     try {
//       setLoading(true);

//       let res;

//       // ✅ ROLE-BASED API CALL
//       if (user?.role === "team_member") {
//         res = await accountsAPI.getAccountsByTeamMember(true);
//       } else {
//         res = await accountsAPI.getAccountNamesByStatus(true);
//       }

//       const list = res?.data?.accountlist || [];

//       const formatted = list.map((acc) => ({
//         label: acc.accountName,
//         value: acc._id,
//       }));

//       setAccountOptions(formatted);

//       // ✅ COOKIE HANDLING
//       const cookieAccountId = Cookies.get("accountId");
//       const cookieAccountName = Cookies.get("accountName");

//       if (cookieAccountId && cookieAccountName) {
//         const matched = formatted.find(
//           (acc) => acc.value === cookieAccountId
//         );

//         if (matched) {
//           setSelectedAccount(matched);
//         } else {
//           // fallback
//           setSelectedAccount({
//             label: cookieAccountName,
//             value: cookieAccountId,
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Failed to fetch accounts", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ ensure user exists before calling
//   if (open && user) fetchAccounts();
// }, [open, user]);
//   const fetchInvoiceTemplates = async () => {
//     try {
//       const res = await templateAPI.getAllInvoiceTemplates();

//       // console.log("Invoice Templates:", res);

//       // ✅ adjust based on your backend response
//       const data = res.data.invoiceTemplate;

//       setInvoiceTemplates(data);
//     } catch (error) {
//       console.error("Error fetching Invoice Templates:", error);
//     }
//   };

//   useEffect(() => {
//     fetchInvoiceTemplates();
//     fetchNextInvoiceNumber();
//   }, []);
//   const invoiceoptions = invoiceTemplates.map((invoice) => ({
//     value: invoice._id,
//     label: invoice.templatename,
//   }));
//   const fetchInvoiceTemplateById = useCallback(async (templateId) => {
//     // setLoadingTemplate(true);

//     try {
//       const response = await templateAPI.getInvoiceTemplateById(templateId);
//       const template = response.data.invoiceTemplate;

//       if (template) {
//         // ✅ Payment Mode
//         if (template.paymentMethod) {
//           setPaymentMode({
//             value: template.paymentMethod,
//             label: template.paymentMethod,
//           });
//         }

//         // ✅ Switches
//         setIsEmailInvoice(template.sendEmailWhenInvCreated || false);
//         setIsPayInvoice(template.payInvoicewithcredits || false);
//         setReminders(template.sendReminderstoClients || false);

//         // ✅ Description + Message
//         setDescription(template.description || "");
//         // setClientmsg(template.messageForClient || "");
//         setClientNote(template.clientNote || "");

//         // ✅ Line Items
//         if (template.lineItems?.length > 0) {
//           const lineItemsData = template.lineItems.map((item) => ({
//             productName: item.productorService || "",
//             description: item.description || "",
//             rate: item.rate ? `$${item.rate}` : "$0.00",
//             qty: item.quantity || "1",
//             amount: item.amount ? `$${item.amount}` : "$0.00",
//             tax: item.tax === "true" || item.tax === true,
//             isDiscount: false,
//           }));

//           setRows(lineItemsData);
//         }

//         // ✅ Summary
//         if (template.summary) {
//           setSubtotal(template.summary.subtotal || 0);
//           setTaxRate(template.summary.taxRate || 0);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching invoice template:", error);
//       toast.error("Failed to load template data");
//     }
//   }, []);
//   const resetTemplateData = () => {
//     setPaymentMode(null);
//     setIsEmailInvoice(false);
//     setIsPayInvoice(false);
//     setReminders(false);
//     setDescription("");
//     // setClientmsg("");
//     setClientNote("");
//     setRows([]);
//     setSubtotal(0);
//     setTaxRate(0);
//   };
//   const fetchNextInvoiceNumber = async () => {
//     try {
//       setIsLoadingInvoiceNumber(true);

//       const res = await invoiceAPI.getNextInvoiceNumber();

//       console.log("Invoice Number Response:", res);

//       const nextNumber = res.data?.nextInvoiceNumber;

//       setinvoicenumber(nextNumber ? nextNumber.toString() : "Auto-generated");
//     } catch (error) {
//       console.error("Error fetching next invoice number:", error);

//       setinvoicenumber("Auto-generated");
//       toast.error("Failed to load invoice number");
//     } finally {
//       setIsLoadingInvoiceNumber(false);
//     }
//   };
//   const paymentsOptions = [
//     { value: "Bank Debits", label: "Bank Debits" },
//     { value: "Credit Card", label: "Credit Card" },
//     {
//       value: "Credit Card or Bank Debits",
//       label: "Credit Card or Bank Debits",
//     },
//   ];
//   const handlePaymentOptionChange = (event, selectedOption) => {
//     setPaymentMode(selectedOption);
//   };
//   // 🔹 Handlers
//   const handleAccountChange = (value) => {
//     setSelectedAccount(value);
//     setAccountError("");
//   };

//   const handleUserChange = (newSelectedUsers) => {
//     setSelectedUser(newSelectedUsers);
//     const selectedValues = newSelectedUsers.map((option) => option.value);
//     setCombinedValues(selectedValues);
//   };

//   const handleSave = async () => {
//   if (!selectedAccount) {
//     setAccountError("Account is required");
//     return;
//   }

//   try {
//     const payload = {
//       account: selectedAccount?.value,
//       invoicenumber: invoicenumber,
//       invoicedate: startDate,
//       description: description,
//       invoicetemplate: selectedTemplate?.value,
//       paymentMethod: paymentMode?.value,

//       // ✅ MULTI USER FIX
//       teammember: selectedUser.value,

//       emailinvoicetoclient: emailInvoice,
//       scheduleinvoicedate: new Date(),
//       scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
//         hour12: false,
//       }),

//       payInvoicewithcredits: payInvoice,
//       reminders: reminders,

//       // 🔹 if you have these states
//       scheduleinvoice: false,
//       daysuntilnextreminder: 0,
//       numberOfreminder: 0,

//       // ✅ LINE ITEMS FORMAT FIX
//       lineItems: rows.map((row) => ({
//         productorService: row.productName,
//         description: row.description,
//         rate: parseFloat(row.rate.replace("$", "")) || 0,
//         quantity: parseInt(row.qty) || 1,
//         amount: parseFloat(row.amount.replace("$", "")) || 0,
//         tax: row.tax,
//       })),

//       summary: {
//         subtotal: subtotal,
//         taxRate: taxRate,
//         taxTotal: taxTotal,
//         total: totalAmount,
//       },

//       active: "true",
//       paidAmount: 0,
//       invoiceStatus: "Pending",
//       balanceDueAmount: totalAmount,
//     };

//     const res = await invoiceAPI.createInvoice(payload);

//     if (res?.data?.message === "Invoice created successfully") {
//       toast.success("Invoice created successfully");
//       onClose();
//       if(fetchInvoices){
//           fetchInvoices();
//       }

//     } else {
//       toast.error(res?.data?.message || "Failed to create invoice");
//     }
//   } catch (error) {
//     console.error("Create invoice error:", error);
//     toast.error(
//       error.response?.data?.message || "Something went wrong"
//     );
//   }
// };

//   // ==================== LINE ITEMS HANDLERS ====================
//   const handleInputChange = useCallback((index, event) => {
//     const { name, value, type, checked } = event.target;
//     const newValue = type === "checkbox" ? checked : value;

//     setRows((prevRows) => {
//       const newRows = [...prevRows];

//       if (name === "rate" || name === "qty") {
//         newRows[index][name] = newValue;
//         const rate = parseFloat(newRows[index].rate.replace("$", "")) || 0;
//         const qty = parseInt(newRows[index].qty) || 0;
//         const amount = (rate * qty).toFixed(2);
//         newRows[index].amount = `$${amount}`;
//       } else {
//         newRows[index][name] = newValue;
//       }

//       return newRows;
//     });
//   }, []);

//   const addRow = useCallback((isDiscountRow = false) => {
//     const newRow = isDiscountRow
//       ? {
//           productName: "",
//           description: "",
//           rate: "$-10.00",
//           qty: "1",
//           amount: "$-10.00",
//           tax: false,
//           isDiscount: true,
//         }
//       : {
//           productName: "",
//           description: "",
//           rate: "$0.00",
//           qty: "1",
//           amount: "$0.00",
//           tax: false,
//           isDiscount: false,
//         };
//     setRows((prev) => [...prev, newRow]);
//   }, []);

//   const deleteRow = useCallback((index) => {
//     setRows((prev) => prev.filter((_, i) => i !== index));
//   }, []);

//   // ==================== SUMMARY CALCULATION ====================
//   const calculateSummary = useCallback(() => {
//     let subtotalSum = 0;
//     let taxableAmount = 0;

//     rows.forEach((row) => {
//       const amount = parseFloat(row.amount.replace("$", "")) || 0;
//       subtotalSum += amount;
//       if (row.tax) {
//         taxableAmount += amount;
//       }
//     });

//     const tax = taxableAmount * (taxRate / 100);
//     setSubtotal(subtotalSum);
//     setTaxTotal(tax);
//     setTotalAmount((subtotalSum + tax).toFixed(2));
//   }, [rows, taxRate]);

//   useEffect(() => {
//     calculateSummary();
//   }, [calculateSummary]);
//   // ==================== SERVICE DRAWER HANDLERS ====================
//   const handleSaveAsNewService = useCallback((row) => {
//     setSelectedRowData(row);
//     setIsNewServiceDrawerOpen(true);
//   }, []);

//   const handleEditService = useCallback((row, index) => {
//     setSelectedRowData(row);
//     setSelectedRowIndex(index);
//     setIsEditItemDrawerOpen(true);
//   }, []);

//   const handleSaveChanges = useCallback(() => {
//     if (selectedRowIndex !== null) {
//       const updatedRows = [...rows];
//       const rateValue =
//         parseFloat(selectedRowData.rate?.replace(/[^0-9.-]+/g, "")) || 0;
//       const qtyValue = parseInt(selectedRowData.qty) || 0;
//       const amount = (rateValue * qtyValue).toFixed(2);

//       updatedRows[selectedRowIndex] = {
//         ...selectedRowData,
//         amount: `$${amount}`,
//       };
//       setRows(updatedRows);
//     }
//     setIsEditItemDrawerOpen(false);
//   }, [selectedRowIndex, selectedRowData, rows]);

//   const handleDeleteService = useCallback(() => {
//     if (selectedRowIndex !== null) {
//       deleteRow(selectedRowIndex);
//     }
//   }, [selectedRowIndex, deleteRow]);

//   const handleDuplicate = useCallback(
//     (index) => {
//       const duplicatedRow = {
//         ...rows[index],
//         productName: rows[index].productName
//           ? `${rows[index].productName} Copy`
//           : "Copy",
//       };
//       setRows([...rows, duplicatedRow]);
//     },
//     [rows],
//   );

//   const handleServiceChangeWrapper = useCallback(
//     (index, selectedOption) => {
//       if (selectedOption) {
//         fetchservicebyid(selectedOption.value, index, setRows);
//       }
//     },
//     [fetchservicebyid],
//   );

//   const handleServiceInputChangeWrapper = useCallback(
//     (inputValue, actionMeta, index) => {
//       if (actionMeta.action === "input-change") {
//         setRows((prevRows) => {
//           const newRows = [...prevRows];
//           newRows[index].productName = inputValue;
//           return newRows;
//         });
//       }
//     },
//     [],
//   );
//   const handleCreateService = useCallback(async () => {
//     const payload = {
//       serviceName: selectedRowData?.productName,
//       description: selectedRowData?.description,
//       rate: selectedRowData?.rate,
//       ratetype: selectedRowData?.ratetype?.value,
//       tax: selectedRowData?.tax,
//       category: selectedRowData?.category?.value,
//       active: "true",
//     };

//     const success = await createServiceTemplate(payload);
//     if (success) {
//       setIsNewServiceDrawerOpen(false);
//       setSelectedRowData(null);
//     }
//   }, [selectedRowData, createServiceTemplate]);
//   const handleCreateCategory = useCallback(
//     async (categoryName) => {
//       const success = await createCategory(categoryName);
//       if (success) {
//         setIsCategoryDrawerOpen(false);
//       }
//     },
//     [createCategory],
//   );
//   return (
//     <Box>
//       <Drawer anchor="right" open={open} onClose={onClose}>
//         <Box sx={{ width: 700, p: 2 }}>
//           {/* Header */}
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h6">Create new Invoice</Typography>
//             <IconButton onClick={onClose}>
//               <CloseIcon />
//             </IconButton>
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           {/* Form */}
//           <Box>
//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               {/* Account */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle1" gutterBottom>
//                   Account name, ID or email
//                 </Typography>

//                 <Autocomplete
//                   options={accountOptions}
//                   value={selectedAccount}
//                   onChange={(e, value) => handleAccountChange(value)}
//                   isOptionEqualToValue={(option, value) =>
//                     option?.value === value?.value
//                   }
//                   getOptionLabel={(option) => option?.label || ""}
//                   loading={loading}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       placeholder="Search for an account..."
//                       error={!!accountError}
//                       helperText={accountError}
//                       InputProps={{
//                         ...params.InputProps,
//                         endAdornment: (
//                           <>
//                             {loading && <CircularProgress size={20} />}
//                             {params.InputProps.endAdornment}
//                           </>
//                         ),
//                       }}
//                     />
//                   )}
//                 />
//               </Grid>

//               {/* Invoice Date */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle1" mb={1}>
//                   Invoice Template
//                 </Typography>
//                 <Autocomplete
//                   options={invoiceoptions}
//                   value={selectedTemplate}
//                   onChange={(e, value) => {
//                     setSelectedTemplate(value);

//                     if (value?.value) {
//                       fetchInvoiceTemplateById(value.value);
//                     } else {
//                       resetTemplateData(); // optional reset
//                     }
//                   }}
//                   getOptionLabel={(option) => option?.label || ""}
//                   renderInput={(params) => (
//                     <TextField {...params} placeholder="Invoice Template" />
//                   )}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Box mt={2}>
//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               {/* Account */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle1">Invoice Number</Typography>

//                 <TextField
//                   fullWidth
//                   value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
//                   placeholder="Invoice Number"
//                   size="small"
//                   sx={{ mt: 1 }}
//                   InputProps={{
//                     readOnly: true, // Make it read-only since it's auto-generated
//                   }}
//                   helperText="Auto-generated invoice number"
//                   disabled={isLoadingInvoiceNumber}
//                 />
//               </Grid>

//               {/* Invoice Date */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle1">
//                   Choose payment method
//                 </Typography>
//                 <Autocomplete
//                   size="small"
//                   fullWidth
//                   sx={{ mt: 1 }}
//                   options={paymentsOptions}
//                   getOptionLabel={(option) => option?.label || ""}
//                   onChange={handlePaymentOptionChange}
//                   value={paymentMode}
//                   renderInput={(params) => (
//                     <TextField
//                       {...params}
//                       placeholder="Select Payment Mode"
//                       variant="outlined"
//                     />
//                   )}
//                   isOptionEqualToValue={(option, value) =>
//                     option.value === value?.value
//                   }
//                   clearOnEscape
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Box mt={2}>
//             <Grid
//               container
//               rowSpacing={3}
//               columnSpacing={{ xs: 1, sm: 2, md: 3 }}
//             >
//               {/* Account */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <FormControl fullWidth>
//                   <FormLabel sx={{ marginBottom: "8px", color: "black" }}>
//                     Date
//                   </FormLabel>
//                   <LocalizationProvider dateAdapter={AdapterDayjs}>
//                     <DatePicker
//                       format="MM/DD/YYYY"
//                       // sx={{ width: "100%", backgroundColor: "#fff" }}
//                       value={startDate} // Default to today's date
//                       onChange={handleStartDateChange}
//                     />
//                   </LocalizationProvider>
//                 </FormControl>
//               </Grid>

//               {/* Invoice Date */}
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Typography variant="subtitle1" mb={1}>
//                   Team Member
//                 </Typography>
//                 <MultiSelectDropdown
//                   value={selectedUser}
//                   onChange={handleUserChange}
//                   placeholder="Team Member"
//                    options={options}
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//           <Box mt={2}>
//             <ShortcodeTextField
//               label="Description"
//               value={description}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 if (value.length <= 4000) {
//                   setDescription(value);
//                   setCharCount(value.length);
//                 }
//               }}
//               placeholder="Description"
//               multiline
//               rows={4}
//               maxLength={4000}
//               inputRef={descriptionFieldRef}
//               onClick={(e) => setCursorPosition(e.target.selectionStart)}
//               helperText={`${description.length}/4000 characters`}
//               // shortcuts
//               shortcuts={filteredShortcuts}
//               showShortcutDropdown={showDropdownDescription}
//               anchorElShortcut={anchorEl}
//               onToggleShortcutDropdown={toggleDescriptionDropdown}
//               onCloseShortcutDropdown={handleCloseDropdown}
//               onAddShortcut={handleDescriptionAddShortcut}
//             />
//           </Box>
//           <Box mt={2}>
//             <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//               Additioal
//             </Typography>
//             <Box mt={2}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={payInvoice}
//                     onChange={handlePayInvoiceChange}
//                     color="primary"
//                   />
//                 }
//                 label={"Pay invoice using client credits"}
//               />
//             </Box>
//             <Box mt={1}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={emailInvoice}
//                     onChange={handleEmailInvoiceChange}
//                     color="primary"
//                   />
//                 }
//                 label={"Email invoice to client"}
//               />
//             </Box>
//             <Box mt={1}>
//               <FormControlLabel
//                 control={
//                   <Switch
//                     checked={reminders}
//                     onChange={handleRemindersChange}
//                     color="primary"
//                   />
//                 }
//                 label={"Reminders"}
//               />
//             </Box>

//             <Box>
//               {/* Replace the entire line items and summary section with the reusable component */}
//               <LineItemsAndSummary
//                 rows={rows}
//                 serviceoptions={serviceoptions}
//                 onInputChange={handleInputChange}
//                 onServiceChange={handleServiceChangeWrapper}
//                 onServiceInputChange={handleServiceInputChangeWrapper}
//                 onAddRow={addRow}
//                 onDeleteRow={deleteRow}
//                 onEditService={handleEditService}
//                 onDeleteService={handleDeleteService}
//                 onSaveAsNewService={handleSaveAsNewService}
//                 onDuplicate={handleDuplicate}
//                 subtotal={subtotal}
//                 onSubtotalChange={setSubtotal}
//                 taxRate={taxRate}
//                 onTaxRateChange={setTaxRate}
//                 taxTotal={taxTotal}
//                 totalAmount={totalAmount}
//                 lineItemsTitle="Line items"
//                 lineItemsSubtitle="Client-facing itemized list of products and services"
//                 summaryTitle="Summary"
//               />

//               <Box sx={{ mb: 10, mt: 2 }}>
//                 <Typography variant="h6" mb={1}>
//                   Note to client
//                 </Typography>
//                 <Editor onChange={setClientNote} value={clientNote} />
//               </Box>
//             </Box>
//           </Box>
//           {/* Actions */}
//           <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
//             <Button onClick={onClose}>Cancel</Button>
//             <Button variant="contained" onClick={handleSave}>
//               Save
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//       <ServiceDrawer
//         open={isNewServiceDrawerOpen}
//         onClose={() => setIsNewServiceDrawerOpen(false)}
//         selectedRowData={selectedRowData}
//         setSelectedRowData={setSelectedRowData}
//         categoryoptions={categoryoptions}
//         onCreateCategory={() => setIsCategoryDrawerOpen(true)}
//         onSave={handleCreateService}
//       />

//       <CategoryDrawer
//         open={isCategoryDrawerOpen}
//         onClose={() => setIsCategoryDrawerOpen(false)}
//         onCreateCategory={handleCreateCategory}
//       />

//       <EditItemDrawer
//         open={isEditItemDrawerOpen}
//         onClose={() => setIsEditItemDrawerOpen(false)}
//         selectedRowData={selectedRowData}
//         setSelectedRowData={setSelectedRowData}
//         onSave={handleSaveChanges}
//       />
//     </Box>
//   );
// };

// export default CreateInvoiceDrawer;

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useToastContext } from "../../../context/ToastContext";
import { X } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../../../context/AuthContext";
import {
  accountsAPI,
  invoiceAPI,
  templateAPI,
  authAPI,
} from "../../../services/api";
import Cookies from "js-cookie";
import { Eye } from "lucide-react";
// shadcn/ui components
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import { Calendar } from "../../../components/ui/calendar";
import { cn } from "../../../lib/utils";

// Custom components

import MultiSelectDropdown from "../../../components/MultiSelectDropdown";
import ShortcodeTextField from "../../../components/ShortcodeTextField";
import LineItemsAndSummary from "../../../components/LineItemsAndSummary";
import ServiceDrawer from "../../Templates/InvoiceTemp/ServiceDrawer";
import EditItemDrawer from "../../Templates/InvoiceTemp/EditItemDrawer";
import CategoryDrawer from "../../Templates/InvoiceTemp/CategoryDrawer";
import Editor from "../../../components/Editor";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown";
import PreviewDrawer from "./PreviewDrawer";
import { Loader2 } from "lucide-react";
// const CreateInvoiceDrawer = ({ open, onClose, fetchInvoices }) => {
const CreateInvoiceDrawer = ({
  open,
  onClose,
  fetchInvoices,
  editInvoiceId,
}) => {
  const isEditMode = Boolean(editInvoiceId);
const {showToast} = useToastContext();
  useEffect(() => {
    if (open && editInvoiceId) {
      fetchInvoiceById(editInvoiceId);
    }
  }, [open, editInvoiceId]);

  const { user } = useAuth();

  // 🔹 States
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
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);
  // Company info state (you can fetch this from your API or context)
  const [companyInfo, setCompanyInfo] = useState({
    name: "Your Company Name",
    address: "123 Business Street",
    city: "City, State 12345",
    email: "contact@company.com",
    phone: "+1 (555) 123-4567",
  });
  const [isLoadingAccountDetails, setIsLoadingAccountDetails] = useState(false);
  // Client info state (from selected account)
  const [clientInfo, setClientInfo] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    phone: "",
  });

  // ✅ Fetch account details when selectedAccount changes
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!selectedAccount?.value) {
        // Reset client info when no account is selected
        setClientInfo({
          name: "",
          address: "",
          city: "",
          email: "",
          phone: "",
        });
        return;
      }

      setIsLoadingAccountDetails(true);
      try {
        const res = await accountsAPI.getAccountById(selectedAccount.value);
        const accountData = res.data;

        // Get the primary contact (first contact in the array)
        const primaryContact = accountData.contacts?.[0]?.contact;

        // Format the client name (combine first, middle, last name if available)
        let clientName = accountData.accountName || "";
        if (primaryContact) {
          const {
            firstName = "",
            middleName = "",
            lastName = "",
          } = primaryContact;
          const fullName = [firstName, middleName, lastName]
            .filter(Boolean)
            .join(" ");
          if (fullName) clientName = fullName;
        }

        // Format full address
        const addressParts = [
          primaryContact?.streetAddress || accountData.streetAddress,
          primaryContact?.city || accountData.city,
          primaryContact?.state || accountData.state,
          primaryContact?.postalCode || accountData.postalCode,
        ].filter(Boolean);

        const fullAddress = addressParts.join(", ");

        // Get phone number (first non-empty phone number)
        const phoneNumber =
          primaryContact?.phoneNumbers?.find(
            (phone) => phone && phone.trim(),
          ) || "";

        // Update client info with fetched account details
        setClientInfo({
          name: clientName,
          address: fullAddress,
          city: primaryContact?.city || accountData.city || "",
          email: primaryContact?.email || "",
          phone: phoneNumber,
        });

        // Store account name in cookie
        Cookies.set("accountName", accountData.accountName);

        console.log("Account details fetched:", {
          accountName: accountData.accountName,
          contactName: clientName,
          email: primaryContact?.email,
          address: fullAddress,
          phone: phoneNumber,
        });
      } catch (error) {
        console.error("Error fetching account details:", error);
        showToast({
          title: "Failed to fetch account details",
          type: "error",
        });

        // Optionally reset client info on error
        setClientInfo({
          name: "",
          address: "",
          city: "",
          email: "",
          phone: "",
        });
      } finally {
        setIsLoadingAccountDetails(false);
      }
    };

    fetchAccountDetails();
  }, [selectedAccount]); // Re-run when selectedAccount changes
  const fetchInvoiceById = async (id) => {
    try {
      const res = await invoiceAPI.getInvoiceById(id);

      const invoice = res.data.invoice;

      console.log("Edit invoice data:", invoice);

      // Account
      // if (invoice.account) {
      //   setSelectedAccount({
      //     value: invoice.account._id,
      //     label: invoice.account.accountName,
      //   });
      // }

      // Invoice Number
      setinvoicenumber(invoice.invoicenumber || "");

      // Date
      setStartDate(dayjs(invoice.invoicedate));

      // Description
      setDescription(invoice.description || "");

      // Payment Method
      if (invoice.paymentMethod) {
        setPaymentMode({
          value: invoice.paymentMethod,
          label: invoice.paymentMethod,
        });
      }

      // Toggles
      setIsEmailInvoice(invoice.emailinvoicetoclient || false);
      setIsPayInvoice(invoice.payInvoicewithcredits || false);
      setReminders(invoice.reminders || false);

      // Client Note
      setClientNote(invoice.clientNote || "");

      // Line Items
      if (invoice.lineItems?.length > 0) {
        const formattedRows = invoice.lineItems.map((item) => ({
          id: `${Date.now()}_${Math.random()}`,
          productName: item.productorService || "",
          description: item.description || "",
          rate: `$${parseFloat(item.rate || 0).toFixed(2)}`,
          qty: item.quantity?.toString() || "1",
          amount: `$${parseFloat(item.amount || 0).toFixed(2)}`,
          tax: item.tax || false,
          isDiscount: false,
        }));

        setRows(formattedRows);
      }

      // Summary
      if (invoice.summary) {
        setSubtotal(invoice.summary.subtotal || 0);
        setTaxRate(invoice.summary.taxRate || 0);
        setTaxTotal(invoice.summary.taxTotal || 0);
        setTotalAmount(invoice.summary.total || 0);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      showToast({
        title: "Failed to load invoice",
        type: "error",
      });
    }
  };
  // Preview handler
  const handlePreview = () => {
    setIsPreviewDrawerOpen(true);
  };

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
        if (user) {
          setSelectedUser([{ value: user._id, label: user.username }]);
        }
      } catch (err) {
        console.error("User fetch error:", err?.response || err);
      }
    };
    fetchUsers();
  }, [user]);

  const [options, setOptions] = useState([]);

  // ==================== SERVICE HANDLERS ====================
  const fetchServiceData = useCallback(async () => {
    setLoadingServices(true);
    try {
      const response = await templateAPI.getAllServiceTemplates();
      setServiceData(response.data.serviceTemplate || []);
    } catch (error) {
      console.error("Error fetching service data:", error);
      showToast({
        title: "Failed to fetch services",
        type: "error",
      });
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
      showToast({
        title: "Failed to fetch categories",
        type: "error",
      });
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  const createCategory = useCallback(
    async (categoryName) => {
      if (!categoryName?.trim()) {
        showToast({
          title: "Category name is required",
          type: "error",
        });
        return false;
      }
      try {
        const response = await templateAPI.createCategory({ categoryName });
        if (response.data.message === "Category created successfully") {
          showToast({
            title: "Category created successfully",
            type: "success",
          });
          await fetchCategories();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating category:", error);
        showToast({
          title: error.response?.data?.message || "Failed to create category",
          type: "error",
        });
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
        showToast({
          title: "Failed to fetch service details",
          type: "error",
        });
      }
    },
    [],
  );

  const createServiceTemplate = useCallback(
    async (data) => {
      try {
        const response = await templateAPI.createServiceTemplate(data);
        if (response.data.message === "ServiceTemplate created successfully") {
          showToast({
            title: "Service created successfully",
            type: "success",
          });
          await fetchServiceData();
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error creating service:", error);
        showToast({
          title: error.response?.data?.message || "Failed to create service",
          type: "error",
        });
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
    fetchCategories();
    fetchServiceData();
  }, [fetchServiceData, fetchCategories]);

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
    setShowDropdownDescription(false);
    setAnchorEl(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handlePayInvoiceChange = (checked) => {
    setIsPayInvoice(checked);
  };

  const handleEmailInvoiceChange = (checked) => {
    setIsEmailInvoice(checked);
  };

  const handleRemindersChange = (checked) => {
    setReminders(checked);
  };

  // Set cookie when account is selected
  useEffect(() => {
    if (selectedAccount) {
      Cookies.set("accountId", selectedAccount.value);
      Cookies.set("accountName", selectedAccount.label);
    }
  }, [selectedAccount]);

  const fetchInvoiceTemplates = async () => {
    try {
      const res = await templateAPI.getAllInvoiceTemplates();
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
    try {
      const response = await templateAPI.getInvoiceTemplateById(templateId);
      const template = response.data.invoiceTemplate;
      if (template) {
        if (template.paymentMethod)
          setPaymentMode({
            value: template.paymentMethod,
            label: template.paymentMethod,
          });
        setIsEmailInvoice(template.sendEmailWhenInvCreated || false);
        setIsPayInvoice(template.payInvoicewithcredits || false);
        setReminders(template.sendReminderstoClients || false);
        setDescription(template.description || "");
        setClientNote(template.clientNote || "");
        if (template.lineItems?.length > 0) {
          const lineItemsData = template.lineItems.map((item) => ({
            productName: item.productorService || "",
            description: item.description || "",
            rate: item.rate ? `$${parseFloat(item.rate).toFixed(2)}` : "$0.00", // Ensure proper formatting
            qty: item.quantity?.toString() || "1",
            amount: item.amount
              ? `$${parseFloat(item.amount).toFixed(2)}`
              : "$0.00", // Ensure proper formatting
            tax: item.tax === "true" || item.tax === true,
            isDiscount: false,
            id: `${Date.now()}_${Math.random()}`, // Add unique ID for each row
          }));
          setRows(lineItemsData);
        } else {
          // Reset to default empty row if no line items
          setRows([
            {
              productName: "",
              description: "",
              rate: "$0.00",
              qty: "1",
              amount: "$0.00",
              tax: false,
              isDiscount: false,
              id: `${Date.now()}_${Math.random()}`,
            },
          ]);
        }
        if (template.summary) {
          setSubtotal(template.summary.subtotal || 0);
          setTaxRate(template.summary.taxRate || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching invoice template:", error);
      showToast({
        title: "Failed to load template data",
        type: "error",
      });
    }
  }, []);
  const resetTemplateData = () => {
    setPaymentMode({ value: "Bank Debits", label: "Bank Debits" });
    setIsEmailInvoice(false);
    setIsPayInvoice(false);
    setReminders(false);
    setDescription("");
    setClientNote("");
    setRows([]);
    setSubtotal(0);
    setTaxRate(0);
  };

  const fetchNextInvoiceNumber = async () => {
    try {
      setIsLoadingInvoiceNumber(true);
      const res = await invoiceAPI.getNextInvoiceNumber();
      const nextNumber = res.data?.nextInvoiceNumber;
      console.log("Next invoice number:", nextNumber);
      setinvoicenumber(nextNumber ? nextNumber.toString() : "Auto-generated");
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
      setinvoicenumber("Auto-generated");
      showToast({
        title: "Failed to load invoice number",
        type: "error",
      });
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

  const handlePaymentOptionChange = (value) => {
    setPaymentMode(paymentsOptions.find((opt) => opt.value === value));
  };

  const handleTemplateChange = (value) => {
    const template = invoiceoptions.find((opt) => opt.value === value);
    setSelectedTemplate(template);
    if (template?.value) {
      fetchInvoiceTemplateById(template.value);
    } else {
      resetTemplateData();
    }
  };

  const handleUserChange = (newSelectedUsers) => {
    setSelectedUser(newSelectedUsers);
    setCombinedValues(newSelectedUsers.map((option) => option.value));
  };
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (!selectedAccount) {
      setAccountError("Account is required");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        account: selectedAccount?.value,
        invoicenumber: invoicenumber,
        invoicedate: startDate,
        description: description,
        invoicetemplate: selectedTemplate?.value,
        paymentMethod: paymentMode?.value,
        teammember: selectedUser.value,
        emailinvoicetoclient: emailInvoice,
        scheduleinvoicedate: new Date(),
        scheduleinvoicetime: new Date().toLocaleTimeString("en-US", {
          hour12: false,
        }),
        payInvoicewithcredits: payInvoice,
        reminders: reminders,
        scheduleinvoice: false,
        daysuntilnextreminder: 0,
        numberOfreminder: 0,
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
      // const res = await invoiceAPI.createInvoice(payload);
      const res = isEditMode
        ? await invoiceAPI.updateInvoice(editInvoiceId, payload)
        : await invoiceAPI.createInvoice(payload);
      console.log("Invoice save response:", res);
      // if (
      //   res?.data?.message === "Invoice created successfully" ||
      //   res?.data?.message === "Invoice Updated successfully"
      // ) {
      //   toast.success(
      //     isEditMode
      //       ? "Invoice Updated successfully"
      //       : "Invoice created successfully",
      //   );
      //   onClose();
      //   if (fetchInvoices) fetchInvoices();
      // } else {
      //   toast.error(res?.data?.message || "Failed to create invoice");
      // }
      if (
        res?.data?.message === "Invoice created successfully" ||
        res?.data?.message === "Invoice Updated successfully"
      ) {
        showToast({
          title: isEditMode
            ? "Invoice Updated successfully"
            : "Invoice created successfully",
          type: "success",
        });

        resetForm(); // Clear form

        onClose();

        if (fetchInvoices) fetchInvoices();
      } else {
        showToast({
          title: res?.data?.message || "Failed to create invoice",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Create invoice error:", error);
      showToast({
        title: error.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setSaving(false);
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

  // const addRow = useCallback((isDiscountRow = false) => {
  //   const newRow = isDiscountRow
  //     ? { productName: "", description: "", rate: "$-10.00", qty: "1", amount: "$-10.00", tax: false, isDiscount: true }
  //     : { productName: "", description: "", rate: "$0.00", qty: "1", amount: "$0.00", tax: false, isDiscount: false };
  //   setRows((prev) => [...prev, newRow]);
  // }, []);

  const addRow = useCallback((isDiscountRow = false) => {
    const newRow = isDiscountRow
      ? {
          id: `${Date.now()}_${Math.random()}`,
          productName: "",
          description: "",
          rate: "$-10.00",
          qty: "1",
          amount: "$-10.00",
          tax: false,
          isDiscount: true,
        }
      : {
          id: `${Date.now()}_${Math.random()}`,
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
      if (row.tax) taxableAmount += amount;
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
    if (selectedRowIndex !== null) deleteRow(selectedRowIndex);
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
      if (selectedOption)
        fetchservicebyid(selectedOption.value, index, setRows);
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
      if (success) setIsCategoryDrawerOpen(false);
    },
    [createCategory],
  );

  const resetForm = () => {
    setSelectedAccount(null);
    setAccountError("");
    setinvoicenumber("");
    setClientNote("");
    setPaymentMode({
      value: "Bank Debits",
      label: "Bank Debits",
    });

    setSelectedTemplate(null);
    setDescription("");
    setSelectedUser([]);
    setCombinedValues([]);
    setStartDate(dayjs());

    setIsPayInvoice(false);
    setIsEmailInvoice(false);
    setReminders(false);

    setRows([
      {
        id: `${Date.now()}_${Math.random()}`,
        productName: "",
        description: "",
        rate: "$0.00",
        qty: "1",
        amount: "$0.00",
        tax: false,
        isDiscount: false,
      },
    ]);

    setSubtotal(0);
    setTaxRate(0);
    setTaxTotal(0);
    setTotalAmount(0);

    setClientInfo({
      name: "",
      address: "",
      city: "",
      email: "",
      phone: "",
    });

    setSelectedRowData(null);
    setSelectedRowIndex(null);

    fetchNextInvoiceNumber();
  };
  const handleDrawerClose = () => {
    resetForm();
    onClose();
  };
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
          onClick={handleDrawerClose}
        />

        {/* Drawer */}
        <div
          className="
          absolute right-0 top-0
          h-full w-full
          sm:w-[700px]
          bg-background
          text-foreground
          border-l border-border
          shadow-xl
          flex flex-col
        "
        >
          {/* Header */}
          <div
            className="
            flex items-center justify-between
            px-5 py-4
            border-b border-border
            bg-background/95 backdrop-blur
            shrink-0
          "
          >
            {/* <h2 className="text-base font-semibold text-foreground">
            Create new Invoice
          </h2> */}
            <h2 className="text-base font-semibold text-foreground">
              {isEditMode ? "Edit Invoice" : "Create new Invoice"}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePreview}
                className="
                flex items-center gap-1.5
                text-sm text-primary
                hover:text-primary/80
                transition-colors
              "
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>

              <button
                onClick={handleDrawerClose}
                className="
                p-1 rounded-md
                text-muted-foreground
                hover:text-foreground
                hover:bg-accent
                transition-colors
              "
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-muted/30">
            {/* Account Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Account name, ID or email
                </Label>

                <SingleSelectDropdown
                  value={selectedAccount}
                  onChange={setSelectedAccount}
                />

                {accountError && (
                  <p className="text-xs text-destructive mt-1">
                    {accountError}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Invoice Template
                </Label>

                <Select
                  value={selectedTemplate?.value}
                  onValueChange={handleTemplateChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Invoice Template" />
                  </SelectTrigger>

                  <SelectContent>
                    {invoiceoptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Invoice Number + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Invoice Number
                </Label>

                <Input
                  value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
                  placeholder="Invoice Number"
                  readOnly
                  disabled={isLoadingInvoiceNumber}
                  className="mt-1"
                />

                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated invoice number
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Choose payment method
                </Label>

                <Select
                  value={paymentMode?.value}
                  onValueChange={handlePaymentOptionChange}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Payment Mode" />
                  </SelectTrigger>

                  <SelectContent>
                    {paymentsOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date + Team */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">
                  Date
                </Label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1 border-border bg-background text-foreground hover:bg-accent",
                        !startDate && "text-muted-foreground",
                      )}
                    >
                      {startDate ? (
                        startDate.format("MM/DD/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 bg-popover border border-border text-popover-foreground">
                    <Calendar
                      mode="single"
                      selected={startDate ? startDate.toDate() : undefined}
                      onSelect={(date) =>
                        date && handleStartDateChange(dayjs(date))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground">
                  Team Member
                </Label>

                <MultiSelectDropdown
                  value={selectedUser}
                  onChange={handleUserChange}
                  placeholder="Team Member"
                  options={options}
                />
              </div>
            </div>

            {/* Description */}
            <div>
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
                shortcuts={filteredShortcuts}
                showShortcutDropdown={showDropdownDescription}
                anchorElShortcut={anchorEl}
                onToggleShortcutDropdown={toggleDescriptionDropdown}
                onCloseShortcutDropdown={handleCloseDropdown}
                onAddShortcut={handleDescriptionAddShortcut}
              />
            </div>

            {/* Additional Options */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Additional
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer text-foreground">
                    Pay invoice using client credits
                  </Label>
                  <Switch
                    id="pay-invoice"
                    checked={payInvoice}
                    onCheckedChange={handlePayInvoiceChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer text-foreground">
                    Email invoice to client
                  </Label>
                  <Switch
                    id="email-invoice"
                    checked={emailInvoice}
                    onCheckedChange={handleEmailInvoiceChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="cursor-pointer text-foreground">
                    Reminders
                  </Label>
                  <Switch
                    id="reminders"
                    checked={reminders}
                    onCheckedChange={handleRemindersChange}
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
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

            {/* Note */}
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                Note to client
              </h3>

              <Editor onChange={setClientNote} value={clientNote} />
            </div>
          </div>

          {/* Footer */}
          <div
            className="
            flex items-center justify-end gap-3
            px-5 py-4
            border-t border-border
            bg-background
            shrink-0
          "
          >
            <Button variant="outline" onClick={handleDrawerClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {/* {isEditMode ? "Update" : "Save"} */}
              {saving ? (
    <>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {isEditMode ? "Updating..." : "Saving..."}
    </>
  ) : (
    isEditMode ? "Update Invoice" : "Save Invoice"
  )}
            </Button>
            {/* <Button onClick={handleSave}>Save</Button> */}
          </div>
        </div>
      </div>

      {/* Service Drawers (UNCHANGED FUNCTIONALITY) */}
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

      <PreviewDrawer
        open={isPreviewDrawerOpen}
        onClose={() => setIsPreviewDrawerOpen(false)}
        rows={rows}
        description={description}
        clientNote={clientNote}
        subtotal={subtotal}
        taxRate={taxRate}
        taxTotal={taxTotal}
        totalAmount={totalAmount}
        onSave={handleSave}
        invoiceNumber={invoicenumber}
        invoiceDate={
          startDate
            ? startDate.format("MM/DD/YYYY")
            : new Date().toLocaleDateString()
        }
        companyInfo={companyInfo}
        clientInfo={clientInfo}
        currency="$"
      />
    </>
  );
};

export default CreateInvoiceDrawer;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 overflow-hidden">
//         <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
//         <div className="absolute right-0 top-0 h-full w-full sm:w-[700px] bg-background shadow-xl flex flex-col">

// <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
//   <h2 className="text-base font-semibold text-foreground">Create new Invoice</h2>
//   <div className="flex items-center gap-3">
//     <button
//       type="button"
//       onClick={handlePreview}
//       className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
//     >
//       <Eye className="h-4 w-4" />
//       Preview
//     </button>
//     <button
//       onClick={onClose}
//       className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//     >
//       <X className="h-4 w-4" />
//     </button>
//   </div>
// </div>
//           <div className="flex-1 overflow-y-auto p-5 space-y-6">
//             {/* Account Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-sm font-medium">Account name, ID or email</Label>
//                 <SingleSelectDropdown
//                   value={selectedAccount}
//                   onChange={setSelectedAccount}
//                 />
//                 {accountError && <p className="text-xs text-destructive mt-1">{accountError}</p>}
//               </div>
//               <div>
//                 <Label className="text-sm font-medium">Invoice Template</Label>
//                 <Select value={selectedTemplate?.value} onValueChange={handleTemplateChange}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Invoice Template" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {invoiceoptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Invoice Number + Payment Method */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-sm font-medium">Invoice Number</Label>
//                 <Input
//                   value={isLoadingInvoiceNumber ? "Loading..." : invoicenumber}
//                   placeholder="Invoice Number"
//                   readOnly
//                   disabled={isLoadingInvoiceNumber}
//                   className="mt-1"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">Auto-generated invoice number</p>
//               </div>
//               <div>
//                 <Label className="text-sm font-medium">Choose payment method</Label>
//                 <Select value={paymentMode?.value} onValueChange={handlePaymentOptionChange}>
//                   <SelectTrigger className="mt-1">
//                     <SelectValue placeholder="Select Payment Mode" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {paymentsOptions.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Date + Team Member */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label className="text-sm font-medium">Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !startDate && "text-muted-foreground")}>
//                       {startDate ? startDate.format("MM/DD/YYYY") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar
//                       mode="single"
//                       selected={startDate ? startDate.toDate() : undefined}
//                       onSelect={(date) => date && handleStartDateChange(dayjs(date))}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//               <div>
//                 <Label className="text-sm font-medium">Team Member</Label>
//                 <MultiSelectDropdown
//                   value={selectedUser}
//                   onChange={handleUserChange}
//                   placeholder="Team Member"
//                   options={options}
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div>
//               <ShortcodeTextField
//                 label="Description"
//                 value={description}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value.length <= 4000) {
//                     setDescription(value);
//                     setCharCount(value.length);
//                   }
//                 }}
//                 placeholder="Description"
//                 multiline
//                 rows={4}
//                 maxLength={4000}
//                 inputRef={descriptionFieldRef}
//                 onClick={(e) => setCursorPosition(e.target.selectionStart)}
//                 helperText={`${description.length}/4000 characters`}
//                 shortcuts={filteredShortcuts}
//                 showShortcutDropdown={showDropdownDescription}
//                 anchorElShortcut={anchorEl}
//                 onToggleShortcutDropdown={toggleDescriptionDropdown}
//                 onCloseShortcutDropdown={handleCloseDropdown}
//                 onAddShortcut={handleDescriptionAddShortcut}
//               />
//             </div>

//             {/* Additional Options */}
//             <div>
//               <h3 className="text-base font-semibold mb-2">Additional</h3>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="pay-invoice" className="cursor-pointer">Pay invoice using client credits</Label>
//                   <Switch id="pay-invoice" checked={payInvoice} onCheckedChange={handlePayInvoiceChange} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="email-invoice" className="cursor-pointer">Email invoice to client</Label>
//                   <Switch id="email-invoice" checked={emailInvoice} onCheckedChange={handleEmailInvoiceChange} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="reminders" className="cursor-pointer">Reminders</Label>
//                   <Switch id="reminders" checked={reminders} onCheckedChange={handleRemindersChange} />
//                 </div>
//               </div>
//             </div>

//             {/* Line Items & Summary */}
//             <LineItemsAndSummary
//               rows={rows}
//               serviceoptions={serviceoptions}
//               onInputChange={handleInputChange}
//               onServiceChange={handleServiceChangeWrapper}
//               onServiceInputChange={handleServiceInputChangeWrapper}
//               onAddRow={addRow}
//               onDeleteRow={deleteRow}
//               onEditService={handleEditService}
//               onDeleteService={handleDeleteService}
//               onSaveAsNewService={handleSaveAsNewService}
//               onDuplicate={handleDuplicate}
//               subtotal={subtotal}
//               onSubtotalChange={setSubtotal}
//               taxRate={taxRate}
//               onTaxRateChange={setTaxRate}
//               taxTotal={taxTotal}
//               totalAmount={totalAmount}
//               lineItemsTitle="Line items"
//               lineItemsSubtitle="Client-facing itemized list of products and services"
//               summaryTitle="Summary"
//             />

//             {/* Note to client */}
//             <div>
//               <h3 className="text-base font-semibold mb-2">Note to client</h3>
//               <Editor onChange={setClientNote} value={clientNote} />
//             </div>
//           </div>

//           <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
//             <Button variant="outline" onClick={onClose}>Cancel</Button>
//               {/* <Button variant="outline" onClick={handlePreview}>Preview</Button> */}
//               <Button onClick={handleSave}>Save</Button>
//           </div>
//         </div>
//       </div>

//       {/* Service Drawers */}
//       <ServiceDrawer
//         open={isNewServiceDrawerOpen}
//         onClose={() => setIsNewServiceDrawerOpen(false)}
//         selectedRowData={selectedRowData}
//         setSelectedRowData={setSelectedRowData}
//         categoryoptions={categoryoptions}
//         onCreateCategory={() => setIsCategoryDrawerOpen(true)}
//         onSave={handleCreateService}
//       />

//       <CategoryDrawer
//         open={isCategoryDrawerOpen}
//         onClose={() => setIsCategoryDrawerOpen(false)}
//         onCreateCategory={handleCreateCategory}
//       />

//       <EditItemDrawer
//         open={isEditItemDrawerOpen}
//         onClose={() => setIsEditItemDrawerOpen(false)}
//         selectedRowData={selectedRowData}
//         setSelectedRowData={setSelectedRowData}
//         onSave={handleSaveChanges}
//       />
//       <PreviewDrawer
//         open={isPreviewDrawerOpen}
//         onClose={() => setIsPreviewDrawerOpen(false)}
//         rows={rows}
//         description={description}
//         clientNote={clientNote}
//         subtotal={subtotal}
//         taxRate={taxRate}
//         taxTotal={taxTotal}
//         totalAmount={totalAmount}
//         onSave={handleSave}
//         invoiceNumber={invoicenumber}
//         invoiceDate={startDate ? startDate.format("MM/DD/YYYY") : new Date().toLocaleDateString()}
//         // dueDate={dueDate}
//         companyInfo={companyInfo}
//         clientInfo={clientInfo}
//         currency="$"
//       />

//     </>
//   );
