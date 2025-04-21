const express = require("express");
const router = express.Router();
const Client = require("../Models/ClientModel"); // Mongoose model

// ✅ Create New Client
router.post("/", async (req, res) => {
  try {
    const { name, is_active } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Client name is required" });
    }

    const newClient = new Client({
      name,
      is_active: is_active ?? 1,
    });

    await newClient.save();

    res
      .status(201)
      .json({ message: "Client added successfully", success: true });
  } catch (error) {
    console.error("Error adding Client:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Clients
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching Clients:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update Client Status (is_active)
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ message: "is_active field is required" });
    }

    await Client.findByIdAndUpdate(id, { is_active });

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating Client status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
