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

module.exports = mongoose.model("Product", productSchema);
