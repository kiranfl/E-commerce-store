const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

function normalizeItems(bodyItems) {
  if (!Array.isArray(bodyItems) || bodyItems.length === 0) return null;
  const items = [];
  for (const i of bodyItems) {
    const qty = Number(i.qty);
    const price = Number(i.price);
    if (!Number.isFinite(qty) || qty < 1 || !Number.isFinite(price) || price < 0) {
      return null;
    }
    items.push({
      productId: i.productId || i._id || undefined,
      name: String(i.name || "Item"),
      price,
      qty: Math.floor(qty)
    });
  }
  return items;
}

router.post("/", auth, async (req, res) => {
  try {
    const items = normalizeItems(req.body.items);
    if (!items) {
      return res.status(400).json({ msg: "Invalid items: need name, price, qty" });
    }
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = await Order.create({
      user: req.user.id,
      items,
      total
    });
    res.status(201).json(order);
  } catch {
    res.status(500).json({ msg: "Could not place order" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch {
    res.status(500).json({ msg: "Could not load orders" });
  }
});

module.exports = router;