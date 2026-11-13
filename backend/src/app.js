
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
].filter(Boolean);

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    }
}));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "ClientFlow API is running"
    });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is running successfully"
    });
});

module.exports = app;
