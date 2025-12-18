
import React, { useEffect } from 'react';
import { Product } from '../types';

interface CartConfirmationProps {
  product: Product;
  onClose: () => void;
  cartTotal: number;
  cartCount: number;
  onViewCart: () => void;
  onCheckout: () => void;
}

const CartConfirmation: React.FC<CartConfirmationProps> = ({ 
  product, onClose, cartTotal, cartCount, onViewCart, onCheckout 
}) => {
  // Automatically close the popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/20 backdrop-blur-[2px] px-4 pointer-events-none">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top duration-300 pointer-events-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-green-600 text-xs">✓</span>
            <span>Added to your cart:</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        
        <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex gap-6 items-center flex-1">
            <img src={product.image} className="w-24 h-24 object-cover rounded shadow-sm border border-gray-100" alt={product.name} />
            <div>
              <h4 className="font-bold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-500">1 × Rs. {product.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto md:border-l border-gray-100 md:pl-8 flex flex-col gap-4">
            <div className="text-right md:text-left">
              <p className="text-gray-400 text-sm">Cart subtotal <span className="font-bold text-gray-800 ml-4">Rs. {cartTotal.toFixed(2)}</span></p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onViewCart} className="w-full py-2.5 border border-[#1d4d2b] text-[#1d4d2b] font-bold rounded-md hover:bg-gray-50 transition-colors">
                View cart ({cartCount})
              </button>
              <button onClick={onCheckout} className="w-full py-2.5 bg-[#1d4d2b] text-white font-bold rounded-md hover:bg-[#1d4d2b]/90 shadow-lg shadow-green-900/20 transition-colors">
                Checkout
              </button>
            </div>
          </div>
        </div>
        {/* Progress bar for auto-close */}
        <div className="h-1 bg-gray-100 w-full">
          <div className="h-full bg-green-500 animate-shrink-width origin-left" style={{ animationDuration: '3000ms', animationTimingFunction: 'linear' }} />
        </div>
      </div>
    </div>
  );
};

export default CartConfirmation;
