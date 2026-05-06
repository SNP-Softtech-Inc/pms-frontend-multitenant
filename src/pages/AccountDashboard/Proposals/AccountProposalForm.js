// import React, { useState, useEffect, useContext } from "react";

// import { ArrowLeft, Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
// import { useNavigate, useParams, useSearchParams } from "react-router-dom";
// import { Button } from '../../../components/ui/button';
// // Import your step components (make sure they're also converted to MUI)
// import GeneralStep from "./Steps/AccountGeneral";
// import IntroductionStep from "./Steps/IntroductionStep";
// import TermsStep from "./Steps/TermsStep";
// import ServicesInvoicesStep from "./Steps/ServicesInvoicesStep";
// import PaymentStep from "./Steps/PaymentStep";
// import { toast } from "react-toastify";
// import Cookies from "js-cookie";
// import { proposalAPI, accountsAPI } from "../../../services/api";
// const ProposalForm = () => {
//   const { accountId } = useParams();

//   console.log("accountid", accountId);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [stepErrors, setStepErrors] = useState({});
//   const [formData, setFormData] = useState({
//     general: {
//       skipStepper: false,
//       introductionEnabled: true,
//       termsEnabled: true,
//       servicesEnabled: true,
//       paymentsEnabled: false,
//       proposalTemp: "",
//       account: [],
//       proposalName: "",
//       teamMembers: [],
//     },
//     introduction: {
//       title: "",
//       description: "",
//     },
//     terms: {
//       title: "",
//       description: "",
//     },
//     services: {
//       option: "",
//       invoices: [],
//       itemizedData: {
//         price: 0,
//         name: "",
//         rows: [getEmptyRow()],
//         subtotal: "0.00",
//         taxRate: "0",
//         taxTotal: "0.00",
//         totalAmount: "0.00",
//       },
//     },
//     payments: {
//       method: "",
//       amount: 0,
//     },
//   });

//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const proposalId = searchParams.get("edit");

//   // Helper function for empty row
//   function getEmptyRow() {
//     return {
//       productName: "",
//       description: "",
//       rate: "0.00",
//       qty: "1",
//       amount: "0.00",
//       tax: false,
//       isDiscount: false,
//     };
//   }

//   function getEmptyInvoice() {
//     return {
//       invoiceTemplate: null,
//       teamMembers: [],
//       issueInvoice: "immediately",
//       specificDate: null,
//       selectedTime: null,
//       description: "",
//       charCount: 0,
//       charLimit: 1000,
//       rows: [getEmptyRow()],
//       subtotal: "0.00",
//       taxRate: "0",
//       taxTotal: "0.00",
//       totalAmount: "0.00",
//       clientNote: "",
//     };
//   }

//   // Fetch proposal data if editing
//   useEffect(() => {
//     if (proposalId) {
//       fetchProposalData();
//     }
//   }, [proposalId]);

//   const fetchProposalData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       // ✅ 1. Fetch proposal
//       const proposalRes = await proposalAPI.getAccountProposalById(proposalId);
//       const proposalData = proposalRes.data;
// console.log("Fetched proposal data:", proposalData);
//       // ✅ 2. Fetch accounts + templates in parallel
//       const [accountsRes, templatesRes] = await Promise.all([
//         accountsAPI.getAccountNamesByStatus(), // already defined
//         proposalAPI.getAllProposals(), // using proposal API instead of raw fetch
//       ]);

//       const accountsData = accountsRes.data;
//       const templatesData = templatesRes.data;

//       // ✅ 3. Normalize accounts response
//       let accounts = [];
//       if (Array.isArray(accountsData)) {
//         accounts = accountsData;
//       } else if (Array.isArray(accountsData.accounts)) {
//         accounts = accountsData.accounts;
//       } else if (Array.isArray(accountsData.accountlist)) {
//         accounts = accountsData.accountlist;
//       } else if (Array.isArray(accountsData.teamAccounts)) {
//         accounts = accountsData.teamAccounts;
//       }

//       console.log("Accounts data for transform:", accounts);

//       // ✅ 4. Normalize templates response
//       let templates = [];
//       if (Array.isArray(templatesData)) {
//         templates = templatesData;
//       } else if (Array.isArray(templatesData.proposallist)) {
//         templates = templatesData.proposallist;
//       } else if (Array.isArray(templatesData.templates)) {
//         templates = templatesData.templates;
//       }

//       // ✅ 5. Transform data
//       const transformedData = transformDataForForm(
//         proposalData,
//         accounts,
//         templates,
//       );

//       setFormData(transformedData);
//     } catch (error) {
//       console.error("Error fetching proposal:", error);

//       // ✅ Better error handling (Axios)
//       const message =
//         error.response?.data?.message ||
//         error.message ||
//         "Something went wrong";

//       setError("Error loading proposal: " + message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Transform API data back to form structure
//   // const transformDataForForm = (apiData, accounts = [], templates = []) => {
//   //   console.log("API Data received:", apiData);
//   //   console.log("Accounts for transform:", accounts);
//   //   console.log("Templates for transform:", templates);

//   //   // Ensure accounts is an array
//   //   if (!Array.isArray(accounts)) {
//   //     console.warn("Accounts is not an array, converting to array");
//   //     accounts = [];
//   //   }

//   //   // Ensure templates is an array
//   //   if (!Array.isArray(templates)) {
//   //     console.warn("Templates is not an array, converting to array");
//   //     templates = [];
//   //   }

//   //   // Find the account object based on IDs
//   //   let accountObj = null;
//   //   const accountId = apiData.general?.account;

//   //   if (accountId && Array.isArray(accounts)) {
//   //     accountObj = accounts.find(
//   //       (acc) => acc.id === accountId || acc._id === accountId,
//   //     );
//   //   }

//   //   // Find the template object based on IDs
//   //   let templateObj = null;
//   //   const templateId = apiData.general?.proposalTemp;

//   //   if (templateId && Array.isArray(templates)) {
//   //     templateObj = templates.find(
//   //       (temp) => temp._id === templateId || temp.id === templateId,
//   //     );
//   //   }

//   //   // Handle multiple accounts (if needed)
//   //   const accountArray = Array.isArray(accountId) ? accountId : [accountId];
//   //   const selectedAccounts = accountArray
//   //     .filter((id) => id)
//   //     .map((id) => {
//   //       const acc = accounts.find((a) => a.id === id || a._id === id);
//   //       return {
//   //         value: id,
//   //         label: acc?.Name || acc?.accountName || "Account",
//   //       };
//   //     });

