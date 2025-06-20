module.exports = function (connection) {
  const mongoose = require('mongoose');

  const companySchema = new mongoose.Schema({
  id: Number, // Add this
  name: String,
  startDate: String,
  endDate: String,
  status: String,
  contactName: String,
  contactNumber: String,
  contactEmail: String,
  contactAddress: String
});


  return connection.model('Company', companySchema);
};
