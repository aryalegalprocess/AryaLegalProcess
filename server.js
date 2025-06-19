const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Contact = require('./models/contact');
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

// ✅ Fix: Enable CORS headers for images explicitly
// ✅ Serve images with proper CORS and Cross-Origin-Resource-Policy to fix ORB error
app.use('/images', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, 'images')));


// ✅ Serve other static files from root directory
app.use(express.static(path.join(__dirname)));

// --- MongoDB connections ---

// Products DB
const productConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const productSchema = new mongoose.Schema({
  id: Number, // ✅ added this line
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
const Counter = require('./server/models/counter');
const CompanyModel = require('./models/company');

async function initializeCompanyCounter() {
  try {
    const existingCounter = await Counter.findById("companyId");
    if (existingCounter) {
      console.log(`ℹ️ Counter already initialized at: ${existingCounter.seq}`);
      return;
    }

    const lastCompany = await CompanyModel(companyConnection)
      .findOne()
      .sort({ id: -1 })
      .lean();

    const lastId = lastCompany?.id ? parseInt(lastCompany.id) : 0;

    await Counter.findByIdAndUpdate(
      { _id: 'companyId' },
      { $set: { seq: lastId } },
      { upsert: true }
    );

    console.log(`✅ Company ID counter initialized to ${lastId}`);
  } catch (err) {
    console.error("❌ Failed to initialize company counter:", err);
  }
}



// Default connection for Contact
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

// ✅ NEW: Send Expiry Emails Route
app.post('/api/send-expiry-emails', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided' });
    }

    const companyIds = [...new Set(products.map(p => p.company))];
for (const companyId of companyIds) {
  const company = await Company.findOne({ id: companyId }); // ✅ CORRECT


      if (!company || !company.cemail) continue;

      const productsForCompany = products.filter(p => p.company === companyId);

     function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d)) return '-';
  return d.toISOString().split('T')[0];
}

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

// Health check
app.get('/test', (req, res) => {
  res.send('✅ Backend is running!');
});

// --- Start server only after DBs are ready ---
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve)),
  new Promise(resolve => mongoose.connection.once('open', resolve))
]).then(async () => {

const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const CompanyModel = require('./models/company')(companyConnection);
const Counter = require('./server/models/counter');


  async function initializeCompanyCounter() {
    try {
      const lastCompany = await CompanyModel
        .findOne()
        .sort({ id: -1 })
        .lean();

      if (!lastCompany) {
        console.log("ℹ️ No existing companies found to initialize counter.");
        return;
      } at

      const currentSeq = parseInt(lastCompany.id);
      if (!isNaN(currentSeq)) {
        await Counter.findByIdAndUpdate(
          { _id: 'companyId' },
          { $set: { seq: currentSeq + 1} },
          { upsert: true }
        );
        console.log(`🔄 Company ID counter initialized to ${currentSeq}`);
      }
    } catch (err) {
      console.error("❌ Failed to initialize company counter:", err);
    }
  }

  await initializeCompanyCounter(); // ✅ Call before server starts

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
