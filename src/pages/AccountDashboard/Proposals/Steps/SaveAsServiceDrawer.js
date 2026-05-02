

// import React, { useState, useEffect } from 'react';
// import {
//   Drawer,
//   Box,
//   Typography,
//   TextField,
//   FormControlLabel,
//   Switch,
//   Button,
//   Autocomplete,
//   useTheme,
//   useMediaQuery,
//   IconButton,
// } from '@mui/material';
// import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
// import { toast } from 'react-toastify';
// import { templateAPI } from '../../../../services/api'; // adjust path to your api.js

// const SaveAsServiceDrawer = ({
//   open,
//   onClose,
//   selectedRowData,
//   categoryOptions = [],
//   onServiceCreated,
//   onCategoryCreated,
// }) => {
//   const theme = useTheme();
//   const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

//   const [formData, setFormData] = useState({
//     serviceName: '',
//     description: '',
//     rate: '',
//     rateType: null,
//     tax: false,
//     category: null,
//   });

//   const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCategoryLoading, setIsCategoryLoading] = useState(false);

//   const rateTypeOptions = [
//     { label: "Item", value: "item" },
//     { label: "Hour", value: "hour" },
//   ];

//   useEffect(() => {
//     if (selectedRowData && open) {
//       setFormData({
//         serviceName: selectedRowData.productorService || '',
//         description: selectedRowData.description || '',
//         rate: selectedRowData.rate || '',
//         rateType: rateTypeOptions[0],
//         tax: selectedRowData.tax || false,
//         category: null,
//       });
//     }
//   }, [selectedRowData, open]);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleRateTypeChange = (event, newValue) => handleInputChange('rateType', newValue);
//   const handleCategoryChange = (event, newValue) => handleInputChange('category', newValue);
//   const handleTaxChange = (event) => handleInputChange('tax', event.target.checked);

//   const handleCategoryFormOpen = () => setIsCategoryFormOpen(true);
//   const handleCategoryFormClose = () => {
//     setIsCategoryFormOpen(false);
//     setNewCategoryName('');
//   };

//   const handleCreateCategory = async () => {
//     if (!newCategoryName.trim()) {
//       toast.error('Category name is required');
//       return;
//     }

//     setIsCategoryLoading(true);
//     try {
//       const response = await templateAPI.createCategory({ categoryName: newCategoryName.trim() });
//       toast.success('Category created successfully');
//       if (onCategoryCreated) onCategoryCreated(response.data?.category || { categoryName: newCategoryName });
//       handleCategoryFormClose();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to create category');
//     } finally {
//       setIsCategoryLoading(false);
//     }
//   };

//   const handleSaveService = async () => {
//     if (!formData.serviceName.trim()) {
//       toast.error('Service name is required');
//       return;
//     }

//     if (!formData.rate || parseFloat(formData.rate) <= 0) {
//       toast.error('Valid rate is required');
//       return;
//     }

//     if (!formData.rateType) {
//       toast.error('Rate type is required');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const serviceData = {
//         serviceName: formData.serviceName.trim(),
//         description: formData.description.trim(),
//         rate: formData.rate,
//         ratetype: formData.rateType.value,
//         tax: formData.tax,
//         category: formData.category?.value || null,
//         active: true,
//       };

//       const response = await templateAPI.createServiceTemplate(serviceData);
//       toast.success('Service Template created successfully');
//       if (onServiceCreated) onServiceCreated(response.data?.serviceTemplate || serviceData);

//       setFormData({
//         serviceName: '',
//         description: '',
//         rate: '',
//         rateType: null,
//         tax: false,
//         category: null,
//       });
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to create service');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDrawerClose = () => {
//     setFormData({
//       serviceName: '',
//       description: '',
//       rate: '',
//       rateType: null,
//       tax: false,
//       category: null,
//     });
//     onClose();
//   };

//   return (
//     <>
//       {/* Service Drawer */}
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={handleDrawerClose}
//         PaperProps={{
//           sx: { borderRadius: isSmallScreen ? 0 : '10px 0 0 10px', width: isSmallScreen ? '100%' : 650 },
//         }}
//       >
//         <Box sx={{ p: 0 }}>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
//             <Typography variant="h6">Create Service</Typography>
//             <IconButton onClick={handleDrawerClose} disabled={isLoading}><CloseIcon /></IconButton>
//           </Box>

//           <Box sx={{ p: 2 }}>
//             <TextField
//               fullWidth label="Service Name" size="small" margin="normal"
//               value={formData.serviceName} onChange={(e) => handleInputChange('serviceName', e.target.value)}
//               required disabled={isLoading}
//             />
//             <TextField
//               fullWidth label="Description" size="small" margin="normal" multiline rows={3}
//               value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}
//               disabled={isLoading}
//             />
//             <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//               <TextField
//                 fullWidth label="Rate" size="small" type="number" inputProps={{ step: "0.01", min: "0" }}
//                 value={formData.rate} onChange={(e) => handleInputChange('rate', e.target.value)}
//                 required disabled={isLoading}
//               />
//               <Autocomplete
//                 size="small" fullWidth options={rateTypeOptions} getOptionLabel={opt => opt.label}
//                 value={formData.rateType} onChange={handleRateTypeChange}
//                 renderInput={(params) => <TextField {...params} label="Rate Type" required />}
//                 isOptionEqualToValue={(option, value) => option.value === value.value}
//                 disabled={isLoading}
//               />
//             </Box>

//             <FormControlLabel
//               control={<Switch checked={formData.tax} onChange={handleTaxChange} disabled={isLoading} />}
//               label="Taxable" sx={{ mt: 2 }}
//             />

//             <Box sx={{ mt: 3 }}>
//               <Typography variant="h6">Category</Typography>
//               <Autocomplete
//                 size="small" fullWidth options={categoryOptions} getOptionLabel={(option) => option.label}
//                 value={formData.category} onChange={handleCategoryChange}
//                 renderInput={(params) => <TextField {...params} label="Category Name" />}
//                 isOptionEqualToValue={(option, value) => option.value === value.value}
//                 disabled={isLoading}
//               />
//               <Button variant="contained" sx={{ mt: 2 }} onClick={handleCategoryFormOpen} disabled={isLoading}>
//                 Create category
//               </Button>
//             </Box>

//             <Box sx={{ pt: 4, display: 'flex', gap: 1 }}>
//               <Button variant="contained" sx={{ flex: 1 }} onClick={handleSaveService} disabled={isLoading}>
//                 {isLoading ? 'Saving...' : 'Save'}
//               </Button>
//               <Button variant="outlined" sx={{ flex: 1 }} onClick={handleDrawerClose} disabled={isLoading}>
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Category Drawer */}
//       <Drawer
//         anchor="right"
//         open={isCategoryFormOpen}
//         onClose={handleCategoryFormClose}
//         PaperProps={{ sx: { borderRadius: isSmallScreen ? 0 : '10px 0 0 10px', width: isSmallScreen ? '100%' : 650 } }}
//       >
//         <Box>
//           <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
//             <IconButton onClick={handleCategoryFormClose} disabled={isCategoryLoading} sx={{ mr: 1 }}>
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h6" sx={{ flex: 1 }}>Create Category</Typography>
//             <Box width={40} />
//           </Box>

//           <Box sx={{ p: 3 }}>
//             <TextField
//               fullWidth label="Category Name" size="small"
//               value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
//               required disabled={isCategoryLoading}
//             />
//           </Box>

//           <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
//             <Button variant="contained" sx={{ flex: 1 }} onClick={handleCreateCategory} disabled={isCategoryLoading}>
//               {isCategoryLoading ? 'Creating...' : 'Create'}
//             </Button>
//             <Button variant="outlined" sx={{ flex: 1 }} onClick={handleCategoryFormClose} disabled={isCategoryLoading}>
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default SaveAsServiceDrawer;

import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { templateAPI } from '../../../../services/api';
import { Input } from '../../../../components/ui/input';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';

const SaveAsServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  onServiceCreated,
  onCategoryCreated,
}) => {
  const [formData, setFormData] = useState({
    serviceName: '',
    description: '',
    rate: '',
    rateType: null,
    tax: false,
    category: null,
  });

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryoptions] = useState([]);

  // Fetch all categories
