import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { CATEGORIES, TESTIMONIALS } from '../data/staticData';

// ==================== HERO SECTION ====================
const HeroSection = () => {
  const { setCurrentPage, products, addToCart, showToast, setSelectedProduct } = useAppContext();
  const zoroHoodie = products.find(p => p.id === 9);

  const handleBuyZoro = (e) => {
    e.stopPropagation();
    if (zoroHoodie) {
      addToCart(zoroHoodie, 'M', 'Black', 1);
    } else {
      showToast('Product loading...', 'info');
    }
  };

  const handleViewZoro = () => {
    if (zoroHoodie) {
      setSelectedProduct(zoroHoodie);
      setCurrentPage('product');
    }
  };

  return (
    <section className="hero-gradient min-h-screen relative overflow-hidden flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl float-animation" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-32 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm font-bold tracking-wide uppercase mb-6"
          >
            🔥 New Arrival
          </motion.span>

          <h1 className="hero-title font-display font-bold text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Zoro Textured
            <br />
            <span className="gradient-text">Oversized Hoodie</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
            Experience the ultimate in streetwear luxury. Heavyweight premium textured cotton, modern oversized drop-shoulder fit, and cinematic dark styling.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <div className="text-white">
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-1">Special Price</span>
              <span className="text-4xl font-bold text-accent">₹1,299</span>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div className="text-white">
              <span className="text-xs uppercase tracking-widest text-gray-400 block mb-1">Fabric</span>
              <span className="font-semibold text-gray-200">250 GSM Cotton</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBuyZoro}
              className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg flex items-center gap-2 pulse-glow"
            >
              <Icons.Cart />
              Add to Cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewZoro}
              className="px-8 py-4 rounded-xl text-white font-semibold text-lg border border-white/20 hover:border-white/40 transition-colors"
            >
              View Details
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">50K+</p>
              <p className="text-gray-500 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="text-gray-500 text-sm">Unique Designs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-gray-500 text-sm">Average Rating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block relative"
        >
          <div className="relative w-fit mx-auto group cursor-pointer" onClick={handleViewZoro}>
            <div className="absolute inset-0 bg-accent/10 rounded-3xl blur-xl group-hover:bg-accent/20 transition-colors duration-500"></div>
            <img
              src="/images/zoro_textured_hoodie.png"
              alt="Zoro Textured Hoodie"
              className="rounded-3xl shadow-2xl relative z-10 border border-white/10 group-hover:scale-[1.02] transition-transform duration-500 aspect-[4/5] object-cover w-[480px] mx-auto"
            />

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -left-16 top-1/4 glass rounded-2xl p-4 shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Icons.Check />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Premium Quality</p>
                  <p className="text-xs text-gray-400">100% Textured Cotton</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-16 bottom-1/4 glass rounded-2xl p-4 shadow-xl z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  ★ 5.0
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Zoro Edition</p>
                  <p className="text-xs text-gray-400">Streetwear Silhouette</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

// ==================== CATEGORIES SECTION ====================
const CategoriesSection = () => {
  const { setCurrentPage, setSelectedCategory, setShopFilter, products } = useAppContext();

  const categoryIcons = {
    "Oversized T-Shirts": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-6 1.5L4.5 15 7 14v5.5a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5V14l2.5 1 1.5-4.5L15 9m-6 0a3 3 0 016 0m-6 0V5.25A2.25 2.25 0 0111.25 3h1.5A2.25 2.25 0 0115 5.25V9" />
      </svg>
    ),
    "Hoodies": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v4m0 0l-2-2m2 2l2-2m-8-4.5V15a3 3 0 003 3h6a3 3 0 003-3v-5.5M7.5 9.5l-4 1.5L5 15l2.5-1M16.5 9.5l4 1.5L19 15l-2.5-1M12 3a6 6 0 00-6 6v.5h12V9a6 6 0 00-6-6z" />
      </svg>
    ),
    "Track Pants": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3h7.5M9 3v18h2.5v-7.5h1V21H15V3m-6 3.5h6" />
      </svg>
    ),
    "Joggers": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h8l1 9-2 8h-2l-1-7-1 7H9l-2-8 1-9z" />
      </svg>
    ),
    "Cargo Pants": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h8l1 18h-3v-6h-2v6H7L8 3zm-1 7h2m6 0h2" />
      </svg>
    ),
    "Graphic Tees": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-6 1.5L4.5 15 7 14v5.5a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5V14l2.5 1 1.5-4.5L15 9m-6 0a3 3 0 016 0m-3-1.5l.6 1.2 1.3.2-.9.9.2 1.3-1.2-.6-1.2.6.2-1.3-.9-.9 1.3-.2.6-1.2z" />
      </svg>
    ),
    "Caps": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 15a8 8 0 0115.66-2H21a1 1 0 011 1v1.5a1.5 1.5 0 01-1.5 1.5H4zM12 5v2m0 0a2 2 0 100-4 2 2 0 000 4z" />
      </svg>
    ),
    "Accessories": (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6V6zm2 2v8m8-8v8M12 2v2m0 16v2m-8-10h2m12 0h2" />
      </svg>
    )
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">Browse Categories</span>
          <h2 className="section-title font-display font-bold text-4xl mt-2 text-primary">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {CATEGORIES.slice(0, 8).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, scale: 1.03 }}
              onClick={() => {
                setSelectedCategory(category.name);
                setShopFilter('all');
                setCurrentPage('shop');
              }}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-accent shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-center flex flex-col items-center justify-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-500 group-hover:bg-accent group-hover:text-white flex items-center justify-center mb-3 transition-colors duration-300">
                {categoryIcons[category.name] || categoryIcons["Accessories"]}
              </div>
              <h3 className="font-semibold text-primary text-sm line-clamp-1 group-hover:text-accent transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                {products.filter(p => p.category === category.name).length} {products.filter(p => p.category === category.name).length === 1 ? 'Item' : 'Items'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== FEATURED PRODUCTS ====================
