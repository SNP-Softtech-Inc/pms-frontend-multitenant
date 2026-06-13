


// import React, { useState, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   Box,
//   List,
//   ListItemButton,
//   Typography,
//   Divider,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   TextField,
//   Button,
//   ButtonGroup,
//   FormControlLabel,
//   Checkbox,
//   ListItemText,
//   ListItemIcon
// } from "@mui/material";
// import SignatureCanvas from "react-signature-canvas";
// import axios from "axios";
// import CloseIcon from "@mui/icons-material/Close";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HTMLReactParser from "html-react-parser";
// import { toast } from "react-toastify";

// const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
//   const [activeStep, setActiveStep] = useState("general");
//   // Signature States
//   const [signatureType, setSignatureType] = useState("draw");
//   const [signatureData, setSignatureData] = useState(null);
//   const [typedSignature, setTypedSignature] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [isSigning, setIsSigning] = useState(false);

//   const sigCanvas = useRef(null);
  
//   // Check if proposal is signed
//   const isSigned = proposal?.status === "Signed";
  
//   // Determine enabled sections
//   const steps = [
//     { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
//     { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
//     { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
//     { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
//     { id: "signature", label: "Sign & Accept", enabled: true },
//   ].filter(s => s.enabled);

//   const introRef = useRef(null);
//   const termsRef = useRef(null);
//   const servicesRef = useRef(null);
//   const paymentsRef = useRef(null);
//   const signatureRef = useRef(null);
//   const refMap = {
//     introduction: introRef,
//     terms: termsRef,
//     services: servicesRef,
//     payments: paymentsRef,
//     signature: signatureRef,
//   };

//   const handleStepClick = (id) => {
//     const sectionRef = refMap[id];
//     if (sectionRef?.current) {
//       sectionRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//     setActiveStep(id);
//   };

//   const handleScroll = (e) => {
//     const scrollTop = e.target.scrollTop;

//     for (let step of steps) {
//       const stepRef = refMap[step.id];
//       if (stepRef?.current) {
//         const offsetTop = stepRef.current.offsetTop;
//         if (scrollTop + 50 >= offsetTop) {
//           setActiveStep(step.id);
//         }
//       }
//     }
//   };

 

//   return (
//     <Dialog open={open} onClose={handleClose} fullScreen>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
//         {proposal?.general?.proposalName || "Proposal"}
//         <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
//       </DialogTitle>

//       <DialogContent sx={{ display: "flex", height: "75vh", p: 0 }}>
        
//         {/* LEFT SIDE MENU */}
//         <Box sx={{ width: "28%", borderRight: "1px solid #ddd" }}>
//           <List>
//             {steps.map((step) => (
//               <ListItemButton
//                 key={step.id}
//                 selected={activeStep === step.id}
//                 onClick={() => handleStepClick(step.id)}
//                 sx={{
//                   // Apply green color when signed
//                   ...(isSigned && {
//                     color: "success.main",
//                     "& .MuiListItemText-primary": {
//                       display: "flex",
//                       alignItems: "center",
//                       gap: 1,
//                     },
//                   }),
//                 }}
//               >
//                 {/* Show checkmark icon when signed */}
//                 {isSigned && (
//                   <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
//                     <CheckCircleOutlineIcon 
//                       fontSize="small" 
//                       sx={{ color: "success.main" }} 
//                     />
//                   </ListItemIcon>
//                 )}
//                 <ListItemText 
//                   primary={step.label}
//                   sx={{
//                     // Ensure text color changes when signed
//                     color: isSigned ? "success.main" : "inherit",
//                   }}
//                 />
//               </ListItemButton>
//             ))}
//           </List>
//         </Box>

//         {/* RIGHT CONTENT */}
//         <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }} onScroll={handleScroll}>

