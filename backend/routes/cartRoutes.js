import express from 'express';
import Cart from '../models/Cart.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/cart  — fetch logged-in user's cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ uid: req.user.uid });
    res.json({ success: true, items: cart?.items || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching cart', error: err.message });
  }
});

// PUT /api/cart  — replace entire cart (called on every cart change from frontend)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { uid: req.user.uid },
      { uid: req.user.uid, items: items || [] },
      { upsert: true, new: true }
    );
    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving cart', error: err.message });
  }
});

// DELETE /api/cart  — clear cart after order is placed
router.delete('/', verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ uid: req.user.uid }, { items: [] }, { upsert: true });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error clearing cart', error: err.message });
  }
});

export default router;
