const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sendEmail = require('./server/utils/sendemail'); // ✅ Email utility
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

// ✅ Serve images with proper headers
app.use('/images', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, 'images')));

// ✅ Serve static files
app.use(express.static(path.join(__dirname)));

// --- MongoDB Connections ---
// Products DB
const productConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const productSchema = new mongoose.Schema({
  id: Number,
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

// Default Mongoose for Contact
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// --- Routes ---
// Products
const productRoutes = require('./server/routes/products')(Product, Company);
app.use('/api/products', productRoutes);

// Companies
const companyRoutes = require('./server/routes/companies')(Company);
app.use('/api/companies', companyRoutes);

// Contact form
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

app.get("/api/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({ error: "Failed to fetch contacts." });
  }
});

// ✅ Send Expiry Emails
app.post('/api/send-expiry-emails', async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const companyIds = [...new Set(products.map(p => p.company))];
    for (const companyId of companyIds) {
      const company = await Company.findOne({ id: companyId });
      if (!company?.cemail) continue;

      const productsForCompany = products.filter(p => p.company === companyId);

      const formatDate = (date) => {
        if (!date) return '-';
        const d = new Date(date);
        return isNaN(d) ? '-' : d.toISOString().split('T')[0];
      };

      const productListHtml = productsForCompany.map(p => `
        <li>
          <strong>${p.name || '-'}</strong><br/>
          Barcode: ${p.barcode || '-'}<br/>
          Weight: ${p.weight || '-'}<br/>
          Quantity: ${p.quantity || '-'}<br/>
          Details: ${p.details || '-'}<br/>
          Description: ${p.description || '-'}<br/>
          Start Date: ${formatDate(p.startdate || p.startDate)}<br/>
          End Date: ${formatDate(p.enddate || p.endDate)}<br/>
          Price: ₹${p.price || '-'}
        </li>
      `).join("<br/><br/>");

      const emailContent = `
        <p>Dear ${company.cname || 'Partner'},</p>
        <p>This is a reminder that your product(s) listed below have partnerships ending soon:</p>
        <ul>${productListHtml}</ul>
        <p>Please take appropriate action.</p>
        <p>Regards,<br/>ARYA LEGAL PROCESS</p>
      `;

      await sendEmail(company.cemail, '⚠️ Product Partnership Expiry Alert', emailContent);
    }

    res.status(200).json({ message: `Expiry emails sent to ${companyIds.length} company(ies)` });
  } catch (error) {
    console.error('Error sending expiry emails:', error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
});

// ✅ Custom barcode route with company name
app.get('/api/products/:barcode', async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const product = await Product.findOne({ barcode });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const company = await Company.findOne({ id: product.company });

    const responseData = {
      ...product.toObject(),
      companyName: company?.name || "Unknown"
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching product by barcode:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Health check
app.get('/test', (req, res) => res.send('✅ Backend is running!'));

// ✅ Start Server After All DBs Are Ready
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve)),
  new Promise(resolve => mongoose.connection.once('open', resolve))
]).then(async () => {

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => {
  console.error('❌ Error connecting to databases:', err);
});

// ✅ API 404 fallback
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ✅ Serve SPA (for client-side routing like React/Vue)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