const FeaturedProducts = () => {
  const { products, loading } = useAppContext();
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-accent font-medium uppercase tracking-wider text-sm">Curated Selection</span>
            <h2 className="section-title font-display font-bold text-4xl mt-2 text-primary">Featured Products</h2>
          </div>
          <motion.button
            whileHover={{ x: 5 }}
            className="mt-4 md:mt-0 flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
          >
            View All Products <Icons.ArrowRight />
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-72 bg-gray-200 w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ==================== PROMO BANNER ====================
const PromoBanner = () => {
  const { setCurrentPage, setSelectedCategory, setShopFilter } = useAppContext();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden hero-gradient"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center p-8 md:p-16">
            <div>
              <span className="inline-block px-4 py-2 bg-accent text-white rounded-full text-sm font-bold mb-4">
                LIMITED TIME OFFER
              </span>
              <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
                Up to 40% Off
                <br />
                <span className="gradient-text">Summer Sale</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Don't miss out on our biggest sale of the season. Premium anime apparel at unbeatable prices.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory('All');
                  setShopFilter('sale');
                  setCurrentPage('shop');
                }}
                className="btn-primary px-8 py-4 rounded-xl text-white font-semibold text-lg"
              >
                Shop Sale Items
              </motion.button>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop"
                  alt="Sale Preview"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xl rotate-12">
                  SALE!
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ==================== TRENDING PRODUCTS ====================
const TrendingProducts = () => {
  const { products } = useAppContext();
  const trendingProducts = products.filter(p => p.trending).slice(0, 8);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">What's Hot Right Now</span>
          <h2 className="section-title font-display font-bold text-4xl mt-2 text-primary">Trending This Week</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== TESTIMONIALS ====================
const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">Customer Love</span>
          <h2 className="section-title font-display font-bold text-4xl mt-2 text-primary">What Our Customers Say</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-accent/20"
                />
                <div>
                  <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                "{testimonial.comment}"
              </p>
              <p className="text-xs text-accent font-medium">{testimonial.product}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== NEWSLETTER ====================
const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(() => !!sessionStorage.getItem('newsletter_subscribed'));
  const [copied, setCopied] = useState(false);
  const { showToast } = useAppContext();

  const COUPON_CODE = 'ANIME20';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      sessionStorage.setItem('newsletter_subscribed', 'true');
      sessionStorage.setItem('newsletter_email', email);
      setIsSubscribed(true);
      showToast('Thanks for subscribing! Use your coupon code below.', 'success');
      setEmail('');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setCopied(true);
    showToast(`Coupon code ${COUPON_CODE} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="py-20 hero-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
        {!isSubscribed ? (
          <motion.div
            key="subscribe-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
              Stay Updated
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Subscribe to get exclusive deals, new arrivals, and 20% off your first order!
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary px-8 py-4 rounded-xl text-white font-semibold whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>

            <p className="text-gray-500 text-sm mt-4">
              No spam, unsubscribe anytime. Read our Privacy Policy.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="subscribe-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center mx-auto text-accent text-3xl">
              🎉
            </div>
            <div>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
                Thanks for Subscribing!
              </h2>
              <p className="text-gray-300 text-base">
                Welcome to the Shinobi Squad! Here is your exclusive 20% discount coupon code for your next order:
              </p>
            </div>

            {/* Coupon Code Display Box */}
            <div className="bg-primary/80 p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-gray-400 uppercase tracking-widest block font-semibold mb-1">Your Promo Code</span>
                <span className="text-2xl md:text-3xl font-mono font-bold text-accent tracking-wider">{COUPON_CODE}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopyCode}
                type="button"
                className="w-full sm:w-auto px-6 py-3 bg-accent text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/30 transition-all"
              >
                {copied ? (
                  <>
                    <span>Copied!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Copy Code</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h6.75c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
                    </svg>
                  </>
                )}
              </motion.button>
            </div>

            <p className="text-gray-400 text-xs">
              Apply this code at checkout for 20% off all hoodies, tees, and accessories.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// ==================== INSTAGRAM GALLERY ====================
const InstagramGallery = () => {
  const images = [
    "/images/zoro_textured_hoodie.png",
    "/images/naruto_sage_tee.png",
    "/images/luffy_gear5_hoodie.png",
    "/images/akatsuki_cloud_hoodie.png",
    "/images/gojo_eyes_tee.png",
    "/images/tanjiro_cargo_pants.png"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium uppercase tracking-wider text-sm">@animewear_official</span>
          <h2 className="section-title font-display font-bold text-4xl mt-2 text-primary">Follow Us on Instagram</h2>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-xl overflow-hidden cursor-pointer zoom-container"
            >
              <img
                src={image}
                alt={`Instagram ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==================== EXPORT HOME PAGE ====================
const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
      <PromoBanner />
      <TrendingProducts />
      <TestimonialsSection />
      <NewsletterSection />
      <InstagramGallery />
    </>
  );
};

export default HomePage;
