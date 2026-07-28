# 🎌 Animewear — Premium Anime Apparel E-Commerce Platform

> Full-stack MERN (MongoDB, Express, React, Node.js) web application built for anime enthusiasts featuring real-time authentication, Razorpay payments, dynamic product filtering, an interactive shopping cart, order tracking, and an admin management dashboard.

---

## 🚀 Live Demo & Repository

- **GitHub Repository**: [https://github.com/Ramjianonmyous/Anime-Wear](https://github.com/Ramjianonmyous/Anime-Wear)
- **Frontend Live (Vercel)**: [`https://your-app.vercel.app`](https://anime-wear-six.vercel.app/)
- **Backend API (Render/Railway)**: [`https://your-backend.onrender.com`https://anime-wear.onrender.com](https://anime-wear.onrender.com)

---

## ✨ Features Overview

### 🛍️ Storefront & User Experience
- **Dynamic Catalog**: Browse anime merchandise by category (*Oversized Tees, Hoodies, Track Pants, Cargo Pants, Caps, Accessories*).
- **Instant Search & Filtering**: Real-time modal search with live title, category, and description matching.
- **Interactive Modals**: Quick Add modal with size (`S`, `M`, `L`, `XL`, `XXL`) and color selection.
- **Cart & Wishlist Drawers**: Slide-out cart drawer with item quantity controls, subtotal computation, coupon discount application (`ANIME20`, `SHINOBI10`), and real-time backend synchronization.
- **Glassmorphic Modern UI**: Powered by TailwindCSS and Framer Motion micro-animations with sleek dark mode aesthetics.

### 🔐 Authentication & Profile Management
- **Firebase Auth**: Google OAuth Sign-In & Email/Password authentication.
- **Saved Address Management**: Add, edit, or delete shipping addresses directly in user profile.
- **Live Order Tracking**: Track orders with unique tracking codes (`AW-XXXXX`) and status badges (*Order Placed, Processing, Shipped, Delivered*).

### 💳 Payments & Checkout
- **Razorpay Integration**: Native checkout.js integration for Cards, UPI, NetBanking, and Wallets.
- **HMAC Signature Verification**: Backend `crypto` HMAC SHA-256 signature verification preventing forged transaction responses.

### 🛡️ Admin Management Panel
- **Passkey Protection**: Secured admin gate using environment key verification.
- **Inventory Control**: Add new products, update prices/badges, upload image URLs, delete items, and re-seed the MongoDB database.

---

## 🛠️ Technology Stack

| Domain | Stack |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Context API |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB Atlas |
| **Auth & Security** | Firebase Authentication, JWT verification, CORS headers |
| **Payments** | Razorpay SDK & HMAC SHA-256 Signature Verification |
| **Deployment** | Vercel (Frontend SPA) + Render / Railway (Backend Server) |

---

## 📂 Project Structure

```
animewear-mern/
├── backend/
│   ├── data/
│   │   └── products.js            # Initial seed dataset
│   ├── middleware/
│   │   └── authMiddleware.js      # Token verification middleware
│   ├── models/
│   │   ├── Cart.js                # Mongoose Cart schema
│   │   ├── Order.js               # Mongoose Order schema
│   │   ├── Product.js             # Mongoose Product schema
│   │   ├── User.js                # Mongoose User schema
│   │   └── Wishlist.js            # Mongoose Wishlist schema
│   ├── routes/
│   │   ├── cartRoutes.js          # Cart API endpoints
│   │   ├── orderRoutes.js         # Order API endpoints
│   │   ├── paymentRoutes.js       # Razorpay order creation & signature verification
│   │   ├── productRoutes.js       # Product listing & CRUD endpoints
│   │   ├── userRoutes.js          # Profile & Address endpoints
│   │   └── wishlistRoutes.js       # Wishlist API endpoints
│   ├── .env.example               # Template for backend env variables
│   └── server.js                  # Express application entry point
├── frontend/
│   ├── public/                    # Static assets & images
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/
│   │   │   └── AppContext.jsx     # Centralized State Management & API Helper
│   │   ├── pages/                 # Page components (Home, Shop, Account, Admin, Checkout, Legal)
│   │   ├── firebase.js            # Firebase SDK client initialization
│   │   ├── index.css              # Global TailwindCSS styles
│   │   └── main.jsx               # React entry point
│   ├── .env.example               # Template for frontend env variables
│   ├── vite.config.js             # Vite bundler configuration
│   └── tailwind.config.js         # Tailwind design system configuration
├── package.json                   # Root workspace scripts
└── vercel.json                    # Vercel deployment configuration
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI
- [Firebase Console](https://console.firebase.google.com/) project (with Web App enabled)
- [Razorpay Dashboard](https://dashboard.razorpay.com/) test keys

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ramjianonmyous/Anime-Wear.git
cd Anime-Wear
```

---

### Step 2: Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

---

### Step 3: Configure Environment Variables

#### Backend Environment Setup (`backend/.env`)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/animewear
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_SECRET_KEY=animewear-admin-2024
ALLOWED_ORIGIN=http://localhost:5173
```

#### Frontend Environment Setup (`frontend/.env`)
Create a `.env` file in the `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=rzp_test_...
VITE_ADMIN_KEY=animewear-admin-2024
```

---

### Step 4: Run Development Servers
From the root directory, start both frontend and backend concurrently:

```bash
# Start backend server (port 5000)
npm run dev:backend

# In a separate terminal, start frontend dev server (port 5173 / 5174)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints Reference

### 📦 Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List products (filterable by `category`, `search`) |
| `GET` | `/api/products/:id` | Public | Get product details by ID |
| `POST` | `/api/products` | Admin | Create a new product |
| `PUT` | `/api/products/:id` | Admin | Update existing product |
| `DELETE` | `/api/products/:id` | Admin | Delete a product |

### 👤 Users & Addresses (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Private | Fetch authenticated user profile |
| `PUT` | `/api/users/profile` | Private | Update user profile details |
| `PUT` | `/api/users/address` | Private | Save/Update shipping address |

### 🛒 Cart & Wishlist (`/api/cart`, `/api/wishlist`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/cart` | Private | Fetch user cart items |
| `POST` | `/api/cart` | Private | Add/update cart item |
| `DELETE` | `/api/cart/:productId` | Private | Remove item from cart |

### 💳 Payments & Orders (`/api/payment`, `/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Private | Generate Razorpay Order ID |
| `POST` | `/api/payment/verify` | Private | Verify Razorpay HMAC signature |
| `POST` | `/api/orders` | Private | Record confirmed order in database |
| `GET` | `/api/orders` | Private | Fetch user order history |

---

## 🚀 Production Deployment Guide

### Deploying Frontend to Vercel
1. Push project to GitHub.
2. Import project into Vercel dashboard.
3. Set **Framework Preset**: `Vite`.
4. Set **Root Directory**: `frontend`.
5. Add Environment Variables:
   - `VITE_BACKEND_URL`: `https://your-backend-api.onrender.com`
   - `VITE_FIREBASE_API_KEY`: Your production Firebase Key
   - `VITE_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `VITE_ADMIN_KEY`: Your Admin Secret Key

### Deploying Backend to Render / Railway
1. Create a Web Service pointing to `backend/`.
2. Set **Build Command**: `npm install`.
3. Set **Start Command**: `node server.js`.
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay Secret Key
   - `ADMIN_SECRET_KEY`: Your Admin Secret Key
   - `ALLOWED_ORIGIN`: `https://your-frontend.vercel.app`

---


---

## 👨‍💻 Author

**Ramjianonmyous**
- **LinkdIn**: [@Ramjianonmyous](https://github.com/Ramjianonmyous)
- **Portfolio**: [@Ramjianonmyous](https://github.com/Ramjianonmyous)
- **GitHub**: [@Ramjianonmyous](https://github.com/Ramjianonmyous)
- **Project Repository**: [https://github.com/Ramjianonmyous/Anime-Wear](https://github.com/Ramjianonmyous/Anime-Wear)
