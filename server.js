const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // ✅ NEW
const fs = require('fs'); // ✅ NEW
const bcrypt = require('bcryptjs'); // ✅ NEW
require('dotenv').config();

const Contact = require('./models/contact');
const sendEmail = require('./server/utils/sendemail');

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
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(session({ // ✅ NEW
  secret: 'arya_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// ✅ Serve images with proper CORS headers
app.use('/images', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(__dirname, 'images')));

// ✅ Serve static files
app.use(express.static(path.join(__dirname)));

// --- MongoDB Connections ---

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

const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const CompanyModel = require('./models/company')(companyConnection);
const Company = require('./models/company');

// Default connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// --- Session Auth Middleware ---
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  res.status(401).send('Unauthorized');
}

// --- Auth Routes ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json')));
  const user = users.find(u => u.mobile === username);

  if (!user) return res.status(401).json({ message: 'Invalid mobile or password' });

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) return res.status(401).json({ message: 'Invalid mobile or password' });

  req.session.user = { id: user.id, name: user.name, type: user.type };
  res.status(200).json({ message: 'Login successful' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.json({ message: 'Logged out' });
});

// --- API Routes ---
const productRoutes = require('./server/routes/products')(Product, Company);
app.use('/api/products', productRoutes);

const companyRoutes = require('./server/routes/companies')(Company);
app.use('/api/companies', companyRoutes);

// Contact Routes
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
  <div style="font-family: 'Segoe UI', sans-serif; color: #333; padding: 20px; line-height: 1.6;">
    <h2 style="color: #007bff;">Dear ${company.cname || 'Valued Partner'},</h2>

    <p>This is a reminder that the following product(s) associated with your company have partnership dates that are expiring soon:</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
      <thead style="background-color: #f2f2f2;">
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Barcode</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Weight</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Details</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Description</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Start Date</th>
          <th style="border: 1px solid #ccc; padding: 8px;">End Date</th>
          <th style="border: 1px solid #ccc; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${productsForCompany.map(p => `
          <tr>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.name || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.barcode || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.weight || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.quantity || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.details || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${p.description || '-'}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${formatDate(p.startdate || p.startDate)}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">${formatDate(p.enddate || p.endDate)}</td>
            <td style="border: 1px solid #ccc; padding: 8px;">₹${p.price || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <p style="margin-top: 20px;">Please take the necessary steps to renew or update your product information to avoid service interruptions.</p>

    <p style="margin-top: 30px;">Best regards,<br/>
    <strong>ARYA LEGAL PROCESS</strong><br/>
    📧 support@aryalegalprocess.com<br/>
    📞 +91-XXXXXXXXXX</p>

    <hr style="margin-top: 40px;"/>
    <small style="color: #888;">You are receiving this email because you're registered with ARYA LEGAL PROCESS. Please contact us if you have any questions.</small>
  </div>
`;



      await sendEmail(company.cemail, '⚠️ Product Partnership Expiry Alert', emailContent);
    }

    res.status(200).json({ message: `Expiry emails sent to ${companyIds.length} company(ies)` });

  } catch (error) {
    console.error('Error sending expiry emails:', error);
    res.status(500).json({ message: 'Failed to send emails' });
  }
});

// --- Protected HTML Pages ---
app.get('/home.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/company.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'company.html'));
});
app.get('/addproduct.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'addproduct.html'));
});
app.get('/meila.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'meila.html'));
});

// Health check
app.get('/test', (req, res) => {
  res.send('✅ Backend is running!');
});

// --- DB ready check ---
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve)),
  new Promise(resolve => mongoose.connection.once('open', resolve))
]).then(() => {
  app.get('/api/products/:barcode', async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const product = await Product.findOne({ barcode });
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const company = await Company.findOne({ id: product.company });
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

// Fallback
app.all('/*splat', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
