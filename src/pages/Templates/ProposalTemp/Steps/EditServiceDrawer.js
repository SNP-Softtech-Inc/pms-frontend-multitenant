
// import React, { useState, useEffect } from 'react';
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   FormControlLabel,
//   Checkbox,
//   InputLabel,
//   IconButton,
//   Divider,
//   Alert
// } from '@mui/material';
// import { Close } from '@mui/icons-material';

// const EditServiceDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   setSelectedRowData,
//   onSave
// }) => {
//   const [formData, setFormData] = useState({
//     productorService: '',
//     description: '',
//     rate: '',
//     quantity: '',
//     tax: false,
//     isDiscount: false
//   });
//   const [errors, setErrors] = useState({});

//   // Initialize form data when selectedRowData changes
//   useEffect(() => {
//     if (selectedRowData) {
//       // Extract numeric value from rate (remove $ symbol)
//       const rateValue = selectedRowData.rate ? selectedRowData.rate.replace('$', '') : '0.00';
      
//       setFormData({
//         productorService: selectedRowData.productorService || '',
//         description: selectedRowData.description || '',
//         rate: rateValue,
//         quantity: selectedRowData.quantity || '1',
//         tax: selectedRowData.tax || false,
//         isDiscount: selectedRowData.isDiscount || false
//       });
//       setErrors({});
//     }
//   }, [selectedRowData]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.productorService.trim()) {
//       newErrors.productorService = 'Product/Service name is required';
//     }

//     const rateValue = parseFloat(formData.rate);
//     if (isNaN(rateValue) || rateValue < 0) {
//       newErrors.rate = 'Valid rate is required';
//     }

//     const quantityValue = parseFloat(formData.quantity);
//     if (isNaN(quantityValue) || quantityValue <= 0) {
//       newErrors.quantity = 'Valid quantity is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

// const handleSave = () => {
//   if (!validateForm()) {
//     return;
//   }

//   const rateValue = parseFloat(formData.rate) || 0;
//   const quantityValue = parseFloat(formData.quantity) || 0;
//   const amount = (rateValue * quantityValue).toFixed(2);

//   const updatedRowData = {
//     ...selectedRowData,
//     productorService: formData.productorService,
//     description: formData.description,
//     rate: `${rateValue.toFixed(2)}`,
//     quantity: formData.quantity.toString(),
//     tax: formData.tax,
//     isDiscount: formData.isDiscount,
//     amount: `${amount}`
//   };

//   console.log("Saving updated data:", updatedRowData);
  
//   // Pass the updated data directly to onSave
//   onSave(updatedRowData);
// };
//   const handleClose = () => {
//     setErrors({});
//     onClose();
//   };

//   const calculateAmount = () => {
//     const rateValue = parseFloat(formData.rate) || 0;
//     const qtyValue = parseFloat(formData.quantity) || 0;
//     return (rateValue * qtyValue).toFixed(2);
//   };

//   return (
//     <Drawer
//       anchor="right"
//       open={open}
//       onClose={handleClose}
//       sx={{
//         '& .MuiDrawer-paper': {
//           width: 400,
//           maxWidth: '90vw'
//         }
//       }}
//     >
//       <Box sx={{ p: 2 }}>
//         {/* Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h6">
//             Edit Line Item
//           </Typography>
//           <IconButton onClick={handleClose}>
//             <Close />
//           </IconButton>
//         </Box>

//         <Divider sx={{ mb: 3 }} />

//         {/* Form */}
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//           {/* Product/Service */}
//           <Box>
//             <InputLabel sx={{ color: 'black', mb: 1 }}>
//               Product or Service *
//             </InputLabel>
//             <TextField
//               fullWidth
//               size="small"
//               value={formData.productorService}
//               onChange={(e) => handleInputChange('productorService', e.target.value)}
//               placeholder="Enter product or service name"
//               error={!!errors.productorService}
//               helperText={errors.productorService}
//             />
//           </Box>

//           {/* Description */}
//           <Box>
//             <InputLabel sx={{ color: 'black', mb: 1 }}>
//               Description
//             </InputLabel>
//             <TextField
//               fullWidth
//               size="small"
//               multiline
//               rows={3}
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               placeholder="Enter description"
//             />
//           </Box>

//           {/* Rate and Quantity */}
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: 'black', mb: 1 }}>
//                 Rate *
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="number"
//                 step="0.01"
//                 value={formData.rate}
//                 onChange={(e) => handleInputChange('rate', e.target.value)}
//                 placeholder="0.00"
//                 error={!!errors.rate}
//                 helperText={errors.rate}
//                 InputProps={{
//                   startAdornment: <Typography sx={{ mr: 1, color: 'text.primary' }}>$</Typography>
//                 }}
//               />
//             </Box>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: 'black', mb: 1 }}>
//                 Quantity *
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 size="small"
//                 type="number"
//                 step="1"
//                 value={formData.quantity}
//                 onChange={(e) => handleInputChange('quantity', e.target.value)}
//                 placeholder="1"
//                 error={!!errors.quantity}
//                 helperText={errors.quantity}
//               />
//             </Box>
//           </Box>

