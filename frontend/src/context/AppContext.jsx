import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

// ─── API helper ──────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';
const api = async (url, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
  const res = await fetch(fullUrl, opts);
  return res.json();
};

export const AppProvider = ({ children }) => {
  // ── UI state ────────────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage]       = useState('home');
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [showCart, setShowCart]             = useState(false);
  const [showSearch, setShowSearch]         = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [toasts, setToasts]                 = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [shopFilter, setShopFilter]         = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);
  const [accountTab, setAccountTab]         = useState('profile');
  const [activeSupportTab, setActiveSupportTab] = useState('shipping');
  const [activeLegalTab, setActiveLegalTab]   = useState('privacy');
  const [supportTickets, setSupportTickets] = useState([]);

  // ── Auth state ──────────────────────────────────────────────────────────────
  const [token, setToken]       = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser]         = useState(null);

  // ── Per-user DB-backed state ─────────────────────────────────────────────────
  const [cart, setCart]         = useState([]);
  const [wishlist, setWishlist] = useState([]);   // array of product objects
  const [orders, setOrders]     = useState([]);
  const [address, setAddress]   = useState(null);

  // Ref to hold latest token without triggering re-renders in callbacks
  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Products ───────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api('/api/products');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ─── Load all user data from DB after login ──────────────────────────────────
  const loadUserData = useCallback(async (tkn) => {
    try {
      const [profileData, cartData, wishlistData, ordersData] = await Promise.all([
        api('/api/users/profile', 'GET', null, tkn),
        api('/api/cart', 'GET', null, tkn),
        api('/api/wishlist', 'GET', null, tkn),
        api('/api/orders', 'GET', null, tkn),
      ]);

      // Profile + address
      if (profileData && !profileData.error) {
        setUser(prev => ({
          ...prev,
          name:  profileData.name  || prev?.name  || '',
          email: profileData.email || prev?.email || '',
          phone: profileData.phone || prev?.phone || '',
        }));
        setAddress(profileData.address || null);
      }

      // Cart — stored as flat items; rebuild to { product, size, color, quantity }
      if (cartData?.success && cartData.items) {
        setCart(cartData.items.map(item => ({
          product: {
            id:            item.productId,
            title:         item.title,
            images:        item.images || [],
            price:         item.price,
            discountPrice: item.discountPrice,
          },
          size:     item.size,
          color:    item.color,
          quantity: item.quantity,
        })));
      }

      // Wishlist — stored as productIds; cross-reference with products list
      if (wishlistData?.success) {
        setWishlist(wishlistData.productIds || []);
      }

      // Orders
      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }, []);

  // ─── Clear all user state on logout ─────────────────────────────────────────
  const clearUserData = useCallback(() => {
    setCart([]);
    setWishlist([]);
    setOrders([]);
    setAddress(null);
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  }, []);

  // ─── Firebase auth listener ──────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        setToken(idToken);
        setUser({
          name:     firebaseUser.displayName || '',
          email:    firebaseUser.email || '',
          phone:    firebaseUser.phoneNumber || '',
          photoURL: firebaseUser.photoURL || '',
        });
        setIsLoggedIn(true);
        await loadUserData(idToken);
      } else {
        clearUserData();
      }
    });
    return () => unsub();
  }, [loadUserData, clearUserData]);

  // ─── Sync cart to DB (debounced) ─────────────────────────────────────────────
  const cartSyncTimer = useRef(null);

  const syncCartToDB = useCallback((newCart) => {
    const tkn = tokenRef.current;
    if (!tkn) return;
    clearTimeout(cartSyncTimer.current);
    cartSyncTimer.current = setTimeout(async () => {
      try {
        const items = newCart.map(item => ({
          productId:    item.product.id,
          title:        item.product.title,
          images:       item.product.images || [],
          size:         item.size,
          color:        item.color,
          quantity:     item.quantity,
          price:        item.product.price,
          discountPrice: item.product.discountPrice,
        }));
        await api('/api/cart', 'PUT', { items }, tkn);
      } catch (err) {
        console.error('Cart sync error:', err);
      }
    }, 600); // 600ms debounce
  }, []);

  // ─── Cart actions ────────────────────────────────────────────────────────────
  const addToCart = useCallback((product, size = 'M', color = 'Black', quantity = 1) => {
    if (!isLoggedIn) {
      showToast('Please log in to add items to your cart', 'error');
      setCurrentPage('account');
      return false;
    }
    setCart(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.size === size && i.color === color
      );
      const next = existing
        ? prev.map(i =>
            i.product.id === product.id && i.size === size && i.color === color
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...prev, { product, size, color, quantity }];
      syncCartToDB(next);
      return next;
    });
    showToast(`${product.title} added to cart!`, 'success');
    return true;
  }, [isLoggedIn, syncCartToDB, showToast, setCurrentPage]);

  const updateCartQuantity = useCallback((productId, size, color, quantity) => {
    setCart(prev => {
      const next = quantity <= 0
        ? prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color))
        : prev.map(i =>
            i.product.id === productId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          );
      syncCartToDB(next);
      return next;
    });
  }, [syncCartToDB]);

  const removeFromCart = useCallback((productId, size, color) => {
    setCart(prev => {
      const next = prev.filter(
        i => !(i.product.id === productId && i.size === size && i.color === color)
      );
      syncCartToDB(next);
      return next;
    });
  }, [syncCartToDB]);

  const clearCart = useCallback(async () => {
    setCart([]);
    const tkn = tokenRef.current;
    if (tkn) {
      try { await api('/api/cart', 'DELETE', null, tkn); } catch (e) { /* ignore */ }
    }
  }, []);

  // ─── Wishlist actions ────────────────────────────────────────────────────────
  // wishlist is stored as array of productIds (numbers) in state
  const addToWishlist = useCallback(async (product) => {
    if (!isLoggedIn) {
      showToast('Please log in to add items to your wishlist', 'error');
      setCurrentPage('account');
      return false;
    }
    setWishlist(prev => prev.includes(product.id) ? prev : [...prev, product.id]);
    const tkn = tokenRef.current;
    if (tkn) {
      try { await api(`/api/wishlist/${product.id}`, 'POST', null, tkn); } catch (e) { /* ignore */ }
    }
    showToast('Added to wishlist!', 'success');
    return true;
  }, [isLoggedIn, showToast, setCurrentPage]);

  const removeFromWishlist = useCallback(async (productId) => {
    setWishlist(prev => prev.filter(id => id !== productId));
    const tkn = tokenRef.current;
    if (tkn) {
      try { await api(`/api/wishlist/${productId}`, 'DELETE', null, tkn); } catch (e) { /* ignore */ }
    }
  }, []);

  // Derive full product objects from wishlist productIds
  const wishlistProducts = wishlist
    .map(id => products.find(p => p.id === id))
    .filter(Boolean);

  // ─── Orders ──────────────────────────────────────────────────────────────────
  const addOrder = useCallback((order) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const fetchOrders = useCallback(async () => {
    const tkn = tokenRef.current;
    if (!tkn) return;
    try {
      const data = await api('/api/orders', 'GET', null, tkn);
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  // ─── Profile & Address ───────────────────────────────────────────────────────
  const updateUserProfile = useCallback(async (fields) => {
    const tkn = tokenRef.current;
    if (!tkn) return { success: false, message: 'Not authenticated.' };
    try {
      const data = await api('/api/users/profile', 'PUT', fields, tkn);
      if (data.success) {
        setUser(prev => ({
          ...prev,
          name:  data.user.name  || prev.name,
          email: data.user.email || prev.email,
          phone: data.user.phone || prev.phone,
        }));
      }
      return data;
    } catch (err) {
      return { success: false, message: 'Connection failed.' };
    }
  }, []);

  const updateUserAddress = useCallback(async (newAddress) => {
    const tkn = tokenRef.current;
    if (!tkn) return { success: false, message: 'Not authenticated.' };
    try {
      const data = await api('/api/users/address', 'PUT', newAddress, tkn);
      if (data.success) setAddress(data.address);
      return data;
    } catch (err) {
      setAddress(newAddress); // optimistic local update
      return { success: false, message: 'Connection failed.' };
    }
  }, []);

  // ─── Support tickets ─────────────────────────────────────────────────────────
  const raiseTicket = useCallback((ticket) => {
    setSupportTickets(prev => [ticket, ...prev]);
  }, []);

  // ─── Manual login (for email/password registration) ─────────────────
  const loginWithToken = useCallback(async (tkn, userData) => {
    setToken(tkn);
    setUser(userData);
    setIsLoggedIn(true);
    // Push profile to DB then load all user data
    try {
      await api('/api/users/profile', 'PUT', {
        name:  userData.name,
        email: userData.email,
        phone: userData.phone || '',
      }, tkn);
    } catch (e) { /* ignore */ }
    await loadUserData(tkn);
  }, [loadUserData]);

  const logout = useCallback(() => {
    clearUserData();
  }, [clearUserData]);

  // ─── Context value ───────────────────────────────────────────────────────────
  const contextValue = {
    // UI
    currentPage, setCurrentPage,
    products, loading, refreshProducts: fetchProducts,
    selectedProduct, setSelectedProduct,
    quickAddProduct, setQuickAddProduct,
    showCart, setShowCart,
    showSearch, setShowSearch,
    showMobileMenu, setShowMobileMenu,
    showToast, toasts, removeToast,
    selectedCategory, setSelectedCategory,
    shopFilter, setShopFilter,
    accountTab, setAccountTab,
    activeSupportTab, setActiveSupportTab,
    activeLegalTab, setActiveLegalTab,
    supportTickets, raiseTicket,

    // Auth
    isLoggedIn, token,
    user, setUser,
    loginWithToken, logout,

    // Cart
    cart,
    addToCart, updateCartQuantity, removeFromCart, clearCart,

    // Wishlist — expose both ID list and full product objects
    wishlist: wishlistProducts,
    wishlistIds: wishlist,
    addToWishlist, removeFromWishlist,

    // Orders
    orders, addOrder, fetchOrders,

    // Address & Profile
    address, setAddress,
    updateUserProfile, updateUserAddress,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
