import React, { useState } from "react";
import Header from "../Components/Global/Header";
import Footer from "../Components/Global/Footer";
import { Box, Tabs, Tab, Typography } from "@mui/material";

import Clients from "../Components/Global/Clients";
import { ToastContainer } from "react-toastify";
import UserControl from "../Components/Global/UserControl";

function Admin() {
  const [tabIndex, setTabIndex] = useState(0); // Default: User tab

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const activeColor = "#b3015c";

  return (
    <>
      <Header />
      <div className="Admin-body">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2, mt: 1 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="admin tabs"
            TabIndicatorProps={{ style: { display: "none" } }}
          >
            <Tab
              label="Users"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: tabIndex === 0 ? "#b3015c" : "#d487b1",
                color: "#ffffff ! important",
                borderRadius: "6px 6px 0 0",
                marginRight: 1,
                marginLeft: 3,
                px: 3,
                py: 1.5,
                minHeight: "48px",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            />
            <Tab
              label="Clients"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                backgroundColor: tabIndex === 1 ? "#b3015c" : "#d487b1",
                color: "#ffffff ! important",
                borderRadius: "6px 6px 0 0",
                marginRight: 1,
                px: 3,
                py: 1.5,
                minHeight: "48px",
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {tabIndex === 0 && <UserControl />}
          {tabIndex === 1 && <Clients />}
        </Box>

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
}

export default Admin;
