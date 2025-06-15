const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Allow CORS
app.use(cors({
  origin: 'https://sowmyagorrepati.github.io',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Increase payload size limits to handle large Base64 images
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// --- Connect to MongoDB for Products ---
const productConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

productConnection.on('error', (err) => {
  console.error('Product DB connection error:', err);
});

productConnection.once('open', () => {
  console.log('Connected to product database');
});

// Define Product schema and model on productConnection
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
  image: String  // Add this line if storing image Base64 string
});

const Product = productConnection.model('Product', productSchema);

// --- Connect to MongoDB for Companies ---
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

companyConnection.on('error', (err) => {
  console.error('Company DB connection error:', err);
});

companyConnection.once('open', () => {
  console.log('Connected to company database');
});

// Define Company schema and model on companyConnection
const companySchema = new mongoose.Schema({
  companyName: String,
  status: String,
  startDate: String,
  endDate: String,
  contactName: String,
  contactNumber: String,
  contactEmail: String,
  address: String
});

const Company = companyConnection.model('Company', companySchema);

// --- Routes ---
const productRoutes = require('./routes/products')(Product);
const companyRoutes = require('./routes/companies')(Company);

app.use('/api/products', productRoutes);
app.use('/api/companies', companyRoutes);

// --- Catch unknown API routes ---
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// --- Health Check ---
app.get('/test', (req, res) => {
  res.send('Backend is alive');
});

// --- Start server when DBs are connected ---
Promise.all([
  new Promise(resolve => productConnection.once('open', resolve)),
  new Promise(resolve => companyConnection.once('open', resolve))
]).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error connecting to databases:', err);
});
