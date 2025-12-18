
import React from 'react';
import { CartItem } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  total: number;
  onPay: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, total, onPay, onUpdateQuantity, onRemove }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-16">
      {/* Form Side */}
      <div className="flex-1 space-y-12">
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Contact</h3>
            <button className="text-xs font-bold text-[#1d4d2b] underline">Sign in</button>
          </div>
          <input type="text" placeholder="Email or mobile phone number" className="w-full p-4 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#1d4d2b]" />
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
            <input type="checkbox" id="news" defaultChecked />
            <label htmlFor="news">Email me with news and offers</label>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Delivery</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">Country/Region</label>
                <select className="w-full p-4 border border-gray-200 rounded-lg bg-white">
                  <option>India</option>
                </select>
             </div>
             <input type="text" placeholder="First name" className="p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="Last name" className="p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="Address" className="md:col-span-2 p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="City" className="p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="State" className="p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="PIN code" className="p-4 border border-gray-200 rounded-lg" />
             <input type="text" placeholder="Phone" className="md:col-span-2 p-4 border border-gray-200 rounded-lg" />
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-6">Payment</h3>
          <p className="text-sm text-gray-500 mb-4">All transactions are secure and encrypted.</p>
          <div className="border border-blue-200 bg-blue-50/20 rounded-xl p-6">
             <div className="flex justify-between items-center mb-6">
               <span className="font-bold text-gray-800">Razorpay Secure (UPI, Cards, Int'l Cards)</span>
               <div className="flex gap-1">
                 <img src="https://cdn.razorpay.com/static/assets/logo/payment_method/upi.svg" className="h-4" alt="upi" />
                 <img src="https://cdn.razorpay.com/static/assets/logo/payment_method/visa.svg" className="h-4" alt="visa" />
                 <img src="https://cdn.razorpay.com/static/assets/logo/payment_method/mastercard.svg" className="h-4" alt="mc" />
               </div>
             </div>
             <div className="bg-white border border-gray-100 rounded p-8 text-center text-sm text-gray-400 italic">
                You will be redirected to Razorpay to complete your purchase securely.
             </div>
          </div>
          <button 
            onClick={onPay}
            className="w-full mt-8 bg-[#1d4d2b] text-white py-5 rounded-xl font-black text-lg hover:bg-[#1d4d2b]/95 shadow-xl shadow-green-900/20"
          >
            Pay now
          </button>
        </section>
      </div>

      {/* Summary Side */}
      <div className="w-full lg:w-[450px] bg-gray-50/50 p-8 rounded-2xl h-fit border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-8 pb-4 border-b border-gray-200">Order Summary</h3>
        
        {cart.length === 0 ? (
          <p className="text-sm text-gray-400 italic py-4">Your cart is empty.</p>
        ) : (
          <div className="space-y-8">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-start group">
                <div className="relative flex-shrink-0">
                  <img src={item.image} className="w-20 h-20 rounded-lg object-cover border border-gray-200" alt={item.name} />
                  <span className="absolute -top-2 -right-2 bg-[#1d4d2b] text-white w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-bold border-2 border-white shadow-sm">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="text-sm font-bold text-gray-800 leading-tight">{item.name}</h5>
                    <span className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3">{item.weight}</p>
                  
                  {/* Quantity and Remove Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white overflow-hidden">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-1 text-gray-400 hover:text-[#1d4d2b] hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-[11px] font-bold border-x border-gray-100 text-gray-700 min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-1 text-gray-400 hover:text-[#1d4d2b] hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-200 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-gray-800">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-[11px] text-[#1d4d2b] bg-green-50 px-2 py-1 rounded font-bold">Free for heritage orders</span>
          </div>
          <div className="flex justify-between text-xl font-black text-gray-900 pt-6 border-t border-gray-200">
            <span>Total</span>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold mr-2 uppercase tracking-widest">INR</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutView;
