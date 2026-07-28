import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icons } from './Icons';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`toast px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-accent'
      } text-white`}
    >
      {type === 'success' && <Icons.Check />}
      <span className="font-medium">{message}</span>
    </motion.div>
  );
};

export default Toast;
