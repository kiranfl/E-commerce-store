const router = require("express").Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const total = req.body.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const order = await Order.create({
    user: req.user.id,
    items: req.body.items,
    total
  });

  res.json(order);
});

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.json(orders);
});

module.exports = router;