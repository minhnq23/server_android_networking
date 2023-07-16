const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Product = require("./models/Product");
router.get("/api/products", async (req, res) => {
  let products = await Product.find().lean();
  res.json(products);
});
module.exports = router;
