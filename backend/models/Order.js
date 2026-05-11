const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    price: Number,
    qty: { type: Number, min: 1 }
  },
  { _id: false }
);

module.exports = mongoose.model(
  "Order",
  new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      items: [orderItemSchema],
      total: { type: Number, required: true }
    },
    { timestamps: true }
  ),
  "orders"
);
