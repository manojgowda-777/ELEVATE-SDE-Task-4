# CredVault – Certificate Issuing & Verification Platform

## Elevate SDE Internship – Task 3

CredVault is a backend application developed for managing certificate requests, issuing certificates, tracking applications, and verifying certificates.

The system provides APIs for citizens to submit and track certificate applications and for administrators to approve or reject applications, manage certificates, and revoke issued certificates.

## Features

- Submit certificate applications.
- Track application status using an Application ID.
- Verify certificates using a Certificate ID.
- Admin login with password hashing.
- View all submitted applications.
- Approve or reject applications.
- Automatically generate a Certificate ID when an application is approved.
- View all issued certificates.
- Revoke issued certificates.
- Protect admin APIs using token-based authentication.

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API development |
| MySQL | Database |
| MySQL2 | MySQL connectivity |
| JavaScript | Backend programming |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd elevate-sde-task-3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root directory using `.env.example` as a reference.

Add your own MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=credvault_db
DB_PORT=3306
```

**Note:** Never upload your actual `.env` file or database password to GitHub.

### 4. Create the MySQL Database

Create a database named:

```sql
CREATE DATABASE credvault_db;
```

Create the following three tables according to the project database structure:

- `applications`
- `certificates`
- `admins`

The database should contain the columns specified in the project requirements.

### 5. Configure Admin Password

Run the password update script:

```bash
node scripts/updateAdminPassword.js
```

Enter your chosen admin password when prompted. The script securely hashes the password before storing it in the database.

### 6. Start the Backend Server

Development:

```bash
npm run dev
```

Production/start command:

```bash
npm start
```

The backend runs at:

```text
http://localhost:5000
```

## API Endpoints

### 1. Application APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/applications` | Submit a certificate application |
| GET | `/api/applications/track/:applicationId` | Track application status |

### 2. Certificate APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/certificates/verify/:certificateId` | Verify a certificate |

### 3. Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/applications` | View all applications |
| PATCH | `/api/admin/applications/:applicationId/approve` | Approve an application |
| PATCH | `/api/admin/applications/:applicationId/reject` | Reject an application |
| GET | `/api/admin/certificates` | View all certificates |
| GET | `/api/admin/certificates/:certificateId/revoke` | Revoke a certificate |

**Note:** All admin APIs except the login endpoint require a valid Bearer token.

## Authentication

1. Send a POST request to `/api/admin/login` with the admin username and password.
2. Receive an authentication token after successful login.
3. Include the token in the Authorization header when accessing protected admin APIs.

Example:

```text
Authorization: Bearer YOUR_TOKEN
```

Admin passwords are stored as salted scrypt hashes rather than plain text.

## Application Status

Applications can have the following statuses:

- Pending
- Approved
- Rejected

## Certificate Status

Certificates can have the following statuses:

- Valid
- Revoked

## Error Handling

The APIs use appropriate HTTP status codes:

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Application created successfully |
| 400 | Invalid request |
| 401 | Unauthorized |
| 404 | Resource not found |
| 500 | Internal server error |

## Security

- Database credentials are managed through environment variables.
- Actual `.env` files are excluded from Git using `.gitignore`.
- Admin passwords are stored using scrypt hashing with random salts.
- Protected admin endpoints require Bearer token authentication.

## Project Information

**Project:** CredVault – Certificate Issuing & Verification Platform

**Assignment:** Elevate SDE Internship – Task 3

**Backend:** Node.js, Express.js

**Database:** MySQL

**Author:** Manoj S
