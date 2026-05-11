const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
    category: { type: String, default: "Accessories" },
    rating: { type: Number, default: 4.5, min: 0, max: 5 }
  }),
  "products"
);