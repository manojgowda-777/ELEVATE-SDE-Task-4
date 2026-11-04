const crypto = require("crypto");

// Store active admin login tokens
const activeTokens = new Set();

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Admin authentication required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!activeTokens.has(token)) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired admin token"
        });
    }

    next();
};

module.exports = { authenticateAdmin, activeTokens };