// server/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-assessment.vercel.app" // replace with your deployed frontend URL
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); // parse JSON bodies
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  process.exit(1); // stop server if DB fails
});
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/auth", require("./routes/auth"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
