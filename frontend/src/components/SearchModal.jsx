import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';

const SearchModal = () => {
  const { showSearch, setShowSearch, products, setSelectedProduct, setCurrentPage } = useAppContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, products]);

  if (!showSearch) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowSearch(false)}
      />

      {/* Modal Content */}
      <div
        className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4 p-4 border-b">
          <Icons.Search />
          <input
            type="text"
            placeholder="Search for anime clothing..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-lg outline-none bg-transparent"
          />
          <button onClick={() => setShowSearch(false)}>
            <Icons.Close />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((product) => (
              <button
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setShowSearch(false);
                  setCurrentPage('product');
                }}
                className="w-full flex items-center gap-4 p-4 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <p className="font-medium text-primary">{product.title}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className="ml-auto font-semibold text-accent">
                  ₹{product.discountPrice || product.price}
                </span>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
