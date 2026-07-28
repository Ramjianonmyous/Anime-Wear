import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Place a new checkout order
// @route   POST /api/orders
// @access  Private (Authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { shippingAddress, items, total, paymentId, razorpayOrderId } = req.body;

    if (!shippingAddress || !items || items.length === 0 || !total) {
      return res.status(400).json({ success: false, message: 'Please provide all order details' });
    }

    const trackingCode = `AW-${Math.floor(10000 + Math.random() * 90000)}`;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected. Order could not be saved.' });
    }

    const newOrder = new Order({
      userId: req.user?.uid || null,
      shippingAddress,
      items,
      total: Number(total),
      paymentId: paymentId || null,
      paymentMethod: 'Razorpay',
      status: 'ORDER PLACED',
      trackingNumber: trackingCode
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId: savedOrder.trackingNumber,
      order: savedOrder
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error placing order', error: error.message });
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private (Authenticated)
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid || null;

    if (mongoose.connection.readyState !== 1) {
      console.log('MongoDB is offline. Returning empty array for user orders.');
      return res.json([]);
    }

    const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving orders', error: error.message });
  }
});

export default router;
