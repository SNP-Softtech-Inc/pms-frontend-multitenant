import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const PreviewDrawer = ({
  open,
  onClose,
  rows,
  description,
  clientNote,
  subtotal,
  taxRate,
  taxTotal,
  totalAmount,
  onSave,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isSmallScreen ? "100%" : 800,
          p: 2,
          background: "#f8fafc",
        },
      }}
    >
      <Box sx={{ padding: 4 }}>
        {/* Invoice Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>Preview</Typography>
          <CloseIcon
            sx={{ cursor: "pointer", color: "rgb(24, 118, 211)" }}
            onClick={onClose}
          />
        </Box>
        <Divider sx={{ mt: 2 }} />

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{
            background: "#fdfdfd",
            marginBottom: 4,
            height: { xs: "50vh", md: "auto" },
            mt: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#ff6700",
              fontWeight: "bold",
              marginBottom: 2,
              ml: 2,
              mt: 2,
            }}
          >
            Invoice
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#cbd5e1",
                marginBottom: 2,
                ml: 2,
                fontSize: 13,
              }}
            >
              [ACCOUNT_NAME]
            </Typography>
            <Typography fontSize={13}>
              Invoice number:{" "}
              <Typography
                component="span"
                sx={{
                  color: "#cbd5e1",
                  mr: 2,
                  marginBottom: 2,
                  fontSize: 13,
                }}
              >
                [INVOICE_NUMBER]
              </Typography>
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#cbd5e1",
                marginBottom: 2,
                ml: 2,
                fontSize: 13,
              }}
            >
              [CONTACT_NAME]
            </Typography>
            <Typography fontSize={13}>
              Date:{" "}
              <Typography
                component="span"
                sx={{
                  color: "#cbd5e1",
                  mr: 2,
                  marginBottom: 2,
                  fontSize: 13,
                }}
              >
                [DATE]
              </Typography>
            </Typography>
          </Box>

          <Box sx={{ ml: 2, marginBottom: 5 }}>
            <Typography sx={{ fontSize: 13 }}>
              Description: {description}
            </Typography>
          </Box>

          <Table sx={{ marginBottom: 10 }}>
            <TableHead>
              <TableRow sx={{ background: "#fff8f5" }}>
                <TableCell>
                  <strong>Product/Service</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Rate ($)</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Qty</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Amount</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.productName}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell align="right">{row.rate || "$0.00"}</TableCell>
                  <TableCell align="right">{row.qty || "1"}</TableCell>
                  <TableCell align="right">{row.amount || "$0.00"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginRight: 3,
            mt: 0,
          }}
        >
          <Typography sx={{ textAlign: "right", width: "100%" }}>
            <strong>Subtotal:</strong> ${subtotal || "0.00"}
          </Typography>
          <Typography sx={{ textAlign: "right", width: "100%" }}>
            <strong>Tax Rate:</strong> {taxRate || "0.00"}%
          </Typography>
          <Typography sx={{ textAlign: "right", width: "100%" }}>
            <strong>Tax Total:</strong> ${taxTotal?.toFixed(2) || "0.00"}
          </Typography>
          <Typography
            sx={{
              textAlign: "right",
              fontWeight: "bold",
              width: "100%",
              marginTop: 1,
            }}
          >
            <strong>Total:</strong> ${totalAmount || "0.00"}
          </Typography>
        </Box>

        {/* <Box>{clientNote}</Box> */}

        {/* Footer Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            
          >
            Save & Exit
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PreviewDrawer;