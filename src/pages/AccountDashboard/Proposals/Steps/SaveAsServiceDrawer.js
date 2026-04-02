

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