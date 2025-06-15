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
  image: String,  // Add image field here (string)
});

const Product = productConnection.model('Product', productSchema, 'products'); // Specify collection name
module.exports = Product;
const mongoose = require('mongoose');
const productConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
productConnection.on('error', (err) => {
  console.error('Product DB connection error:', err);
});
productConnection.once('open', () => {
  console.log('Connected to product database');
});
