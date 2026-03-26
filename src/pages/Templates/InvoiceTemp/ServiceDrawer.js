import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  InputLabel,
  Switch,
  FormControlLabel,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const ServiceDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  categoryoptions,
  onCreateCategory,
  onSave,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRateOption, setSelectedRateOption] = useState(null);

  const options = [
    { label: "Item", value: "item" },
    { label: "Hour", value: "hour" },
  ];

  const handleRateTypeChange = (event, newValue) => {
    setSelectedRateOption(newValue);
    setSelectedRowData({
      ...selectedRowData,
      ratetype: newValue,
    });
  };

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    setSelectedRowData({
      ...selectedRowData,
      category: newValue,
    });
  };

  const handleServiceSwitch = (checked) => {
    setSelectedRowData({
      ...selectedRowData,
      tax: checked,
    });
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: isSmallScreen ? "0" : "10px 0 0 10px",
          width: isSmallScreen ? "100%" : "650px",
          zIndex: 1000,
        },
      }}
    >
      <Box
        role="presentation"
        sx={{ borderRadius: isSmallScreen ? "0" : "15px" }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid grey",
            }}
          >
            <Typography variant="h6">Create Service</Typography>
            <RxCross2
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </Box>
        </Box>
        <form style={{ margin: "15px" }}>
          <Box>
            <Box>
              <InputLabel sx={{ color: "black" }}>Service Name</InputLabel>
              <TextField
                fullWidth
                name="ServiceName"
                placeholder="Service Name"
                size="small"
                margin="normal"
                value={selectedRowData?.productName || ""}
                onChange={(e) =>
                  setSelectedRowData({
                    ...selectedRowData,
                    productName: e.target.value,
                  })
                }
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <InputLabel sx={{ color: "black" }}>Description</InputLabel>
              <TextField
                fullWidth
                name="Description"
                placeholder="Description"
                size="small"
                margin="normal"
                multiline
                rows={3}
                value={selectedRowData?.description || ""}
                onChange={(e) =>
                  setSelectedRowData({
                    ...selectedRowData,
                    description: e.target.value,
                  })
                }
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box width="50%">
                <Typography sx={{ color: "black" }}>Rate</Typography>
                <TextField
                  fullWidth
                  name="Rate"
                  placeholder="Rate"
                  size="small"
                  sx={{ mt: 1 }}
                  value={selectedRowData?.rate || ""}
                  onChange={(e) =>
                    setSelectedRowData({
                      ...selectedRowData,
                      rate: e.target.value,
                    })
                  }
                />
              </Box>

              <Box width="50%">
                <Typography sx={{ color: "black" }}>Rate Type</Typography>
                <Autocomplete
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  options={options}
                  getOptionLabel={(option) => option?.label || ""}
                  value={selectedRateOption}
                  onChange={handleRateTypeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select Rate Type"
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value?.value
                  }
                />
              </Box>
            </Box>

            <Box mt={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedRowData?.tax || false}
                    onChange={(event) => handleServiceSwitch(event.target.checked)}
                    color="primary"
                  />
                }
                label={"Tax"}
              />
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                Category
              </Typography>
              <InputLabel sx={{ color: "black", mt: 1 }}>
                Category Name
              </InputLabel>
              <Autocomplete
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                options={categoryoptions}
                getOptionLabel={(option) => option.label}
                value={selectedCategory}
                onChange={handleCategoryChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Category Name"
                    variant="outlined"
                  />
                )}
                clearOnEscape
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
              />
            </Box>

            <Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={onCreateCategory}
                sx={{
                  borderRadius: "15px",
                  mt: 2,
                }}
              >
                + Create new category
              </Button>
            </Box>

            <Box
              sx={{
                pt: 5,
                display: "flex",
                alignItems: "center",
                gap: 5,
                ml: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
               
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default ServiceDrawer;