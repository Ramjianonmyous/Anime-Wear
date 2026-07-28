import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from '../components/Icons';
import ProductCard from '../components/ProductCard';

const ShopPage = () => {
  const { products, loading, selectedCategory, setSelectedCategory, shopFilter } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Filter by tag (New Arrivals, Sale)
    if (shopFilter === 'new') {
      result = result.filter(p => p.badge === 'new');
    } else if (shopFilter === 'sale') {
      result = result.filter(p => p.badge === 'sale');
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.featured - a.featured);
    }

    setFilteredProducts(result);
  }, [selectedCategory, sortBy, priceRange, products, shopFilter]);

  const getCategoryCount = (cat) => {
    if (cat === 'All') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  const getPageTitle = () => {
    if (shopFilter === 'new') return 'New Arrivals';
    if (shopFilter === 'sale') return 'Special Offers & Sale';
    return 'Shop All Products';
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-4xl text-primary mb-2">{getPageTitle()}</h1>
          <p className="text-gray-500">
            {loading ? 'Loading catalog...' : `${filteredProducts.length} products found`}
          </p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
          <div className="flex items-center gap-4">
            {shopFilter === 'all' && (
              <>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border hover:border-accent transition-colors lg:hidden"
                >
                  <Icons.Filter /> Filters
                </button>

                <div className="flex gap-2 overflow-x-auto pb-2 max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-none">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-accent text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat} ({getCategoryCount(cat)})
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white rounded-xl border focus:border-accent outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="hidden md:flex gap-1 bg-white rounded-xl p-1 border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-gray-600'}`}
              >
                <Icons.Grid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-accent text-white' : 'text-gray-600'}`}
              >
                <Icons.List />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel (Collapsible) */}
        {shopFilter === 'all' && (
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-accent font-medium mb-4"
            >
              <Icons.Filter /> {showFilters ? 'Hide Filters' : 'Show Price Filter'}
            </button>
            
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 overflow-hidden border border-gray-100"
                >
                  <h3 className="font-semibold mb-4 text-primary">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-24 px-3 py-2 border rounded-lg"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-24 px-3 py-2 border rounded-lg"
                      placeholder="Max"
                    />
                    <button 
                      onClick={() => setPriceRange([0, 5000])}
                      className="text-xs text-gray-400 hover:text-accent ml-4"
                    >
                      Reset Range
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
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
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setPriceRange([0, 5000]);
                setShopFilter('all');
              }}
              className="mt-4 btn-primary text-white px-6 py-3 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
