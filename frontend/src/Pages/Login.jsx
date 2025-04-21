import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import logo from "../Image/snwlogo.png";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import Footer from "../Components/Global/Footer";

import { useUser } from "../Contexts/UserContext";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value.trim(), // Optional: trims whitespace
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("All fields are required.");
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      handleSuccess(response.data.message);
      console.log("✅ Login response:", response);
      console.log(response.data.department);

      // ✅ Save user info globally
      setUser({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        department: response.data.department,
      });

      // Redirect to dashboard
      navigate("/home");
    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.response?.status === 401) {
        handleError("Invalid email or password.");
      } else if (error.response?.status === 403) {
        handleError("Your account is disabled. Please contact your manager.");
      } else if (error.response?.status === 500) {
        handleError("Server error! Please try again later.");
      } else {
        handleError("Something went wrong!");
      }
    }
  };

  const handleForgotPassword = async () => {
    let email = loginInfo.email;

    if (!email) {
      email = window.prompt("Please enter your email:");
      if (!email) return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      await axios.post(`${apiUrl}/auth/forgot-password`, { email });
      handleSuccess("Check your email for a new password.");
    } catch (err) {
      console.error(err);
      handleError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link to="/">
          <img src={logo} alt="Logo" style={{ width: "185px" }} />
        </Link>

        <Typography
          type="h6"
          sx={{
            marginLeft: "15%",
            fontFamily: "serif",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          SNWARE PROJECT MANAGEMENT TOOL
        </Typography>
      </Box>
      <div className="body-wrapper">
        <Container maxWidth="sm">
          <Box p={3} boxShadow={3} borderRadius={3}>
            <Typography variant="h4" mb={2}>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email"
                name="email"
                value={loginInfo.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                margin="normal"
              />

              <TextField
                label="Password"
                name="password"
                value={loginInfo.password}
                onChange={handleChange}
                fullWidth
                required
                type={showPassword ? "text" : "password"}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Link
                  href="#"
                  variant="body2"
                  onClick={handleForgotPassword}
                  sx={{
                    color: "#7e0034f2",
                    textDecorationColor: "#7e0034f2",
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, background: "#7e0034f2" }}
              >
                Login
              </Button>
            </form>
          </Box>
          <ToastContainer />
        </Container>
      </div>
      <Footer />
    </>
  );
}

export default Login;
