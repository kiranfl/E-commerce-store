const router = require("express").Router();
const Product = require("../models/Products");

// seed products (run once)
router.post("/seed", async (req, res) => {
  await Product.insertMany([
    { name: "Phone", price: 10000, stock: 10 },
    { name: "Laptop", price: 50000, stock: 5 }
  ]);
  res.json("Seeded");
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;