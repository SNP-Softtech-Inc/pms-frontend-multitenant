
import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Stack,Button
} from "@mui/material";
import { Link } from "react-router-dom";
  import { useQuery } from "@tanstack/react-query";
import { accountsAPI } from "../../services/api"; // Adjust path to your api.js file
import AccountContactDrawer from "../Account-Contact/AccountContactDrawer"
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const AccountTable = () => {
  // const [accountList, setAccountList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState(null);
  const [orderBy, setOrderBy] = useState(null);
  // const [loading, setLoading] = useState(false);
 
  const [filterStatus, setFilterStatus] = useState("active");
const [openDrawer, setOpenDrawer] = useState(false);
// const fetchAccountsList = async () => {
//   setLoading(true);
//   try {
//     const isActive = filterStatus === "active";

//     const response = await accountsAPI.getAccountsList(isActive);

//     console.log("accounts list", response.data);
//     setAccountList(response.data.accountlist || []);
//   } catch (err) {
//     console.error("Error loading accounts:", err);
//     setAccountList([]);
//   } finally {
//     setLoading(false);
//   }
// };
// 
  // useEffect(() => {
  //   fetchAccountsList();
  // }, [filterStatus]);


const {
  data,
  isLoading,
} = useQuery({
  queryKey: ["accounts", filterStatus],
  queryFn: async () => {
    const isActive = filterStatus === "active";
    const res = await accountsAPI.getAccountsList(isActive);
    return res.data.accountlist || [];
  },
});
 const accountList = data || [];
const loading = isLoading;
    const handleDrawerClose = () => {
    setOpenDrawer(false);
    // fetchAccountsList(); // refresh data when drawer closes
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter by active status
  const filteredList = accountList.filter(account => account.active === (filterStatus === "active"));
  
  const sortedList =
    orderBy && order
      ? filteredList.slice().sort(getComparator(order, orderBy))
      : filteredList;
  
  const paginatedList = sortedList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderLimitedChips = (items, getLabel, getColor) => {
    if (!items || items.length === 0) return "—";

    const first = items[0];
    const remainingCount = items.length - 1;

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap">
        <Tooltip title={getLabel(first)} placement="top-end">
          <Chip
            label={getLabel(first)}
            size="small"
            sx={getColor ? getColor(first) : {}}
          />
        </Tooltip>

        {remainingCount > 0 && (
          <Tooltip
            title={items.map((i) => getLabel(i)).join(", ")}
            placement="top-end"
          >
            <Chip
              label={`+${remainingCount} more`}
              size="small"
              variant="outlined"
            />
          </Tooltip>
        )}
      </Stack>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Simple Active/Archived toggle */}
      <Box sx={{ mb: 2,display:'flex', justifyContent:"space-between" }} >
        <Box>
        <Stack direction="row" spacing={2}>
          <Typography
            variant="button"
            onClick={() => setFilterStatus("active")}
            sx={{
              cursor: "pointer",
              fontWeight: filterStatus === "active" ? "bold" : "normal",
              color: filterStatus === "active" ? "primary.main" : "text.secondary",
              borderBottom: filterStatus === "active" ? "2px solid" : "none",
              borderColor: "primary.main"
            }}
          >
            Active
          </Typography>
          <Typography
            variant="button"
            onClick={() => setFilterStatus("archived")}
            sx={{
              cursor: "pointer",
              fontWeight: filterStatus === "archived" ? "bold" : "normal",
              color: filterStatus === "archived" ? "primary.main" : "text.secondary",
              borderBottom: filterStatus === "archived" ? "2px solid" : "none",
              borderColor: "primary.main"
            }}
          >
            Archived
          </Typography>
        </Stack>
</Box>
<Box> <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDrawer(true)}
        >
          Add Account
        </Button></Box>
               
      </Box>

      {loading ? (
        <Typography sx={{ textAlign: "center", p: 3 }}>
          Loading accounts...
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Account Code</TableCell>
                <TableCell
                  sortDirection={orderBy === "accountName" ? order : false}
                  width={"500px"}
                >
                  <TableSortLabel
                    active={orderBy === "accountName"}
                    direction={orderBy === "accountName" ? order : "asc"}
                    onClick={() => handleRequestSort("accountName")}
                  >
                    Account Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "clientType" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "clientType"}
                    direction={orderBy === "clientType" ? order : "asc"}
                    onClick={() => handleRequestSort("clientType")}
                  >
                    Client Type
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  sortDirection={orderBy === "companyName" ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === "companyName"}
                    direction={orderBy === "companyName" ? order : "asc"}
                    onClick={() => handleRequestSort("companyName")}
                  >
                    Company Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Team Members</TableCell>
                <TableCell>Contact Emails</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedList.length > 0 ? (
                paginatedList.map((account) => (
                  <TableRow key={account._id}>
                    <TableCell>
                      <Chip
                        label={account.importId || "—"}
                        size="small"
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/clients/accounts/accountsdash/overview/${account._id}`}
                        style={{ textDecoration: "none", color: "#3f51b5", cursor: "pointer" }}
                      >
                        {account.accountName}
                      </Link>
                    </TableCell>
                    <TableCell>{account.clientType || "—"}</TableCell>
                    <TableCell>{account.companyName || "—"}</TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.tags,
                        (t) => t.tagName,
                        (t) => ({
                          backgroundColor: t.tagColour,
                          color: "#fff",
                          fontWeight: 600,
                        })
                      )}
                    </TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.teamMember,
                        (tm) => tm.username,
                        () => ({
                          border: "1px solid",
                          borderColor: "primary.main",
                          color: "primary.main",
                        })
                      )}
                    </TableCell>

                    <TableCell>
                      {renderLimitedChips(
                        account.contacts
                          ?.map((c) => c.contact)
                          ?.filter((c) => c?.email?.trim()),
                        (c) => c.email
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No accounts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={sortedList.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 30, 50, 100, 500]}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(0);
            }}
          />
        </TableContainer>


      )}

      <AccountContactDrawer open={openDrawer} onClose={handleDrawerClose} />
    </Box>
  );
};

export default AccountTable;