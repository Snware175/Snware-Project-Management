import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  TextField,
  Button,
  TablePagination,
  Box,
  Switch,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";

const SalesRep = ({ handleOpen }) => {
  const [salesName, setSalesName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchSalesRep();
  }, []);
  const apiUrl = import.meta.env.VITE_API_BASE_URL; // Fetch API URL from .env
  const fetchSalesRep = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/sales-reps`);
      setSalesName(response.data);
    } catch (error) {
      console.error("Error fetching Details:", error);
    }
  };

  // Create a deep copy of the projects array with formatted data and aliased keys
  const formattedNames = salesName.map((row) => ({
    id: row.id,
    name: row.name,
    created_at: row.created_at
      ? format(new Date(row.created_at), "dd/MM/yyyy")
      : "N/A",
    is_active: row.is_active,
  }));

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle the status
      await axios.patch(`${apiUrl}/api/sales-reps/${id}`, {
        is_active: newStatus,
      });

      // Update the state after successful API response
      setSalesName((prev) =>
        prev.map((rep) =>
          rep.id === id ? { ...rep, is_active: newStatus } : rep
        )
      );

      console.log("Status updated successfully");
      handleSuccess("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      handleError("Error updating status:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "auto",
        overflow: "hidden",
        width: "75%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-5px 10px 5px rgb(0, 0, 0, 0.4)",
      }}
    >
      <Paper
        sx={{
          mt: 1,
          p: 2,
          flex: "1",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          minWidth: "900px",
        }}
      >
        {/* Search & Export Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
            padding: "0",
          }}
        >
          <TextField
            label="Search by ID or Name"
            type="text"
            variant="outlined"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "350px",
              "& .MuiInputBase-input::placeholder": {
                fontSize: "9px",
              },
            }}
          />
          <span
            style={{
              marginRight: "200px",
              textDecoration: "underline",
            }}
          >
            <h2>Sales Rep Table:</h2>
          </span>
          <Button
            variant="contained"
            sx={{ background: "#b3015c" }}
            onClick={handleOpen}
          >
            Add
          </Button>
        </div>

        {/* Table with Scrolling */}
        <TableContainer
          sx={{
            flex: "1",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{ width: "100%", minWidth: "900px", tableLayout: "fixed" }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "50px", textAlign: "center" }}>
                  <strong>S.No</strong>
                </TableCell>
                <TableCell sx={{ width: "100px", textAlign: "center" }}>
                  <strong>Name</strong>
                </TableCell>
                <TableCell sx={{ width: "90px", textAlign: "center" }}>
                  <strong>Created at</strong>
                </TableCell>
                <TableCell sx={{ width: "90px", textAlign: "center" }}>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedNames.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ width: "50px", textAlign: "center" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "320px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textAlign: "center",
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ width: "90px", textAlign: "center" }}>
                    {row.created_at}
                  </TableCell>
                  <TableCell
                    sx={{ width: "90px", textAlign: "center", padding: "0" }}
                  >
                    <Switch
                      size="small"
                      checked={row.is_active === 1}
                      onChange={() => handleToggleStatus(row.id, row.is_active)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#b3015c", // Green when active
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#b3015c", // Green track when active
                          },
                        "& .MuiSwitch-switchBase": {
                          color: "#f44336", // Red when inactive
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: "#f44336", // Red track when inactive
                        },
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default SalesRep;
