const mongoose = require("mongoose");

module.exports = mongoose.model("Order", new mongoose.Schema({
  user: String,
  items: Array,
  total: Number
}));