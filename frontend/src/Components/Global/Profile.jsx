import React, { useState } from "react";
import { useUser } from "../../Contexts/UserContext";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import Header from "./Header";
import Footer from "./Footer";
import { handleError, handleSuccess } from "../../utils";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const Profile = () => {
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return handleError("Please fill in all password fields.");
    }

    if (newPassword !== confirmPassword) {
      return handleError("New password and confirm password do not match.");
    }

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${apiUrl}/auth/update-password`,
        {
          email: user.email,
          currentPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      handleSuccess(response.data.message);
      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Update password error:", err);
      handleError(err.response?.data?.message || "Password update failed.");
    }
  };

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <>
      <Header />
      <div className="body-wrapper">
        <Box p={3} maxWidth="800px" mx="auto">
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                background: "#b3015c",
                color: "#fff",
                padding: 1,
              }}
            >
              User Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Name:
                </Typography>
                <Typography variant="body1">{user.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Email:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Role:
                </Typography>
                <Typography variant="body1">{user.role}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "15px",
                  }}
                >
                  Departments:
                </Typography>
                <Typography variant="body1">
                  {Array.isArray(user.department)
                    ? user.department.join(", ")
                    : user.department}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box mt={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  background: "#b3015c",
                  color: "#fff",
                  padding: 1,
                }}
              >
                Change Password
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdatePassword}
                  sx={{ mt: 2, ml: 2 }}
                >
                  Update Password
                </Button>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Profile;
