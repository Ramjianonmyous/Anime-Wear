import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get or create user profile
// @route   GET /api/users/profile
// @access  Private (Authenticated)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { uid, email, name } = req.user;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected. Please try again.' });
    }

    let user = await User.findOne({ uid });
    
    if (!user) {
      // Create user if they don't exist yet (first-time Google login or registration)
      user = new User({
        uid,
        name: name || 'Anime Fan',
        email: email || '',
        phone: ''
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile', error: error.message });
  }
});

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private (Authenticated)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, email, phone } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected. Cannot update profile.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { name, email, phone },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating profile', error: error.message });
  }
});

// @desc    Update user address
// @route   PUT /api/users/address
// @access  Private (Authenticated)
router.put('/address', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { address, city, zipCode, state, country } = req.body;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database disconnected.' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid },
      { address: { address, city, zipCode, state, country } },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Address updated successfully!', address: updatedUser.address });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error updating address', error: error.message });
  }
});

// @desc    Purge all test/registered users from MongoDB (Admin only)
// @route   POST /api/users/purge-test-users
// @access  Private (Admin key)
router.post('/purge-test-users', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: 'Forbidden: Invalid admin key.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'MongoDB not connected.' });
    }
    const result = await User.deleteMany({});
    res.json({ success: true, message: `Successfully deleted ${result.deletedCount} user records from database.` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error purging user records', error: error.message });
  }
});

export default router;

