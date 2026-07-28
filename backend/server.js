import 'dotenv/config';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
dns.setDefaultResultOrder('ipv4first');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000',
  process.env.ALLOWED_ORIGIN,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, Postman, curl)
    if (!origin) return callback(null, true);
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Serve product images from frontend's public/images directory
const frontendPublicImages = path.join(__dirname, '..', 'frontend', 'public', 'images');
app.use('/images', express.static(frontendPublicImages));

// In production, serve the frontend build
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA catch-all — send index.html for any non-API routes (production)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/images')) return next();
  const indexPath = path.join(frontendDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Animewear MERN API is running...');
  }
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(async () => {
      console.log('MongoDB Connected Successfully.');
      
      // Auto-seed products if collection is empty
      try {
        const Product = (await import('./models/Product.js')).default;
        const count = await Product.countDocuments();
        if (count === 0) {
          console.log('Product collection is empty. Seeding local products...');
          const localProducts = (await import('./data/products.js')).default;
          await Product.insertMany(localProducts);
          console.log('Products seeded successfully!');
        }
      } catch (err) {
        console.error('Error auto-seeding products:', err);
      }

      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB Connection Error:', error.message);
      app.listen(PORT, () => {
        console.log(`Server started on port ${PORT} (Database disconnected)`);
      });
    });
} else {
  console.warn('MONGO_URI is missing from environment variables.');
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} (Awaiting MONGO_URI setup)`);
  });
}

export default app;
