const Product = require("../models/Product");


// ADD PRODUCT

exports.addProduct = async (req, res) => {

  try {

    const {
      name,
      price,
      stock,
      category,
      image,
    } = req.body;

    const product =
      await Product.create({
        name,
        price,
        stock,
        category,
        image,
      });

    res.status(201).json(product);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET PRODUCTS

exports.getProducts = async (req, res) => {

  try {

    const products =
      await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE PRODUCT

exports.deleteProduct = async (
  req,
  res
) => {

  try {

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Product Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// UPDATE PRODUCT

exports.updateProduct = async (
  req,
  res
) => {

  try {

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};