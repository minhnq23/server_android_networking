const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Product = require("./models/Product");
router.get("/api/products", async (req, res) => {
  let products = await Product.find().lean();
  res.json(products);
});
router.post("/api/products/add", async (req, res) => {
  try {
    // Assuming you expect the product data to be sent in the request body as JSON
    const { name, price, description } = req.body;

    // Create a new product instance using the Product model
    const newProduct = new Product({
      name,
      price,
      description,
    });

    // Save the new product to the database
    await newProduct.save();

    // Send a success response
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/api/products/edit/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, description } = req.body;

    // Kiểm tra nếu sản phẩm tồn tại trong cơ sở dữ liệu
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Cập nhật thông tin sản phẩm
    existingProduct.name = name;
    existingProduct.price = price;
    existingProduct.description = description;

    // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
    await existingProduct.save();

    // Trả về thông tin sản phẩm đã cập nhật
    res.json({
      message: "Product updated successfully",
      product: existingProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