// Fetch all categories
const fetchCategories = async () => {
  try {
    const response = await templateAPI.getAllCategories();
    console.log("Categories response:", response.data);
    
    // Fix: Check for "category" instead of "categories"
    const categories = Array.isArray(response.data.category) 
      ? response.data.category 
      : response.data.category || response.data; // fallback to response.data if needed
    
    const formattedCategories = categories.map(category => ({
      value: category._id,
      label: category.categoryName || category.name || "Unnamed Category"
    }));
    
    setCategoryoptions(formattedCategories);
    console.log("Formatted categories:", formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  const rateTypeOptions = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  useEffect(() => {
    if (selectedRowData && open) {
      // Extract numeric value from rate (remove $ symbol if present)
      const rateValue = selectedRowData.rate ? selectedRowData.rate.replace('$', '') : '';
      
      setFormData({
        serviceName: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: rateValue,
        rateType: rateTypeOptions[0],
        tax: selectedRowData.tax || false,
        category: null,
      });
    }
  }, [selectedRowData, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRateTypeChange = (value) => {
    const selected = rateTypeOptions.find(opt => opt.value === value);
    handleInputChange('rateType', selected);
  };

  const handleCategoryChange = (value) => {
    const selected = categoryOptions.find(opt => opt.value === value);
    handleInputChange('category', selected);
  };

  const handleTaxChange = (checked) => {
    handleInputChange('tax', checked);
  };

  const handleCategoryFormOpen = () => setIsCategoryFormOpen(true);
  
  const handleCategoryFormClose = () => {
    setIsCategoryFormOpen(false);
    setNewCategoryName('');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsCategoryLoading(true);
    try {
      const response = await templateAPI.createCategory({ categoryName: newCategoryName.trim() });
      toast.success('Category created successfully');
      
      // Refresh categories list
      await fetchCategories();
      
      if (onCategoryCreated) onCategoryCreated(response.data?.category || { categoryName: newCategoryName });
      handleCategoryFormClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create category');
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleSaveService = async () => {
    if (!formData.serviceName.trim()) {
      toast.error('Service name is required');
      return;
    }

    if (!formData.rate || parseFloat(formData.rate) <= 0) {
      toast.error('Valid rate is required');
      return;
    }

    if (!formData.rateType) {
      toast.error('Rate type is required');
      return;
    }

    setIsLoading(true);
    try {
      const serviceData = {
        serviceName: formData.serviceName.trim(),
        description: formData.description.trim(),
        rate: formData.rate,
        ratetype: formData.rateType.value,
        tax: formData.tax,
        category: formData.category?.value || null,
        active: true,
      };

      const response = await templateAPI.createServiceTemplate(serviceData);
      toast.success('Service Template created successfully');
      if (onServiceCreated) onServiceCreated(response.data?.serviceTemplate || serviceData);

      setFormData({
        serviceName: '',
        description: '',
        rate: '',
        rateType: null,
        tax: false,
        category: null,
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create service');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrawerClose = () => {
    setFormData({
      serviceName: '',
      description: '',
      rate: '',
      rateType: null,
      tax: false,
      category: null,
    });
    onClose();
  };

  // Service Drawer Content
  const ServiceDrawerContent = () => (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <h2 className="text-base font-semibold text-foreground">Create Service</h2>
        <button 
          onClick={handleDrawerClose} 
          disabled={isLoading}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Service Name */}
        <div className="space-y-2">
          <Label className="text-foreground">
            Service Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={formData.serviceName}
            onChange={(e) => handleInputChange('serviceName', e.target.value)}
            placeholder="Enter service name"
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-foreground">Description</Label>
          <Textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter description"
            disabled={isLoading}
          />
        </div>

        {/* Rate and Rate Type */}
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
                min="0"
                value={formData.rate}
                onChange={(e) => handleInputChange('rate', e.target.value)}
                placeholder="0.00"
                className="pl-7"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">
              Rate Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.rateType?.value || ""}
              onValueChange={handleRateTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rate type" />
              </SelectTrigger>
              <SelectContent>
                {rateTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Taxable Switch */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="taxable" className="cursor-pointer">Taxable</Label>
          <Switch
            id="taxable"
            checked={formData.tax}
            onCheckedChange={handleTaxChange}
            disabled={isLoading}
          />
        </div>

        {/* Category Section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-foreground">Category</h3>
          
          <div className="space-y-2">
            <Select
              value={formData.category?.value || ""}
              onValueChange={handleCategoryChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground text-center">
                    No categories available
                  </div>
                ) : (
                  categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleCategoryFormOpen}
              disabled={isLoading}
              className="w-full"
            >
              Create category
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
        <button
          onClick={handleDrawerClose}
          disabled={isLoading}
          className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveService}
          disabled={isLoading}
          className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </>
  );

  // Category Drawer Content
  const CategoryDrawerContent = () => (
    <>
      <div className="flex items-center gap-2 px-5 py-4 border-b border-border shrink-0">
        <button 
          onClick={handleCategoryFormClose} 
          disabled={isCategoryLoading}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="text-base font-semibold text-foreground flex-1">Create Category</h2>
        <div className="w-9" />
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="space-y-2">
          <Label className="text-foreground">
            Category Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Enter category name"
            disabled={isCategoryLoading}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-border shrink-0">
        <button
          onClick={handleCategoryFormClose}
          disabled={isCategoryLoading}
          className="h-9 px-4 text-sm font-medium border border-border rounded-lg text-foreground hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateCategory}
          disabled={isCategoryLoading}
          className="h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isCategoryLoading && <Loader2 className="h-3 w-3 animate-spin" />}
          {isCategoryLoading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </>
  );

  if (!open && !isCategoryFormOpen) return null;

  return (
    <>
      {/* Service Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleDrawerClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[650px] bg-background shadow-xl flex flex-col">
            <ServiceDrawerContent />
          </div>
        </div>
      )}

      {/* Category Drawer */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleCategoryFormClose} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] bg-background shadow-xl flex flex-col">
            <CategoryDrawerContent />
          </div>
        </div>
      )}
    </>
  );
};

export default SaveAsServiceDrawer;