
const mysql = require("mysql2/promise");
require("dotenv").config();

// Create a connection pool for MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Check whether the database connection works
db.getConnection()
    .then((connection) => {
        console.log("MySQL Database Connected Successfully!");
        connection.release();
    })
    .catch((error) => {
        console.error("Database Connection Failed:", error.message);
    });

module.exports = db;
