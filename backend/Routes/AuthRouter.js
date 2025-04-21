const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const { verifyToken, allowRoles } = require("../Middlewares/AuthMiddleware");
const {
  signupValidation,
  loginValidation,
} = require("../Middlewares/AuthValidation");
const {
  signup,
  login,
  logout,
  me,
  forgotPassword,
  updatePassword,
} = require("../Controlers/AuthController");

// 🔐 Public Routes
router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/update-password", updatePassword);

// ✅ Protected Route: Get Authenticated User Info
// Make sure this route is protected with verifyToken
router.get("/me", verifyToken, me); // This will now check if the user is authenticated

router.use(verifyToken); // This will protect all routes below this line

// ✅ Sensitive Route under `/auth` (now protected)
router.get(
  "/auth",
  verifyToken, // Ensure user is authenticated
  allowRoles("Admin", "Super Admin"), // Only allow Admin or Super Admin to access
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "You are authenticated and authorized",
    });
  }
);

// ✅ Protected Route: Get All Users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Protected Route: Update User Status
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
