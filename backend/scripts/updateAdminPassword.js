
const mysql = require("mysql2/promise");
const crypto = require("crypto");
const { promisify } = require("util");
require("dotenv").config();

const scrypt = promisify(crypto.scrypt);

async function updateAdminPassword() {
    let connection;

    try {
        // Ask for the existing admin password
        const readline = require("readline");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const password = await new Promise((resolve) => {
            rl.question("Enter your admin password: ", (answer) => {
                rl.close();
                resolve(answer);
            });
        });

        // Check password length
        if (!password || password.length < 8) {
            throw new Error("Password must contain at least 8 characters");
        }

        // Generate a random salt
        const salt = crypto.randomBytes(16).toString("hex");

        // Convert password into a secure hash
        const hash = await scrypt(password, salt, 64);

        // Combine salt and hash for database storage
        const storedPassword =
            `scrypt$${salt}$${hash.toString("hex")}`;

        // Connect to MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        // Update the existing admin password
        const [result] = await connection.execute(
            "UPDATE admins SET password = ? WHERE username = ?",
            [storedPassword, "admin"]
        );

        if (result.affectedRows === 0) {
            throw new Error("Admin account not found");
        }

        console.log("Admin password successfully secured!");

    } catch (error) {
        console.error("Password update failed:", error.message);

    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateAdminPassword();
