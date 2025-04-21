import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../utils";
import Grid from "@mui/material/Grid";
import GlobalLayout from "../Global/GlobalLayout";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Chip,
  OutlinedInput,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enGB, es } from "date-fns/locale";
import { format } from "date-fns";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { MdErrorOutline } from "react-icons/md";

import axios from "axios";

const jobStatuses = [
  "Invoice",
  "Won",
  "Canceled",
  "Bidding",
  "Lost",
  "Quotation Pending",
];

const SalesForm = ({ mockClients, mockSalesReps }) => {
  const [projectID, setProjectID] = useState("");
  const [recievedDate, setRecievedDate] = useState(null);
  const [recievedMonth, setRecievedMonth] = useState("");
  const [closureDate, setClosureDate] = useState(null);
  const [invoicingDate, setInvoicingDate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [linkReceived, setLinkReceived] = useState("No");
  const [clientName, setClientName] = useState("");

  const [specification, setSpecification] = useState("");
  const [countryNames, setCountryNames] = useState([]);
  const [countryInput, setCountryInput] = useState("");
  const [salesRep, setSalesRep] = useState("");

  const [loi, setLoi] = useState("");
  const [ir, setIr] = useState("");
  const [projectType, setProjectType] = useState("");

  const [currentStatus, setCurrentStatus] = useState("Bidding");

  const [initialBided, setInitialBided] = useState("");
  const [approvedCompletes, setApprovedCompletes] = useState("");
  const [clientBided, setClientBided] = useState("");
  const [supplierCost, setSupplierCost] = useState("");
  const [supplierPO, setSupplierPO] = useState("");
  const [rejection, setRejection] = useState("");
  const [invoicingMonth, setInvoicingMonth] = useState("");
  const [clientInvoice, setClientInvoice] = useState("");
  const [remarks, setRemarks] = useState("");

  const [invoicingCost, setInvoicingCost] = useState("");
  const [grossMargin, setGrossMargin] = useState("");
  const [profitMargin, setProfitMargin] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectID = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(`${apiUrl}/api/saleprojects/generate-id`);
        if (res.data.project_id) {
          setProjectID(res.data.project_id);

          // Also auto-append to project name if needed
          setProjectName((prev) => res.data.project_id + "_" + (prev || ""));
        }
      } catch (err) {
        console.error("Failed to fetch project ID", err);
      }
    };

    fetchProjectID();
  }, []);

  useEffect(() => {
    if (invoicingDate) {
      setInvoicingMonth(
        format(new Date(invoicingDate), "MMMM yy").replace(" ", "_")
      );
    }
  }, [invoicingDate]);

  useEffect(() => {
    if (recievedDate) {
      setRecievedMonth(
        format(new Date(recievedDate), "MMMM yy").replace(" ", "_")
      );
    }
  }, [recievedDate]);

  useEffect(() => {
    const dateToUse = recievedDate || new Date();

    setRecievedMonth(format(new Date(dateToUse), "MMMM yy").replace(" ", "_"));
  }, [recievedDate]);

  useEffect(() => {
    if (approvedCompletes && clientBided) {
      setInvoicingCost(approvedCompletes * clientBided);
    }
  }, [approvedCompletes, clientBided]);

  useEffect(() => {
    if (invoicingCost && supplierCost) {
      setGrossMargin(invoicingCost - supplierCost);
    }
  }, [invoicingCost, supplierCost]);

  useEffect(() => {
    if (grossMargin && invoicingCost) {
      const margin = (grossMargin / invoicingCost) * 100;
      setProfitMargin(Math.round(margin));
    }
  }, [grossMargin, invoicingCost]);

  useEffect(() => {
    if (projectID) {
      setProjectName(`${projectID}_`);
    }
  }, [projectID]);

  const handleProjectNameChange = (e) => {
    const value = e.target.value;

    // Ensure projectID stays at the beginning
    if (!value.startsWith(`${projectID}_`)) {
      return; // Prevent removal of projectID
    }

    setProjectName(value);
  };

  const validCountries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia (Czech Republic)",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini (fmr. 'Swaziland')",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy See",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar (formerly Burma)",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine State",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const handleAddCountry = (event, value) => {
    if (value && validCountries.includes(value)) {
      if (!countryNames.includes(value)) {
        setCountryNames([...countryNames, value]);
      }
      setCountryInput("");
    } else if (value) {
      showCenteredError("Please enter a valid country name from the list.");
      setCountryInput("");
    }
  };

  // Handle blur (when user leaves input without pressing enter or selecting)
  const handleCountryBlur = () => {
    if (countryInput && !validCountries.includes(countryInput)) {
      showCenteredError("Please select a valid country from the suggestions.");
      setCountryInput(""); // Clear invalid input
    }
  };

  const handleDeleteCountry = (countryToDelete) => {
    setCountryNames(
      countryNames.filter((country) => country !== countryToDelete)
    );
  };

  // Function to copy full project name
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${projectName}`);
    //alert("Project Name copied!");
    setOpenSnackbar(true);
  };

  const handleSalesRepChange = (e) => {
    setSalesRep(e.target.value);
  };

  //Client Name

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  // Handle Accordian
  const [expanded, setExpanded] = useState(true); // default open

  const handleAccordian = () => {
    setExpanded((prev) => !prev);
  };

  //Handle Dialog
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: "",
  });

  const showCenteredError = (message) => {
    setErrorDialog({
      open: true,
      message,
    });
  };

  // Handle submit buttom

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Form Submitted!");

    const invalidNameRegex = /^[\d\s\W]+$/;

    if (projectName === `${projectID}_`) {
      showCenteredError("Project Name is required! Please enter a valid name.");
      return;
    }

    // Prevent only numbers, spaces, or special characters
    const extractedName = projectName.replace(`${projectID}_`, "").trim();
    if (!extractedName || invalidNameRegex.test(extractedName)) {
      showCenteredError("Project Name must include at least one valid letter.");
      return;
    }

    // For now, we just console.log the data.
    console.log({
      projectID,
      projectName,
      linkReceived,
      clientName,
      specification,
      countryNames,
      rejection,
      salesRep,
      loi,
      ir,
      projectType,
    });

    //alert("Form submitted! Check the console.");

    //TimeZone(IST)
    const getISTDate = (recievedDate) => {
      let istDate = new Date(recievedDate);
      istDate.setHours(istDate.getHours() + 5, istDate.getMinutes() + 30); // Convert to IST
      return istDate.toISOString().split("T")[0]; // Store as "YYYY-MM-DD"
    };

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL; // Ensure the API URL is correctly set
      const payload = {
        project_id: projectID,
        project_date: recievedDate
          ? getISTDate(new Date(recievedDate))
          : getISTDate(new Date()),

        closure_date: closureDate ? getISTDate(new Date(closureDate)) : null,

        invoicing_date: invoicingDate
          ? getISTDate(new Date(invoicingDate))
          : null,
        recieved_month: recievedMonth,
        project_name: projectName,
        link_received: linkReceived,
        client_name: clientName,
        specification: specification,
        country_name:
          Array.isArray(countryNames) && countryNames.length > 0
            ? countryNames.join(",")
            : null,

        sales_rep: salesRep,
        loi: loi,
        ir: ir,
        type: projectType,
        current_status: currentStatus,
        rejection: rejection,
        initial_bidded_cpi: initialBided,
        approved_completes: approvedCompletes,
        client_approved_bidded_cpi: clientBided,
        supplier_cost: supplierCost,
        supplier_po: supplierPO,
        invoicing_month: invoicingMonth,
        client_invoice: clientInvoice,
        remarks: remarks,
        final_approved_invoicing_cost: invoicingCost,
        gross_margin: grossMargin,
        profit_margin: profitMargin,
      };

      console.log("Payload being sent:", payload);
      //console.log(apiUrl);
      const response = await axios.post(`${apiUrl}/api/saleprojects`, payload);
      console.log(response);
      const { message, error } = response.data;
      if (response.status === 200 || response.status === 201) {
        handleSuccess(message);

        setTimeout(() => navigate("/"), 2000);
      } else {
        console.log("Error saving project. Please try again.");
        showCenteredError(error?.details?.[0]?.message || message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      //alert("Failed to submit. Check console for details.");
      showCenteredError(
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        margin: "auto",
        padding: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h9"
        align="left"
        sx={{
          color: "red",
          fontSize: "14px",
        }}
      >
        (*) Fields are mandatory.
      </Typography>

      <Typography variant="h5" align="center" fontWeight="bold">
        Add Project (Sales Form)
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4} md={4}>
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={enGB}
          >
            <DatePicker
              label="Date"
              value={recievedDate || new Date()}
              onChange={(newValue) => setRecievedDate(newValue)}
              inputFormat="dd/MM/yyyy"
              maxDate={new Date()} // Disable selecting any date after today
              slots={{ textField: (props) => <TextField {...props} /> }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={4} md={4}>
          <TextField label="Recieved Month" value={recievedMonth} fullWidth />
        </Grid>

        <Grid item xs={4} md={4}>
          <TextField
            type="text"
            value={projectID}
            label="Project ID"
            aria-readonly
            fullWidth
          />
        </Grid>
      </Grid>

      <FormControl fullWidth required>
        <TextField
          label="Project Name"
          value={projectName}
          onChange={handleProjectNameChange}
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={copyToClipboard} edge="end">
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </FormControl>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ backgroundColor: "#1976d2", color: "white" }}
        >
          Project Name Copied!
        </Alert>
      </Snackbar>
      <Accordion expanded={expanded} onChange={handleAccordian}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#b3015c", // Custom background color
            color: "white", // Ensure text is white
            "&:hover": {
              backgroundColor: "#b3015c", // Darker shade on hover
              color: "white", // Ensure text remains white on hover
            },
            "&.Mui-focused": {
              backgroundColor: "#ed66ab", // Background color on focus
              color: "black", // Text color remains white
            },
          }}
        >
          <Typography>Project Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Client Name */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="client-name-label">Client Name</InputLabel>
                <Select
                  labelId="client-name-label"
                  required
                  value={clientName}
                  label="Client Name"
                  onChange={handleClientNameChange}
                >
                  {mockClients.map((rep) => (
                    <MenuItem key={rep._id} value={rep.name}>
                      {rep.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Specification */}
            <Grid item xs={12}>
              <TextField
                label="Specification"
                required
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
                fullWidth
              />
            </Grid>

            {/* Link Received & Type of Country */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="link-received-label">Link Received</InputLabel>
                <Select
                  labelId="link-received-label"
                  value={linkReceived}
                  required
                  label="Link Received"
                  onChange={(e) => setLinkReceived(e.target.value)}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="sales-rep-label">Sales Rep</InputLabel>
                <Select
                  labelId="sales-rep-label"
                  value={salesRep}
                  label="Sales Rep"
                  onChange={handleSalesRepChange}
                >
                  {mockSalesReps.map((rep) => (
                    <MenuItem key={rep._id} value={rep.name}>
                      {rep.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Country Name & Sales Rep */}
            <Grid item xs={12} md={12}>
              <Autocomplete
                disablePortal
                freeSolo
                options={validCountries.filter(
                  (country) => !countryNames.includes(country)
                )}
                value={null} // Important: prevent value selection binding
                onChange={handleAddCountry}
                inputValue={countryInput}
                onInputChange={(event, newInputValue) => {
                  setCountryInput(newInputValue);
                }}
                onBlur={handleCountryBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country Name"
                    placeholder="Type a country"
                    fullWidth
                  />
                )}
              />
            </Grid>

            {/* Country Chips */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {countryNames.map((country, index) => (
                  <Chip
                    key={index}
                    label={country}
                    onDelete={() => handleDeleteCountry(country)}
                    sx={{
                      backgroundColor: "#b3015c",
                      color: "white",
                      "& .MuiChip-deleteIcon": { color: "white" },
                      "&:hover": { backgroundColor: "#ed66ab" },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* LOI & IR */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="LOI (in Minutes)"
                type="number"
                value={loi}
                onChange={(e) => setLoi(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="IR (%)"
                type="number"
                value={ir}
                onChange={(e) => setIr(e.target.value)}
                inputProps={{ min: 0, max: 100 }}
                fullWidth
              />
            </Grid>

            {/* Project Type & Current Status */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="project-type-label">Type</InputLabel>
                <Select
                  labelId="project-type-label"
                  value={projectType}
                  label="Type"
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <MenuItem value="B2B">B2B</MenuItem>
                  <MenuItem value="B2C">B2C</MenuItem>
                  <MenuItem value="HC">HC</MenuItem>
                  <MenuItem value="Qual-B2B">Qual - B2B</MenuItem>
                  <MenuItem value="Qual-B2C">Qual - B2C</MenuItem>
                  <MenuItem value="Qual-HC">Qual - HC</MenuItem>
                  <MenuItem value="Full Service">Full Service</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="current-status-label">
                  Current Status
                </InputLabel>
                <Select
                  labelId="current-status-label"
                  value={currentStatus}
                  label="Current Status"
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  {jobStatuses.map((status, i) => (
                    <MenuItem key={i} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Initial Bidded CPI ($)"
                type="number"
                required
                value={initialBided}
                onChange={(e) => setInitialBided(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Client Approved Bidded CPI ($)"
                type="number"
                value={clientBided}
                onChange={(e) => setClientBided(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Approved Completes"
                type="number"
                value={approvedCompletes}
                onChange={(e) => setApprovedCompletes(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Rejection"
                type="number"
                value={rejection}
                onChange={(e) => setRejection(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier Cost ($)"
                type="number"
                value={supplierCost}
                onChange={(e) => setSupplierCost(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Supplier PO"
                value={supplierPO}
                onChange={(e) => setSupplierPO(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <TextField
        label="Remarks"
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        multiline
        rows={3}
        fullWidth
      />

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#b3015c", // Custom background color
            color: "white", // Ensure text is white
            "&:hover": {
              backgroundColor: "#b3015c", // Darker shade on hover
              color: "white", // Ensure text remains white on hover
            },
            "&.Mui-focused": {
              backgroundColor: "#ed66ab", // Background color on focus
              color: "black", // Text color remains white
            },
          }}
        >
          <Typography>Closure Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enGB}
              >
                <DatePicker
                  label="Closure Date"
                  value={closureDate}
                  onChange={(newValue) => setClosureDate(newValue)}
                  inputFormat="dd/MM/yyyy"
                  slots={{ textField: (props) => <TextField {...props} /> }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={6} md={6}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enGB}
              >
                <DatePicker
                  label="Invoicing Date"
                  value={invoicingDate}
                  onChange={(newValue) => setInvoicingDate(newValue)}
                  inputFormat="dd/MM/yyyy"
                  slots={{ textField: (props) => <TextField {...props} /> }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={4} md={4}>
              <TextField
                label="Invoicing Month"
                value={invoicingMonth}
                fullWidth
              />
            </Grid>
            <Grid item xs={8} md={8}>
              <TextField
                label="Client Invoice #"
                value={clientInvoice}
                onChange={(e) => setClientInvoice(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: "#b3015c", // Custom background color
            color: "white", // Ensure text is white
            "&:hover": {
              backgroundColor: "#b3015c", // Darker shade on hover
              color: "white", // Ensure text remains white on hover
            },
            "&.Mui-focused": {
              backgroundColor: "#ed66ab", // Background color on focus
              color: "black", // Text color remains white
            },
          }}
        >
          <Typography>Invoicing Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} md={4}>
              <TextField
                label=" Invoicing Cost ($)"
                type="number"
                value={invoicingCost}
                fullWidth
                aria-readonly
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextField
                label="Gross Margin ($)"
                type="number"
                value={grossMargin}
                fullWidth
                aria-readonly
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={4} md={4}>
              <TextField
                label="Profit Margin (%)"
                type="number"
                value={profitMargin}
                fullWidth
                aria-readonly
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
      <Dialog
        open={errorDialog.open}
        onClose={() => setErrorDialog({ ...errorDialog, open: false })}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            background: "#ededed",
            padding: "2px",
            marginLeft: "5px",
            color: "red",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <MdErrorOutline /> Error
          </span>
        </DialogTitle>
        <DialogContent
          sx={{
            background: "#b3015c",
            padding: 0,
            color: "#fff",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
            }}
          >
            {errorDialog.message}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            background: "#b3015c",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5px",
          }}
        >
          <Button
            onClick={() => setErrorDialog({ ...errorDialog, open: false })}
            color="primary"
            size="small"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesForm;
