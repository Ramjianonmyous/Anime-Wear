import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';

const QuickAddModal = () => {
  const { quickAddProduct, setQuickAddProduct, addToCart, showToast } = useAppContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Reset selections when product changes
  useEffect(() => {
    if (quickAddProduct) {
      // Default to first size/color if available
      setSelectedSize(quickAddProduct.sizes?.[0] || '');
      setSelectedColor(quickAddProduct.colors?.[0] || '');
    }
  }, [quickAddProduct]);

  const handleConfirmAdd = () => {
    if (!selectedSize || !selectedColor) {
      showToast('Please select size and color', 'error');
      return;
    }
    const success = addToCart(quickAddProduct, selectedSize, selectedColor, 1);
    if (success !== false) {
      setQuickAddProduct(null);
    }
  };

  if (!quickAddProduct) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setQuickAddProduct(null)}
      />

      {/* Modal Container */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickAddProduct(null)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-primary transition-colors"
        >
          <Icons.Close />
        </button>

        {/* Product Summary */}
        <div className="flex gap-4 items-center">
          <img
            src={quickAddProduct.images?.[0]}
            alt={quickAddProduct.title}
            className="w-20 h-20 object-cover rounded-xl border bg-gray-55"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-555 uppercase tracking-wider mb-1">{quickAddProduct.category}</p>
            <h3 className="font-semibold text-primary text-lg truncate mb-1">{quickAddProduct.title}</h3>
            <div className="flex items-center gap-2">
              {quickAddProduct.discountPrice ? (
                <>
                  <span className="text-lg font-bold text-accent">₹{quickAddProduct.discountPrice}</span>
                  <span className="text-sm text-gray-400 line-through">₹{quickAddProduct.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-primary">₹{quickAddProduct.price}</span>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Size Selector */}
        {quickAddProduct.sizes && quickAddProduct.sizes.length > 0 && (
          <div>
            <label className="font-semibold text-primary block mb-2 text-sm">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {quickAddProduct.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                    selectedSize === size
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-white border-gray-200 hover:border-accent text-gray-700'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selector */}
        {quickAddProduct.colors && quickAddProduct.colors.length > 0 && (
          <div>
            <label className="font-semibold text-primary block mb-2 text-sm">Select Color</label>
            <div className="flex flex-wrap gap-2">
              {quickAddProduct.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${
                    selectedColor === color
                      ? 'bg-primary border-primary text-white shadow-sm'
                      : 'bg-white border-gray-200 hover:border-accent text-gray-700'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleConfirmAdd}
          className="w-full btn-primary text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-shadow"
        >
          <Icons.Cart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default QuickAddModal;
