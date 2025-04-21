import React, { useEffect, useState } from "react";

import axios from "axios";
import { handleSuccess } from "../../utils";

import {
  Box,
  Drawer,
  Divider,
  Grid,
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
import { formatMeridiem } from "@mui/x-date-pickers/internals";
import { parseISO, isValid } from "date-fns";

const jobStatuses = [
  "Invoice",
  "Won",
  "Canceled",
  "Bidding",
  "Lost",
  "Quotation Pending",
];

const SalesProjectDrawer = ({
  open,
  onClose,
  project,
  mockClients,
  mockSalesReps,
}) => {
  const [formData, setFormData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [countryNames, setCountryNames] = useState([]);
  const [countryInput, setCountryInput] = useState("");

  // Handle Accordian
  const [expanded, setExpanded] = useState(true); // default open

  const handleAccordian = () => {
    setExpanded((prev) => !prev);
  };

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

  useEffect(() => {
    console.log("Drawer project:", project);
    if (project) {
      setFormData({
        ...project,

        project_date: project.project_date
          ? parseISO(project.project_date)
          : null,

        closure_date: project.closure_date
          ? parseISO(project.closure_date)
          : null,

        invoicing_date: project.invoicing_date
          ? parseISO(project.invoicing_date)
          : null,

        initial_bidded_cpi: project.initial_bidded_cpi?.$numberDecimal || "",

        client_approved_bidded_cpi:
          project.client_approved_bidded_cpi?.$numberDecimal || "",

        supplier_cost: project.supplier_cost?.$numberDecimal || "",

        final_approved_invoicing_cost:
          project.final_approved_invoicing_cost?.$numberDecimal || "",

        gross_margin: project.gross_margin?.$numberDecimal || "",

        profit_margin: project.profit_margin?.$numberDecimal || "",
      });
      const countries = project.country_name
        ? project.country_name.split(",").map((c) => c.trim())
        : [];
      setCountryNames(countries);
      setCountryInput("");
      setIsChanged(false); // reset on project load
    }
  }, [project]);

  useEffect(() => {
    if (formData.invoicing_date) {
      const month = format(
        new Date(formData.invoicing_date),
        "MMMM yy"
      ).replace(" ", "_");
      setFormData((prev) => ({ ...prev, invoicing_month: month }));
    }
  }, [formData.invoicing_date]);

  useEffect(() => {
    if (formData.project_date) {
      const month = format(new Date(formData.project_date), "MMMM yy").replace(
        " ",
        "_"
      );
      setFormData((prev) => ({ ...prev, recieved_month: month }));
    }
  }, [formData.project_date]);

  useEffect(() => {
    const { approved_completes, client_approved_bidded_cpi } = formData;

    if (approved_completes && client_approved_bidded_cpi) {
      const cost = approved_completes * parseFloat(client_approved_bidded_cpi);
      setFormData((prev) => ({ ...prev, final_approved_invoicing_cost: cost }));
    }
  }, [formData.approved_completes, formData.client_approved_bidded_cpi]);

  useEffect(() => {
    const { final_approved_invoicing_cost, supplier_cost } = formData;

    if (final_approved_invoicing_cost && supplier_cost) {
      const margin = final_approved_invoicing_cost - parseFloat(supplier_cost);
      setFormData((prev) => ({ ...prev, gross_margin: margin }));
    }
  }, [formData.final_approved_invoicing_cost, formData.supplier_cost]);

  useEffect(() => {
    const { gross_margin, final_approved_invoicing_cost } = formData;

    if (gross_margin && final_approved_invoicing_cost) {
      const marginPercent =
        (gross_margin / final_approved_invoicing_cost) * 100;
      setFormData((prev) => ({
        ...prev,
        profit_margin: Math.round(marginPercent),
      }));
    }
  }, [formData.gross_margin, formData.final_approved_invoicing_cost]);

  // Populate countryNames when drawer loads or formData changes
  useEffect(() => {
    if (typeof formData?.country_name === "string") {
      setCountryNames(formData.country_name.split(",").map((c) => c.trim()));
    } else if (Array.isArray(formData.country_name)) {
      setCountryNames(formData.country_name);
    } else {
      setCountryNames([]);
    }
  }, [formData.country_name]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value, // don't force to Number — just keep as is
      };

      // Check if the field is different from original project
      const changed = Object.keys(project || {}).some(
        (key) => updated[key] !== project[key]
      );

      setIsChanged(changed);
      return updated;
    });
  };

  const handleDateChange = (fieldName) => (newValue) => {
    const value = typeof newValue === "string" ? parseISO(newValue) : newValue;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [fieldName]: value,
      };

      const changed = Object.keys(project || {}).some(
        (key) => updated[key] !== project[key]
      );

      setIsChanged(changed);
      return updated;
    });
  };

  const handleProjectNameChange = (e) => {
    const value = e.target.value;

    // Ensure projectID stays at the beginning
    if (!value.startsWith(`${formData.project_id}_`)) {
      return; // Prevent removal of projectID
    }

    // Save the updated name (without affecting the prefix)
    setFormData((prev) => ({
      ...prev,
      project_name: value,
    }));

    setIsChanged(true); // or your logic to detect changes
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${formData.project_name}`);
    //alert("Project Name copied!");
    setOpenSnackbar(true);
  };

  const handleUpdate = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const updatedData = {
        ...formData,
        country_name: countryNames.join(","), // Convert back to comma-separated
      };
      await axios.put(`${apiUrl}/api/saleprojects/${project._id}`, updatedData); // use project.id if that's your identifier
      console.log("Updated data:", formData);
      onClose();
      handleSuccess("Project updated successfully.");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  //Udpate the coutry list
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
        const updated = [...countryNames, value];
        setCountryNames(updated);
        updateField("country_name", updated); // Sync to formData
      }
      setCountryInput("");
    } else if (value) {
      showCenteredError("Please enter a valid country name from the list.");
      setCountryInput("");
    }
  };

  const handleCountryBlur = () => {
    if (countryInput && !validCountries.includes(countryInput)) {
      showCenteredError("Please select a valid country from the suggestions.");
      setCountryInput("");
    }
  };

  const handleDeleteCountry = (countryToDelete) => {
    const updated = countryNames.filter((c) => c !== countryToDelete);
    setCountryNames(updated);
    updateField("country_name", updated); // Sync to formData
  };

  const updateField = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      const changed = Object.keys(project || {}).some(
        (key) => updated[key] !== project[key]
      );
      setIsChanged(changed);
      return updated;
    });
  };

  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <Box
        sx={{
          p: 3,
          maxHeight: "90vh",
          overflow: "auto",
          backgroundColor: "#f9f9f9",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            padding: "10px",
            alignItems: "center",
            justifyContent: "center",
            background: "#1976d2",
            color: "#fff",
          }}
        >
          View/Edit Project Details:
        </Typography>

        <Divider
          sx={{
            marginBottom: "15px",
          }}
        />

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2} md={2}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={enGB}
            >
              <DatePicker
                label="Date"
                name="project_date"
                value={formData.project_date || ""}
                onChange={handleDateChange("project_date")}
                inputFormat="dd/MM/yyyy"
                maxDate={new Date()}
                slots={{ textField: (props) => <TextField {...props} /> }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={2} md={2}>
            <TextField
              label="Recieved Month"
              name="recieved_month"
              value={formData.recieved_month}
              fullWidth
            />
          </Grid>
          <Grid item xs={8} md={8}>
            <FormControl fullWidth required>
              <TextField
                label="Project Name"
                name="project_name"
                value={formData.project_name || ""}
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
          </Grid>
        </Grid>

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

        <Accordion
          sx={{ marginTop: "5px" }}
          expanded={expanded}
          onChange={handleAccordian}
        >
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
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="client-name-label">Client Name</InputLabel>
                  <Select
                    labelId="client-name-label"
                    required
                    name="client_name"
                    value={formData.client_name || ""}
                    label="Client Name"
                    onChange={handleChange}
                  >
                    {mockClients.map((rep) => (
                      <MenuItem key={rep._id} value={rep.name}>
                        {rep.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="sales-rep-label">Sales Rep</InputLabel>
                  <Select
                    labelId="sales-rep-label"
                    name="sales_rep"
                    value={formData.sales_rep}
                    label="Sales Rep"
                    onChange={handleChange}
                  >
                    {mockSalesReps.map((rep) => (
                      <MenuItem key={rep._id} value={rep.name}>
                        {rep.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Specification */}
              <Grid item xs={6}>
                <TextField
                  label="Specification"
                  name="specification"
                  required
                  value={formData.specification || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Link Received & Type of Country */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="link-received-label">
                    Link Received
                  </InputLabel>
                  <Select
                    labelId="link-received-label"
                    name="link_received"
                    value={formData.link_received || ""}
                    required
                    label="Link Received"
                    onChange={handleChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12}>
                <Autocomplete
                  disablePortal
                  freeSolo
                  options={validCountries.filter(
                    (country) => !countryNames.includes(country)
                  )}
                  value={null}
                  inputValue={countryInput}
                  onInputChange={(event, newInputValue) => {
                    setCountryInput(newInputValue);
                  }}
                  onChange={handleAddCountry}
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
                  name="loi"
                  type="number"
                  value={formData.loi || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="IR (%)"
                  name="ir"
                  type="number"
                  value={formData.ir || ""}
                  onChange={handleChange}
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
                    name="type"
                    value={formData.type || ""}
                    label="Type"
                    onChange={handleChange}
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
                    name="current_status"
                    value={formData.current_status || ""}
                    label="Current Status"
                    onChange={handleChange}
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
                  name="initial_bidded_cpi"
                  type="number"
                  required
                  value={formData.initial_bidded_cpi}
                  onChange={handleChange}
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
                  name="client_approved_bidded_cpi"
                  type="number"
                  value={formData.client_approved_bidded_cpi}
                  onChange={handleChange}
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
                  name="approved_completes"
                  value={formData.approved_completes || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Rejection"
                  name="rejection"
                  type="number"
                  value={formData.rejection || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Supplier Cost ($)"
                  type="number"
                  name="supplier_cost"
                  value={formData.supplier_cost}
                  onChange={handleChange}
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
                  name="supplier_po"
                  value={formData.supplier_po || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ marginTop: "10px" }}>
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
                    value={formData.closure_date || ""}
                    onChange={handleDateChange("closure_date")}
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
                    value={formData.invoicing_date || ""}
                    onChange={handleDateChange("invoicing_date")}
                    inputFormat="dd/MM/yyyy"
                    slots={{ textField: (props) => <TextField {...props} /> }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={4} md={4}>
                <TextField
                  name="invoicing_month"
                  label="Invoicing Month"
                  value={formData.invoicing_month}
                  fullWidth
                />
              </Grid>
              <Grid item xs={8} md={8}>
                <TextField
                  label="Client Invoice #"
                  name="client_invoice"
                  value={formData.client_invoice}
                  onChange={(e) => setClientInvoice(e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion
          sx={{
            marginTop: "10px",
          }}
        >
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
                  name="final_approved_invoicing_cost"
                  value={formData.final_approved_invoicing_cost}
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
                  name="gross_margin"
                  type="number"
                  value={formData.gross_margin}
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
                  name="profit_margin"
                  type="number"
                  value={formData.profit_margin}
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

        <TextField
          label="Remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          sx={{
            marginTop: "10px",
          }}
        />

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          {isChanged && (
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Update
            </Button>
          )}
        </Box>
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
    </Drawer>
  );
};

export default SalesProjectDrawer;
