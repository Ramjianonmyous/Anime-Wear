import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const LegalPage = () => {
  const { activeLegalTab, setActiveLegalTab } = useAppContext();

  const currentTab = ['privacy', 'terms', 'cookie'].includes(activeLegalTab) ? activeLegalTab : 'privacy';

  const tabs = [
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />
        </svg>
      )
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      )
    },
    {
      id: 'cookie',
      label: 'Cookie Policy',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      )
    }
  ];

  const renderContent = () => {
    switch (currentTab) {
      case 'terms':
        return (
          <motion.div
            key="terms"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-8 border shadow-sm space-y-8 text-primary"
          >
            <div className="border-b pb-6">
              <span className="bg-accent/10 text-accent font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Legal Terms</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-primary">Terms of Service</h2>
              <p className="text-gray-400 text-xs mt-1">Last Updated: January 1, 2025</p>
            </div>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">1</span>
                Acceptance of Terms
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                By accessing or using AnimeWear ("the Platform", "we", "our"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the store or purchase our products.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">2</span>
                Products & Pricing
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All product descriptions, pricing, and availability are subject to change without notice. We make every effort to display garment colors and prints as accurately as possible. Prices are quoted in Indian Rupees (₹) inclusive of applicable taxes unless stated otherwise.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">3</span>
                Orders & Payments
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We accept major Credit/Debit cards, NetBanking, UPI, Razorpay, and Cash on Delivery (COD). We reserve the right to refuse or cancel any order if fraud or unauthorized transactions are suspected.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">4</span>
                Intellectual Property
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                All original anime-inspired artwork, typography, logos, and website design components belong exclusively to AnimeWear. Un-authorized reproduction, distribution, or commercial use is strictly prohibited.
              </p>
            </section>
          </motion.div>
        );

      case 'cookie':
        return (
          <motion.div
            key="cookie"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-8 border shadow-sm space-y-8 text-primary"
          >
            <div className="border-b pb-6">
              <span className="bg-accent/10 text-accent font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Browser Data</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-primary">Cookie Policy</h2>
              <p className="text-gray-400 text-xs mt-1">Last Updated: January 1, 2025</p>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              This Cookie Policy explains how AnimeWear uses cookies and similar browser storage technologies to recognize you when you visit our website.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-2xl border">
                <h4 className="font-semibold text-base mb-2 text-primary flex items-center gap-2">
                  <span className="text-accent">●</span> Essential Cookies
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Necessary for core site functionality like session management, shopping cart persistence, and secure checkout authentication.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border">
                <h4 className="font-semibold text-base mb-2 text-primary flex items-center gap-2">
                  <span className="text-accent">●</span> Preference Cookies
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Remember your preferred clothing size filters, currency displays, and recent product searches.
                </p>
              </div>
            </div>

            <section className="space-y-3 bg-accent/5 p-6 rounded-2xl border border-accent/20">
              <h3 className="font-semibold text-base text-primary">Managing Your Cookie Preferences</h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                You can block or delete cookies by adjusting your browser settings. However, disabling essential cookies may impact your ability to place orders or save items in your shopping cart.
              </p>
            </section>
          </motion.div>
        );

      case 'privacy':
      default:
        return (
          <motion.div
            key="privacy"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-3xl p-8 border shadow-sm space-y-8 text-primary"
          >
            <div className="border-b pb-6">
              <span className="bg-accent/10 text-accent font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">Data Protection</span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-primary">Privacy Policy</h2>
              <p className="text-gray-400 text-xs mt-1">Last Updated: January 1, 2025</p>
            </div>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">1</span>
                Information We Collect
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We collect personal information that you provide when placing an order, creating an account, or subscribing to updates. This includes your name, shipping address, email address, phone number, and payment verification data.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">2</span>
                How We Use Your Data
              </h3>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 leading-relaxed">
                <li>To process and deliver your apparel orders.</li>
                <li>To send order confirmation and real-time shipping tracking alerts.</li>
                <li>To process returns, refunds, and support ticket inquiries.</li>
                <li>To protect against fraudulent transactions.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold">3</span>
                Data Security
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your personal details are encrypted using industry-standard SSL technology. Payment gateway authentication is handled directly by certified partners (Razorpay / Firebase Auth). We never store raw credit card credentials on our servers.
              </p>
            </section>
          </motion.div>
        );
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary text-white rounded-3xl p-8 md:p-12 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-xl">
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Legal Information</span>
            <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-4">Policies & Guidelines</h1>
            <p className="text-gray-300">
              Read our Privacy Policy, Terms of Service, and Cookie Policy to understand how we operate and protect your data.
            </p>
          </div>
        </motion.div>

        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white p-2.5 rounded-2xl border shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLegalTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                currentTab === tab.id
                  ? 'bg-accent text-white shadow-lg shadow-accent/20'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LegalPage;