//           {/* ✅ INTRODUCTION */}
//           {proposal?.general?.introductionEnabled && (
//             <Box ref={introRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">{proposal?.introduction?.title || "Introduction"}</Typography>
//               {HTMLReactParser(proposal?.introduction?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ TERMS */}
//           {proposal?.general?.termsEnabled && (
//             <Box ref={termsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Terms & Conditions</Typography>
//               {HTMLReactParser(proposal?.terms?.description || "")}
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - ITEMIZED */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Services</Typography>

//               <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                 <Box sx={{
//                   p: 1, fontWeight: "bold",
//                   display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                 }}>
//                   <Typography>Service</Typography>
//                   <Typography textAlign="right">Rate</Typography>
//                   <Typography textAlign="right">Qty</Typography>
//                   <Typography textAlign="right">Tax</Typography>
//                   <Typography textAlign="right">Amount</Typography>
//                 </Box>

//                 {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
//                   const rate = Number(item.rate || 0);
//                   const qty = Number(item.quantity || 1);
//                   const taxRate = proposal?.services?.itemizedData?.taxRate || 0;

//                   const base = rate * qty;
//                   const tax = item.tax ? (base * taxRate) / 100 : 0;
//                   const total = base + tax;

//                   return (
//                     <Box key={i} sx={{
//                       p: 1,
//                       borderTop: "1px solid #e5e7eb",
//                       display: "grid",
//                       gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Box>
//                         <Typography fontWeight="bold">{item.productorService}</Typography>
//                         <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                       </Box>

//                       <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                       <Typography textAlign="right">{qty}</Typography>
//                       <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                       <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                     </Box>
//                   );
//                 })}

//                 <Box sx={{
//                   borderTop: "1px solid #e5e7eb",
//                   p: 1,
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   fontWeight: "bold"
//                 }}>
//                   Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
//                 </Box>
//               </Box>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SERVICES - INVOICE MODE */}
//           {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
//             <Box ref={servicesRef} sx={{ mb: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Invoice</Typography>

//               <Box sx={{ mb: 2 }}>
//                 <Typography fontWeight="bold">Amount</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Invoice will be issued</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
//                 </Box>

//                 <Typography fontWeight="bold" sx={{ mt: 2 }}>Description</Typography>
//                 <Box sx={{ bgcolor: "#f9fafb", p: 1, borderRadius: "8px" }}>
//                   {proposal?.services?.invoices?.[0]?.description || "N/A"}
//                 </Box>
//               </Box>

//               <Accordion>
//                 <AccordionSummary expandIcon={<span>▼</span>}>
//                   <Typography fontWeight="bold">Invoice details</Typography>
//                 </AccordionSummary>

//                 <AccordionDetails>
//                   <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
//                     <Box sx={{
//                       bgcolor: "#f9fafb", p: 1, fontWeight: "bold",
//                       display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                     }}>
//                       <Typography>Service</Typography>
//                       <Typography textAlign="right">Rate</Typography>
//                       <Typography textAlign="right">Qty</Typography>
//                       <Typography textAlign="right">Tax</Typography>
//                       <Typography textAlign="right">Amount</Typography>
//                     </Box>

//                     {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
//                       const rate = Number(item.rate || 0);
//                       const qty = Number(item.quantity || 1);
//                       const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;

//                       const base = rate * qty;
//                       const tax = item.tax ? (base * taxRate) / 100 : 0;
//                       const total = base + tax;

//                       return (
//                         <Box key={i} sx={{
//                           p: 1,
//                           borderTop: "1px solid #e5e7eb",
//                           display: "grid",
//                           gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
//                         }}>
//                           <Box>
//                             <Typography fontWeight="bold">{item.productorService}</Typography>
//                             <Typography fontSize={12} color="text.secondary">{item.description}</Typography>
//                           </Box>

//                           <Typography textAlign="right">${rate.toFixed(2)}</Typography>
//                           <Typography textAlign="right">{qty}</Typography>
//                           <Typography textAlign="right">${tax.toFixed(2)}</Typography>
//                           <Typography textAlign="right">${total.toFixed(2)}</Typography>
//                         </Box>
//                       );
//                     })}

