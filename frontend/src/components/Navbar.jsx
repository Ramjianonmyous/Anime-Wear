import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';

const Navbar = () => {
  const { currentPage, cart, wishlist, setCurrentPage, setShowCart, setShowSearch, showMobileMenu, setShowMobileMenu, setSelectedCategory, setShopFilter, isLoggedIn, setAccountTab } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Shop', page: 'shop' },
    { name: 'New Arrivals', page: 'shop' },
    { name: 'Sale', page: 'shop' },
  ];

  const handleNavLinkClick = (link) => {
    setCurrentPage(link.page);
    if (link.name === 'Shop') {
      setSelectedCategory('All');
      setShopFilter('all');
    } else if (link.name === 'New Arrivals') {
      setSelectedCategory('All');
      setShopFilter('new');
    } else if (link.name === 'Sale') {
      setSelectedCategory('All');
      setShopFilter('sale');
    } else if (link.name === 'Home') {
      setSelectedCategory('All');
      setShopFilter('all');
    }
  };

  const isDarkHeader = currentPage === 'home' && !scrolled;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-black/5 text-primary' : 'bg-transparent text-white'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-primary text-white py-2 hidden md:block border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <p>Free Shipping on Orders Over ₹1,499 | Use Code: ANIME20 for 20% Off</p>
            <div className="flex gap-6">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setAccountTab('orders');
                    setCurrentPage('account');
                  } else {
                    setCurrentPage('account');
                  }
                }}
                className="hover:text-accent transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
              >
                Track Order
              </button>
              <button
                onClick={() => setCurrentPage('support')}
                className="hover:text-accent transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
              >
                Help Center
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className="hover:text-yellow-300 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium text-yellow-200"
              >
                ⚙ Admin
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <div className={`${scrolled ? 'py-3' : 'py-5'} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkHeader ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-primary hover:bg-gray-100'
              }`}
            >
              {showMobileMenu ? <Icons.Close /> : <Icons.Menu />}
            </button>

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentPage('home')}
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">A</span>
              </div>
              <span className={`font-display font-bold text-2xl transition-colors duration-300 ${
                isDarkHeader ? 'text-white' : 'text-primary'
              }`}>
                ANIME<span className="text-accent">WEAR</span>
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavLinkClick(link)}
                  className={`nav-link font-medium transition-colors duration-300 ${
                    isDarkHeader ? 'text-white/80 hover:text-white' : 'text-primary hover:text-accent'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(true)}
                className={`p-2.5 rounded-full transition-colors duration-300 ${
                  isDarkHeader ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-primary hover:bg-gray-100'
                }`}
              >
                <Icons.Search />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage('wishlist')}
                className={`relative p-2.5 rounded-full transition-colors duration-300 ${
                  isDarkHeader ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-primary hover:bg-gray-100'
                }`}
              >
                <Icons.Heart filled={false} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {wishlist.length}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowCart(true)}
                className={`relative p-2.5 rounded-full transition-colors duration-300 ${
                  isDarkHeader ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-primary hover:bg-gray-100'
                }`}
              >
                <Icons.Cart />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentPage('account')}
                className={`hidden sm:block p-2.5 rounded-full transition-colors duration-300 ${
                  isDarkHeader ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-primary hover:bg-gray-100'
                }`}
              >
                <Icons.User />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-24 bg-white lg:hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    handleNavLinkClick(link);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left py-3 px-4 text-lg font-medium text-primary hover:bg-gray-100 rounded-xl transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <hr className="my-4" />
              <button
                onClick={() => {
                  setCurrentPage('account');
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 w-full py-3 px-4 text-lg font-medium text-primary hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Icons.User /> My Account
              </button>
              <button
                onClick={() => {
                  setCurrentPage('wishlist');
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-3 w-full py-3 px-4 text-lg font-medium text-primary hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Icons.Heart filled={false} /> Wishlist ({wishlist.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
