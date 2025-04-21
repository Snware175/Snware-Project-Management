const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./Models/db");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT;
const AuthRouter = require("./Routes/AuthRouter");
const salesRepRoutes = require("./Routes/salesRepRoutes");
const clientRepRoutes = require("./Routes/clientRoutes");
const saleProjectsRoutes = require("./Routes/saleProjects");

const allowedOrigins = {
  development: "http://localhost:5173", // Vite default dev server port
  production: "https://snware-project-management-frontend.vercel.app",
};

app.use(
  cors({
    origin: allowedOrigins[process.env.NODE_ENV], // dynamic origin
    credentials: true, // 👈 Important for cookies
  })
);

//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.send("PONG");
});

connectDB();

const bcrypt = require("bcrypt");

async function hashPassword() {
  const hashed = await bcrypt.hash("Prakash@175", 10);
  console.log("Hashed:", hashed);
}
//hashPassword();

app.use("/auth", AuthRouter);
app.use("/api/sales-reps", salesRepRoutes);
app.use("/api/clients", clientRepRoutes);
app.use("/api/saleprojects", saleProjectsRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