//   //   return {
//   //     general: {
//   //       skipStepper: apiData.general?.skipStepper || false,
//   //       introductionEnabled: apiData.general?.introductionEnabled ?? true,
//   //       termsEnabled: apiData.general?.termsEnabled ?? true,
//   //       servicesEnabled: apiData.general?.servicesEnabled ?? true,
//   //       paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
//   //       proposalTemp: templateId || "",
//   //       proposalName: apiData.general?.proposalName || "",
//   //       // Use selectedAccounts array for multiple accounts
//   //       account: selectedAccounts,
//   //       // Template object for Autocomplete
//   //       template: templateId
//   //         ? {
//   //             value: templateId,
//   //             label:
//   //               templateObj?.general?.templateName ||
//   //               templateObj?.general?.proposalName ||
//   //               "Template",
//   //           }
//   //         : null,
//   //       teamMembers: apiData.general?.teamMembers || [],
//   //     },
//   //     introduction: {
//   //       title: apiData.introduction?.title || "",
//   //       description: apiData.introduction?.description || "",
//   //     },
//   //     terms: {
//   //       title: apiData.terms?.title || "",
//   //       description: apiData.terms?.description || "",
//   //     },
//   //     services: {
//   //       option: apiData.services?.option || "",
//   //       invoices: transformInvoicesForForm(apiData.services?.invoices || []),
//   //       itemizedData: transformItemizedDataForForm(
//   //         apiData.services?.itemizedData,
//   //       ),
//   //     },
//   //     payments: {
//   //       method: apiData.payments?.method || "",
//   //       amount: apiData.payments?.amount || 0,
//   //     },
//   //   };
//   // };
// // In ProposalForm.js, update the transformDataForForm function:

// const transformDataForForm = (apiData, accounts = [], templates = []) => {
//   console.log("API Data received:", apiData);
//   console.log("Accounts for transform:", accounts);
//   console.log("Templates for transform:", templates);

//   // Ensure accounts is an array
//   if (!Array.isArray(accounts)) {
//     console.warn("Accounts is not an array, converting to array");
//     accounts = [];
//   }

//   // Ensure templates is an array
//   if (!Array.isArray(templates)) {
//     console.warn("Templates is not an array, converting to array");
//     templates = [];
//   }

//   // Find the account object based on IDs
//   let accountObj = null;
//   const accountData = apiData.general?.account;
  
//   // Handle account - could be array or single object, or array of objects
//   let selectedAccount = null;
  
//   if (accountData) {
//     // If it's an array
//     if (Array.isArray(accountData) && accountData.length > 0) {
//       const firstAccount = accountData[0];
//       // If it's an object with _id and accountName
//       if (firstAccount && typeof firstAccount === 'object' && firstAccount._id) {
//         selectedAccount = {
//           value: firstAccount._id,
//           label: firstAccount.accountName
//         };
//       }
//       // If it's just an ID string
//       else if (typeof firstAccount === 'string') {
//         const foundAccount = accounts.find(acc => acc._id === firstAccount);
//         if (foundAccount) {
//           selectedAccount = {
//             value: foundAccount._id,
//             label: foundAccount.accountName
//           };
//         }
//       }
//     }
//     // If it's a single object with _id and accountName
//     else if (accountData && typeof accountData === 'object' && accountData._id) {
//       selectedAccount = {
//         value: accountData._id,
//         label: accountData.accountName
//       };
//     }
//     // If it's just an ID string
//     else if (typeof accountData === 'string') {
//       const foundAccount = accounts.find(acc => acc._id === accountData);
//       if (foundAccount) {
//         selectedAccount = {
//           value: foundAccount._id,
//           label: foundAccount.accountName
//         };
//       }
//     }
//   }

//   // Find the template object based on IDs
//   let templateObj = null;
//   const templateId = apiData.general?.proposalTemp;

//   if (templateId && Array.isArray(templates)) {
//     templateObj = templates.find(
//       (temp) => temp._id === templateId || temp.id === templateId,
//     );
//   }

//   return {
//     general: {
//       skipStepper: apiData.general?.skipStepper || false,
//       introductionEnabled: apiData.general?.introductionEnabled ?? true,
//       termsEnabled: apiData.general?.termsEnabled ?? true,
//       servicesEnabled: apiData.general?.servicesEnabled ?? true,
//       paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
//       proposalTemp: templateId || "",
//       proposalName: apiData.general?.proposalName || "",
//       // Use selectedAccount as a single object (not array)
//       account: selectedAccount,
//       // Template object for Autocomplete
//       template: templateId
//         ? {
//             value: templateId,
//             label:
//               templateObj?.general?.templateName ||
//               templateObj?.general?.proposalName ||
//               "Template",
//           }
//         : null,
//       teamMembers: apiData.general?.teamMembers || [],
//     },
//     introduction: {
//       title: apiData.introduction?.title || "",
//       description: apiData.introduction?.description || "",
//     },
//     terms: {
//       title: apiData.terms?.title || "",
//       description: apiData.terms?.description || "",
//     },
//     services: {
//       option: apiData.services?.option || "",
//       invoices: transformInvoicesForForm(apiData.services?.invoices || []),
//       itemizedData: transformItemizedDataForForm(
//         apiData.services?.itemizedData,
//       ),
//     },
//     payments: {
//       method: apiData.payments?.method || "",
//       amount: apiData.payments?.amount || 0,
//     },
//   };
// };
//   // Transform line items to rows format
//   const transformLineItemsToRows = (lineItems) => {
//     if (!lineItems || lineItems.length === 0) {
//       return [getEmptyRow()];
//     }
//     console.log("Transforming line items to rows:", lineItems);

//     return lineItems.map((item) => ({
//       productorService: item.productorService || "",
//       description: item.description || "",
//       rate: item.rate?.toString() || "0.00",
//       quantity: item.quantity?.toString() || "1",
//       amount: item.amount?.toString() || "0.00",
//       tax: item.tax || false,
//       isDiscount: false,
//     }));
//   };

//   // Update the transformInvoicesForForm to handle invoiceTemplate properly
//   const transformInvoicesForForm = (invoices, invoiceTemplates = []) => {
//     if (!invoices || invoices.length === 0) {
//       return [{ id: 1, ...getEmptyInvoice() }];
//     }

//     console.log("Transforming invoices:", invoices);
//     console.log("Available templates:", invoiceTemplates);

//     return invoices.map((invoice, index) => {
//       const template = invoiceTemplates.find(
//         (t) => t._id === invoice.invoiceTemplate,
//       );

//       return {
//         id: index + 1,
//         invoiceTemplate: invoice.invoiceTemplate
//           ? {
//               value: invoice.invoiceTemplate,
//               label: template?.templatename || "Template",
//             }
//           : null,
//         teamMembers: invoice.teamMembers || [],
//         issueInvoice: "immediately",
//         specificDate: null,
//         selectedTime: null,
//         description: invoice.description || "",
//         charCount: invoice.description?.length || 0,
//         charLimit: 1000,
//         rows: transformLineItemsToRows(invoice.lineItems || []),
//         subtotal: invoice.subtotal?.toString() || "0.00",
//         taxRate: invoice.taxRate?.toString() || "0",
//         taxTotal: invoice.taxTotal?.toString() || "0.00",
//         totalAmount: invoice.totalAmount?.toString() || "0.00",
//         clientNote: "",
//       };
//     });
//   };

