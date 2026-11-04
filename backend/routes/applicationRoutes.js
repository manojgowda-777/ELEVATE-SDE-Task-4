const express = require("express");
const router = express.Router();

// Import application controller functions
const {
    createApplication,
    trackApplication
} = require("../controllers/applicationController");

// API 1: Request Certificate
router.post("/", createApplication);

// API 2: Track Application
router.get("/track/:applicationId", trackApplication);

module.exports = router;