import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/Icons';
import { useAppContext } from '../context/AppContext';

const SupportPage = () => {
  const { isLoggedIn, user, showToast, activeSupportTab, setActiveSupportTab } = useAppContext();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Order Issues');
  const [description, setDescription] = useState('');
  const [ticketRaised, setTicketRaised] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const faqRef = useRef(null);
  const ticketRef = useRef(null);

  useEffect(() => {
    if (activeSupportTab === 'faq') {
      faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (activeSupportTab === 'contact') {
      ticketRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSupportTab]);

  const currentTab = ['shipping', 'returns', 'size'].includes(activeSupportTab) ? activeSupportTab : 'shipping';

  const tabs = [
    {
      id: 'shipping',
      label: 'Shipping Details',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124l-.233-3.707a2.977 2.977 0 0 0-1.2-2.124l-2.25-1.8A2.25 2.25 0 0 0 13.875 5.25H12V14.25M2.25 14.25h16.5M12 14.25V5.25" />
        </svg>
      )
    },
    {
      id: 'returns',
      label: 'Return Procedure',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
      )
    },
    {
      id: 'size',
      label: 'Size Guide',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v16.5m16.5-16.5v16.5m-16.5-12h3m-3 3h3m-3 3h3m-3 3h3m7.5-12v12m3-12v12m3-12v12M9 3.75h1.5M9 20.25h1.5" />
        </svg>
      )
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !description) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const newTicketNum = `TK-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketNumber(newTicketNum);
    setTicketRaised(true);
    showToast(`Support Ticket ${newTicketNum} raised successfully!`, 'success');
  };

  const faqs = [
    { q: 'How do I track my active order?', a: 'You can track your order by clicking the "Track Order" link in the top bar. If logged in, this routes directly to your profile order history timeline.' },
    { q: 'What is your returns policy?', a: 'We accept returns on all apparel within 14 days of delivery. Items must be unworn with tags attached. Returns are free on order issues.' },
    { q: 'How long does shipping take?', a: 'Standard shipping takes 3-5 business days across India. Orders to Maharashtra hubs (like Aurangabad) are typically delivered within 2-3 days.' },
    { q: 'Do you offer COD (Cash on Delivery)?', a: 'Yes! We support Cash on Delivery, credit/debit cards, net banking, and PayPal secure payments.' }
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'returns':
        return (
          <motion.div
            key="returns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-sm text-primary"
          >
            <div className="bg-green-50/50 p-6 rounded-2xl border border-green-100">
              <h4 className="font-semibold text-base mb-3 text-green-800 flex items-center gap-2">
                <span>✓</span> 14-Day Hassle-Free Returns & Exchanges
              </h4>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                We accept returns or size exchanges on all apparel items within <strong>14 days of delivery</strong>. Items must be in their original, unwashed, unworn condition with all product tags intact.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-2">
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                  <span className="font-bold text-green-600 text-sm block mb-1">Step 1</span>
                  <p className="text-gray-500 text-xs leading-normal">
                    Scroll to the <strong>Raise a Ticket</strong> section below.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                  <span className="font-bold text-green-600 text-sm block mb-1">Step 2</span>
                  <p className="text-gray-500 text-xs leading-normal">
                    Select <strong>Return & Refund</strong> category and submit ticket.
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                  <span className="font-bold text-green-600 text-sm block mb-1">Step 3</span>
                  <p className="text-gray-500 text-xs leading-normal">
                    Courier partner picks it up within <strong>24-48 hours</strong> at no charge.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'size':
        return (
          <motion.div
            key="size"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-primary"
          >
            <div className="bg-white rounded-2xl border p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-base">Oversized Fit Size Chart</h4>
                  <p className="text-xs text-gray-400 mt-0.5">All measurements are in inches. Standard drop-shoulder streetwear fit.</p>
                </div>
                <span className="bg-accent/10 text-accent font-semibold text-xs px-3 py-1 rounded-full">
                  Loose Streetwear Fit
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-500 font-semibold">
                      <th className="py-3 px-4 rounded-l-lg">Size</th>
                      <th className="py-3 px-4">Chest (in)</th>
                      <th className="py-3 px-4">Length (in)</th>
                      <th className="py-3 px-4">Shoulder (in)</th>
                      <th className="py-3 px-4 rounded-r-lg">Sleeve (in)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3.5 px-4 font-bold">S</td>
                      <td className="py-3.5 px-4">38"</td>
                      <td className="py-3.5 px-4">27"</td>
                      <td className="py-3.5 px-4">18.5"</td>
                      <td className="py-3.5 px-4">8.5"</td>
                    </tr>
                    <tr className="bg-gray-50/30">
                      <td className="py-3.5 px-4 font-bold">M</td>
                      <td className="py-3.5 px-4">40"</td>
                      <td className="py-3.5 px-4">28"</td>
                      <td className="py-3.5 px-4">19.5"</td>
                      <td className="py-3.5 px-4">9.0"</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold">L</td>
                      <td className="py-3.5 px-4">42"</td>
                      <td className="py-3.5 px-4">29"</td>
                      <td className="py-3.5 px-4">20.5"</td>
                      <td className="py-3.5 px-4">9.5"</td>
                    </tr>
                    <tr className="bg-gray-50/30">
                      <td className="py-3.5 px-4 font-bold">XL</td>
                      <td className="py-3.5 px-4">44"</td>
                      <td className="py-3.5 px-4">30"</td>
                      <td className="py-3.5 px-4">21.5"</td>
                      <td className="py-3.5 px-4">10.0"</td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-bold">XXL</td>
                      <td className="py-3.5 px-4">46"</td>
                      <td className="py-3.5 px-4">31"</td>
                      <td className="py-3.5 px-4">22.5"</td>
                      <td className="py-3.5 px-4">10.5"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-400 text-[10px] mt-4 leading-normal">
                *Note: Our fits are designed to be modern drop-shoulder oversized. If you prefer a regular fit, we recommend ordering one size smaller than your usual.
              </p>
            </div>
          </motion.div>
        );
      case 'shipping':
      default:
        return (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid md:grid-cols-3 gap-6 text-sm text-primary"
          >
            <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-2xl mb-3 block">₹</span>
                <h4 className="font-semibold text-base mb-2">Shipping Charges</h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  Get <strong>Free Standard Shipping</strong> on all orders above ₹1,499. For orders under ₹1,499, a flat shipping rate of ₹99 is applied at checkout.
                </p>
              </div>
            </div>
            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-2xl mb-3 block">🕒</span>
                <h4 className="font-semibold text-base mb-2">Delivery Timelines</h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  Standard shipping takes <strong>3-5 business days</strong> across India. Orders to Maharashtra hubs (like Aurangabad) are typically delivered within <strong>2-3 days</strong>.
                </p>
              </div>
            </div>
            <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-2xl mb-3 block">📍</span>
                <h4 className="font-semibold text-base mb-2">Order Tracking</h4>
                <p className="text-gray-500 leading-relaxed text-xs">
                  As soon as your package is dispatched, we send a tracking link via SMS & Email. You can also track it directly under the <strong>Track Order</strong> tab at the top.
                </p>
              </div>
            </div>
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
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">Help & Support</span>
            <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-4">How can we help you?</h1>
            <p className="text-gray-300">
              Raise a support ticket, browse frequently asked questions, or get in touch with our customer service team.
            </p>
          </div>
        </motion.div>

        {/* Helpful Resources Tabs at the Top */}
        <div className="mb-10 bg-white rounded-3xl p-6 border shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 mb-6 justify-between items-start md:items-center">
            <div>
              <h2 className="font-display font-bold text-xl text-primary">Quick Help Resources</h2>
              <p className="text-gray-400 text-xs mt-1">Get immediate answers about shipping, returns, and sizes.</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSupportTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    currentTab === tab.id
                      ? 'bg-accent text-white shadow-lg shadow-accent/20'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* FAQ Column */}
          <div ref={faqRef} className="md:col-span-1 space-y-4 scroll-mt-28">
            <h3 className="font-display font-bold text-lg text-primary mb-2 flex items-center gap-2">
              <span className="text-accent">★</span> Quick FAQs
            </h3>
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 border shadow-sm">
                <p className="font-semibold text-primary text-sm mb-2">{faq.q}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Ticket Form Column */}
          <div ref={ticketRef} className="md:col-span-2 scroll-mt-28">
            <AnimatePresence mode="wait">
              {!ticketRaised ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl p-8 border shadow-sm"
                >
                  <h3 className="font-display font-bold text-xl text-primary mb-6">Raise a Support Ticket</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border focus:border-accent bg-gray-50 text-gray-500 cursor-not-allowed"
                          value={isLoggedIn ? "John Doe" : "Guest Customer"}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-primary">Email Address</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 rounded-xl border focus:border-accent bg-gray-50 text-gray-500 cursor-not-allowed"
                          value={isLoggedIn ? (user?.email || 'your@email.com') : 'customer@example.com'}
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">Problem Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border focus:border-accent outline-none bg-white text-primary"
                      >
                        <option value="Order Issues">Order Issues (Cancellation, Changes)</option>
                        <option value="Delivery Tracking">Delivery Tracking (In Transit status)</option>
                        <option value="Return & Refund">Return & Refund</option>
                        <option value="Product Quality">Product Quality / Printing</option>
                        <option value="Other">Other / General Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">Subject <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="Brief summary of the issue..."
                        className="w-full px-4 py-3 rounded-xl border focus:border-accent"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-primary">Detailed Description <span className="text-red-500">*</span></label>
                      <textarea
                        rows={5}
                        placeholder="Please describe your issue in detail. If referencing an order, specify the Order Number..."
                        className="w-full px-4 py-3 rounded-xl border focus:border-accent resize-none"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full btn-primary text-white py-4 rounded-xl font-semibold mt-4"
                    >
                      Submit Support Ticket
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-8 border border-green-200 shadow-sm text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-2xl text-primary mb-2">Ticket Submitted!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Support Ticket <span className="font-bold text-accent">{ticketNumber}</span> has been successfully raised.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-5 border text-left space-y-2 max-w-md mx-auto text-sm text-gray-600">
                    <p><strong>Category:</strong> {category}</p>
                    <p><strong>Subject:</strong> {subject}</p>
                    <p><strong>Status:</strong> Open (Pending Agent Assignment)</p>
                    <p><strong>Response Time:</strong> We will contact you at <strong>{isLoggedIn ? (user?.email || 'your account email') : 'customer@example.com'}</strong> within 2-4 hours.</p>
                  </div>
                  <button
                    onClick={() => {
                      setTicketRaised(false);
                      setSubject('');
                      setDescription('');
                    }}
                    className="px-6 py-3 border rounded-xl font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Raise Another Ticket
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
