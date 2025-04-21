import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Global/Header";
import Footer from "../Components/Global/Footer";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

import {
  Box,
  Button,
  Chip,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: "Executive", // Default role
    department: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const departmentList = ["Sales", "Marketing", "Programming"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (event) => {
    const {
      target: { value },
    } = event;
    setSignupInfo((prev) => ({
      ...prev,
      department: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, role, department } = signupInfo;

    if (!name || !email || !password || !role || !department) {
      return handleError("All fields are required.");
    }
    if (!email.endsWith("@snwareresearch.com")) {
      return handleError("Only @snwareresearch.com emails are allowed!");
    }

    if (!passwordRegex.test(password)) {
      return handleError(
        "Password must be at least 6 characters and include a letter, number, and special character."
      );
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${apiUrl}/auth/signup`, signupInfo);

      const { success, message, error } = response.data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(error?.details?.[0]?.message || message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      handleError(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Header />
      <div className="body-wrapper">
        <Box
          sx={{
            maxWidth: 500,
            mx: "auto",
            p: 3,
            marginTop: "11px",
            overflow: "hidden",
            width: "90%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0px 1px 5px 2px rgb(0, 0, 0, 0.4)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Create Account
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              label="Full Name"
              name="name"
              required
              value={signupInfo.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoFocus
            />

            <TextField
              label="Email"
              name="email"
              required
              value={signupInfo.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="email"
            />

            <TextField
              label="Password"
              name="password"
              required
              value={signupInfo.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText>
              Must be at least 6 characters and include 1 letter, 1 number, and
              1 special character.
            </FormHelperText>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                marginTop: "5px",
              }}
            >
              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  required
                  value={signupInfo.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="Super Admin">Super Admin</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Executive">Executive</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ flex: 1 }}>
                <InputLabel id="department-label">Department</InputLabel>
                <Select
                  labelId="department-label"
                  required
                  multiple
                  value={signupInfo.department}
                  onChange={handleDepartmentChange}
                  input={<OutlinedInput label="Department" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {departmentList.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Checkbox
                        checked={signupInfo.department.indexOf(dept) > -1}
                      />
                      <ListItemText primary={dept} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, background: "#b3015c" }}
            >
              Add User
            </Button>
          </form>
          <ToastContainer />
        </Box>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
