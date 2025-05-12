const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// Get all products (for homepage)
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().populate("addedBy", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
module.exports = router;

// Get all products in a wishlist
router.get("/:wishlistId", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ wishlist: req.params.wishlistId });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Add product to wishlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, image, price, wishlistId } = req.body;
    const product = new Product({
      name,
      image,
      price,
      wishlist: wishlistId,
      addedBy: req.user.id,
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete product
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product deleted", product: deleted });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Edit product
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
