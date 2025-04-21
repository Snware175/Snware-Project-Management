const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const dbURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGO_URI // Atlas URI (includes database name)
        : `${process.env.MONGO_URI}/SNWDB`; // Local URI

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