//                     <Box sx={{
//                       borderTop: "1px solid #e5e7eb",
//                       p: 1,
//                       display: "flex",
//                       justifyContent: "flex-end",
//                       fontWeight: "bold"
//                     }}>
//                       Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
//                     </Box>
//                   </Box>
//                 </AccordionDetails>
//               </Accordion>

//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ PAYMENTS */}
//           {proposal?.general?.paymentsEnabled && (
//             <Box ref={paymentsRef} sx={{ mb: 3 }}>
//               <Typography variant="h6">Payments</Typography>
//               <Typography><b>Method:</b> {proposal?.payments?.method}</Typography>
//               <Typography><b>Amount:</b> ${proposal?.payments?.amount}</Typography>
//               <Divider sx={{ my: 2 }} />
//             </Box>
//           )}

//           {/* ✅ SIGNATURE SECTION */}
//           {/* <Box ref={signatureRef} sx={{ mb: 4 }}>
//             <Typography variant="h6" sx={{ mb: 2 }}>Sign & Accept</Typography>
//             <Divider sx={{ mb: 2 }} />

//             {proposal?.status === "Signed" ? (
//               <>
//                 <Typography sx={{ mb: 2 }} color="text.secondary">
//                   Signed on {new Date(proposal.signedAt).toLocaleString()}
//                 </Typography>

//                 <Typography fontWeight="bold">Signature:</Typography>

//                 {proposal?.signature?.startsWith("data:image") ? (
//                   <img
//                     src={proposal.signature}
//                     alt="signature"
//                     style={{
//                       maxWidth: 300,
//                       border: "1px solid #ddd",
//                       background: "white",
//                       padding: 10,
//                       marginTop: 10,
//                     }}
//                   />
//                 ) : (
//                   <div
//                     style={{
//                       fontSize: 24,
//                       fontFamily: "cursive",
//                       border: "1px solid #ccc",
//                       padding: 20,
//                       background: "#f7f7f7",
//                       marginTop: 10,
//                       borderRadius: 6,
//                     }}
//                   >
//                     {proposal.signature}
//                   </div>
//                 )}

//                 <Button variant="contained" disabled sx={{ mt: 2, opacity: 0.7 }}>
//                   Already Signed
//                 </Button>
//               </>
//             ) : (
//               <>
               
//                 <ButtonGroup sx={{ mb: 2 }}>
//                   <Button
//                     variant={signatureType === "draw" ? "contained" : "outlined"}
//                     onClick={() => setSignatureType("draw")}
//                   >
//                     Draw
//                   </Button>
//                   <Button
//                     variant={signatureType === "type" ? "contained" : "outlined"}
//                     onClick={() => setSignatureType("type")}
//                   >
//                     Type
//                   </Button>
//                 </ButtonGroup>

                
//                 {signatureType === "draw" && (
//                   <>
//                     <SignatureCanvas
//                       ref={sigCanvas}
//                       penColor="black"
//                       canvasProps={{
//                         width: 500,
//                         height: 200,
//                         style: {
//                           border: "1px solid #ccc",
//                           background: "#fafafa",
//                           borderRadius: 6,
//                         },
//                       }}
//                     />

//                     <Box sx={{ display: "flex", gap: 1, my: 2 }}>
//                       <Button variant="outlined" onClick={() => sigCanvas.current.clear()}>
//                         Clear
//                       </Button>
//                       <Button
//                         variant="contained"
//                         onClick={() => {
//                           if (sigCanvas.current.isEmpty()) {
//                             alert("Please draw your signature first");
//                             return;
//                           }
//                           const signature = sigCanvas.current.toDataURL("image/png");
//                           setSignatureData(signature);
//                         }}
//                       >
//                         Save Signature
//                       </Button>
//                     </Box>

