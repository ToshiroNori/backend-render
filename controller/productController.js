const Products = require("../models/Products");

const allProducts = async (req, res) => {
  try {
    const products = await Products.find();
    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products found at the moment" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching products" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Products.find({ user: req.user });
    if (products.length === 0) {
      return res
        .status(200)
        .json({ message: "No products available for this user" });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while fetching user products" });
  }
};

const addProducts = async (req, res) => {
  const userId = req.user;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized, please log in" });
  }
  try {
    const { name, description, price, stock, image, category, brand } =
      req.body;

    // Input validation
    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !image ||
      !category ||
      !brand
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Products({
      name,
      description,
      price,
      stock,
      image,
      category,
      brand,
      user: userId,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while adding the product" });
  }
};

const deleteProducts = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Products.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", id: productId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting the product" });
  }
};

const updateProducts = async (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  try {
    const product = await Products.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong while updating the product" });
  }
};

module.exports = {
  getProducts,
  addProducts,
  deleteProducts,
  updateProducts,
  allProducts,
};
