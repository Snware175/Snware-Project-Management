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
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { BiCollapse } from "react-icons/bi";
import { LuExpand } from "react-icons/lu";
import Modal from "@mui/material/Modal";

const Clients = ({ handleOpen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [clientsName, setClientsName] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => setOpen(true);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const handleClose = () => {
    setOpen(false);
  };
  const [client, setClient] = useState({
    name: "",
    is_active: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name } = client;

    if (!name.trim()) {
      return handleError("Client name is required.");
    }

    const nameExists = clientsName.some(
      (c) => c.name && c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (nameExists) {
      return handleError("Client name already exists.");
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/api/clients`, client);
      console.log(response.data);
      const { success, message, error } = response.data;
      if (success) {
        fetchClientsName(); // Refresh client list
        setClient({ name: "", is_active: 1 }); // Reset form
        handleSuccess(message);
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (error) {
      console.error("Client Error:", error);
      handleError(error.response?.data?.message || "Something went wrong!");
    }
  };

  useEffect(() => {
    fetchClientsName();
  }, []);
  const apiUrl = import.meta.env.VITE_API_BASE_URL; // Fetch API URL from .env
  const fetchClientsName = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/clients`);
      const normalized = response.data.map((client) => ({
        ...client,
        id: client._id,
      }));
      setClientsName(normalized);
    } catch (error) {
      console.error("Error fetching Details:", error);
    }
  };

  // Create a deep copy of the projects array with formatted data and aliased keys
  const filteredClients = clientsName.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formattedNames = filteredClients.map((row) => ({
    id: row._id,
    name: row.name,
    created_at: row.created_at
      ? format(new Date(row.created_at), "dd/MM/yyyy")
      : "N/A",
    is_active: row.is_active,
  }));

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle the status
      await axios.patch(`${apiUrl}/api/clients/${id}`, {
        is_active: newStatus,
      });

      // Update the state after successful API response
      setClientsName((prev) =>
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
            label="Search by Name"
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
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
              textDecoration: "underline",
              fontSize: "25px",
              fontFamily: "ui-monospace",
              marginRight: 15,
              color: "#b3015c",
            }}
          >
            Client Control Panel
          </Typography>

          <Button
            variant="contained"
            sx={{ background: "#b3015c" }}
            onClick={handleOpenModal}
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
                      onChange={(e) => {
                        e.stopPropagation(); // just in case
                        if (typeof row.id !== "undefined") {
                          handleToggleStatus(row.id, row.is_active);
                        }
                      }}
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

      <Modal
        open={open}
        onClose={handleClose}
        disableEscapeKeyDown
        aria-labelledby="sales-form-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isFullscreen ? "100vw" : 600,
            height: isFullscreen ? "100vh" : "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: isFullscreen ? "100vh" : "90vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Close and Expand Icons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton onClick={toggleFullscreen}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#fff",
              }}
            ></Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" gutterBottom>
            Add Client
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Client Name"
              name="name"
              required
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              fullWidth
              margin="normal"
              autoFocus
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, background: "#b3015c" }}
            >
              Add Client
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default Clients;
