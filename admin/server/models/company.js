const mongoose = require('mongoose');

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

module.exports = mongoose.model('Company', companySchema);
