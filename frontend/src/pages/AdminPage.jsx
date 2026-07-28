import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ADMIN_KEY_FALLBACK = import.meta.env.VITE_ADMIN_KEY || '';

const CATEGORIES = [
  'Oversized T-Shirts', 'Hoodies', 'Track Pants', 'Joggers', 
  'Cargo Pants', 'Graphic Tees', 'Caps', 'Accessories'
];

const defaultForm = {
  title: '', category: 'Hoodies', price: '', discountPrice: '',
  badge: '', rating: '4.8', reviews: '0', featured: true, trending: false,
  description: '', images: '', colors: '', sizes: '',
};

const AdminPage = () => {
  const { products, refreshProducts, showToast } = useAppContext();

  // Authentication State for Admin Gate
  const [adminPasskey, setAdminPasskey] = useState(() => sessionStorage.getItem('admin_passkey') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('admin_passkey'));
  const [inputPasskey, setInputPasskey] = useState('');

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('add');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!inputPasskey) {
      showToast('Please enter the Admin Security Key.', 'error');
      return;
    }
    sessionStorage.setItem('admin_passkey', inputPasskey);
    setAdminPasskey(inputPasskey);
    setIsAuthenticated(true);
    showToast('Admin access granted!', 'success');
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('admin_passkey');
    setAdminPasskey('');
    setIsAuthenticated(false);
    showToast('Logged out of Admin Mode.', 'info');
  };

  const getActiveKey = () => adminPasskey || ADMIN_KEY_FALLBACK;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const parseImagesArray = (str) =>
    str.split('\n').map(s => s.trim()).filter(Boolean);

  const parseArrayField = (str) =>
    str.split(',').map(s => s.trim()).filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.price || !form.images) {
      showToast('Please fill in title, category, price, and at least one image URL.', 'error');
      return;
    }
    setLoading(true);
    const payload = {
      title: form.title,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      badge: form.badge || undefined,
      rating: Number(form.rating) || 4.8,
      reviews: Number(form.reviews) || 0,
      featured: form.featured,
      trending: form.trending,
      description: form.description,
      images: parseImagesArray(form.images),
      colors: parseArrayField(form.colors),
      sizes: parseArrayField(form.sizes),
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-admin-key': getActiveKey() },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingId ? 'Product updated!' : 'Product added!', 'success');
        setForm(defaultForm);
        setEditingId(null);
        await refreshProducts();
        setTab('manage');
      } else {
        if (res.status === 403) {
          showToast('Invalid Admin Security Key. Access denied.', 'error');
          setIsAuthenticated(false);
        } else {
          showToast(data.message || 'Failed to save product.', 'error');
        }
      }
    } catch (err) {
      showToast('Server error.', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title || '',
      category: product.category || 'Hoodies',
      price: String(product.price || ''),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      badge: product.badge || '',
      rating: String(product.rating || '4.8'),
      reviews: String(product.reviews || '0'),
      featured: !!product.featured,
      trending: !!product.trending,
      description: product.description || '',
      images: (product.images || []).join('\n'),
      colors: (product.colors || []).join(', '),
      sizes: (product.sizes || []).join(', '),
    });
    setEditingId(product.id || product._id);
    setTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    setLoading(true);
    try {
      const idParam = product.id || product._id;
      const res = await fetch(`/api/products/${idParam}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': getActiveKey() },
      });
      const data = await res.json();
      if (data.success) {
        showToast('Product deleted.', 'success');
        await refreshProducts();
      } else {
        if (res.status === 403) {
          showToast('Invalid Admin Security Key.', 'error');
          setIsAuthenticated(false);
        } else {
          showToast(data.message || 'Failed to delete.', 'error');
        }
      }
    } catch {
      showToast('Server error.', 'error');
    }
    setLoading(false);
  };

  const handleReseed = async () => {
    if (!window.confirm('This will replace ALL products with the seed data. Continue?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/products/reseed', {
        method: 'POST',
        headers: { 'x-admin-key': getActiveKey() },
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        await refreshProducts();
      } else {
        if (res.status === 403) {
          showToast('Invalid Admin Security Key.', 'error');
          setIsAuthenticated(false);
        } else {
          showToast(data.message || 'Re-seed failed.', 'error');
        }
      }
    } catch {
      showToast('Server error.', 'error');
    }
    setLoading(false);
  };

  // If not authenticated, render Security Lock Gate
  if (!isAuthenticated) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4 bg-white rounded-2xl p-8 border shadow-lg"
        >
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 text-2xl mx-auto shadow-inner">
            🔒
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Security Gate</h2>
          <p className="text-gray-500 text-center text-sm mb-6">Enter the Admin Password / Security Key to access product management.</p>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Security Key</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-indigo-600 text-sm"
                placeholder="••••••••••••••••"
                value={inputPasskey}
                onChange={(e) => setInputPasskey(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Unlock Admin Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:border-indigo-400 text-sm';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1';

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Manage products in your MongoDB database</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoutAdmin}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium text-sm transition-colors"
            >
              🔒 Lock Admin
            </button>
            <button
              onClick={handleReseed}
              disabled={loading}
              className="px-5 py-2.5 bg-red-100 text-red-700 rounded-xl font-semibold text-sm hover:bg-red-200 transition-colors disabled:opacity-50 border border-red-200"
            >
              🔄 Re-seed Products
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['add', 'manage'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
            >
              {t === 'add' ? (editingId ? '✏️ Edit Product' : '+ Add Product') : `📦 Manage (${products.length})`}
            </button>
          ))}
        </div>

        {tab === 'add' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border p-8"
          >
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              {editingId ? '✏️ Edit Product' : '+ Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Product Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Naruto Sage Mode Oversized Tee" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Badge</label>
                  <select name="badge" value={form.badge} onChange={handleChange} className={inputCls}>
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="sale">Sale</option>
                    <option value="limited">Limited</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="399" className={inputCls} required min="0" />
                </div>
                <div>
                  <label className={labelCls}>Discount Price (₹)</label>
                  <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} placeholder="349" className={inputCls} min="0" />
                </div>
                <div>
                  <label className={labelCls}>Rating</label>
                  <input name="rating" type="number" step="0.1" max="5" min="0" value={form.rating} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Reviews Count</label>
                  <input name="reviews" type="number" value={form.reviews} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Colors (comma separated)</label>
                  <input name="colors" value={form.colors} onChange={handleChange} placeholder="Black, White, Orange" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sizes (comma separated)</label>
                  <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="S, M, L, XL" className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Image URLs (one per line) *</label>
                  <textarea name="images" value={form.images} onChange={handleChange} rows={3}
                    placeholder="/images/naruto_sage_tee.png&#10;https://cdn.example.com/image2.jpg"
                    className={`${inputCls} resize-none font-mono text-xs`} required />
                  <p className="text-xs text-gray-400 mt-1">Use /images/filename.png for local images in frontend/public/images/</p>
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                    placeholder="Product description..."
                    className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="trending" checked={form.trending} onChange={handleChange} className="w-4 h-4 accent-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Trending</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setForm(defaultForm); setEditingId(null); }}
                    className="px-8 py-3 border rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            {products.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-gray-400 border">
                No products found. Add a product or click Re-seed.
              </div>
            ) : products.map((p) => (
              <div key={p._id || p.id} className="bg-white rounded-xl border p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <img src={p.images?.[0]} alt={p.title} className="w-16 h-16 rounded-lg object-cover bg-gray-100 border flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                    {p.badge && <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full capitalize">{p.badge}</span>}
                  </div>
                  <p className="text-sm text-gray-500">{p.category} • ₹{p.discountPrice || p.price}
                    {p.discountPrice && <span className="ml-1 line-through text-gray-400">₹{p.price}</span>}
                    {p.featured && <span className="ml-2 text-yellow-600 text-xs">★ Featured</span>}
                    {p.trending && <span className="ml-2 text-red-500 text-xs">🔥 Trending</span>}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(p)}
                    className="px-4 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >Edit</button>
                  <button onClick={() => handleDelete(p)}
                    className="px-4 py-1.5 text-sm bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >Delete</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
