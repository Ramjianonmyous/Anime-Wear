import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

/** Dynamically loads the Razorpay checkout.js script */
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CheckoutPage = () => {
  const {
    cart,
    showToast,
    setCurrentPage,
    addOrder,
    clearCart,
    setAccountTab,
    token,
    user,
    address: savedAddress,
    updateUserAddress,
  } = useAppContext();

  const [step, setStep] = useState(1);

  // Shipping form states — pre-filled from logged-in user profile
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [lastName, setLastName]   = useState(user?.name ? user.name.split(' ').slice(1).join(' ') : '');
  const [email, setEmail]         = useState(user?.email || '');
  const [address, setAddress]     = useState(savedAddress?.address || '');
  const [city, setCity]           = useState(savedAddress?.city || '');
  const [zipCode, setZipCode]     = useState(savedAddress?.zipCode || '');

  const [processingPayment, setProcessingPayment] = useState(false);

  // ── Coupon Code state & validation ───────────────────────────────────────
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const VALID_COUPONS = {
    ANIME20:   { percent: 20, description: '20% Off Newsletter Discount' },
    SHINOBI10: { percent: 10, description: '10% Off Special Discount' },
    FREESHIP:  { percent: 0,  freeShipping: true, description: 'Free Shipping' },
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return;
    if (VALID_COUPONS[cleanCode]) {
      setAppliedCoupon({ code: cleanCode, ...VALID_COUPONS[cleanCode] });
      showToast(`Coupon "${cleanCode}" applied! Saved discount on order.`, 'success');
    } else {
      showToast('Invalid promo code. Use ANIME20 for 20% OFF!', 'error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    showToast('Coupon removed.', 'info');
  };

  // ── Price calculation ─────────────────────────────────────────────────────
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * (appliedCoupon.percent || 0)) / 100 : 0;
  const shipping = (appliedCoupon?.freeShipping || subtotal > 1499) ? 0 : 99;
  const tax = Math.max(0, subtotal - discountAmount) * 0.1;
  const total = Math.max(0, subtotal - discountAmount + shipping + tax);

  // ── Save order to DB after successful payment ─────────────────────────────
  const saveOrderAfterPayment = async (paymentId, razorpayOrderId) => {
    const orderData = {
      shippingAddress: { firstName, lastName, email, address, city, zipCode },
      paymentId,
      razorpayOrderId,
      items: cart.map((item) => ({
        id:       item.product.id,
        title:    item.product.title,
        image:    item.product.images?.[0] || '',
        size:     item.size,
        color:    item.color,
        quantity: item.quantity,
        price:    item.product.discountPrice || item.product.price,
      })),
      total: total.toFixed(2),
    };

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });
      const data = await response.json();

      if (data.success) {
        addOrder(data.order);
      } else {
        showToast(data.message || 'Failed to record order on server.', 'error');
        return;
      }
    } catch (err) {
      console.error('Order saving error:', err);
      showToast('Connection error saving order.', 'error');
      return;
    }

    // Persist address to user profile
    updateUserAddress({
      address,
      city,
      zipCode,
      state:   savedAddress?.state   || 'Maharashtra',
      country: savedAddress?.country || 'India',
    });

    clearCart();
    showToast(`Payment successful! Order confirmed.`, 'success');
    setAccountTab('orders');
    setCurrentPage('account');
  };

  // ── Razorpay payment handler ──────────────────────────────────────────────
  const handleRazorpayPayment = async () => {
    if (!RAZORPAY_KEY_ID) {
      showToast('Razorpay Key ID is not configured. Add VITE_RAZORPAY_KEY_ID to your frontend .env file.', 'error');
      return;
    }

    setProcessingPayment(true);

    // 1. Load checkout.js
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      showToast('Failed to load Razorpay SDK. Check your internet connection.', 'error');
      setProcessingPayment(false);
      return;
    }

    // 2. Create Razorpay order on backend
    let razorpayOrderId, amountInPaise, currency;
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res  = await fetch(`${BASE_URL}/api/payment/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ amount: total.toFixed(2) }),
      });
      const data = await res.json();

      if (!data.success) {
        showToast(data.message || 'Failed to create payment order.', 'error');
        setProcessingPayment(false);
        return;
      }

      razorpayOrderId = data.orderId;
      amountInPaise   = data.amount;
      currency        = data.currency;
    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      showToast('Could not connect to payment server. Please try again.', 'error');
      setProcessingPayment(false);
      return;
    }

    // 3. Open Razorpay checkout modal
    const options = {
      key:         RAZORPAY_KEY_ID,
      amount:      amountInPaise,
      currency:    currency,
      name:        'Animewear',
      description: `Order for ${cart.length} item${cart.length !== 1 ? 's' : ''}`,
      image:       '/logo.png',
      order_id:    razorpayOrderId,
      prefill: {
        name:    `${firstName} ${lastName}`,
        email:   email,
        contact: user?.phone || '',
      },
      notes: {
        address: `${address}, ${city} - ${zipCode}`,
      },
      theme: {
        color: '#6366f1',
        hide_topbar: false,
      },
      // ── Explicitly enable all payment methods ──────────────────────────────
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay via UPI',
              instruments: [
                { method: 'upi' },
              ],
            },
            other: {
              name: 'Other Payment Methods',
              instruments: [
                { method: 'card' },
                { method: 'netbanking' },
                { method: 'wallet' },
                { method: 'emi' },
              ],
            },
          },
          sequence: ['block.banks', 'block.other'],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: async (response) => {
        // 4. Verify signature on backend
        try {
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const verifyRes  = await fetch(`${BASE_URL}/api/payment/verify`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await saveOrderAfterPayment(response.razorpay_payment_id, response.razorpay_order_id);
          } else {
            showToast('Payment verification failed. Contact support.', 'error');
          }
        } catch (err) {
          console.error('Signature verification error:', err);
          // Still record the order — payment was collected by Razorpay
          await saveOrderAfterPayment(response.razorpay_payment_id, response.razorpay_order_id);
        }
        setProcessingPayment(false);
      },
      modal: {
        ondismiss: () => {
          showToast('Payment cancelled.', 'error');
          setProcessingPayment(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // ── Empty cart guard ──────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl border">
          <h2 className="font-display font-bold text-2xl mb-4 text-primary">Your cart is empty</h2>
          <button
            onClick={() => setCurrentPage('shop')}
            className="btn-primary text-white px-8 py-4 rounded-xl font-semibold"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4">

        {/* Header + Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display font-bold text-4xl text-primary">Checkout</h1>
          <div className="flex items-center gap-4 mt-6">
            {['Shipping', 'Review & Pay'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? <Icons.Check /> : i + 1}
                </div>
                <span className={`font-medium ${step >= i + 1 ? 'text-primary' : 'text-gray-400'}`}>{s}</span>
                {i < 1 && <div className={`w-16 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {/* ── Step 1: Shipping ── */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 md:p-8 border"
              >
                <h2 className="font-display font-bold text-xl mb-6 text-primary">Shipping Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="Doe" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Address</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="Mumbai" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-accent transition-colors"
                      placeholder="400001" />
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (!firstName || !lastName || !email || !address || !city || !zipCode) {
                      showToast('Please fill in all shipping fields', 'error');
                      return;
                    }
                    setStep(2);
                  }}
                  className="mt-6 btn-primary w-full text-white py-4 rounded-xl font-semibold"
                >
                  Continue to Review
                </motion.button>
              </motion.div>
            )}

            {/* ── Step 2: Review & Pay ── */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 md:p-8 border"
              >
                <h2 className="font-display font-bold text-xl mb-6 text-primary">Review & Pay</h2>

                {/* Shipping summary */}
                <div className="p-4 bg-gray-50 rounded-xl border mb-4">
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="font-semibold text-primary">{firstName} {lastName}</p>
                  <p className="text-gray-600 text-sm">{address}, {city} — {zipCode}</p>
                  <p className="text-gray-600 text-sm">{email}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex items-center gap-4 border-b pb-3 last:border-0 last:pb-0">
                      <img src={item.product.images[0]} alt={item.product.title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-primary">{item.product.title}</p>
                        <p className="text-sm text-gray-500">{item.size} / {item.color} × {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-primary flex-shrink-0">
                        ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Razorpay trust badge */}
                <div className="flex items-center gap-2 mb-6 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-blue-700">
                    Payments are securely processed by <strong>Razorpay</strong> using 256-bit SSL encryption.
                  </p>
                </div>

                {/* ── Coupon Code Section ── */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-accent">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3.15 12 5.582l2.432-2.432a2.25 2.25 0 0 1 3.182 0l2.432 2.432a2.25 2.25 0 0 1 0 3.182L17.618 11.6l2.432 2.432a2.25 2.25 0 0 1 0 3.182l-2.432 2.432a2.25 2.25 0 0 1-3.182 0L12 17.218l-2.432 2.432a2.25 2.25 0 0 1-3.182 0l-2.432-2.432a2.25 2.25 0 0 1 0-3.182L6.382 11.6 3.95 9.168a2.25 2.25 0 0 1 0-3.182l2.432-2.432a2.25 2.25 0 0 1 3.186 0Z" />
                      </svg>
                      Apply Coupon / Promo Code
                    </label>
                    {sessionStorage.getItem('newsletter_subscribed') && !appliedCoupon && (
                      <button
                        type="button"
                        onClick={() => { setCouponCode('ANIME20'); }}
                        className="text-xs text-accent hover:underline font-semibold"
                      >
                        Use ANIME20
                      </button>
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code (e.g. ANIME20)"
                        className="flex-1 px-3 py-2 rounded-lg border text-sm uppercase font-mono focus:outline-none focus:border-accent"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold">✓ {appliedCoupon.code}</span>
                        <span className="text-green-700 text-xs font-medium">({appliedCoupon.description})</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-gray-400 hover:text-red-500 font-bold px-2 py-0.5 text-xs rounded hover:bg-gray-100"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm mb-6 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-primary">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-primary">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax (10%)</span>
                    <span className="text-primary">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span className="text-primary">Total</span>
                    <span className="text-accent">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-xl border font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: processingPayment ? 1 : 1.02 }}
                    whileTap={{ scale: processingPayment ? 1 : 0.98 }}
                    disabled={processingPayment}
                    onClick={handleRazorpayPayment}
                    className="flex-2 flex-1 btn-primary text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {processingPayment ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Pay ₹{total.toFixed(2)} via Razorpay</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 sticky top-28 border shadow-sm"
            >
              <h3 className="font-display font-bold text-lg mb-4 text-primary">Order Summary</h3>

              <div className="space-y-3 text-sm mb-4">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex justify-between">
                    <span className="text-gray-600 truncate mr-2">{item.product.title} ×{item.quantity}</span>
                    <span className="font-medium text-primary">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />



              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-primary">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-primary">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-primary">₹{tax.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-primary">Total</span>
                  <span className="text-accent">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-accent mt-4 bg-accent/10 p-3 rounded-lg">
                  Add ₹{(1499 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secured by Razorpay
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
