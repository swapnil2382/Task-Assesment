const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://task-assesment-ten.vercel.app"
];

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy does not allow access from origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Handle preflight requests for all routes
app.options("*", cors());

// Body parser
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // stop server if DB fails
  });

// Additional connection logging
mongoose.connection.on("error", err => console.error("MongoDB Error:", err));
mongoose.connection.on("connected", () => console.log("MongoDB connected event fired"));

// Routes
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/auth", require("./routes/auth"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