//   // Transform itemized data for form
//   const transformItemizedDataForForm = (itemizedData) => {
//     console.log("Itemized data from API:", itemizedData);

//     if (!itemizedData) {
//       return {
//         price: 0,
//         name: "",
//         rows: [getEmptyRow()],
//         subtotal: "0.00",
//         taxRate: "0",
//         taxTotal: "0.00",
//         totalAmount: "0.00",
//       };
//     }

//     return {
//       ...itemizedData,
//       price: itemizedData.price || 0,
//       name: itemizedData.name || "",
//       rows: transformLineItemsToRows(itemizedData.lineItems),
//       subtotal: itemizedData.subtotal?.toString() || "0.00",
//       taxRate: itemizedData.taxRate?.toString() || "0",
//       taxTotal: itemizedData.taxTotal?.toString() || "0.00",
//       totalAmount: itemizedData.totalAmount?.toString() || "0.00",
//     };
//   };

//   // Get available steps based on visibility settings and service option
//   const getAvailableSteps = () => {
//     const steps = [
//       {
//         name: "General",
//         component: GeneralStep,
//         key: "general",
//         alwaysVisible: true,
//       },
//     ];

//     if (formData.general.introductionEnabled) {
//       steps.push({
//         name: "Introduction",
//         component: IntroductionStep,
//         key: "introduction",
//       });
//     }

//     if (formData.general.termsEnabled) {
//       steps.push({ name: "Terms", component: TermsStep, key: "terms" });
//     }

//     if (formData.general.servicesEnabled) {
//       steps.push({
//         name: "Services & Invoices",
//         component: ServicesInvoicesStep,
//         key: "services",
//       });
//     }

//     if (
//       formData.general.paymentsEnabled &&
//       formData.services.option === "invoice"
//     ) {
//       steps.push({ name: "Payment", component: PaymentStep, key: "payments" });
//     }

//     return steps;
//   };

//   const availableSteps = getAvailableSteps();

//   const updateFormData = (section, newData) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: { ...prev[section], ...newData },
//     }));
//   };

//   // Validation functions for each step
//   const validateStep = (stepIndex) => {
//     const stepKey = availableSteps[stepIndex]?.key;
//     let isValid = true;
//     const newErrors = {};

//     switch (stepKey) {
//       case "general":
//         if (!formData.general.proposalName?.trim()) {
//           newErrors.proposalName = "Proposal name is required";
//           isValid = false;
//         }

//         break;

//       case "introduction":
//         if (!formData.introduction?.title?.trim()) {
//           newErrors.title = "Introduction title is required";
//           isValid = false;
//         }
//         if (
//           !formData.introduction?.description?.trim() ||
//           formData.introduction.description.replace(/<[^>]*>/g, "").trim() ===
//             ""
//         ) {
//           newErrors.description = "Introduction description is required";
//           isValid = false;
//         }
//         break;

//       case "terms":
//         if (!formData.terms?.title?.trim()) {
//           newErrors.title = "Terms title is required";
//           isValid = false;
//         }
//         if (
//           !formData.terms?.description?.trim() ||
//           formData.terms.description.replace(/<[^>]*>/g, "").trim() === ""
//         ) {
//           newErrors.description = "Terms and conditions are required";
//           isValid = false;
//         }
//         break;

//       case "services":
//         if (!formData.services.option) {
//           newErrors.option = "Please select an option";
//           isValid = false;
//         }

//         break;
//     }

//     setStepErrors((prev) => ({
//       ...prev,
//       [stepKey]: newErrors,
//     }));

//     return isValid;
//   };

//   const nextStep = () => {
//     if (validateStep(currentStep)) {
//       if (currentStep < availableSteps.length - 1) {
//         setCurrentStep(currentStep + 1);
//       } else {
//         handleSubmit();
//       }
//     } else {
//       // Scroll to top to show error messages
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };
//   // Check if a step has errors for the stepper
//   const hasStepError = (stepKey) => {
//     return stepErrors[stepKey] && Object.keys(stepErrors[stepKey]).length > 0;
//   };
//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const goToStep = (stepIndex) => {
//     if (stepIndex >= 0 && stepIndex < availableSteps.length) {
//       setCurrentStep(stepIndex);
//     }
//   };

//   // const handleBackToList = () => {
//   //   const accountId = Cookies.get("accountId");
//   //   navigate(`/clients/accounts/accountsdash/proposals/${accountId}`);
//   // };
//   const handleBackToList = () => {
//     const accountId = Cookies.get("accountId");

//     if (accountId) {
//       navigate(`/clients/accounts/accountsdash/proposals/${accountId}`);
//     } else {
//       navigate("/insights");
//     }
//   };

//   const isLastStep = currentStep === availableSteps.length - 1;

//   // Transform invoice data before sending
//   const transformInvoiceData = (invoices) => {
//     return invoices.map((invoice) => ({
//       ...invoice,
//       invoiceTemplate:
//         invoice.invoiceTemplate?.value || invoice.invoiceTemplate,
//       teamMembers: invoice.teamMembers?.value || invoice.teamMembers,
//       lineItems:
//         invoice.rows?.map((row) => ({
//           productorService: String(row.productorService),
//           description: row.description,
//           rate: parseFloat(row.rate) || 0,
//           quantity: parseFloat(row.quantity) || 0,
//           amount: parseFloat(row.amount) || 0,
//           tax: Boolean(row.tax),
//         })) || [],
//     }));
//   };

//   // Transform itemized data for submission
//   const transformItemizedData = (itemizedData) => {
//     if (!itemizedData) return null;

//     return {
//       ...itemizedData,
//       price: parseFloat(itemizedData.price) || 0,
//       lineItems:
//         itemizedData.rows?.map((row) => ({
//           productorService: String(row.productorService),
//           description: row.description,
//           rate: parseFloat(row.rate) || 0,
//           quantity: parseFloat(row.quantity) || 0,
//           amount: parseFloat(row.amount) || 0,
//           tax: Boolean(row.tax),
//         })) || [],
//       subtotal: parseFloat(itemizedData.subtotal) || 0,
//       taxRate: parseFloat(itemizedData.taxRate) || 0,
//       taxTotal: parseFloat(itemizedData.taxTotal) || 0,
//       totalAmount: parseFloat(itemizedData.totalAmount) || 0,
//     };
//   };

//   const handleSubmit = async () => {
//     try {
//       console.log("Submitting proposal...");
//       setError("");

