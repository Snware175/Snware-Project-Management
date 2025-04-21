const express = require("express");
const router = express.Router();
const User = require("../Models/UserModel"); // Mongoose User schema

// ✅ Fetch Active Sales Reps
router.get("/", async (req, res) => {
  try {
    const salesReps = await User.find({
      department: { $regex: /Sales/i }, // case-insensitive match
      is_active: 1,
    }).select("id name");

    res.json(salesReps);
  } catch (error) {
    console.error("Error fetching Sales Reps:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
