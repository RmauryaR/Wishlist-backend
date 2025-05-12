const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// Create a wishlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const wishlist = new Wishlist({
      title: req.body.title,
      user: req.user.id,
    });
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete a wishlist and its products
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Product.deleteMany({ wishlist: req.params.id });
    const deleted = await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ msg: "Wishlist and its products deleted", deleted });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;

// Get all wishlists for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id });
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
