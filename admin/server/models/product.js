const mongoose = require("mongoose");
require("dotenv").config(); // ✅ Make sure environment variables are available

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

const productsConnection = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS);

module.exports = productsConnection.model("Product", productSchema);
