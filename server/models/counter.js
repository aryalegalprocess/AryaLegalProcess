// models/Counter.js
const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,   // e.g., 'companyId' or 'productId'
  seq: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
