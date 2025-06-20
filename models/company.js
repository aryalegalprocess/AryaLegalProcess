const mongoose = require("mongoose");
require("dotenv").config(); // Load .env

const companySchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String,
  startdate: String,
  enddate: String,
  cname: String,
  cnumber: String,
  cemail: String,
  caddress: String
});

// ✅ Connect to the correct DB (MONGO_URI_COMPANY)
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = companyConnection.model("Company", companySchema);
