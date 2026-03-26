


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

//   // API endpoints
//   const SERVICE_API = process.env.REACT_APP_SERVICE_API || 'https://www.snptaxes.com';
//   const CATEGORY_API = process.env.REACT_APP_CATEGORY_API || 'https://www.snptaxes.com';

//   // Local state for form data
//   const [formData, setFormData] = useState({
//     serviceName: '',
//     description: '',
//     rate: '',
//     rateType: null,
//     tax: false,
//     category: null,
//   });

//   // State for category creation
//   const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCategoryLoading, setIsCategoryLoading] = useState(false);
 
//   // Rate type options
//   const rateTypeOptions = [
//     { label: "Item", value: "item" },
//     { label: "Hour", value: "hour" },
//   ];

//   // Initialize form data when selectedRowData changes or drawer opens
//   useEffect(() => {
//     if (selectedRowData && open) {
//       setFormData({
//         serviceName: selectedRowData.productorService || '',
//         description: selectedRowData.description || '',
//         rate: selectedRowData.rate || '',
//         rateType: rateTypeOptions.find(opt => opt.value === 'fixed') || rateTypeOptions[0],
//         tax: selectedRowData.tax || false,
//         category: null,
//       });
//     }
//   }, [selectedRowData, open]);

//   // Handle form field changes
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Handle rate type change
//   const handleRateTypeChange = (event, newValue) => {
//     handleInputChange('rateType', newValue);
//   };

//   // Handle category change
//   const handleCategoryChange = (event, newValue) => {
//     handleInputChange('category', newValue);
//   };

//   // Handle tax switch change
//   const handleTaxChange = (event) => {
//     handleInputChange('tax', event.target.checked);
//   };

//   // Category form handlers
//   const handleCategoryFormOpen = () => {
//     setIsCategoryFormOpen(true);
//   };

//   const handleCategoryFormClose = () => {
//     setIsCategoryFormOpen(false);
//     setNewCategoryName('');
//   };

//   // Create Service Template API function
//   const createServiceTemplate = async (serviceData) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       serviceName: serviceData.serviceName,
//       description: serviceData.description,
//       rate: serviceData.rate,
//       ratetype: serviceData.rateType?.value,
//       tax: serviceData.tax,
//       category: serviceData.category ? serviceData.category.value : null,
//       active: "true",
//     });

//     console.log("Creating service template:", raw);

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     try {
//       const url = `${SERVICE_API}/workflow/services/servicetemplate`;
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
      
//       console.log("Service creation result:", result);

//       if (result && result.message === "ServiceTemplate created successfully") {
//         toast.success("Service Template created successfully");
        
//         if (onServiceCreated) {
//           onServiceCreated(result.serviceTemplate || serviceData);
//         }
        
//         return { success: true, data: result };
//       } else {
//         throw new Error(result.message || "Failed to create Service Template");
//       }
//     } catch (error) {
//       console.error("Error creating service template:", error);
//       throw error;
//     }
//   };

//   // Create Category API function
//   const createCategory = async (categoryName) => {
//     const myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const raw = JSON.stringify({
//       categoryName: categoryName,
//     });

//     const requestOptions = {
//       method: "POST",
//       headers: myHeaders,
//       body: raw,
//       redirect: "follow",
//     };

//     try {
//       const url = `${CATEGORY_API}/workflow/category/newcategory`;
//       const response = await fetch(url, requestOptions);
//       const result = await response.json();
      
//       console.log("Category creation result:", result);

//       if (result && result.message === "Category created successfully") {
//         toast.success("Category created successfully");
        
//         if (onCategoryCreated) {
//           onCategoryCreated(result.category || { categoryName });
//         }
        
//         return { success: true, data: result };
//       } else {
//         throw new Error(result.message || "Failed to create Category");
//       }
//     } catch (error) {
//       console.error("Error creating category:", error);
//       throw error;
//     }
//   };

//   // Handle create category
//   const handleCreateCategory = async () => {
//     if (!newCategoryName.trim()) {
//       toast.error('Category name is required');
//       return;
//     }

//     setIsCategoryLoading(true);
//     try {
//       await createCategory(newCategoryName.trim());
//       handleCategoryFormClose();
//     } catch (error) {
//       toast.error(error.message || 'Failed to create category');
//     } finally {
//       setIsCategoryLoading(false);
//     }
//   };

//   // Handle save service
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
//         rateType: formData.rateType,
//         tax: formData.tax,
//         category: formData.category,
//       };

//       await createServiceTemplate(serviceData);
      
//       // Reset form and close drawer
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
//       toast.error(error.message || 'Failed to create service');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle drawer close
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
//       {/* Main Service Drawer */}
//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={handleDrawerClose}
//         PaperProps={{
//           sx: {
//             borderRadius: isSmallScreen ? 0 : '10px 0 0 10px',
//             width: isSmallScreen ? '100%' : 650,
//           },
//         }}
//       >
//         <Box sx={{ p: 0 }}>
//           <Box sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center', 
//             p: 2, 
//             borderBottom: `1px solid ${theme.palette.divider}` 
//           }}>
//             <Typography variant="h6" component="h2">
//               Create Service
//             </Typography>
//             <IconButton 
//               onClick={handleDrawerClose}
//               disabled={isLoading}
//               size="small"
//             >
//               <CloseIcon />
//             </IconButton>
//           </Box>
          
//           <Box component="form" sx={{ p: 2 }}>
//             <TextField
//               fullWidth
//               label="Service Name"
//               placeholder="Service Name"
//               size="small"
//               margin="normal"
//               value={formData.serviceName}
//               onChange={(e) => handleInputChange('serviceName', e.target.value)}
//               required
//               disabled={isLoading}
//             />
            
//             <TextField
//               fullWidth
//               label="Description"
//               placeholder="Description"
//               size="small"
//               margin="normal"
//               value={formData.description}
//               onChange={(e) => handleInputChange('description', e.target.value)}
//               multiline
//               rows={3}
//               disabled={isLoading}
//             />

//             <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//               <TextField
//                 fullWidth
//                 label="Rate"
//                 placeholder="0.00"
//                 size="small"
//                 value={formData.rate}
//                 onChange={(e) => handleInputChange('rate', e.target.value)}
//                 type="number"
//                 inputProps={{ step: "0.01", min: "0" }}
//                 required
//                 disabled={isLoading}
//               />

//               <Autocomplete
//                 size="small"
//                 fullWidth
//                 options={rateTypeOptions}
//                 getOptionLabel={(option) => option?.label || ""}
//                 value={formData.rateType}
//                 onChange={handleRateTypeChange}
//                 renderInput={(params) => (
//                   <TextField 
//                     {...params} 
//                     label="Rate Type"
//                     required
//                   />
//                 )}
//                 isOptionEqualToValue={(option, value) => option.value === value.value}
//                 disabled={isLoading}
//               />
//             </Box>

//             <FormControlLabel
//               control={
//                 <Switch
//                   checked={formData.tax}
//                   onChange={handleTaxChange}
//                   color="primary"
//                   disabled={isLoading}
//                 />
//               }
//               label="Taxable"
//               sx={{ mt: 2 }}
//             />

//             <Box sx={{ mt: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Category
//               </Typography>
              
//               <Autocomplete
//                 size="small"
//                 fullWidth
//                 options={categoryOptions}
//                 getOptionLabel={(option) => option.label}
//                 value={formData.category}
//                 onChange={handleCategoryChange}
//                 renderInput={(params) => (
//                   <TextField {...params} label="Category Name" />
//                 )}
//                 isOptionEqualToValue={(option, value) => option.value === value.value}
//                 disabled={isLoading}
//               />
              
//               <Button 
//                 variant="contained" 
//                 onClick={handleCategoryFormOpen}
//                 disabled={isLoading}
//                 sx={{ mt: 2 }}
//               >
//                 Create category
//               </Button>
//             </Box>

//             <Box sx={{ pt: 4, display: 'flex', gap: 1 }}>
//               <Button 
//                 variant="contained" 
//                 onClick={handleSaveService}
//                 disabled={isLoading}
//                 sx={{ flex: 1 }}
//               >
//                 {isLoading ? 'Saving...' : 'Save'}
//               </Button>
//               <Button 
//                 variant="outlined" 
//                 onClick={handleDrawerClose}
//                 disabled={isLoading}
//                 sx={{ flex: 1 }}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Drawer>

//       {/* Category Creation Drawer */}
//       <Drawer
//         anchor="right"
//         open={isCategoryFormOpen}
//         onClose={handleCategoryFormClose}
//         PaperProps={{
//           sx: {
//             borderRadius: isSmallScreen ? 0 : '10px 0 0 10px',
//             width: isSmallScreen ? '100%' : 650,
//           },
//         }}
//       >
//         <Box>
//           <Box sx={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             p: 2, 
//             borderBottom: `1px solid ${theme.palette.divider}` 
//           }}>
//             <IconButton 
//               onClick={handleCategoryFormClose}
//               disabled={isCategoryLoading}
//               sx={{ mr: 1 }}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h6" component="h2" sx={{ flex: 1 }}>
//               Create Category
//             </Typography>
//             <Box width={40} /> {/* Spacer for alignment */}
//           </Box>
          
//           <Box sx={{ p: 3 }}>
//             <TextField 
//               fullWidth 
//               label="Category Name"
//               placeholder="Category Name" 
//               size="small"
//               value={newCategoryName}
//               onChange={(e) => setNewCategoryName(e.target.value)}
//               required
//               disabled={isCategoryLoading}
//             />
//           </Box>
          
//           <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
//             <Button 
//               variant="contained" 
//               onClick={handleCreateCategory}
//               disabled={isCategoryLoading}
//               sx={{ flex: 1 }}
//             >
//               {isCategoryLoading ? 'Creating...' : 'Create'}
//             </Button>
//             <Button 
//               variant="outlined" 
//               onClick={handleCategoryFormClose}
//               disabled={isCategoryLoading}
//               sx={{ flex: 1 }}
//             >
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
import {
  Drawer,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Autocomplete,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { templateAPI } from '../../../../services/api'; // adjust path to your api.js

const SaveAsServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  categoryOptions = [],
  onServiceCreated,
  onCategoryCreated,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const rateTypeOptions = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  useEffect(() => {
    if (selectedRowData && open) {
      setFormData({
        serviceName: selectedRowData.productorService || '',
        description: selectedRowData.description || '',
        rate: selectedRowData.rate || '',
        rateType: rateTypeOptions[0],
        tax: selectedRowData.tax || false,
        category: null,
      });
    }
  }, [selectedRowData, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRateTypeChange = (event, newValue) => handleInputChange('rateType', newValue);
  const handleCategoryChange = (event, newValue) => handleInputChange('category', newValue);
  const handleTaxChange = (event) => handleInputChange('tax', event.target.checked);

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

  return (
    <>
      {/* Service Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: { borderRadius: isSmallScreen ? 0 : '10px 0 0 10px', width: isSmallScreen ? '100%' : 650 },
        }}
      >
        <Box sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6">Create Service</Typography>
            <IconButton onClick={handleDrawerClose} disabled={isLoading}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth label="Service Name" size="small" margin="normal"
              value={formData.serviceName} onChange={(e) => handleInputChange('serviceName', e.target.value)}
              required disabled={isLoading}
            />
            <TextField
              fullWidth label="Description" size="small" margin="normal" multiline rows={3}
              value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={isLoading}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                fullWidth label="Rate" size="small" type="number" inputProps={{ step: "0.01", min: "0" }}
                value={formData.rate} onChange={(e) => handleInputChange('rate', e.target.value)}
                required disabled={isLoading}
              />
              <Autocomplete
                size="small" fullWidth options={rateTypeOptions} getOptionLabel={opt => opt.label}
                value={formData.rateType} onChange={handleRateTypeChange}
                renderInput={(params) => <TextField {...params} label="Rate Type" required />}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={isLoading}
              />
            </Box>

            <FormControlLabel
              control={<Switch checked={formData.tax} onChange={handleTaxChange} disabled={isLoading} />}
              label="Taxable" sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Category</Typography>
              <Autocomplete
                size="small" fullWidth options={categoryOptions} getOptionLabel={(option) => option.label}
                value={formData.category} onChange={handleCategoryChange}
                renderInput={(params) => <TextField {...params} label="Category Name" />}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                disabled={isLoading}
              />
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleCategoryFormOpen} disabled={isLoading}>
                Create category
              </Button>
            </Box>

            <Box sx={{ pt: 4, display: 'flex', gap: 1 }}>
              <Button variant="contained" sx={{ flex: 1 }} onClick={handleSaveService} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outlined" sx={{ flex: 1 }} onClick={handleDrawerClose} disabled={isLoading}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Category Drawer */}
      <Drawer
        anchor="right"
        open={isCategoryFormOpen}
        onClose={handleCategoryFormClose}
        PaperProps={{ sx: { borderRadius: isSmallScreen ? 0 : '10px 0 0 10px', width: isSmallScreen ? '100%' : 650 } }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <IconButton onClick={handleCategoryFormClose} disabled={isCategoryLoading} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flex: 1 }}>Create Category</Typography>
            <Box width={40} />
          </Box>

          <Box sx={{ p: 3 }}>
            <TextField
              fullWidth label="Category Name" size="small"
              value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}
              required disabled={isCategoryLoading}
            />
          </Box>

          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" sx={{ flex: 1 }} onClick={handleCreateCategory} disabled={isCategoryLoading}>
              {isCategoryLoading ? 'Creating...' : 'Create'}
            </Button>
            <Button variant="outlined" sx={{ flex: 1 }} onClick={handleCategoryFormClose} disabled={isCategoryLoading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default SaveAsServiceDrawer;