//           {/* Calculated Amount Display */}
//           <Box sx={{ 
//             p: 2, 
//             backgroundColor: '#f5f5f5', 
//             borderRadius: 1,
//             border: '1px solid #e0e0e0'
//           }}>
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//               Calculated Amount
//             </Typography>
//             <Typography variant="h6" color="primary">
//               ${calculateAmount()}
//             </Typography>
//           </Box>

//           {/* Tax Checkbox */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={formData.tax}
//                 onChange={(e) => handleInputChange('tax', e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="Taxable"
//           />

//           {/* Discount Checkbox */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={formData.isDiscount}
//                 onChange={(e) => handleInputChange('isDiscount', e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="This is a discount"
//           />

//           {/* Validation Alert */}
//           {Object.keys(errors).length > 0 && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               Please fix the errors above before saving.
//             </Alert>
//           )}
//         </Box>

//         {/* Action Buttons */}
//         <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
//           <Button
//             variant="outlined"
//             onClick={handleClose}
//             fullWidth
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleSave}
//             fullWidth
//           >
//             Save Changes
//           </Button>
//         </Box>
//       </Box>
//     </Drawer>
//   );
// };

// export default EditServiceDrawer;

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../../../components/ui/alert';

const EditServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  onSave
}) => {
  const [formData, setFormData] = useState({
    productorService: '',
    description: '',
    rate: '',
    quantity: '',
    tax: false,
    isDiscount: false
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when selectedRowData changes
  useEffect(() => {
    if (selectedRowData) {
      // Extract numeric value from rate (remove $ symbol)
      const rateValue = selectedRowData.rate ? selectedRowData.rate.replace('$', '') : '0.00';
      
      setFormData({
        productorService: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: rateValue,
        quantity: selectedRowData.quantity || '1',
        tax: selectedRowData.tax || false,
        isDiscount: selectedRowData.isDiscount || false
      });
      setErrors({});
    }
  }, [selectedRowData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productorService.trim()) {
      newErrors.productorService = 'Product/Service name is required';
    }

    const rateValue = parseFloat(formData.rate);
    if (isNaN(rateValue) || rateValue < 0) {
      newErrors.rate = 'Valid rate is required';
    }

    const quantityValue = parseFloat(formData.quantity);
    if (isNaN(quantityValue) || quantityValue <= 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const rateValue = parseFloat(formData.rate) || 0;
    const quantityValue = parseFloat(formData.quantity) || 0;
    const amount = (rateValue * quantityValue).toFixed(2);

    const updatedRowData = {
      ...selectedRowData,
      productorService: formData.productorService,
      description: formData.description,
      rate: `${rateValue.toFixed(2)}`,
      quantity: formData.quantity.toString(),
      tax: formData.tax,
      isDiscount: formData.isDiscount,
      amount: `${amount}`
    };

    console.log("Saving updated data:", updatedRowData);
    
    // Pass the updated data directly to onSave
    onSave(updatedRowData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const calculateAmount = () => {
    const rateValue = parseFloat(formData.rate) || 0;
    const qtyValue = parseFloat(formData.quantity) || 0;
    return (rateValue * qtyValue).toFixed(2);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            Edit Line Item
          </h2>
          <button 
            onClick={handleClose} 
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Product/Service */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Product or Service <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.productorService}
              onChange={(e) => handleInputChange('productorService', e.target.value)}
              placeholder="Enter product or service name"
              className={errors.productorService ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.productorService && (
              <p className="text-sm text-destructive">{errors.productorService}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-foreground">
              Description
            </Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>

          {/* Rate and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground">
                Rate <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.rate}
                  onChange={(e) => handleInputChange('rate', e.target.value)}
                  placeholder="0.00"
                  className={`pl-7 ${errors.rate ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
              </div>
              {errors.rate && (
                <p className="text-sm text-destructive">{errors.rate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                step="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="1"
                className={errors.quantity ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Calculated Amount Display */}
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-1">
              Calculated Amount
            </p>
            <p className="text-xl font-semibold text-primary">
              ${calculateAmount()}
            </p>
          </div>

          {/* Tax Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tax"
              checked={formData.tax}
              onCheckedChange={(checked) => handleInputChange('tax', checked)}
            />
            <Label htmlFor="tax" className="text-sm font-normal cursor-pointer">
              Taxable
            </Label>
          </div>

          {/* Discount Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDiscount"
              checked={formData.isDiscount}
              onCheckedChange={(checked) => handleInputChange('isDiscount', checked)}
            />
            <Label htmlFor="isDiscount" className="text-sm font-normal cursor-pointer">
              This is a discount
            </Label>
          </div>

          {/* Validation Alert */}
          {Object.keys(errors).length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                Please fix the errors above before saving.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
          <button
            onClick={handleClose}
            className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServiceDrawer;