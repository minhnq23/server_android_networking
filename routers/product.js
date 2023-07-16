const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Route hiển thị danh sách sản phẩm
router.get("/", (req, res) => {
  Product.find()
    .then((products) => {
      res.render("index", { products });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

// Route hiển thị chi tiết sản phẩm
router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((product) => {
      res.render("product", { product });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

// Route hiển thị form thêm sản phẩm
router.get("/add", (req, res) => {
  res.render("add");
});

// Route xử lý thêm sản phẩm
router.post("/", (req, res) => {
  const { name, price, description } = req.body;
  const newProduct = new Product({
    name,
    price,
    description,
  });
  newProduct
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
