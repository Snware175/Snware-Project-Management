import React, { useEffect, useState } from "react";
import {
  Grid,
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
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enGB, es } from "date-fns/locale";
import { IoIosAddCircle } from "react-icons/io";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import axios from "axios";
import * as XLSX from "xlsx";
import SalesProjectDrawer from "./SalesProjectDrawer";
import { useUser } from "../../Contexts/UserContext";

const SalesProjectTable = ({ handleOpen, mockClients, mockSalesReps }) => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedServices, setSelectedServices] = useState("");
  const jobStatuses = [
    "Invoice",
    "Won",
    "Canceled",
    "Bidding",
    "Lost",
    "Quotation Pending",
  ];
  const { user } = useUser();

  const [selectedProject, setSelectedProject] = useState(null);

  // On click of a project name
  const handleOpenDrawer = (project) => {
    setSelectedProject(project);
  };

  const fetchProjects = async (filters = {}) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;

      const queryParams = new URLSearchParams();

      if (filters.fromDate && filters.toDate) {
        queryParams.append("from", filters.fromDate);
        queryParams.append("to", filters.toDate);
      }

      if (filters.client) {
        queryParams.append("client", filters.client);
      }

      if (filters.services) {
        queryParams.append("services", filters.services);
      }

      const response = await axios.get(
        `${apiUrl}/api/saleprojects?${queryParams.toString()}`
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleApply = () => {
    const isApplied =
      (fromDate && toDate) || selectedClient !== "" || selectedServices !== "";

    setFiltersApplied(isApplied);

    fetchProjects({
      fromDate,
      toDate,
      client_name: selectedClient,
      services: selectedServices,
    });

    console.log("Filters being applied:", {
      fromDate,
      toDate,
      client: selectedClient,
      status: selectedStatus,
      services: selectedServices,
    });
  };

  //Clear Filter

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedClient("");
    setSelectedServices("");
    setFiltersApplied(false);

    fetchProjects();
  };

  //console.log("Sample project data:", projects[0]);
  const handleExport = () => {
    const isAdmin = user?.role === "Admin" || user?.role === "Super Admin";
    // Set column order
    const columnOrder = [
      "recieved_month",
      "project_date",
      "project_name",
      "link_received",
      "client_name",
      "specification",
      "country_name",
      "sales_rep",
      "loi",
      "ir",
      "type",
      "current_status",
      "initial_bidded_cpi",
      "client_approved_bidded_cpi",
      "approved_completes",
      "rejection",
      "final_approved_invoicing_cost",
      "supplier_cost",
      "supplier_po",
      "gross_margin",
      "profit_margin",
      "closure_date",
      "invoicing_date",
      "invoicing_month",
      "client_invoice",
      "remarks",
      "project_id",
      "createdAt",
      "updatedAt",
    ];

    // Define the column aliases
    const columnAliases = isAdmin
      ? {
          recieved_month: "Month",
          project_date: "Date",
          project_name: "Project Name",
          link_received: "Link Received",
          client_name: "Client Name",
          specification: "Specification",
          country_name: "Country Name",
          sales_rep: "Sales Rep",
          loi: "LOI (in Minutes)",
          ir: "IR",
          type: "Type (B2B/B2C/HC)",
          current_status: "Status",
          initial_bidded_cpi: "Initial Bidded CPI",
          client_approved_bidded_cpi: "Client Approved Bidded CPI",
          approved_completes: "Approved Completes",
          rejection: "Rejection - Completes",
          final_approved_invoicing_cost: "Final Approved / Invoicing Cost",
          supplier_cost: "Supplier Cost",
          supplier_po: "Supplier PO",
          gross_margin: "Gross Margin",
          profit_margin: "Profit Margin",
          closure_date: "Project Closure Receiving Date",
          invoicing_date: "Invoicing Date",
          invoicing_month: "Invoicing Month",
          client_invoice: "Client Invoice",
          remarks: "Remarks",
          project_id: "Project ID",
          createdAt: "Created At",
          updatedAt: "Updated At",
        }
      : {
          recieved_month: "Month",
          project_date: "Date",
          project_name: "Project Name",
          link_received: "Link Received",
          client_name: "Client Name",
          specification: "Specification",
          country_name: "Country Name",
          sales_rep: "Sales Rep",
          loi: "LOI (in Minutes)",
          ir: "IR",
          type: "Type (B2B/B2C/HC)",
          current_status: "Status",
          initial_bidded_cpi: "Initial Bidded CPI",
          client_approved_bidded_cpi: "Client Approved Bidded CPI",
          approved_completes: "Approved Completes",
          rejection: "Rejection - Completes",
          final_approved_invoicing_cost: "Final Approved / Invoicing Cost",
          supplier_cost: "Supplier Cost",
          supplier_po: "Supplier PO",
          gross_margin: "Gross Margin",
          profit_margin: "Profit Margin",
          closure_date: "Project Closure Receiving Date",
          invoicing_date: "Invoicing Date",
          invoicing_month: "Invoicing Month",
          client_invoice: "Client Invoice",
          remarks: "Remarks",
          updatedAt: "Updated At",
        };

    // Create a deep copy of the projects array with formatted data and aliased keys
    const formattedProjects = projects.map((row) => {
      const formattedRow = {};

      columnOrder.forEach((key) => {
        if (
          key === "project_date" ||
          key === "closure_date" ||
          key === "invoicing_date"
        ) {
          // Date only
          formattedRow[columnAliases[key]] = row[key]
            ? format(new Date(row[key]), "dd-MMM-yy")
            : "N/A";
        } else if (key === "createdAt" || key === "updatedAt") {
          // Date with time
          formattedRow[columnAliases[key]] = row[key]
            ? format(new Date(row[key]), "dd-MMM-yy HH:mm:ss")
            : "N/A";
        } else if (
          key === "initial_bidded_cpi" ||
          key === "client_approved_bidded_cpi" ||
          key === "final_approved_invoicing_cost" ||
          key === "supplier_cost" ||
          key === "gross_margin" ||
          key === "profit_margin"
        ) {
          formattedRow[columnAliases[key]] =
            row[key]?.$numberDecimal || row[key] || "N/A";
        } else {
          formattedRow[columnAliases[key]] = row[key];
        }
      });

      return formattedRow;
    });

    // Create and export the Excel file
    const ws = XLSX.utils.json_to_sheet(formattedProjects);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, "Project_List.xlsx");
  };

  //Sorting by Database ID
  const sortedProjects = [...projects].sort((a, b) => b.id - a.id);

  const filteredProjects = sortedProjects.filter(
    (project) =>
      project.project_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        height: "calc(100vh - 145px)",
        overflow: "hidden",
        width: "95%",
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
        {/* Search & Export Section (Reduced height) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 1,
            p: 1,
          }}
        >
          {/* Filters Group */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <TextField
              label="Search by ID or Name"
              type="text"
              variant="outlined"
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 180,
                "& .MuiInputBase-input::placeholder": {
                  fontSize: "9px",
                },
              }}
            />

            <TextField
              size="small"
              type="date"
              label="From"
              InputLabelProps={{ shrink: true }}
              value={fromDate || ""}
              onChange={(e) => setFromDate(e.target.value)}
            />

            <TextField
              size="small"
              type="date"
              label="To"
              InputLabelProps={{ shrink: true }}
              value={toDate || ""}
              onChange={(e) => setToDate(e.target.value)}
            />

            <TextField
              select
              size="small"
              label="Client"
              value={selectedClient || ""}
              onChange={(e) => setSelectedClient(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">All</MenuItem>
              {mockClients.map((client) => (
                <MenuItem key={client._id} value={client.name}>
                  {client.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Services"
              value={selectedServices || ""}
              onChange={(e) => setSelectedServices(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              {jobStatuses.map((services, i) => (
                <MenuItem key={i} value={services}>
                  {services}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Action Buttons Group */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              onClick={filtersApplied ? handleClearFilters : handleApply}
              sx={{
                background: filtersApplied ? "#6c757d" : "#b3015c",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: filtersApplied ? "#5a6268" : "#b3015c",
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              {filtersApplied ? "Clear Filters" : "Apply Filters"}
            </Button>

            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{
                background: "#b3015c",
                textTransform: "none",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#b3015c",
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              Add Project
            </Button>

            <Button
              variant="contained"
              onClick={handleExport}
              sx={{
                background: "#b3015c",
                color: "white",
                textTransform: "none",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#b3015c",
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              Excel
              <FileDownloadIcon sx={{ ml: 0.5 }} />
            </Button>
          </Box>
        </Box>

        {/* Table with Scrolling */}
        <TableContainer
          sx={{
            flex: "1",
            maxHeight: "400px",
            overflowY: "auto",
            paddingBottom: "80px",
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
                  <strong>Received Date</strong>
                </TableCell>

                <TableCell sx={{ width: "320px" }}>
                  <strong>Project Name</strong>
                </TableCell>
                <TableCell sx={{ width: "150px", textAlign: "center" }}>
                  <strong>Client Name</strong>
                </TableCell>
                <TableCell sx={{ width: "90px", textAlign: "center" }}>
                  <strong>Sales Rep</strong>
                </TableCell>
                <TableCell sx={{ width: "90px", textAlign: "center" }}>
                  <strong>Services</strong>
                </TableCell>
                <TableCell sx={{ width: "80px", textAlign: "center" }}>
                  <strong>Status</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.project_id}>
                    <TableCell sx={{ width: "50px", textAlign: "center" }}>
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell sx={{ width: "100px", textAlign: "center" }}>
                      {row.project_date
                        ? format(new Date(row.project_date), "dd/MM/yyyy")
                        : "N/A"}
                    </TableCell>

                    <TableCell
                      sx={{
                        width: "320px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <a
                        href="#"
                        className="anchorProject"
                        onClick={() => handleOpenDrawer(row)}
                      >
                        {row.project_name}
                      </a>
                    </TableCell>
                    <TableCell sx={{ width: "150px", textAlign: "center" }}>
                      {row.client_name}
                    </TableCell>
                    <TableCell sx={{ width: "90px", textAlign: "center" }}>
                      {row.sales_rep}
                    </TableCell>
                    <TableCell sx={{ width: "80px", textAlign: "center" }}>
                      <span>{row.type}</span>
                    </TableCell>
                    <TableCell sx={{ width: "80px", textAlign: "center" }}>
                      <span
                        className={`status ${row.current_status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {row.current_status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedProject && (
          <SalesProjectDrawer
            open={!!selectedProject}
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              fetchProjects();
            }}
            mockClients={mockClients}
            mockSalesReps={mockSalesReps}
          />
        )}

        {/* Pagination - Always Visible */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "3px",
            position: "sticky",
            bottom: "0",
            background: "white",
            borderTop: "1px solid #ddd",
          }}
        >
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={filteredProjects.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesProjectTable;
