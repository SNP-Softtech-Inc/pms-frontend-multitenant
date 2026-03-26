
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import { templateAPI } from "../../../services/api";

// Import custom hooks
import useInvoiceTemplate from "../../../hooks/useInvoiceTemplate";
import useServiceData from "../../../hooks/useServiceData";
import useCategoryData from "../../../hooks/useCategoryData";
import useShortcuts from "../../../hooks/useShortcuts";

// Import components
import InvoiceTemplateForm from "./InvoiceTemplateForm";
import InvoiceTemplateTable from "./InvoiceTemplateTable";
import PreviewDrawer from "./PreviewDrawer";
import ServiceDrawer from "./ServiceDrawer";
import CategoryDrawer from "./CategoryDrawer";
import EditItemDrawer from "./EditItemDrawer";
import { useConfirm } from "../../../components/ConfirmDialogContext";
const InvoiceTemp = () => {
 const confirm = useConfirm();
  // State
  const [showForm, setShowForm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState(null); // Track which template is being edited
  const [isEditMode, setIsEditMode] = useState(false); // Track if in edit mode

  // Custom hooks
  const {
    formData,
    setFormData,
    rows,
    setRows,
    subtotal,
    setSubtotal,
    taxRate,
    setTaxRate,
    taxTotal,
    totalAmount,
    lineItems,
    handleInputChange,
    addRow,
    deleteRow,
    validateForm,
    resetForm,
  } = useInvoiceTemplate();

  const {
    servicedata,
    serviceoptions,
    fetchServiceData,
    fetchservicebyid,
    createServiceTemplate,
  } = useServiceData();

  const {
    categoryData,
    categoryoptions,
    createCategory,
    fetchCategories,
  } = useCategoryData();

  const {
    shortcuts,
    selectedOption,
    setSelectedOption,
    description,
    setDescription,
    clientmsg,
    setClientmsg,
    showShortcutDropdown,
    showSwitchDropdown,
    anchorElShortcut,
    switchanchorEl,
    filteredShortcuts,
    switchfilteredShortcuts,
    textFieldRef,
    cursorPosition,
    handleDescriptions,
    toggleShortcutDropdown,
    toggleSwitchDropdown,
    handleCloseShortcutDropdown,
    handleAddShortcut,
    handleSwitchAddShortcut,
  } = useShortcuts();

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

  // Fetch invoice template by ID for edit mode
  const fetchInvoiceTemplateById = useCallback(async (templateId) => {
    setLoadingTemplate(true);
    try {
      const response = await templateAPI.getInvoiceTemplateById(templateId);
      const template = response.data.invoiceTemplate;
      
      if (template) {
        // Populate form data with template data
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
        
        // Populate line items
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
        
        // Populate summary
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
  }, [setFormData, setDescription, setClientmsg, setRows, setSubtotal, setTaxRate]);

  // Fetch invoice templates
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

  useEffect(() => {
    fetchInvoiceTemplates();
    fetchServiceData();
    fetchCategories();
  }, [fetchInvoiceTemplates, fetchServiceData, fetchCategories]);

  // Check template name uniqueness (skip when editing same template)
  const checkTemplateName = useCallback(async (name) => {
    if (!name?.trim()) return;
    try {
      const response = await templateAPI.checkInvoiceTemplateNameExists(name);
      // If editing, don't show error for the same template name
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

  // Detect form changes
  useEffect(() => {
    if (formData.templatename || description || formData.paymentMode || formData.emailToClient) {
      setIsFormDirty(true);
    } else {
      setIsFormDirty(false);
    }
  }, [formData.templatename, description, formData.paymentMode, formData.emailToClient]);

  // Create or Update Invoice Template
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
        // Update existing template
        await templateAPI.updateInvoiceTemplate(editingTemplateId, payload);
        toast.success("Invoice template updated successfully");
      } else {
        // Create new template
        await templateAPI.createInvoiceTemplate(payload);
        toast.success("Invoice template created successfully");
      }
      
      setShowForm(false);
      setIsEditMode(false);
      setEditingTemplateId(null);
      fetchInvoiceTemplates();
      resetForm();
      setDescription("");
      setClientmsg("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save invoice template");
    }
  }, [formData, description, clientmsg, lineItems, subtotal, taxRate, taxTotal, totalAmount, validateForm, fetchInvoiceTemplates, resetForm, isEditMode, editingTemplateId]);

  // Handle edit button click from table
  const handleEdit = useCallback((_id) => {
    setEditingTemplateId(_id);
    setAnchorEl(null);
    setIsEditMode(true);
    fetchInvoiceTemplateById(_id);
    setShowForm(true);
  }, [fetchInvoiceTemplateById]);

 

  // Menu handlers
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
    setDescription("");
    setClientmsg("");
  }, [isFormDirty, resetForm]);

  // Service drawer handlers
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
  }, [selectedRowIndex, selectedRowData, rows, setRows]);

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
  }, [rows, setRows]);

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

  // Service change wrapper
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
  }, [setRows]);

  // Pagination
  const paginatedInvoices = invoiceTemplates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
            setDescription("");
            setClientmsg("");
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