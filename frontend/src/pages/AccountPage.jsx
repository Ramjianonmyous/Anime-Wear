import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from '../components/Icons';
import { useAppContext } from '../context/AppContext';
import { auth, googleProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '../firebase';

const AccountPage = () => {
  const { isLoggedIn, loginWithToken, logout, accountTab, setAccountTab, user, setUser, token, address: savedAddress, setAddress, orders, products, setCurrentPage, updateUserProfile, updateUserAddress, showToast } = useAppContext();
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Address Modal & Form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleOpenAddressModal = (isEdit = false) => {
    if (isEdit && savedAddress) {
      setAddressForm({
        address: savedAddress.address || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        zipCode: savedAddress.zipCode || '',
        country: savedAddress.country || 'India',
      });
    } else {
      setAddressForm({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.address || !addressForm.city || !addressForm.zipCode) {
      showToast('Please fill in required fields: Address, City, and Zip Code.', 'error');
      return;
    }
    const res = await updateUserAddress({
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state || 'Maharashtra',
      zipCode: addressForm.zipCode,
      country: addressForm.country || 'India',
    });
    if (res.success || res.address) {
      showToast('Address saved successfully!', 'success');
      setShowAddressModal(false);
    } else {
      showToast(res.message || 'Address updated locally.', 'info');
      setShowAddressModal(false);
    }
  };

  const handleDeleteAddress = async () => {
    const emptyAddress = { address: '', city: '', state: '', zipCode: '', country: '' };
    await updateUserAddress(emptyAddress);
    setAddress(null);
    showToast('Address deleted.', 'info');
  };

  // Register form states
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Profile Settings form states
  const [profileFirst, setProfileFirst] = useState(user?.name ? user.name.split(' ')[0] : '');
  const [profileLast, setProfileLast] = useState(user?.name ? user.name.split(' ')[1] || '' : '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      setProfileFirst(user.name ? user.name.split(' ')[0] : '');
      setProfileLast(user.name ? user.name.split(' ')[1] || '' : '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
    }
  }, [user]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

  const handleSignIn = async () => {
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast('Signed in successfully!', 'success');
    } catch (error) {
      console.error('Firebase Sign In Error:', error);
      showToast(error.message || 'Failed to sign in. Check email and password.', 'error');
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!regFirstName || !regLastName || !regEmail || !regPassword) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    const fullName = `${regFirstName} ${regLastName}`;

    try {
      const credential = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      await updateProfile(credential.user, { displayName: fullName });
      showToast('Account created successfully!', 'success');
    } catch (error) {
      console.error('Registration Error:', error);
      showToast(error.message || 'Registration failed.', 'error');
    }
  };

  const handleSaveProfile = async () => {
    if (!profileFirst || !profileLast || !profileEmail) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    const res = await updateUserProfile({
      name: `${profileFirst} ${profileLast}`,
      email: profileEmail,
      phone: profilePhone
    });
    if (res.success) {
      showToast(res.message, 'success');
    } else {
      showToast(res.message || 'Failed to update profile.', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Successfully signed in with Google!', 'success');
    } catch (error) {
      console.error('Google Auth Error:', error);
      showToast(error.message || 'Google Sign-In failed', 'error');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'JD';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-28 pb-20 min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-white rounded-2xl p-8 border shadow-sm">
            {/* Tabs */}
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1 border">
              <button
                onClick={() => setShowLogin(true)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${showLogin ? 'bg-white shadow text-primary font-semibold' : 'text-gray-500'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${!showLogin ? 'bg-white shadow text-primary font-semibold' : 'text-gray-500'
                  }`}
              >
                Register
              </button>
            </div>

            {showLogin ? (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-2xl text-primary">Welcome Back</h2>
                <p className="text-gray-500">Sign in to access your account</p>

                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border focus:border-accent"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border focus:border-accent"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded accent-accent" defaultChecked />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button className="text-sm text-accent hover:underline">Forgot password?</button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignIn}
                  className="w-full btn-primary text-white py-4 rounded-xl font-semibold"
                >
                  Sign In
                </motion.button>

                <div className="relative my-6">
                  <hr />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-400">or continue with</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="py-3.5 border rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5 text-primary text-sm shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.34 7.58l3.96 3.07C6.26 7.4 8.87 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z" />
                      <path fill="#FBBC05" d="M5.3 14.35A7.16 7.16 0 0 1 4.96 12c0-.82.12-1.61.34-2.35L1.34 6.58A11.96 11.96 0 0 0 0 12c0 1.95.47 3.8 1.3 5.46l4-3.11z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.13 0-5.74-2.36-6.7-5.32L1.3 16.15C3.32 20.08 7.31 23 12 23z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-2xl text-primary">Create Account</h2>
                <p className="text-gray-500">Join us and start shopping</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" placeholder="John" value={regFirstName} onChange={e => setRegFirstName(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" placeholder="Doe" value={regLastName} onChange={e => setRegLastName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border focus:border-accent" placeholder="your@email.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Phone Number</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" placeholder="+91 98765 43210" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Password</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl border focus:border-accent" placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-accent mt-1" />
                  <span className="text-sm text-gray-600">I agree to the Terms of Service and Privacy Policy</span>
                </label>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRegister}
                  className="w-full btn-primary text-white py-4 rounded-xl font-semibold"
                >
                  Create Account
                </motion.button>

                <div className="relative my-6">
                  <hr />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-400">or continue with</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="py-3.5 border rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2.5 text-primary text-sm shadow-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.34 7.58l3.96 3.07C6.26 7.4 8.87 5.04 12 5.04z" />
                      <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.01 3.67-8.64z" />
                      <path fill="#FBBC05" d="M5.3 14.35A7.16 7.16 0 0 1 4.96 12c0-.82.12-1.61.34-2.35L1.34 6.58A11.96 11.96 0 0 0 0 12c0 1.95.47 3.8 1.3 5.46l4-3.11z" />
                      <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.13 0-5.74-2.36-6.7-5.32L1.3 16.15C3.32 20.08 7.31 23 12 23z" />
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 border shadow-sm"
        >
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="w-20 h-20 rounded-full object-cover border shadow-sm" />
            ) : (
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-accent">{getInitials(user.name)}</span>
              </div>
            )}
            <div>
              <h1 className="font-display font-bold text-2xl text-primary">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => {
                signOut(auth).then(() => logout()).catch(() => logout());
                showToast('Signed out successfully.', 'success');
              }}
              className="ml-auto text-sm text-red-500 hover:underline"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setAccountTab('profile')}
              className={`p-4 rounded-xl text-center border transition-all ${accountTab === 'profile'
                  ? 'bg-accent/5 border-accent text-accent font-semibold'
                  : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icons.User />
                <span className="text-sm">Profile Settings</span>
              </div>
            </button>
            <button
              onClick={() => setAccountTab('orders')}
              className={`p-4 rounded-xl text-center border transition-all ${accountTab === 'orders'
                  ? 'bg-accent/5 border-accent text-accent font-semibold'
                  : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icons.Cart />
                <span className="text-sm">Order History</span>
              </div>
            </button>
            <button
              onClick={() => setAccountTab('addresses')}
              className={`p-4 rounded-xl text-center border transition-all ${accountTab === 'addresses'
                  ? 'bg-accent/5 border-accent text-accent font-semibold'
                  : 'bg-white hover:bg-gray-50 border-gray-100 text-gray-600'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Icons.Heart filled={accountTab === 'addresses'} />
                <span className="text-sm">Saved Addresses</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="border-t pt-8">
            {accountTab === 'profile' && (
              <div className="max-w-xl space-y-4">
                <h3 className="font-display font-bold text-xl text-primary mb-4">Edit Profile Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">First Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" value={profileFirst} onChange={e => setProfileFirst(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-primary">Last Name</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" value={profileLast} onChange={e => setProfileLast(e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-primary">Email Address</label>
                    <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded border border-gray-200">Primary Email (Locked)</span>
                  </div>
                  <input
                    type="email"
                    disabled
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border bg-gray-100 text-gray-500 cursor-not-allowed font-medium select-none"
                    value={user?.email || profileEmail || ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-primary">Phone Number</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border focus:border-accent" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} />
                </div>
                <button onClick={handleSaveProfile} className="btn-primary text-white px-6 py-3 rounded-xl font-medium mt-4">
                  Save Changes
                </button>
              </div>
            )}

            {accountTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-xl text-primary mb-4">Your Orders</h3>

                {orders.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                    <p className="font-medium mb-4">No orders found.</p>
                    <button
                      onClick={() => setCurrentPage('shop')}
                      className="btn-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold inline-block"
                    >
                      Shop Our Collection
                    </button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const tracking = order.trackingNumber || `AW-${Math.floor(10000 + Math.random() * 90000)}`;
                    return (
                      <div key={order._id || tracking} className="border border-gray-100 rounded-2xl p-6">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">ORDER NUMBER</p>
                            <p className="font-bold text-primary">#{tracking}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">DATE PLACED</p>
                            <p className="font-medium text-primary">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">TOTAL AMOUNT</p>
                            <p className="font-bold text-accent">₹{order.total}</p>
                          </div>
                          <div>
                            <span className={`inline-block px-3 py-1 text-xs rounded-full font-bold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {order.status || 'IN TRANSIT'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1 space-y-4">
                            {order.items.map((item, idx) => {
                              const prod = products.find(p => p.id === item.id);
                              return (
                                <div key={idx} className="flex gap-4">
                                  {prod?.image ? (
                                    <img src={prod.image} alt={item.title} className="w-16 h-20 object-cover rounded-xl border" />
                                  ) : (
                                    <div className="w-16 h-20 bg-gray-100 rounded-xl border flex items-center justify-center text-xs font-bold text-gray-400">
                                      AW
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-primary">{item.title}</p>
                                    <p className="text-sm text-gray-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                                    <p className="text-sm text-accent font-bold mt-1">₹{item.price}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="flex-1 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                            <h4 className="font-semibold text-sm text-primary mb-2">Shipping To:</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                              <br />
                              {order.shippingAddress.address}, {order.shippingAddress.city}
                              <br />
                              Zip Code: {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {accountTab === 'addresses' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-xl text-primary mb-4">Manage Addresses</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {savedAddress ? (
                    <div className="border-2 border-accent/20 bg-accent/[0.01] rounded-2xl p-6 relative">
                      <span className="absolute top-4 right-4 text-xs font-bold text-accent uppercase tracking-wider bg-accent/10 px-2.5 py-1 rounded-full">
                        Default
                      </span>
                      <h4 className="font-bold text-primary mb-2">Home Address</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {user.name}
                        <br />
                        {savedAddress.address},
                        <br />
                        {savedAddress.city || ''} {savedAddress.state || ''}, {savedAddress.country || ''} - {savedAddress.zipCode}
                        <br />
                        Phone: {user.phone}
                      </p>
                      <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100 text-sm font-semibold">
                        <button onClick={() => handleOpenAddressModal(true)} className="text-accent hover:underline">Edit</button>
                        <button onClick={handleDeleteAddress} className="text-gray-400 hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-gray-200 rounded-2xl p-6 flex items-center justify-center text-gray-500 text-sm font-medium">
                      No address saved yet. Click below to add one!
                    </div>
                  )}

                  <button
                    onClick={() => handleOpenAddressModal(false)}
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-6 hover:border-accent hover:bg-accent/[0.01] transition-all flex flex-col items-center justify-center text-gray-400 hover:text-accent group cursor-pointer"
                  >
                    <span className="text-3xl font-light mb-2 group-hover:scale-110 transition-transform">+</span>
                    <span className="font-semibold text-sm">Add New Address</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Address Form Modal ── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-display font-bold text-xl text-primary">
                {savedAddress?.address ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddressSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat No., Street Name, Area"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    PIN / Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="400001"
                    value={addressForm.zipCode}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="India"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-5 py-2.5 rounded-xl border text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-accent/20 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
