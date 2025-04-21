import React, { useState, useEffect } from "react";
import Header from "../Components/Global/Header";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import SalesForm from "../Components/Sales/SalesForm"; // Adjust the path as per your folder structure
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import Footer from "../Components/Global/Footer";
import { Typography, Tabs, Tab } from "@mui/material";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import SalesProjectTable from "../Components/Sales/SalesProjectTable";
import PrgrammingProjectTable from "../Components/Programming/PrgrammingProjectTable";

function Home() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const [mockClients, setMockClients] = useState([]);
  const [mockSalesReps, setMockSalesReps] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();

      if (
        key === "f" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement.tagName
        )
      ) {
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  //API Control

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${apiUrl}/auth`);

        const filteredReps = response.data.filter(
          (rep) => rep.is_active === 1 && rep.department.includes("Sales")
        );

        setMockSalesReps(filteredReps);
      } catch (error) {
        console.error("Error fetching Sales Reps:", error);
      }
    };

    fetchSalesReps();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${apiUrl}/api/clients`);

        // Filter active clients only
        const activeClients = response.data.filter(
          (client) => client.is_active === 1
        );

        setMockClients(activeClients);
      } catch (error) {
        console.error("Error fetching Clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <Header />

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 1 }}>
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="Departments tabs"
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab
            label="Sales"
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
            label="Programming"
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

      <div className="projectTable">
        {tabIndex === 0 && (
          <SalesProjectTable
            handleOpen={handleOpen}
            mockClients={mockClients}
            mockSalesReps={mockSalesReps}
          />
        )}

        {tabIndex === 1 && <PrgrammingProjectTable />}
      </div>

      {/* Modal Component */}
      <Modal
        open={open}
        onClose={() => {}}
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

          {/* Sales Form */}
          <SalesForm
            handleClose={handleClose}
            mockClients={mockClients}
            mockSalesReps={mockSalesReps}
          />
        </Box>
      </Modal>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Home;
