import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Icons } from './Icons';

const CartSidebar = () => {
  const { showCart, setShowCart, cart, updateCartQuantity, removeFromCart, showToast, setCurrentPage } = useAppContext();

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 1499 ? 0 : 99;
  const total = subtotal + shipping;

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowCart(false)}
      />

      {/* Sidebar */}
      <div className="relative z-[100] w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-display font-bold text-xl">Shopping Cart ({cart.length})</h2>
          <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
            <Icons.Close />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Icons.Cart />
              </div>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={() => {
                  setShowCart(false);
                  setCurrentPage('shop');
                }}
                className="btn-primary text-white px-6 py-3 rounded-xl font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.size}-${item.color}`}
                className="flex gap-4 bg-gray-55 rounded-xl p-4 border border-gray-100 bg-gray-50"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.product.title}</h3>
                  <p className="text-sm text-gray-500">{item.size} / {item.color}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-white rounded-lg border">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="qty-btn p-1.5 rounded-l-lg"
                      >
                        <Icons.Minus />
                      </button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="qty-btn p-1.5 rounded-r-lg"
                      >
                        <Icons.Plus />
                      </button>
                    </div>
                    <span className="font-semibold">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                  className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Icons.Trash />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 1499 && (
                <p className="text-xs text-accent">Add ₹{(1499 - subtotal).toFixed(2)} more for free shipping!</p>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCart(false);
                setCurrentPage('checkout');
                showToast('Proceeding to checkout...', 'info');
              }}
              className="btn-primary w-full text-white py-4 rounded-xl font-semibold text-lg"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => setShowCart(false)}
              className="w-full py-3 text-gray-600 hover:text-primary transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
