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

module.exports = mongoose.model('Company', companySchema, 'companies'); 
const companyConnection = mongoose.createConnection(process.env.MONGO_URI_COMPANY, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
companyConnection.on('error', (err) => {
  console.error('Product DB connection error:', err);
});
companyConnection.once('open', () => {
  console.log('Connected to product database');
});
