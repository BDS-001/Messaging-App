// --- Imports and Configuration ---
require("dotenv").config();
const express = require('express')
const app = express()
const cors = require('cors');

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Server Configuration and Startup ---
if (require.main === module) {
    const PORT = parseInt(process.env.USE_PORT, 10) || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Visit: http://localhost:${PORT}/`);
    });
}
