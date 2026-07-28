import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import { TESTIMONIALS } from '../data/staticData';

const ProductDetailPage = () => {
  const { selectedProduct, products, addToCart, addToWishlist, removeFromWishlist, wishlistIds, showToast, setCurrentPage, setActiveSupportTab } = useAppContext();
  const isWishlisted = (wishlistIds || []).includes(selectedProduct?.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!selectedProduct) return null;

  const relatedProducts = products.filter(
    p => p.category === selectedProduct.category && p.id !== selectedProduct.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please select size and color', 'error');
      return;
    }
    addToCart(selectedProduct, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => setCurrentPage('home')} className="hover:text-accent">Home</button>
          <span>/</span>
          <button onClick={() => setCurrentPage('shop')} className="hover:text-accent">Shop</button>
          <span>/</span>
          <span className="text-primary">{selectedProduct.title}</span>
        </div>

        {/* Product Main */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-4 zoom-container border">
              <img
                src={selectedProduct.images[selectedImage]}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-accent' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {selectedProduct.badge && (
              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold uppercase mb-4 ${
                selectedProduct.badge === 'sale' ? 'badge-sale' :
                selectedProduct.badge === 'new' ? 'badge-new' : 'badge-limited'
              }`}>
                {selectedProduct.badge === 'sale' ? 'ON SALE' : selectedProduct.badge === 'new' ? 'JUST ARRIVED' : 'LIMITED EDITION'}
              </span>
            )}

            <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-4">
              {selectedProduct.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={selectedProduct.rating} size="lg" />
              <span className="text-gray-500">({selectedProduct.reviews} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              {selectedProduct.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-accent">₹{selectedProduct.discountPrice}</span>
                  <span className="text-xl text-gray-400 line-through">₹{selectedProduct.price}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                    Save {Math.round((1 - selectedProduct.discountPrice / selectedProduct.price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-primary">₹{selectedProduct.price}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-semibold text-primary">Size</label>
                <button 
                  onClick={() => {
                    setActiveSupportTab('size');
                    setCurrentPage('support');
                  }}
                  className="text-accent text-sm hover:underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-white'
                        : 'bg-white border hover:border-accent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="font-semibold text-primary block mb-3">Color</label>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                      selectedColor === color
                        ? 'bg-primary text-white'
                        : 'bg-white border hover:border-accent'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="font-semibold text-primary block mb-3">Quantity</label>
              <div className="inline-flex items-center bg-white rounded-xl border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn px-4 py-3 rounded-l-xl"
                >
                  <Icons.Minus />
                </button>
                <span className="px-6 py-3 font-semibold border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn px-4 py-3 rounded-r-xl"
                >
                  <Icons.Plus />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 btn-primary text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <Icons.Cart /> Add to Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (isWishlisted) {
                    removeFromWishlist(selectedProduct.id);
                    showToast('Removed from wishlist', 'error');
                  } else {
                    addToWishlist(selectedProduct);
                  }
                }}
                className={`px-6 py-4 rounded-xl border-2 transition-colors ${
                  isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-200 hover:border-accent'
                }`}
              >
                <Icons.Heart filled={isWishlisted} />
              </motion.button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-2 h-2 rounded-full ${(!selectedProduct.stock || selectedProduct.stock > 5) ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-gray-500">
                {selectedProduct.stock !== undefined ? (selectedProduct.stock > 5 ? 'In Stock' : `Only ${selectedProduct.stock} left`) : 'In Stock'} - Ships within 24 hours
              </span>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-8 border-b mb-8">
            {['description', 'reviews', 'shipping'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize font-medium transition-colors ${
                  activeTab === tab ? 'tab-active' : 'text-gray-500 hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div className="text-gray-600 leading-relaxed">
                <p className="mb-4">{selectedProduct.description}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Premium quality fabric blend</li>
                  <li>Oversized relaxed fit</li>
                  <li>High-quality screen printed graphics</li>
                  <li>Machine washable</li>
                  <li>Imported</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">{selectedProduct.rating}</p>
                    <StarRating rating={selectedProduct.rating} size="lg" />
                    <p className="text-gray-500 mt-2">{selectedProduct.reviews} Reviews</p>
                  </div>
                </div>

                {TESTIMONIALS.slice(0, 3).map(review => (
                  <div key={review.id} className="p-6 bg-white rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={review.avatar} alt="" className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-gray-600 space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-primary mb-2">Free Shipping</h3>
                  <p>On all orders over ₹1,499. Standard shipping takes 3-5 business days.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-primary mb-2">Easy Returns</h3>
                  <p>30-day hassle-free returns. Items must be unworn with tags attached.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-gray-100">
                  <h3 className="font-semibold text-primary mb-2">Secure Payment</h3>
                  <p>All transactions are encrypted and secure. We accept all major credit cards.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
