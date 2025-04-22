const express = require("express");
const router = express.Router();
const SaleProject = require("../Models/SaleProjectSchema"); // Import your Mongoose model

// GET all sale projects
router.get("/", async (req, res) => {
  try {
    const { from, to, client, status } = req.query;
    const filter = {};
    console.log("Query received:", req.query);

    if (from && to) {
      filter.project_date = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    if (client && client !== "all") {
      filter.client_name = client;
    }

    if (status && status !== "all") {
      filter.current_status = status;
    }

    console.log("Final filter being used:", filter);

    const projects = await SaleProject.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// POST to add a new sales project
router.post("/", async (req, res) => {
  try {
    const { project_id, project_name } = req.body;

    if (!project_id || !project_name) {
      return res
        .status(400)
        .json({ error: "Project ID and Project Name are required" });
    }

    // Step 1: Get the last inserted project
    const latestProject = await SaleProject.findOne().sort({ createdAt: -1 });

    // Step 2: Extract year & generate serial
    const currentYear = new Date().getFullYear().toString().slice(-2); // e.g. '25'
    let serial = 1;

    if (latestProject && latestProject.project_id) {
      const lastId = latestProject.project_id;
      const lastSerial = parseInt(lastId.slice(5)); // Remove 'SNW25' and parse
      if (!isNaN(lastSerial)) {
        serial = lastSerial + 1;
      }
    }

    const newProjectId = `SNW${currentYear}${serial
      .toString()
      .padStart(6, "0")}`;

    // Step 3: Set it in req.body
    req.body.project_id = newProjectId;

    const newProject = new SaleProject(req.body);
    const savedProject = await newProject.save();

    res.json({
      message: "Project saved successfully",
      project_id: newProjectId,
      id: savedProject._id,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// GET next project_id
router.get("/generate-id", async (req, res) => {
  try {
    const lastProject = await SaleProject.findOne().sort({ createdAt: -1 });

    const currentYear = new Date().getFullYear().toString().slice(-2); // e.g., "25"
    let nextNumber = 1;

    if (lastProject && lastProject.project_id) {
      const match = lastProject.project_id.match(/^SNW(\d{2})(\d{6})$/);
      if (match && match[1] === currentYear) {
        nextNumber = parseInt(match[2], 10) + 1;
      }
    }

    const nextID = `SNW${currentYear}${String(nextNumber).padStart(6, "0")}`;

    res.json({ project_id: nextID });
  } catch (err) {
    console.error("Error generating project ID:", err);
    res.status(500).json({ error: "Failed to generate project ID" });
  }
});

// PUT to update a sales project by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedProject = await SaleProject.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Failed to update", details: err.message });
  }
});

module.exports = router;
