import React from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';
import { useAppContext } from '../context/AppContext';

const Footer = () => {
  const { setCurrentPage, setSelectedCategory, setShopFilter, setActiveSupportTab, setActiveLegalTab, showToast } = useAppContext();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Welcome to AnimeWear Otaku Club! Check your inbox for your 10% discount code.', 'success');
    setNewsletterEmail('');
  };

  const footerLinks = {
    Shop: ['New Arrivals', 'Best Sellers', 'Sale', 'Collections', 'Gift Cards'],
    Support: ['Contact Us', 'FAQs', 'Shipping', 'Returns', 'Size Guide'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
  };

  const socialLinks = [
    { Icon: Icons.Globe || Icons.Portfolio, href: import.meta.env.VITE_PORTFOLIO_URL || "https://reviewhub-gamma.vercel.app/", label: "ReviewHub" },
    { Icon: Icons.LinkedIn, href: import.meta.env.VITE_LINKEDIN_URL || "https://www.linkedin.com/in/ram-kaithwas-329419257/", label: "LinkedIn" },
    { Icon: Icons.GitHub, href: import.meta.env.VITE_GITHUB_URL || "https://github.com/Ramjianonmyous", label: "GitHub" }
  ];

  const marqueeItems = [
    { name: 'Razorpay', icon: <Icons.Razorpay /> },
    { name: 'Stripe', icon: <Icons.Stripe /> },
    { name: 'Visa', icon: <Icons.Visa /> },
    { name: 'Mastercard', icon: <Icons.Mastercard /> },
    { name: 'PayPal', icon: <Icons.PayPal /> },
    { 
      name: '100% Easy Returns', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      )
    },
    { 
      name: 'Verified Trusted Brand', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
      )
    },
    { 
      name: '256-Bit SSL Encrypted', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-sky-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      )
    },
    { 
      name: 'ISO 9001 Certified', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      )
    }
  ];

  const handleLinkClick = (e, category, name) => {
    e.preventDefault();

    if (category === 'Shop') {
      setCurrentPage('shop');
      setSelectedCategory('All');
      if (name === 'New Arrivals') {
        setShopFilter('new');
      } else if (name === 'Sale') {
        setShopFilter('sale');
      } else if (name === 'Best Sellers') {
        setShopFilter('bestsellers');
      } else if (name === 'Gift Cards') {
        setCurrentPage('support');
        setActiveSupportTab('faq');
      } else {
        setShopFilter('all');
      }
    } else if (category === 'Support') {
      setCurrentPage('support');
      if (name === 'Shipping') {
        setActiveSupportTab('shipping');
      } else if (name === 'Returns') {
        setActiveSupportTab('returns');
      } else if (name === 'Size Guide') {
        setActiveSupportTab('size');
      } else if (name === 'FAQs') {
        setActiveSupportTab('faq');
      } else if (name === 'Contact Us') {
        setActiveSupportTab('contact');
      }
    } else if (category === 'Legal') {
      setCurrentPage('legal');
      if (name === 'Terms of Service') {
        setActiveLegalTab('terms');
      } else if (name === 'Cookie Policy') {
        setActiveLegalTab('cookie');
      } else {
        setActiveLegalTab('privacy');
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);
  };

  return (
    <footer id="footer" className="bg-primary text-white border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Location */}
          <div className="col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="text-white font-display font-bold text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl">
                ANIME<span className="text-accent">WEAR</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium anime-inspired clothing for fans who want to express their passion with style.
            </p>

            {/* Social Icons */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, rotate: 5, color: '#FF5A1F' }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-accent transition-all duration-300"
                >
                  <Icon />
                </motion.a>
              ))}
            </div>

            {/* Location & Contact Card */}
            <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400 w-full shadow-sm">
              <div className="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-accent shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-0.5">Business Location</p>
                  <p className="leading-relaxed text-[11px]">CIDCO Colony,<br />Aurangabad, India</p>
                </div>
              </div>
              
              <div className="h-px bg-white/10 w-full"></div>

              <div id="footer-contact" className="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-accent shrink-0 mt-0.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.625c0-1.036.84-1.875 1.875-1.875h3.078c.537 0 1.017.3 1.24.79l1.14 2.508c.21.463.09 1.014-.287 1.346L7.79 10.87c1.358 2.68 3.555 4.878 6.235 6.235l1.244-1.25c.332-.377.883-.497 1.346-.287l2.508 1.14c.49.223.79.703.79 1.24v3.078c0 1.036-.84 1.875-1.875 1.875h-3.078c-9.256 0-16.75-7.494-16.75-16.75V6.625Z" />
                </svg>
                <div>
                  <p className="font-semibold text-white mb-0.5">Contact Store</p>
                  <p className="leading-relaxed text-[11px] hover:text-accent transition-colors">
                    <a href="tel:+919876543210">+91 98765 43210</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Columns Area (Shop, Support, Legal + Developer Banner + Payments Marquee) */}
          <div className="col-span-1 md:col-span-3 space-y-8">
            {/* Links Columns (Shop, Support, Legal) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h4 className="font-semibold text-white tracking-wider uppercase text-xs mb-5 font-display">{title}</h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link}>
                        <motion.a 
                          href="#" 
                          onClick={(e) => handleLinkClick(e, title, link)}
                          whileHover={{ x: 3, color: '#FF5A1F' }}
                          className="text-gray-400 hover:text-accent text-sm transition-colors duration-200 block"
                        >
                          {link}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Developer Info & Contribute Banner */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left Side: Developer Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 font-bold text-lg shadow-inner">
                    RK
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-display font-bold text-lg text-white">Ram Kaithwas</h4>
                      <span className="bg-accent/20 text-accent text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Dev</span>
                    </div>
                    <p className="text-gray-300 text-xs font-medium">MERN Stack Developer | Cloud & IT Support</p>
                    <p className="text-gray-400 text-[11px] mt-0.5">Building high-performance full-stack applications with React & Node.js.</p>
                  </div>
                </div>

                {/* Right Side: About Me & Contribute Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                  <motion.a
                    href={import.meta.env.VITE_ABOUT_URL || "https://portfolio-2-0-kohl-five.vercel.app/#about"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-accent">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                    About Me
                  </motion.a>

                  <motion.a
                    href={import.meta.env.VITE_GITHUB_URL || "https://github.com/Ramjianonmyous"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all"
                  >
                    <Icons.GitHub />
                    Contribute
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Guarantees & Perks Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <p className="text-xs font-semibold text-white">Express Shipping</p>
                  <p className="text-[10px] text-gray-400">Free delivery on orders over ₹1,499</p>
                </div>
              </div>
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <p className="text-xs font-semibold text-white">Premium Quality</p>
                  <p className="text-[10px] text-gray-400">240+ GSM Heavyweight Cotton</p>
                </div>
              </div>
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <span className="text-xl">🔄</span>
                <div>
                  <p className="text-xs font-semibold text-white">Hassle-Free Returns</p>
                  <p className="text-[10px] text-gray-400">14-day easy return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Expanded Payment & Security Marquee Box (Spans 100% across to far left) */}
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden w-full mb-8">
          <div className="flex items-center gap-2 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">Trust & Security:</span>
          </div>

          {/* Marquee Track Container with Edge Fades & Slow Duration */}
          <div className="w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <motion.div
              className="flex items-center gap-4 w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{
                duration: 35,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {/* Set 1 */}
              <div className="flex items-center gap-4 shrink-0">
                {marqueeItems.map((item, idx) => (
                  <div key={`set1-${idx}`} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all duration-300 cursor-pointer">
                    {item.icon}
                    <span className="text-xs font-semibold text-gray-200 whitespace-nowrap">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Set 2 (Duplicate for Infinite Loop) */}
              <div className="flex items-center gap-4 shrink-0">
                {marqueeItems.map((item, idx) => (
                  <div key={`set2-${idx}`} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all duration-300 cursor-pointer">
                    {item.icon}
                    <span className="text-xs font-semibold text-gray-200 whitespace-nowrap">{item.name}</span>
                  </div>
                ))}
              </div>

              {/* Set 3 (Buffer for Ultra-Wide Screens) */}
              <div className="flex items-center gap-4 shrink-0">
                {marqueeItems.map((item, idx) => (
                  <div key={`set3-${idx}`} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all duration-300 cursor-pointer">
                    {item.icon}
                    <span className="text-xs font-semibold text-gray-200 whitespace-nowrap">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <hr className="border-white/10 my-8" />

        {/* Bottom Bar — Trademark Only */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">
          <p>© 2025 AnimeWear™. All rights reserved.</p>
          <p className="text-[11px] text-gray-600">Registered Trademark • Designed & Built for Anime Clothing Fans</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
