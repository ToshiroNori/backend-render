// models/Product.js
const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: true,
      minlength: [
        10,
        "Product description must be at least 10 characters long",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock quantity must be a positive number"],
      default: 0,
    },
    image: {
      type: String,
      required: false, // URL for product image
    },
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Food", "Furniture", "Books"], // You can expand the categories as needed
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically creates createdAt and updatedAt fields
  }
);

// Create a Mongoose model for Product
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
