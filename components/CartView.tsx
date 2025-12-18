
import React from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ items, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 max-w-4xl mx-auto mt-10">
        <div className="text-6xl mb-6 opacity-20">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any sweets yet.</p>
        <button 
          onClick={() => window.location.reload()} // Simple refresh to go home
          className="bg-[#1d4d2b] text-white px-8 py-3 rounded-full font-bold"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-black text-gray-900 mb-10 pb-6 border-b border-gray-100">Shopping Cart</h2>
      
      <div className="space-y-8">
        {items.map(item => (
          <div key={item.id} className="flex flex-col md:flex-row items-center gap-8 py-6 border-b border-gray-50 last:border-0 group">
            {/* Product Image */}
            <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={item.name} />
            </div>

            {/* Product Details */}
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h4>
              <p className="text-sm text-gray-400 font-medium">{item.weight}</p>
            </div>

            {/* Controls & Price */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {/* Quantity Controls */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400">Qty:</span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1d4d2b] hover:bg-gray-50 transition-colors font-bold text-lg"
                  >
                    −
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-black text-gray-800 border-x border-gray-100">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#1d4d2b] hover:bg-gray-50 transition-colors font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price for Item */}
              <div className="min-w-[120px] text-center md:text-right">
                <span className="text-xl font-black text-[#1d4d2b]">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              {/* Remove Link */}
              <button 
                onClick={() => onRemove(item.id)}
                className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors"
              >
                REMOVE
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtotal & Checkout Section */}
      <div className="mt-12 flex flex-col items-end gap-6 pt-10 border-t border-gray-200">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
          <p className="text-5xl font-black text-gray-900">
            Rs. {total.toFixed(2)}
          </p>
        </div>
        <button 
          onClick={onCheckout}
          className="bg-[#1d4d2b] text-white px-16 py-5 rounded-xl font-black text-lg hover:bg-[#1d4d2b]/95 transition-all shadow-xl shadow-green-900/20 active:scale-95"
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default CartView;
