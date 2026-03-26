import React from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import MoreVertIcon from "@mui/icons-material/MoreVert";
const InvoiceTemplateTable = ({
  loading,
  paginatedInvoices,
  invoiceTemplates,
  page,
  rowsPerPage,
  anchorEl,
  selectedTemplateId,
  onEdit,
  onDelete,
  onCreateClick,
  onToggleMenu,
  onCloseMenu,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onCreateClick}
       
      >
        Create Invoice Template
      </Button>

      {loading ? (
        
          <CircularProgress />
        
      ) : (
        <Box>
          <TableContainer component={Paper} sx={{mt:2}}>
            <Table sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    
                  >
                    Name
                  </TableCell>
                  <TableCell
                    
                  >
                    Settings
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInvoices.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell  onClick={() => onEdit(row._id)} sx={{cursor:"pointer"}}>
                     
                        {row.templatename}
                     
                    </TableCell>
                    <TableCell
                      
                    >
                      <IconButton
                        onClick={(event) => onToggleMenu(event, row._id)}
                       
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onCloseMenu}
            
          >
            <MenuItem
              onClick={() => onEdit(selectedTemplateId)}
              
            >
             <RiEdit2Line style={{ marginRight: 8 }} /> Edit
            </MenuItem>
            <MenuItem
              onClick={() => onDelete(selectedTemplateId)}
              
            >
           <RiDeleteBin6Line style={{ marginRight: 8 }} />   Delete
            </MenuItem>
          </Menu>
            </Table>
            <TablePagination
            rowsPerPageOptions={[30, 40, 50, 60, 100]}
            component="div"
            count={invoiceTemplates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
          </TableContainer>

          

          
        </Box>
      )}
    </Box>
  );
};

export default InvoiceTemplateTable;