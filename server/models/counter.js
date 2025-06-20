const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 }
});

/**
 * Export a function to register this model with a custom connection.
 * @param {mongoose.Connection} connection - The Mongoose connection
 */
module.exports = (connection) => connection.model('Counter', counterSchema);
