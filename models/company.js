const mongoose = require("mongoose");

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

module.exports = mongoose.model("Company", companySchema);
