const express = require("express");
const router = express.Router();
const protected = require("../middleware/protected");
const {
  allProducts,
  getProducts,
  addProducts,
  deleteProducts,
  updateProducts,
} = require("../controller/productController");

router.get("/", allProducts);
router.get("/my-products", protected, getProducts);
router.post("/add", protected, addProducts);
router.delete("/:id", protected, deleteProducts);
router.patch("/:id", protected, updateProducts);

module.exports = router;
