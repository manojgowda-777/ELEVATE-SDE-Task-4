const express = require("express");
const router = express.Router();

// Import controller functions

const {
    adminLogin,
    getAllApplications,
    approveApplication,
    rejectApplication,
    getAllCertificates,
    revokeCertificate
} = require("../controllers/adminController");

// Import authentication middleware
const { authenticateAdmin } = require("../middleware/authMiddleware");

// API 4: Admin Login
router.post("/login", adminLogin);

// API 5: Admin List Applications
router.get("/applications", authenticateAdmin, getAllApplications);

// API 6: Approve Application
router.patch(
    "/applications/:applicationId/approve",
    authenticateAdmin,
    approveApplication
);
// API 7: Reject Application (Protected)
router.patch(
    "/applications/:applicationId/reject",
    authenticateAdmin,
    rejectApplication
);
// API 8: Admin List Certificates (Protected)
router.get(
    "/certificates",
    authenticateAdmin,
    getAllCertificates
);
// API 9: Revoke Certificate (Protected)
router.get(
    "/certificates/:certificateId/revoke",
    authenticateAdmin,
    revokeCertificate
);

module.exports = router;