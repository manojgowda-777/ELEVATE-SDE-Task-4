const db = require("../config/db");

// GET /api/certificates/verify/:certificateId
const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        // Find certificate and applicant details
        const [rows] = await db.execute(
            `SELECT 
                c.certificateId,
                a.name,
                a.phone,
                c.issuedOn,
                c.status
             FROM certificates c
             JOIN applications a
             ON c.applicationId = a.applicationId
             WHERE c.certificateId = ?`,
            [certificateId]
        );

        // Check whether certificate exists
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        return res.status(200).json({
            success: true,
            ...rows[0]
        });

    } catch (error) {
        console.error("Certificate Verification Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to verify certificate"
        });
    }
};

// Export controller function
module.exports = { verifyCertificate };