import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/users", userRoutes);

// Static Uploads Folder
app.use("/uploads", express.static("uploads"));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 NoteSphere API Running");
});

// Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});