//       const accountIds =
//         formData.general.account?.map((acc) => acc.value) || [];
//       const templateId = formData.general.template?.value;

//       // Validation
//       const validationErrors = validateAllSteps();

//       if (Object.keys(validationErrors).length > 0) {
//         console.log("Validation errors found:", validationErrors);
//         setStepErrors(validationErrors);

//         const firstErrorStep = findFirstErrorStep(validationErrors);
//         if (firstErrorStep !== -1) {
//           setCurrentStep(firstErrorStep);
//         }

//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }

//       // Prepare data
//       const submissionData = {
//         ...formData,
//         general: {
//           ...formData.general,
//           account: accountIds,
//           proposalTemp: templateId,
//         },
//         services: {
//           ...formData.services,
//           invoices:
//             formData.services.option === "invoice"
//               ? transformInvoiceData(formData.services.invoices)
//               : [],
//           itemizedData:
//             formData.services.option === "services"
//               ? transformItemizedData(formData.services.itemizedData)
//               : null,
//         },
//         status: "Pending",
//       };

//       console.log("Submitting data:", submissionData);

//       let result;

//       // ✅ Use API layer instead of fetch
//       if (proposalId) {
//         // UPDATE
//         const res = await proposalAPI.updateAccountProposal(
//           proposalId,
//           submissionData,
//         );
//         result = res.data;

//         toast.success("Proposal updated successfully!");
//       } else {
//         // CREATE (Account Proposal)
//         const res = await proposalAPI.createAccountProposal(submissionData);
//         result = res.data;

//         toast.success("Proposal submitted successfully!");
//       }

//       console.log(
//         proposalId ? "Updated proposal:" : "Created proposal:",
//         result,
//       );

//       // Navigate

//       navigate(`/clients/accounts/accountsdash/proposals/${accountId}`);
//     } catch (error) {
//       console.error("Error:", error);

//       const errorMessage = error?.response?.data?.message || error.message;

//       setError("Error submitting proposal: " + errorMessage);
//     }
//   };

//   // Comprehensive validation for all steps
//   const validateAllSteps = () => {
//     const errors = {};
//     const availableSteps = getAvailableSteps();

//     availableSteps.forEach((step, index) => {
//       const stepKey = step.key;
//       const stepErrors = validateStepData(stepKey, formData);

//       if (Object.keys(stepErrors).length > 0) {
//         errors[stepKey] = stepErrors;
//       }
//     });

//     return errors;
//   };

//   // Validate data for a specific step
//   const validateStepData = (stepKey, formData) => {
//     const stepErrors = {};

//     switch (stepKey) {
//       case "general":
//         if (!formData.general.proposalName?.trim()) {
//           stepErrors.proposalName = "Proposal name is required";
//         }
//         // if (!formData.general.templateName?.trim()) {
//         //   stepErrors.templateName = 'Template name is required';
//         // }
//         if (
//           !formData.general.teamMembers ||
//           formData.general.teamMembers.length === 0
//         ) {
//           stepErrors.teamMembers = "At least one team member is required";
//         }
//         break;

//       case "introduction":
//         if (!formData.introduction?.title?.trim()) {
//           stepErrors.title = "Introduction title is required";
//         }
//         if (
//           !formData.introduction?.description?.trim() ||
//           formData.introduction.description.replace(/<[^>]*>/g, "").trim() ===
//             ""
//         ) {
//           stepErrors.description = "Introduction description is required";
//         }
//         break;

//       case "terms":
//         if (!formData.terms?.title?.trim()) {
//           stepErrors.title = "Terms title is required";
//         }
//         if (
//           !formData.terms?.description?.trim() ||
//           formData.terms.description.replace(/<[^>]*>/g, "").trim() === ""
//         ) {
//           stepErrors.description = "Terms and conditions are required";
//         }
//         break;

//       case "services":
//         if (!formData.services.option) {
//           stepErrors.option = "Please select an option";
//         } else {
//           // Additional validation based on selected option
//           if (formData.services.option === "invoice") {
//             // Validate invoices
//             if (
//               !formData.services.invoices ||
//               formData.services.invoices.length === 0
//             ) {
//               stepErrors.invoices = "At least one invoice is required";
//             } else {
//               // Validate each invoice
//               formData.services.invoices.forEach((invoice, index) => {
//                 if (!invoice.invoiceTemplate) {
//                   stepErrors[`invoice_${index}_template`] =
//                     `Invoice ${index + 1}: Template is required`;
//                 }
//                 if (!invoice.teamMembers || invoice.teamMembers.length === 0) {
//                   stepErrors[`invoice_${index}_teamMembers`] =
//                     `Invoice ${index + 1}: At least one team member is required`;
//                 }
//                 if (!invoice.description?.trim()) {
//                   stepErrors[`invoice_${index}_description`] =
//                     `Invoice ${index + 1}: Description is required`;
//                 }

//                 // Validate line items
//                 if (!invoice.rows || invoice.rows.length === 0) {
//                   stepErrors[`invoice_${index}_rows`] =
//                     `Invoice ${index + 1}: At least one line item is required`;
//                 } else {
//                   invoice.rows.forEach((row, rowIndex) => {
//                     if (!row.productorService?.trim()) {
//                       stepErrors[`invoice_${index}_row_${rowIndex}_product`] =
//                         `Invoice ${index + 1}, Row ${rowIndex + 1}: Product/Service name is required`;
//                     }
//                     if (parseFloat(row.rate) <= 0) {
//                       stepErrors[`invoice_${index}_row_${rowIndex}_rate`] =
//                         `Invoice ${index + 1}, Row ${rowIndex + 1}: Rate must be greater than 0`;
//                     }
//                   });
//                 }
//               });
//             }
//           } else if (formData.services.option === "services") {
//             // Validate itemized data
//             const itemized = formData.services.itemizedData;
//             // if (!itemized?.name?.trim()) {
//             //   stepErrors.itemizedName = 'Service name is required';
//             // }
//             // if (parseFloat(itemized?.price) <= 0) {
//             //   stepErrors.itemizedPrice = 'Price must be greater than 0';
//             // }
//             if (!itemized?.rows || itemized.rows.length === 0) {
//               stepErrors.itemizedRows = "At least one line item is required";
//             } else {
//               itemized.rows.forEach((row, index) => {
//                 if (!row.productorService?.trim()) {
//                   stepErrors[`itemized_row_${index}_product`] =
//                     `Row ${index + 1}: Product/Service name is required`;
//                 }
//                 // if (parseFloat(row.rate) <= 0) {
//                 //   stepErrors[`itemized_row_${index}_rate`] = `Row ${index + 1}: Rate must be greater than 0`;
//                 // }
//               });
//             }
//           }
//         }
//         break;

//       case "payments":
//         if (!formData.payments?.method?.trim()) {
//           stepErrors.method = "Payment method is required";
//         }
//         if (parseFloat(formData.payments?.amount) <= 0) {
//           stepErrors.amount = "Payment amount must be greater than 0";
//         }
//         break;
//     }

//     return stepErrors;
//   };

//   // Find the first step that has errors
//   const findFirstErrorStep = (validationErrors) => {
//     const availableSteps = getAvailableSteps();

//     for (let i = 0; i < availableSteps.length; i++) {
//       const stepKey = availableSteps[i].key;
//       if (
//         validationErrors[stepKey] &&
//         Object.keys(validationErrors[stepKey]).length > 0
//       ) {
//         return i;
//       }
//     }

//     return -1;
//   };
//   const CurrentStepComponent = availableSteps[currentStep]?.component;
//   const currentStepKey = availableSteps[currentStep]?.key;

//    if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen gap-3">
//         <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//         <span className="text-base font-medium text-muted-foreground">Loading proposal data...</span>
//       </div>
//     );
//   }

//   if (!CurrentStepComponent) {
//     const recalculatedSteps = getAvailableSteps();
//     if (currentStep >= recalculatedSteps.length) {
//       setCurrentStep(0);
//     }
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="text-sm text-muted-foreground">Loading...</span>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Top Header Bar */}
//       <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
//         <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
//           <Button variant="ghost" size="icon" onClick={handleBackToList} className="shrink-0">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <h1 className="text-base font-semibold text-foreground truncate">
//             {proposalId ? `Edit Proposal: ${formData.general.proposalName}` : 'Create New Proposal'}
//           </h1>
//         </div>
//       </div>

//       <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
//         {error && (
//           <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
//             <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
//             <span className="text-sm text-destructive">{error}</span>
//           </div>
//         )}

//         {/* Stepper */}
//         <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
//           <nav aria-label="Progress">
//             <ol className="flex items-center flex-wrap gap-y-2">
//               {availableSteps.map((step, index) => {
//                 const isActive = index === currentStep;
//                 const isCompleted = index < currentStep;
//                 const hasError = hasStepError(step.key);
//                 return (
//                   <li key={step.key} className="flex items-center">
//                     <button
//                       onClick={() => goToStep(index)}
//                       className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground shadow-sm'
//                           : isCompleted
//                           ? 'bg-primary/10 text-primary hover:bg-primary/20'
//                           : hasError
//                           ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
//                           : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
//                       }`}
//                     >
//                       <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
//                         isActive
//                           ? 'bg-primary-foreground/20 text-primary-foreground'
//                           : isCompleted
//                           ? 'bg-primary text-primary-foreground'
//                           : hasError
//                           ? 'bg-destructive text-destructive-foreground'
//                           : 'bg-muted-foreground/30 text-muted-foreground'
//                       }`}>
//                         {isCompleted ? <Check className="h-3 w-3" /> : hasError ? <AlertCircle className="h-3 w-3" /> : index + 1}
//                       </span>
//                       <span className="hidden sm:inline">{step.name}</span>
//                     </button>
//                     {index < availableSteps.length - 1 && (
//                       <ChevronRight className="mx-1 h-4 w-4 text-border shrink-0" />
//                     )}
//                   </li>
//                 );
//               })}
//             </ol>
//           </nav>
//         </div>

//         {/* Step Content */}
//         <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
//           <CurrentStepComponent
//             formData={formData}
//             updateFormData={updateFormData}
//             nextStep={nextStep}
//             prevStep={prevStep}
//             currentStep={currentStep}
//             totalSteps={availableSteps.length}
//             currentStepKey={currentStepKey}
//             handleSubmit={handleSubmit}
//             isLastStep={isLastStep}
//             isEditing={!!proposalId}
//             stepErrors={stepErrors[currentStepKey] || {}}
//             setStepErrors={(errors) => setStepErrors(prev => ({ ...prev, [currentStepKey]: errors }))}
//           />
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex items-center justify-between">
//           <Button
//             variant="outline"
//             onClick={prevStep}
//             disabled={currentStep === 0}
//             className="rounded-full px-5 gap-2"
//           >
//             <ChevronLeft className="h-4 w-4" /> Previous
//           </Button>
//           <Button
//             onClick={nextStep}
//             className="rounded-full px-6 gap-2"
//           >
//             {isLastStep ? (proposalId ? 'Update Proposal' : 'Submit Proposal') : 'Next'}
//             {!isLastStep && <ChevronRight className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProposalForm;


import React, { useState, useEffect, useContext } from "react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from '../../../components/ui/button';
import GeneralStep from "./Steps/AccountGeneral";
import IntroductionStep from "./Steps/IntroductionStep";
import TermsStep from "./Steps/TermsStep";
import ServicesInvoicesStep from "./Steps/ServicesInvoicesStep";
import PaymentStep from "./Steps/PaymentStep";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { proposalAPI, accountsAPI } from "../../../services/api";

const ProposalForm = () => {
  const { accountId } = useParams();

  console.log("accountid", accountId);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepErrors, setStepErrors] = useState({});
  const [formData, setFormData] = useState({
    general: {
      skipStepper: false,
      introductionEnabled: true,
      termsEnabled: true,
      servicesEnabled: true,
      paymentsEnabled: false,
      proposalTemp: "",
      account: null, // Changed from [] to null for single object
      proposalName: "",
      teamMembers: [],
      template: null, // Add template field
    },
    introduction: {
      title: "",
      description: "",
    },
    terms: {
      title: "",
      description: "",
    },
    services: {
      option: "",
      invoices: [],
      itemizedData: {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      },
    },
    payments: {
      method: "",
      amount: 0,
    },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("edit");

  // Helper function for empty row
  function getEmptyRow() {
    return {
      productName: "",
      description: "",
      rate: "0.00",
      qty: "1",
      amount: "0.00",
      tax: false,
      isDiscount: false,
    };
  }

  function getEmptyInvoice() {
    return {
      invoiceTemplate: null,
      teamMembers: [],
      issueInvoice: "immediately",
      specificDate: null,
      selectedTime: null,
      description: "",
      charCount: 0,
      charLimit: 1000,
      rows: [getEmptyRow()],
      subtotal: "0.00",
      taxRate: "0",
      taxTotal: "0.00",
      totalAmount: "0.00",
      clientNote: "",
    };
  }

  // Fetch proposal data if editing
  useEffect(() => {
    if (proposalId) {
      fetchProposalData();
    }
  }, [proposalId]);

  const fetchProposalData = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ 1. Fetch proposal
      const proposalRes = await proposalAPI.getAccountProposalById(proposalId);
      const proposalData = proposalRes.data;
      console.log("Fetched proposal data:", proposalData);

      // ✅ 2. Fetch accounts + templates in parallel
      const [accountsRes, templatesRes] = await Promise.all([
        accountsAPI.getAccountNamesByStatus(),
        proposalAPI.getAllProposals(),
      ]);

      const accountsData = accountsRes.data;
      const templatesData = templatesRes.data;

      // ✅ 3. Normalize accounts response
      let accounts = [];
      if (Array.isArray(accountsData)) {
        accounts = accountsData;
      } else if (Array.isArray(accountsData.accounts)) {
        accounts = accountsData.accounts;
      } else if (Array.isArray(accountsData.accountlist)) {
        accounts = accountsData.accountlist;
      } else if (Array.isArray(accountsData.teamAccounts)) {
        accounts = accountsData.teamAccounts;
      }

      console.log("Accounts data for transform:", accounts);

      // ✅ 4. Normalize templates response
      let templates = [];
      if (Array.isArray(templatesData)) {
        templates = templatesData;
      } else if (Array.isArray(templatesData.proposallist)) {
        templates = templatesData.proposallist;
      } else if (Array.isArray(templatesData.templates)) {
        templates = templatesData.templates;
      }

      // ✅ 5. Transform data
      const transformedData = transformDataForForm(proposalData, accounts, templates);
      setFormData(transformedData);
    } catch (error) {
      console.error("Error fetching proposal:", error);
      const message = error.response?.data?.message || error.message || "Something went wrong";
      setError("Error loading proposal: " + message);
    } finally {
      setLoading(false);
    }
  };

  // Transform API data back to form structure (updated for single account)
  // const transformDataForForm = (apiData, accounts = [], templates = []) => {
  //   console.log("API Data received:", apiData);
  //   console.log("Accounts for transform:", accounts);
  //   console.log("Templates for transform:", templates);

  //   if (!Array.isArray(accounts)) {
  //     accounts = [];
  //   }

  //   if (!Array.isArray(templates)) {
  //     templates = [];
  //   }

  //   // Handle account - now it's a single ID from backend
  //   let selectedAccount = null;
  //   const accountId = apiData.general?.account;

  //   if (accountId) {
  //     // Find the account in the accounts list
  //     const foundAccount = accounts.find(acc => acc._id === accountId || acc.id === accountId);
  //     if (foundAccount) {
  //       selectedAccount = {
  //         value: foundAccount._id || foundAccount.id,
  //         label: foundAccount.accountName || foundAccount.Name || "Account"
  //       };
  //     } else if (typeof accountId === 'string') {
  //       // If account not found in list, still create an object with the ID
  //       selectedAccount = {
  //         value: accountId,
  //         label: "Account"
  //       };
  //     }
  //   }

  //   // Handle template
  //   let selectedTemplate = null;
  //   const templateId = apiData.general?.proposalTemp;

  //   if (templateId) {
  //     const foundTemplate = templates.find(temp => temp._id === templateId || temp.id === templateId);
  //     if (foundTemplate) {
  //       selectedTemplate = {
  //         value: foundTemplate._id || foundTemplate.id,
  //         label: foundTemplate.general?.templateName || foundTemplate.general?.proposalName || "Template"
  //       };
  //     }
  //   }

  //   return {
  //     general: {
  //       skipStepper: apiData.general?.skipStepper || false,
  //       introductionEnabled: apiData.general?.introductionEnabled ?? true,
  //       termsEnabled: apiData.general?.termsEnabled ?? true,
  //       servicesEnabled: apiData.general?.servicesEnabled ?? true,
  //       paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
  //       proposalTemp: templateId || "",
  //       proposalName: apiData.general?.proposalName || "",
  //       account: selectedAccount, // Single object, not array
  //       template: selectedTemplate,
  //       teamMembers: apiData.general?.teamMembers || [],
  //     },
  //     introduction: {
  //       title: apiData.introduction?.title || "",
  //       description: apiData.introduction?.description || "",
  //     },
  //     terms: {
  //       title: apiData.terms?.title || "",
  //       description: apiData.terms?.description || "",
  //     },
  //     services: {
  //       option: apiData.services?.option || "",
  //       invoices: transformInvoicesForForm(apiData.services?.invoices || []),
  //       itemizedData: transformItemizedDataForForm(apiData.services?.itemizedData),
  //     },
  //     payments: {
  //       method: apiData.payments?.method || "",
  //       amount: apiData.payments?.amount || 0,
  //     },
  //   };
  // };
