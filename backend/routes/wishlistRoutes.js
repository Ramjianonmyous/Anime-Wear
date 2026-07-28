import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/wishlist  — fetch logged-in user's wishlist product IDs
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ uid: req.user.uid });
    res.json({ success: true, productIds: wishlist?.productIds || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching wishlist', error: err.message });
  }
});

// POST /api/wishlist/:productId  — add product to wishlist
router.post('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const wishlist = await Wishlist.findOneAndUpdate(
      { uid: req.user.uid },
      { $addToSet: { productIds: productId } },
      { upsert: true, new: true }
    );
    res.json({ success: true, productIds: wishlist.productIds });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error adding to wishlist', error: err.message });
  }
});

// DELETE /api/wishlist/:productId  — remove product from wishlist
router.delete('/:productId', verifyToken, async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const wishlist = await Wishlist.findOneAndUpdate(
      { uid: req.user.uid },
      { $pull: { productIds: productId } },
      { new: true }
    );
    res.json({ success: true, productIds: wishlist?.productIds || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing from wishlist', error: err.message });
  }
});

export default router;
