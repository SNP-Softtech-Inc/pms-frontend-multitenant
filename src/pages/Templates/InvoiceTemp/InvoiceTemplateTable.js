// import React from "react";
// import {
//   Box,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Paper,
//   Typography,
//   IconButton,
//   Menu,
//   MenuItem,
//   CircularProgress,
// } from "@mui/material";
// import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// const InvoiceTemplateTable = ({
//   loading,
//   paginatedInvoices,
//   invoiceTemplates,
//   page,
//   rowsPerPage,
//   anchorEl,
//   selectedTemplateId,
//   onEdit,
//   onDelete,
//   onCreateClick,
//   onToggleMenu,
//   onCloseMenu,
//   onChangePage,
//   onChangeRowsPerPage,
// }) => {
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={onCreateClick}
       
//       >
//         Create Invoice Template
//       </Button>

//       {loading ? (
        
//           <CircularProgress />
        
//       ) : (
//         <Box>
//           <TableContainer component={Paper} sx={{mt:2}}>
//             <Table sx={{ width: "100%" }}>
//               <TableHead>
//                 <TableRow>
//                   <TableCell
                    
//                   >
//                     Name
//                   </TableCell>
//                   <TableCell
                    
//                   >
//                     Settings
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {paginatedInvoices.map((row) => (
//                   <TableRow key={row._id}>
//                     <TableCell  onClick={() => onEdit(row._id)} sx={{cursor:"pointer"}}>
                     
//                         {row.templatename}
                     
//                     </TableCell>
//                     <TableCell
                      
//                     >
//                       <IconButton
//                         onClick={(event) => onToggleMenu(event, row._id)}
                       
//                       >
//                         <MoreVertIcon />
//                       </IconButton>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//               <Menu
//             anchorEl={anchorEl}
//             open={Boolean(anchorEl)}
//             onClose={onCloseMenu}
            
//           >
//             <MenuItem
//               onClick={() => onEdit(selectedTemplateId)}
              
//             >
//              <RiEdit2Line style={{ marginRight: 8 }} /> Edit
//             </MenuItem>
//             <MenuItem
//               onClick={() => onDelete(selectedTemplateId)}
              
//             >
//            <RiDeleteBin6Line style={{ marginRight: 8 }} />   Delete
//             </MenuItem>
//           </Menu>
//             </Table>
//             <TablePagination
//             rowsPerPageOptions={[30, 40, 50, 60, 100]}
//             component="div"
//             count={invoiceTemplates.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={onChangePage}
//             onRowsPerPageChange={onChangeRowsPerPage}
//           />
//           </TableContainer>

          

          
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default InvoiceTemplateTable;


import React, { useState } from "react"
import { Button } from "../../../components/ui/button"
import { DataTable } from "../../../components/data-table/data-table"
import { DataTableToolbar } from "../../../components/data-table/toolbar"
import { Plus, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"

import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri"

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
  const [globalFilter, setGlobalFilter] = useState("")

  const columns = [
    {
      accessorKey: "templatename",
      header: "Name",
      cell: ({ row }) => (
        <div
          // className="cursor-pointer font-medium"
          onClick={() => onEdit(row.original._id)}
          className="text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors text-left cursor-pointer"
        >
          {row.original.templatename}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Settings",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original._id)}>
              <RiEdit2Line className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original._id)}>
              <RiDeleteBin6Line className="mr-2 text-red-500" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="mt-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1" />
          Create Invoice Template
        </Button>
      </div>

      {/* Toolbar */}
      <DataTableToolbar
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
      />

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={paginatedInvoices}
        loading={loading}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableRowSelection={false}
        getRowId={(row) => row._id}
        emptyMessage="No invoice templates found"
        emptyDescription="Create your first invoice template to get started"
        pageSize={rowsPerPage}
      />
    </div>
  )
}

export default InvoiceTemplateTable