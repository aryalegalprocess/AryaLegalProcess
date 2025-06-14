const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const Contact = require("./models/contact");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://www.aryalegalprocess.com",
  methods: ["GET", "POST"],
}));

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    // no need to add useNewUrlParser and useUnifiedTopology here, they are defaults now
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// POST route to submit contact form data
app.post("/api/contact", async (req, res) => {
    try {
        console.log("Form data received:", req.body);  // Logging request body
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (err) {
        console.error("Error submitting form:", err);  // Log error
        res.status(500).json({ error: "Failed to submit form." });
    }
});


app.get("/api/contact", async (req, res) => {
    console.log("GET /api/contact was hit"); // Add this
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ error: "Failed to fetch contacts." });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});