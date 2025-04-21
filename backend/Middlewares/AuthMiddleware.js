const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Check for token in cookies or headers
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    //console.log("User from Token: ", req.user);
    next();
  });
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    //console.log("User Role:", userRole, "Type of Role:", typeof userRole);
    //console.log("Allowed Roles:", roles);

    if (!roles.includes(userRole)) {
      console.log(`🚫 Access denied for role: ${userRole}`);
      return res
        .status(403)
        .json({ message: "Access denied, insufficient role." });
    }

    next();
  };
};

module.exports = { verifyToken, allowRoles };
