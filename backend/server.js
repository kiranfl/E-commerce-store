const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Product = require("./models/Products");
const demoProducts = require("./seedData");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

async function ensureSampleProducts() {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(demoProducts);
    console.log(`Seeded ${demoProducts.length} demo products`);
  }
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Set MONGO_URI in backend/.env (see .env.example)");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("Set JWT_SECRET in backend/.env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("DB connected");
    await ensureSampleProducts();
  })
  .catch(err => console.error("DB connection error:", err.message));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));

const port = Number(process.env.PORT) || 5001;
app.listen(port, () => console.log(`API: http://localhost:${port}`));