//                     {signatureData && (
//                       <>
//                         <Typography variant="body2" color="success.main" sx={{ mb: 1 }}>
//                           ✓ Signature saved successfully
//                         </Typography>
//                         <img
//                           src={signatureData}
//                           alt="preview"
//                           style={{
//                             maxWidth: 300,
//                             border: "1px solid #ddd",
//                             padding: 10,
//                             background: "white",
//                           }}
//                         />
//                       </>
//                     )}
//                   </>
//                 )}

               
//                 {signatureType === "type" && (
//                   <>
//                     <TextField
//                       fullWidth
//                       placeholder="Type your full name"
//                       value={typedSignature}
//                       onChange={(e) => setTypedSignature(e.target.value)}
//                       sx={{ mb: 2 }}
//                       InputProps={{
//                         style: { fontFamily: "cursive", fontSize: 22 },
//                       }}
//                     />

//                     {typedSignature && (
//                       <div
//                         style={{
//                           fontSize: 24,
//                           fontFamily: "cursive",
//                           border: "1px solid #ccc",
//                           padding: 20,
//                           background: "#fafafa",
//                           borderRadius: 6,
//                           marginBottom: 20,
//                         }}
//                       >
//                         {typedSignature}
//                       </div>
//                     )}
//                   </>
//                 )}

                
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                       disabled={proposal?.status === "Signed"}
//                     />
//                   }
//                   label="I accept the Terms & Conditions"
//                   sx={{ mt: 2 }}
//                 />

                
//                 <Button
//                   variant="contained"
//                   sx={{ mt: 2 }}
//                   disabled={
//                     isSigning ||
//                     !termsAccepted ||
//                     (signatureType === "draw" ? !signatureData : !typedSignature) ||
//                     proposal?.status === "Signed"
//                   }
//                   onClick={handleCompleteProposal}
//                 >
//                   {isSigning ? "Saving..." : "Complete Proposal"}
//                 </Button>
//               </>
//             )}
//           </Box> */}
//           {/* SIGNATURE SECTION */}
// <Box ref={signatureRef} sx={{ mb: 4 }}>
//   <Typography variant="h6" sx={{ mb: 2 }}>
//     Sign & Accept
//   </Typography>
//   <Divider sx={{ mb: 2 }} />

//   {/* SHOW ONLY WHEN SIGNED */}
//   {proposal?.status === "Signed" ? (
//     <>
//       <Typography sx={{ mb: 2 }} color="text.secondary">
//         Signed on {new Date(proposal.signedAt).toLocaleString()}
//       </Typography>

//       <Typography fontWeight="bold">Signature:</Typography>

//       {/* IF SIGNATURE IS IMAGE */}
//       {proposal?.signature?.startsWith("data:image") ? (
//         <img
//           src={proposal.signature}
//           alt="signature"
//           style={{
//             maxWidth: 300,
//             border: "1px solid #ddd",
//             background: "white",
//             padding: 10,
//             marginTop: 10,
//           }}
//         />
//       ) : (
//         /* IF SIGNATURE IS TYPED */
//         <div
//           style={{
//             fontSize: 24,
//             fontFamily: "cursive",
//             border: "1px solid #ccc",
//             padding: 20,
//             background: "#f7f7f7",
//             marginTop: 10,
//             borderRadius: 6,
//           }}
//         >
//           {proposal.signature}
//         </div>
//       )}

//       <Button variant="contained" disabled sx={{ mt: 2, opacity: 0.7 }}>
//         Already Signed
//       </Button>
//     </>
//   ) : (
//     <>
//       {/* UNSIGNED — SHOW NOTHING */}
//       <Typography color="error" sx={{ mt: 2 }}>
//         Proposal is not signed yet.
//       </Typography>
//     </>
//   )}
// </Box>

//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ProposalPreviewDialog;

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/label";
import { ScrollArea } from "../../../components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";
import { X, CheckCircle2, ChevronDown } from "lucide-react";
import HTMLReactParser from "html-react-parser";