// Transform API data back to form structure (updated for single account)
const transformDataForForm = (apiData, accounts = [], templates = []) => {
  console.log("API Data received:", apiData);
  console.log("Accounts for transform:", accounts);
  console.log("Templates for transform:", templates);

  if (!Array.isArray(accounts)) {
    accounts = [];
  }

  if (!Array.isArray(templates)) {
    templates = [];
  }

  // Handle account - it's now an object with _id and accountName from backend
  let selectedAccount = null;
  const accountData = apiData.general?.account;

  if (accountData) {
    // If accountData is an object with _id and accountName (from populated data)
    if (typeof accountData === 'object' && accountData._id) {
      selectedAccount = {
        value: accountData._id,
        label: accountData.accountName || "Account"
      };
    }
    // If accountData is just an ID string
    else if (typeof accountData === 'string') {
      const foundAccount = accounts.find(acc => acc._id === accountData || acc.id === accountData);
      if (foundAccount) {
        selectedAccount = {
          value: foundAccount._id || foundAccount.id,
          label: foundAccount.accountName || foundAccount.Name || "Account"
        };
      } else {
        selectedAccount = {
          value: accountData,
          label: "Account"
        };
      }
    }
    // If accountData is already in the correct format
    else if (typeof accountData === 'object' && accountData.value && accountData.label) {
      selectedAccount = accountData;
    }
  }

  console.log("Selected Account after transform:", selectedAccount);

  // Handle template
  let selectedTemplate = null;
  const templateId = apiData.general?.proposalTemp;

  if (templateId) {
    const foundTemplate = templates.find(temp => temp._id === templateId || temp.id === templateId);
    if (foundTemplate) {
      selectedTemplate = {
        value: foundTemplate._id || foundTemplate.id,
        label: foundTemplate.general?.templateName || foundTemplate.general?.proposalName || "Template"
      };
    }
  }

  return {
    general: {
      skipStepper: apiData.general?.skipStepper || false,
      introductionEnabled: apiData.general?.introductionEnabled ?? true,
      termsEnabled: apiData.general?.termsEnabled ?? true,
      servicesEnabled: apiData.general?.servicesEnabled ?? true,
      paymentsEnabled: apiData.general?.paymentsEnabled ?? false,
      proposalTemp: templateId || "",
      proposalName: apiData.general?.proposalName || "",
      account: selectedAccount, // Single object with value and label
      template: selectedTemplate,
      teamMembers: apiData.general?.teamMembers || [],
    },
    introduction: {
      title: apiData.introduction?.title || "",
      description: apiData.introduction?.description || "",
    },
    terms: {
      title: apiData.terms?.title || "",
      description: apiData.terms?.description || "",
    },
    services: {
      option: apiData.services?.option || "",
      invoices: transformInvoicesForForm(apiData.services?.invoices || []),
      itemizedData: transformItemizedDataForForm(apiData.services?.itemizedData),
    },
    payments: {
      method: apiData.payments?.method || "",
      amount: apiData.payments?.amount || 0,
    },
  };
};
  // Transform line items to rows format
  const transformLineItemsToRows = (lineItems) => {
    if (!lineItems || lineItems.length === 0) {
      return [getEmptyRow()];
    }
    return lineItems.map((item) => ({
      productorService: item.productorService || "",
      description: item.description || "",
      rate: item.rate?.toString() || "0.00",
      quantity: item.quantity?.toString() || "1",
      amount: item.amount?.toString() || "0.00",
      tax: item.tax || false,
      isDiscount: false,
    }));
  };

  const transformInvoicesForForm = (invoices, invoiceTemplates = []) => {
    if (!invoices || invoices.length === 0) {
      return [{ id: 1, ...getEmptyInvoice() }];
    }

    return invoices.map((invoice, index) => {
      const template = invoiceTemplates.find(t => t._id === invoice.invoiceTemplate);
      return {
        id: index + 1,
        invoiceTemplate: invoice.invoiceTemplate ? {
          value: invoice.invoiceTemplate,
          label: template?.templatename || "Template",
        } : null,
        teamMembers: invoice.teamMembers || [],
        issueInvoice: "immediately",
        specificDate: null,
        selectedTime: null,
        description: invoice.description || "",
        charCount: invoice.description?.length || 0,
        charLimit: 1000,
        rows: transformLineItemsToRows(invoice.lineItems || []),
        subtotal: invoice.subtotal?.toString() || "0.00",
        taxRate: invoice.taxRate?.toString() || "0",
        taxTotal: invoice.taxTotal?.toString() || "0.00",
        totalAmount: invoice.totalAmount?.toString() || "0.00",
        clientNote: "",
      };
    });
  };

  const transformItemizedDataForForm = (itemizedData) => {
    if (!itemizedData) {
      return {
        price: 0,
        name: "",
        rows: [getEmptyRow()],
        subtotal: "0.00",
        taxRate: "0",
        taxTotal: "0.00",
        totalAmount: "0.00",
      };
    }

    return {
      ...itemizedData,
      price: itemizedData.price || 0,
      name: itemizedData.name || "",
      rows: transformLineItemsToRows(itemizedData.lineItems),
      subtotal: itemizedData.subtotal?.toString() || "0.00",
      taxRate: itemizedData.taxRate?.toString() || "0",
      taxTotal: itemizedData.taxTotal?.toString() || "0.00",
      totalAmount: itemizedData.totalAmount?.toString() || "0.00",
    };
  };

  // Get available steps based on visibility settings and service option
  const getAvailableSteps = () => {
    const steps = [
      { name: "General", component: GeneralStep, key: "general", alwaysVisible: true },
    ];

    if (formData.general.introductionEnabled) {
      steps.push({ name: "Introduction", component: IntroductionStep, key: "introduction" });
    }

    if (formData.general.termsEnabled) {
      steps.push({ name: "Terms", component: TermsStep, key: "terms" });
    }

    if (formData.general.servicesEnabled) {
      steps.push({ name: "Services & Invoices", component: ServicesInvoicesStep, key: "services" });
    }

    if (formData.general.paymentsEnabled && formData.services.option === "invoice") {
      steps.push({ name: "Payment", component: PaymentStep, key: "payments" });
    }

    return steps;
  };

  const availableSteps = getAvailableSteps();

  const updateFormData = (section, newData) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...newData },
    }));
  };

  // Validation functions for each step
  const validateStep = (stepIndex) => {
    const stepKey = availableSteps[stepIndex]?.key;
    let isValid = true;
    const newErrors = {};

    switch (stepKey) {
      case "general":
        if (!formData.general.proposalName?.trim()) {
          newErrors.proposalName = "Proposal name is required";
          isValid = false;
        }
        if (!formData.general.account) {
          newErrors.account = "Account is required";
          isValid = false;
        }
        break;

      case "introduction":
        if (!formData.introduction?.title?.trim()) {
          newErrors.title = "Introduction title is required";
          isValid = false;
        }
        if (!formData.introduction?.description?.trim() ||
            formData.introduction.description.replace(/<[^>]*>/g, "").trim() === "") {
          newErrors.description = "Introduction description is required";
          isValid = false;
        }
        break;

      case "terms":
        if (!formData.terms?.title?.trim()) {
          newErrors.title = "Terms title is required";
          isValid = false;
        }
        if (!formData.terms?.description?.trim() ||
            formData.terms.description.replace(/<[^>]*>/g, "").trim() === "") {
          newErrors.description = "Terms and conditions are required";
          isValid = false;
        }
        break;

      case "services":
        if (!formData.services.option) {
          newErrors.option = "Please select an option";
          isValid = false;
        }
        break;
    }

    setStepErrors((prev) => ({ ...prev, [stepKey]: newErrors }));
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < availableSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hasStepError = (stepKey) => {
    return stepErrors[stepKey] && Object.keys(stepErrors[stepKey]).length > 0;
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < availableSteps.length) {
      setCurrentStep(stepIndex);
    }
  };

  const handleBackToList = () => {
    const accountId = Cookies.get("accountId");
    if (accountId) {
      navigate(`/clients/accounts/accountsdash/proposals/${accountId}`);
    } else {
      navigate("/insights");
    }
  };

  const isLastStep = currentStep === availableSteps.length - 1;

  // Transform invoice data before sending
  const transformInvoiceData = (invoices) => {
    return invoices.map((invoice) => ({
      ...invoice,
      invoiceTemplate: invoice.invoiceTemplate?.value || invoice.invoiceTemplate,
      teamMembers: invoice.teamMembers?.value || invoice.teamMembers,
      lineItems: invoice.rows?.map((row) => ({
        productorService: String(row.productorService),
        description: row.description,
        rate: parseFloat(row.rate) || 0,
        quantity: parseFloat(row.quantity) || 0,
        amount: parseFloat(row.amount) || 0,
        tax: Boolean(row.tax),
      })) || [],
    }));
  };

  const transformItemizedData = (itemizedData) => {
    if (!itemizedData) return null;
    return {
      ...itemizedData,
      price: parseFloat(itemizedData.price) || 0,
      lineItems: itemizedData.rows?.map((row) => ({
        productorService: String(row.productorService),
        description: row.description,
        rate: parseFloat(row.rate) || 0,
        quantity: parseFloat(row.quantity) || 0,
        amount: parseFloat(row.amount) || 0,
        tax: Boolean(row.tax),
      })) || [],
      subtotal: parseFloat(itemizedData.subtotal) || 0,
      taxRate: parseFloat(itemizedData.taxRate) || 0,
      taxTotal: parseFloat(itemizedData.taxTotal) || 0,
      totalAmount: parseFloat(itemizedData.totalAmount) || 0,
    };
  };

  // Updated handleSubmit for single account
  const handleSubmit = async () => {
    try {
      console.log("Submitting proposal...");
      setError("");

      // Get account ID from the single account object
      const accountIdValue = formData.general.account?.value || formData.general.account?._id || null;
      const templateId = formData.general.template?.value;

      // Validation
      const validationErrors = validateAllSteps();

      if (Object.keys(validationErrors).length > 0) {
        console.log("Validation errors found:", validationErrors);
        setStepErrors(validationErrors);

        const firstErrorStep = findFirstErrorStep(validationErrors);
        if (firstErrorStep !== -1) {
          setCurrentStep(firstErrorStep);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Prepare data - account is now a single ID, not an array
      const submissionData = {
        ...formData,
        general: {
          ...formData.general,
          account: accountIdValue, // Single ID, not array
          proposalTemp: templateId,
        },
        services: {
          ...formData.services,
          invoices: formData.services.option === "invoice"
            ? transformInvoiceData(formData.services.invoices)
            : [],
          itemizedData: formData.services.option === "services"
            ? transformItemizedData(formData.services.itemizedData)
            : null,
        },
        status: "Pending",
      };

      // Remove temporary UI fields
      if (submissionData.general.template) {
        delete submissionData.general.template;
      }

      console.log("Submitting data:", submissionData);

      let result;

      if (proposalId) {
        const res = await proposalAPI.updateAccountProposal(proposalId, submissionData);
        result = res.data;
        toast.success("Proposal updated successfully!");
      } else {
        const res = await proposalAPI.createAccountProposal(submissionData);
        result = res.data;
        toast.success("Proposal submitted successfully!");
      }

      console.log(proposalId ? "Updated proposal:" : "Created proposal:", result);
    // ✅ IMPORTANT FIX
    setCurrentStep(0);   // reset step
    setFormData(prev => prev); // optional: force fresh render
      // Navigate using the account ID from the submission or from cookies
      const redirectAccountId = accountIdValue || Cookies.get("accountId");
      navigate(`/clients/accounts/accountsdash/proposals/${redirectAccountId}`);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.message || error.message;
      setError("Error submitting proposal: " + errorMessage);
      toast.error(errorMessage);
    }
  };

  // Comprehensive validation for all steps
  const validateAllSteps = () => {
    const errors = {};
    const availableSteps = getAvailableSteps();

    availableSteps.forEach((step) => {
      const stepKey = step.key;
      const stepErrors = validateStepData(stepKey, formData);
      if (Object.keys(stepErrors).length > 0) {
        errors[stepKey] = stepErrors;
      }
    });

    return errors;
  };

  // Validate data for a specific step
  const validateStepData = (stepKey, formData) => {
    const stepErrors = {};

    switch (stepKey) {
      case "general":
        if (!formData.general.proposalName?.trim()) {
          stepErrors.proposalName = "Proposal name is required";
        }
        if (!formData.general.account) {
          stepErrors.account = "Account is required";
        }
        if (!formData.general.teamMembers || formData.general.teamMembers.length === 0) {
          stepErrors.teamMembers = "At least one team member is required";
        }
        break;

      case "introduction":
        if (!formData.introduction?.title?.trim()) {
          stepErrors.title = "Introduction title is required";
        }
        if (!formData.introduction?.description?.trim() ||
            formData.introduction.description.replace(/<[^>]*>/g, "").trim() === "") {
          stepErrors.description = "Introduction description is required";
        }
        break;

      case "terms":
        if (!formData.terms?.title?.trim()) {
          stepErrors.title = "Terms title is required";
        }
        if (!formData.terms?.description?.trim() ||
            formData.terms.description.replace(/<[^>]*>/g, "").trim() === "") {
          stepErrors.description = "Terms and conditions are required";
        }
        break;

      case "services":
        if (!formData.services.option) {
          stepErrors.option = "Please select an option";
        }
        break;

      case "payments":
        if (!formData.payments?.method?.trim()) {
          stepErrors.method = "Payment method is required";
        }
        if (parseFloat(formData.payments?.amount) <= 0) {
          stepErrors.amount = "Payment amount must be greater than 0";
        }
        break;
    }

    return stepErrors;
  };

  const findFirstErrorStep = (validationErrors) => {
    const availableSteps = getAvailableSteps();
    for (let i = 0; i < availableSteps.length; i++) {
      const stepKey = availableSteps[i].key;
      if (validationErrors[stepKey] && Object.keys(validationErrors[stepKey]).length > 0) {
        return i;
      }
    }
    return -1;
  };

  const CurrentStepComponent = availableSteps[currentStep]?.component;
  const currentStepKey = availableSteps[currentStep]?.key;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-base font-medium text-muted-foreground">Loading proposal data...</span>
      </div>
    );
  }

  if (!CurrentStepComponent) {
    const recalculatedSteps = getAvailableSteps();
    if (currentStep >= recalculatedSteps.length) {
      setCurrentStep(0);
    }
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-base font-semibold text-foreground truncate">
            {proposalId ? `Edit Proposal: ${formData.general.proposalName}` : 'Create New Proposal'}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
          <nav aria-label="Progress">
            <ol className="flex items-center flex-wrap gap-y-2">
              {availableSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const hasError = hasStepError(step.key);
                return (
                  <li key={step.key} className="flex items-center">
                    <button
                      onClick={() => goToStep(index)}
                      className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : isCompleted
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : hasError
                          ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : hasError
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-muted-foreground/30 text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-3 w-3" /> : hasError ? <AlertCircle className="h-3 w-3" /> : index + 1}
                      </span>
                      <span className="hidden sm:inline">{step.name}</span>
                    </button>
                    {index < availableSteps.length - 1 && (
                      <ChevronRight className="mx-1 h-4 w-4 text-border shrink-0" />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <CurrentStepComponent
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
            currentStep={currentStep}
            totalSteps={availableSteps.length}
            currentStepKey={currentStepKey}
            handleSubmit={handleSubmit}
            isLastStep={isLastStep}
            isEditing={!!proposalId}
            stepErrors={stepErrors[currentStepKey] || {}}
            setStepErrors={(errors) => setStepErrors(prev => ({ ...prev, [currentStepKey]: errors }))}
          />
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="rounded-full px-5 gap-2">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          <Button onClick={nextStep} className="rounded-full px-6 gap-2">
            {isLastStep ? (proposalId ? 'Update Proposal' : 'Submit Proposal') : 'Next'}
            {!isLastStep && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProposalForm;