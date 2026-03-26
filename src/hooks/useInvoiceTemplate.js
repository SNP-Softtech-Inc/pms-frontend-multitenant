import { useState, useCallback, useEffect } from "react";

const useInvoiceTemplate = () => {
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

  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const lineItems = rows.map((item) => ({
    productorService: item.productName,
    description: item.description,
    rate: item.rate.replace("$", ""),
    quantity: item.qty,
    amount: item.amount.replace("$", ""),
    tax: item.tax.toString(),
  }));

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
  }, []);

  return {
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
    calculateSummary,
    validateForm,
    resetForm,
  };
};

export default useInvoiceTemplate;