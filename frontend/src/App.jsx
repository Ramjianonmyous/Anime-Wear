import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext, AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import SearchModal from './components/SearchModal';
import QuickAddModal from './components/QuickAddModal';
import Toast from './components/Toast';
import FloatingRKButton from './components/FloatingRKButton';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import SupportPage from './pages/SupportPage';
import LegalPage from './pages/LegalPage';
import AdminPage from './pages/AdminPage';

const AppContent = () => {
  const { currentPage, activeSupportTab, activeLegalTab, selectedCategory, shopFilter, toasts, removeToast } = useAppContext();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentPage, activeSupportTab, activeLegalTab, selectedCategory, shopFilter]);

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'account':
        return <AccountPage />;
      case 'support':
        return <SupportPage />;
      case 'legal':
        return <LegalPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
      <CartSidebar />
      <SearchModal />
      <QuickAddModal />
      <FloatingRKButton />

      {/* Toast Notifications */}
      <div className="fixed top-24 right-4 z-[101] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
