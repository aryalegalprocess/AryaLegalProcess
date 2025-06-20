const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  status: String,
  startdate: String,
  enddate: String,
  cname: String,
  cnumber: String,
  cemail: String,
  caddress: String
});

// ✅ This should export a function that returns the model using the provided connection
module.exports = (connection) => connection.model('Company', companySchema);
