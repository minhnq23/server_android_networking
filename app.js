const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const app = express();

// Kết nối tới MongoDB
mongoose
  .connect(
    "mongodb+srv://minhnguyen31223:minh123@products.n6aqu42.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Cấu hình template engine Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: false,
    layoutsDir: "views/",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

// Sử dụng body-parser để đọc dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: false }));

// Sử dụng các tệp tĩnh từ thư mục public (nếu có)
app.use(express.static("public"));
const apiApp = require("./api");
app.use("/", apiApp);

// Sử dụng router cho tác vụ CRUD sản phẩm
// const productRoutes = require("./routers/product");
// app.use("/products", productRoutes);
const Product = require("./models/Product");

// Route hiển thị danh sách sản phẩm
app.get("/", async (req, res) => {
  let products = [];
  products = await Product.find().lean();
  res.render("index", { products: products });

  //   Product.find().lean()
  //     .then((products) => {
  //       res.render("index", { products });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
});

app.get("/:id", (req, res) => {
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
app.get("/add", (req, res) => {
  res.render("add");
});

// Route xử lý thêm sản phẩm
app.post("/products", (req, res) => {
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
app.get("/products/:id/delete", (req, res) => {
  const productId = req.params.id;

  // Thực hiện xóa sản phẩm từ cơ sở dữ liệu (sử dụng mongoose)
  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});
// Khởi chạy server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
