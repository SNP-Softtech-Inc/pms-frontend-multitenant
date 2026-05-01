

import React, { useState, useEffect, useCallback,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { templateAPI } from "../../../services/api";
import { useConfirm } from "../../../components/ConfirmDialogContext";

// Import components
import InvoiceTemplateForm from "./InvoiceTemplateForm";
import InvoiceTemplateTable from "./InvoiceTemplateTable";
import PreviewDrawer from "./PreviewDrawer";
import ServiceDrawer from "./ServiceDrawer";
import CategoryDrawer from "./CategoryDrawer";
import EditItemDrawer from "./EditItemDrawer";

const InvoiceTemp = () => {
  const confirm = useConfirm();
 

  // ==================== STATE ====================
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    templatename: "",
    paymentMode: null,
    emailToClient: false,
    payUsingCredits: false,
    invoiceReminders: false,
    daysNextReminder: "3",
    numOfReminder: "1",
    clientNote: "",
    templatenameError: "",
    descriptionError: "",
  });

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

  // Description and client message state
  const [description, setDescription] = useState("");
  const [clientmsg, setClientmsg] = useState("");

  // Shortcuts state
  const [showShortcutDropdown, setShowShortcutDropdown] = useState(false);
  const [showSwitchDropdown, setShowSwitchDropdown] = useState(false);
  const [shortcuts, setShortcuts] = useState([]);
  const [filteredShortcuts, setFilteredShortcuts] = useState([]);
  const [switchfilteredShortcuts, setSwitchFilteredShortcuts] = useState([]);
  const [selectedOption, setSelectedOption] = useState("contacts");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [anchorElShortcut, setAnchorElShortcut] = useState(null);
  const [switchanchorEl, setSwitchAnchorEl] = useState(null);
  const textFieldRef = useRef(null);

  // Service data state
  const [servicedata, setServiceData] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Category data state
  const [categoryData, setCategoryData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Invoice templates state
  const [invoiceTemplates, setInvoiceTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Drawer states
  const [isNewServiceDrawerOpen, setIsNewServiceDrawerOpen] = useState(false);
  const [isEditItemDrawerOpen, setIsEditItemDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  // ==================== SHORTCUTS DATA ====================
  const contactShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
    { title: "Contact Shortcodes", isBold: true },
    { title: "Contact Name", isBold: false, value: "CONTACT_NAME" },
    { title: "First Name", isBold: false, value: "FIRST_NAME" },
    { title: "Middle Name", isBold: false, value: "MIDDLE_NAME" },
    { title: "Last Name", isBold: false, value: "LAST_NAME" },
    { title: "Phone number", isBold: false, value: "PHONE_NUMBER" },
    { title: "Country", isBold: false, value: "COUNTRY" },
    { title: "Company name", isBold: false, value: "COMPANY_NAME" },
    { title: "Street address", isBold: false, value: "STREET_ADDRESS" },
    { title: "City", isBold: false, value: "CITY" },
    { title: "State/Province", isBold: false, value: "STATE / PROVINCE" },
    { title: "Zip/Postal code", isBold: false, value: "ZIP / POSTAL CODE" },
    { title: "Custom field:Email", isBold: false, value: "CONTACT_CUSTOM_FIELD:Email" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
    { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
    { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
    { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
    { title: "Last week", isBold: false, value: "LAST_WEEK" },
    { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
    { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
    { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
    { title: "Last_year", isBold: false, value: "LAST_YEAR" },
    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  const accountShortcuts = [
    { title: "Account Shortcodes", isBold: true },
    { title: "Account Name", isBold: false, value: "ACCOUNT_NAME" },
    { title: "Custom field:Website", isBold: false, value: "ACCOUNT_CUSTOM_FIELD:Website" },
    { title: "Date Shortcodes", isBold: true },
    { title: "Current day full date", isBold: false, value: "CURRENT_DAY_FULL_DATE" },
    { title: "Current day number", isBold: false, value: "CURRENT_DAY_NUMBER" },
    { title: "Current day name", isBold: false, value: "CURRENT_DAY_NAME" },
    { title: "Current week", isBold: false, value: "CURRENT_WEEK" },
    { title: "Current month number", isBold: false, value: "CURRENT_MONTH_NUMBER" },
    { title: "Current month name", isBold: false, value: "CURRENT_MONTH_NAME" },
    { title: "Current quarter", isBold: false, value: "CURRENT_QUARTER" },
    { title: "Current year", isBold: false, value: "CURRENT_YEAR" },
    { title: "Last day full date", isBold: false, value: "LAST_DAY_FULL_DATE" },
    { title: "Last day number", isBold: false, value: "LAST_DAY_NUMBER" },
    { title: "Last day name", isBold: false, value: "LAST_DAY_NAME" },
    { title: "Last week", isBold: false, value: "LAST_WEEK" },
    { title: "Last month number", isBold: false, value: "LAST_MONTH_NUMBER" },
    { title: "Last month name", isBold: false, value: "LAST_MONTH_NAME" },
    { title: "Last quarter", isBold: false, value: "LAST_QUARTER" },
    { title: "Last_year", isBold: false, value: "LAST_YEAR" },
    { title: "Next day full date", isBold: false, value: "NEXT_DAY_FULL_DATE" },
    { title: "Next day number", isBold: false, value: "NEXT_DAY_NUMBER" },
    { title: "Next day name", isBold: false, value: "NEXT_DAY_NAME" },
    { title: "Next week", isBold: false, value: "NEXT_WEEK" },
    { title: "Next month number", isBold: false, value: "NEXT_MONTH_NUMBER" },
    { title: "Next month name", isBold: false, value: "NEXT_MONTH_NAME" },
    { title: "Next quarter", isBold: false, value: "NEXT_QUARTER" },
    { title: "Next year", isBold: false, value: "NEXT_YEAR" },
  ];

  // ==================== DERIVED DATA ====================
  const lineItems = rows.map((item) => ({
    productorService: item.productName,
    description: item.description,
    rate: item.rate.replace("$", ""),
    quantity: item.qty,
    amount: item.amount.replace("$", ""),
    tax: item.tax.toString(),
  }));

  const serviceoptions = servicedata.map((service) => ({
    value: service._id,
    label: service.serviceName,
  }));

  const categoryoptions = categoryData.map((category) => ({
    value: category._id,
    label: category.categoryName,
  }));

  // ==================== SHORTCUTS HANDLERS ====================
  useEffect(() => {
    setShortcuts(selectedOption === "contacts" ? contactShortcuts : accountShortcuts);
  }, [selectedOption]);

  useEffect(() => {
    setFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
    setSwitchFilteredShortcuts(shortcuts.filter((shortcut) => shortcut.title.toLowerCase().includes("")));
  }, [shortcuts]);

  const handleDescriptions = (e) => {
    const { value, selectionStart } = e.target;
    setDescription(value);
    setCursorPosition(selectionStart);
  };

  const toggleShortcutDropdown = (event) => {
    setAnchorElShortcut(event.currentTarget);
    setShowShortcutDropdown(!showShortcutDropdown);
  };

  const toggleSwitchDropdown = (event) => {
    setSwitchAnchorEl(event.currentTarget);
    setShowSwitchDropdown(!showSwitchDropdown);
  };

  const handleCloseShortcutDropdown = () => {
  setAnchorElShortcut(null);
  setShowShortcutDropdown(false);
};

const handleCloseSwitchDropdown = () => {
  setSwitchAnchorEl(null);
  setShowSwitchDropdown(false);
};

const handleAddShortcut = (shortcut) => {
  setDescription((prevText) => {
    const newText =
      prevText.slice(0, cursorPosition) +
      `[${shortcut}]` +
      prevText.slice(cursorPosition);
    return newText;
  });

  setTimeout(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.setSelectionRange(
        cursorPosition + shortcut.length + 2,
        cursorPosition + shortcut.length + 2,
      );
    }
  }, 0);

  // Close only the shortcut dropdown, not both
  setShowShortcutDropdown(false);
  setAnchorElShortcut(null);
};

const handleSwitchAddShortcut = (shortcut) => {
  setClientmsg((prevText) => prevText + `[${shortcut}]`);
  
  // Close only the switch dropdown
  setShowSwitchDropdown(false);
  setSwitchAnchorEl(null);
};
 

  // ==================== LINE ITEMS HANDLERS ====================
  const handleInputChange = useCallback((index, event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setRows(prevRows => {
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
    setRows(prev => [...prev, newRow]);
  }, []);

  const deleteRow = useCallback((index) => {
    setRows(prev => prev.filter((_, i) => i !== index));
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

  // ==================== VALIDATION ====================
  const validateForm = useCallback(() => {
    let isValid = true;

    if (!formData.templatename) {
      setFormData(prev => ({ ...prev, templatenameError: "Template name is required" }));
      isValid = false;
    } else {
      setFormData(prev => ({ ...prev, templatenameError: "" }));
    }

    return isValid;
  }, [formData.templatename]);

  const resetForm = useCallback(() => {
    setFormData({
      templatename: "",
      paymentMode: null,
      emailToClient: false,
      payUsingCredits: false,
      invoiceReminders: false,
      daysNextReminder: "3",
      numOfReminder: "1",
      clientNote: "",
      templatenameError: "",
      descriptionError: "",
    });
    setRows([
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
    setTaxRate(0);
    setDescription("");
    setClientmsg("");
  }, []);

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

  const fetchservicebyid = useCallback(async (id, rowIndex, setRowsCallback) => {
    try {
      const response = await templateAPI.getServiceTemplateById(id);
      const service = Array.isArray(response.data.serviceTemplate)
        ? response.data.serviceTemplate[0]
        : response.data.serviceTemplate;

      const rate = service.rate ? parseFloat(service.rate.replace("$", "")) : 0;

      const updatedRow = {
        productName: service.serviceName || "",
        description: service.description || "",
        rate: `$${rate.toFixed(2)}`,
        qty: "1",
        amount: `$${rate.toFixed(2)}`,
        tax: service.tax || false,
        isDiscount: false,
      };

      setRowsCallback(prevRows => {
        const updatedRows = [...prevRows];
        updatedRows[rowIndex] = { ...updatedRows[rowIndex], ...updatedRow };
        return updatedRows;
      });
    } catch (error) {
      console.error("Error fetching service by ID:", error);
      toast.error("Failed to fetch service details");
    }
  }, []);

  const createServiceTemplate = useCallback(async (data) => {
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
      toast.error(error.response?.data?.message || "Failed to create service");
      return false;
    }
  }, [fetchServiceData]);

  // ==================== CATEGORY HANDLERS ====================
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

  const createCategory = useCallback(async (categoryName) => {
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
      toast.error(error.response?.data?.message || "Failed to create category");
      return false;
    }
  }, [fetchCategories]);

  // ==================== INVOICE TEMPLATE HANDLERS ====================
  const fetchInvoiceTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await templateAPI.getAllInvoiceTemplates();
      setInvoiceTemplates(response.data.invoiceTemplate || []);
    } catch (error) {
      console.error("Error fetching invoice templates:", error);
      toast.error("Failed to fetch invoice templates");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoiceTemplateById = useCallback(async (templateId) => {
    setLoadingTemplate(true);
    try {
      const response = await templateAPI.getInvoiceTemplateById(templateId);
      const template = response.data.invoiceTemplate;

      if (template) {
        setFormData({
          templatename: template.templatename || "",
          paymentMode: template.paymentMethod ? { value: template.paymentMethod, label: template.paymentMethod } : null,
          emailToClient: template.sendEmailWhenInvCreated || false,
          payUsingCredits: template.payInvoicewithcredits || false,
          invoiceReminders: template.sendReminderstoClients || false,
          daysNextReminder: template.daysuntilnextreminder || "3",
          numOfReminder: template.numberOfreminder || "1",
          clientNote: template.clientNote || "",
          templatenameError: "",
          descriptionError: "",
        });

        setDescription(template.description || "");
        setClientmsg(template.messageForClient || "");

        if (template.lineItems && template.lineItems.length > 0) {
          const lineItemsData = template.lineItems.map(item => ({
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

        if (template.summary) {
          setSubtotal(template.summary.subtotal || 0);
          setTaxRate(template.summary.taxRate || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching invoice template:", error);
      toast.error("Failed to load template data");
      setShowForm(false);
      setIsEditMode(false);
      setEditingTemplateId(null);
    } finally {
      setLoadingTemplate(false);
    }
  }, []);

  const saveInvoiceTemplate = useCallback(async () => {
    if (!validateForm()) return;

    const payload = {
      templatename: formData.templatename,
      description: description,
      paymentMethod: formData.paymentMode?.value,
      sendEmailWhenInvCreated: formData.emailToClient,
      messageForClient: clientmsg,
      payInvoicewithcredits: formData.payUsingCredits,
      sendReminderstoClients: formData.invoiceReminders,
      daysuntilnextreminder: formData.daysNextReminder,
      numberOfreminder: formData.numOfReminder,
      lineItems: lineItems,
      summary: {
        subtotal: subtotal,
        taxRate: taxRate,
        taxTotal: taxTotal,
        total: totalAmount,
      },
      clientNote: formData.clientNote,
      active: "true",
    };

    try {
      if (isEditMode && editingTemplateId) {
        await templateAPI.updateInvoiceTemplate(editingTemplateId, payload);
        toast.success("Invoice template updated successfully");
        setOpenPreview(false)
      } else {
        await templateAPI.createInvoiceTemplate(payload);
        toast.success("Invoice template created successfully");
        setOpenPreview(false);
      }

      setShowForm(false);
      setIsEditMode(false);
      setEditingTemplateId(null);
      fetchInvoiceTemplates();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save invoice template");
    }
  }, [formData, description, clientmsg, lineItems, subtotal, taxRate, taxTotal, totalAmount, validateForm, fetchInvoiceTemplates, resetForm, isEditMode, editingTemplateId]);

  const checkTemplateName = useCallback(async (name) => {
    if (!name?.trim()) return;
    try {
      const response = await templateAPI.checkInvoiceTemplateNameExists(name);
      if (response.data.exists && (!isEditMode || response.data.templateId !== editingTemplateId)) {
        setFormData(prev => ({ ...prev, templatenameError: "Template name already exists" }));
      } else {
        setFormData(prev => ({ ...prev, templatenameError: "" }));
      }
    } catch (err) {
      console.error(err);
    }
  }, [isEditMode, editingTemplateId]);

  const debouncedCheck = useCallback(
    debounce((name) => checkTemplateName(name), 500),
    [checkTemplateName]
  );

  useEffect(() => {
    debouncedCheck(formData.templatename);
    return () => debouncedCheck.cancel();
  }, [formData.templatename, debouncedCheck]);

  useEffect(() => {
    fetchInvoiceTemplates();
    fetchServiceData();
    fetchCategories();
  }, [fetchInvoiceTemplates, fetchServiceData, fetchCategories]);

  useEffect(() => {
    if (formData.templatename || description || formData.paymentMode || formData.emailToClient) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [formData.templatename, description, formData.paymentMode, formData.emailToClient]);

  // ==================== TABLE HANDLERS ====================
  const handleEdit = useCallback((_id) => {
    setEditingTemplateId(_id);
    setAnchorEl(null);
    setIsEditMode(true);
    fetchInvoiceTemplateById(_id);
    setShowForm(true);
  }, [fetchInvoiceTemplateById]);

  const toggleMenu = useCallback((event, _id) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplateId(_id);
  }, []);

  const handleCloseOptions = useCallback(() => {
    setAnchorEl(null);
    setSelectedTemplateId(null);
  }, []);

  const handleDelete = useCallback((_id) => {
    confirm({
      title: "Delete Invoice Template",
      description: "Are you sure you want to delete this invoice template?",
      onConfirm: async () => {
        try {
          await templateAPI.deleteInvoiceTemplate(_id);
          toast.success("Invoice template deleted successfully");
          handleCloseOptions();
          fetchInvoiceTemplates();
        } catch (error) {
          console.error(error);
          toast.error("Failed to delete item");
        }
      },
    });
  }, [confirm, fetchInvoiceTemplates, handleCloseOptions]);

  const handleCloseInvoiceTemp = useCallback(() => {
    setShowForm(false);
    setIsEditMode(false);
    setEditingTemplateId(null);
    resetForm();
  }, [resetForm]);

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
      const rateValue = parseFloat(selectedRowData.rate?.replace(/[^0-9.-]+/g, "")) || 0;
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

  const handleDuplicate = useCallback((index) => {
    const duplicatedRow = {
      ...rows[index],
      productName: rows[index].productName
        ? `${rows[index].productName} Copy`
        : "Copy",
    };
    setRows([...rows, duplicatedRow]);
  }, [rows]);

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

  const handleCreateCategory = useCallback(async (categoryName) => {
    const success = await createCategory(categoryName);
    if (success) {
      setIsCategoryDrawerOpen(false);
    }
  }, [createCategory]);

  const handleServiceChangeWrapper = useCallback((index, selectedOption) => {
    if (selectedOption) {
      fetchservicebyid(selectedOption.value, index, setRows);
    }
  }, [fetchservicebyid]);

  const handleServiceInputChangeWrapper = useCallback((inputValue, actionMeta, index) => {
    if (actionMeta.action === "input-change") {
      setRows(prevRows => {
        const newRows = [...prevRows];
        newRows[index].productName = inputValue;
        return newRows;
      });
    }
  }, []);

  // ==================== PAGINATION ====================
  const paginatedInvoices = invoiceTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ==================== RENDER ====================
  return (
    <div>
      {!showForm ? (
        <InvoiceTemplateTable
          loading={loading}
          paginatedInvoices={paginatedInvoices}
          invoiceTemplates={invoiceTemplates}
          page={page}
          rowsPerPage={rowsPerPage}
          anchorEl={anchorEl}
          selectedTemplateId={selectedTemplateId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateClick={() => {
            setShowForm(true);
            setIsEditMode(false);
            setEditingTemplateId(null);
            resetForm();
          }}
          onToggleMenu={toggleMenu}
          onCloseMenu={handleCloseOptions}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      ) : (
        <InvoiceTemplateForm
          formData={formData}
          setFormData={setFormData}
          rows={rows}
          setRows={setRows}
          subtotal={subtotal}
          setSubtotal={setSubtotal}
          taxRate={taxRate}
          setTaxRate={setTaxRate}
          taxTotal={taxTotal}
          totalAmount={totalAmount}
          description={description}
          setDescription={setDescription}
          clientmsg={clientmsg}
          setClientmsg={setClientmsg}
          serviceoptions={serviceoptions}
          showShortcutDropdown={showShortcutDropdown}
          showSwitchDropdown={showSwitchDropdown}
          anchorElShortcut={anchorElShortcut}
          switchanchorEl={switchanchorEl}
          filteredShortcuts={filteredShortcuts}
          switchfilteredShortcuts={switchfilteredShortcuts}
          textFieldRef={textFieldRef}
          cursorPosition={cursorPosition}
          onDescriptionChange={handleDescriptions}
          onAddShortcut={handleAddShortcut}
          onSwitchAddShortcut={handleSwitchAddShortcut}
          onToggleShortcutDropdown={toggleShortcutDropdown}
          onToggleSwitchDropdown={toggleSwitchDropdown}
          onCloseShortcutDropdown={handleCloseShortcutDropdown}
          onCloseSwitchdropdown={handleCloseSwitchDropdown}
          onInputChange={handleInputChange}
          onServiceChange={handleServiceChangeWrapper}
          onServiceInputChange={handleServiceInputChangeWrapper}
          onAddRow={addRow}
          onDeleteRow={deleteRow}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          onDuplicate={handleDuplicate}
          onSaveAsNewService={handleSaveAsNewService}
          onSave={saveInvoiceTemplate}
          onSaveAndExit={saveInvoiceTemplate}
          onCancel={handleCloseInvoiceTemp}
          onOpenPreview={() => setOpenPreview(true)}
          isEditMode={isEditMode}
          loading={loadingTemplate}
        />
      )}

      <PreviewDrawer
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        rows={rows}
        description={description}
        clientNote={formData.clientNote}
        subtotal={subtotal}
        taxRate={taxRate}
        taxTotal={taxTotal}
        totalAmount={totalAmount}
        onSave={saveInvoiceTemplate}
      />

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
    </div>
  );
};

export default InvoiceTemp;