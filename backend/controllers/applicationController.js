const db = require("../config/db");
const { randomUUID } = require("crypto");

// POST /api/applications
const createApplication = async (req, res) => {
    try {
        const { name, phone, gender, city, state } = req.body;

        // Validate required fields
        if (!name || !phone || !gender || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Generate unique Application ID
        const applicationId = "APP-" + randomUUID()
            .replace(/-/g, "")
            .substring(0, 12)
            .toUpperCase();

        // Insert application into MySQL
        const sql = `
            INSERT INTO applications
            (applicationId, name, phone, gender, city, state)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await db.execute(sql, [
            applicationId,
            name,
            phone,
            gender,
            city,
            state
        ]);

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully!",
            applicationId: applicationId,
            status: "Pending"
        });

    } catch (error) {
        console.error("Application Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to submit application"
        });
    }
};

// GET /api/applications/track/:applicationId
const trackApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        // Find application using its ID
        const [rows] = await db.execute(
            `SELECT applicationId, name, status, submittedAt
             FROM applications
             WHERE applicationId = ?`,
            [applicationId]
        );

        // Check whether application exists
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            ...rows[0]
        });

    } catch (error) {
        console.error("Tracking Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to track application"
        });
    }
};

// Export both functions
module.exports = {
    createApplication,
    trackApplication
};