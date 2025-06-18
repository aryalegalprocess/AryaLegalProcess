const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Contact = require('./models/contact');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
  origin: [
    "https://www.aryalegalprocess.com",
    "https://aryalegalprocess.com",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ✅ Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// --- MongoDB connections ---

// Products DB
const productConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const productSchema = new mongoose.Schema({
  barcode: String,
  name: String,
  details: String,
  weight: String,
  quantity: String,
  company: String,
  description: String,
  startDate: String,
  endDate: String,
  price: String,
  image: String
});
const Product = productConnection.model('Product', productSchema);

// Companies DB
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const Company = require('./models/company');

// Default connection for Contact
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// --- Routes ---

// Products
const productRoutes = require('./server/routes/products')(Product);
app.use('/api/products', productRoutes);

// Companies
const companyRoutes = require('./server/routes/companies')(Company);
app.use('/api/companies', companyRoutes);

// Contact POST
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Error submitting form:", err);
    res.status(500).json({ error: "Failed to submit form." });
  }
});

// Contact GET
app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// Health check
app.get('/test', (req, res) => {
  res.send('✅ Backend is running!');
});

// --- Start server only after DBs are ready ---
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve)),
  new Promise(resolve => mongoose.connection.once('open', resolve))
]).then(() => {
  // ✅ Custom route for fetching product by barcode (with company name)
  app.get('/api/products/:barcode', async (req, res) => {
    try {
      const barcode = req.params.barcode;
      console.log("Looking for product with barcode:", barcode);

      const product = await Product.findOne({ barcode });
      console.log("Product found:", product);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const company = await Company(companyConnection).findOne({ id: product.company });
      console.log("Company found:", company);

      const responseData = {
        ...product.toObject(),
        companyName: company ? company.name : "Unknown"
      };

      res.json(responseData);
    } catch (err) {
      console.error("Error fetching product by barcode:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Error connecting to databases:', err);
});

// 404 API fallback (after all routes)
app.all('/*splat', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ✅ Serve index.html for all non-API routes (for SPA routing)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
