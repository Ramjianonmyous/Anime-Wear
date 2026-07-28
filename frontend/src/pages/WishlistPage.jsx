import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, setCurrentPage, showToast, addToCart } = useAppContext();

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display font-bold text-4xl text-primary mb-2">My Wishlist</h1>
          <p className="text-gray-500 mb-8">{wishlist.length} items saved</p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white rounded-2xl border"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center text-accent">
              <Icons.Heart filled={true} />
            </div>
            <h2 className="font-display font-bold text-2xl text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save items you love for later</p>
            <button
              onClick={() => setCurrentPage('shop')}
              className="btn-primary text-white px-8 py-4 rounded-xl font-semibold"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <ProductCard product={product} />
                <button
                  onClick={() => {
                    removeFromWishlist(product.id);
                    showToast('Removed from wishlist', 'error');
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                >
                  <Icons.Close />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
