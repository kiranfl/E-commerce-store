/**
 * Deletes all documents in the products collection (same DB as the app).
 * Usage: from backend/: node scripts/clear-products.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../models/Products");

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI missing in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  const dbName = mongoose.connection.db.databaseName;
  const result = await Product.deleteMany({});
  console.log(`Database: ${dbName}, collection: products — deleted ${result.deletedCount} document(s).`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
