const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const Contact = require("./models/contact");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Log requests
app.use((req, res, next) => {
  console.log(`→ ${req.method} ${req.url}`);
  next();
});

// CORS setup
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
}));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Serve static files — THIS must come before routes
app.use(express.static(path.join(__dirname, "public")));

// ✅ API routes
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit form." });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// ✅ Root route - fallback to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});