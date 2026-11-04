const applicationRoutes = require("./routes/applicationRoutes");
const express = require("express");
const cors = require("cors");
const certificateRoutes = require("./routes/certificateRoutes");
const adminRoutes = require("./routes/adminRoutes");
require("dotenv").config();

// Import MySQL database connection
const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic test route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CredVault Backend API is running!"
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.use("/api/applications", applicationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin", adminRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