const ProposalPreviewDialog = ({ open, handleClose, proposal }) => {
  const [activeStep, setActiveStep] = useState("general");
  // Signature States
  const [signatureType, setSignatureType] = useState("draw");
  const [signatureData, setSignatureData] = useState(null);
  const [typedSignature, setTypedSignature] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const sigCanvas = useRef(null);
  
  // Check if proposal is signed
  const isSigned = proposal?.status === "Signed";
  
  // Determine enabled sections
  const steps = [
    { id: "introduction", label: "Introduction", enabled: proposal?.general?.introductionEnabled },
    { id: "terms", label: "Terms & Conditions", enabled: proposal?.general?.termsEnabled },
    { id: "services", label: "Services", enabled: proposal?.general?.servicesEnabled },
    { id: "payments", label: "Payments", enabled: proposal?.general?.paymentsEnabled },
    { id: "signature", label: "Sign & Accept", enabled: true },
  ].filter(s => s.enabled);

  const introRef = useRef(null);
  const termsRef = useRef(null);
  const servicesRef = useRef(null);
  const paymentsRef = useRef(null);
  const signatureRef = useRef(null);
  const refMap = {
    introduction: introRef,
    terms: termsRef,
    services: servicesRef,
    payments: paymentsRef,
    signature: signatureRef,
  };

  const handleStepClick = (id) => {
    const sectionRef = refMap[id];
    if (sectionRef?.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setActiveStep(id);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;

    for (let step of steps) {
      const stepRef = refMap[step.id];
      if (stepRef?.current) {
        const offsetTop = stepRef.current.offsetTop;
        if (scrollTop + 50 >= offsetTop) {
          setActiveStep(step.id);
        }
      }
    }
  };

 

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle>
            {proposal?.general?.proposalName || "Proposal"}
          </DialogTitle>
          
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDE MENU */}
          <div className="w-72 border-r bg-gray-50/40">
            <div className="p-2">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className={`
                    w-full text-left px-3 py-2 rounded-md transition-colors
                    flex items-center gap-2
                    ${activeStep === step.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                    }
                    ${isSigned && "text-green-600"}
                  `}
                >
                  {isSigned && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  <span>{step.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* ✅ INTRODUCTION */}
              {proposal?.general?.introductionEnabled && (
                <div ref={introRef} className="space-y-3">
                  <h2 className="text-xl font-semibold">
                    {proposal?.introduction?.title || "Introduction"}
                  </h2>
                  <div className="prose max-w-none">
                    {HTMLReactParser(proposal?.introduction?.description || "")}
                  </div>
                  <hr className="my-4" />
                </div>
              )}

              {/* ✅ TERMS */}
              {proposal?.general?.termsEnabled && (
                <div ref={termsRef} className="space-y-3">
                  <h2 className="text-xl font-semibold">Terms & Conditions</h2>
                  <div className="prose max-w-none">
                    {HTMLReactParser(proposal?.terms?.description || "")}
                  </div>
                  <hr className="my-4" />
                </div>
              )}

              {/* ✅ SERVICES - ITEMIZED */}
              {proposal?.general?.servicesEnabled && proposal?.services?.option === "services" && (
                <div ref={servicesRef} className="space-y-3">
                  <h2 className="text-xl font-semibold mb-4">Services</h2>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] bg-gray-50 p-3 font-semibold text-sm">
                      <div>Service</div>
                      <div className="text-right">Rate</div>
                      <div className="text-right">Qty</div>
                      <div className="text-right">Tax</div>
                      <div className="text-right">Amount</div>
                    </div>

                    {proposal?.services?.itemizedData?.lineItems?.map((item, i) => {
                      const rate = Number(item.rate || 0);
                      const qty = Number(item.quantity || 1);
                      const taxRate = proposal?.services?.itemizedData?.taxRate || 0;

                      const base = rate * qty;
                      const tax = item.tax ? (base * taxRate) / 100 : 0;
                      const total = base + tax;

                      return (
                        <div key={i} className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] border-t p-3 text-sm">
                          <div>
                            <div className="font-medium">{item.productorService}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                          <div className="text-right">${rate.toFixed(2)}</div>
                          <div className="text-right">{qty}</div>
                          <div className="text-right">${tax.toFixed(2)}</div>
                          <div className="text-right">${total.toFixed(2)}</div>
                        </div>
                      );
                    })}

                    <div className="border-t p-3 flex justify-end font-semibold">
                      Total: ${proposal?.services?.itemizedData?.totalAmount?.toFixed(2)}
                    </div>
                  </div>

                  <hr className="my-4" />
                </div>
              )}

              {/* ✅ SERVICES - INVOICE MODE */}
              {proposal?.general?.servicesEnabled && proposal?.services?.option === "invoice" && (
                <div ref={servicesRef} className="space-y-3">
                  <h2 className="text-xl font-semibold mb-4">Invoice</h2>

                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold mb-1">Amount</div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-1">Invoice will be issued</div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        {proposal?.services?.invoices?.[0]?.issueinvoice || "N/A"}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold mb-1">Description</div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        {proposal?.services?.invoices?.[0]?.description || "N/A"}
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="invoice-details">
                      <AccordionTrigger className="font-semibold">
                        Invoice details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="border rounded-lg overflow-hidden">
                          <div className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] bg-gray-50 p-3 font-semibold text-sm">
                            <div>Service</div>
                            <div className="text-right">Rate</div>
                            <div className="text-right">Qty</div>
                            <div className="text-right">Tax</div>
                            <div className="text-right">Amount</div>
                          </div>

                          {proposal?.services?.invoices?.[0]?.lineItems?.map((item, i) => {
                            const rate = Number(item.rate || 0);
                            const qty = Number(item.quantity || 1);
                            const taxRate = proposal?.services?.invoices?.[0]?.taxRate || 0;

                            const base = rate * qty;
                            const tax = item.tax ? (base * taxRate) / 100 : 0;
                            const total = base + tax;

                            return (
                              <div key={i} className="grid grid-cols-[3fr,1fr,1fr,1fr,1fr] border-t p-3 text-sm">
                                <div>
                                  <div className="font-medium">{item.productorService}</div>
                                  <div className="text-xs text-gray-500">{item.description}</div>
                                </div>
                                <div className="text-right">${rate.toFixed(2)}</div>
                                <div className="text-right">{qty}</div>
                                <div className="text-right">${tax.toFixed(2)}</div>
                                <div className="text-right">${total.toFixed(2)}</div>
                              </div>
                            );
                          })}

                          <div className="border-t p-3 flex justify-end font-semibold">
                            Total: ${proposal?.services?.invoices?.[0]?.totalAmount?.toFixed(2)}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <hr className="my-4" />
                </div>
              )}

              {/* ✅ PAYMENTS */}
              {proposal?.general?.paymentsEnabled && (
                <div ref={paymentsRef} className="space-y-3">
                  <h2 className="text-xl font-semibold">Payments</h2>
                  <div className="space-y-1">
                    <div><strong>Method:</strong> {proposal?.payments?.method}</div>
                    <div><strong>Amount:</strong> ${proposal?.payments?.amount}</div>
                  </div>
                  <hr className="my-4" />
                </div>
              )}

              {/* ✅ SIGNATURE SECTION */}
              <div ref={signatureRef} className="space-y-4">
                <h2 className="text-xl font-semibold">Sign & Accept</h2>
                <hr />

                {proposal?.status === "Signed" ? (
                  <>
                    <div className="text-gray-500">
                      Signed on {new Date(proposal.signedAt).toLocaleString()}
                    </div>

                    <div className="font-semibold">Signature:</div>

                    {proposal?.signature?.startsWith("data:image") ? (
                      <img
                        src={proposal.signature}
                        alt="signature"
                        className="max-w-sm border bg-white p-3 rounded"
                      />
                    ) : (
                      <div className="text-2xl font-cursive border bg-gray-50 p-5 rounded-md">
                        {proposal.signature}
                      </div>
                    )}

                    <Button disabled className="opacity-70">
                      Already Signed
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-red-500">
                      Proposal is not signed yet.
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalPreviewDialog;