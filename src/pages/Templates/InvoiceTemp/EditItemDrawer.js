import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const EditItemDrawer = ({
  open,
  onClose,
  selectedRowData,
  setSelectedRowData,
  onSave,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    const rate = parseFloat(selectedRowData?.rate?.replace("$", "")) || 0;
    const qty = selectedRowData?.qty || 0;
    const calculatedAmount = rate * qty;
    setTotalAmount(`$${calculatedAmount.toFixed(2)}`);
  }, [selectedRowData?.rate, selectedRowData?.qty]);

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
            <Typography variant="h6">Edit Item</Typography>
            <RxCross2
              onClick={onClose}
              style={{ cursor: "pointer" }}
            />
          </Box>
          <Box p={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Product or service
            </Typography>
            <TextField
              size="small"
              margin="normal"
              value={selectedRowData?.productName || ""}
              fullWidth
              onChange={(e) =>
                setSelectedRowData({
                  ...selectedRowData,
                  productName: e.target.value,
                })
              }
            />

            <Box sx={{ mt: 2 }}>
              <Typography>Description</Typography>
              <TextField
                size="small"
                margin="normal"
                value={selectedRowData?.description || ""}
                fullWidth
                multiline
                rows={3}
                onChange={(e) =>
                  setSelectedRowData({
                    ...selectedRowData,
                    description: e.target.value,
                  })
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                mt: 2,
              }}
            >
              <Box flex={1}>
                <Typography>Rate</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  value={selectedRowData?.rate || ""}
                  fullWidth
                  onChange={(e) =>
                    setSelectedRowData({
                      ...selectedRowData,
                      rate: e.target.value,
                    })
                  }
                />
              </Box>
              <Box flex={1}>
                <Typography>QTY</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  value={selectedRowData?.qty || ""}
                  fullWidth
                  onChange={(e) =>
                    setSelectedRowData({
                      ...selectedRowData,
                      qty: e.target.value,
                    })
                  }
                />
              </Box>
              <Box flex={1}>
                <Typography>Amount</Typography>
                <TextField
                  size="small"
                  margin="normal"
                  fullWidth
                  disabled
                  value={totalAmount}
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

            <Box
              sx={{ display: "flex", alignItems: "center", gap: 2, mt: 3 }}
            >
              <Button
                variant="contained"
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
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditItemDrawer;