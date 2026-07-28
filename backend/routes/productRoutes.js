import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database disconnected. Cannot fetch products.' });
    }

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
});

// @desc    Fetch single product by ID (supports numeric custom ID and MongoDB ObjectId)
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const idParam = req.params.id;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database disconnected. Cannot fetch product details.' });
    }

    let product;

    // Check if parameter is a custom numeric ID
    if (!isNaN(idParam)) {
      product = await Product.findOne({ id: Number(idParam) });
    } else {
      product = await Product.findById(idParam);
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product details', error: error.message });
  }
});

// @desc    Add a new product
// @route   POST /api/products
// @access  Private (Admin key)
router.post('/', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin key.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB not connected. Cannot add product.' });
    }
    const { id, title, category, price, discountPrice, badge, rating, reviews, featured, trending, description, images, colors, sizes } = req.body;
    if (!title || !category || !price || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields: title, category, price, images.' });
    }
    // Auto-assign id if not provided
    let productId = id;
    if (!productId) {
      const lastProduct = await Product.findOne().sort({ id: -1 });
      productId = lastProduct ? lastProduct.id + 1 : 1;
    }
    const product = new Product({ id: productId, title, category, price, discountPrice, badge, rating, reviews, featured, trending, description, images, colors: colors || [], sizes: sizes || [] });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding product', error: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin key)
router.put('/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin key.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB not connected.' });
    }
    const idParam = req.params.id;
    const query = !isNaN(idParam) ? { id: Number(idParam) } : { _id: idParam };
    const updated = await Product.findOneAndUpdate(query, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found.' });
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating product', error: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin key)
router.delete('/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin key.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB not connected.' });
    }
    const idParam = req.params.id;
    const query = !isNaN(idParam) ? { id: Number(idParam) } : { _id: idParam };
    await Product.findOneAndDelete(query);
    res.json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product', error: error.message });
  }
});

// @desc    Force re-seed products from local seed file (admin only)
// @route   POST /api/products/reseed
// @access  Private (Admin key)
router.post('/reseed', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Forbidden: Invalid admin key.' });
    }
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'MongoDB not connected.' });
    }
    await Product.deleteMany({});
    const localProducts = (await import('../data/products.js')).default;
    await Product.insertMany(localProducts);
    res.json({ success: true, message: `Re-seeded ${localProducts.length} products.` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error re-seeding products', error: error.message });
  }
});

export default router;
