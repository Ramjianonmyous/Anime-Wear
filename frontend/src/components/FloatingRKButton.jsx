import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const FloatingRKButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCurrentPage, setActiveSupportTab } = useAppContext();
  const cardRef = useRef(null);

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleContactClick = () => {
    setIsOpen(false);
    // Scroll smoothly to footer contact section
    const footerContact = document.getElementById('footer-contact') || document.getElementById('footer');
    if (footerContact) {
      footerContact.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div ref={cardRef} className="fixed bottom-6 right-6 z-[99] flex flex-col items-end">
      {/* Expanded Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-3 w-80 bg-white/95 backdrop-blur-xl border border-black/10 rounded-2xl p-5 shadow-2xl text-slate-900 relative overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-500 hover:text-black p-1 rounded-lg hover:bg-black/5 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center font-display font-bold text-white shadow-md shadow-accent/30 text-base shrink-0">
                RK
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-black leading-tight">
                  Made by Ram Kaithwas
                </h4>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-accent/20">
                  Full Stack Developer
                </span>
              </div>
            </div>

            {/* Tech & Integration Details */}
            <div className="space-y-2.5 mb-4 text-xs">
              <div className="bg-accent/10 border border-accent/30 p-3 rounded-xl shadow-sm">
                <p className="text-[12px] font-bold text-slate-900 leading-relaxed">
                  E-Commerce Website for Anime Lovers
                </p>
              </div>
              
              <div className="bg-slate-100/90 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 text-black font-semibold">
                  <span className="text-sm">🔥</span>
                  <span>Firebase Authentication Integration</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <span className="text-sm">💳</span>
                  <span>Payment Gateway Integration (Razorpay)</span>
                </div>
                <div className="flex items-center gap-2 text-black font-semibold">
                  <span className="text-sm">⚡</span>
                  <span>MERN Stack (React, Node, Express, MongoDB)</span>
                </div>
              </div>
            </div>

            {/* Contact Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContactClick}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-accent/25 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.625c0-1.036.84-1.875 1.875-1.875h3.078c.537 0 1.017.3 1.24.79l1.14 2.508c.21.463.09 1.014-.287 1.346L7.79 10.87c1.358 2.68 3.555 4.878 6.235 6.235l1.244-1.25c.332-.377.883-.497 1.346-.287l2.508 1.14c.49.223.79.703.79 1.24v3.078c0 1.036-.84 1.875-1.875 1.875h-3.078c-9.256 0-16.75-7.494-16.75-16.75V6.625Z" />
              </svg>
              Contact
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Developer Info - Ram Kaithwas"
        className={`w-13 h-13 rounded-full flex items-center justify-center font-display font-black text-white text-base shadow-xl transition-all duration-300 relative border-2 ${
          isOpen
            ? 'bg-slate-900 border-accent text-accent shadow-accent/20'
            : 'bg-accent border-white/20 shadow-accent/40 hover:shadow-accent/60'
        }`}
        style={{ width: '52px', height: '52px' }}
      >
        <span className="tracking-tighter">RK</span>

        {/* Pulse Indicator Ring */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingRKButton;
