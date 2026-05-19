const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const wasteLogRoutes = require("./routes/wasteLogs");
const auditRoutes = require("./routes/auditReport");
const emailRoutes = require("./routes/emailRoutes");
require("./utils/scheduler");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/wastelogs", wasteLogRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => res.send("EcoTrack API is running..."));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected: ecotrack");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });