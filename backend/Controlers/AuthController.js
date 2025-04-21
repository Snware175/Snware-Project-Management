const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel"); // Your Mongoose user schema
const sendEmail = require("../Utils/sendEmail");

const signup = async (req, res) => {
  try {
    console.log("🛠️ Received Signup Request:", req.body);

    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role || !department) {
      return res
        .status(400)
        .json({ message: "All fields are required.", success: false });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      is_active: 1, // default active
      created_at: new Date(),
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully.", success: true });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.is_active !== 1) {
      return res.status(403).json({ message: "Your account is disabled" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        department: user.department,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // ✅ Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for production
      sameSite: "none", // ✅ allow frontend-backend cross-site cookie
      maxAge: 8 * 60 * 60 * 1000, //8 hours
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const me = (req, res) => {
  const token = req.cookies.token;
  console.log("🔍 Token in /auth/me:", token);

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, user: decoded });
  } catch (err) {
     console.log("❌ JWT Verification Failed:", err.message);
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate temp password
    const tempPassword = Math.random().toString(36).slice(-8); // 8 chars
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Send Email
    const subject = "Password Reset - Snware Project";
    const text = `Hello ${user.name},

Here is your temporary password: ${tempPassword}

Please log in and change your password as soon as possible.

Regards,
Snware Project Team`;

    await sendEmail(email, subject, text);

    res.json({
      success: true,
      message: "Temporary password sent to your email.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  me,
  forgotPassword,
  updatePassword,
};
