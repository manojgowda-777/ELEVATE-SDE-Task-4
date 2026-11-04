
const { activeTokens } = require("../middleware/authMiddleware");
const db = require("../config/db");
const { randomUUID } = require("crypto");
const crypto = require("crypto");
const { promisify } = require("util");

const scrypt = promisify(crypto.scrypt);

// POST /api/admin/login
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate login fields
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        // Find admin account
        const [rows] = await db.execute(
            "SELECT username, password FROM admins WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Get stored password hash
        const storedPassword = rows[0].password;
        const parts = storedPassword.split("$");

        if (parts.length !== 3 || parts[0] !== "scrypt") {
            return res.status(401).json({
                success: false,
                message: "Admin password is not securely configured"
            });
        }

        const salt = parts[1];
        const storedHash = Buffer.from(parts[2], "hex");

        // Hash the entered password using the stored salt
        const enteredHash = await scrypt(password, salt, 64);

        // Compare both hashes securely
        if (
            storedHash.length !== enteredHash.length ||
            !crypto.timingSafeEqual(storedHash, enteredHash)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        // Generate login token
        const token = crypto.randomUUID();
        activeTokens.add(token);

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token: token
        });

    } catch (error) {
        console.error("Admin Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Admin login failed"
        });
    }
};

// GET /api/admin/applications
const getAllApplications = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM applications ORDER BY submittedAt DESC"
        );

        return res.status(200).json({
            success: true,
            applications: rows
        });

    } catch (error) {
        console.error("Fetch Applications Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
};

// PATCH /api/admin/applications/:applicationId/approve
const approveApplication = async (req, res) => {
    let connection;

    try {
        // Get database connection safely
        connection = await db.getConnection();

        const { applicationId } = req.params;

        // Start database transaction
        await connection.beginTransaction();

        // Check whether application exists
        const [rows] = await connection.execute(
            "SELECT status FROM applications WHERE applicationId = ?",
            [applicationId]
        );

        if (rows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (rows[0].status !== "Pending") {
            await connection.rollback();

            return res.status(400).json({
                success: false,
                message: "Application is already processed"
            });
        }

        // Generate unique Certificate ID
        const certificateId = "CERT-" + randomUUID()
            .replace(/-/g, "")
            .substring(0, 12)
            .toUpperCase();

        // Update application status
        await connection.execute(
            "UPDATE applications SET status = 'Approved' WHERE applicationId = ?",
            [applicationId]
        );

        // Create certificate record
        await connection.execute(
            `INSERT INTO certificates (certificateId, applicationId)
             VALUES (?, ?)`,
            [certificateId, applicationId]
        );

        // Save both changes together
        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Application approved successfully",
            certificateId: certificateId
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error("Approval Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to approve application"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// PATCH /api/admin/applications/:applicationId/reject
const rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { reason } = req.body || {};

        // Check whether application exists
        const [rows] = await db.execute(
            "SELECT status FROM applications WHERE applicationId = ?",
            [applicationId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (rows[0].status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Application is already processed"
            });
        }

        // Update application status
        await db.execute(
            "UPDATE applications SET status = 'Rejected' WHERE applicationId = ?",
            [applicationId]
        );

        return res.status(200).json({
            success: true,
            message: "Application rejected successfully",
            applicationId: applicationId,
            reason: reason || "No reason provided"
        });

    } catch (error) {
        console.error("Rejection Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to reject application"
        });
    }
};

// GET /api/admin/certificates
const getAllCertificates = async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                c.certificateId,
                c.applicationId,
                a.name,
                c.issuedOn,
                c.status
             FROM certificates c
             JOIN applications a
             ON c.applicationId = a.applicationId
             ORDER BY c.issuedOn DESC`
        );

        return res.status(200).json({
            success: true,
            certificates: rows
        });

    } catch (error) {
        console.error("Fetch Certificates Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch certificates"
        });
    }
};

// GET /api/admin/certificates/:certificateId/revoke
const revokeCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const [rows] = await db.execute(
            "SELECT status FROM certificates WHERE certificateId = ?",
            [certificateId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        if (rows[0].status === "Revoked") {
            return res.status(400).json({
                success: false,
                message: "Certificate is already revoked"
            });
        }

        await db.execute(
            "UPDATE certificates SET status = 'Revoked' WHERE certificateId = ?",
            [certificateId]
        );

        return res.status(200).json({
            success: true,
            message: "Certificate revoked successfully",
            certificateId: certificateId,
            status: "Revoked"
        });

    } catch (error) {
        console.error("Revoke Certificate Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to revoke certificate"
        });
    }
};

// Export all controller functions
module.exports = {
    adminLogin,
    getAllApplications,
    approveApplication,
    rejectApplication,
    getAllCertificates,
    revokeCertificate
};
