const router = require("express").Router();
const Product = require("../models/Products");
const demoProducts = require("../seedData");

/**
 * POST /api/products/seed — inserts demo catalogue when empty.
 * Body or query `{ force: true }` replaces ALL products with the demo list (portfolio / dev reset).
 */
router.post("/seed", async (req, res) => {
  try {
    const force =
      req.body?.force === true ||
      req.body?.force === "true" ||
      req.query?.force === "1" ||
      req.query?.force === "true";

    const count = await Product.countDocuments();
    if (count > 0 && !force) {
      return res.json({
        msg: "Already seeded — send { force: true } to replace with current demo products",
        count
      });
    }
    if (force) {
      await Product.deleteMany({});
    }
    await Product.insertMany(demoProducts);
    res.json({ msg: force ? "Replaced with demo products" : "Seeded", count: demoProducts.length });
  } catch (err) {
    res.status(500).json({ msg: "Seed failed" });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 }).lean();
    res.json(products);
  } catch {
    res.status(500).json({ msg: "Could not load products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ msg: "Not found" });
    res.json(product);
  } catch {
    res.status(400).json({ msg: "Invalid id" });
  }
});

module.exports = router;