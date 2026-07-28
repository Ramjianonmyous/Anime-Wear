# 🚀 Deployment Guide — AnimeWear MERN Stack

This document contains step-by-step instructions to deploy AnimeWear live securely without leaking confidential data.

---

## 🔒 1. Pre-Deployment Security Audit Completed

The codebase has been audited for security and production readiness:
- ✅ `.gitignore` configured to ignore `.env`, `.env.local`, `node_modules`, `dist`, logs, and service account JSON credentials.
- ✅ No hardcoded secrets, database passwords, or private API keys in committed code.
- ✅ All product data and images are clean, professional, and free of dummy/lorem-ipsum text.
- ✅ Frontend production build verified (`npm run build` succeeds cleanly).

---

## 🌐 Option A: Deploy Frontend & Backend on Vercel (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for production"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/animewear-mern.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new).
   - Select your `animewear-mern` repository.
   - Vercel will automatically detect `vercel.json` settings.

3. **Configure Environment Variables in Vercel**:
   Add the following in Vercel Project Settings > Environment Variables:

   | Key | Description |
   | --- | --- |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `RAZORPAY_KEY_ID` | Your Razorpay API Key ID |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay API Secret |
   | `ADMIN_SECRET_KEY` | Admin key for product management |
   | `VITE_FIREBASE_API_KEY` | Firebase API Key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
   | `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Sender ID |
   | `VITE_FIREBASE_APP_ID` | Firebase App ID |
   | `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID (frontend) |
   | `VITE_ADMIN_KEY` | Admin key (frontend) |

4. Click **Deploy**.

---

## 🖥️ Option B: Separate Backend (Render) & Frontend (Vercel)

### Backend Deployment on Render:
1. Go to [Render Dashboard](https://dashboard.render.com) > **New Web Service**.
2. Connect your GitHub repository and set Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables: `MONGO_URI`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `ADMIN_SECRET_KEY`, `ALLOWED_ORIGIN`.

### Frontend Deployment on Vercel:
1. Connect your repo and set Root Directory to `frontend`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add `VITE_*` environment variables.

---

## ⚡ Verification Checklist
- [x] Backend CORS origin handling allows live domain.
- [x] Product images served statically under `/images`.
- [x] SPA client routing fallback enabled.
- [x] Firebase Authentication active for Google Sign-In & Email login.
