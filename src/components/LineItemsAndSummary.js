import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Typography,
  Checkbox,
} from "@mui/material";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { CiDiscount1 } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";

import { Autocomplete, TextField } from "@mui/material";
const LineItemsAndSummary = ({
  // Line items props
  rows = [],
  serviceoptions = [],
  onInputChange,
  onServiceChange,
  onServiceInputChange,
  onAddRow,
  onDeleteRow,
  onEditService,
  onDeleteService,
  onSaveAsNewService,
  onDuplicate,
  
  // Summary props
  subtotal = 0,
  onSubtotalChange,
  taxRate = 0,
  onTaxRateChange,
  taxTotal = 0,
  totalAmount = 0,
  
  // Optional styling
  tableWidth = "100%",
  showSummary = true,
  showAddButtons = true,
  summaryTitle = "Summary",
  lineItemsTitle = "Line items",
  lineItemsSubtitle = "Client-facing itemized list of products and services",
  
  // Optional: allow custom table headers
  customHeaders,
  
  // Optional: additional actions
  additionalActions,
}) => {
  const [anchorElNew, setAnchorElNew] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const defaultHeaders = [
    { id: "product", label: "Product or service", width: "20%" },
    { id: "description", label: "Description" },
    { id: "rate", label: "Rate" },
    { id: "qty", label: "Qty" },
    { id: "amount", label: "Amount" },
    { id: "tax", label: "Tax" },
    { id: "settings", label: "Settings" },
    { id: "actions", label: "" },
  ];

  const headers = customHeaders || defaultHeaders;

  const handleMenuOpen = (event, index) => {
    setAnchorElNew(event.currentTarget);
    setSelectedRow(index);
  };

  const handleMenuClose = () => {
    setAnchorElNew(null);
    setSelectedRow(null);
  };

 

  const handleTaxRateChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    if (onTaxRateChange) {
      onTaxRateChange(value);
    }
  };

  return (
    <Box>
      {/* Line Items Section */}
      {(lineItemsTitle || lineItemsSubtitle) && (
        <Box sx={{ margin: "20px 0 10px 0" }}>
          {lineItemsTitle && <Typography variant="h6">{lineItemsTitle}</Typography>}
          {lineItemsSubtitle && (
            <Typography variant="body2">{lineItemsSubtitle}</Typography>
          )}
        </Box>
      )}

      <Box sx={{ overflow: "auto", width: tableWidth }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell
                  key={header.id}
                  sx={
                    index === 0
                      ? {
                          position: "sticky",
                          left: 0,
                          backgroundColor: "white",
                          zIndex: 1,
                          width: header.width || "auto",
                        }
                      : {}
                  }
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.id || index}>
                {/* Product or Service Column */}
                {headers.some(h => h.id === "product") && (
                  <TableCell
                    sx={{
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                    }}
                  >
                    
                    <Autocomplete
  size="small"
  freeSolo
  options={serviceoptions.map((option) => ({
    label: option.label,
    value: option.value,
  }))}

  value={
    row.productName
      ? {
          label: row.productName,
          value: row.productName,
        }
      : null
  }

  onChange={(event, newValue) => {
    let formatted = null;

    if (typeof newValue === "string") {
      // typed and pressed enter
      formatted = { label: newValue, value: newValue };
    } else if (newValue && newValue.inputValue) {
      // clicked "Add new"
      formatted = {
        label: newValue.inputValue,
        value: newValue.inputValue,
      };
    } else if (newValue) {
      // selected existing
      formatted = newValue;
    }

    onServiceChange && onServiceChange(index, formatted);
  }}

  onInputChange={(event, inputValue, reason) => {
    if (reason === "input") {
      onServiceInputChange &&
        onServiceInputChange(inputValue, { action: "input-change" }, index);
    }
  }}

  filterOptions={(options, params) => {
    const filtered = options.filter((option) =>
      option.label
        .toLowerCase()
        .includes(params.inputValue.toLowerCase())
    );

    const isExisting = options.some(
      (option) =>
        option.label.toLowerCase() ===
        params.inputValue.toLowerCase()
    );

    if (params.inputValue !== "" && !isExisting) {
      filtered.push({
        inputValue: params.inputValue,
        label: `Add "${params.inputValue}"`,
      });
    }

    return filtered;
  }}

  getOptionLabel={(option) => {
    if (typeof option === "string") return option;
    if (option.inputValue) return option.inputValue;
    return option.label || "";
  }}

  renderOption={(props, option) => (
    <li {...props}>
      {option.label}
    </li>
  )}

  renderInput={(params) => (
    <TextField
      {...params}
      placeholder={
        row.isDiscount
          ? "Reason for discount"
          : "Product or Service"
      }
    />
  )}

  sx={{ width: 180 }}
/>
                  </TableCell>
                )}

                {/* Description Column */}
                {headers.some(h => h.id === "description") && (
                  <TableCell>
                    <TextField
                    //   type="text"
                      name="description"
                      value={row.description || ""}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      fullWidth
                      placeholder="Description"
                       sx={{ width: 180 }}
                    />
                  </TableCell>
                )}

                {/* Rate Column */}
                {headers.some(h => h.id === "rate") && (
                  <TableCell>
                    <TextField
                      fullWidth
                      name="rate"
                      value={row.rate || ""}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                       sx={{ width: 100 }}
                    />
                  </TableCell>
                )}

                {/* Quantity Column */}
                {headers.some(h => h.id === "qty") && (
                  <TableCell>
                    <TextField
                     fullWidth
                      name="qty"
                      value={row.qty || ""}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                      sx={{ width: 50 }}
                    />
                  </TableCell>
                )}

                {/* Amount Column */}
                {headers.some(h => h.id === "amount") && (
                  <TableCell>{row.amount || "0.00"}</TableCell>
                )}

                {/* Tax Column */}
                {headers.some(h => h.id === "tax") && (
                  <TableCell>
                    <Checkbox
                      name="tax"
                      checked={row.tax || false}
                      onChange={(e) => onInputChange && onInputChange(index, e)}
                    />
                  </TableCell>
                )}

                {/* Settings Column (Menu) */}
                {headers.some(h => h.id === "settings") && (
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, index)}>
                      <BsThreeDotsVertical />
                    </IconButton>
                    <Menu
                      anchorEl={anchorElNew}
                      open={Boolean(anchorElNew) && selectedRow === index}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          onEditService && onEditService(row, index);
                          handleMenuClose();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onDeleteService && onDeleteService(index);
                          handleMenuClose();
                        }}
                      >
                        Delete
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onSaveAsNewService && onSaveAsNewService(row);
                          handleMenuClose();
                        }}
                      >
                        Save as new service
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          onDuplicate && onDuplicate(index);
                          handleMenuClose();
                        }}
                      >
                        Duplicate
                      </MenuItem>
                    </Menu>
                  </TableCell>
                )}

                {/* Actions Column (Delete Icon) */}
                {headers.some(h => h.id === "actions") && (
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        onDeleteRow && onDeleteRow(index);
                        handleMenuClose();
                      }}
                    >
                      <RiCloseLine />
                    </IconButton>
                  </TableCell>
                )}

                {/* Additional custom columns */}
                {additionalActions && additionalActions(row, index)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Add Row Buttons */}
      {showAddButtons && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginTop: "10px",
          }}
        >
          <Button
            onClick={() => onAddRow && onAddRow(false)}
            startIcon={<AiOutlinePlusCircle />}
            sx={{ color: "blue", fontSize: "15px" }}
          >
            Line item
          </Button>
          <Button
            onClick={() => onAddRow && onAddRow(true)}
            startIcon={<CiDiscount1 />}
            sx={{ color: "blue", fontSize: "15px" }}
          >
            Discount
          </Button>
        </Box>
      )}

      {/* Summary Section */}
      {showSummary && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {summaryTitle}
          </Typography>
          <Table sx={{ backgroundColor: "#fff" }}>
            <TableHead>
              <TableRow>
                <TableCell>Subtotal</TableCell>
                <TableCell>Tax Rate</TableCell>
                <TableCell>Tax Total</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    ${subtotal}
                    
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={taxRate}
                      onChange={handleTaxRateChange}
                       sx={{ width: 100 }}
                        InputProps={{
                      endAdornment: "%",
                    }}
                    />
                    {/* % */}
                  </Box>
                </TableCell>
                <TableCell>${taxTotal?.toFixed(2) || "0.00"}</TableCell>
                <TableCell>${totalAmount || "0.00"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </Box>
  );
};

export default LineItemsAndSummary;