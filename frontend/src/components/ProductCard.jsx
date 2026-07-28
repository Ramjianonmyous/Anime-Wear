import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';
import StarRating from './StarRating';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistIds, showToast, setSelectedProduct, setCurrentPage, setQuickAddProduct } = useAppContext();
  const isWishlisted = (wishlistIds || []).includes(product.id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'error');
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setQuickAddProduct(product);
  };

  const handleClick = () => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onClick={handleClick}
      className="product-card bg-white rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.title}
          className="product-image w-full h-full object-cover"
        />

        {/* Badges */}
        {product.badge && (
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold uppercase ${
            product.badge === 'sale' ? 'badge-sale' :
            product.badge === 'new' ? 'badge-new' : 'badge-limited'
          }`}>
            {product.badge === 'sale' ? 'SALE' : product.badge === 'new' ? 'NEW' : 'LIMITED'}
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Icons.Heart filled={isWishlisted} />
          </motion.button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full btn-primary text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Icons.Cart />
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-accent">₹{product.discountPrice}</span>
              <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
              <span className="ml-auto text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-primary">₹{product.price}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
