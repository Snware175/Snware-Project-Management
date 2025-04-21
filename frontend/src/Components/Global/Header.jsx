import React from "react";
import { Link } from "react-router-dom";
import logo from "../../Image/snwlogo.png";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import AccountMenu from "./AccountMenu";
import Button from "@mui/material/Button";
import { useUser } from "../../Contexts/UserContext";

const Header = () => {
  const { user } = useUser();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left: Logo */}
        <Box>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ width: "185px" }} />
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "8px",
            marginLeft: "-700px",
          }}
        >
          <Link to="/">
            <Button
              rel="noopener"
              sx={{
                color: "#b3015c",
                backgroundColor: "default",
                fontSize: "15px",
                fontWeight: "600",
                padding: "5px 7px",
                borderRadius: "8px",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#b3015c",
                  color: "#fff",
                  transform: "scale(1.05)",
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              Home
            </Button>
          </Link>
          {user?.role !== "Executive" && (
            <Link to="/admin">
              <Button
                rel="noopener"
                sx={{
                  color: "#b3015c",
                  backgroundColor: "default",
                  fontSize: "15px",
                  fontWeight: "600",
                  padding: "5px 7px",
                  borderRadius: "8px",
                  transition: "transform 0.2s ease, background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#b3015c",
                    color: "#fff",
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
                  },
                  "&:active": {
                    transform: "scale(0.95)",
                  },
                }}
              >
                Admin
              </Button>
            </Link>
          )}
        </Box>

        {/* Right: Profile Menu */}
        <Box>
          <AccountMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
