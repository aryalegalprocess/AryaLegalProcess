const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  barcode: String,
  name: String,
  details: String,
  weight: String,
  quantity: String,
  company: String,
  description: String,
  image: String,
  startdate: String,
  enddate: String,
  price: String
});

// 👇 Connect this model to 'productsdb' instead of default mongoose
const productsConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = productsConnection.model("Product", productSchema);
