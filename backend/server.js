const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoute");
const doctorRoutes = require("./routes/doctorRoute");
const connectDb = require("./config/connectDb");
const path = require("path");

// Load environment variables
dotenv.config();
connectDb();

// Create express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);

// Serve static files
const staticFilesPath = path.join(__dirname, "client", "build");
app.use(express.static(staticFilesPath));

// Route for any other requests
app.get("*", function (req, res) {
  res.sendFile(path.join(staticFilesPath, "index.html"));
});

// Port configuration
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.magenta);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
