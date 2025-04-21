import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../../utils";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

import axios from "axios";
import { useUser } from "../../Contexts/UserContext";

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    //navigate("/profile");
  };

  const handleProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };

  const { user, setUser } = useUser(); // Get user from context
  const [loggedUser, setLoggedUser] = useState("");
  const [loggedEmail, setLoggedEmail] = useState("");

  // Optional: If user context doesn't have data, you can fetch from backend
  useEffect(() => {
    if (user) {
      setLoggedUser(user.name);
      setLoggedEmail(user.email);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${apiUrl}/auth/logout`, {}, { withCredentials: true });

      setUser(null); // clear context
      localStorage.setItem("logout-event", Date.now());
      handleSuccess("Logged out successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Profile">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2, background: "#b3015c" }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40, background: "#b3015c" }}>
              {loggedUser[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: 250,
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "bold",
            paddingBottom: "1px",
          }}
        >
          {loggedUser}
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            fontStyle: "italic",
            padding: "5px",
            marginBottom: "3px",
          }}
        >
          {loggedEmail}
        </span>
        <Divider />
        <MenuItem onClick={handleProfile}>
          <Avatar>{loggedUser[0]}</Avatar> Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          <ListItemIcon sx={{ color: "red" }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
