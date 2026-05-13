const express = require("express");

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", addProduct);

router.get("/", getProducts);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

module.exports = router;